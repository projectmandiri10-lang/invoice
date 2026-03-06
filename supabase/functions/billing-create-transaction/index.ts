import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuCallbackUrl, getDuitkuEnvironment, requireEnv } from '../_shared/env.ts';
import { duitkuCreateInquiry } from '../_shared/duitku.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin, requireUser } from '../_shared/supabase.ts';

type Body = {
  planCode?: string;
  paymentMethod?: string;
};

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const user = await requireUser(req);
    const body = await readJsonBody<Body>(req);
    const planCode = body.planCode?.trim();
    const paymentMethod = body.paymentMethod?.trim();

    if (!planCode || !paymentMethod) {
      return errorResponse('planCode and paymentMethod are required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: plan, error: planError } = await supabaseAdmin
      .from('billing_plans')
      .select('code, plan, interval, amount_idr, duration, active')
      .eq('code', planCode)
      .maybeSingle();

    if (planError) throw planError;
    if (!plan || !plan.active) {
      return errorResponse('Plan not found', 404, 'PLAN_NOT_FOUND');
    }

    // Idempotency: return existing pending transaction (not expired)
    const nowIso = new Date().toISOString();
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('billing_transactions')
      .select('merchant_order_id, payment_url, reference, expires_at, status')
      .eq('user_id', user.id)
      .eq('plan_code', planCode)
      .eq('status', 'pending')
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing?.payment_url) {
      return jsonResponse({
        merchantOrderId: existing.merchant_order_id,
        reference: existing.reference,
        paymentUrl: existing.payment_url,
        expiresAt: existing.expires_at,
        reused: true,
      });
    }

    const merchantOrderId = `SUB-${user.id.slice(0, 8)}-${Date.now()}`;

    const { error: insertError } = await supabaseAdmin.from('billing_transactions').insert({
      user_id: user.id,
      plan_code: planCode,
      amount_idr: plan.amount_idr,
      status: 'pending',
      merchant_order_id: merchantOrderId,
      payment_method: paymentMethod,
    });

    if (insertError) throw insertError;

    const publicSiteUrl = requireEnv('PUBLIC_SITE_URL').replace(/\/$/, '');

    const callbackUrl = getDuitkuCallbackUrl();
    const returnUrl = `${publicSiteUrl}/billing/return?orderId=${encodeURIComponent(merchantOrderId)}`;

    const env = getDuitkuEnvironment();
    let inquiry;
    try {
      inquiry = await duitkuCreateInquiry(env, {
        merchantOrderId,
        paymentAmount: plan.amount_idr,
        paymentMethod,
        productDetails: `Langganan ${String(plan.plan).toUpperCase()} (${plan.interval})`,
        callbackUrl,
        returnUrl,
        expiryPeriodMinutes: 60,
        additionalParam: planCode,
        email: user.email || '',
      });
    } catch (err: any) {
      await supabaseAdmin
        .from('billing_transactions')
        .update({ status: 'failed', raw_inquiry: { error: err?.message || String(err) } })
        .eq('merchant_order_id', merchantOrderId);
      throw err;
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('billing_transactions')
      .update({
        reference: inquiry.reference,
        payment_url: inquiry.paymentUrl,
        raw_inquiry: inquiry,
        expires_at: expiresAt,
      })
      .eq('merchant_order_id', merchantOrderId);

    if (updateError) throw updateError;

    return jsonResponse({
      merchantOrderId,
      reference: inquiry.reference,
      paymentUrl: inquiry.paymentUrl,
      expiresAt,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') {
      return errorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
