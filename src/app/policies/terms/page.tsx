import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Terms of Service
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Last revised: February 2026 • Governing your use of AESTHIQUE E-Commerce Platform
        </p>
      </div>

      <div className="bg-white border border-aesthique-beige p-6 sm:p-10 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed space-y-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or purchasing from AESTHIQUE (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), you agree to be bound by these Terms and Conditions. If you do not agree with any portion, you must discontinue platform use immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            2. Product Pricing & Accuracy
          </h2>
          <p>
            All prices are quoted in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). While we strive for absolute accuracy, typographical pricing errors may occasionally occur. AESTHIQUE reserves the right to cancel orders arising from erroneous pricing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            3. Artisanal Variance
          </h2>
          <p>
            Many AESTHIQUE products are crafted by hand from natural clay, brass, and European flax linen. Subtle variations in surface grain, glaze mottling, and organic texture are inherent characteristics of authentic craftsmanship, not defects.
          </p>
        </section>
      </div>
    </div>
  );
}
