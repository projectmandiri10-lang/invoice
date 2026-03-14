import { handleCorsOptions } from '../_shared/cors.ts';
import { getEffectivePlan, isSuperuserEmail, normalizeAccountStatus, normalizePlan, requireSuperuser } from '../_shared/authz.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  email?: string;
  password?: string;
  plan?: string;
  accountStatus?: string;
};

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    await requireSuperuser(req);
    const body = await readJsonBody<Body>(req);
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim() || '';

    if (!email || !password) {
      return errorResponse('email and password are required', 400, 'MISSING_PARAMS');
    }

    if (password.length < 6) {
      return errorResponse('password must be at least 6 characters', 400, 'INVALID_PASSWORD');
    }

    const requestedPlan = normalizePlan(body.plan);
    const requestedStatus = normalizeAccountStatus(body.accountStatus || 'active');
    const isSuperuser = isSuperuserEmail(email);
    const plan = isSuperuser ? 'pro' : requestedPlan;
    const accountStatus = isSuperuser ? 'active' : requestedStatus;

    const supabaseAdmin = getSupabaseAdmin();
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created.user) {
      throw createError || new Error('FAILED_TO_CREATE_USER');
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: created.user.id,
      plan,
      account_status: accountStatus,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw profileError;
    }

    return jsonResponse(
      {
        user: {
          id: created.user.id,
          email,
          plan: getEffectivePlan({ plan }, email),
          account_status: accountStatus,
          email_confirmed_at: created.user.email_confirmed_at || created.user.confirmed_at || null,
          created_at: created.user.created_at,
          last_sign_in_at: created.user.last_sign_in_at || null,
          is_superuser: isSuperuser,
        },
      },
      { status: 201 }
    );
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
