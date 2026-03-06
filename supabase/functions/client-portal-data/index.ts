import { handleCorsOptions } from '../_shared/cors.ts';
import { readJsonBody } from '../_shared/request.ts';
import { errorResponse, jsonResponse } from '../_shared/response.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

type Body = {
  accessToken?: string;
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
    if (!accessToken) {
      return errorResponse('accessToken is required', 400, 'MISSING_PARAMS');
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, client_name, portal_token')
      .eq('portal_token', accessToken)
      .maybeSingle();

    if (clientError) throw clientError;
    if (!client) {
      return errorResponse('Portal not found', 404, 'NOT_FOUND');
    }

    const { data: documents, error: docsError } = await supabaseAdmin
      .from('documents')
      .select('id, title, document_type, content, settings, status, created_at')
      .eq('client_id', client.id)
      .eq('document_type', 'invoice')
      .order('created_at', { ascending: false });

    if (docsError) throw docsError;

    return jsonResponse({
      client: { id: client.id, client_name: client.client_name },
      documents: documents || [],
    });
  } catch (err: any) {
    return errorResponse('Internal error', 500, 'INTERNAL_ERROR', { message: err?.message || String(err) });
  }
});
