export async function readJsonBody<T = any>(req: Request): Promise<T> {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await req.json()) as T;
  }

  const text = await req.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function readCallbackBody(req: Request): Promise<Record<string, string>> {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const payload: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      payload[key] = typeof value === 'string' ? value : value.name;
    }
    return payload;
  }

  if (contentType.includes('application/json')) {
    const json = (await req.json()) as Record<string, unknown>;
    const payload: Record<string, string> = {};
    for (const [key, value] of Object.entries(json)) {
      payload[key] = value == null ? '' : String(value);
    }
    return payload;
  }

  // Fallback: try parse as URLSearchParams
  const text = await req.text();
  const params = new URLSearchParams(text);
  const payload: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    payload[key] = value;
  }
  return payload;
}

