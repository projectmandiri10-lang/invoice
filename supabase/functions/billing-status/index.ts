import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuEnvironment } from '../_shared/env.ts';
import { duitkuTransactionStatus } from '../_shared/duitku.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin, requireUser } from '../_shared/supabase.ts';

type Body = {
  merchantOrderId?: string;
};

function mapStatusCode(statusCode?: string) {
  if (statusCode === '00') return 'paid';
  if (statusCode === '01') return 'pending';
  if (statusCode === '02') return 'failed';
  return 'failed';
}

async function applyBillingPaidIfNeeded(supabaseAdmin: any, merchantOrderId: string) {
  const { data: tx, error: txError } = await supabaseAdmin
    .from('billing_transactions')
    .select('id, user_id, plan_code, paid_at, status')
    .eq('merchant_order_id', merchantOrderId)
    .maybeSingle();
  if (txError) throw txError;
  if (!tx) return null;
  if (tx.paid_at) return tx;

  const { data: plan, error: planError } = await supabaseAdmin
    .from('billing_plans')
    .select('plan, interval')
    .eq('code', tx.plan_code)
    .maybeSingle();
  if (planError) throw planError;
  if (!plan) return tx;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', tx.user_id)
    .maybeSingle();
  if (profileError) throw profileError;

  const now = new Date();
  const currentExpiry = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  const base = currentExpiry && !Number.isNaN(currentExpiry.getTime()) && currentExpiry.getTime() > now.getTime() ? currentExpiry : now;

  const newExpiry = new Date(base);
  if (plan.interval === 'year') {
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);
  } else {
    newExpiry.setMonth(newExpiry.getMonth() + 1);
  }

  const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: tx.user_id,
      plan: plan.plan,
      plan_expires_at: newExpiry.toISOString(),
    },
    { onConflict: 'id' }
  );
  if (upsertProfileError) throw upsertProfileError;

  const { error: updateTxError } = await supabaseAdmin
    .from('billing_transactions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('merchant_order_id', merchantOrderId)
    .is('paid_at', null);
  if (updateTxError) throw updateTxError;

  return { ...tx, status: 'paid' };
}

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const user = await requireUser(req);
    const body = await readJsonBody<Body>(req);
    const merchantOrderId = body.merchantOrderId?.trim();
    if (!merchantOrderId) {
      return errorResponse('merchantOrderId is required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: tx, error: txError } = await supabaseAdmin
      .from('billing_transactions')
      .select('merchant_order_id, status, expires_at, reference, payment_url, plan_code, amount_idr, paid_at')
      .eq('merchant_order_id', merchantOrderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (txError) throw txError;
    if (!tx) return errorResponse('Transaction not found', 404, 'NOT_FOUND');

    const now = new Date();
    const expiresAt = tx.expires_at ? new Date(tx.expires_at) : null;
    if (tx.status === 'pending' && expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= now.getTime()) {
      await supabaseAdmin.from('billing_transactions').update({ status: 'expired' }).eq('merchant_order_id', merchantOrderId);
      return jsonResponse({ status: 'expired', transaction: { ...tx, status: 'expired' } });
    }

    if (tx.status !== 'pending') {
      return jsonResponse({ status: tx.status, transaction: tx });
    }

    const env = getDuitkuEnvironment();
    const statusRes = await duitkuTransactionStatus(env, merchantOrderId);
    const mapped = mapStatusCode(statusRes.statusCode);

    if (mapped === 'paid') {
      await applyBillingPaidIfNeeded(supabaseAdmin, merchantOrderId);
    } else if (mapped === 'failed') {
      await supabaseAdmin.from('billing_transactions').update({ status: 'failed', raw_callback: statusRes }).eq('merchant_order_id', merchantOrderId);
    } else {
      await supabaseAdmin.from('billing_transactions').update({ raw_callback: statusRes }).eq('merchant_order_id', merchantOrderId);
    }

    const { data: updatedTx } = await supabaseAdmin
      .from('billing_transactions')
      .select('merchant_order_id, status, expires_at, reference, payment_url, plan_code, amount_idr, paid_at')
      .eq('merchant_order_id', merchantOrderId)
      .maybeSingle();

    const { data: profile } = await supabaseAdmin.from('profiles').select('plan, plan_expires_at').eq('id', user.id).maybeSingle();

    return jsonResponse({
      status: updatedTx?.status || mapped,
      transaction: updatedTx || tx,
      profile: profile ? { plan: profile.plan, planExpiresAt: profile.plan_expires_at } : null,
      duitku: statusRes,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') {
      return errorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
