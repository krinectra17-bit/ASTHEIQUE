import crypto from 'crypto';
import { verifyPaymentSignature, verifyWebhookSignature, createRazorpayOrder } from '../src/lib/razorpay/client';

async function runRazorpayVerification() {
  console.log('========================================================');
  console.log(' RAZORPAY INTEGRATION & SECURITY VERIFICATION');
  console.log('========================================================\n');

  // Check Environment
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  console.log('1. Environment Configuration Status:');
  console.log(`   RAZORPAY_KEY_ID: ${keyId ? 'Configured' : 'NOT CONFIGURED (Awaiting merchant keys)'}`);
  console.log(`   RAZORPAY_KEY_SECRET: ${keySecret ? 'Configured' : 'NOT CONFIGURED (Awaiting merchant keys)'}`);
  console.log(`   RAZORPAY_WEBHOOK_SECRET: ${webhookSecret ? 'Configured' : 'NOT CONFIGURED (Awaiting merchant keys)'}`);

  // Test Order Creation
  console.log('\n2. Testing Order Creation (Internal Service):');
  const order = await createRazorpayOrder({
    amount: 2499,
    receipt: 'rec_test_' + Date.now(),
    notes: { customer: 'Test User', brand: 'AESTHIQUE' }
  });
  console.log(`   Generated Order ID: ${order.id}`);
  console.log(`   Amount: ${order.amount} paise (₹${order.amount / 100})`);
  console.log(`   Is Mock Fallback: ${order.isMock ?? false}`);

  // Test Cryptographic Verification with synthetic secret
  console.log('\n3. Testing HMAC-SHA256 Cryptographic Signature Verification:');
  const testSecret = 'rzp_test_secret_994827163829';
  const orderId = 'order_test_123456789';
  const paymentId = 'pay_test_987654321';
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Temporarily set env for verification test
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const validResult = verifyPaymentSignature({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: validSignature
  });
  console.log(`   Valid Signature Verification: ${validResult ? 'PASS (Accepted)' : 'FAIL'}`);

  const tamperedResult = verifyPaymentSignature({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: 'tampered_signature_invalid_hex_string'
  });
  console.log(`   Tampered Signature Verification: ${!tamperedResult ? 'PASS (Properly Rejected)' : 'FAIL'}`);

  // Webhook Signature Test
  console.log('\n4. Testing Webhook Cryptographic Signature Verification:');
  const testWebhookSecret = 'whsec_test_secret_772183';
  process.env.RAZORPAY_WEBHOOK_SECRET = testWebhookSecret;

  const samplePayload = JSON.stringify({
    entity: 'event',
    account_id: 'acc_test_123',
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: paymentId,
          order_id: orderId,
          amount: 249900,
          status: 'captured'
        }
      }
    }
  });

  const validWebhookSig = crypto
    .createHmac('sha256', testWebhookSecret)
    .update(samplePayload)
    .digest('hex');

  const webhookValid = verifyWebhookSignature(samplePayload, validWebhookSig);
  console.log(`   Valid Webhook Signature: ${webhookValid ? 'PASS (Accepted)' : 'FAIL'}`);

  const webhookTampered = verifyWebhookSignature(samplePayload, 'forged_webhook_signature');
  console.log(`   Forged Webhook Signature: ${!webhookTampered ? 'PASS (Properly Rejected)' : 'FAIL'}`);

  // Test Live Local API Endpoints
  console.log('\n5. Testing Live Local API Endpoints on http://localhost:3000:');
  try {
    const apiOrderRes = await fetch('http://localhost:3000/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'ord_test_001', amount: 2499 })
    });
    const apiOrderData = await apiOrderRes.json();
    console.log(`   POST /api/payments/razorpay/order: Status ${apiOrderRes.status}, Success: ${apiOrderData.success}`);

    const apiVerifyRes = await fetch('http://localhost:3000/api/payments/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'ord_test_001',
        razorpayOrderId: 'order_mock_1234',
        razorpayPaymentId: 'pay_mock_1234',
        razorpaySignature: 'sig_mock_1234'
      })
    });
    const apiVerifyData = await apiVerifyRes.json();
    console.log(`   POST /api/payments/razorpay/verify: Status ${apiVerifyRes.status}, Success: ${apiVerifyData.success}`);

    const apiWebhookRes = await fetch('http://localhost:3000/api/payments/razorpay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'invalid_sig'
      },
      body: samplePayload
    });
    console.log(`   POST /api/payments/razorpay/webhook (unauthenticated probe): Status ${apiWebhookRes.status} (Expected 400 rejection)`);
  } catch (err: any) {
    console.log(`   Endpoint probe note: ${err.message}`);
  }
}

runRazorpayVerification().catch(console.error);
