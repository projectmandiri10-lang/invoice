import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    title: 'Reset password',
    subtitle: 'Enter a new password for your account.',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    passwordPlaceholder: 'Minimum 6 characters',
    confirmPlaceholder: 'Repeat your new password',
    submit: 'Update password',
    loading: 'Updating...',
    success: 'Password updated successfully. Redirecting to sign in...',
    mismatch: 'Passwords do not match.',
    passwordLength: 'Password must be at least 6 characters.',
    failed: 'Failed to update password.',
    invalidTitle: 'Recovery link is missing or expired',
    invalidBody: 'Request a new password reset email and try again.',
    requestNewLink: 'Request new reset link',
  },
  id: {
    title: 'Reset password',
    subtitle: 'Masukkan password baru untuk akun Anda.',
    newPassword: 'Password baru',
    confirmPassword: 'Konfirmasi password baru',
    passwordPlaceholder: 'Minimal 6 karakter',
    confirmPlaceholder: 'Ulangi password baru',
    submit: 'Perbarui password',
    loading: 'Memperbarui...',
    success: 'Password berhasil diperbarui. Mengalihkan ke halaman login...',
    mismatch: 'Password tidak cocok.',
    passwordLength: 'Password minimal 6 karakter.',
    failed: 'Gagal memperbarui password.',
    invalidTitle: 'Tautan pemulihan tidak ada atau sudah kedaluwarsa',
    invalidBody: 'Minta email reset password baru lalu coba lagi.',
    requestNewLink: 'Minta tautan reset baru',
  },
} as const;

export default function ResetPasswordPage() {
  const { locale } = useI18n();
  const { user, loading: authLoading, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const text = copy[locale];
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError(text.mismatch);
      return;
    }

    if (password.length < 6) {
      setError(text.passwordLength);
      return;
    }

    setSaving(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      await signOut();
      window.setTimeout(() => {
        navigate('/login?notice=password-reset', { replace: true });
      }, 1200);
    } catch (err: any) {
      setError(err.message || text.failed);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">{text.loading}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">{text.invalidTitle}</h1>
          <p className="mt-3 text-gray-600">{text.invalidBody}</p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {text.requestNewLink}
          </Link>
          <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
            <LegalLinks />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <LockKeyhole className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{text.success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
              {text.newPassword}
            </label>
            <input
              id="newPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={text.passwordPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              {text.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={text.confirmPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {saving ? text.loading : text.submit}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
