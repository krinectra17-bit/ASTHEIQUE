# AESTHIQUE — DEPLOYMENT & PRODUCTION READINESS GUIDE

> **Target Platform:** Vercel (Edge Network + Serverless Functions)  
> **Database:** Supabase Managed PostgreSQL + Storage  
> **Domain:** Production custom domain with SSL

---

## 1. Environment Variables Specification

Create `.env.local` for local development based on `.env.example`:

```env
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="AESTHIQUE"

# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Razorpay Payment Gateway (Test or Live)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# Shiprocket Logistics Integration
SHIPROCKET_EMAIL="logistics@aesthique.com"
SHIPROCKET_PASSWORD="..."
SHIPROCKET_BASE_URL="https://apiv2.shiprocket.in/v1/external"
```

---

## 2. Deployment Procedures (Vercel)

1. **Repository Setup:** Push codebase to GitHub/GitLab repository.
2. **Import Project into Vercel:** Select Next.js preset.
3. **Configure Environment Variables:** Add all production secrets in Vercel Project Settings.
4. **Deploy:** Trigger initial deployment; Vercel will automatically build and distribute the app across Edge regions.
5. **Database Migrations:** Apply all migration SQL files in `supabase/migrations/` via Supabase SQL Editor or Supabase CLI.
6. **Seed Initial Admin & Catalog:** Run migration seed script to create initial admin account and default category hierarchy.
7. **Webhook Registration:**
   - In Razorpay Dashboard, set Webhook URL to: `https://your-domain.com/api/payments/razorpay/webhook`.
   - In Shiprocket Dashboard, set Tracking Webhook URL to: `https://your-domain.com/api/shipping/webhook`.
