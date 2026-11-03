import { CartItem, Coupon } from '@/types';

export const SHIPPING_FREE_THRESHOLD = 1999;
export const STANDARD_SHIPPING_FEE = 150;
export const GST_RATE = 0.18; // 18% GST (standard Indian lifestyle & decor rate)

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  couponError?: string;
}

export function calculateCartPricing(
  items: CartItem[],
  coupon?: Coupon | null
): PricingBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let discount = 0;
  let couponError: string | undefined;

  if (coupon && coupon.isActive) {
    const now = new Date();
    const startsAt = new Date(coupon.startsAt);
    const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;

    if (now < startsAt) {
      couponError = 'Coupon is not yet active';
    } else if (expiresAt && now > expiresAt) {
      couponError = 'Coupon has expired';
    } else if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      couponError = 'Coupon usage limit has been reached';
    } else if (subtotal < coupon.minOrderValue) {
      couponError = `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`;
    } else {
      if (coupon.discountType === 'percentage') {
        const rawDiscount = (subtotal * coupon.discountValue) / 100;
        discount = coupon.maxDiscountAmount
          ? Math.min(rawDiscount, coupon.maxDiscountAmount)
          : rawDiscount;
      } else if (coupon.discountType === 'fixed') {
        discount = Math.min(coupon.discountValue, subtotal);
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Free shipping check on discounted subtotal
  const isFreeShipping = discountedSubtotal >= SHIPPING_FREE_THRESHOLD || items.length === 0;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, SHIPPING_FREE_THRESHOLD - discountedSubtotal);

  // Total includes tax (all prices in INR retail are typically inclusive of GST)
  // Tax breakdown calculated for invoicing
  const taxableAmount = discountedSubtotal / (1 + GST_RATE);
  const taxAmount = Math.round((discountedSubtotal - taxableAmount) * 100) / 100;

  const total = Math.round(discountedSubtotal + shippingFee);

  return {
    subtotal,
    discount: Math.round(discount),
    shippingFee,
    taxAmount,
    total,
    isFreeShipping,
    amountNeededForFreeShipping,
    couponError,
  };
}
