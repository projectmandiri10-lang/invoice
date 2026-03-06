import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheck, Settings2, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LegalLinks from '@/components/LegalLinks';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { formatDateTime, getPlanLabel } from '@/lib/i18n';

const copy = {
  en: {
    loading: 'Loading account settings...',
    title: 'Account settings',
    subtitle: 'Manage your email, password, and verification status.',
    emailStatus: 'Email status',
    verified: 'Verified',
    unverified: 'Not verified',
    resendVerification: 'Resend verification email',
    resendSending: 'Sending...',
    resendSuccess: 'Verification email sent.',
    resendFailed: 'Failed to send verification email.',
    summary: 'Account summary',
    currentEmail: 'Current email',
    currentPlan: 'Current plan',
    createdAt: 'Account created',
    updateEmail: 'Change email',
    newEmail: 'New email',
    emailPlaceholder: 'new-email@example.com',
    emailUpdateHelp: 'A verification link will be sent to the new email address.',
    saveEmail: 'Update email',
    emailUpdateSuccess: 'Verification link sent to your new email address.',
    emailUpdateFailed: 'Failed to update email.',
    updatePassword: 'Change password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    passwordPlaceholder: 'Minimum 6 characters',
    confirmPlaceholder: 'Repeat your new password',
    savePassword: 'Update password',
    passwordUpdateSuccess: 'Password updated successfully.',
    passwordUpdateFailed: 'Failed to update password.',
    passwordMismatch: 'Passwords do not match.',
    passwordLength: 'Password must be at least 6 characters.',
    noticeEmailVerified: 'Your email has been verified.',
    noticeEmailUpdated: 'Your email change has been confirmed.',
    signInRequiredTitle: 'Sign in required',
    signInRequiredBody: 'Please sign in to manage your account settings.',
    signIn: 'Sign in',
  },
  id: {
    loading: 'Memuat pengaturan akun...',
    title: 'Pengaturan akun',
    subtitle: 'Kelola email, password, dan status verifikasi Anda.',
    emailStatus: 'Status email',
    verified: 'Terverifikasi',
    unverified: 'Belum diverifikasi',
    resendVerification: 'Kirim ulang email verifikasi',
    resendSending: 'Mengirim...',
    resendSuccess: 'Email verifikasi telah dikirim.',
    resendFailed: 'Gagal mengirim email verifikasi.',
    summary: 'Ringkasan akun',
    currentEmail: 'Email saat ini',
    currentPlan: 'Paket saat ini',
    createdAt: 'Akun dibuat',
    updateEmail: 'Ganti email',
    newEmail: 'Email baru',
    emailPlaceholder: 'email-baru@contoh.com',
    emailUpdateHelp: 'Tautan verifikasi akan dikirim ke alamat email baru.',
    saveEmail: 'Perbarui email',
    emailUpdateSuccess: 'Tautan verifikasi telah dikirim ke email baru Anda.',
    emailUpdateFailed: 'Gagal memperbarui email.',
    updatePassword: 'Ganti password',
    newPassword: 'Password baru',
    confirmPassword: 'Konfirmasi password baru',
    passwordPlaceholder: 'Minimal 6 karakter',
    confirmPlaceholder: 'Ulangi password baru',
    savePassword: 'Perbarui password',
    passwordUpdateSuccess: 'Password berhasil diperbarui.',
    passwordUpdateFailed: 'Gagal memperbarui password.',
    passwordMismatch: 'Password tidak cocok.',
    passwordLength: 'Password minimal 6 karakter.',
    noticeEmailVerified: 'Email Anda telah diverifikasi.',
    noticeEmailUpdated: 'Perubahan email Anda telah dikonfirmasi.',
    signInRequiredTitle: 'Perlu masuk',
    signInRequiredBody: 'Silakan masuk untuk mengelola pengaturan akun Anda.',
    signIn: 'Masuk',
  },
} as const;

