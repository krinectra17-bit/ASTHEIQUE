'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/data/mock-catalog';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-aesthique-espresso text-aesthique-ivory border-t border-aesthique-gold/20 pt-16 pb-12">
      {/* Brand Value Prop Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-aesthique-ivory/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-aesthique-ivory/5 border border-aesthique-gold/30 flex items-center justify-center text-aesthique-gold flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-sm font-semibold tracking-wide text-aesthique-ivory">
                Pan-India Express Logistics
              </h4>
              <p className="text-xs text-aesthique-ivory/60 mt-0.5">
                Complimentary delivery on all orders above ₹1,999.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-aesthique-ivory/5 border border-aesthique-gold/30 flex items-center justify-center text-aesthique-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-sm font-semibold tracking-wide text-aesthique-ivory">
                100% Secure Checkout
              </h4>
              <p className="text-xs text-aesthique-ivory/60 mt-0.5">
                Encrypted Razorpay UPI, Cards, NetBanking & COD.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-aesthique-ivory/5 border border-aesthique-gold/30 flex items-center justify-center text-aesthique-gold flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-sm font-semibold tracking-wide text-aesthique-ivory">
                Artisanal Guarantee
              </h4>
              <p className="text-xs text-aesthique-ivory/60 mt-0.5">
                7-day hassle-free replacement for transit damage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 border border-aesthique-gold/40">
                <Image
                  src="/brand/aesthique-logo.png"
                  alt="AESTHIQUE"
                  fill
                  className="object-contain p-0.5"
                  sizes="48px"
                />
              </div>
              <div>
                <span className="font-editorial text-xl font-bold tracking-[0.2em] text-aesthique-ivory block">
                  AESTHIQUE
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-aesthique-gold font-medium">
                  Little Things, Better Living.
                </span>
              </div>
            </div>

            <p className="text-xs text-aesthique-ivory/70 leading-relaxed max-w-sm pt-2">
              AESTHIQUE is an Indian luxury lifestyle studio dedicated to curating functional,
              beautiful everyday essentials that transform daily rituals into moments of quiet elegance.
            </p>

            {/* Newsletter Box */}
            <div className="pt-4">
              <span className="text-[10px] uppercase tracking-widest text-aesthique-gold font-semibold block mb-2">
                Join The AESTHIQUE Circle
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Welcome to our inner circle. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-aesthique-ivory/10 border border-aesthique-ivory/20 px-3.5 py-2.5 text-xs text-aesthique-ivory placeholder:text-aesthique-ivory/40 focus:outline-none focus:border-aesthique-gold"
                  />
                  <button
                    type="submit"
                    className="bg-aesthique-gold hover:bg-aesthique-copper text-aesthique-espresso px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-aesthique-ivory uppercase tracking-widest text-aesthique-gold/90">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-aesthique-ivory/70">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-aesthique-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-aesthique-gold hover:underline">
                  View All Catalog →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Concierge */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-aesthique-ivory uppercase tracking-widest text-aesthique-gold/90">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-aesthique-ivory/70">
              <li>
                <Link href="/account/orders" className="hover:text-aesthique-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-aesthique-gold transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-aesthique-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-aesthique-gold transition-colors">
                  Shipping & Dispatch Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-aesthique-gold transition-colors">
                  Return & Refund Guidelines
                </Link>
              </li>

            </ul>
          </div>

          {/* Col 4: Legal & Contact */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-aesthique-ivory uppercase tracking-widest text-aesthique-gold/90">
              Legal & Studio
            </h5>
            <ul className="space-y-2 text-xs text-aesthique-ivory/70">
              <li>
                <Link href="/about" className="hover:text-aesthique-gold transition-colors">
                  Our Philosophy & Story
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-aesthique-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-aesthique-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="pt-3 text-[11px] text-aesthique-ivory/60 space-y-1">
              <p>Email: concierge@aesthique.com</p>
              <p>Support: +91 98710 24500 (Mon-Sat, 10am - 7pm IST)</p>
              <p>Studio: Vasant Vihar, New Delhi - 110057, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-aesthique-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-aesthique-ivory/50">
        <p>© {new Date().getFullYear()} AESTHIQUE Lifestyle Pvt Ltd. All rights reserved.</p>
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-aesthique-gold/80">
          <span>UPI</span>
          <span>•</span>
          <span>RuPay</span>
          <span>•</span>
          <span>Visa</span>
          <span>•</span>
          <span>Mastercard</span>
          <span>•</span>
          <span>Net Banking</span>
          <span>•</span>
          <span>Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
