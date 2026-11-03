# AESTHIQUE — SECURITY & COMPLIANCE SPECIFICATION

> **Security Posture:** Zero-Trust Client, Defense-in-Depth, Principle of Least Privilege  
> **Target Compliance:** OWASP Top 10, RBI E-Commerce Payment Guidelines, DPDP Act (India)

---

## 1. Threat Model & Mitigations

| Threat Vector | Attack Scenario | Mitigation Strategy |
| :--- | :--- | :--- |
| **Price Tampering** | Malicious actor alters `price` in cart or checkout request body. | **Server-Authoritative Pricing:** Client requests never send prices. Cart and order totals are re-computed directly from `products` and `coupons` database records on the server. |
| **Coupon Abuse** | User applies multiple coupons, expired codes, or bypasses minimum order limits. | **Atomic Server Verification:** Verification queries run inside transaction with row locks on `coupons` table checking usage counters and expiration timestamps. |
| **Payment Signature Forgery** | Attacker simulates successful Razorpay callback with fake payment ID. | **Cryptographic HMAC-SHA256 Verification:** Secret key never leaves the server. Orders are never marked `PAID` without verifying the HMAC signature against `order_id + '|' + payment_id`. |
| **Duplicate Payments & Orders** | Double clicks or network retries causing multiple charges or orders. | **Idempotency Keys:** Unique idempotency tokens generated for each checkout session. Duplicate requests return existing order. |
| **Privilege Escalation** | Customer account accesses `/admin` routes or API handlers. | **Strict Server-Side RBAC:** Middleware and API route handlers verify identity against the dedicated `admin_users` table using Supabase service client. Customers can never access admin resources. |
| **Insecure Direct Object Reference (IDOR)** | User queries another customer's order by changing the order UUID. | **PostgreSQL RLS:** Row Level Security enforces `auth.uid() = user_id`. Customers are structurally blocked at the database layer from querying other users' rows. |
| **Secret Exposure** | Leaking `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, or `SHIPROCKET_PASSWORD`. | **Strict Environment Boundary:** Server secrets are defined only in server-side files without `NEXT_PUBLIC_` prefixes. Audited in CI/CD pipeline. |
| **Inventory Race Conditions** | Two buyers simultaneously checkout the last remaining item. | **Atomic Reservations:** `UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1`. |

---

## 2. Row Level Security (RLS) Policy Architecture

Every table has `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

```sql
-- Example RLS Policy for Orders
CREATE POLICY "Customers can only view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to orders"
ON public.orders FOR ALL
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND is_active = true));
```

---

## 3. Input Sanitization & Zod Schemas

All user inputs (forms, API payloads, query params) are validated via strict Zod schemas before touching any business logic:
- Email addresses: normalized, lowercase, RFC 5322 regex.
- Phone numbers: 10-digit Indian mobile standard (`^[6-9]\d{9}$`).
- Pincodes: 6-digit postal code (`^[1-9][0-9]{5}$`).
- Text fields: stripped of executable HTML/JavaScript tags to prevent Stored XSS.
