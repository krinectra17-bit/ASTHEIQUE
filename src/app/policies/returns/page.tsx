import React from 'react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Patron Guarantee
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso mt-1">
          Return, Replacement & Refund Policy
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Last revised: February 2026 • 7-Day Transit Shield Guarantee
        </p>
      </div>

      <div className="bg-white border border-aesthique-beige p-6 sm:p-10 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed space-y-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            1. 7-Day Transit Damage Shield
          </h2>
          <p>
            If any fragile item (stoneware ceramics, glassware, brass objects) arrives cracked, chipped, or damaged during transit, notify our concierge within 7 days of package delivery. Simply email clear photos of the damaged piece and parcel label to concierge@aesthique.com.
          </p>
          <p className="font-semibold text-emerald-800">
            We will immediately dispatch a complimentary replacement at zero additional charge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            2. Cancellation Policy
          </h2>
          <p>
            Orders may be cancelled free of charge prior to fulfillment dispatch (status: PENDING or PROCESSING). Once a package has been assigned an Air Waybill (AWB) and handed to the courier, cancellations cannot be processed mid-transit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            3. Refund Settlement Timelines
          </h2>
          <p>
            Approved refunds are initiated through Razorpay back to your original source of payment (UPI, Credit/Debit Card, Net Banking) within 24 hours of approval. The funds will reflect in your bank statement within 5 to 7 business days per standard Indian banking cycles.
          </p>
        </section>
      </div>
    </div>
  );
}
