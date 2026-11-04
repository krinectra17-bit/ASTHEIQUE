import React from 'react';
import { getAdminBanners } from '../actions';
import { BannersClient } from './banners-client';

export const metadata = {
  title: 'Homepage Banners | AESTHIQUE Admin',
};

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Editorial Curation
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Homepage Banners & Hero Sections
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Configure announcements, hero slides, curated campaign banners, call-to-action buttons, and display sequencing.
        </p>
      </div>

      <BannersClient initialBanners={banners} />
    </div>
  );
}
