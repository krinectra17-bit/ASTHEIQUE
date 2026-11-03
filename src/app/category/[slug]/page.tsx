import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProducts } from '@/lib/data/catalog-service';
import { ProductCard } from '@/components/storefront/product-card';
import { Sparkles, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found | AESTHIQUE' };

  return {
    title: `${category.name} | AESTHIQUE`,
    description: category.description || `Explore ${category.name} at AESTHIQUE.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProducts({ categorySlug: slug });

  return (
    <div className="space-y-12 pb-16">
      {/* Category Hero Banner */}
      <section className="relative min-h-[35vh] sm:min-h-[42vh] flex items-center justify-center bg-aesthique-espresso overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80'}
            alt={category.name}
            fill
            priority
            className="object-cover object-center filter brightness-[0.75]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aesthique-espresso via-aesthique-espresso/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-aesthique-ivory/70 uppercase tracking-widest font-medium">
            <Link href="/" className="hover:text-aesthique-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-aesthique-gold" />
            <Link href="/shop" className="hover:text-aesthique-gold transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3 h-3 text-aesthique-gold" />
            <span className="text-aesthique-gold font-semibold">{category.name}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-aesthique-ivory tracking-tight">
            {category.name}
          </h1>

          <p className="text-xs sm:text-sm text-aesthique-ivory/85 max-w-xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* Product Grid Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-aesthique-beige">
          <div className="text-xs uppercase tracking-wider text-aesthique-copper font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
            <span>Curated Items ({categoryProducts.length})</span>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-aesthique-espresso hover:text-aesthique-copper font-medium transition-colors"
          >
            Explore Other Collections →
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4">
            <h3 className="font-editorial text-lg text-aesthique-espresso font-semibold">
              New curations arriving shortly
            </h3>
            <p className="text-xs text-aesthique-espresso/60 max-w-sm mx-auto">
              Our studio team is currently finalizing upcoming batches for this collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest px-6 py-3 font-semibold hover:bg-black transition-colors"
            >
              Browse All Essentials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
