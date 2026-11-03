import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, PRODUCTS } from './mock-catalog';
import { Category, Product } from '@/types';

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

export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
}): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*, categories(name, slug), product_images(image_url, is_primary, display_order), product_variants(*)')
      .eq('is_active', true);

    if (options?.isFeatured) query = query.eq('is_featured', true);
    if (options?.isBestseller) query = query.eq('is_bestseller', true);
    if (options?.isNewArrival) query = query.eq('is_new_arrival', true);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let filtered = [...PRODUCTS];
      if (options?.categorySlug) {
        filtered = filtered.filter((p) => p.categorySlug === options.categorySlug);
      }
      if (options?.isFeatured) {
        filtered = filtered.filter((p) => p.isFeatured);
      }
      if (options?.isBestseller) {
        filtered = filtered.filter((p) => p.isBestseller);
      }
      if (options?.isNewArrival) {
        filtered = filtered.filter((p) => p.isNewArrival);
      }
      return filtered;
    }

    return data.map((p: any) => {
      const primaryImg =
        p.product_images?.find((img: any) => img.is_primary)?.image_url ||
        p.product_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80';

      const gallery = (p.product_images || []).map((img: any) => img.image_url);

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
        stockQuantity: 25,
        lowStockThreshold: 5,
        primaryImage: primaryImg,
        galleryImages: gallery.length > 0 ? gallery : [primaryImg],
        variants: (p.product_variants || []).map((v: any) => ({
          id: v.id,
          productId: v.product_id,
          sku: v.sku,
          name: v.name,
          variantType: v.variant_type,
          variantValue: v.variant_value,
          priceAdjustment: Number(v.price_adjustment || 0),
          imageUrl: v.image_url,
          isActive: v.is_active,
          stockQuantity: 15,
        })),
        rating: 4.9,
        reviewCount: 28,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}
