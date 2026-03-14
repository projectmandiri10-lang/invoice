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
