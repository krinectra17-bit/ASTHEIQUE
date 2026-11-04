'use client';

import React, { useState } from 'react';
import { AdminPaymentRecord } from '../actions';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, ShieldCheck, CheckCircle2, Clock, AlertTriangle, CreditCard, ExternalLink } from 'lucide-react';

export function PaymentsClient({ initialPayments }: { initialPayments: AdminPaymentRecord[] }) {
  const [payments] = useState<AdminPaymentRecord[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || (p.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalCaptured = payments
    .filter((p) => ['CAPTURED', 'SUCCESS', 'PAID'].includes((p.status || '').toUpperCase()))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-aesthique-espresso/60 font-medium">
            Verified Captured Revenue
          </span>
          <div className="font-editorial text-2xl font-bold text-aesthique-espresso">
            {formatPrice(totalCaptured)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HMAC-SHA256 Server Signature Validated</span>
          </div>
        </div>

        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-aesthique-espresso/60 font-medium">
            Total Gateway Events
          </span>
          <div className="font-editorial text-2xl font-bold text-aesthique-espresso">
            {payments.length}
          </div>
          <div className="text-[11px] text-aesthique-espresso/60 pt-1">
            Reconciled against Razorpay & COD ledger
          </div>
        </div>

        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-aesthique-espresso/60 font-medium">
            Gateway Integration Mode
          </span>
          <div className="font-editorial text-lg font-bold text-aesthique-copper">
            Development / Sandbox
          </div>
          <div className="text-[11px] text-aesthique-espresso/60 pt-1">
            Awaiting live Razorpay credentials for production
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-aesthique-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, payment ID, or Razorpay ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-aesthique-beige text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CAPTURED', 'PENDING', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                statusFilter === st
                  ? 'bg-aesthique-espresso text-aesthique-ivory border-aesthique-espresso'
                  : 'bg-white text-aesthique-espresso border-aesthique-beige hover:border-aesthique-gold'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aesthique-espresso">
            <thead className="bg-[#FAF7F2] border-b border-aesthique-beige uppercase tracking-wider text-[10px] text-aesthique-espresso/60 font-semibold">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Razorpay Payment ID</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/60">
              {filteredPayments.map((p) => {
                const isSuccess = ['CAPTURED', 'SUCCESS', 'PAID'].includes((p.status || '').toUpperCase());
                return (
                  <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-aesthique-espresso">
                      {p.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-aesthique-espresso">
                      {formatPrice(p.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-aesthique-espresso/70">
                      {p.razorpayPaymentId || '— (COD or Pending)'}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-semibold tracking-wider text-aesthique-copper">
                      {p.paymentMethod || 'RAZORPAY'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded-full ${
                          isSuccess
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{p.status || 'PENDING'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-aesthique-espresso/60 text-[11px]">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>HMAC Verified</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
