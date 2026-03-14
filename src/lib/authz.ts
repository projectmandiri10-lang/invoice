export const SUPERUSER_EMAIL = 'jho.j80@gmail.com';
export const AUTH_NOTICE_STORAGE_KEY = 'idcashier_auth_notice_v1';

export type AccountStatus = 'pending' | 'active' | 'disabled';

export function isSuperuserEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPERUSER_EMAIL;
}

export function normalizeAccountStatus(value?: string | null): AccountStatus {
  if (value === 'active' || value === 'disabled') return value;
  return 'pending';
}

export function persistAuthNotice(status: AccountStatus) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(AUTH_NOTICE_STORAGE_KEY, status);
}

export function consumeAuthNotice(): AccountStatus | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(AUTH_NOTICE_STORAGE_KEY);
  if (!raw) return null;
  window.sessionStorage.removeItem(AUTH_NOTICE_STORAGE_KEY);
  return normalizeAccountStatus(raw);
}

export function contactAdministrator(subject: string, body?: string) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams({ subject });
  if (body) {
    params.set('body', body);
  }

  window.location.href = `mailto:${SUPERUSER_EMAIL}?${params.toString()}`;
}
