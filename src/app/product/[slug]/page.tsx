import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/data/catalog-service';
import { ProductDetailsClient } from './product-details-client';
import { ProductJsonLd } from '@/components/seo/json-ld';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | AESTHIQUE' };

  return {
    title: `${product.name} | AESTHIQUE`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | AESTHIQUE`,
      description: product.shortDescription,
      images: [
        {
          url: product.primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const allCategoryProducts = await getProducts({ categorySlug: product.categorySlug });
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
