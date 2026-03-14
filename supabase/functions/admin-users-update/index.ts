import { handleCorsOptions } from '../_shared/cors.ts';
import { isSuperuserEmail, normalizeAccountStatus, normalizePlan, requireSuperuser } from '../_shared/authz.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  userId?: string;
  plan?: string;
  accountStatus?: string;
};

function isUuid(value?: string | null): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');
}

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    await requireSuperuser(req);
    const body = await readJsonBody<Body>(req);
    const userId = body.userId?.trim();
    if (!isUuid(userId)) {
      return errorResponse('userId is required', 400, 'INVALID_USER_ID');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authError || !authUser.user) {
      throw authError || new Error('USER_NOT_FOUND');
    }

    if (isSuperuserEmail(authUser.user.email)) {
      return errorResponse('The superuser account cannot be modified here', 403, 'SUPERUSER_PROTECTED');
    }

    const plan = normalizePlan(body.plan);
    const accountStatus = normalizeAccountStatus(body.accountStatus);

    const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      plan,
      account_status: accountStatus,
    });

    if (upsertError) throw upsertError;

    return jsonResponse({ ok: true });
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
