export interface RazorpayCheckoutOptions {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number; // in paise
  keyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isMock?: boolean;
}

export interface PaymentSuccessResult {
  orderNumber: string;
  orderId: string;
  paymentId: string;
}

/**
 * Dynamically loads the official Razorpay standard checkout script
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Mounts and opens the Razorpay checkout payment modal
 */
export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions
): Promise<PaymentSuccessResult> {
  // If in mock mode or test preview, simulate successful payment after a brief realistic delay
  if (options.isMock || options.razorpayOrderId.startsWith('order_mock_')) {
    await new Promise((r) => setTimeout(r, 1200));

    const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const mockSig = `sig_mock_${Math.random().toString(36).slice(2, 12)}`;

    // Call verify endpoint
    const res = await fetch('/api/payments/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: options.orderId,
        razorpayOrderId: options.razorpayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSig,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Payment verification failed');
    }

    return {
      orderNumber: data.orderNumber || options.orderNumber,
      orderId: data.orderId || options.orderId,
      paymentId: mockPaymentId,
    };
  }

  // Load official script
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error('Unable to load Razorpay payment gateway SDK. Please check your connection.');
  }

  return new Promise((resolve, reject) => {
    const rzpOptions = {
      key: options.keyId,
      amount: options.amount,
      currency: 'INR',
      name: 'AESTHIQUE',
      description: 'Little Things, Better Living.',
      image: '/brand/aesthique-logo.png',
      order_id: options.razorpayOrderId,
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      theme: {
        color: '#30251F', // Espresso Brown
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment was cancelled by the customer.'));
        },
      },
      handler: async (response: any) => {
        try {
          // Verify cryptographic signature on the backend
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: options.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.error || 'Payment verification failed');
          }

          resolve({
            orderNumber: verifyData.orderNumber || options.orderNumber,
            orderId: verifyData.orderId || options.orderId,
            paymentId: response.razorpay_payment_id,
          });
        } catch (err: any) {
          reject(err);
        }
      },
    };

    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.on('payment.failed', (resp: any) => {
      reject(new Error(resp.error?.description || 'Payment transaction failed'));
    });
    rzp.open();
  });
}
