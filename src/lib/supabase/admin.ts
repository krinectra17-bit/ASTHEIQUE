import { createClient } from '@supabase/supabase-js';

export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tdvuvvrootrfrmjmwvbv.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      '[AESTHIQUE Security] SUPABASE_SERVICE_ROLE_KEY is required for privileged backend operations but has not been configured in .env.local. Please supply SUPABASE_SERVICE_ROLE_KEY to perform administrator actions.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
