import React from 'react';
import { getAdminCoupons } from '../actions';
import { CouponsClient } from './coupons-client';

export const metadata = {
  title: 'Discount Coupons | AESTHIQUE Admin',
};

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Marketing & Promotions
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Promotional Coupons & Campaigns
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Configure discount codes, percentage discounts, minimum cart values, and redemptions.
        </p>
      </div>

      <CouponsClient initialCoupons={coupons} />
    </div>
  );
}
