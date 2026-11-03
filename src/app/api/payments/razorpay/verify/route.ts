import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay/client';
import { getOrderByNumber, localOrdersStore } from '@/lib/checkout/service';
import { commitStock } from '@/lib/inventory/service';
import { recordCouponRedemption } from '@/lib/coupons/service';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification details' },
        { status: 400 }
      );
    }

    // 1. Cryptographically verify signature
    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || '',
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Transaction could not be verified.' },
        { status: 400 }
      );
    }

    // 2. Fetch order
    const order = await getOrderByNumber(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    // 3. Update order in local store
    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';
    order.updatedAt = new Date().toISOString();
    localOrdersStore.set(order.orderNumber, order);
    localOrdersStore.set(order.id, order);

    // 4. Update Supabase if admin is connected
    const admin = getAdminClient();
    if (admin) {
      try {
        await admin
          .from('orders')
          .update({
            payment_status: 'PAID',
            status: 'PROCESSING',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        // Insert payment log
        await admin.from('payments').insert({
          order_id: order.id,
          payment_gateway: 'RAZORPAY',
          gateway_order_id: razorpayOrderId,
          gateway_payment_id: razorpayPaymentId,
          gateway_signature: razorpaySignature,
          amount: order.totalAmount,
          currency: 'INR',
          status: 'CAPTURED',
        });
      } catch {
        // Fallback store holds updated state
      }
    }

    // 5. Commit reserved inventory
    const stockItems = order.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId || null,
      quantity: i.quantity,
    }));
    await commitStock(stockItems, order.id);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      amount: order.totalAmount,
      paymentId: razorpayPaymentId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment verification failed',
      },
      { status: 500 }
    );
  }
}
