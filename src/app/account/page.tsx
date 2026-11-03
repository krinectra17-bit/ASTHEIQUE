'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStore } from '@/context/store-context';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { wishlist } = useStore();
  const [customer, setCustomer] = useState<{ email: string; fullName: string } | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const session = localStorage.getItem('aesthique_customer_session');
      if (session) {
        setCustomer(JSON.parse(session));
      } else {
        // Fallback patron profile for demo exploration
        setCustomer({
          email: 'patron@aesthique.com',
          fullName: 'Ananya Sharma',
        });
      }

      const orders = localStorage.getItem('aesthique_orders');
      if (orders) {
        setRecentOrders(JSON.parse(orders));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aesthique_customer_session');
    router.push('/auth/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-aesthique-beige gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
            Patron Dashboard
          </span>
          <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
            Welcome, {customer?.fullName || 'Patron'}
          </h1>
          <p className="text-xs text-aesthique-espresso/70 mt-0.5">
            Logged in as {customer?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-rose-700 hover:underline"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="bg-white border border-aesthique-beige p-6 shadow-sm hover:border-aesthique-gold transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
              Orders Placed
            </span>
            <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
              {recentOrders.length}
            </span>
            <span className="text-[11px] text-aesthique-espresso/60 group-hover:text-aesthique-copper transition-colors">
              View History & Tracking →
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-aesthique-beige p-6 shadow-sm hover:border-aesthique-gold transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
              Saved in Wishlist
            </span>
            <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
              {wishlist.length}
            </span>
            <span className="text-[11px] text-aesthique-espresso/60 group-hover:text-aesthique-copper transition-colors">
              Manage Favorites →
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
            <Heart className="w-6 h-6" />
          </div>
        </Link>

        <div className="bg-white border border-aesthique-beige p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
              AESTHIQUE Tier
            </span>
            <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
              Patron Circle
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold">
              ✓ Eligible for Express Logistics
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-gold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-aesthique-beige p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-aesthique-beige">
          <h2 className="font-editorial text-xl font-bold text-aesthique-espresso">
            Recent Purchases
          </h2>
          <Link
            href="/account/orders"
            className="text-xs uppercase tracking-wider text-aesthique-copper hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-xs text-aesthique-espresso/70">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="sm">
                Explore The Collections
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-aesthique-beige/60">
            {recentOrders.slice(0, 3).map((order) => (
              <div
                key={order.orderNumber}
                className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-aesthique-espresso text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase text-[9px]">
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-aesthique-espresso/60">
                    Placed on {formatDate(order.createdAt)} • {order.items?.length || 1} items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-aesthique-espresso text-sm">
                    {formatPrice(order.pricing?.total || 0)}
                  </span>
                  <Link
                    href={`/account/track/${order.orderNumber}`}
                    className="px-3.5 py-1.5 bg-aesthique-ivory border border-aesthique-beige hover:border-aesthique-gold text-aesthique-espresso text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    Track Shipment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
