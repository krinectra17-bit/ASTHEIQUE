import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Logistics & Fulfillment
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Last revised: February 2026 • Powered by Shiprocket Logistics Network
        </p>
      </div>

      <div className="bg-white border border-aesthique-beige p-6 sm:p-10 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed space-y-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            1. Dispatch Timelines
          </h2>
          <p>
            All verified orders are packed and dispatched from our central New Delhi fulfillment studio within 24 to 48 hours of order confirmation (excluding Sundays and national holidays).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            2. Shipping Fees & Free Shipping Threshold
          </h2>
          <p>
            - <strong>Orders of ₹1,999 and above:</strong> Complimentary Standard Pan-India Shipping.<br />
            - <strong>Orders below ₹1,999:</strong> Flat delivery charge of ₹150 applied at checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            3. Delivery Transit Timeframes
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Delhi NCR & North Metro:</strong> 2 to 3 Business Days</li>
            <li><strong>Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad:</strong> 2 to 4 Business Days</li>
            <li><strong>Rest of India (Tier 2 & 3 Cities):</strong> 3 to 5 Business Days</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            4. Cash on Delivery (COD) Terms
          </h2>
          <p>
            Cash on Delivery is available across 26,000+ serviceable pin codes via Shiprocket. You may inspect the sealed package exterior before payment. For security, delivery executives may request a one-time SMS verification code.
          </p>
        </section>
      </div>
    </div>
  );
}