export default function AccountSettingsPage() {
  const { locale } = useI18n();
  const {
    user,
    effectivePlan,
    isEmailVerified,
    loading,
    resendVerificationEmail,
    updateEmail,
    updatePassword,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const text = copy[locale];
  const [notice, setNotice] = React.useState('');
  const [error, setError] = React.useState('');
  const [emailForm, setEmailForm] = React.useState('');
  const [passwordForm, setPasswordForm] = React.useState('');
  const [confirmPasswordForm, setConfirmPasswordForm] = React.useState('');
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [verificationLoading, setVerificationLoading] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, navigate, user]);

  React.useEffect(() => {
    const nextNotice = searchParams.get('notice');
    if (nextNotice === 'email-verified') {
      setNotice(text.noticeEmailVerified);
    } else if (nextNotice === 'email-updated') {
      setNotice(text.noticeEmailUpdated);
    }
  }, [searchParams, text.noticeEmailUpdated, text.noticeEmailVerified]);

  React.useEffect(() => {
    if (user?.email) {
      setEmailForm(user.email);
    }
  }, [user?.email]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setError('');
    setNotice('');
    setVerificationLoading(true);

    try {
      await resendVerificationEmail(user.email);
      setNotice(text.resendSuccess);
    } catch (err: any) {
      setError(err.message || text.resendFailed);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleEmailUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!emailForm.trim() || emailForm.trim() === user?.email) {
      return;
    }

    setEmailLoading(true);

    try {
      await updateEmail(emailForm.trim());
      setNotice(text.emailUpdateSuccess);
    } catch (err: any) {
      setError(err.message || text.emailUpdateFailed);
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (passwordForm !== confirmPasswordForm) {
      setError(text.passwordMismatch);
      return;
    }

    if (passwordForm.length < 6) {
      setError(text.passwordLength);
      return;
    }

    setPasswordLoading(true);

    try {
      await updatePassword(passwordForm);
      setPasswordForm('');
      setConfirmPasswordForm('');
      setNotice(text.passwordUpdateSuccess);
    } catch (err: any) {
      setError(err.message || text.passwordUpdateFailed);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-xl text-gray-600">{text.loading}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-16">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{text.signInRequiredTitle}</h1>
            <p className="mt-3 text-gray-600">{text.signInRequiredBody}</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              {text.signIn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>
        </div>

        {notice && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{notice}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">{text.summary}</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">{text.currentEmail}</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">{text.currentPlan}</p>
                <p className="font-medium text-gray-900">{getPlanLabel(effectivePlan, locale)}</p>
              </div>
              <div>
                <p className="text-gray-500">{text.createdAt}</p>
                <p className="font-medium text-gray-900">{formatDateTime(user.created_at, locale)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                {isEmailVerified ? (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                ) : (
                  <MailCheck className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <p className="text-sm text-gray-500">{text.emailStatus}</p>
                  <p className={`font-semibold ${isEmailVerified ? 'text-green-700' : 'text-amber-700'}`}>
                    {isEmailVerified ? text.verified : text.unverified}
                  </p>
                </div>
              </div>
              {!isEmailVerified && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={verificationLoading}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
                >
                  {verificationLoading ? text.resendSending : text.resendVerification}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{text.updateEmail}</h2>
              <p className="mt-1 text-sm text-gray-600">{text.emailUpdateHelp}</p>
              <form onSubmit={handleEmailUpdate} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="newEmail" className="mb-2 block text-sm font-medium text-gray-700">
                    {text.newEmail}
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    value={emailForm}
                    onChange={(event) => setEmailForm(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder={text.emailPlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailLoading || emailForm.trim() === user.email}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {emailLoading ? text.resendSending : text.saveEmail}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{text.updatePassword}</h2>
              <form onSubmit={handlePasswordUpdate} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="accountPassword" className="mb-2 block text-sm font-medium text-gray-700">
                    {text.newPassword}
                  </label>
                  <input
                    id="accountPassword"
                    type="password"
                    value={passwordForm}
                    onChange={(event) => setPasswordForm(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder={text.passwordPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="accountPasswordConfirm" className="mb-2 block text-sm font-medium text-gray-700">
                    {text.confirmPassword}
                  </label>
                  <input
                    id="accountPasswordConfirm"
                    type="password"
                    value={confirmPasswordForm}
                    onChange={(event) => setConfirmPasswordForm(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder={text.confirmPlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {passwordLoading ? text.loading : text.savePassword}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              <LegalLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
