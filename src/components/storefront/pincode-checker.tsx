'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const PincodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<{
    checked: boolean;
    serviceable?: boolean;
    city?: string;
    estimatedDays?: string;
    message?: string;
  }>({ checked: false });
  const [loading, setLoading] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setStatus({
        checked: true,
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    setLoading(true);
    // Simulate real-time serviceability lookup (Shiprocket regional dispatch mapping)
    setTimeout(() => {
      setLoading(false);
      const prefix = clean.substring(0, 2);
      let region = 'Standard Region';
      let days = '3 - 5 business days';

      if (['11', '12', '13', '20'].includes(prefix)) {
        region = 'Delhi NCR / North';
        days = '2 - 3 business days (Fast Dispatch)';
      } else if (['40', '41', '42'].includes(prefix)) {
        region = 'Mumbai / Western Hub';
        days = '2 - 4 business days';
      } else if (['56', '57', '60'].includes(prefix)) {
        region = 'Bangalore / Southern Hub';
        days = '2 - 4 business days';
      } else if (['70', '71'].includes(prefix)) {
        region = 'Kolkata / Eastern Hub';
        days = '3 - 5 business days';
      }

      setStatus({
        checked: true,
        serviceable: true,
        city: region,
        estimatedDays: days,
        message: `Delivery available via Shiprocket Express couriers.`,
      });
    }, 450);
  };

  return (
    <div className="bg-aesthique-cream/70 border border-aesthique-beige/70 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-aesthique-espresso">
        <MapPin className="w-4 h-4 text-aesthique-copper" />
        <span>Check Delivery & Pincode Serviceability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            if (status.checked) setStatus({ checked: false });
          }}
          className="flex-1 bg-white border border-aesthique-beige px-3 py-2 text-xs text-aesthique-espresso tracking-widest placeholder:tracking-normal placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-widest px-4 py-2 hover:bg-black disabled:opacity-40 transition-colors font-medium"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {status.checked && (
        <div className="text-xs pt-1">
          {status.serviceable ? (
            <div className="space-y-1.5 text-emerald-800">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Serviceable Area ({status.city})</span>
              </div>
              <div className="flex items-center gap-1.5 text-aesthique-espresso text-[11px] pl-5">
                <Clock className="w-3.5 h-3.5 text-aesthique-copper flex-shrink-0" />
                <span>Estimated Delivery: {status.estimatedDays}</span>
              </div>
              <p className="text-[10px] text-aesthique-espresso/60 pl-5">
                Eligible for Cash on Delivery (COD) & Express Prepaid.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
