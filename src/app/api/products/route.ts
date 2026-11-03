import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedProducts } from '@/lib/data/catalog-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || searchParams.get('q') || undefined;
    const categorySlug = searchParams.get('category') || undefined;
    const subcategorySlug = searchParams.get('subcategory') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStockOnly = searchParams.get('inStock') === 'true';
    const isFeatured = searchParams.get('featured') === 'true';
    const isBestseller = searchParams.get('bestseller') === 'true';
    const isNewArrival = searchParams.get('newArrival') === 'true';
    const sortBy = (searchParams.get('sort') || 'featured') as any;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 24;

    const result = await getPaginatedProducts({
      search,
      categorySlug,
      subcategorySlug,
      minPrice,
      maxPrice,
      inStockOnly,
      isFeatured,
      isBestseller,
      isNewArrival,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
