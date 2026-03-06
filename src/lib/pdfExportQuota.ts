import type { User } from '@supabase/supabase-js';
import type { AppPlan } from '@/contexts/AuthContext';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

const ANON_TOKEN_STORAGE_KEY = 'mjw_pdf_export_anon_token_v1';
const LOCAL_COUNT_PREFIX = 'mjw_pdf_export_used_v1:';
const FREE_EXPORT_LIMIT = 5;

export type PdfExportQuotaResult = {
  allowed: boolean;
  used: number | null;
  limit: number | null;
  remaining: number | null;
  scope: 'paid' | 'user' | 'anon';
};

function getOrCreateAnonToken(): string {
  const existing = localStorage.getItem(ANON_TOKEN_STORAGE_KEY);
  if (existing) return existing;

  const token = crypto.randomUUID();
  localStorage.setItem(ANON_TOKEN_STORAGE_KEY, token);
  return token;
}

function getLocalCountKey(scope: 'user' | 'anon', id: string): string {
  return `${LOCAL_COUNT_PREFIX}${scope}:${id}`;
}

function consumeLocalQuota(scope: 'user' | 'anon', id: string): PdfExportQuotaResult {
  const key = getLocalCountKey(scope, id);
  const raw = localStorage.getItem(key);
  const used = Math.max(0, Number(raw ?? 0) || 0);

  if (used >= FREE_EXPORT_LIMIT) {
    return { allowed: false, used, limit: FREE_EXPORT_LIMIT, remaining: 0, scope };
  }

  const nextUsed = used + 1;
  localStorage.setItem(key, String(nextUsed));
  return {
    allowed: true,
    used: nextUsed,
    limit: FREE_EXPORT_LIMIT,
    remaining: Math.max(0, FREE_EXPORT_LIMIT - nextUsed),
    scope,
  };
}

export async function consumePdfExportQuota(user: User | null, effectivePlan: AppPlan): Promise<PdfExportQuotaResult> {
  if (effectivePlan !== 'free') {
    return { allowed: true, used: null, limit: null, remaining: null, scope: 'paid' };
  }

  const isAuthenticated = Boolean(user?.id);
  const scope: 'user' | 'anon' = isAuthenticated ? 'user' : 'anon';

  const body: Record<string, unknown> = {};
  let localId = '';
  if (!isAuthenticated) {
    const anonToken = getOrCreateAnonToken();
    body.anonToken = anonToken;
    localId = anonToken;
  } else {
    localId = user!.id;
  }

  try {
    return await invokeEdgeFunction<PdfExportQuotaResult>('pdf-export-consume', body);
  } catch {
    // Fallback (offline / migration not applied yet): enforce a local quota.
    return consumeLocalQuota(scope, localId);
  }
}
