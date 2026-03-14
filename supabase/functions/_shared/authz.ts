import { requireUser } from './supabase.ts';

export const SUPERUSER_EMAIL = 'jho.j80@gmail.com';

export type EffectivePlan = 'free' | 'starter' | 'pro';
export type AccountStatus = 'pending' | 'active' | 'disabled';

export function isSuperuserEmail(email?: string | null): boolean {
  return (email || '').trim().toLowerCase() === SUPERUSER_EMAIL;
}

export function normalizePlan(value?: string | null): EffectivePlan {
  const raw = (value || 'free').trim().toLowerCase();
  if (raw === 'starter') return 'starter';
  if (raw === 'pro' || raw === 'premium') return 'pro';
  return 'free';
}

export function normalizeAccountStatus(value?: string | null): AccountStatus {
  if (value === 'active' || value === 'disabled') return value;
  return 'pending';
}

export function getEffectivePlan(profile?: { plan?: string | null } | null, email?: string | null): EffectivePlan {
  if (isSuperuserEmail(email)) return 'pro';
  return normalizePlan(profile?.plan);
}

export async function requireSuperuser(req: Request) {
  const user = await requireUser(req);
  if (!isSuperuserEmail(user.email)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}
