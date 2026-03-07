import { isDeveloperAccountEmail } from './developer.ts';

export type EffectivePlan = 'free' | 'starter' | 'pro';

export function getEffectivePlan(
  profile?: { plan?: string | null; plan_expires_at?: string | null } | null,
  email?: string | null
): EffectivePlan {
  if (isDeveloperAccountEmail(email)) {
    return 'pro';
  }
  const rawPlan = (profile?.plan || 'free').toLowerCase();
  const plan: EffectivePlan = rawPlan === 'premium' ? 'pro' : rawPlan === 'starter' ? 'starter' : rawPlan === 'pro' ? 'pro' : 'free';

  const expiresAt = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    return 'free';
  }

  if (expiresAt.getTime() <= Date.now()) {
    return 'free';
  }

  return plan;
}
