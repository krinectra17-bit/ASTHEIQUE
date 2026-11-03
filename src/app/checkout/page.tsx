'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, pricing, appliedCoupon, clearCart } = useStore();

  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    fullName: '',
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    addressType: 'home',
    paymentMethod: 'RAZORPAY' as 'RAZORPAY' | 'COD',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: clean }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Indian validation
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address for order notifications.');
      return;
    }
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.pincode || !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call server-authoritative order creation API
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          })),
          shippingAddress: {
            id: 'addr_' + Date.now(),
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
            houseNumber: formData.houseNumber,
            street: formData.street,
            area: formData.area,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            addressType: formData.addressType as any,
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
          billingAddress: {
            id: 'addr_' + Date.now(),
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
            houseNumber: formData.houseNumber,
            street: formData.street,
            area: formData.area,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            addressType: formData.addressType as any,
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
          paymentMethod: formData.paymentMethod,
          couponCode: appliedCoupon?.code || null,
          customerEmail: formData.email,
          customerPhone: formData.mobile,
          notes: formData.orderNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please review your details.');
      }

      const newOrderNumber = data.orderNumber || generateOrderNumber();

      // Store placed order in local customer history
      const placedOrder = {
        orderNumber: newOrderNumber,
        items: cart,
        pricing,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'RAZORPAY' ? 'PAID' : 'UNPAID',
        fulfillmentStatus: 'PROCESSING',
        createdAt: new Date().toISOString(),
      };

      try {
        const pastOrders = JSON.parse(localStorage.getItem('aesthique_orders') || '[]');
        pastOrders.unshift(placedOrder);
        localStorage.setItem('aesthique_orders', JSON.stringify(pastOrders));
      } catch (e) {
        console.error('Failed to save order to local storage', e);
      }

      setOrderSuccess({
        orderNumber: newOrderNumber,
        totalAmount: pricing.total,
        paymentMethod: formData.paymentMethod,
      });

      clearCart();
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Unable to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-aesthique-copper font-semibold">
            Order Confirmed
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
            Thank you for your order.
          </h1>
          <p className="text-sm text-aesthique-espresso/70 max-w-md mx-auto">
            Order reference: <strong className="text-aesthique-espresso">{orderSuccess.orderNumber}</strong>.
            A confirmation email has been dispatched to {formData.email}.
          </p>
        </div>

        <div className="bg-white border border-aesthique-beige p-6 max-w-md mx-auto text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-aesthique-beige pb-2">
            <span className="text-aesthique-espresso/60">Amount Payable</span>
            <span className="font-bold text-aesthique-espresso">{formatPrice(orderSuccess.totalAmount)}</span>
          </div>
          <div className="flex justify-between border-b border-aesthique-beige pb-2">
            <span className="text-aesthique-espresso/60">Payment Method</span>
            <span className="font-semibold text-aesthique-espresso">{orderSuccess.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-aesthique-espresso/60">Shipping Courier</span>
            <span className="font-semibold text-aesthique-espresso">Shiprocket Express</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link href={`/account/orders`}>
            <Button variant="primary" size="md">
              View Order in Account
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary" size="md">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-aesthique-espresso">
          No items to checkout
        </h2>
        <p className="text-xs text-aesthique-espresso/70">
          Your shopping bag is empty. Please add items before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="md">
            Explore Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Checkout Breadcrumb */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-aesthique-espresso/60 pb-4 border-b border-aesthique-beige">
        <Link href="/cart" className="hover:text-aesthique-copper">
          Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
        </Link>
        <ChevronRight className="w-3 h-3 text-aesthique-copper" />
        <span className="text-aesthique-copper font-semibold">Secure Checkout</span>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Address & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-aesthique-espresso text-aesthique-ivory text-xs flex items-center justify-center">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="patron@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Mobile Number (India +91) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-aesthique-espresso text-aesthique-ivory text-xs flex items-center justify-center">
                2
              </span>
              <span>Shipping Address</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Flat / House No. / Building *
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    required
                    placeholder="e.g. Villa 14-B"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Street / Colony *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="e.g. Shanti Niketan"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    name="area"
                    placeholder="e.g. South Delhi"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Near Club House"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>

                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Punjab">Punjab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="110021"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso tracking-widest focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-aesthique-espresso text-aesthique-ivory text-xs flex items-center justify-center">
                3
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* Razorpay Option */}
              <label
                className={cn(
                  'flex items-center justify-between p-4 border cursor-pointer transition-all',
                  formData.paymentMethod === 'RAZORPAY'
                    ? 'border-aesthique-copper bg-aesthique-cream/70'
                    : 'border-aesthique-beige hover:border-aesthique-gold/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={formData.paymentMethod === 'RAZORPAY'}
                    onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'RAZORPAY' }))}
                    className="accent-aesthique-copper"
                  />
                  <div>
                    <span className="font-semibold text-xs text-aesthique-espresso block">
                      Razorpay Secure (UPI, Cards, NetBanking)
                    </span>
                    <span className="text-[11px] text-aesthique-espresso/60 block">
                      Instant verification via Google Pay, PhonePe, Paytm, Cards & NetBanking.
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-aesthique-copper" />
              </label>

              {/* COD Option */}
              <label
                className={cn(
                  'flex items-center justify-between p-4 border cursor-pointer transition-all',
                  formData.paymentMethod === 'COD'
                    ? 'border-aesthique-copper bg-aesthique-cream/70'
                    : 'border-aesthique-beige hover:border-aesthique-gold/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'COD' }))}
                    className="accent-aesthique-copper"
                  />
                  <div>
                    <span className="font-semibold text-xs text-aesthique-espresso block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-aesthique-espresso/60 block">
                      Pay cash or UPI to Shiprocket delivery executive upon arrival.
                    </span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-aesthique-copper" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Placement (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-aesthique-beige p-6 space-y-5 shadow-sm sticky top-24">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso border-b border-aesthique-beige pb-3">
              Review Bag ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* Item Mini Cards */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center text-xs">
                  <div className="relative w-12 h-12 bg-aesthique-ivory flex-shrink-0 border border-aesthique-beige overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-editorial font-semibold text-aesthique-espresso truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-aesthique-copper">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-aesthique-espresso flex-shrink-0">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-aesthique-espresso/80 pt-4 border-t border-aesthique-beige">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-aesthique-espresso">{formatPrice(pricing.subtotal)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-medium">-{formatPrice(pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-aesthique-espresso">
                  {pricing.shippingFee === 0 ? (
                    <span className="text-emerald-800 font-semibold uppercase text-[10px]">Free</span>
                  ) : (
                    formatPrice(pricing.shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-aesthique-beige text-base font-bold text-aesthique-espresso">
                <span>Total Payable</span>
                <span className="text-lg text-aesthique-copper">{formatPrice(pricing.total)}</span>
              </div>
              <p className="text-[10px] text-aesthique-espresso/60 text-right">
                Includes ₹{pricing.taxAmount.toFixed(2)} GST.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-aesthique-gold" />
              <span>
                {formData.paymentMethod === 'RAZORPAY'
                  ? `Pay ${formatPrice(pricing.total)} via Razorpay`
                  : `Confirm Cash on Delivery Order`}
              </span>
            </Button>

            <div className="pt-2 text-center text-[10px] text-aesthique-espresso/60 space-y-1">
              <p className="flex items-center justify-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-aesthique-gold" />
                <span>Express courier booking via Shiprocket Logistics</span>
              </p>
              <p>By placing this order, you agree to our Terms & Return Policy.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
