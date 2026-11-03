'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: { category: string; items: FAQItem[] }[] = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        question: 'What are your delivery timelines across India?',
        answer:
          'Orders within Delhi NCR and metro cities (Mumbai, Bengaluru, Kolkata, Chennai) typically arrive within 2 to 4 business days. Regional and tier-2 locations take 3 to 5 business days. All shipments are expedited through Shiprocket partner couriers (BlueDart, Delhivery Express).',
      },
      {
        question: 'Do you offer complimentary shipping?',
        answer:
          'Yes, we provide complimentary standard shipping across all Indian pincodes on orders valued above ₹1,999. For orders under ₹1,999, a flat standard courier fee of ₹150 is applied at checkout.',
      },
      {
        question: 'Can I track my shipment in real time?',
        answer:
          'Absolutely. Once your order is packed and dispatched from our New Delhi hub, you will receive an SMS and email notification with an Air Waybill (AWB) number and direct Shiprocket tracking link. You can also track it from your Account page.',
      },
    ],
  },
  {
    category: 'Payments & Checkout',
    items: [
      {
        question: 'Which payment methods do you support?',
        answer:
          'Through our Razorpay gateway integration, we accept all major Indian payment options: UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (RuPay, Visa, Mastercard, Amex), and Net Banking across 50+ banks. Cash on Delivery (COD) is also available across serviceable pin codes.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          '100% secure. We employ bank-grade 256-bit SSL encryption. All card and UPI transactions are processed through Razorpay, which is PCI-DSS Level 1 compliant. AESTHIQUE never stores your card credentials or UPI PINs.',
      },
      {
        question: 'Can I apply promotional coupon codes?',
        answer:
          'Yes! You can apply eligible promotional codes (such as WELCOME10 for new patrons) directly in your Shopping Bag drawer or during final checkout before payment authorization.',
      },
    ],
  },
  {
    category: 'Returns & Transit Protection',
    items: [
      {
        question: 'What happens if a fragile item arrives damaged?',
        answer:
          'We inspect and pack each item in multi-layered protective packaging. In the unlikely event of transit breakage, please share photos or video within 7 days of delivery at concierge@aesthique.com. We will immediately dispatch a priority replacement without requiring complex return shipping.',
      },
      {
        question: 'What is your return and exchange policy?',
        answer:
          'Due to the artisanal and hygiene-sensitive nature of personal care and hand-thrown ceramics, we accept exchanges for manufacturing defects or shipping damages within 7 days of delivery.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="border-b border-aesthique-beige pb-6 space-y-2 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
          <span>Client Guidance</span>
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-aesthique-espresso">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-aesthique-espresso/70 max-w-md mx-auto">
          Answers to common questions regarding ordering, shipping, artisanal materials, and care.
        </p>
      </div>

      <div className="space-y-10">
        {FAQ_DATA.map((section, secIdx) => (
          <div key={secIdx} className="space-y-4">
            <h2 className="font-editorial text-xl font-bold text-aesthique-espresso border-b border-aesthique-beige pb-2">
              {section.category}
            </h2>

            <div className="divide-y divide-aesthique-beige bg-white border border-aesthique-beige shadow-sm">
              {section.items.map((item, itemIdx) => {
                const key = `${secIdx}-${itemIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div key={itemIdx} className="p-4 sm:p-5">
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full flex items-center justify-between text-left gap-4 focus:outline-none"
                    >
                      <span className="font-editorial text-sm sm:text-base font-semibold text-aesthique-espresso">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-aesthique-copper transition-transform duration-300 flex-shrink-0',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="pt-3 text-xs sm:text-sm text-aesthique-espresso/80 leading-relaxed font-normal">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
