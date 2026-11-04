import { calculateCartPricing, SHIPPING_FREE_THRESHOLD, STANDARD_SHIPPING_FEE } from '../src/lib/pricing/engine';
import { validateCoupon } from '../src/lib/coupons/service';
import { checkStockAvailability, reserveStock, releaseStock, commitStock } from '../src/lib/inventory/service';
import { verifyPaymentSignature } from '../src/lib/razorpay/client';
import { checkPincodeServiceability } from '../src/lib/shiprocket/client';
import { CartItem, Coupon } from '../src/types';
import crypto from 'crypto';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, failureMessage?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } else {
    results.push({ name, passed: false, message: failureMessage });
    console.error(`  ✗ ${name}: ${failureMessage || 'Assertion failed'}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log(' AESTHIQUE ECOMMERCE PLATFORM — TEST SUITE VERIFICATION');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Server-Authoritative Pricing Engine
  // ------------------------------------------------------------------
  console.log('SUITE 1: Pricing Engine & Tax Calculation');

  const mockItemA: CartItem = {
    id: 'ci_01',
    productId: 'a0000001-0000-0000-0000-000000000001',
    productName: 'Solace Ceramic Vase',
    sku: 'AES-VASE-01',
    unitPrice: 1200,
    quantity: 1,
    imageUrl: '',
    maxStock: 25,
  };

  const mockItemB: CartItem = {
    id: 'ci_02',
    productId: 'a0000001-0000-0000-0000-000000000002',
    productName: 'Aura Brass Dripper',
    sku: 'AES-COFFEE-01',
    unitPrice: 1850,
    quantity: 1,
    imageUrl: '',
    maxStock: 15,
  };

  // Test 1.1: Below free shipping threshold
  const pricingUnderThreshold = calculateCartPricing([mockItemA]);
  assert(
    pricingUnderThreshold.subtotal === 1200,
    'Subtotal is calculated correctly for single item'
  );
  assert(
    pricingUnderThreshold.shippingFee === STANDARD_SHIPPING_FEE,
    'Standard shipping fee (₹150) is applied below threshold (₹1,999)'
  );
  assert(
    pricingUnderThreshold.isFreeShipping === false,
    'Free shipping flag is false when subtotal < ₹1,999'
  );
  assert(
    pricingUnderThreshold.amountNeededForFreeShipping === 799,
    'Accurately calculates remaining amount needed for free shipping'
  );

  // Test 1.2: Above free shipping threshold
  const pricingAboveThreshold = calculateCartPricing([mockItemA, mockItemB]);
  assert(
    pricingAboveThreshold.subtotal === 3050,
    'Subtotal correctly aggregates multiple items (1200 + 1850 = 3050)'
  );
  assert(
    pricingAboveThreshold.shippingFee === 0,
    'Shipping fee is waived (₹0) when subtotal exceeds threshold'
  );
  assert(
    pricingAboveThreshold.isFreeShipping === true,
    'Free shipping flag is true above ₹1,999'
  );
  assert(
    pricingAboveThreshold.taxAmount > 0,
    'GST tax breakdown calculated (18% inclusive retail tax)'
  );

  // ------------------------------------------------------------------
  // SUITE 2: Coupon Engine & Validation
  // ------------------------------------------------------------------
  console.log('\nSUITE 2: Coupon Validation & Minimum Order Value Logic');

  // Test 2.1: Valid WELCOME10 coupon
  const welcome10Result = await validateCoupon('WELCOME10', 2000);
  assert(
    welcome10Result.valid === true,
    'WELCOME10 is recognized and validated'
  );
  assert(
    welcome10Result.discount === 200,
    'WELCOME10 computes 10% discount correctly (10% of 2000 = ₹200)'
  );

  // Test 2.2: Ineligible subtotal under MOV
  const movFailureResult = await validateCoupon('WELCOME10', 500);
  assert(
    movFailureResult.valid === false,
    'Coupon rejected when subtotal is below minimum order value (₹999)'
  );

  // Test 2.3: Fixed amount coupon AESTHETIC500
  const aesthetic500Result = await validateCoupon('AESTHETIC500', 3000);
  assert(
    aesthetic500Result.valid === true,
    'AESTHETIC500 validated above MOV ₹2,499'
  );
  assert(
    aesthetic500Result.discount === 500,
    'AESTHETIC500 applies exact ₹500 discount'
  );

  // Test 2.4: Invalid coupon code
  const invalidCouponResult = await validateCoupon('NONEXISTENT_CODE', 5000);
  assert(
    invalidCouponResult.valid === false,
    'Invalid or fraudulent coupon code correctly rejected'
  );

  // ------------------------------------------------------------------
  // SUITE 3: Inventory Tracking & Atomic Reservation
  // ------------------------------------------------------------------
  console.log('\nSUITE 3: Real-Time Inventory & Reservation Lifecycle');

  const stockItem = [
    {
      productId: 'a0000001-0000-0000-0000-000000000001',
      quantity: 2,
    },
  ];

  // Test 3.1: Check availability
  const checkResult = await checkStockAvailability(stockItem);
  assert(
    checkResult.allAvailable === true,
    'Inventory availability verified for in-stock item'
  );
  assert(
    checkResult.items[0].isSufficient === true,
    'Item requested quantity is sufficient against available stock'
  );

  // Test 3.2: Reserve stock
  const refId = `test_ref_${Date.now()}`;
  const reserveResult = await reserveStock(stockItem, refId);
  assert(
    reserveResult.success === true,
    'Atomic stock reservation hold created successfully'
  );

  // Test 3.3: Release stock upon cancellation
  const releaseResult = await releaseStock(stockItem, refId, 'Unit test cancellation');
  assert(
    releaseResult.success === true,
    'Reserved stock successfully released upon order timeout'
  );

  // Test 3.4: Excessive quantity rejection
  const excessiveStock = [
    {
      productId: 'a0000001-0000-0000-0000-000000000001',
      quantity: 999999,
    },
  ];
  const excessiveCheck = await checkStockAvailability(excessiveStock);
  assert(
    excessiveCheck.allAvailable === false,
    'Excessive quantity request correctly rejected as insufficient'
  );

  // ------------------------------------------------------------------
  // SUITE 4: Razorpay Cryptographic HMAC-SHA256 Signature Verification
  // ------------------------------------------------------------------
  console.log('\nSUITE 4: Razorpay Payment Verification Security');

  // Test 4.1: Development mock mode signature
  const mockSigValid = verifyPaymentSignature({
    razorpayOrderId: 'order_mock_12345',
    razorpayPaymentId: 'pay_mock_12345',
    razorpaySignature: 'sig_mock_12345',
  });
  assert(
    mockSigValid === true,
    'Mock development order signatures safely verified in test environment'
  );

  // Test 4.2: Real HMAC-SHA256 calculation
  const testSecret = 'secret_test_key_123';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const validOrderId = 'order_live_998811';
  const validPaymentId = 'pay_live_772211';
  const expectedSig = crypto
    .createHmac('sha256', testSecret)
    .update(`${validOrderId}|${validPaymentId}`)
    .digest('hex');

  const liveSigValid = verifyPaymentSignature({
    razorpayOrderId: validOrderId,
    razorpayPaymentId: validPaymentId,
    razorpaySignature: expectedSig,
  });
  assert(
    liveSigValid === true,
    'Valid HMAC-SHA256 signature authenticates successfully'
  );

  const tamperedSigValid = verifyPaymentSignature({
    razorpayOrderId: validOrderId,
    razorpayPaymentId: validPaymentId,
    razorpaySignature: 'tampered_or_fraudulent_signature',
  });
  assert(
    tamperedSigValid === false,
    'Tampered or forged signature strictly rejected'
  );

  // ------------------------------------------------------------------
  // SUITE 5: Shiprocket Pincode Serviceability & Logistics
  // ------------------------------------------------------------------
  console.log('\nSUITE 5: Shiprocket Logistics & Courier Serviceability');

  const delhiPincode = await checkPincodeServiceability('110001');
  assert(
    delhiPincode.serviceable === true,
    'Delhi NCR (110001) recognized as high-speed delivery zone'
  );
  assert(
    delhiPincode.couriers.length > 0,
    'Express courier options allocated (Blue Dart, Delhivery, etc.)'
  );

  const mumbaiPincode = await checkPincodeServiceability('400001');
  assert(
    mumbaiPincode.serviceable === true,
    'Mumbai (400001) verified for Western hub transit'
  );
  assert(
    mumbaiPincode.codAvailable === true,
    'Cash on Delivery supported across metropolitan hubs'
  );

  // ------------------------------------------------------------------
  // SUMMARY REPORT
  // ------------------------------------------------------------------
  console.log('\n======================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`TOTAL TESTS:  ${results.length}`);
  console.log(`PASSED:       ${passedCount}`);
  console.log(`FAILED:       ${failedCount}`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
