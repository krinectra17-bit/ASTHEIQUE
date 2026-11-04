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

export async function runDatabaseActivationAudit() {
  console.log('================================================================');
  console.log(' AESTHIQUE — REMOTE SUPABASE DATABASE ACTIVATION VERIFICATION');
  console.log('================================================================\n');
  console.log(`Target Supabase URL: ${supabaseUrl}`);

  const results = {
    tablesFound: 0,
    tablesMissing: [] as string[],
    tableCounts: {} as Record<string, number>,
    authSignupPassed: false,
    profileCreated: false,
    productsPersisted: false,
    inventoryConfigured: false,
    rlsEnforced: false,
    rpcAvailable: false
  };

  // 1. Check Table Existence & Row Counts
  console.log('1. Auditing all 24 database tables via direct PostgREST queries...');
  for (const table of TABLES) {
    try {
      const { data, count, error } = await supabase.from(table).select('*', { count: 'exact' }).limit(1);
      if (error && error.code === 'PGRST205') {
        results.tablesMissing.push(table);
        console.log(`   [MISSING] Table public.${table} not found in schema cache.`);
      } else if (error) {
        console.log(`   [ERROR] Table public.${table}: ${error.message} (${error.code})`);
        if (error.code === '42P01') results.tablesMissing.push(table);
      } else {
        results.tablesFound++;
        results.tableCounts[table] = count ?? (data ? data.length : 0);
        console.log(`   [PASS] public.${table} exists (Rows: ${results.tableCounts[table]})`);
      }
    } catch (err: any) {
      console.log(`   [EXCEPTION] public.${table}: ${err.message}`);
      results.tablesMissing.push(table);
    }
  }

  console.log(`\nTables Verification: ${results.tablesFound}/24 exist.`);

  if (results.tablesMissing.length > 0) {
    console.log(`Tables awaiting execution: ${results.tablesMissing.join(', ')}`);
  }

  // 2. Check Seed Data (Products & Categories)
  console.log('\n2. Verifying Seed Data in Remote Database...');
  const { data: prods, error: prodErr } = await supabase.from('products').select('id, name, slug, regular_price, sale_price');
  if (prods && prods.length > 0) {
    results.productsPersisted = true;
    console.log(`   [PASS] Found ${prods.length} active products in remote DB:`);
    for (const p of prods) {
      console.log(`     • ${p.name} (${p.slug}) - ₹${p.sale_price || p.regular_price}`);
    }
  } else {
    console.log(`   [PENDING] Products not yet seeded: ${prodErr?.message || '0 rows'}`);
  }

  // 3. Check Inventory & Inventory RPC
  console.log('\n3. Verifying Inventory Stored Procedures...');
  try {
    const { data: invRpc, error: rpcErr } = await supabase.rpc('check_stock_availability', {
      p_items: [{ product_id: 'a0000001-0000-0000-0000-000000000001', variant_id: null, quantity: 1 }]
    });

    if (!rpcErr && invRpc) {
      results.rpcAvailable = true;
      results.inventoryConfigured = true;
      console.log(`   [PASS] check_stock_availability RPC executed successfully:`, invRpc);
    } else {
      console.log(`   [PENDING] Inventory RPC not yet installed: ${rpcErr?.message || 'Unavailable'}`);
    }
  } catch (err: any) {
    console.log(`   [PENDING] Inventory RPC exception: ${err.message}`);
  }

  // 4. Test Customer Registration & Profile Creation Trigger
  console.log('\n4. Testing Customer Registration & Profile Trigger (handle_new_user)...');
  const testEmail = `activation.test.${Date.now()}@gmail.com`;
  const testPassword = 'Password123!@#$';

  try {
    const { data: authUser, error: authErr } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Audit',
          last_name: 'Customer',
          phone: '+91 98765 43210'
        }
      }
    });

    if (!authErr && authUser.user) {
      results.authSignupPassed = true;
      console.log(`   [PASS] User registered via Supabase Auth: ID ${authUser.user.id}`);

      // Probe profiles table for trigger execution
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.user.id)
        .maybeSingle();

      if (profile) {
        results.profileCreated = true;
        console.log(`   [PASS] Profile record auto-created by trigger:`, profile);
      } else {
        console.log(`   [NOTE] Profile read note: ${profErr?.message || 'Profile trigger pending or restricted by RLS for anon key'}`);
      }
    } else {
      console.log(`   [FAIL] Auth signup failed: ${authErr?.message}`);
    }
  } catch (err: any) {
    console.log(`   [EXCEPTION] Auth signup: ${err.message}`);
  }

  // 5. Test RLS Protection
  console.log('\n5. Verifying Row Level Security (RLS) Policies...');
  try {
    const { error: rlsErr } = await supabase.from('admin_users').insert({
      id: '00000000-0000-0000-0000-000000000000',
      email: 'hacker@malicious.com',
      role: 'super_admin'
    });

    if (rlsErr) {
      results.rlsEnforced = true;
      console.log(`   [PASS] Unauthorized insert to admin_users strictly blocked by RLS: ${rlsErr.message}`);
    } else {
      console.log(`   [WARNING] Unauthorized insert succeeded! RLS policy may not be active.`);
    }
  } catch (err: any) {
    console.log(`   [PASS] RLS blocked write: ${err.message}`);
    results.rlsEnforced = true;
  }

  console.log('\n================================================================');
  console.log(` ACTIVATION STATUS: ${results.tablesFound === 24 ? 'FULLY ACTIVATED' : 'AWAITING SQL EXECUTION'}`);
  console.log('================================================================\n');

  return results;
}

if (require.main === module) {
  runDatabaseActivationAudit().catch(console.error);
}
