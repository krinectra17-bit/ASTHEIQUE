import { NextRequest, NextResponse } from 'next/server';
import { createShipment } from '@/lib/shiprocket/client';
import { getOrderByNumber, localOrdersStore } from '@/lib/checkout/service';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required orderId parameter' },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    const fullAddr = `${order.shippingAddress.houseNumber}, ${order.shippingAddress.street}, ${order.shippingAddress.area || ''}`;

    const shipment = await createShipment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      pickupLocation: 'Primary Studio Hub',
      billingAddress: {
        fullName: order.billingAddress.fullName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: fullAddr,
        city: order.billingAddress.city,
        state: order.billingAddress.state,
        pincode: order.billingAddress.pincode,
      },
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: fullAddr,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
      },
      orderItems: order.items.map((i) => ({
        name: i.productName,
        sku: i.sku,
        units: i.quantity,
        sellingPrice: i.unitPrice,
      })),
      paymentMethod: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      subtotal: order.subtotalAmount,
      total: order.totalAmount,
    });

    // Update local order
    order.fulfillmentStatus = 'PROCESSING';
    order.shipment = {
      courierName: shipment.courierName,
      awbCode: shipment.awbCode,
      status: shipment.status,
      trackingUrl: shipment.trackingUrl,
    };
    localOrdersStore.set(order.orderNumber, order);
    localOrdersStore.set(order.id, order);

    // Update Supabase if admin is connected
    const admin = getAdminClient();
    if (admin) {
      try {
        await admin
          .from('orders')
          .update({
            fulfillment_status: 'PROCESSING',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        const { data: dbShipment } = await admin
          .from('shipments')
          .insert({
            order_id: order.id,
            courier_name: shipment.courierName,
            awb_code: shipment.awbCode,
            status: shipment.status,
            tracking_url: shipment.trackingUrl,
          })
          .select('id')
          .single();

        if (dbShipment) {
          await admin.from('shipment_events').insert({
            shipment_id: dbShipment.id,
            status: shipment.status,
            location: 'AESTHIQUE Central Studio, New Delhi',
            description: `Shipment booked with ${shipment.courierName}. AWB: ${shipment.awbCode}`,
          });
        }
      } catch {
        // Fallback store holds state
      }
    }

    return NextResponse.json({
      success: true,
      shipment,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate shipment manifest',
      },
      { status: 500 }
    );
  }
}
