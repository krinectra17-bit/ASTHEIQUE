import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Legal & Compliance
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Last revised: February 2026 • Compliant with Digital Personal Data Protection Act (DPDP), India
        </p>
      </div>

      <div className="bg-white border border-aesthique-beige p-6 sm:p-10 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed space-y-6 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            1. Information We Collect
          </h2>
          <p>
            When you visit or make a purchase from AESTHIQUE, we collect necessary personal information, including your full name, shipping and billing address, email address, and Indian mobile phone number. This information is utilized strictly to fulfill orders, facilitate deliveries through Shiprocket, and provide transactional notifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            2. Payment Data Security
          </h2>
          <p>
            We do not store or process sensitive debit/credit card numbers or UPI PINs on our servers. All financial transactions are processed securely through our PCI-DSS compliant payment gateway partner, Razorpay.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            3. Logistics Partners
          </h2>
          <p>
            To deliver your purchases, your recipient address, contact number, and order SKU weights are shared securely with Shiprocket and partner courier aggregators (BlueDart, Delhivery, Ekart). These entities are bound by confidentiality and use your data solely for logistics fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
            4. Your Rights & Data Protection Grievances
          </h2>
          <p>
            You have the right to request access, correction, or deletion of your personal patron record at any time. For privacy inquiries, please contact our Data Protection Officer at privacy@aesthique.com.
          </p>
        </section>
      </div>
    </div>
  );
}
