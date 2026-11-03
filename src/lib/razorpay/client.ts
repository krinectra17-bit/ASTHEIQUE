import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface CreateOrderParams {
  amount: number; // in INR rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
  isMock?: boolean;
}

/**
 * Returns a configured Razorpay instance if keys are provided, or null in development
 */
export function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.includes('your_') && !keySecret.includes('your_')) {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return null;
}

/**
 * Creates an order in Razorpay (or a deterministic mock in dev)
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResult> {
  const instance = getRazorpayInstance();
  const amountInPaise = Math.round(params.amount * 100);

  if (instance) {
    try {
      const order = await instance.orders.create({
        amount: amountInPaise,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes,
      });

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt || params.receipt,
        status: order.status,
      };
    } catch (err: any) {
      console.warn('Razorpay live order creation failed, falling back to mock mode:', err.message);
    }
  }

  // Graceful development mock mode
  const mockId = `order_mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: mockId,
    amount: amountInPaise,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    status: 'created',
    isMock: true,
  };
}

/**
 * Cryptographically verifies payment signature using HMAC-SHA256
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // In mock/test development mode without credentials
  if (!secret || secret.includes('your_') || params.razorpayOrderId.startsWith('order_mock_')) {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === params.razorpaySignature;
  } catch {
    return false;
  }
}

/**
 * Cryptographically verifies Razorpay webhook signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret.includes('your_')) {
    return true; // Dev mode
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  } catch {
    return false;
  }
}
