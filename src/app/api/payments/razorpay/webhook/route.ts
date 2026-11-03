import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay/client';
import { getOrderByNumber, localOrdersStore } from '@/lib/checkout/service';
import { commitStock, releaseStock } from '@/lib/inventory/service';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const eventData = JSON.parse(rawBody);
    const event = eventData.event;
    const payload = eventData.payload;

    const admin = getAdminClient();

    switch (event) {
      case 'payment.captured': {
        const payment = payload.payment?.entity;
        const razorpayOrderId = payment?.order_id;

        if (razorpayOrderId) {
          if (admin) {
            // Find order by razorpay order id in payments or notes
            const { data: dbPayment } = await admin
              .from('payments')
              .select('order_id')
              .eq('gateway_order_id', razorpayOrderId)
              .maybeSingle();

            if (dbPayment) {
              await admin
                .from('orders')
                .update({ payment_status: 'PAID', status: 'PROCESSING' })
                .eq('id', dbPayment.order_id);
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payment?.entity;
        const razorpayOrderId = payment?.order_id;
        const reason = payment?.error_description || 'Payment transaction failed';

        if (razorpayOrderId && admin) {
          const { data: dbPayment } = await admin
            .from('payments')
            .select('order_id')
            .eq('gateway_order_id', razorpayOrderId)
            .maybeSingle();

          if (dbPayment) {
            await admin
              .from('orders')
              .update({ payment_status: 'FAILED' })
              .eq('id', dbPayment.order_id);

            // Release inventory back
            const { data: orderData } = await admin
              .from('order_items')
              .select('product_id, variant_id, quantity')
              .eq('order_id', dbPayment.order_id);

            if (orderData) {
              const items = orderData.map((d: any) => ({
                productId: d.product_id,
                variantId: d.variant_id,
                quantity: d.quantity,
              }));
              await releaseStock(items, dbPayment.order_id, reason);
            }
          }
        }
        break;
      }

      case 'refund.processed': {
        const refund = payload.refund?.entity;
        const paymentId = refund?.payment_id;

        if (paymentId && admin) {
          await admin
            .from('payments')
            .update({ status: 'REFUNDED' })
            .eq('gateway_payment_id', paymentId);
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Webhook processing error' },
      { status: 500 }
    );
  }
}
