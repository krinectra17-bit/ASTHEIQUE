'use client';

import React, { useState } from 'react';
import { ProductReview } from '@/types';
import { moderateReview } from '../actions';
import { formatDate } from '@/lib/utils';
import { Star, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface ReviewsClientProps {
  initialReviews: ProductReview[];
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);

  const handleModerate = async (reviewId: string, isApproved: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved } : r))
    );
    await moderateReview(reviewId, isApproved);
  };

  return (
    <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
            <tr>
              <th className="py-3 px-6">Author</th>
              <th className="py-3 px-6">Rating</th>
              <th className="py-3 px-6">Review Headline & Feedback</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aesthique-beige/50">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-aesthique-ivory/30 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-semibold text-aesthique-espresso block">
                    {r.authorName}
                  </span>
                  {r.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-0.5 text-aesthique-gold">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < r.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 max-w-md">
                  {r.headline && (
                    <span className="font-semibold text-aesthique-espresso block mb-0.5">
                      {r.headline}
                    </span>
                  )}
                  <p className="text-aesthique-espresso/70 line-clamp-2 leading-relaxed">
                    {r.reviewText}
                  </p>
                </td>
                <td className="py-4 px-6 text-aesthique-espresso/60 font-mono text-[11px]">
                  {formatDate(r.createdAt)}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.isApproved ? 'Approved & Public' : 'Pending Review'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  {!r.isApproved ? (
                    <button
                      onClick={() => handleModerate(r.id, true)}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold uppercase tracking-wider text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(r.id, false)}
                      className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-semibold uppercase tracking-wider text-[11px]"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
