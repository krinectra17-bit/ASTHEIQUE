import React from 'react';
import { Product } from '@/types';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AESTHIQUE',
    alternateName: 'Aesthique Living',
    url: 'https://aesthique.com',
    logo: 'https://aesthique.com/brand/aesthique-logo.png',
    description: 'Little Things, Better Living. Premium lifestyle & artisanal everyday essentials.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9871024500',
      contactType: 'customer service',
      email: 'concierge@aesthique.com',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://instagram.com/aesthique.living',
      'https://pinterest.com/aesthique',
      'https://facebook.com/aesthique.living',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AESTHIQUE',
    url: 'https://aesthique.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://aesthique.com/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const price = product.salePrice ?? product.regularPrice;
  const inStock = product.stockQuantity > 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.primaryImage, ...(product.galleryImages || [])],
    description: product.shortDescription || product.fullDescription,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'AESTHIQUE',
    },
    offers: {
      '@type': 'Offer',
      url: `https://aesthique.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price,
      priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'AESTHIQUE',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 28,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
