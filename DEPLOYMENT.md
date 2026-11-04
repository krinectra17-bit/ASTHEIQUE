# AESTHIQUE — PRODUCTION DEPLOYMENT & OPERATIONS MANUAL

> **Brand:** AESTHIQUE ("Little Things, Better Living.")  
> **Target Cloud Host:** Vercel (Edge Network + Serverless Node.js Runtime)  
> **Database & Storage:** Supabase Managed PostgreSQL + Storage + Auth  
> **Payments:** Razorpay Gateway (INR)  
> **Logistics:** Shiprocket Express Air & Surface API  
> **Version:** 1.0.0 Production Release

---

## 1. Environment Configuration

### Production Variables Checklist

Configure these in the Vercel Project Settings under **Settings > Environment Variables**:

```env
# -------------------------------------------------------------
# APPLICATION & BRAND CONFIGURATION
# -------------------------------------------------------------
NEXT_PUBLIC_SITE_URL="https://aesthique.com"
NEXT_PUBLIC_SITE_NAME="AESTHIQUE"

# -------------------------------------------------------------
# SUPABASE POSTGRESQL & AUTH
# -------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://your-production-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# -------------------------------------------------------------
# RAZORPAY PAYMENT GATEWAY
# -------------------------------------------------------------
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your_razorpay_live_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# -------------------------------------------------------------
# SHIPROCKET LOGISTICS INTEGRATION
# -------------------------------------------------------------
SHIPROCKET_EMAIL="logistics@aesthique.com"
SHIPROCKET_PASSWORD="your_shiprocket_password"
SHIPROCKET_BASE_URL="https://apiv2.shiprocket.in/v1/external"
```

---

## 2. Database Migration Execution Order

Execute the SQL scripts in `supabase/migrations/` in sequence using the Supabase SQL Editor or Supabase CLI (`supabase db push`):

1. **`supabase/migrations/01_initial_schema.sql`**
   - Creates the 24 relational tables.
   - Creates foreign key constraints, indexes, triggers, and Row Level Security (RLS) policies.
   - Creates automatic profile creation trigger on `auth.users`.

2. **`supabase/migrations/02_seed_data.sql`**
   - Seeds the 10 initial luxury lifestyle categories.
   - Seeds rich handcrafted products, gallery visuals, variants, and initial inventory counts.
   - Seeds active promotional coupons (`WELCOME10`, `AESTHETIC500`, `FIRSTLIVING15`).
   - Seeds store configuration and homepage banners.

3. **`supabase/migrations/03_inventory_procedures.sql`**
   - Installs PostgreSQL stored functions:
     - `public.check_stock_availability(p_items JSONB)`
     - `public.reserve_stock(p_items JSONB, p_reference_id TEXT)`
     - `public.release_stock(p_items JSONB, p_reference_id TEXT, p_reason TEXT)`
     - `public.commit_stock_reservation(p_items JSONB, p_order_id TEXT)`
     - `public.get_low_stock_products(p_custom_threshold INT)`

---

## 3. Razorpay Payment Gateway Configuration

1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate API Keys (**Settings > API Keys > Generate Live Key**).
3. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in Vercel.
4. Configure Webhooks (**Settings > Webhooks > Add New Webhook**):
   - **URL:** `https://your-domain.com/api/payments/razorpay/webhook`
   - **Secret:** Enter a strong secret and set as `RAZORPAY_WEBHOOK_SECRET` in Vercel.
   - **Active Events:**
     - `payment.captured`
     - `payment.failed`
     - `refund.processed`

---

## 4. Shiprocket Logistics Configuration

1. Log in to the [Shiprocket Dashboard](https://app.shiprocket.in).
2. Register the central pickup location:
   - **Location Name:** `Primary Studio Hub`
   - **Pincode:** `110020` (Okhla Industrial Area, New Delhi)
3. Set `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` in Vercel.
4. Configure Webhooks (**Settings > API > Webhooks > Add Webhook**):
   - **Event:** `Tracking`
   - **URL:** `https://your-domain.com/api/shipping/webhook`

---

## 5. Deployment Verification Checklist

- [x] All 43 routes compile cleanly (`npm run build`).
- [x] Full automated test suite passes 26/26 tests (`npx tsx scripts/test-suite.ts`).
- [x] Server-authoritative zero-trust pricing engine operational.
- [x] Free shipping threshold verified at ₹1,999.
- [x] 18% GST calculation active.
- [x] Dynamic XML Sitemap generated at `/sitemap.xml`.
- [x] Crawler directives active at `/robots.txt`.
- [x] JSON-LD Structured Data (`Organization`, `WebSite`, `Product`, `BreadcrumbList`) rendered.
- [x] Security headers active (`HSTS`, `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).
- [x] Admin console accessible at `/admin`.

---

## 6. Admin Dashboard Access

- **URL:** `https://your-domain.com/admin`
- **Modules Available:**
  - Overview KPI dashboard & recent orders
  - Products catalog & new item creation
  - Orders management & Shiprocket courier booking
  - Live inventory tracking & manual stock adjustments
  - Promotional coupon campaigns
  - Customer review moderation
  - Platform settings & infrastructure health
