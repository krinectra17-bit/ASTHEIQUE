'use client';

import React, { useState } from 'react';
import { AdminShipmentRecord } from '../actions';
import { formatDate } from '@/lib/utils';
import { Search, Truck, ExternalLink, PackageCheck, Clock, AlertCircle, Info } from 'lucide-react';

export function ShippingClient({ initialShipments }: { initialShipments: AdminShipmentRecord[] }) {
  const [shipments] = useState<AdminShipmentRecord[]>(initialShipments);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.orderNumber.toLowerCase().includes(q) ||
      s.awbCode.toLowerCase().includes(q) ||
      s.courierName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Shiprocket Credential Notice */}
      <div className="bg-[#FAF7F2] border border-aesthique-gold/50 p-4 rounded-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-aesthique-gold flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-aesthique-espresso block">
            Shiprocket API Configuration Status: Development / Mock Simulation Active
          </span>
          <p className="text-aesthique-espresso/70 leading-relaxed">
            Live courier manifests, real-time rate calculators, and automatic pickup requests require production credentials (<code className="font-mono bg-white px-1.5 py-0.5 border border-aesthique-beige">SHIPROCKET_EMAIL</code> and <code className="font-mono bg-white px-1.5 py-0.5 border border-aesthique-beige">SHIPROCKET_PASSWORD</code>) in <code className="font-mono bg-white px-1.5 py-0.5 border border-aesthique-beige">.env.local</code>. Orders below indicate simulated courier tracking for testing.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-aesthique-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, AWB code, or courier name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-aesthique-beige text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aesthique-espresso">
            <thead className="bg-[#FAF7F2] border-b border-aesthique-beige uppercase tracking-wider text-[10px] text-aesthique-espresso/60 font-semibold">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Courier Partner</th>
                <th className="py-3 px-4">AWB Tracking #</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Data Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/60">
              {filteredShipments.map((s) => (
                <tr key={s.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-aesthique-espresso">
                    {s.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-aesthique-espresso">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-aesthique-gold" />
                      <span>{s.courierName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-aesthique-espresso/70">
                    {s.awbCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded-full ${
                        s.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {s.status === 'DELIVERED' ? (
                        <PackageCheck className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{s.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-aesthique-espresso/60 text-[11px]">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                        s.isRealApi
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.isRealApi ? 'Live API Manifest' : 'Simulation'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.trackingUrl && (
                      <a
                        href={s.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-aesthique-gold hover:underline font-semibold"
                      >
                        <span>Track</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
