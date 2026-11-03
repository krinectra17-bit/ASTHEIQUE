import React from 'react';
import { getAdminReviews } from '../actions';
import { ReviewsClient } from './reviews-client';

export const metadata = {
  title: 'Reviews Moderation | AESTHIQUE Admin',
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Patron Feedback
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Product Reviews Moderation
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Review verified customer reviews before publishing to public storefront product pages.
        </p>
      </div>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
