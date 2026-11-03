import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // In local dev without keys, provide fallback warning
    console.warn(
      '[AESTHIQUE Supabase] NEXT_PUBLIC_SUPABASE_URL or publishable key missing. Client queries will operate in offline/mock mode.'
    );
  }

  return createBrowserClient(
    supabaseUrl || 'https://tdvuvvrootrfrmjmwvbv.supabase.co',
    supabaseKey || 'sb_publishable_2HevP9n7xzlhK3xqD0PZeg_Ge0jS76D'
  );
}
