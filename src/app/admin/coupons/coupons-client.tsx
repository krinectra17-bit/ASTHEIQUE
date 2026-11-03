'use client';

import React, { useState } from 'react';
import { Coupon } from '@/types';
import { toggleCouponActive } from '../actions';
import { formatPrice } from '@/lib/utils';
import { Plus, Ticket, Check, X } from 'lucide-react';

interface CouponsClientProps {
  initialCoupons: Coupon[];
}

export function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscountAmount: 500,
    usageLimit: 500,
  });

  const handleToggleActive = async (couponId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: nextStatus } : c))
    );
    await toggleCouponActive(couponId, nextStatus);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const created: Coupon = {
      id: `coup_${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderValue: Number(newCoupon.minOrderValue),
      maxDiscountAmount: newCoupon.maxDiscountAmount ? Number(newCoupon.maxDiscountAmount) : null,
      usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null,
      timesUsed: 0,
      isActive: true,
      startsAt: new Date().toISOString(),
    };

    setCoupons((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 1499,
      maxDiscountAmount: 500,
      usageLimit: 500,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 border border-aesthique-beige shadow-sm">
        <div className="text-xs text-aesthique-espresso/70">
          Managing <strong className="text-aesthique-espresso">{coupons.length}</strong> active promotional campaigns
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2 hover:bg-black transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Promo Code</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Discount</th>
                <th className="py-3 px-6">Min Order Value</th>
                <th className="py-3 px-6">Max Cap</th>
                <th className="py-3 px-6">Redemptions</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-aesthique-ivory/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-sm text-aesthique-copper">
                    {c.code}
                  </td>
                  <td className="py-4 px-6 uppercase font-medium text-aesthique-espresso/70">
                    {c.discountType}
                  </td>
                  <td className="py-4 px-6 font-bold text-aesthique-espresso">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatPrice(c.discountValue)}
                  </td>
                  <td className="py-4 px-6 font-mono text-aesthique-espresso/80">
                    {formatPrice(c.minOrderValue)}
                  </td>
                  <td className="py-4 px-6 font-mono text-aesthique-espresso/60">
                    {c.maxDiscountAmount ? formatPrice(c.maxDiscountAmount) : 'No Limit'}
                  </td>
                  <td className="py-4 px-6 font-mono">
                    <span className="font-bold text-aesthique-espresso">{c.timesUsed}</span>
                    {c.usageLimit && (
                      <span className="text-aesthique-espresso/50"> / {c.usageLimit}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleActive(c.id, c.isActive)}
                      className={`text-xs uppercase tracking-wider font-semibold hover:underline ${
                        c.isActive ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {c.isActive ? 'Deactivate' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-aesthique-beige shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-aesthique-beige pb-3">
              <h3 className="font-editorial text-lg font-bold text-aesthique-espresso">
                Create Promotional Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-aesthique-espresso/60 hover:text-aesthique-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Discount Type
                  </label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.discountValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.minOrderValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.maxDiscountAmount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, maxDiscountAmount: Number(e.target.value) })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-aesthique-beige">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 uppercase tracking-wider font-semibold text-aesthique-espresso hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aesthique-espresso text-aesthique-ivory px-5 py-2 uppercase tracking-wider font-semibold hover:bg-black transition-colors"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
