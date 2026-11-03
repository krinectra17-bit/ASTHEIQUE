import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES, PRODUCTS, VERIFIED_REVIEWS } from '@/lib/data/mock-catalog';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Feather,
  Clock,
  Compass,
  Star,
  ShieldCheck,
  Instagram,
} from 'lucide-react';

export default function HomePage() {
  const bestsellerProducts = PRODUCTS.filter((p) => p.isBestseller);
  const newArrivalProducts = PRODUCTS.filter((p) => p.isNewArrival);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SECTION 3: HERO */}
      <section className="relative min-h-[82vh] flex items-center justify-center bg-aesthique-cream overflow-hidden">
        {/* Background Image with warm gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="AESTHIQUE Warm Interior Living"
            fill
            priority
            className="object-cover object-center filter brightness-[0.92]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aesthique-espresso/70 via-aesthique-espresso/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-aesthique-ivory/15 backdrop-blur-md border border-aesthique-gold/40 px-3.5 py-1 text-aesthique-gold text-xs uppercase tracking-[0.25em] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AESTHIQUE Essentials 2026</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-aesthique-ivory font-bold leading-[1.15] tracking-tight">
              Make Everyday Living Beautiful.
            </h1>

            <p className="text-sm sm:text-base text-aesthique-ivory/90 leading-relaxed font-normal max-w-xl">
              Thoughtfully selected essentials for a more beautiful, comfortable and effortless everyday life.
              Elevate your home rituals through textural French linens, hand-thrown ceramics, and heirloom brass.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/category/home-and-living">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-aesthique-espresso"
                >
                  Shop Living
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-aesthique-beige pb-4 gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
              Curated Taxonomy
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso mt-1">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-aesthique-copper hover:text-aesthique-espresso font-semibold flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden bg-white border border-aesthique-beige/70 hover:border-aesthique-gold transition-all duration-300 shadow-sm hover:shadow-luxury flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-aesthique-ivory">
                <Image
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aesthique-espresso/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className="p-3 bg-white flex flex-col items-center text-center">
                <h3 className="font-editorial text-xs sm:text-sm font-semibold text-aesthique-espresso group-hover:text-aesthique-copper transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[9px] uppercase tracking-wider text-aesthique-copper mt-0.5">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5: BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-aesthique-beige pb-4 gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
              Customer Favorites
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso mt-1">
              Bestsellers
            </h2>
          </div>
          <Link
            href="/shop?sort=bestseller"
            className="text-xs uppercase tracking-widest text-aesthique-copper hover:text-aesthique-espresso font-semibold flex items-center gap-1 group"
          >
            <span>Explore All Bestsellers</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 7: EDITORIAL PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-aesthique-espresso text-aesthique-ivory overflow-hidden border border-aesthique-gold/30 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-14 lg:p-16 space-y-6 z-10">
              <span className="text-xs uppercase tracking-[0.3em] text-aesthique-gold font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Editorial Campaign
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                The Quiet Luxury of Everyday Function.
              </h2>
              <p className="text-xs sm:text-sm text-aesthique-ivory/80 leading-relaxed font-normal">
                True elegance is not grand or ornamental. It is found in objects you reach for every morning —
                the weight of a hand-cast dripper, the breathability of pure French linen, the scent of woodsmoke in the twilight.
              </p>
              <div className="pt-2">
                <Link href="/category/home-decor">
                  <Button variant="gold" size="md">
                    Shop The Collection
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-[480px] w-full">
              <Image
                src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80"
                alt="AESTHIQUE Editorial Decor"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aesthique-espresso lg:bg-gradient-to-r lg:from-aesthique-espresso lg:via-transparent to-transparent opacity-80 lg:opacity-100" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-aesthique-beige pb-4 gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
              Recent Studio Releases
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs uppercase tracking-widest text-aesthique-copper hover:text-aesthique-espresso font-semibold flex items-center gap-1 group"
          >
            <span>Explore All New Arrivals</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 8: WHY AESTHIQUE */}
      <section className="bg-white border-y border-aesthique-beige/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold">
              The AESTHIQUE Standard
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso">
              Why AESTHIQUE
            </h2>
            <p className="text-xs text-aesthique-espresso/70">
              Every piece in our catalog is governed by four unwavering brand principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-aesthique-ivory/60 border border-aesthique-beige/60 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-aesthique-gold/40 flex items-center justify-center text-aesthique-copper shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Thoughtfully Selected
              </h3>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Curated deliberately. We release only pieces that serve real daily purposes with enduring appeal.
              </p>
            </div>

            <div className="text-center p-6 bg-aesthique-ivory/60 border border-aesthique-beige/60 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-aesthique-gold/40 flex items-center justify-center text-aesthique-copper shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Everyday Functionality
              </h3>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Beauty without utility is mere decoration. Our goods are engineered to withstand daily handling.
              </p>
            </div>

            <div className="text-center p-6 bg-aesthique-ivory/60 border border-aesthique-beige/60 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-aesthique-gold/40 flex items-center justify-center text-aesthique-copper shadow-sm">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Beautifully Designed
              </h3>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Quiet proportions, natural tactile textures, and subtle champagne gold warmth in every nuance.
              </p>
            </div>

            <div className="text-center p-6 bg-aesthique-ivory/60 border border-aesthique-beige/60 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-aesthique-gold/40 flex items-center justify-center text-aesthique-copper shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Everyday Convenience
              </h3>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Reliable pan-India delivery, clear tracking updates, and dedicated concierge customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold">
            Real Experiences
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso">
            What Our Patrons Say
          </h2>
          <p className="text-xs text-aesthique-espresso/70">
            Read authentic feedback from verified customers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VERIFIED_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-aesthique-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-aesthique-gold text-aesthique-gold" />
                  ))}
                </div>
                <h4 className="font-editorial text-base font-semibold text-aesthique-espresso">
                  &quot;{rev.headline}&quot;
                </h4>
                <p className="text-xs text-aesthique-espresso/80 leading-relaxed">
                  {rev.reviewText}
                </p>
              </div>

              <div className="pt-4 border-t border-aesthique-beige/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-aesthique-espresso">{rev.authorName}</span>
                {rev.isVerifiedPurchase && (
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5" />
            @aesthique.living
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso">
            Living With AESTHIQUE
          </h2>
          <p className="text-xs text-aesthique-espresso/70">
            Tag us in your home spaces to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
          ].map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden bg-aesthique-ivory group border border-aesthique-beige"
            >
              <Image
                src={imgUrl}
                alt={`AESTHIQUE Lifestyle Gallery ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-aesthique-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
