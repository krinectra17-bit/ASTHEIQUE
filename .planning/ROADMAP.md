# AESTHIQUE — GSD DEVELOPMENT ROADMAP

> **Brand:** AESTHIQUE ("Little Things, Better Living.")  
> **Development Lifecycle:** 10 Milestones in strict dependency order.

---

## Milestone Breakdown

### Phase 1: Discovery & Architecture (Status: Completed)
- [x] Step 1.1: GSD environment inspection & repository initialization.
- [x] Step 1.2: Brand identity extraction from official logo (`public/brand/aesthique-logo.png`).
- [x] Step 1.3: Architectural documentation (`PROJECT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`).
- [x] Step 1.4: Database schema design with 22 relational tables & RLS (`DATABASE_SCHEMA.md`).
- [x] Step 1.5: API contract, security specifications, and integration design (`API_DOCUMENTATION.md`, `SECURITY.md`, `INTEGRATIONS.md`, `TESTING_PLAN.md`, `DEPLOYMENT.md`).

### Phase 2: Design System & Storefront Foundation (Status: Completed)
- [x] Step 2.1: Initialize Next.js 15 + TypeScript + Tailwind CSS project with custom AESTHIQUE luxury color palette and serif typography tokens.
- [x] Step 2.2: Build core reusable UI primitives (`Button`, `Badge`, `Modal`, `Input`, `Drawer`, `Accordion`).
- [x] Step 2.3: Build responsive navigation Header with AESTHIQUE logo, category drawer, quick search, and persistent mini-cart bag.
- [x] Step 2.4: Build 12-section Editorial Homepage with high-converting lifestyle storytelling.
- [x] Step 2.5: Build Shop All, Category listing, and Subcategory listing pages with responsive filters.
- [x] Step 2.6: Build Product Detail Page (PDP) with multi-image gallery, variant selector, interactive pincode checker, and sticky mobile add-to-cart.
- [x] Step 2.7: Build all brand & policy pages (About Us, Contact Us, FAQ, Privacy Policy, Terms, Shipping Policy, Returns & Refund Policy).

### Phase 3: Database & Authentication (Status: Completed)
- [x] Step 3.1: Generate complete Supabase PostgreSQL migration scripts for all 24 reconciled tables with foreign keys and indexes.
- [x] Step 3.2: Configure Row Level Security (RLS) policies for customer isolation and admin access.
- [x] Step 3.3: Build Supabase Auth integration (Customer registration, login, logout, password recovery, session handling).
- [x] Step 3.4: Customer Account portal (Profile overview, saved address book, order history, account settings).

### Phase 4: Product & Inventory Management (Status: Active)
- [ ] Step 4.1: Database seed script with rich realistic lifestyle products across initial 10 categories.
- [ ] Step 4.2: Server-side product discovery engine (full-text search, category filters, price sorting).
- [ ] Step 4.3: Real-time inventory tracking with stock reservation and low-stock alerts.

### Phase 5: Cart, Wishlist & Checkout
- [ ] Step 5.1: Dual-state Cart engine (persistent guest cart + authenticated customer database cart).
- [ ] Step 5.2: Server-authoritative pricing engine (subtotals, discounts, GST calculation, free shipping threshold).
- [ ] Step 5.3: Coupon validation engine (percentage/fixed, MOV limits, usage caps).
- [ ] Step 5.4: Customer Wishlist with one-click move to cart.
- [ ] Step 5.5: Comprehensive single-page checkout (address collection, payment method selection, order summary).

### Phase 6: Razorpay Payment Gateway Integration
- [ ] Step 6.1: Dedicated Razorpay service adapter with test mode support.
- [ ] Step 6.2: Server-side order creation (`/api/checkout/create-intent`).
- [ ] Step 6.3: Client-side Razorpay modal mount with AESTHIQUE theme.
- [ ] Step 6.4: Cryptographic HMAC-SHA256 signature verification route (`/api/payments/razorpay/verify`).
- [ ] Step 6.5: Razorpay webhook listener with signature verification and idempotency handling.

### Phase 7: Shiprocket Shipping Integration
- [ ] Step 7.1: Dedicated Shiprocket service adapter with automated JWT authentication and cache-aware refresh.
- [ ] Step 7.2: Real-time pincode serviceability & estimated delivery date checker.
- [ ] Step 7.3: Order fulfillment workflow: shipment creation, courier allocation, AWB generation, and pickup scheduling.
- [ ] Step 7.4: Tracking timeline synchronization and customer order tracking page.

### Phase 8: Complete Admin Dashboard (`/admin`)
- [ ] Step 8.1: Secure Admin authentication and server-side RBAC guard (`admin_users`).
- [ ] Step 8.2: Dashboard overview with real-time KPI metrics, revenue charts, and low-stock notifications.
- [ ] Step 8.3: Product & Inventory CRUD manager with multi-image gallery management.
- [ ] Step 8.4: Order Management (status updates, COD verification, shipment creation, AWB generation, refunds).
- [ ] Step 8.5: Category, Coupon, Customer, Review, and Banner management modules.
- [ ] Step 8.6: Store settings & sales reports.

### Phase 9: SEO, Performance & Security Hardening
- [ ] Step 9.1: Dynamic metadata, Open Graph tags, JSON-LD Schema markup (Product, Organization, Breadcrumb).
- [ ] Step 9.2: Sitemap generation and `robots.txt`.
- [ ] Step 9.3: Image optimization and performance audit.
- [ ] Step 9.4: Security audit (input sanitization, OWASP verification, RLS validation).

### Phase 10: Testing, Quality Assurance & Deployment
- [ ] Step 10.1: Comprehensive test suite execution (Storefront, Cart, Checkout, Admin, Integrations).
- [ ] Step 10.2: Responsive testing across mobile (360px, 390px, 430px), tablet, and desktop.
- [ ] Step 10.3: Production build verification (`npm run build`).
- [ ] Step 10.4: Final documentation, `.env.example`, demo credentials, and release package.
