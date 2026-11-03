'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/store-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  Trash2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    pricing,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((pricing.subtotal - pricing.discount) / 1999) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-aesthique-ivory shadow-2xl flex flex-col justify-between border-l border-aesthique-beige animate-slide-up">
          {/* Drawer Header */}
          <div className="p-5 border-b border-aesthique-beige bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-aesthique-copper" />
              <h2 className="font-editorial text-lg text-aesthique-espresso font-bold tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-aesthique-copper font-medium ml-1">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-aesthique-espresso/70 hover:text-aesthique-espresso focus:outline-none"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-aesthique-cream px-5 py-3 border-b border-aesthique-beige text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-aesthique-espresso">
                <Truck className="w-3.5 h-3.5 text-aesthique-gold" />
                {pricing.isFreeShipping
                  ? '✨ Unlocked Complimentary Standard Shipping!'
                  : `Add ${formatPrice(pricing.amountNeededForFreeShipping)} more for FREE shipping`}
              </span>
              <span className="text-[10px] text-aesthique-copper font-bold">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-aesthique-beige h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-aesthique-gold h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-aesthique-beige/40 flex items-center justify-center text-aesthique-copper">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg text-aesthique-espresso font-semibold">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-aesthique-espresso/60 mt-1 max-w-xs">
                    Explore our curated everyday essentials and discover pieces crafted for better living.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest px-6 py-3 hover:bg-black transition-colors"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-aesthique-beige/60 shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-aesthique-ivory flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className="font-editorial text-sm font-semibold text-aesthique-espresso line-clamp-1">
                          {item.productName}
                        </h4>
                      </div>
                      {item.variantName && (
                        <p className="text-[11px] text-aesthique-copper mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-aesthique-espresso mt-1">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-aesthique-beige/40">
                      <div className="flex items-center border border-aesthique-beige">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-aesthique-ivory text-aesthique-espresso transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-aesthique-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:bg-aesthique-ivory text-aesthique-espresso disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-aesthique-espresso">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-aesthique-espresso/40 hover:text-rose-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Pricing & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-aesthique-beige space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-aesthique-gold/15 border border-aesthique-gold/40 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 text-aesthique-espresso">
                      <Tag className="w-3.5 h-3.5 text-aesthique-copper" />
                      <span>
                        Applied Code: <strong className="text-aesthique-copper">{appliedCoupon.code}</strong> (-{formatPrice(pricing.discount)})
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
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-aesthique-ivory border border-aesthique-beige px-3 py-2 text-xs text-aesthique-espresso uppercase tracking-wider placeholder:normal-case placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                )}
                {couponFeedback && !appliedCoupon && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponFeedback.message}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-aesthique-espresso/80 pt-2 border-t border-aesthique-beige/40">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-aesthique-espresso">{formatPrice(pricing.subtotal)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-aesthique-espresso">
                    {pricing.shippingFee === 0 ? (
                      <span className="text-emerald-800 font-semibold uppercase text-[10px]">Free</span>
                    ) : (
                      formatPrice(pricing.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-aesthique-beige text-sm font-bold text-aesthique-espresso">
                  <span>Estimated Total</span>
                  <span className="text-base text-aesthique-copper">{formatPrice(pricing.total)}</span>
                </div>
                <p className="text-[10px] text-aesthique-espresso/60 text-right">
                  Tax included. Shipping calculated at checkout.
                </p>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-aesthique-espresso hover:bg-black text-aesthique-ivory text-xs uppercase tracking-widest font-semibold py-3.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-[11px] uppercase tracking-wider text-aesthique-espresso/70 hover:text-aesthique-copper underline transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
