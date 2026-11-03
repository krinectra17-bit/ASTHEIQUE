import { getAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { PRODUCTS } from '@/lib/data/mock-catalog';

export interface StockCheckItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface StockAvailabilityResult {
  allAvailable: boolean;
  items: {
    productId: string;
    variantId?: string | null;
    requestedQuantity: number;
    availableStock: number;
    isSufficient: boolean;
  }[];
}

export interface LowStockAlert {
  inventoryId: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string | null;
  variantName?: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  availableStock: number;
  lowStockThreshold: number;
}

// In-memory inventory store for local mock mode fallback
const mockInventoryStore = new Map<
  string,
  { stock: number; reserved: number; threshold: number }
>();

// Initialize mock store from PRODUCTS
PRODUCTS.forEach((p) => {
  mockInventoryStore.set(`prod_${p.id}`, {
    stock: p.stockQuantity || 25,
    reserved: 0,
    threshold: p.lowStockThreshold || 5,
  });
  p.variants?.forEach((v) => {
    mockInventoryStore.set(`var_${v.id}`, {
      stock: v.stockQuantity || 15,
      reserved: 0,
      threshold: 3,
    });
  });
});

/**
 * Checks whether the requested quantities are available in stock.
 */
export async function checkStockAvailability(
  items: StockCheckItem[]
): Promise<StockAvailabilityResult> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin.rpc('check_stock_availability', {
        p_items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId || null,
          quantity: i.quantity,
        })),
      });

      if (!error && data) {
        return {
          allAvailable: data.all_available,
          items: (data.items || []).map((it: any) => ({
            productId: it.product_id,
            variantId: it.variant_id,
            requestedQuantity: it.requested_quantity,
            availableStock: it.available_stock,
            isSufficient: it.is_sufficient,
          })),
        };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Resilient fallback logic
  let allAvailable = true;
  const itemResults = items.map((item) => {
    const key = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;
    const inv = mockInventoryStore.get(key) || { stock: 25, reserved: 0, threshold: 5 };
    const available = Math.max(0, inv.stock - inv.reserved);
    const isSufficient = available >= item.quantity;
    if (!isSufficient) allAvailable = false;

    return {
      productId: item.productId,
      variantId: item.variantId,
      requestedQuantity: item.quantity,
      availableStock: available,
      isSufficient,
    };
  });

  return {
    allAvailable,
    items: itemResults,
  };
}

/**
 * Atomically reserves inventory during checkout attempt.
 */
export async function reserveStock(
  items: StockCheckItem[],
  referenceId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin.rpc('reserve_stock', {
        p_items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId || null,
          quantity: i.quantity,
        })),
        p_reference_id: referenceId,
      });

      if (!error && data) {
        return { success: data.success, error: data.error };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: reserve in mock memory
  // 1. Verify
  for (const item of items) {
    const key = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;
    const inv = mockInventoryStore.get(key) || { stock: 25, reserved: 0, threshold: 5 };
    if (inv.stock - inv.reserved < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for product ${item.productId}`,
      };
    }
  }

  // 2. Reserve
  for (const item of items) {
    const key = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;
    const inv = mockInventoryStore.get(key) || { stock: 25, reserved: 0, threshold: 5 };
    inv.reserved += item.quantity;
    mockInventoryStore.set(key, inv);
  }

  return { success: true };
}

/**
 * Releases previously reserved inventory upon cancellation or timeout.
 */
export async function releaseStock(
  items: StockCheckItem[],
  referenceId: string,
  reason = 'Checkout timeout or user abandoned'
): Promise<{ success: boolean; error?: string }> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin.rpc('release_stock', {
        p_items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId || null,
          quantity: i.quantity,
        })),
        p_reference_id: referenceId,
        p_reason: reason,
      });

      if (!error && data) {
        return { success: data.success, error: data.error };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: release in mock memory
  for (const item of items) {
    const key = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;
    const inv = mockInventoryStore.get(key);
    if (inv) {
      inv.reserved = Math.max(0, inv.reserved - item.quantity);
      mockInventoryStore.set(key, inv);
    }
  }

  return { success: true };
}

/**
 * Commits stock reservation upon successful payment or confirmed COD order.
 */
export async function commitStock(
  items: StockCheckItem[],
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin.rpc('commit_stock_reservation', {
        p_items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId || null,
          quantity: i.quantity,
        })),
        p_order_id: orderId,
      });

      if (!error && data) {
        return { success: data.success, error: data.error };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: commit in mock memory
  for (const item of items) {
    const key = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;
    const inv = mockInventoryStore.get(key);
    if (inv) {
      inv.stock = Math.max(0, inv.stock - item.quantity);
      inv.reserved = Math.max(0, inv.reserved - item.quantity);
      mockInventoryStore.set(key, inv);
    }
  }

  return { success: true };
}

/**
 * Returns low stock alerts for the admin dashboard or inventory monitoring.
 */
export async function getLowStockAlerts(
  customThreshold?: number
): Promise<LowStockAlert[]> {
  const admin = getAdminClient();

  if (admin) {
    try {
      const { data, error } = await admin.rpc('get_low_stock_products', {
        p_custom_threshold: customThreshold || null,
      });

      if (!error && data) {
        return data.map((d: any) => ({
          inventoryId: d.inventory_id,
          productId: d.product_id,
          productName: d.product_name,
          productSku: d.product_sku,
          variantId: d.variant_id,
          variantName: d.variant_name,
          stockQuantity: d.stock_quantity,
          reservedQuantity: d.reserved_quantity,
          availableStock: d.available_stock,
          lowStockThreshold: d.low_stock_threshold,
        }));
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: search in mock store
  const alerts: LowStockAlert[] = [];
  PRODUCTS.forEach((p) => {
    const pKey = `prod_${p.id}`;
    const pInv = mockInventoryStore.get(pKey) || {
      stock: p.stockQuantity,
      reserved: 0,
      threshold: p.lowStockThreshold,
    };
    const available = pInv.stock - pInv.reserved;
    const threshold = customThreshold ?? pInv.threshold;

    if (available <= threshold) {
      alerts.push({
        inventoryId: `inv_${p.id}`,
        productId: p.id,
        productName: p.name,
        productSku: p.sku,
        stockQuantity: pInv.stock,
        reservedQuantity: pInv.reserved,
        availableStock: available,
        lowStockThreshold: threshold,
      });
    }

    p.variants?.forEach((v) => {
      const vKey = `var_${v.id}`;
      const vInv = mockInventoryStore.get(vKey) || {
        stock: v.stockQuantity,
        reserved: 0,
        threshold: 3,
      };
      const vAvailable = vInv.stock - vInv.reserved;
      const vThreshold = customThreshold ?? vInv.threshold;

      if (vAvailable <= vThreshold) {
        alerts.push({
          inventoryId: `inv_var_${v.id}`,
          productId: p.id,
          productName: p.name,
          productSku: v.sku,
          variantId: v.id,
          variantName: v.name,
          stockQuantity: vInv.stock,
          reservedQuantity: vInv.reserved,
          availableStock: vAvailable,
          lowStockThreshold: vThreshold,
        });
      }
    });
  });

  return alerts;
}
