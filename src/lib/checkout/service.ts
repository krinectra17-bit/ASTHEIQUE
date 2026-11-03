import { getAdminClient } from '@/lib/supabase/admin';
import { calculateCartPricing } from '@/lib/pricing/engine';
import { validateCoupon, recordCouponRedemption } from '@/lib/coupons/service';
import { reserveStock, commitStock, releaseStock } from '@/lib/inventory/service';
import { PRODUCTS } from '@/lib/data/mock-catalog';
import { Order, OrderItem, UserAddress, CartItem } from '@/types';

export interface CreateOrderRequest {
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }[];
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  paymentMethod: 'RAZORPAY' | 'COD';
  couponCode?: string | null;
  customerEmail: string;
  customerPhone: string;
  userId?: string | null;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  currency?: string;
  error?: string;
  isCod?: boolean;
  isRazorpay?: boolean;
}

// In-memory order storage fallback for local development and instant tracking preview
export const localOrdersStore = new Map<string, Order>();

// Pre-seed an example order so the demo tracking page works out-of-the-box
localOrdersStore.set('AES-2026-98124', {
  id: 'ord_demo_01',
  orderNumber: 'AES-2026-98124',
  userId: null,
  customerEmail: 'ananya.sharma@example.com',
  customerPhone: '+91 98710 24500',
  status: 'SHIPPED',
  paymentStatus: 'PAID',
  fulfillmentStatus: 'PROCESSING',
  currency: 'INR',
  subtotalAmount: 3499,
  discountAmount: 0,
  taxAmount: 533.75,
  shippingFee: 0,
  totalAmount: 3499,
  paymentMethod: 'RAZORPAY',
  shippingAddress: {
    id: 'addr_demo',
    fullName: 'Ananya Sharma',
    mobile: '9871024500',
    houseNumber: '42-B, Magnolia Court',
    street: 'Golf Course Road, DLF Phase 5',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    addressType: 'home',
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  billingAddress: {
    id: 'addr_demo',
    fullName: 'Ananya Sharma',
    mobile: '9871024500',
    houseNumber: '42-B, Magnolia Court',
    street: 'Golf Course Road, DLF Phase 5',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    addressType: 'home',
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  items: [
    {
      id: 'item_demo_01',
      productId: 'p0000001-0000-0000-0000-000000000001',
      productName: 'Solace Sculptural Ceramic Vase',
      variantName: 'Ivory Stoneware',
      sku: 'AES-VASE-01',
      unitPrice: 3499,
      quantity: 1,
      totalPrice: 3499,
      imageUrl:
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
    },
  ],
  shipment: {
    courierName: 'Blue Dart Air Express',
    awbCode: 'BLUEDART-8829104',
    status: 'In Transit - Out for Delivery Today',
    trackingUrl: 'https://shiprocket.co/tracking/BLUEDART-8829104',
    estimatedDelivery: 'Tomorrow by 2:00 PM',
  },
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Creates an order with strict server-authoritative pricing and inventory check
 */
export async function createOrder(
  req: CreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    if (!req.items || req.items.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    if (!req.customerEmail || !req.customerPhone) {
      return { success: false, error: 'Customer email and phone are required' };
    }

    if (!req.shippingAddress || !req.shippingAddress.pincode) {
      return { success: false, error: 'Valid shipping address is required' };
    }

    const admin = getAdminClient();

    // 1. Resolve product details and server-authoritative prices
    const resolvedCartItems: CartItem[] = [];

    for (const item of req.items) {
      let productData: any = null;
      let variantData: any = null;

      if (admin) {
        try {
          const { data: p } = await admin
            .from('products')
            .select('*, product_variants(*), product_images(*)')
            .eq('id', item.productId)
            .single();

          if (p) {
            productData = p;
            if (item.variantId) {
              variantData = p.product_variants?.find((v: any) => v.id === item.variantId);
            }
          }
        } catch {
          // Fall through to mock catalog
        }
      }

      if (!productData) {
        const mockP = PRODUCTS.find((p) => p.id === item.productId);
        if (!mockP) {
          return { success: false, error: `Product not found for ID: ${item.productId}` };
        }
        productData = mockP;
        if (item.variantId) {
          variantData = mockP.variants?.find((v) => v.id === item.variantId);
        }
      }

      const unitPrice =
        (productData.salePrice ?? productData.regularPrice ?? productData.regular_price) +
        (variantData?.priceAdjustment ?? variantData?.price_adjustment ?? 0);

      const primaryImg =
        variantData?.imageUrl ||
        variantData?.image_url ||
        productData.primaryImage ||
        productData.product_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80';

      resolvedCartItems.push({
        id: `cart_item_${item.productId}_${item.variantId || 'base'}`,
        productId: item.productId,
        variantId: item.variantId,
        productName: productData.name,
        variantName: variantData?.name || variantData?.variantValue || null,
        sku: variantData?.sku || productData.sku,
        unitPrice,
        quantity: item.quantity,
        imageUrl: primaryImg,
        maxStock: 25,
      });
    }

    // 2. Server-Side Coupon Validation
    let couponObj = null;
    if (req.couponCode) {
      const subtotalTemp = resolvedCartItems.reduce(
        (sum, it) => sum + it.unitPrice * it.quantity,
        0
      );
      const couponValidation = await validateCoupon(
        req.couponCode,
        subtotalTemp,
        req.userId || undefined
      );

      if (!couponValidation.valid) {
        return { success: false, error: couponValidation.message };
      }
      couponObj = couponValidation.coupon;
    }

    // 3. Compute Server-Authoritative Pricing Breakdown
    const pricing = calculateCartPricing(resolvedCartItems, couponObj);

    // 4. Reserve stock atomically
    const referenceId = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const reservation = await reserveStock(req.items, referenceId);
    if (!reservation.success) {
      return {
        success: false,
        error: reservation.error || 'One or more items are out of stock',
      };
    }

    // 5. Generate human-readable order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AES-${dateStr}-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;

    // 6. Build Order & OrderItems
    const orderItems: OrderItem[] = resolvedCartItems.map((ci) => ({
      id: `oi_${ci.productId}_${Date.now()}`,
      productId: ci.productId,
      variantId: ci.variantId,
      productName: ci.productName,
      variantName: ci.variantName,
      sku: ci.sku,
      unitPrice: ci.unitPrice,
      quantity: ci.quantity,
      totalPrice: ci.unitPrice * ci.quantity,
      imageUrl: ci.imageUrl,
    }));

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: req.userId || null,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone,
      status: req.paymentMethod === 'COD' ? 'PROCESSING' : 'PENDING',
      paymentStatus: req.paymentMethod === 'COD' ? 'UNPAID' : 'UNPAID',
      fulfillmentStatus: 'UNFULFILLED',
      currency: 'INR',
      subtotalAmount: pricing.subtotal,
      discountAmount: pricing.discount,
      taxAmount: pricing.taxAmount,
      shippingFee: pricing.shippingFee,
      totalAmount: pricing.total,
      paymentMethod: req.paymentMethod,
      shippingAddress: req.shippingAddress,
      billingAddress: req.billingAddress,
      items: orderItems,
      couponCode: req.couponCode || null,
      notes: req.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in memory for instant availability in tracking and account pages
    localOrdersStore.set(orderNumber, newOrder);
    localOrdersStore.set(orderId, newOrder);

    // 7. Persist to Supabase if admin client is available
    if (admin) {
      try {
        const { data: dbOrder, error: orderError } = await admin
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: req.userId || null,
            customer_email: req.customerEmail,
            customer_phone: req.customerPhone,
            status: newOrder.status,
            payment_status: newOrder.paymentStatus,
            fulfillment_status: newOrder.fulfillmentStatus,
            currency: 'INR',
            subtotal_amount: newOrder.subtotalAmount,
            discount_amount: newOrder.discountAmount,
            tax_amount: newOrder.taxAmount,
            shipping_fee: newOrder.shippingFee,
            total_amount: newOrder.totalAmount,
            payment_method: newOrder.paymentMethod,
            shipping_address: newOrder.shippingAddress,
            billing_address: newOrder.billingAddress,
            coupon_code: newOrder.couponCode,
            notes: newOrder.notes,
          })
          .select('id')
          .single();

        if (!orderError && dbOrder) {
          const dbOrderId = dbOrder.id;
          newOrder.id = dbOrderId;
          localOrdersStore.set(dbOrderId, newOrder);

          // Insert order items
          const itemRows = orderItems.map((oi) => ({
            order_id: dbOrderId,
            product_id: oi.productId,
            variant_id: oi.variantId || null,
            product_name: oi.productName,
            variant_name: oi.variantName || null,
            sku: oi.sku,
            unit_price: oi.unitPrice,
            quantity: oi.quantity,
            total_price: oi.totalPrice,
            image_url: oi.imageUrl,
          }));

          await admin.from('order_items').insert(itemRows);

          // If COD, commit stock and log redemption
          if (req.paymentMethod === 'COD') {
            await commitStock(req.items, dbOrderId);
            if (couponObj) {
              await recordCouponRedemption(
                couponObj.id,
                dbOrderId,
                pricing.discount,
                req.userId
              );
            }
          }
        }
      } catch {
        // Fallback store holds the order safely
      }
    } else {
      // If no admin client (mock mode), handle COD stock commit
      if (req.paymentMethod === 'COD') {
        await commitStock(req.items, orderId);
      }
    }

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber,
      totalAmount: pricing.total,
      currency: 'INR',
      isCod: req.paymentMethod === 'COD',
      isRazorpay: req.paymentMethod === 'RAZORPAY',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during order creation',
    };
  }
}

/**
 * Retrieves an order by orderNumber or ID (checks database first, then localOrdersStore)
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin
        .from('orders')
        .select('*, order_items(*), shipments(*, shipment_events(*))')
        .or(`order_number.eq.${orderNumber},id.eq.${orderNumber}`)
        .single();

      if (!error && data) {
        const shipmentData = data.shipments?.[0];
        return {
          id: data.id,
          orderNumber: data.order_number,
          userId: data.user_id,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          status: data.status,
          paymentStatus: data.payment_status,
          fulfillmentStatus: data.fulfillment_status,
          currency: data.currency,
          subtotalAmount: Number(data.subtotal_amount),
          discountAmount: Number(data.discount_amount),
          taxAmount: Number(data.tax_amount),
          shippingFee: Number(data.shipping_fee),
          totalAmount: Number(data.total_amount),
          paymentMethod: data.payment_method,
          shippingAddress: data.shipping_address,
          billingAddress: data.billing_address,
          items: (data.order_items || []).map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            variantId: it.variant_id,
            productName: it.product_name,
            variantName: it.variant_name,
            sku: it.sku,
            unitPrice: Number(it.unit_price),
            quantity: it.quantity,
            totalPrice: Number(it.total_price),
            imageUrl: it.image_url,
          })),
          couponCode: data.coupon_code,
          notes: data.notes,
          shipment: shipmentData
            ? {
                courierName: shipmentData.courier_name,
                awbCode: shipmentData.awb_code,
                status: shipmentData.status,
                trackingUrl: shipmentData.tracking_url,
                estimatedDelivery: shipmentData.estimated_delivery,
              }
            : undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fall through to local store
    }
  }

  return localOrdersStore.get(orderNumber) || null;
}
