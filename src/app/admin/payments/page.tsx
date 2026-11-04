import React from 'react';
import { getAdminPayments } from '../actions';
import { PaymentsClient } from './payments-client';

export const metadata = {
  title: 'Payments Audit | AESTHIQUE Admin',
};

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Financial Gateway Audit
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Payments & Transactions
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Server-verified Razorpay signatures, automated payment capture records, and reconciliation audit trails.
        </p>
      </div>

      <PaymentsClient initialPayments={payments} />
    </div>
  );
}
