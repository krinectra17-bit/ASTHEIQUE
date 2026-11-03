'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="border-b border-aesthique-beige pb-6 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
          <span>Client Concierge</span>
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
          Contact AESTHIQUE
        </h1>
        <p className="text-xs sm:text-sm text-aesthique-espresso/70 max-w-xl">
          Have an inquiry about an order, custom gifting, or styling advice? Our concierge team is available to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-aesthique-beige p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-aesthique-espresso">
                Message Received
              </h2>
              <p className="text-xs text-aesthique-espresso/70 max-w-sm mx-auto">
                Thank you for reaching out. A concierge specialist will respond to {formData.email} within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-wider text-aesthique-copper font-semibold hover:underline pt-2"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patron@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Order Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AES-2026-XXXXX"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold uppercase tracking-wider"
                >
                  <option value="General Inquiry">General Product Inquiry</option>
                  <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                  <option value="Damage & Replacement">Damage & Replacement Request</option>
                  <option value="Corporate & Wedding Gifting">Corporate & Wedding Gifting</option>
                  <option value="Press & Collaborations">Press & Design Collaborations</option>
                </select>
              </div>

              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How may our studio team assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full sm:w-auto"
              >
                Submit Message
              </Button>
            </form>
          )}
        </div>

        {/* Right Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm text-xs">
            <h3 className="font-editorial text-base font-bold text-aesthique-espresso border-b border-aesthique-beige pb-3">
              Direct Channels
            </h3>

            <div className="space-y-4 text-aesthique-espresso/80">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-aesthique-copper mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-aesthique-espresso block">Email Concierge</span>
                  <span>concierge@aesthique.com</span>
                  <p className="text-[10px] text-aesthique-espresso/60">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-aesthique-copper mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-aesthique-espresso block">Telephone & WhatsApp</span>
                  <span>+91 98710 24500</span>
                  <p className="text-[10px] text-aesthique-espresso/60">Mon - Sat, 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-aesthique-copper mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-aesthique-espresso block">Studio Headquarters</span>
                  <span>AESTHIQUE Lifestyle Studio, Vasant Vihar, New Delhi - 110057, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-aesthique-copper mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-aesthique-espresso block">Dispatch Hours</span>
                  <span>Orders dispatched daily at 2:00 PM IST (excluding Sundays & National Holidays).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
