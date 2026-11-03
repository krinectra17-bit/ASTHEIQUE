'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { PRODUCTS } from '@/lib/data/mock-catalog';
import { formatPrice } from '@/lib/utils';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Ceramic Vase',
  'Linen Throw',
  'Brass Dripper',
  'Soy Candle',
  'Valet Tray',
  'Leather Portfolio',
  'Sandalwood Wash',
  'Wall Clock',
];

export const SearchModal: React.FC = () => {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
        <div className="relative w-full max-w-2xl bg-aesthique-ivory shadow-2xl border border-aesthique-beige animate-slide-up overflow-hidden">
          {/* Search Header */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3 p-4 sm:p-5 border-b border-aesthique-beige bg-white"
          >
            <Search className="w-5 h-5 text-aesthique-copper flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search products, materials, collections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-aesthique-espresso/40 hover:text-aesthique-espresso p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-xs uppercase tracking-wider text-aesthique-copper hover:underline font-semibold ml-2"
            >
              Close
            </button>
          </form>

          {/* Body Content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-aesthique-copper font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularClick(term)}
                      className="px-3.5 py-1.5 bg-white border border-aesthique-beige hover:border-aesthique-gold text-xs text-aesthique-espresso hover:text-aesthique-copper transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center text-aesthique-espresso/60 space-y-2">
                <p className="font-editorial text-base text-aesthique-espresso">No matches found for &quot;{query}&quot;</p>
                <p className="text-xs">Try searching by category, material, or color.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-aesthique-espresso/60 pb-2 border-b border-aesthique-beige/40">
                  <span>Results ({searchResults.length})</span>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-aesthique-copper hover:underline font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <div className="divide-y divide-aesthique-beige/40">
                  {searchResults.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-white transition-colors group"
                    >
                      <div className="relative w-12 h-12 bg-aesthique-ivory flex-shrink-0 overflow-hidden">
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-editorial text-xs sm:text-sm font-semibold text-aesthique-espresso truncate group-hover:text-aesthique-copper transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-aesthique-copper/80">
                          {product.categoryName} • {product.sku}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-semibold text-aesthique-espresso">
                          {formatPrice(product.salePrice ?? product.regularPrice)}
                        </span>
                        {product.salePrice && (
                          <span className="block text-[10px] text-aesthique-espresso/40 line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
