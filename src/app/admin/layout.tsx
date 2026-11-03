import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Ticket,
  Star,
  Settings,
  ExternalLink,
  ShieldCheck,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex flex-col md:flex-row text-aesthique-espresso">
      {/* Dark Luxury Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E1612] text-aesthique-ivory flex flex-col justify-between p-6 border-r border-[#30251F] flex-shrink-0">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-aesthique-gold">
                <Image
                  src="/brand/aesthique-logo.png"
                  alt="AESTHIQUE"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-editorial text-lg font-bold tracking-widest text-aesthique-ivory block group-hover:text-aesthique-gold transition-colors">
                  AESTHIQUE
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-aesthique-copper block font-semibold">
                  Management Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-aesthique-ivory/80 hover:text-white hover:bg-white/5 transition-all font-medium tracking-wide"
                >
                  <Icon className="w-4 h-4 text-aesthique-gold" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Shortcut to Storefront */}
        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-aesthique-gold hover:text-white transition-colors py-1 font-semibold text-[11px] uppercase tracking-wider"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-white/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Admin RBAC Guard Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-aesthique-beige/70 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-aesthique-gold" />
            <span className="text-xs uppercase tracking-widest font-semibold text-aesthique-espresso/70">
              AESTHIQUE Operations Control
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-800">
                Supabase & Razorpay Synchronized
              </span>
            </div>

            <div className="h-4 w-px bg-aesthique-beige" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-aesthique-espresso text-aesthique-ivory flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-semibold text-aesthique-espresso block text-[11px]">
                  Studio Concierge Admin
                </span>
                <span className="text-[9px] text-aesthique-copper uppercase tracking-wider block">
                  Super Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
