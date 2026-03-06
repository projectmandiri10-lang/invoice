import { handleCorsOptions, corsHeaders } from '../_shared/cors.ts';
import { getDuitkuEnvironment, requireEnv } from '../_shared/env.ts';
import { createCallbackSignature, duitkuTransactionStatus } from '../_shared/duitku.ts';
import { readCallbackBody } from '../_shared/request.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

function mapStatusCode(statusCode?: string) {
  if (statusCode === '00') return 'paid';
  if (statusCode === '01') return 'pending';
  if (statusCode === '02') return 'failed';
  return 'failed';
}

function addDuration(base: Date, interval: string) {
  const next = new Date(base);
  if (interval === 'year') {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

Deno.serve(async (req) => {
  // Callback is server-to-server, but we still reply cleanly for browsers/tools
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await readCallbackBody(req);

    const merchantCode = payload.merchantCode || payload.merchantcode || '';
    const amount = payload.amount || '';
    const merchantOrderId = payload.merchantOrderId || '';
    const signature = payload.signature || '';

    if (!merchantCode || !amount || !merchantOrderId || !signature) {
      return new Response('Missing params', { status: 400, headers: corsHeaders });
    }

    const apiKey = requireEnv('DUITKU_API_KEY');
    const expectedSignature = createCallbackSignature({ merchantCode, amount, merchantOrderId, apiKey });
    if (expectedSignature.toLowerCase() !== signature.toLowerCase()) {
      return new Response('Invalid signature', { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const env = getDuitkuEnvironment();

    // Always verify with transactionStatus for final truth
    const statusRes = await duitkuTransactionStatus(env, merchantOrderId);
    const mapped = mapStatusCode(statusRes.statusCode);

    if (merchantOrderId.startsWith('SUB-')) {
      const { data: tx, error: txError } = await supabaseAdmin
        .from('billing_transactions')
        .select('id, user_id, plan_code, paid_at')
        .eq('merchant_order_id', merchantOrderId)
        .maybeSingle();

      if (txError) throw txError;
      if (!tx) return new Response('OK', { status: 200, headers: corsHeaders });

      await supabaseAdmin
        .from('billing_transactions')
        .update({ raw_callback: { payload, status: statusRes } })
        .eq('id', tx.id);

      if (mapped === 'paid' && !tx.paid_at) {
        const paidAtIso = new Date().toISOString();
        await supabaseAdmin
          .from('billing_transactions')
          .update({ status: 'paid', paid_at: paidAtIso })
          .eq('id', tx.id)
          .is('paid_at', null);

        const { data: plan, error: planError } = await supabaseAdmin
          .from('billing_plans')
          .select('plan, interval')
          .eq('code', tx.plan_code)
          .maybeSingle();
        if (planError) throw planError;

        if (plan) {
          const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('plan_expires_at')
            .eq('id', tx.user_id)
            .maybeSingle();
          if (profileError) throw profileError;

          const now = new Date();
          const currentExpiry = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
          const base =
            currentExpiry && !Number.isNaN(currentExpiry.getTime()) && currentExpiry.getTime() > now.getTime()
              ? currentExpiry
              : now;

          const newExpiry = addDuration(base, plan.interval);

          await supabaseAdmin.from('profiles').upsert(
            {
              id: tx.user_id,
              plan: plan.plan,
              plan_expires_at: newExpiry.toISOString(),
            },
            { onConflict: 'id' }
          );
        }
      } else if (mapped === 'failed') {
        await supabaseAdmin.from('billing_transactions').update({ status: 'failed' }).eq('id', tx.id);
      }

      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    if (merchantOrderId.startsWith('INV-')) {
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from('invoice_payments')
        .select('id, document_id, paid_at')
        .eq('merchant_order_id', merchantOrderId)
        .maybeSingle();

      if (paymentError) throw paymentError;
      if (!payment) return new Response('OK', { status: 200, headers: corsHeaders });

      await supabaseAdmin
        .from('invoice_payments')
        .update({ raw_callback: { payload, status: statusRes } })
        .eq('id', payment.id);

      if (mapped === 'paid' && !payment.paid_at) {
        const paidAtIso = new Date().toISOString();
        await supabaseAdmin
          .from('invoice_payments')
          .update({ status: 'paid', paid_at: paidAtIso })
          .eq('id', payment.id)
          .is('paid_at', null);
        await supabaseAdmin.from('documents').update({ status: 'paid' }).eq('id', payment.document_id);
      } else if (mapped === 'failed') {
        await supabaseAdmin.from('invoice_payments').update({ status: 'failed' }).eq('id', payment.id);
      }

      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    // Unknown order prefix; acknowledge anyway
    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('duitku-callback error', err);
    return new Response('Internal error', { status: 500, headers: corsHeaders });
  }
});

