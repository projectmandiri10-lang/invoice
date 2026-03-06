import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuEnvironment } from '../_shared/env.ts';
import { getEffectivePlan } from '../_shared/entitlements.ts';
import { duitkuGetPaymentMethods } from '../_shared/duitku.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  accessToken?: string;
  documentId?: string;
};

Deno.serve(async (req) => {
  const cors = handleCorsOptions(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const body = await readJsonBody<Body>(req);
    const accessToken = body.accessToken?.trim();
    const documentId = body.documentId?.trim();

    if (!accessToken || !documentId) {
      return errorResponse('accessToken and documentId are required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, client_name')
      .eq('portal_token', accessToken)
      .maybeSingle();

    if (clientError) throw clientError;
    if (!client) return errorResponse('Portal not found', 404, 'NOT_FOUND');

    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select('id, user_id, client_id, status, content, settings, document_type')
      .eq('id', documentId)
      .eq('client_id', client.id)
      .eq('document_type', 'invoice')
      .maybeSingle();

    if (docError) throw docError;
    if (!document) return errorResponse('Invoice not found', 404, 'NOT_FOUND');

    if (String(document.status || '').toLowerCase() === 'paid') {
      return errorResponse('Invoice already paid', 409, 'ALREADY_PAID');
    }

    const paymentGatewayEnabled = Boolean((document.settings as any)?.visibleFields?.paymentGateway);
    if (!paymentGatewayEnabled) {
      return errorResponse('Payment is disabled for this invoice', 403, 'PAYMENT_DISABLED');
    }

    const { data: ownerProfile, error: ownerProfileError } = await supabaseAdmin
      .from('profiles')
      .select('plan, plan_expires_at')
      .eq('id', document.user_id)
      .maybeSingle();

    if (ownerProfileError) throw ownerProfileError;
    const effectivePlan = ownerProfile ? getEffectivePlan(ownerProfile) : 'free';
    if (effectivePlan !== 'pro') {
      return errorResponse('Invoice payment requires Pro plan', 403, 'PRO_REQUIRED');
    }

    const total = Number((document.content as any)?.total ?? 0);
    const amountIdr = Math.round(total);
    if (!Number.isFinite(amountIdr) || amountIdr <= 0) {
      return errorResponse('Invalid invoice amount', 400, 'INVALID_AMOUNT');
    }

    const env = getDuitkuEnvironment();
    const duitku = await duitkuGetPaymentMethods(env, amountIdr);

    return jsonResponse({
      amountIdr,
      methods: duitku.paymentFee || [],
      clientName: client.client_name,
    });
  } catch (err: any) {
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});

