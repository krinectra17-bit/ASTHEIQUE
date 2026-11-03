import Link from 'next/link';
import { PRODUCTS } from '@/lib/data/mock-catalog';
import { ProductCard } from '@/components/storefront/product-card';
import { Search, Sparkles } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const results = query
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-aesthique-beige pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aesthique-copper font-semibold">
          <Search className="w-3.5 h-3.5 text-aesthique-gold" />
          <span>Search Results</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
          {query ? `Results for "${query}"` : 'Search Our Catalog'}
        </h1>
        <p className="text-xs text-aesthique-espresso/70">
          Showing {results.length} matching piece{results.length === 1 ? '' : 's'}.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4 max-w-xl mx-auto">
          <h3 className="font-editorial text-xl font-semibold text-aesthique-espresso">
            No essentials found for &quot;{query}&quot;
          </h3>
          <p className="text-xs text-aesthique-espresso/60">
            We recommend checking your spelling or trying general terms like &quot;Vase&quot;, &quot;Linen&quot;, or &quot;Brass&quot;.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest px-6 py-3 font-semibold hover:bg-black transition-colors"
            >
              Browse All Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
