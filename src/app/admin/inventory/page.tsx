import React from 'react';
import { getAdminProducts } from '../actions';
import { InventoryClient } from './inventory-client';

export const metadata = {
  title: 'Inventory & Stock Management | AESTHIQUE Admin',
};

export default async function AdminInventoryPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Stock Control & Movements
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Live Inventory Audit
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Monitor available units, inspect low-stock thresholds, and log stock adjustments.
        </p>
      </div>

      <InventoryClient initialProducts={products} />
    </div>
  );
}
