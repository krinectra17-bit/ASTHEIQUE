import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, userId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, valid: false, message: 'Please provide a coupon code' },
        { status: 400 }
      );
    }

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid subtotal provided' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal, userId);

    return NextResponse.json({
      success: true,
      valid: result.valid,
      coupon: result.coupon,
      discount: result.discount,
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: error.message || 'Error validating coupon',
      },
      { status: 500 }
    );
  }
}
