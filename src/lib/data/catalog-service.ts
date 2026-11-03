import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, PRODUCTS } from './mock-catalog';
import { Category, Product, ProductVariant } from '@/types';

export interface ProductQueryOptions {
  search?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'newest' | 'bestseller' | 'rating';
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES;
    }

    return data.map((c: any) => ({
      id: c.id,
      parentId: c.parent_id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image_url,
      displayOrder: c.display_order,
      isActive: c.is_active,
    }));
  } catch {
    return CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.parentId === parentId);
}

/**
 * Enhanced product fetching with full-text search, filters, sorting and pagination
 */
export async function getPaginatedProducts(
  options: ProductQueryOptions = {}
): Promise<PaginatedProductsResult> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(100, options.limit || 24));

  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select(
        '*, categories(id, name, slug), product_images(image_url, is_primary, display_order), product_variants(*), inventory(*)',
        { count: 'exact' }
      )
      .eq('is_active', true);

    if (options.isFeatured) query = query.eq('is_featured', true);
    if (options.isBestseller) query = query.eq('is_bestseller', true);
    if (options.isNewArrival) query = query.eq('is_new_arrival', true);
    if (options.minPrice !== undefined) query = query.gte('regular_price', options.minPrice);
    if (options.maxPrice !== undefined) query = query.lte('regular_price', options.maxPrice);

    if (options.search && options.search.trim()) {
      const term = `%${options.search.trim()}%`;
      query = query.or(`name.ilike.${term},short_description.ilike.${term},sku.ilike.${term}`);
    }

    // Sort order
    switch (options.sortBy) {
      case 'price-low':
        query = query.order('regular_price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('regular_price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'bestseller':
        query = query.order('is_bestseller', { ascending: false }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback to in-memory filter
      return filterMockProducts(options, page, limit);
    }

    const mappedProducts: Product[] = data.map((p: any) => {
      const primaryImg =
        p.product_images?.find((img: any) => img.is_primary)?.image_url ||
        p.product_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80';

      const gallery = (p.product_images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.image_url);

      const baseInventory = p.inventory?.find((inv: any) => !inv.variant_id);
      const availableStock = baseInventory
        ? Math.max(0, baseInventory.stock_quantity - baseInventory.reserved_quantity)
        : 25;

      const variants: ProductVariant[] = (p.product_variants || []).map((v: any) => {
        const vInv = p.inventory?.find((inv: any) => inv.variant_id === v.id);
        const vStock = vInv
          ? Math.max(0, vInv.stock_quantity - vInv.reserved_quantity)
          : 15;

        return {
          id: v.id,
          productId: v.product_id,
          sku: v.sku,
          name: v.name,
          variantType: v.variant_type || 'Style',
          variantValue: v.variant_value,
          priceAdjustment: Number(v.price_adjustment || 0),
          imageUrl: v.image_url,
          isActive: v.is_active,
          stockQuantity: vStock,
        };
      });

      return {
        id: p.id,
        categoryId: p.category_id,
        categoryName: p.categories?.name,
        categorySlug: p.categories?.slug,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.short_description || '',
        fullDescription: p.full_description || '',
        regularPrice: Number(p.regular_price),
        salePrice: p.sale_price ? Number(p.sale_price) : null,
        weightInGrams: p.weight_in_grams,
        dimensionsCm: p.dimensions_cm || { length: 10, breadth: 10, height: 10 },
        specifications: p.specifications || [],
        careInstructions: p.care_instructions,
        isFeatured: p.is_featured,
        isBestseller: p.is_bestseller,
        isNewArrival: p.is_new_arrival,
        isActive: p.is_active,
        stockQuantity: availableStock,
        lowStockThreshold: baseInventory?.low_stock_threshold || 5,
        primaryImage: primaryImg,
        galleryImages: gallery.length > 0 ? gallery : [primaryImg],
        variants,
        rating: 4.9,
        reviewCount: 28,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });

    const total = count || mappedProducts.length;

    return {
      products: mappedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return filterMockProducts(options, page, limit);
  }
}

/**
 * Backward-compatible product list retrieval
 */
export async function getProducts(options?: ProductQueryOptions): Promise<Product[]> {
  const result = await getPaginatedProducts(options);
  return result.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(
        '*, categories(id, name, slug), product_images(image_url, is_primary, display_order), product_variants(*), inventory(*)'
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return PRODUCTS.find((p) => p.slug === slug) || null;
    }

    const primaryImg =
      data.product_images?.find((img: any) => img.is_primary)?.image_url ||
      data.product_images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80';

    const gallery = (data.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url);

    const baseInventory = data.inventory?.find((inv: any) => !inv.variant_id);
    const availableStock = baseInventory
      ? Math.max(0, baseInventory.stock_quantity - baseInventory.reserved_quantity)
      : 25;

    const variants: ProductVariant[] = (data.product_variants || []).map((v: any) => {
      const vInv = data.inventory?.find((inv: any) => inv.variant_id === v.id);
      return {
        id: v.id,
        productId: v.product_id,
        sku: v.sku,
        name: v.name,
        variantType: v.variant_type || 'Style',
        variantValue: v.variant_value,
        priceAdjustment: Number(v.price_adjustment || 0),
        imageUrl: v.image_url,
        isActive: v.is_active,
        stockQuantity: vInv
          ? Math.max(0, vInv.stock_quantity - vInv.reserved_quantity)
          : 15,
      };
    });

    return {
      id: data.id,
      categoryId: data.category_id,
      categoryName: data.categories?.name,
      categorySlug: data.categories?.slug,
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      shortDescription: data.short_description || '',
      fullDescription: data.full_description || '',
      regularPrice: Number(data.regular_price),
      salePrice: data.sale_price ? Number(data.sale_price) : null,
      weightInGrams: data.weight_in_grams,
      dimensionsCm: data.dimensions_cm || { length: 10, breadth: 10, height: 10 },
      specifications: data.specifications || [],
      careInstructions: data.care_instructions,
      isFeatured: data.is_featured,
      isBestseller: data.is_bestseller,
      isNewArrival: data.is_new_arrival,
      isActive: data.is_active,
      stockQuantity: availableStock,
      lowStockThreshold: baseInventory?.low_stock_threshold || 5,
      primaryImage: primaryImg,
      galleryImages: gallery.length > 0 ? gallery : [primaryImg],
      variants,
      rating: 4.9,
      reviewCount: 28,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Helper to filter mock catalog in memory
 */
function filterMockProducts(
  options: ProductQueryOptions,
  page: number,
  limit: number
): PaginatedProductsResult {
  let filtered = [...PRODUCTS];

  if (options.categorySlug && options.categorySlug !== 'all') {
    filtered = filtered.filter((p) => p.categorySlug === options.categorySlug);
  }
  if (options.isFeatured) {
    filtered = filtered.filter((p) => p.isFeatured);
  }
  if (options.isBestseller) {
    filtered = filtered.filter((p) => p.isBestseller);
  }
  if (options.isNewArrival) {
    filtered = filtered.filter((p) => p.isNewArrival);
  }
  if (options.minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.regularPrice) >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.regularPrice) <= options.maxPrice!);
  }
  if (options.inStockOnly) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }
  if (options.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (options.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => (a.salePrice ?? a.regularPrice) - (b.salePrice ?? b.regularPrice));
      break;
    case 'price-high':
      filtered.sort((a, b) => (b.salePrice ?? b.regularPrice) - (a.salePrice ?? a.regularPrice));
      break;
    case 'bestseller':
      filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    default:
      // featured
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = filtered.length;
  const from = (page - 1) * limit;
  const paginated = filtered.slice(from, from + limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
