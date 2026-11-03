import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Compass, Feather, Clock, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Header */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-aesthique-cream overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80"
            alt="AESTHIQUE Studio Philosophy"
            fill
            priority
            className="object-cover object-center filter brightness-[0.75]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aesthique-espresso via-aesthique-espresso/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-aesthique-gold font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Philosophy</span>
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-aesthique-ivory tracking-tight">
            Little Things, Better Living.
          </h1>
          <p className="text-xs sm:text-sm text-aesthique-ivory/80 max-w-2xl mx-auto leading-relaxed">
            AESTHIQUE was founded on a simple conviction: the objects that inhabit our intimate daily spaces shape our tranquility, our presence, and our sense of home.
          </p>
        </div>
      </section>

      {/* Brand Story Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-aesthique-espresso">
              Elevating the Ordinary.
            </h2>
            <p>
              In a culture dominated by disposable novelties and hurried mass production, AESTHIQUE stands for intentional slowness. We believe that an essential tool — be it a coffee dripper, a hand-thrown stoneware bowl, or a linen throw — should bring quiet joy each time it is held.
            </p>
            <p>
              We collaborate with skilled Indian ceramicists, heirloom woodcarvers, and ethical textile weavers to create objects that bridge traditional craft with minimalist modern design.
            </p>
          </div>

          <div className="relative aspect-[4/5] bg-aesthique-ivory border border-aesthique-beige overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
              alt="Artisanal Ceramics in Studio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="pt-8 border-t border-aesthique-beige space-y-8">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="font-editorial text-2xl font-bold text-aesthique-espresso">
              The Three Tenets
            </h3>
            <p className="text-xs text-aesthique-espresso/70">
              Guiding every collection we release to our patrons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-aesthique-beige p-6 space-y-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Tactile Integrity
              </h4>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Raw stoneware, solid brass, unbleached linen, and vegetable-tanned leather that age gracefully with daily use.
              </p>
            </div>

            <div className="bg-white border border-aesthique-beige p-6 space-y-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Quiet Aesthetics
              </h4>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                No loud logos or ostentatious branding. Only harmonious earth tones, warm metallics, and balanced proportions.
              </p>
            </div>

            <div className="bg-white border border-aesthique-beige p-6 space-y-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-base font-semibold text-aesthique-espresso">
                Long-Term Utility
              </h4>
              <p className="text-xs text-aesthique-espresso/70 leading-relaxed">
                Objects that maintain relevance beyond fleeting decor trends, serving daily purposes for years to come.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4 text-aesthique-gold" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
