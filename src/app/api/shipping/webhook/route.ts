import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { awb, current_status, current_timestamp, courier_name, scans } = body;

    if (!awb) {
      return NextResponse.json({ error: 'Missing AWB' }, { status: 400 });
    }

    const admin = getAdminClient();
    if (admin) {
      try {
        const { data: shipment } = await admin
          .from('shipments')
          .select('id, order_id')
          .eq('awb_code', awb)
          .maybeSingle();

        if (shipment) {
          // Update shipment status
          await admin
            .from('shipments')
            .update({
              status: current_status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', shipment.id);

          // If delivered, update order status to DELIVERED
          if (current_status?.toLowerCase().includes('delivered')) {
            await admin
              .from('orders')
              .update({
                status: 'DELIVERED',
                fulfillment_status: 'FULFILLED',
                updated_at: new Date().toISOString(),
              })
              .eq('id', shipment.order_id);
          }

          // Insert latest scan into shipment_events
          const latestScan = scans?.[0];
          if (latestScan) {
            await admin.from('shipment_events').insert({
              shipment_id: shipment.id,
              status: latestScan.status || current_status,
              location: latestScan.location || 'In Transit Hub',
              description: latestScan.activity || `Status updated to ${current_status}`,
            });
          }
        }
      } catch {
        // Safe webhook acknowledgment
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Webhook processing error' },
      { status: 500 }
    );
  }
}
