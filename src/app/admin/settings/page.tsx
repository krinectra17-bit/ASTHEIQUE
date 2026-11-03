import React from 'react';
import { ShieldCheck, Truck, CreditCard, Database, Sparkles, Check } from 'lucide-react';

export const metadata = {
  title: 'Store Settings & Integrations | AESTHIQUE Admin',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Platform Configuration
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Store Settings & Integrations
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Review business rules, shipping thresholds, tax compliance, and connected payment/shipping APIs.
        </p>
      </div>

      <div className="space-y-6">
        {/* Brand Identity Card */}
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-aesthique-beige">
            <Sparkles className="w-4 h-4 text-aesthique-gold" />
            <h3 className="font-editorial text-base font-bold text-aesthique-espresso">
              Brand Identity & Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Brand Name
              </span>
              <span className="font-bold text-sm text-aesthique-espresso">AESTHIQUE</span>
            </div>
            <div>
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Tagline
              </span>
              <span className="font-medium text-aesthique-copper">Little Things, Better Living.</span>
            </div>
            <div>
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Concierge Email
              </span>
              <span className="font-mono text-aesthique-espresso">concierge@aesthique.com</span>
            </div>
            <div>
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Customer Care Mobile
              </span>
              <span className="font-mono text-aesthique-espresso">+91 98710 24500</span>
            </div>
          </div>
        </div>

        {/* Shipping & Tax Rules */}
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-aesthique-beige">
            <Truck className="w-4 h-4 text-aesthique-copper" />
            <h3 className="font-editorial text-base font-bold text-aesthique-espresso">
              Logistics & Tax Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-aesthique-ivory p-3 border border-aesthique-beige">
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Free Shipping Threshold
              </span>
              <span className="font-mono font-bold text-base text-aesthique-espresso mt-0.5 block">
                ₹1,999
              </span>
              <span className="text-[10px] text-emerald-800">Pan-India Complimentary</span>
            </div>

            <div className="bg-aesthique-ivory p-3 border border-aesthique-beige">
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Standard Shipping Fee
              </span>
              <span className="font-mono font-bold text-base text-aesthique-espresso mt-0.5 block">
                ₹150
              </span>
              <span className="text-[10px] text-aesthique-espresso/60">Applied below threshold</span>
            </div>

            <div className="bg-aesthique-ivory p-3 border border-aesthique-beige">
              <span className="text-aesthique-espresso/60 uppercase text-[10px] font-semibold block">
                Goods & Services Tax (GST)
              </span>
              <span className="font-mono font-bold text-base text-aesthique-espresso mt-0.5 block">
                18%
              </span>
              <span className="text-[10px] text-aesthique-copper font-medium">All prices inclusive</span>
            </div>
          </div>
        </div>

        {/* Live Service Integrations Status */}
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-aesthique-beige">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="font-editorial text-base font-bold text-aesthique-espresso">
              Connected Infrastructure
            </h3>
          </div>

          <div className="divide-y divide-aesthique-beige/50 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-semibold block text-aesthique-espresso">
                    Supabase PostgreSQL & Auth
                  </span>
                  <span className="text-[11px] text-aesthique-espresso/60">
                    24 Relational Tables • Row-Level Security • SSR Sessions
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                <span>Connected</span>
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-semibold block text-aesthique-espresso">
                    Razorpay Payment Gateway
                  </span>
                  <span className="text-[11px] text-aesthique-espresso/60">
                    Standard Checkout Modal • HMAC-SHA256 Signature Verification • Webhooks
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-semibold block text-aesthique-espresso">
                    Shiprocket Courier & Logistics
                  </span>
                  <span className="text-[11px] text-aesthique-espresso/60">
                    Pincode Serviceability • AWB Courier Allocation • Multi-Hub Tracking
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
