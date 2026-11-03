import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay/client';
import { getOrderByNumber } from '@/lib/checkout/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: orderId and amount' },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await getOrderByNumber(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order not found for identifier: ${orderId}` },
        { status: 404 }
      );
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: order.totalAmount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        order_number: order.orderNumber,
        customer_email: order.customerEmail,
      },
    });

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      'rzp_test_aesthique_preview';

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      isMock: razorpayOrder.isMock || false,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize payment gateway order',
      },
      { status: 500 }
    );
  }
}
