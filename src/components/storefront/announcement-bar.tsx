'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-aesthique-espresso text-aesthique-ivory text-xs tracking-widest uppercase py-2 px-4 relative z-40 border-b border-aesthique-gold/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center pr-8 sm:pr-0">
        <Sparkles className="w-3 h-3 text-aesthique-gold hidden sm:inline" />
        <span>
          Complimentary shipping across India on orders over ₹1,999 • Use code{' '}
          <strong className="text-aesthique-gold font-semibold underline underline-offset-2">WELCOME10</strong> for 10% off
        </span>
        <Link
          href="/shop"
          className="hidden md:inline text-aesthique-gold hover:text-white transition-colors underline ml-2"
        >
          Explore Shop
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-aesthique-ivory/60 hover:text-white transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
