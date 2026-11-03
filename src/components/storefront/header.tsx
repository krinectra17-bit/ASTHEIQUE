'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { CATEGORIES } from '@/lib/data/mock-catalog';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, wishlist, setIsCartOpen, setIsSearchOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Header background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-all duration-300 w-full',
        isScrolled
          ? 'bg-aesthique-ivory/95 backdrop-blur-md shadow-sm border-b border-aesthique-beige py-2.5'
          : 'bg-aesthique-ivory border-b border-aesthique-beige/60 py-3.5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-aesthique-espresso hover:text-aesthique-copper focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-aesthique-espresso hover:text-aesthique-copper focus:outline-none"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-medium">
            <Link
              href="/"
              className={cn(
                'transition-colors hover:text-aesthique-copper py-2 relative',
                pathname === '/' ? 'text-aesthique-copper font-semibold' : 'text-aesthique-espresso'
              )}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={cn(
                'transition-colors hover:text-aesthique-copper py-2',
                pathname === '/shop' ? 'text-aesthique-copper font-semibold' : 'text-aesthique-espresso'
              )}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 transition-colors hover:text-aesthique-copper py-2 focus:outline-none uppercase',
                  pathname.startsWith('/category') ? 'text-aesthique-copper font-semibold' : 'text-aesthique-espresso'
                )}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-aesthique-beige shadow-luxury py-4 px-3 animate-fade-in z-50">
                  <div className="text-[10px] tracking-widest uppercase font-semibold text-aesthique-gold px-3 pb-2 border-b border-aesthique-beige/50 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-aesthique-gold" />
                    <span>Curated Collections</span>
                  </div>
                  <div className="mt-2 divide-y divide-aesthique-beige/30">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between py-2 px-3 text-xs tracking-wider text-aesthique-espresso hover:bg-aesthique-ivory hover:text-aesthique-copper transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-aesthique-copper/60 font-sans">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={cn(
                'transition-colors hover:text-aesthique-copper py-2',
                pathname === '/about' ? 'text-aesthique-copper font-semibold' : 'text-aesthique-espresso'
              )}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                'transition-colors hover:text-aesthique-copper py-2',
                pathname === '/contact' ? 'text-aesthique-copper font-semibold' : 'text-aesthique-espresso'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Center Brand Identity (Emblem Logo) */}
          <Link href="/" className="flex flex-col items-center group py-1 text-center">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand/aesthique-logo.png"
                alt="AESTHIQUE Emblem"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 44px, 48px"
              />
            </div>
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-[0.2em] text-aesthique-espresso mt-0.5 leading-none">
              AESTHIQUE
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-aesthique-copper font-medium mt-0.5">
              Little Things, Better Living.
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wider text-aesthique-espresso hover:text-aesthique-copper transition-colors py-2 px-2.5 focus:outline-none"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px]">Search</span>
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 text-aesthique-espresso hover:text-aesthique-copper transition-colors focus:outline-none relative group"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
              <span className="sr-only">Account</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 text-aesthique-espresso hover:text-aesthique-copper transition-colors focus:outline-none relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-aesthique-copper text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-aesthique-espresso hover:text-aesthique-copper transition-colors focus:outline-none relative flex items-center gap-1.5"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-aesthique-espresso text-aesthique-gold text-[9px] font-bold rounded-full flex items-center justify-center border border-aesthique-gold">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs uppercase font-medium tracking-wider">
                Bag
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Off-Canvas Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-50 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="bg-aesthique-ivory w-4/5 max-w-sm h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-widest text-aesthique-copper font-semibold pb-3 border-b border-aesthique-beige">
                Navigation
              </div>
              <nav className="flex flex-col space-y-4 text-sm uppercase tracking-wider font-medium text-aesthique-espresso">
                <Link href="/" className="hover:text-aesthique-copper">
                  Home
                </Link>
                <Link href="/shop" className="hover:text-aesthique-copper">
                  Shop All Collections
                </Link>
                <Link href="/about" className="hover:text-aesthique-copper">
                  About Our Brand
                </Link>
                <Link href="/contact" className="hover:text-aesthique-copper">
                  Contact & Concierge
                </Link>
                <Link href="/account" className="hover:text-aesthique-copper">
                  My Account / Orders
                </Link>
                <Link href="/wishlist" className="hover:text-aesthique-copper flex items-center justify-between">
                  <span>Saved Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-aesthique-copper text-white text-[10px] px-2 py-0.5 font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </nav>

              <div className="pt-4 border-t border-aesthique-beige">
                <div className="text-xs uppercase tracking-widest text-aesthique-copper font-semibold mb-3">
                  Shop By Category
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="text-xs text-aesthique-espresso/90 hover:text-aesthique-copper py-1"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-aesthique-beige text-xs text-aesthique-espresso/70 text-center">
              <p className="font-editorial text-sm text-aesthique-espresso font-semibold">AESTHIQUE</p>
              <p className="text-[10px] text-aesthique-copper uppercase tracking-wider mt-0.5">
                Little Things, Better Living.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
