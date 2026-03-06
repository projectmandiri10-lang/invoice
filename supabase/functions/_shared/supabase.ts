import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { requireEnv } from './env.ts';

export function getSupabaseAdmin() {
  const supabaseUrl = requireEnv('SUPABASE_URL');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function requireUser(req: Request) {
  const authorization = req.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }

  const supabaseUrl = requireEnv('SUPABASE_URL');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseAuth = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });

  const { data, error } = await supabaseAuth.auth.getUser();
  if (error || !data?.user) {
    throw new Error('UNAUTHORIZED');
  }
  return data.user;
}

