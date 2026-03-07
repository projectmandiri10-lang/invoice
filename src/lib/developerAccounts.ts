export const DEVELOPER_ACCOUNT_EMAILS = ['jho.j80@gmail.com'] as const;

export function isDeveloperAccountEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return DEVELOPER_ACCOUNT_EMAILS.includes(normalized as (typeof DEVELOPER_ACCOUNT_EMAILS)[number]);
}
