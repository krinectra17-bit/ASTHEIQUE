import { createClient as createServerClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Coupon } from '@/types';

// Fallback coupons if database table is empty or during offline development
const FALLBACK_COUPONS: Record<string, Coupon> = {
  WELCOME10: {
    id: 'c0000001-0000-0000-0000-000000000001',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscountAmount: 500,
    usageLimit: 1000,
    timesUsed: 14,
    isActive: true,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: null,
  },
  AESTHETIC500: {
    id: 'c0000001-0000-0000-0000-000000000002',
    code: 'AESTHETIC500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2499,
    maxDiscountAmount: null,
    usageLimit: 500,
    timesUsed: 36,
    isActive: true,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: null,
  },
  FIRSTLIVING15: {
    id: 'c0000001-0000-0000-0000-000000000003',
    code: 'FIRSTLIVING15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscountAmount: 1000,
    usageLimit: 200,
    timesUsed: 21,
    isActive: true,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: null,
  },
};

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message?: string;
}

/**
 * Validates a coupon code against Supabase and returns calculated discount
 */
export async function validateCoupon(
  rawCode: string,
  subtotal: number,
  userId?: string
): Promise<CouponValidationResult> {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return { valid: false, discount: 0, message: 'Please enter a coupon code' };
  }

  let coupon: Coupon | null = null;
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();

      if (!error && data) {
        coupon = {
          id: data.id,
          code: data.code,
          discountType: data.discount_type,
          discountValue: Number(data.discount_value),
          minOrderValue: Number(data.min_order_value || 0),
          maxDiscountAmount: data.max_discount_amount
            ? Number(data.max_discount_amount)
            : null,
          usageLimit: data.usage_limit,
          timesUsed: data.times_used || 0,
          isActive: data.is_active,
          startsAt: data.starts_at,
          expiresAt: data.expires_at,
        };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Use fallback if not retrieved from database
  if (!coupon) {
    coupon = FALLBACK_COUPONS[code] || null;
  }

  if (!coupon) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon code '${code}' is invalid`,
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon code '${code}' is no longer active`,
    };
  }

  const now = new Date();
  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon '${code}' will be valid starting ${new Date(coupon.startsAt).toLocaleDateString()}`,
    };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon code '${code}' has expired`,
    };
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return {
      valid: false,
      discount: 0,
      message: `Coupon code '${code}' has reached its maximum redemptions`,
    };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this coupon`,
    };
  }

  // Check customer-specific redemption limit
  if (userId && admin) {
    try {
      const { count } = await admin
        .from('coupon_redemptions')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId);

      if (count && count > 0) {
        return {
          valid: false,
          discount: 0,
          message: 'You have already redeemed this promotional code',
        };
      }
    } catch {
      // Ignore failure in checking customer history
    }
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    const rawDiscount = (subtotal * coupon.discountValue) / 100;
    discount = coupon.maxDiscountAmount
      ? Math.min(rawDiscount, coupon.maxDiscountAmount)
      : rawDiscount;
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  discount = Math.round(discount);

  return {
    valid: true,
    coupon,
    discount,
    message: `Applied ${coupon.code} successfully! You saved ₹${discount.toLocaleString('en-IN')}`,
  };
}

/**
 * Records a coupon redemption upon confirmed order
 */
export async function recordCouponRedemption(
  couponId: string,
  orderId: string,
  discountAmount: number,
  userId?: string | null
): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;

  try {
    // 1. Insert redemption
    await admin.from('coupon_redemptions').insert({
      coupon_id: couponId,
      order_id: orderId,
      user_id: userId || null,
      discount_amount: discountAmount,
    });

    // 2. Increment coupon times_used
    const { data: c } = await admin
      .from('coupons')
      .select('times_used')
      .eq('id', couponId)
      .single();

    if (c) {
      await admin
        .from('coupons')
        .update({ times_used: (c.times_used || 0) + 1 })
        .eq('id', couponId);
    }
  } catch {
    // Best-effort recording
  }
}
