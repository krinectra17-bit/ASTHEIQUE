const routes = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/inventory',
  '/admin/coupons',
  '/admin/reviews',
  '/admin/settings'
];

async function verifyAdminRoutes() {
  console.log('Testing Admin Panel HTTP Routes on http://localhost:3000:');
  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    console.log(`[${res.status === 200 ? 'PASS' : 'FAIL'}] ${r} -> Status ${res.status}`);
  }
}

verifyAdminRoutes().catch(console.error);
