'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useStore } from '@/context/store-context';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.regularPrice, product.salePrice);
  const secondaryImage = product.galleryImages?.[1] || product.primaryImage;

  return (
    <div
      className="group flex flex-col bg-white border border-aesthique-beige/50 hover:border-aesthique-gold/50 transition-all duration-300 shadow-sm hover:shadow-luxury relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-aesthique-ivory overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? secondaryImage : product.primaryImage}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-aesthique-espresso text-aesthique-ivory text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-aesthique-gold text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-sm">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-800 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 shadow-sm">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 shadow-sm',
            isWishlisted
              ? 'bg-aesthique-espresso text-aesthique-gold'
              : 'bg-white/90 text-aesthique-espresso/70 hover:text-aesthique-copper hover:bg-white'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={cn('w-4 h-4', isWishlisted && 'fill-aesthique-gold')} />
        </button>

        {/* Quick Add To Cart Button (Overlay on desktop, sticky on hover) */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="w-full flex items-center justify-center gap-2 bg-aesthique-espresso/95 hover:bg-black text-aesthique-ivory text-xs uppercase tracking-widest font-semibold py-2.5 shadow-lg backdrop-blur-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-aesthique-gold" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] uppercase tracking-widest text-aesthique-copper font-medium block">
            {product.categoryName}
          </span>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group/title mt-1">
            <h3 className="font-editorial text-sm sm:text-base font-semibold text-aesthique-espresso group-hover/title:text-aesthique-copper transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center text-aesthique-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      i < Math.floor(product.rating!)
                        ? 'fill-aesthique-gold text-aesthique-gold'
                        : 'text-aesthique-beige fill-aesthique-beige'
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-aesthique-espresso/60">
                ({product.reviewCount ?? 0})
              </span>
            </div>
          )}
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-2 border-t border-aesthique-beige/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-aesthique-espresso">
              {formatPrice(product.salePrice ?? product.regularPrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-aesthique-espresso/40 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            onClick={() => addToCart(product, 1)}
            className="sm:hidden p-2 text-aesthique-espresso hover:text-aesthique-copper bg-aesthique-ivory rounded-none"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
