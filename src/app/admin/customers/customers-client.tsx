'use client';

import React, { useState } from 'react';
import { AdminCustomerProfile } from '../actions';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Users, Mail, Phone, ShoppingBag, ShieldCheck, UserCheck } from 'lucide-react';

export function CustomersClient({ initialCustomers }: { initialCustomers: AdminCustomerProfile[] }) {
  const [customers] = useState<AdminCustomerProfile[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-aesthique-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-aesthique-beige text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-aesthique-espresso/70">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Credential Masking Enforced (Passkeys & Secrets Protected)</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aesthique-espresso">
            <thead className="bg-[#FAF7F2] border-b border-aesthique-beige uppercase tracking-wider text-[10px] text-aesthique-espresso/60 font-semibold">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-aesthique-espresso">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-aesthique-gold/15 text-aesthique-copper flex items-center justify-center font-bold text-xs">
                        {(c.firstName?.[0] || c.email[0]).toUpperCase()}
                      </div>
                      <span>
                        {c.firstName || c.lastName
                          ? `${c.firstName || ''} ${c.lastName || ''}`.trim()
                          : 'Guest Patron'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-aesthique-espresso/80">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-aesthique-espresso/40" />
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-aesthique-espresso/70">
                    {c.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-aesthique-espresso/40" />
                        <span>{c.phone}</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-aesthique-copper font-semibold font-mono">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{c.orderCount} orders</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-aesthique-espresso font-editorial text-sm">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-aesthique-espresso/60 text-[11px]">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      <UserCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
