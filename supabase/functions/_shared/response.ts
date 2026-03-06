import { corsHeaders } from './cors.ts';

export function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  for (const [key, value] of Object.entries(corsHeaders)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): Response {
  return jsonResponse(
    {
      error: {
        code: code || 'BAD_REQUEST',
        message,
        details,
      },
    },
    { status }
  );
}

