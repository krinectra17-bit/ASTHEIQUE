'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminBanner, toggleBannerActive } from '../actions';
import { Plus, Image as ImageIcon, CheckCircle2, AlertCircle, ExternalLink, Sparkles, X } from 'lucide-react';

export function BannersClient({ initialBanners }: { initialBanners: AdminBanner[] }) {
  const [banners, setBanners] = useState<AdminBanner[]>(initialBanners);
  const [notification, setNotification] = useState<string | null>(null);

  const handleToggle = async (bannerId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, isActive: nextStatus } : b))
    );
    await toggleBannerActive(bannerId, nextStatus);
    setNotification('Banner status updated successfully.');
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Banners Grid List */}
      <div className="grid grid-cols-1 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-aesthique-beige shadow-sm overflow-hidden flex flex-col md:flex-row hover:border-aesthique-gold transition-colors"
          >
            {/* Visual Preview */}
            <div className="w-full md:w-72 h-44 md:h-auto relative bg-aesthique-ivory flex-shrink-0 border-b md:border-b-0 md:border-r border-aesthique-beige">
              {b.imageUrl ? (
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-aesthique-espresso/40 p-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-1 text-aesthique-copper" />
                  <span className="text-[10px] uppercase font-semibold">Text Announcement Banner</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-aesthique-espresso text-aesthique-ivory text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded shadow">
                {b.bannerType}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-mono font-semibold">
                    Position #{b.displayOrder}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                        b.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {b.isActive ? 'Active on Store' : 'Inactive / Draft'}
                    </span>
                  </div>
                </div>

                <h3 className="font-editorial text-xl font-bold text-aesthique-espresso">
                  {b.title}
                </h3>

                {b.subtitle && (
                  <p className="text-xs text-aesthique-espresso/70 leading-relaxed max-w-2xl">
                    {b.subtitle}
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-aesthique-beige/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-aesthique-espresso/60 text-[11px]">
                  <span>
                    CTA: <strong className="text-aesthique-espresso font-semibold">{b.buttonText || 'Link Only'}</strong>
                  </span>
                  <span>
                    URL: <code className="text-aesthique-copper font-mono">{b.linkUrl}</code>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={b.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-aesthique-espresso/70 hover:text-aesthique-gold transition-colors font-semibold"
                  >
                    <span>Preview Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleToggle(b.id, b.isActive)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                      b.isActive
                        ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                        : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {b.isActive ? 'Deactivate' : 'Publish to Store'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
