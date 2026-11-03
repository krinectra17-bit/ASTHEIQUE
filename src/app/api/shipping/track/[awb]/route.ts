import { NextRequest, NextResponse } from 'next/server';
import { trackShipment } from '@/lib/shiprocket/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ awb: string }> }
) {
  try {
    const { awb } = await params;

    if (!awb) {
      return NextResponse.json({ success: false, error: 'Missing AWB tracking code' }, { status: 400 });
    }

    const tracking = await trackShipment(awb);

    return NextResponse.json({
      success: true,
      data: tracking,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error tracking shipment',
      },
      { status: 500 }
    );
  }
}
