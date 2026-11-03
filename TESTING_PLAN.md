# AESTHIQUE — TESTING & QUALITY ASSURANCE PLAN

> **Testing Philosophy:** Every milestone must be validated prior to closure. No feature is marked complete without testing.

---

## 1. Test Coverage Matrix

| Test Suite | Target Modules | Testing Strategy | Success Criteria |
| :--- | :--- | :--- | :--- |
| **TS-01: Storefront & Navigation** | Header, Category Menu, PDP, Search, Quick Filters | Component & Route E2E | All 23 customer pages render without errors, broken links, or console exceptions. |
| **TS-02: Pricing Engine** | Subtotal, GST, Coupons, Shipping Thresholds | Unit Tests with edge cases | 100% mathematical precision; zero client-side price trust. |
| **TS-03: Cart & Wishlist** | Guest Cart, Auth Cart sync, Wishlist-to-Cart | State persistence & API Tests | Guest items merge cleanly on login; stock limits enforced. |
| **TS-04: Checkout & Orders** | Single-page Checkout, Address Forms, Order Creation | Integration Tests | Atomically creates order, reserves inventory, generates order number. |
| **TS-05: Razorpay Gateway** | Order generation, HMAC verification, Webhooks | Mocked & Test Mode E2E | Valid signatures succeed; tampered signatures rejected immediately. |
| **TS-06: Shiprocket Logistics** | Token cache, Rate calculation, AWB generation, Tracking | Adapter Integration Tests | Proper payload serialization, error resilience when API is offline. |
| **TS-07: Admin RBAC & CRUD** | Products, Inventory, Orders, Categories, Coupons | Security & UI Flow Tests | Customer token denied 403 on `/admin`; full CRUD operations function seamlessly. |
| **TS-08: Responsiveness** | Viewports: 360px, 390px, 430px, 768px, 1280px+ | Visual & Emulated Mobile Tests | No horizontal overflow, readable typography, touch-friendly touch targets (min 44px). |
| **TS-09: Security & RLS** | Supabase Policies, OWASP XSS/SQLi | Security Audit Tests | Cross-tenant access blocked by RLS; inputs properly sanitized. |

---

## 2. Automated Test Execution Commands

```bash
# Unit & Integration Tests
npm run test

# Linting & Type Checking
npm run lint
npm run type-check

# Production Build Verification
npm run build
```
