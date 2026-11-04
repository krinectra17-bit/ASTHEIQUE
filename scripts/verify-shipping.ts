async function testShippingEndpoints() {
  console.log('Testing Shipping Endpoints on http://localhost:3000:');

  // 1. Serviceability API test
  const pincode = '400001'; // Mumbai
  const servRes = await fetch(`http://localhost:3000/api/shipping/serviceability?pincode=${pincode}`);
  const servData = await servRes.json();
  console.log('1. GET /api/shipping/serviceability?pincode=400001:', servRes.status, servData);

  // 2. Tracking API test
  const awb = 'SR-84920194IN';
  const trackRes = await fetch(`http://localhost:3000/api/shipping/track/${awb}`);
  const trackData = await trackRes.json();
  console.log('2. GET /api/shipping/track/SR-84920194IN:', trackRes.status, trackData.success, trackData.tracking?.currentStatus);

  // 3. Webhook endpoint test
  const webhookRes = await fetch('http://localhost:3000/api/shipping/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      awb: 'SR-84920194IN',
      current_status: 'DELIVERED',
      current_timestamp: new Date().toISOString()
    })
  });
  const webhookData = await webhookRes.json();
  console.log('3. POST /api/shipping/webhook:', webhookRes.status, webhookData);
}

testShippingEndpoints().catch(console.error);
