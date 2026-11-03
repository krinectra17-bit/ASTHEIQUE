import React from 'react';
import Link from 'next/link';
import { getAdminKpis, getAdminOrders } from './actions';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const metadata = {
  title: 'Admin Overview | AESTHIQUE',
};

export default async function AdminDashboardPage() {
  const kpis = await getAdminKpis();
  const orders = await getAdminOrders();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aesthique-beige pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
            Executive Summary
          </span>
          <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
            Dashboard Overview
          </h1>
          <p className="text-xs text-aesthique-espresso/70 mt-1">
            Real-time business performance, inventory health, and recent order transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-black transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Essential</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-white border border-aesthique-beige text-aesthique-espresso text-xs uppercase tracking-wider font-semibold px-4 py-2.5 hover:border-aesthique-gold transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-aesthique-copper" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-aesthique-gold/15 text-aesthique-gold flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-aesthique-espresso">
              {formatPrice(kpis.totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
              <span>Verified across Razorpay & COD</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Total Orders Placed
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-aesthique-espresso">
              {kpis.totalOrders}
            </div>
            <div className="text-[11px] text-aesthique-espresso/60 font-medium">
              {kpis.pendingOrders} awaiting fulfillment
            </div>
          </div>
        </div>

        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Average Order Value
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-aesthique-espresso">
              {formatPrice(kpis.averageOrderValue)}
            </div>
            <div className="text-[11px] text-aesthique-espresso/60 font-medium">
              Across customer cart batches
            </div>
          </div>
        </div>

        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-amber-900">
              {kpis.lowStockCount}
            </div>
            <Link
              href="/admin/inventory"
              className="text-[11px] text-aesthique-copper hover:underline font-semibold block"
            >
              Inspect and Restock Items →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-aesthique-beige shadow-sm">
        <div className="p-6 border-b border-aesthique-beige flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
              Recent Orders
            </h2>
            <p className="text-xs text-aesthique-espresso/60">
              Latest patron transactions across store channels.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-aesthique-copper hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Order Number</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Method</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-aesthique-ivory/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-aesthique-espresso">
                    <Link
                      href={`/account/track/${o.orderNumber}`}
                      target="_blank"
                      className="hover:text-aesthique-copper underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold block text-aesthique-espresso">
                      {o.shippingAddress?.fullName || 'Patron'}
                    </span>
                    <span className="text-[11px] text-aesthique-espresso/60 block">
                      {o.customerEmail}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-aesthique-espresso/70">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-aesthique-copper">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : o.status === 'PROCESSING'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-aesthique-espresso">
                    {formatPrice(o.totalAmount)}
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
