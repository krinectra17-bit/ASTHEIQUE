import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CreateOrderRequest } from '@/lib/checkout/service';

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    const result = await createOrder(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to place order',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error while processing checkout',
      },
      { status: 500 }
    );
  }
}
