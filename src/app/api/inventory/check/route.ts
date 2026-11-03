import { NextRequest, NextResponse } from 'next/server';
import { checkStockAvailability, StockCheckItem } from '@/lib/inventory/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: StockCheckItem[] = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid items array in request body',
        },
        { status: 400 }
      );
    }

    const availability = await checkStockAvailability(items);

    return NextResponse.json({
      success: true,
      allAvailable: availability.allAvailable,
      items: availability.items,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error checking inventory',
      },
      { status: 500 }
    );
  }
}
