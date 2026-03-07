import { handleCorsOptions } from '../_shared/cors.ts';
import { getDuitkuCallbackUrl, getDuitkuEnvironment, requireEnv } from '../_shared/env.ts';
import { getEffectivePlan } from '../_shared/entitlements.ts';
import { duitkuCreateInquiry } from '../_shared/duitku.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  accessToken?: string;
  documentId?: string;
  paymentMethod?: string;
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
    const paymentMethod = body.paymentMethod?.trim();

    if (!accessToken || !documentId || !paymentMethod) {
      return errorResponse('accessToken, documentId, and paymentMethod are required', 400, 'MISSING_PARAMS');
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
    const { data: ownerUserData, error: ownerUserError } = await supabaseAdmin.auth.admin.getUserById(document.user_id);
    if (ownerUserError) throw ownerUserError;
    const effectivePlan = getEffectivePlan(ownerProfile || {}, ownerUserData.user?.email);
    if (effectivePlan !== 'pro') {
      return errorResponse('Invoice payment requires Pro plan', 403, 'PRO_REQUIRED');
    }

    const total = Number((document.content as any)?.total ?? 0);
    const amountIdr = Math.round(total);
    if (!Number.isFinite(amountIdr) || amountIdr <= 0) {
      return errorResponse('Invalid invoice amount', 400, 'INVALID_AMOUNT');
    }

    const nowIso = new Date().toISOString();
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('invoice_payments')
      .select('merchant_order_id, payment_url, reference, expires_at, status')
      .eq('document_id', document.id)
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

    const merchantOrderId = `INV-${document.id.slice(0, 8)}-${Date.now()}`;

    const { error: insertError } = await supabaseAdmin.from('invoice_payments').insert({
      document_id: document.id,
      owner_user_id: document.user_id,
      client_id: client.id,
      amount_idr: amountIdr,
      status: 'pending',
      merchant_order_id: merchantOrderId,
      payment_method: paymentMethod,
    });
    if (insertError) throw insertError;

    const publicSiteUrl = requireEnv('PUBLIC_SITE_URL').replace(/\/$/, '');
    const callbackUrl = getDuitkuCallbackUrl();
    const returnUrl = `${publicSiteUrl}/portal/${encodeURIComponent(accessToken)}?paidOrderId=${encodeURIComponent(merchantOrderId)}`;

    const invoiceNumber = String((document.content as any)?.invoiceNumber || '').trim() || document.id.slice(0, 8);
    const env = getDuitkuEnvironment();
    let inquiry;
    try {
      inquiry = await duitkuCreateInquiry(env, {
        merchantOrderId,
        paymentAmount: amountIdr,
        paymentMethod,
        productDetails: `Pembayaran Invoice ${invoiceNumber}`,
        callbackUrl,
        returnUrl,
        expiryPeriodMinutes: 1440,
        additionalParam: document.id,
      });
    } catch (err: any) {
      await supabaseAdmin
        .from('invoice_payments')
        .update({ status: 'failed', raw_inquiry: { error: err?.message || String(err) } })
        .eq('merchant_order_id', merchantOrderId);
      throw err;
    }

    const expiresAt = new Date(Date.now() + 1440 * 60 * 1000).toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('invoice_payments')
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
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
