const DEVELOPER_ACCOUNT_EMAILS = ['jho.j80@gmail.com'];

export function isDeveloperAccountEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return DEVELOPER_ACCOUNT_EMAILS.includes(normalized);
}
