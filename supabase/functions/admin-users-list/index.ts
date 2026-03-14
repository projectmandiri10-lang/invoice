import { handleCorsOptions } from '../_shared/cors.ts';
import { getEffectivePlan, isSuperuserEmail, normalizeAccountStatus, requireSuperuser } from '../_shared/authz.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

const PAGE_SIZE = 200;

async function listAllUsers() {
  const supabaseAdmin = getSupabaseAdmin();
  const users: any[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: PAGE_SIZE,
    });

    if (error) throw error;
    const batch = data?.users || [];
    users.push(...batch);

    if (batch.length < PAGE_SIZE) {
      break;
    }
    page += 1;
  }

  return users.filter((user) => Boolean(user.email));
}

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    await requireSuperuser(req);
    const supabaseAdmin = getSupabaseAdmin();
    const authUsers = await listAllUsers();
    const ids = authUsers.map((user) => user.id);

    const profileMap = new Map<string, { plan: string | null; account_status: string | null }>();
    if (ids.length > 0) {
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, plan, account_status')
        .in('id', ids);

      if (profilesError) throw profilesError;
      for (const profile of profiles || []) {
        profileMap.set(profile.id, {
          plan: profile.plan,
          account_status: profile.account_status,
        });
      }
    }

    const users = authUsers
      .map((user) => {
        const profile = profileMap.get(user.id);
        const email = user.email || '';
        return {
          id: user.id,
          email,
          plan: getEffectivePlan(profile, email),
          account_status: isSuperuserEmail(email) ? 'active' : normalizeAccountStatus(profile?.account_status),
          email_confirmed_at: user.email_confirmed_at || user.confirmed_at || null,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at || null,
          is_superuser: isSuperuserEmail(email),
        };
      })
      .sort((left, right) => {
        const leftTime = new Date(left.created_at || 0).getTime();
        const rightTime = new Date(right.created_at || 0).getTime();
        return rightTime - leftTime;
      });

    return jsonResponse({ users });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') {
      return errorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }
    if (err?.message === 'FORBIDDEN') {
      return errorResponse('Forbidden', 403, 'FORBIDDEN');
    }
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
