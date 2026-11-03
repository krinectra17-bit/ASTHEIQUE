'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon, PricingBreakdown } from '@/types';
import { calculateCartPricing } from '@/lib/pricing/engine';

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  pricing: PricingBreakdown;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, variantId?: string | null) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Available demo coupons for seamless customer testing
export const DEMO_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscountAmount: 500,
    usageLimit: 1000,
    timesUsed: 12,
    isActive: true,
    startsAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'coup-2',
    code: 'AESTHETIC500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2499,
    usageLimit: 500,
    timesUsed: 44,
    isActive: true,
    startsAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'coup-3',
    code: 'FIRSTLIVING15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscountAmount: 1000,
    usageLimit: 200,
    timesUsed: 19,
    isActive: true,
    startsAt: '2026-01-01T00:00:00Z',
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state safely on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aesthique_cart');
      const savedWishlist = localStorage.getItem('aesthique_wishlist');
      const savedCoupon = localStorage.getItem('aesthique_coupon');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to parse local storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('aesthique_cart', JSON.stringify(cart));
      localStorage.setItem('aesthique_wishlist', JSON.stringify(wishlist));
      if (appliedCoupon) {
        localStorage.setItem('aesthique_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('aesthique_coupon');
      }
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [cart, wishlist, appliedCoupon, isHydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const pricing = calculateCartPricing(cart, appliedCoupon);

  const addToCart = (product: Product, quantity = 1, variantId?: string | null) => {
    const selectedVariant = variantId
      ? product.variants?.find((v) => v.id === variantId)
      : undefined;

    const unitPrice = (product.salePrice ?? product.regularPrice) + (selectedVariant?.priceAdjustment ?? 0);
    const itemSku = selectedVariant ? selectedVariant.sku : product.sku;
    const itemMaxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
    const cartItemId = `${product.id}-${variantId || 'standard'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, itemMaxStock);
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        variantId: variantId || null,
        productName: product.name,
        variantName: selectedVariant ? `${selectedVariant.variantType}: ${selectedVariant.variantValue}` : null,
        sku: itemSku,
        unitPrice,
        quantity: Math.min(quantity, itemMaxStock),
        imageUrl: selectedVariant?.imageUrl || product.primaryImage,
        maxStock: itemMaxStock,
      };
      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from shopping bag.');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      }
      showToast(`Saved "${product.name}" to wishlist.`);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    const currentSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    try {
      // 1. Attempt live server validation API
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal: currentSubtotal }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.valid && data.coupon) {
          setAppliedCoupon(data.coupon);
          showToast(data.message || `Coupon "${data.coupon.code}" applied!`);
          return { success: true, message: data.message || `Applied coupon: ₹${data.discount} off.` };
        } else {
          return { success: false, message: data.message || `Coupon code "${cleanCode}" is invalid.` };
        }
      }
    } catch {
      // Fall through to fallback
    }

    // 2. Resilient local fallback
    const matched = DEMO_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!matched) {
      return { success: false, message: `Coupon code "${code}" is invalid.` };
    }

    const testPricing = calculateCartPricing(cart, matched);
    if (testPricing.couponError) {
      return { success: false, message: testPricing.couponError };
    }

    setAppliedCoupon(matched);
    showToast(`Coupon "${matched.code}" applied successfully!`);
    return { success: true, message: `Coupon applied: ₹${testPricing.discount} off.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        pricing,
        isCartOpen,
        isSearchOpen,
        setIsCartOpen,
        setIsSearchOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        applyCoupon,
        removeCoupon,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
