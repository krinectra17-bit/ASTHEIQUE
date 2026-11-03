'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/store-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    pricing,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-aesthique-beige pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Review your selected items before proceeding to secure checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-aesthique-espresso">
            Your bag is currently empty
          </h2>
          <p className="text-xs text-aesthique-espresso/70">
            Explore our curated catalog to discover pieces tailored for mindful everyday living.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="primary" size="md">
                Explore Collections
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Items Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Alert */}
            <div className="bg-aesthique-cream border border-aesthique-beige p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-aesthique-espresso">
                <Truck className="w-4 h-4 text-aesthique-gold flex-shrink-0" />
                <span>
                  {pricing.isFreeShipping
                    ? '✨ You qualify for complimentary Pan-India shipping!'
                    : `Add ${formatPrice(pricing.amountNeededForFreeShipping)} more to unlock FREE shipping.`}
                </span>
              </div>
              <span className="text-xs text-aesthique-copper font-semibold">
                Threshold: ₹1,999
              </span>
            </div>

            <div className="bg-white border border-aesthique-beige divide-y divide-aesthique-beige">
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  {/* Thumbnail & Meta */}
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-aesthique-ivory flex-shrink-0 overflow-hidden border border-aesthique-beige">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <h3 className="font-editorial text-sm sm:text-base font-semibold text-aesthique-espresso">
                        {item.productName}
                      </h3>
                      {item.variantName && (
                        <p className="text-xs text-aesthique-copper mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-xs text-aesthique-espresso/60 mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs font-semibold text-aesthique-espresso sm:hidden mt-2">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <span className="text-xs font-semibold text-aesthique-espresso hidden sm:inline">
                      {formatPrice(item.unitPrice)}
                    </span>

                    <div className="flex items-center border border-aesthique-beige bg-aesthique-ivory">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-aesthique-espresso hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-aesthique-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2.5 py-1 text-aesthique-espresso hover:bg-white disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-aesthique-espresso w-20 text-right">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-aesthique-espresso/40 hover:text-rose-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider text-aesthique-copper hover:underline font-semibold"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-wider text-rose-700 hover:underline font-semibold"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="bg-white border border-aesthique-beige p-6 space-y-6 shadow-sm sticky top-24">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso border-b border-aesthique-beige pb-3">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-aesthique-gold/15 border border-aesthique-gold/40 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-aesthique-espresso">
                    <Tag className="w-3.5 h-3.5 text-aesthique-copper" />
                    <span>
                      Coupon: <strong className="text-aesthique-copper">{appliedCoupon.code}</strong> (-{formatPrice(pricing.discount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-700 hover:underline uppercase tracking-wider font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-aesthique-ivory border border-aesthique-beige px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-aesthique-gold"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Pricing details */}
            <div className="space-y-3 text-xs text-aesthique-espresso/80 pt-2 border-t border-aesthique-beige/40">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-aesthique-espresso">{formatPrice(pricing.subtotal)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount Savings</span>
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
                <span>Total Amount</span>
                <span className="text-lg text-aesthique-copper">{formatPrice(pricing.total)}</span>
              </div>
              <p className="text-[10px] text-aesthique-espresso/60 text-right">
                Includes 18% GST (₹{pricing.taxAmount.toFixed(2)})
              </p>
            </div>

            {/* Checkout Link */}
            <Link href="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-aesthique-gold" />
              </Button>
            </Link>

            <div className="text-center text-[10px] text-aesthique-espresso/60 flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-aesthique-gold" />
              <span>Encrypted 256-bit SSL Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
