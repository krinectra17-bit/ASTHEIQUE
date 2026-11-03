import { getAdminClient } from '@/lib/supabase/admin';
import { CartItem } from '@/types';
import { getProductBySlug } from '@/lib/data/catalog-service';
import { PRODUCTS } from '@/lib/data/mock-catalog';

/**
 * Synchronizes cart items with Supabase carts & cart_items tables
 */
export async function syncCartWithDatabase(
  items: CartItem[],
  userId?: string | null,
  sessionToken?: string | null
): Promise<{ success: boolean; cartId?: string; error?: string }> {
  if (!userId && !sessionToken) {
    return { success: false, error: 'No user ID or session token provided' };
  }

  const admin = getAdminClient();
  if (!admin) {
    return { success: true }; // In development without service role, succeed silently
  }

  try {
    // 1. Locate or create cart record
    let cartId: string | null = null;
    let query = admin.from('carts').select('id');

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_token', sessionToken!);
    }

    const { data: existingCart } = await query.maybeSingle();

    if (existingCart) {
      cartId = existingCart.id;
      await admin
        .from('carts')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', cartId);
    } else {
      const { data: newCart, error: insertError } = await admin
        .from('carts')
        .insert({
          user_id: userId || null,
          session_token: sessionToken || null,
        })
        .select('id')
        .single();

      if (insertError || !newCart) {
        return { success: false, error: insertError?.message };
      }
      cartId = newCart.id;
    }

    // 2. Clear existing items and insert new items
    await admin.from('cart_items').delete().eq('cart_id', cartId);

    if (items.length > 0) {
      const rows = items.map((item) => ({
        cart_id: cartId,
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
      }));

      await admin.from('cart_items').insert(rows);
    }

    return { success: true, cartId: cartId || undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Merges guest cart items with the customer's authenticated cart upon login
 */
export async function mergeGuestCart(
  guestItems: CartItem[],
  userId: string
): Promise<CartItem[]> {
  const admin = getAdminClient();
  if (!admin) return guestItems;

  try {
    // Get customer's cart
    const { data: userCart } = await admin
      .from('carts')
      .select('id, cart_items(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (!userCart || !userCart.cart_items) {
      // Just save guest items for user
      await syncCartWithDatabase(guestItems, userId);
      return guestItems;
    }

    // Map existing database items
    const mergedMap = new Map<string, CartItem>();

    // Add existing user cart items
    userCart.cart_items.forEach((dbItem: any) => {
      const key = `${dbItem.product_id}_${dbItem.variant_id || 'base'}`;
      const mockProd = PRODUCTS.find((p) => p.id === dbItem.product_id);
      const variant = mockProd?.variants?.find((v) => v.id === dbItem.variant_id);

      mergedMap.set(key, {
        id: dbItem.id,
        productId: dbItem.product_id,
        variantId: dbItem.variant_id,
        productName: mockProd?.name || 'Curated Essential',
        variantName: variant?.variantValue || null,
        sku: variant?.sku || mockProd?.sku || 'SKU-AES',
        unitPrice:
          (mockProd?.salePrice ?? mockProd?.regularPrice ?? 1000) +
          (variant?.priceAdjustment ?? 0),
        quantity: dbItem.quantity,
        imageUrl: variant?.imageUrl || mockProd?.primaryImage || '',
        maxStock: variant?.stockQuantity || mockProd?.stockQuantity || 25,
      });
    });

    // Merge in guest items (summing quantities or taking max)
    guestItems.forEach((guestItem) => {
      const key = `${guestItem.productId}_${guestItem.variantId || 'base'}`;
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!;
        existing.quantity = Math.min(
          existing.maxStock,
          existing.quantity + guestItem.quantity
        );
        mergedMap.set(key, existing);
      } else {
        mergedMap.set(key, guestItem);
      }
    });

    const finalItems = Array.from(mergedMap.values());
    await syncCartWithDatabase(finalItems, userId);
    return finalItems;
  } catch {
    return guestItems;
  }
}

/**
 * Synchronizes wishlist with database
 */
export async function syncWishlistWithDatabase(
  productIds: string[],
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = getAdminClient();
  if (!admin) return { success: true };

  try {
    let wishlistId: string | null = null;
    const { data: existingWishlist } = await admin
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingWishlist) {
      wishlistId = existingWishlist.id;
    } else {
      const { data: newWishlist, error } = await admin
        .from('wishlists')
        .insert({ user_id: userId })
        .select('id')
        .single();
      if (error || !newWishlist) return { success: false, error: error?.message };
      wishlistId = newWishlist.id;
    }

    // Replace items
    await admin.from('wishlist_items').delete().eq('wishlist_id', wishlistId);

    if (productIds.length > 0) {
      const rows = productIds.map((pid) => ({
        wishlist_id: wishlistId,
        product_id: pid,
      }));
      await admin.from('wishlist_items').insert(rows);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
