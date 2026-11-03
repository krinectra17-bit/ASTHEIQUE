'use client';

import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '@/lib/data/mock-catalog';
import { ProductCard } from '@/components/storefront/product-card';
import { SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopAllPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Price filter
      const effectivePrice = p.salePrice ?? p.regularPrice;
      if (priceRange === 'under-1500' && effectivePrice >= 1500) return false;
      if (priceRange === '1500-3000' && (effectivePrice < 1500 || effectivePrice > 3000)) return false;
      if (priceRange === 'above-3000' && effectivePrice <= 3000) return false;

      // In stock
      if (inStockOnly && p.stockQuantity <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.regularPrice;
      const priceB = b.salePrice ?? b.regularPrice;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'bestseller') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, priceRange, sortBy, inStockOnly]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Editorial Page Header */}
      <div className="border-b border-aesthique-beige pb-6 space-y-2">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
          <span>Complete Catalog</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-aesthique-espresso">
          The Full Collection
        </h1>
        <p className="text-xs sm:text-sm text-aesthique-espresso/70 max-w-2xl">
          Discover our entire selection of artisanal homeware, kitchen craft, grounding textiles, and everyday luxuries.
        </p>
      </div>

      {/* Control Bar: Filters & Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-aesthique-beige/70 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="inline-flex items-center gap-2 bg-aesthique-ivory border border-aesthique-beige px-4 py-2 text-xs uppercase tracking-wider font-semibold text-aesthique-espresso hover:border-aesthique-gold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-aesthique-copper" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 bg-aesthique-copper text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-aesthique-copper hover:underline uppercase tracking-wider font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-aesthique-espresso/60 hidden sm:inline">
            Showing <strong className="text-aesthique-espresso">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sortSelect" className="text-aesthique-espresso/70 uppercase tracking-wider text-[11px] font-medium">
              Sort By:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-aesthique-ivory border border-aesthique-beige px-3 py-2 text-xs text-aesthique-espresso font-medium focus:outline-none focus:border-aesthique-gold uppercase tracking-wider"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest First</option>
              <option value="bestseller">Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4">
          <h3 className="font-editorial text-xl font-semibold text-aesthique-espresso">
            No essentials match your filter criteria
          </h3>
          <p className="text-xs text-aesthique-espresso/60 max-w-sm mx-auto">
            Try adjusting your price range or selected collection to view more products.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest px-6 py-3 font-semibold hover:bg-black transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Filter Modal / Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-aesthique-beige">
                  <h3 className="font-editorial text-lg font-bold text-aesthique-espresso">
                    Refine Selection
                  </h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 text-aesthique-espresso/60 hover:text-aesthique-espresso"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-aesthique-copper">
                    Collection
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        'block w-full text-left text-xs py-1.5 px-2 transition-colors',
                        selectedCategory === 'all'
                          ? 'bg-aesthique-ivory text-aesthique-copper font-semibold'
                          : 'text-aesthique-espresso/80 hover:text-aesthique-copper'
                      )}
                    >
                      All Collections ({PRODUCTS.length})
                    </button>
                    {CATEGORIES.map((cat) => {
                      const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={cn(
                            'block w-full text-left text-xs py-1.5 px-2 transition-colors flex justify-between',
                            selectedCategory === cat.slug
                              ? 'bg-aesthique-ivory text-aesthique-copper font-semibold'
                              : 'text-aesthique-espresso/80 hover:text-aesthique-copper'
                          )}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-aesthique-espresso/50">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2 pt-4 border-t border-aesthique-beige">
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-aesthique-copper">
                    Price Range
                  </h4>
                  <div className="space-y-1 text-xs">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: 'under-1500', label: 'Under ₹1,500' },
                      { id: '1500-3000', label: '₹1,500 - ₹3,000' },
                      { id: 'above-3000', label: 'Over ₹3,000' },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setPriceRange(range.id)}
                        className={cn(
                          'block w-full text-left py-1.5 px-2 transition-colors',
                          priceRange === range.id
                            ? 'bg-aesthique-ivory text-aesthique-copper font-semibold'
                            : 'text-aesthique-espresso/80 hover:text-aesthique-copper'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="pt-4 border-t border-aesthique-beige flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-medium text-aesthique-espresso">
                    In-Stock Items Only
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-aesthique-gold cursor-pointer"
                  />
                </div>
              </div>

              {/* Drawer Apply Button */}
              <div className="pt-6 border-t border-aesthique-beige">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest font-semibold py-3 hover:bg-black transition-colors"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
