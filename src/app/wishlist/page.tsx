'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/store-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, moveToCart, toggleWishlist } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-aesthique-beige pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
          Saved Wishlist
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Curated items saved for future purchase or home sanctuary planning.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-aesthique-espresso">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-aesthique-espresso/70">
            Explore our collections and tap the heart icon on any essential to preserve it here.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="primary" size="md">
                Explore Collections
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-aesthique-beige flex flex-col justify-between group shadow-sm hover:shadow-luxury transition-all"
            >
              <div className="relative aspect-square w-full bg-aesthique-ivory overflow-hidden">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-aesthique-copper font-medium">
                    {product.categoryName}
                  </span>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-editorial text-sm font-semibold text-aesthique-espresso hover:text-aesthique-copper transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-bold text-aesthique-espresso mt-1">
                    {formatPrice(product.salePrice ?? product.regularPrice)}
                  </p>
                </div>

                <div className="pt-2 border-t border-aesthique-beige/50">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => moveToCart(product)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-aesthique-gold" />
                    <span>Move to Bag</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
