# AESTHIQUE — THIRD-PARTY INTEGRATIONS SPECIFICATION

---

## 1. Razorpay Payment Gateway Integration

### 1.1 Configuration & Environment Keys
```env
# Razorpay Credentials (Test / Live)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```

### 1.2 Integration Modes & Safety
- **Test Mode:** Uses Razorpay test key pair. Validated with standard test cards, test UPI IDs (`success@razorpay`), and test NetBanking handles.
- **Production Switch:** Zero code changes required — seamlessly switches to production by supplying live credentials.
- **Missing Credential Handling:** If credentials are not configured, the payment module gracefully renders a clear diagnostic banner for administrators without failing silently or producing fake payment confirmations.

### 1.3 Signature Verification Architecture
```typescript
import crypto from 'crypto';

export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', params.secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(params.signature)
  );
}
```

### 1.4 Refund Management
- Admin can trigger partial or full refunds through `/api/admin/orders/[id]/refund`.
- Calls `POST https://api.razorpay.com/v1/payments/:id/refund`.
- Records refund status in `payments` and updates `orders` payment status to `REFUNDED` or `PARTIALLY_REFUNDED`.

---

## 2. Shiprocket Logistics Integration

### 2.1 Configuration & Environment Keys
```env
# Shiprocket Credentials
SHIPROCKET_EMAIL="logistics@aesthique.com"
SHIPROCKET_PASSWORD="..."
SHIPROCKET_BASE_URL="https://apiv2.shiprocket.in/v1/external"
```

### 2.2 Token Management & Caching
- **Authentication:** `POST /auth/login` with email and password returns JWT token valid for 24 hours.
- **In-Memory / Database Token Cache:** Token and expiration timestamp are cached. Requests verify expiration and automatically refresh the token without blocking user workflows.

### 2.3 Order Lifecycle & API Mapping
1. **Serviceability:** `GET /courier/serviceability?pickup_postcode=...&delivery_postcode=...&weight=...&cod=0`
2. **Create Order:** `POST /orders/create/adhoc`
   - Maps AESTHIQUE order details, customer address, package weight, and SKU list.
   - Returns Shiprocket `order_id` and `shipment_id`.
3. **Assign Courier & AWB:** `POST /courier/assign/awb`
   - Allocates the highest rated or lowest cost available courier (e.g. Bluedart, Delhivery, Ekart).
   - Generates and persists the tracking AWB code.
4. **Schedule Pickup:** `POST /couriers/generate/pickup`
   - Schedules package pickup from store warehouse.
5. **Print Shipping Label:** `POST /courier/generate/label`
   - Fetches official shipping label PDF URL for warehouse packing.
6. **Real-time Tracking:** `GET /courier/track/awb/:awb_code`
   - Fetches transit history, milestones (Picked up, In Transit, Out for Delivery, Delivered, RTO).

### 2.4 Graceful Fallback
When Shiprocket API sandbox credentials are not yet provisioned, the integration adapter validates all payloads and returns structured diagnostic information explaining that credentials are required, without fabricating fictitious tracking events.
