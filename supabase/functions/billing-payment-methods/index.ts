import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuEnvironment } from '../_shared/env.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { duitkuGetPaymentMethods } from '../_shared/duitku.ts';
import { getSupabaseAdmin, requireUser } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    await requireUser(req);
    const body = await readJsonBody<{ planCode?: string }>(req);
    const planCode = body.planCode?.trim();
    if (!planCode) {
      return errorResponse('planCode is required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: plan, error: planError } = await supabaseAdmin
      .from('billing_plans')
      .select('code, amount_idr, active')
      .eq('code', planCode)
      .maybeSingle();

    if (planError) throw planError;
    if (!plan || !plan.active) {
      return errorResponse('Plan not found', 404, 'PLAN_NOT_FOUND');
    }

    const env = getDuitkuEnvironment();
    const duitku = await duitkuGetPaymentMethods(env, plan.amount_idr);

    return jsonResponse({
      amountIdr: plan.amount_idr,
      methods: duitku.paymentFee || [],
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') {
      return errorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});

