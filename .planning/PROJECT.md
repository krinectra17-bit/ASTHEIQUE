# PROJECT: AESTHIQUE

> **Tagline:** Little Things, Better Living.  
> **Brand Vision:** Premium Lifestyle & Everyday Essentials Ecommerce Platform  
> **Methodology:** Antigravity + GSD (Get Shit Done)  
> **Status:** Active Development — Milestone 1 (Discovery & Architecture)

---

## 1. Executive Summary

**AESTHIQUE** is a full-featured, scalable, and production-ready direct-to-consumer (D2C) lifestyle ecommerce platform. It bridges thoughtful minimalist design with functional everyday goods spanning Home & Living, Kitchen Essentials, Home Decor, Personal Care, and Travel Essentials.

Unlike static prototypes or superficial landing pages, AESTHIQUE is engineered as an enterprise-grade digital retail infrastructure encompassing:
- A high-converting, mobile-first customer storefront with bespoke luxury editorial aesthetics.
- Server-authoritative transactional checkout with guest support and customer account synchronisation.
- Complete relational database model with PostgreSQL Row Level Security (RLS).
- Dedicated, secure Admin Dashboard (`/admin`) with role-based access control (RBAC).
- Indian market payment infrastructure via Razorpay (test/live mode with signature verification and webhook idempotency).
- Comprehensive logistics integration with Shiprocket (pincode serviceability, AWB generation, pickup scheduling, tracking synchronization).

---

## 2. Brand Identity & Visual System

Extracted directly from the official circular emblem and monogram:

| Color Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Ivory** | `#F8F4ED` | Primary background, clean canvas, natural light atmosphere |
| **Champagne Gold** | `#C99A68` | Primary luxury accent, badge border, premium button glow |
| **Copper** | `#B97852` | Warm secondary metallic, active states, hover indicators |
| **Espresso Brown** | `#30251F` | Primary typography, dark buttons, deep contrasts, header text |
| **Soft Beige** | `#E9DFD2` | Secondary backgrounds, subtle dividers, card outlines |
| **Pure White** | `#FFFFFF` | Product cards, popovers, modal surfaces |

### Typography Hierarchy
- **Display & Headings:** `Playfair Display` / `Cinzel` serif typeface reflecting timeless editorial luxury.
- **Body & Interface:** `Plus Jakarta Sans` / `Inter` clean geometric sans-serif ensuring optimum legibility on mobile viewports.

---

## 3. Technology Stack

- **Frontend Framework:** Next.js 15 (App Router) + React 19 + TypeScript (Strict Mode)
- **Styling & Design System:** Tailwind CSS with custom AESTHIQUE tokens + Lucide Icons + Framer Motion (subtle micro-interactions)
- **Database & Storage:** Supabase PostgreSQL with 22 relational tables and granular Row Level Security (RLS) + Supabase Storage for product images
- **Authentication:** Supabase Auth (Email/Password, OAuth ready, Session SSR tokens) + Role-based server guards for Admin (`admin_users`)
- **Payments:** Razorpay API (Server-side order creation, HMAC-SHA256 signature verification, webhook handler, idempotency)
- **Logistics:** Shiprocket REST API (Token caching, rate calculation, shipment booking, AWB, tracking sync)
- **Deployment Target:** Vercel with zero-configuration Edge & Serverless functions

---

## 4. Key Architectural Principles

1. **Server-Authoritative Pricing & Stock:** The client never dictates prices, discounts, or stock deductions. All order totals, coupon rules, and payments are recalculated and validated server-side.
2. **Strict RBAC & Tenant Isolation:** Administrative functions exist behind isolated `/admin` routes verified by server-side session claims against `admin_users`. Customer accounts never receive admin privileges by default.
3. **Idempotent Operations:** Payment webhooks and order placements use unique transaction tokens and idempotency keys to prevent duplicate processing.
4. **Resilient Third-Party Integrations:** Razorpay and Shiprocket adapters feature graceful degradation: clear diagnostic messages in development when credentials are unset, without fake deliveries or simulated payments.
5. **Progressive Enhancement & Mobile-First:** Fluid touch-first UX for 360px, 390px, 430px up to 4K displays, with zero horizontal scroll and sticky mobile shopping actions.

---

## 5. Development Milestones

- **MILESTONE 1:** Discovery and Architecture *(In Progress)*
- **MILESTONE 2:** Design System and Storefront
- **MILESTONE 3:** Database and Authentication
- **MILESTONE 4:** Product and Inventory Management
- **MILESTONE 5:** Cart, Wishlist and Checkout
- **MILESTONE 6:** Razorpay Integration
- **MILESTONE 7:** Shiprocket Integration
- **MILESTONE 8:** Complete Admin Dashboard
- **MILESTONE 9:** SEO, Performance and Security
- **MILESTONE 10:** Testing and Deployment
