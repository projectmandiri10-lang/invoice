import { handleCorsOptions } from '../_shared/cors.ts';
import { requireSuperuser } from '../_shared/authz.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  userId?: string;
  newPassword?: string;
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
    const newPassword = body.newPassword?.trim() || '';

    if (!isUuid(userId)) {
      return errorResponse('userId is required', 400, 'INVALID_USER_ID');
    }
    if (newPassword.length < 6) {
      return errorResponse('password must be at least 6 characters', 400, 'INVALID_PASSWORD');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
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
