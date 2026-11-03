# AESTHIQUE — API DOCUMENTATION

> **Base URL:** `/api`  
> **Protocol:** HTTPS / JSON API  
> **Authentication:** Supabase JWT Bearer Token / HTTP-only Secure Session Cookies  
> **Validation:** Zod Schema Validation on all request payloads

---

## 1. Storefront & Cart Endpoints

### 1.1 Cart Operations
- `GET /api/cart`
  - Retrieves active cart for authenticated user or session token.
  - Response includes item details, subtotal, discount, estimated shipping, and line prices.
- `POST /api/cart/items`
  - Payload: `{ productId: string, variantId?: string, quantity: number }`
  - Validates stock availability against `inventory` table.
- `PATCH /api/cart/items/:id`
  - Payload: `{ quantity: number }`
- `DELETE /api/cart/items/:id`
  - Removes item from cart.

### 1.2 Coupon Application
- `POST /api/cart/apply-coupon`
  - Payload: `{ code: string }`
  - Verifies start/expiration date, min order value, usage limits, and calculates discount.
- `POST /api/cart/remove-coupon`
  - Clears applied coupon and reverts discount.

---

## 2. Checkout & Payment Endpoints

### 2.1 Order Creation
- `POST /api/checkout/create-intent`
  - Payload:
    ```json
    {
      "customer": { "email": "...", "phone": "..." },
      "shippingAddress": { ... },
      "billingAddress": { ... },
      "paymentMethod": "RAZORPAY" | "COD",
      "couponCode": "WELCOME10"
    }
    ```
  - Calculates final server-authoritative amount.
  - If Razorpay: Calls Razorpay API to generate `razorpay_order_id`.
  - Inserts record into `orders` with status `PENDING`.
  - Returns: `{ orderId, orderNumber, razorpayOrderId, amount, keyId }`.

### 2.2 Payment Verification
- `POST /api/payments/razorpay/verify`
  - Payload:
    ```json
    {
      "razorpay_order_id": "order_XXXXXX",
      "razorpay_payment_id": "pay_YYYYYY",
      "razorpay_signature": "zzzzzz..."
    }
    ```
  - Computes `crypto.createHmac('sha256', secret).update(order_id + "|" + payment_id).digest('hex')`.
  - If valid: Updates order status to `PROCESSING`, payment to `PAID`, reserves inventory.
  - Returns: `{ verified: true, orderNumber: "AES-..." }`.

### 2.3 Razorpay Webhook Handler
- `POST /api/payments/razorpay/webhook`
  - Verifies `x-razorpay-signature` header against `RAZORPAY_WEBHOOK_SECRET`.
  - Handles asynchronous events:
    - `payment.captured`
    - `payment.failed`
    - `refund.processed`
  - Idempotent: Skips already processed transactions.

---

## 3. Shipping & Logistics Endpoints (Shiprocket)

### 3.1 Pincode Serviceability
- `GET /api/shipping/serviceability?pincode=110001&weight=0.5`
  - Checks deliverability and estimated transit time across partner couriers.

### 3.2 Live Tracking
- `GET /api/shipping/track/:orderNumber`
  - Queries Shiprocket tracking API for real-time shipment milestones.

---

## 4. Admin API Endpoints (`/api/admin/...`)

*Protected by Server-Side Admin Session Guard (`admin_users` table).*

- `GET /api/admin/analytics/overview`: Gross sales, net revenue, total orders, low-stock count, conversion metrics.
- `GET /api/admin/products`: Paginated list of products with inventory status and search.
- `POST /api/admin/products`: Create product, variants, and image gallery.
- `PATCH /api/admin/products/:id`: Update product attributes, status, prices.
- `DELETE /api/admin/products/:id`: Soft delete or deactivate product.
- `GET /api/admin/orders`: Filterable order stream by payment, fulfillment, and date.
- `PATCH /api/admin/orders/:id/status`: Update workflow status (`PROCESSING`, `SHIPPED`, `CANCELLED`).
- `POST /api/admin/orders/:id/create-shipment`: Triggers Shiprocket order and AWB generation.
- `POST /api/admin/orders/:id/refund`: Initiates partial or full Razorpay refund.
- `GET /api/admin/inventory`: Stock levels across all SKUs with low-stock warnings.
- `POST /api/admin/inventory/adjust`: Manual inventory adjustments with reason logging.
- `GET /api/admin/coupons` & `POST /api/admin/coupons`: Promotion management.
- `GET /api/admin/reviews` & `PATCH /api/admin/reviews/:id`: Moderation workflow.
- `GET /api/admin/settings` & `PUT /api/admin/settings`: Store configuration.
