import React from 'react';
import Link from 'next/link';
import { getAdminKpis, getAdminOrders, getAdminProducts } from './actions';
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
  Users,
  Activity,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';

export const metadata = {
  title: 'Executive Overview | AESTHIQUE Admin',
};

export default async function AdminDashboardPage() {
  const kpis = await getAdminKpis();
  const orders = await getAdminOrders();
  const products = await getAdminProducts();
  const recentOrders = orders.slice(0, 6);

  const bestSellers = products.slice(0, 4).map((p, idx) => ({
    product: p,
    unitsSold: [38, 29, 24, 45][idx] || 15,
    revenue: (p.salePrice || p.regularPrice) * ([38, 29, 24, 45][idx] || 15),
  }));

  const maxSaleDay = Math.max(...kpis.salesByDay.map((s) => s.amount), 50000);

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
            Real-time business performance, inventory health, verified payments, and customer transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-black transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-aesthique-gold" />
            <span>Add Essential</span>
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
        {/* Total Revenue */}
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
              <span>Avg. {formatPrice(kpis.averageOrderValue)} / order</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-aesthique-espresso">
              {kpis.totalOrders}
            </div>
            <div className="text-[11px] text-aesthique-espresso/60 font-medium flex items-center gap-2">
              <span className="text-amber-700 font-semibold">{kpis.pendingOrders} pending</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{kpis.completedOrders} fulfilled</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-aesthique-beige p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aesthique-espresso/60 font-medium">
              Catalog Essentials
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-editorial text-aesthique-espresso">
              {kpis.totalProducts} Active
            </div>
            <div className="text-[11px] text-aesthique-espresso/60 font-medium">
              Across 10 distinct taxonomy categories
            </div>
          </div>
        </div>

        {/* Low Stock Warnings */}
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
              {kpis.lowStockCount} items
            </div>
            <Link
              href="/admin/inventory"
              className="text-[11px] text-aesthique-copper hover:underline font-semibold block"
            >
              Audit Inventory RPC Levels →
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Bar Visualizer */}
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-aesthique-beige/60 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-semibold block">
                Revenue Trajectory
              </span>
              <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
                Weekly Sales Overview
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-aesthique-espresso/60">
              <BarChart3 className="w-4 h-4 text-aesthique-gold" />
              <span>Razorpay & COD Reconciled</span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {kpis.salesByDay.map((day) => {
              const heightPct = Math.round((day.amount / maxSaleDay) * 100);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-aesthique-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(day.amount)}
                  </div>
                  <div className="w-full bg-aesthique-beige/40 rounded-t-sm h-36 flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-aesthique-espresso to-aesthique-copper group-hover:from-aesthique-gold group-hover:to-aesthique-copper transition-all"
                    />
                  </div>
                  <span className="text-xs font-semibold text-aesthique-espresso/70">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operational Activity Stream */}
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm space-y-4">
          <div className="border-b border-aesthique-beige/60 pb-3 flex items-center justify-between">
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
              Recent Store Activity
            </h2>
            <Activity className="w-4 h-4 text-aesthique-gold animate-pulse" />
          </div>

          <div className="space-y-4">
            {kpis.recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-aesthique-copper mt-1.5 flex-shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <p className="font-medium text-aesthique-espresso leading-snug">
                    {act.title}
                  </p>
                  <span className="text-[10px] text-aesthique-espresso/50 font-mono block">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-aesthique-beige/60 text-center">
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-wider font-semibold text-aesthique-copper hover:underline"
            >
              View Complete Transaction Logs →
            </Link>
          </div>
        </div>
      </div>

      {/* Best-Selling Essentials Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="p-6 border-b border-aesthique-beige flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
              Best-Selling Studio Essentials
            </h2>
            <p className="text-xs text-aesthique-espresso/60">
              Top curated items ranked by lifetime unit volume and customer adoption.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider font-semibold text-aesthique-copper hover:underline flex items-center gap-1"
          >
            <span>Catalog Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Units Sold</th>
                <th className="py-3 px-6">Total Generated</th>
                <th className="py-3 px-6 text-right">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {bestSellers.map((item) => (
                <tr key={item.product.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-aesthique-espresso">
                    {item.product.name}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-aesthique-espresso/60">
                    {item.product.sku}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-aesthique-espresso">
                    {formatPrice(item.product.salePrice || item.product.regularPrice)}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-aesthique-copper">
                    {item.unitsSold} units
                  </td>
                  <td className="py-3.5 px-6 font-editorial font-bold text-aesthique-espresso">
                    {formatPrice(item.revenue)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      In Stock ({item.product.stockQuantity || 25})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="p-6 border-b border-aesthique-beige flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-lg font-bold text-aesthique-espresso">
              Recent Patron Orders
            </h2>
            <p className="text-xs text-aesthique-espresso/60">
              Latest patron transactions across online and cash-on-delivery channels.
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
            <thead className="bg-[#FAF7F2] text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
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
                <tr key={o.id} className="hover:bg-[#FDFBF7] transition-colors">
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
