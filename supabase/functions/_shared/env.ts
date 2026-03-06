export type DuitkuEnvironment = 'sandbox' | 'production';

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getDuitkuEnvironment(): DuitkuEnvironment {
  const raw = (Deno.env.get('DUITKU_ENV') || 'sandbox').toLowerCase();
  return raw === 'production' ? 'production' : 'sandbox';
}

export function getDuitkuCallbackUrl(): string {
  const override = Deno.env.get('DUITKU_CALLBACK_URL');
  if (override) {
    return override.replace(/\/$/, '');
  }

  const supabaseUrl = requireEnv('SUPABASE_URL').replace(/\/$/, '');
  return `${supabaseUrl}/functions/v1/duitku-callback`;
}
