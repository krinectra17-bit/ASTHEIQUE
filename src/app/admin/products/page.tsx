import React from 'react';
import { getAdminProducts } from '../actions';
import { ProductsClient } from './products-client';

export const metadata = {
  title: 'Products Management | AESTHIQUE Admin',
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Catalog Operations
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Product & Inventory Catalog
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Create, edit, toggle availability, and audit pricing for all store essentials.
        </p>
      </div>

      <ProductsClient initialProducts={products} />
    </div>
  );
}
