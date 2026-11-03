# AESTHIQUE — REQUIREMENTS SPECIFICATION

> **Brand:** AESTHIQUE ("Little Things, Better Living.")  
> **System Scope:** Production-Ready Full-Stack E-Commerce Platform  
> **Target Audience:** Modern design-conscious consumers seeking elevated everyday home & lifestyle essentials.

---

## 1. Functional Requirements Matrix

### 1.1 Storefront & Content Pages (FR-ST)
- **FR-ST-01:** Responsive Header featuring the AESTHIQUE logo, multi-level category navigation dropdown, quick search bar, account drawer/link, persistent wishlist counter, and sliding cart bag preview.
- **FR-ST-02:** Announcement Bar with dynamic dismissible notifications (shipping thresholds, launch offers, curated announcements).
- **FR-ST-03:** Homepage with 12 distinct sections:
  1. Announcement Bar
  2. Responsive Navigation Header
  3. Editorial Hero with high-resolution visual storytelling ("Make Everyday Living Beautiful")
  4. Dynamic Category Showcase (Home & Living, Kitchen Essentials, Decor, Personal Care, Travel, etc.)
  5. Real-Time Bestsellers Carousel/Grid
  6. New Arrivals Showcase
  7. Editorial Campaign Banner
  8. Value Proposition ("Why AESTHIQUE" - Thoughtfully Selected, Everyday Functionality, Beautifully Designed, Everyday Convenience)
  9. Customer Testimonials / Verified Reviews
  10. Curated Social Lifestyle Gallery
  11. Newsletter Subscription with immediate email format validation
  12. Comprehensive Footer with legal, shipping, return, and payment trust badges.
- **FR-ST-04:** Dedicated Content & Policy Pages:
  - About Us, Contact Us (with working contact form), FAQ (categorized accordion)
  - Privacy Policy, Terms & Conditions, Shipping Policy, Return & Refund Policy.

### 1.2 Catalog & Product Discovery (FR-PD)
- **FR-PD-01:** Shop All and Category/Subcategory listing pages with server-driven filtering (by category, price range, in-stock status, rating).
- **FR-PD-02:** Real-time search with debounced querying across product title, tags, description, and SKU.
- **FR-PD-03:** Sorting options: Newest First, Price: Low to High, Price: High to Low, Bestsellers, Featured.
- **FR-PD-04:** Product Detail Page (PDP):
  - Multi-image gallery with thumbnail switcher and interactive zoom modal.
  - SKU, real-time stock indicator, price & percentage discount display.
  - Color and size variant selection with dynamic image/stock switching.
  - Delivery pincode serviceability checker (interactive Indian 6-digit postal code lookup).
  - Estimated delivery timeline based on region.
  - Add to Cart, Instant Buy Now (direct to checkout), and Wishlist toggle.
  - Full editorial description, specifications table, care instructions.
  - Related and Frequently Bought Together product recommendations.

### 1.3 Cart, Wishlist & Pricing Engine (FR-CW)
- **FR-CW-01:** Server-validated Cart state supporting both unauthenticated guest visitors (stored in local storage/cookies) and logged-in customers (synced automatically to database `carts`).
- **FR-CW-02:** Strict server-side pricing recalculation — all line totals, subtotals, tax (GST), shipping thresholds, and discounts calculated on the server.
- **FR-CW-03:** Coupon validation engine supporting:
  - Percentage discounts with optional maximum cap (`max_discount_amount`).
  - Fixed amount discounts.
  - Minimum order value (MOV) validation.
  - Start date, expiration date, and maximum global/user usage caps.
- **FR-CW-04:** Customer Wishlist with one-click migration of items to cart and automatic handling of out-of-stock items.

### 1.4 Customer Authentication & Account Management (FR-AU)
- **FR-AU-01:** Customer registration with email and secure password, input sanitization, and password strength validation.
- **FR-AU-02:** Login with session persistence (HTTP-only secure cookies) and password reset flow.
- **FR-AU-03:** Customer Profile dashboard with personal details management.
- **FR-AU-04:** Address Book: Multiple saved addresses with default shipping and billing designations.
- **FR-AU-05:** Order History & Tracking: Complete list of past orders, item snapshots, invoice download, payment status, and live Shiprocket tracking timeline.

### 1.5 Checkout & Order Fulfillment (FR-OR)
- **FR-OR-01:** Unified, frictionless single-page or multi-step checkout:
  1. Contact Information
  2. Shipping & Delivery Address (Full name, mobile, flat/house no, street, area, city, state, pincode, landmark)
  3. Shipping Method Selection (Standard Express, Free Shipping over threshold)
  4. Payment Method Selection (Razorpay: UPI, Card, Net Banking; or Cash on Delivery)
  5. Order Review & Final Authorization.
