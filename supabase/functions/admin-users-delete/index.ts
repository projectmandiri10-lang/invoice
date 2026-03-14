import { handleCorsOptions } from '../_shared/cors.ts';
import { isSuperuserEmail, requireSuperuser } from '../_shared/authz.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  userId?: string;
};

function isUuid(value?: string | null): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');
}

async function deleteRows(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>, table: string, column: string, value: string) {
  const { error } = await supabaseAdmin.from(table).delete().eq(column, value);
  if (error && error.code !== '42P01') {
    throw error;
  }
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
      return errorResponse('The superuser account cannot be deleted', 403, 'SUPERUSER_PROTECTED');
    }

    await deleteRows(supabaseAdmin, 'documents', 'user_id', userId);
    await deleteRows(supabaseAdmin, 'recurring_invoices', 'user_id', userId);
    await deleteRows(supabaseAdmin, 'clients', 'user_id', userId);
    await deleteRows(supabaseAdmin, 'pdf_export_quotas', 'user_id', userId);
    await deleteRows(supabaseAdmin, 'profiles', 'id', userId);

    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteUserError) throw deleteUserError;

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
