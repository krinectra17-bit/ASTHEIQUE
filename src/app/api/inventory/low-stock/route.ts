import { NextRequest, NextResponse } from 'next/server';
import { getLowStockAlerts } from '@/lib/inventory/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threshold = searchParams.get('threshold')
      ? parseInt(searchParams.get('threshold')!, 10)
      : undefined;

    const alerts = await getLowStockAlerts(threshold);

    return NextResponse.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error fetching low stock alerts',
      },
      { status: 500 }
    );
  }
}
