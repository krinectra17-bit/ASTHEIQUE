import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tdvuvvrootrfrmjmwvbv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2HevP9n7xzlhK3xqD0PZeg_Ge0jS76D';

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'profiles',
  'admin_users',
  'user_addresses',
  'categories',
  'products',
  'product_images',
  'product_variants',
  'inventory',
  'inventory_movements',
  'carts',
  'cart_items',
  'wishlists',
  'wishlist_items',
  'coupons',
  'coupon_redemptions',
  'orders',
  'order_items',
  'payments',
  'shipments',
  'shipment_events',
  'product_reviews',
  'newsletter_subscribers',
  'store_settings',
  'homepage_banners'
];

async function checkAll() {
  console.log('Probing all 24 tables via direct SELECT...');
  const existing: string[] = [];
  const missing: string[] = [];

  for (const table of TABLES) {
    const res = await supabase.from(table).select('id').limit(1);
    if (res.error && res.error.code === 'PGRST205') {
      missing.push(table);
    } else if (res.error) {
      console.log(`Table ${table} returned error code ${res.error.code}: ${res.error.message}`);
      if (res.error.code === '42P01') {
        missing.push(table);
      } else {
        existing.push(table);
      }
    } else {
      existing.push(table);
    }
  }

  console.log(`\nExisting Tables in Remote DB (${existing.length}):`, existing);
  console.log(`Missing Tables (Pending Migration) (${missing.length}):`, missing);
}

checkAll().catch(console.error);
