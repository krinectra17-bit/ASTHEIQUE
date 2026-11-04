import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tdvuvvrootrfrmjmwvbv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2HevP9n7xzlhK3xqD0PZeg_Ge0jS76D';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthAndRLS() {
  const timestamp = Date.now();
  const testEmail = `aesthique.customer.${timestamp}@gmail.com`;
  const testPassword = 'TestPassword123!#';

  console.log(`1. Testing signUp with valid email: ${testEmail}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test Customer',
        phone: '+919876543210'
      }
    }
  });

  if (authError) {
    console.error('SignUp Error:', authError.message, authError.status);
    return;
  }

  console.log('SignUp Success! User ID:', authData.user?.id);
  console.log('Session present:', !!authData.session);

  // If session created or signIn
  console.log('2. Testing signInWithPassword...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.log('Login note (might require email confirmation depending on Supabase Auth settings):', loginError.message);
  } else {
    console.log('Login Success! Session token acquired.');
  }

  // 3. Testing RLS queries
  console.log('3. Testing RLS queries on categories/products/settings (public read)...');
  const { data: cats, error: catsErr } = await supabase.from('categories').select('*');
  console.log('Categories count:', cats?.length ?? 0, 'Error:', catsErr?.message || 'none');

  const { data: prods, error: prodsErr } = await supabase.from('products').select('*');
  console.log('Products count:', prods?.length ?? 0, 'Error:', prodsErr?.message || 'none');

  // 4. Testing RLS write protection on admin_users or products without admin token
  console.log('4. Testing RLS on unauthorized write to admin_users...');
  const { data: adminInsert, error: adminErr } = await supabase.from('admin_users').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    role: 'super_admin'
  });
  console.log('Unauthorized write to admin_users rejected by RLS:', adminErr ? `YES (${adminErr.message})` : 'NO (WARNING)');

  // 5. Check if seed data was executed
  console.log('5. Checking if seed data exists in DB...');
  console.log('Categories:', cats?.length);
  console.log('Products:', prods?.length);
}

testAuthAndRLS().catch(console.error);
