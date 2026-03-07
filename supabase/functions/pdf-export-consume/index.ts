import { handleCorsOptions } from '../_shared/cors.ts';
import { getEffectivePlan } from '../_shared/entitlements.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin, requireUser } from '../_shared/supabase.ts';

type Body = {
  anonToken?: string;
};

type ConsumeResponse = {
  allowed: boolean;
  used: number | null;
  limit: number | null;
  remaining: number | null;
  scope: 'paid' | 'user' | 'anon';
};

const FREE_EXPORT_LIMIT = 5;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function consumeForUser(userId: string): Promise<ConsumeResponse> {
  const supabaseAdmin = getSupabaseAdmin();

  const { error: insertError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .insert({ user_id: userId, used: 0, quota_limit: FREE_EXPORT_LIMIT });
  if (insertError && insertError.code !== '23505') throw insertError;

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .select('used, quota_limit')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const used = Math.max(0, Number(row?.used ?? 0));
  const limit = FREE_EXPORT_LIMIT;

  if (used >= limit) {
    return { allowed: false, used, limit, remaining: 0, scope: 'user' };
  }

  const nextUsed = used + 1;
  const { error: updateError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .update({ used: nextUsed, quota_limit: FREE_EXPORT_LIMIT })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  return { allowed: true, used: nextUsed, limit, remaining: Math.max(0, limit - nextUsed), scope: 'user' };
}

async function consumeForAnon(anonToken: string): Promise<ConsumeResponse> {
  const supabaseAdmin = getSupabaseAdmin();

  const { error: insertError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .insert({ anon_token: anonToken, used: 0, quota_limit: FREE_EXPORT_LIMIT });
  if (insertError && insertError.code !== '23505') throw insertError;

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .select('used, quota_limit')
    .eq('anon_token', anonToken)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const used = Math.max(0, Number(row?.used ?? 0));
  const limit = FREE_EXPORT_LIMIT;

  if (used >= limit) {
    return { allowed: false, used, limit, remaining: 0, scope: 'anon' };
  }

  const nextUsed = used + 1;
  const { error: updateError } = await supabaseAdmin
    .from('pdf_export_quotas')
    .update({ used: nextUsed, quota_limit: FREE_EXPORT_LIMIT })
    .eq('anon_token', anonToken);

  if (updateError) throw updateError;

  return { allowed: true, used: nextUsed, limit, remaining: Math.max(0, limit - nextUsed), scope: 'anon' };
}

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const user = await requireUser(req);
      userId = user.id;
      userEmail = user.email ?? null;
    } catch (err: any) {
      if (err?.message !== 'UNAUTHORIZED') throw err;
    }

    // Paid users: unlimited
    if (userId) {
      const { data: profileRow, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('plan, plan_expires_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      const effectivePlan = getEffectivePlan(profileRow, userEmail);
      if (effectivePlan !== 'free') {
        return jsonResponse({ allowed: true, used: null, limit: null, remaining: null, scope: 'paid' } satisfies ConsumeResponse);
      }

      const result = await consumeForUser(userId);
      return jsonResponse(result);
    }

    // Anonymous: require anonToken (uuid generated client-side)
    const body = await readJsonBody<Body>(req);
    const anonToken = body.anonToken?.trim();
    if (!anonToken || !isUuid(anonToken)) {
      return errorResponse('anonToken is required', 400, 'MISSING_ANON_TOKEN');
    }

    const result = await consumeForAnon(anonToken);
    return jsonResponse(result);
  } catch (err: any) {
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
