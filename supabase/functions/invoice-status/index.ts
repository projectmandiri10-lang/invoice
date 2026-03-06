import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuEnvironment } from '../_shared/env.ts';
import { duitkuTransactionStatus } from '../_shared/duitku.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  accessToken?: string;
  merchantOrderId?: string;
};

function mapStatusCode(statusCode?: string) {
  if (statusCode === '00') return 'paid';
  if (statusCode === '01') return 'pending';
  if (statusCode === '02') return 'failed';
  return 'failed';
}

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const body = await readJsonBody<Body>(req);
    const accessToken = body.accessToken?.trim();
    const merchantOrderId = body.merchantOrderId?.trim();

    if (!accessToken || !merchantOrderId) {
      return errorResponse('accessToken and merchantOrderId are required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('portal_token', accessToken)
      .maybeSingle();
    if (clientError) throw clientError;
    if (!client) return errorResponse('Portal not found', 404, 'NOT_FOUND');

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('invoice_payments')
      .select('id, document_id, client_id, status, expires_at, paid_at, reference')
      .eq('merchant_order_id', merchantOrderId)
      .maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment) return errorResponse('Payment not found', 404, 'NOT_FOUND');

    if (payment.client_id && payment.client_id !== client.id) {
      return errorResponse('Forbidden', 403, 'FORBIDDEN');
    }

    const now = new Date();
    const expiresAt = payment.expires_at ? new Date(payment.expires_at) : null;
    if (payment.status === 'pending' && expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= now.getTime()) {
      await supabaseAdmin.from('invoice_payments').update({ status: 'expired' }).eq('id', payment.id);
      return jsonResponse({ status: 'expired', payment: { ...payment, status: 'expired' } });
    }

    if (payment.status !== 'pending') {
      return jsonResponse({ status: payment.status, payment });
    }

    const env = getDuitkuEnvironment();
    const statusRes = await duitkuTransactionStatus(env, merchantOrderId);
    const mapped = mapStatusCode(statusRes.statusCode);

    if (mapped === 'paid') {
      const paidAtIso = new Date().toISOString();
      await supabaseAdmin
        .from('invoice_payments')
        .update({ status: 'paid', paid_at: paidAtIso, raw_callback: statusRes })
        .eq('id', payment.id)
        .is('paid_at', null);
      await supabaseAdmin.from('documents').update({ status: 'paid' }).eq('id', payment.document_id);
    } else if (mapped === 'failed') {
      await supabaseAdmin.from('invoice_payments').update({ status: 'failed', raw_callback: statusRes }).eq('id', payment.id);
    } else {
      await supabaseAdmin.from('invoice_payments').update({ raw_callback: statusRes }).eq('id', payment.id);
    }

    const { data: updated } = await supabaseAdmin
      .from('invoice_payments')
      .select('id, document_id, status, expires_at, paid_at, reference')
      .eq('id', payment.id)
      .maybeSingle();

    return jsonResponse({
      status: updated?.status || mapped,
      payment: updated || payment,
      duitku: statusRes,
    });
  } catch (err: any) {
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});

