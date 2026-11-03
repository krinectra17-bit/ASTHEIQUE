# AESTHIQUE — GSD PROJECT STATE

> **Current Milestone:** Milestone 5 Completed -> Advancing to Milestone 6  
> **Last Updated:** 2026-11-04  
> **Active Focus:** Razorpay Payment Gateway Integration

---

## Current Status Overview
- **Repository:** Connected to `https://github.com/krinectra17-bit/ASTHEIQUE.git` on `main`.
- **Milestone 1 (Discovery & Architecture):** Completed & pushed.
- **Milestone 2 (Design System & Storefront):** Completed & pushed.
- **Milestone 3 (Database & Authentication):** Completed & pushed (24 reconciled tables, RLS, customer auth, address book, Supabase SSR client).
- **Milestone 4 (Product & Inventory Management):** Completed & pushed (catalog service, search API, atomic stock reservation procedures, low-stock alerts).
- **Milestone 5 (Cart, Wishlist & Checkout Backend):** 100% complete:
  - Dual-state Cart engine: persistent guest cart + authenticated customer database cart synchronization service (`src/lib/cart/service.ts`).
  - Server-Authoritative Pricing Engine (`src/lib/pricing/engine.ts`) enforcing zero-trust client pricing with 18% GST breakdown, coupon calculation, and ₹1,999 free shipping threshold.
  - Coupon validation service & API route (`src/lib/coupons/service.ts`, `/api/coupons/validate`) with promo codes, min order value check, usage limits, customer redemption tracking, and times_used increments.
  - Server-Authoritative Checkout & Order Creation Engine (`src/lib/checkout/service.ts`, `/api/checkout/create-order`) validating address, calculating authoritative pricing, atomically reserving inventory via `reserveStock()`, and creating orders in `orders` & `order_items`.
  - Cash on Delivery (COD) workflow committing inventory and recording coupon redemptions.
  - Interactive single-page checkout wired to server API, updating customer order history and order tracking page (`/account/track/[orderNumber]`).
  - Production build passed (28/28 routes prerendered).

---

## Milestone Progress Tracker
- [x] **Milestone 1: Discovery & Architecture** (Completed)
- [x] **Milestone 2: Design System & Storefront** (Completed)
- [x] **Milestone 3: Database & Authentication** (Completed)
- [x] **Milestone 4: Product & Inventory Management** (Completed)
- [x] **Milestone 5: Cart, Wishlist & Checkout Backend** (Completed)
- [ ] **Milestone 6: Razorpay Integration** (Active Next)
- [ ] **Milestone 7: Shiprocket Integration**
- [ ] **Milestone 8: Complete Admin Dashboard**
- [ ] **Milestone 9: SEO, Performance & Security**
- [ ] **Milestone 10: Testing & Deployment**

---

## Blockers & External Credentials Needed
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Configured with temporary development project.
- `SUPABASE_SERVICE_ROLE_KEY`: Service-role key for administrative backend operations (bypassing RLS for admin tasks/syncs). Safe fallback mock mode handles missing key gracefully.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Test credentials needed for live test-mode payment capture (adapter supports mock test mode when unset).
- `SHIPROCKET_EMAIL` & `SHIPROCKET_PASSWORD`: Sandbox credentials needed for live AWB generation (adapter supports mock courier routing when unset).
