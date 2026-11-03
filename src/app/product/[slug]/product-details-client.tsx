'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useStore } from '@/context/store-context';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PincodeChecker } from '@/components/storefront/pincode-checker';
import { ProductCard } from '@/components/storefront/product-card';
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>(product.primaryImage);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care'>('details');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const effectivePrice =
    (product.salePrice ?? product.regularPrice) + (selectedVariant?.priceAdjustment ?? 0);
  const originalPrice = product.regularPrice + (selectedVariant?.priceAdjustment ?? 0);
  const discountPercent = calculateDiscount(originalPrice, product.salePrice ? effectivePrice : null);
  const maxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariantId);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariantId);
    router.push('/checkout');
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    const variant = product.variants?.find((v) => v.id === variantId);
    if (variant?.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-aesthique-espresso/60 uppercase tracking-widest font-medium">
        <Link href="/" className="hover:text-aesthique-copper transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-aesthique-copper" />
        <Link href="/shop" className="hover:text-aesthique-copper transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3 text-aesthique-copper" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-aesthique-copper transition-colors"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-aesthique-copper" />
        <span className="text-aesthique-espresso font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery */}
        <div className="space-y-4">
          {/* Main Visual with Zoom Icon */}
          <div className="relative aspect-square w-full bg-aesthique-ivory border border-aesthique-beige overflow-hidden group">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-aesthique-espresso rounded-full shadow-md transition-transform hover:scale-110"
              aria-label="Enlarge image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {product.isBestseller && (
                <span className="bg-aesthique-espresso text-aesthique-ivory text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5">
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-amber-800 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5">
                  {discountPercent}% Off
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[product.primaryImage, ...(product.galleryImages || [])].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  'relative w-20 h-20 flex-shrink-0 bg-aesthique-ivory border transition-all overflow-hidden',
                  selectedImage === img
                    ? 'border-aesthique-copper ring-1 ring-aesthique-copper'
                    : 'border-aesthique-beige hover:border-aesthique-gold/60 opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Information & Purchase Actions */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-aesthique-beige pb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
              {product.categoryName} • SKU: {product.sku}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-aesthique-espresso">
              {product.name}
            </h1>

            {/* Star Ratings */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-aesthique-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.rating || 5)
                        ? 'fill-aesthique-gold text-aesthique-gold'
                        : 'text-aesthique-beige fill-aesthique-beige'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-aesthique-espresso/70 font-medium">
                {product.rating} ({product.reviewCount} verified reviews)
              </span>
            </div>

            {/* Price block */}
            <div className="pt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-aesthique-espresso">
                {formatPrice(effectivePrice)}
              </span>
              {product.salePrice && (
                <span className="text-base text-aesthique-espresso/40 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs text-amber-800 font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-aesthique-espresso/60">
              MRP inclusive of all taxes. Free shipping on orders over ₹1,999.
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed font-normal">
            {product.shortDescription}
          </p>

          {/* Variants Selection (if any) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider font-semibold text-aesthique-espresso">
                  Select {product.variants[0].variantType}:
                </span>
                <span className="text-aesthique-copper font-medium">
                  {selectedVariant?.variantValue}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v.id)}
                    className={cn(
                      'px-4 py-2 text-xs uppercase tracking-wider transition-all border font-medium flex items-center gap-2',
                      selectedVariantId === v.id
                        ? 'border-aesthique-espresso bg-aesthique-espresso text-aesthique-ivory shadow-sm'
                        : 'border-aesthique-beige bg-white text-aesthique-espresso hover:border-aesthique-gold'
                    )}
                  >
                    <span>{v.variantValue}</span>
                    {v.priceAdjustment > 0 && (
                      <span className="text-[10px] opacity-70">
                        (+{formatPrice(v.priceAdjustment)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Stock Indicator */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-semibold text-aesthique-espresso">
                Quantity
              </span>
              <span
                className={cn(
                  'text-[11px] font-medium flex items-center gap-1',
                  maxStock > 5 ? 'text-emerald-800' : 'text-amber-800 font-bold'
                )}
              >
                <Check className="w-3.5 h-3.5" />
                {maxStock > 5 ? 'In Stock (Ready for Dispatch)' : `Only ${maxStock} left in stock`}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-aesthique-beige bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-aesthique-espresso hover:bg-aesthique-ivory transition-colors text-sm font-semibold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-aesthique-espresso">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  disabled={quantity >= maxStock}
                  className="px-3 py-2 text-aesthique-espresso hover:bg-aesthique-ivory disabled:opacity-30 transition-colors text-sm font-semibold"
                >
                  +
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'p-3 border transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-semibold',
                  isWishlisted
                    ? 'border-aesthique-copper bg-aesthique-copper/10 text-aesthique-copper'
                    : 'border-aesthique-beige bg-white text-aesthique-espresso hover:border-aesthique-gold'
                )}
              >
                <Heart className={cn('w-4 h-4', isWishlisted && 'fill-aesthique-copper')} />
                <span className="hidden sm:inline">
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-aesthique-gold" />
              <span>Add to Bag</span>
            </Button>
            <Button variant="gold" size="lg" onClick={handleBuyNow} className="w-full">
              Buy Now
            </Button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="pt-4">
            <PincodeChecker />
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-aesthique-beige text-center">
            <div className="p-3 bg-white border border-aesthique-beige/60 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-aesthique-copper" />
              <span className="text-[10px] uppercase font-semibold text-aesthique-espresso block">
                Pan-India Express
              </span>
              <span className="text-[9px] text-aesthique-espresso/60 block">Free over ₹1,999</span>
            </div>
            <div className="p-3 bg-white border border-aesthique-beige/60 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-aesthique-copper" />
              <span className="text-[10px] uppercase font-semibold text-aesthique-espresso block">
                100% Authentic
              </span>
              <span className="text-[9px] text-aesthique-espresso/60 block">Studio Crafted</span>
            </div>
            <div className="p-3 bg-white border border-aesthique-beige/60 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-aesthique-copper" />
              <span className="text-[10px] uppercase font-semibold text-aesthique-espresso block">
                Damage Replacement
              </span>
              <span className="text-[9px] text-aesthique-espresso/60 block">7-Day Transit Shield</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Full Description, Specifications, Care */}
      <div className="bg-white border border-aesthique-beige p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-aesthique-beige gap-6">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              'pb-3 text-xs uppercase tracking-widest font-semibold transition-colors relative',
              activeTab === 'details'
                ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
                : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
            )}
          >
            Editorial Details
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={cn(
              'pb-3 text-xs uppercase tracking-widest font-semibold transition-colors relative',
              activeTab === 'specs'
                ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
                : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
            )}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={cn(
              'pb-3 text-xs uppercase tracking-widest font-semibold transition-colors relative',
              activeTab === 'care'
                ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
                : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
            )}
          >
            Care & Maintenance
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed max-w-3xl">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.fullDescription}</p>
              <div className="p-4 bg-aesthique-ivory/60 border border-aesthique-beige text-xs space-y-1">
                <span className="font-semibold text-aesthique-espresso block">
                  Dimensions & Weight
                </span>
                <p>
                  Length: {product.dimensionsCm.length} cm • Breadth: {product.dimensionsCm.breadth}{' '}
                  cm • Height: {product.dimensionsCm.height} cm
                </p>
                <p>Package Dead Weight: {product.weightInGrams} grams</p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="divide-y divide-aesthique-beige/60">
              {product.specifications.map((spec, i) => (
                <div key={i} className="py-2.5 flex justify-between text-xs">
                  <span className="font-semibold text-aesthique-espresso">{spec.label}</span>
                  <span className="text-aesthique-espresso/70">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-2">
              <p>{product.careInstructions || 'Wipe gently with a dry or lightly dampened microfiber cloth.'}</p>
              <p className="text-xs text-aesthique-copper">
                For prolonged life, avoid aggressive chemical detergents or prolonged immersion in water.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex justify-between items-end pb-3 border-b border-aesthique-beige">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
                Curated Harmonies
              </span>
              <h2 className="font-editorial text-2xl font-bold text-aesthique-espresso">
                You May Also Admire
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-aesthique-gold p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full aspect-square">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
};