- **FR-OR-02:** Server-side atomic order creation with inventory stock lock and reservation.
- **FR-OR-03:** Generation of unique human-readable order numbers (e.g. `AES-2026-XXXXX`).
- **FR-OR-04:** Idempotency checks to prevent duplicate order generation or payment replay attacks.

### 1.6 Razorpay Payment Integration (FR-RP)
- **FR-RP-01:** Server-side order creation via Razorpay Orders API with amount calculated in paise.
- **FR-RP-02:** Razorpay Checkout modal initialization with brand theme matching AESTHIQUE palette (`#C99A68` / `#30251F`).
- **FR-RP-03:** Secure cryptographic HMAC-SHA256 signature verification upon payment completion before updating order status to `PAID`.
- **FR-RP-04:** Webhook listener for asynchronous events (`payment.captured`, `payment.failed`, `order.paid`, `refund.processed`) with signature verification (`X-Razorpay-Signature`).
- **FR-RP-05:** Admin-initiated partial or full refunds with status tracking.
- **FR-RP-06:** Test/Production credential isolation with informative configuration guards.

### 1.7 Shiprocket Shipping Integration (FR-SR)
- **FR-SR-01:** Dedicated Shiprocket integration client with automated JWT authentication and cache-aware token refresh.
- **FR-SR-02:** Pincode serviceability & estimated delivery date API lookup.
- **FR-SR-03:** Automated shipment order payload generation with item dimensions, dead weight, and COD/Prepaid breakdown.
- **FR-SR-04:** Courier assignment and Air Waybill (AWB) generation from admin order view.
- **FR-SR-05:** Pickup request scheduling with manifests and shipping label PDF retrieval.
- **FR-SR-06:** Real-time shipment tracking synchronization via webhook or polling cron.

### 1.8 Comprehensive Admin Dashboard (FR-AD)
- **FR-AD-01:** Dedicated administrative portal at `/admin` protected by server-side RBAC against `admin_users`.
- **FR-AD-02:** Overview Dashboard: Real-time gross sales, net revenue, total orders, active customers, low-stock alerts, recent transactions, and revenue visualization charts.
- **FR-AD-03:** Product Management: Full CRUD, multiple image uploads to Supabase Storage, variant manager, pricing, stock levels, SEO metadata.
- **FR-AD-04:** Order Management: Comprehensive order lifecycle management (Pending -> Processing -> Shipped -> Delivered -> Cancelled), payment verification, COD approval, AWB creation, label printing, refund triggering.
- **FR-AD-05:** Inventory Management: Stock level tracking, low-stock warnings, manual adjustments with audit reason logging (`inventory_movements`).
- **FR-AD-06:** Coupon & Promotion Manager: CRUD for promotional codes, usage metrics, and validity rules.
- **FR-AD-07:** Category & Taxonomy Manager: Category hierarchy, display order, banner assignment, subcategory grouping.
- **FR-AD-08:** Customer Management: Customer directory, lifetime value (LTV), order history, status toggling.
- **FR-AD-09:** Review Moderation: Approve, hide, or delete customer ratings and feedback.
- **FR-AD-10:** Homepage & Banners: Visual content management for announcement bars, hero slides, and promotional banners.
- **FR-AD-11:** Store Settings: Business details, tax rates (GST), shipping fees, contact details, social links.

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Security & Compliance (NFR-SEC)
- **NFR-SEC-01:** Complete Row Level Security (RLS) on all Supabase PostgreSQL tables. Customers can only read and mutate their own cart, orders, profile, and addresses.
- **NFR-SEC-02:** Service Role Key strictly isolated to server-side Node.js environment; never exposed in client bundles.
- **NFR-SEC-03:** Input sanitization and strict schema validation using Zod for all API routes and server actions.
- **NFR-SEC-04:** Protection against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, insecure direct object references, price manipulation).

### 2.2 Performance & Core Web Vitals (NFR-PERF)
- **NFR-PERF-01:** Largest Contentful Paint (LCP) under 2.0s on 4G mobile networks.
- **NFR-PERF-02:** Cumulative Layout Shift (CLS) under 0.05.
- **NFR-PERF-03:** First Input Delay (FID) / Interaction to Next Paint (INP) under 100ms.
- **NFR-PERF-04:** Next.js automatic image optimization with responsive srcset, WebP/AVIF compression, and layout reservation.

### 2.3 Responsiveness & Accessibility (NFR-A11Y)
- **NFR-A11Y-01:** Pixel-perfect responsive rendering across 360px, 390px, 430px (iPhone & Android), 768px (iPad portrait), 1024px (iPad landscape), and 1440px+ (desktop).
- **NFR-A11Y-02:** WCAG 2.1 Level AA color contrast compliance, keyboard navigable focus rings, semantic landmark elements, ARIA labels on all modal and drawer triggers.
