import React from 'react';
import { getAdminCategories } from '../actions';
import { CategoriesClient } from './categories-client';

export const metadata = {
  title: 'Categories Management | AESTHIQUE Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Catalog Architecture
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Categories & Taxonomy
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Manage storefront categories, visual ordering, descriptive copy, and relational product boundaries.
        </p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
