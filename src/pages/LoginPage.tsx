import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';
import { consumeAuthNotice } from '@/lib/authz';

const copy = {
  en: {
    title: 'Sign in',
    subtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'email@example.com',
    passwordPlaceholder: 'Enter your password',
    submit: 'Sign in',
    loading: 'Signing in...',
    noAccount: "Don't have an account?",
    register: 'Register',
    loginFailed: 'Failed to sign in. Check your email and password.',
    resendVerification: 'Resend verification email',
    resendLoading: 'Sending...',
    resendSuccess: 'A new verification email has been sent.',
    resendFailed: 'Failed to resend verification email.',
    emailRequiredForResend: 'Enter your email address first.',
    unverifiedHint: 'Your email is not verified yet.',
    noticeEmailVerified: 'Your email has been verified. Please wait for administrator approval before signing in.',
    pendingApproval: 'Your account is waiting for administrator approval.',
    disabledAccount: 'Your account has been disabled. Contact the administrator.',
  },
  id: {
    title: 'Masuk',
    subtitle: 'Masuk ke akun Anda',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'email@contoh.com',
    passwordPlaceholder: 'Masukkan password',
    submit: 'Masuk',
    loading: 'Memproses...',
    noAccount: 'Belum punya akun?',
    register: 'Daftar',
    loginFailed: 'Gagal masuk. Periksa email dan password Anda.',
    resendVerification: 'Kirim ulang email verifikasi',
    resendLoading: 'Mengirim...',
    resendSuccess: 'Email verifikasi baru telah dikirim.',
    resendFailed: 'Gagal mengirim ulang email verifikasi.',
    emailRequiredForResend: 'Masukkan alamat email Anda terlebih dahulu.',
    unverifiedHint: 'Email Anda belum diverifikasi.',
    noticeEmailVerified: 'Email Anda sudah diverifikasi. Silakan tunggu persetujuan administrator sebelum masuk.',
    pendingApproval: 'Akun Anda masih menunggu persetujuan administrator.',
    disabledAccount: 'Akun Anda dinonaktifkan. Hubungi administrator.',
  },
} as const;

export default function LoginPage() {
  const { locale } = useI18n();
  const text = copy[locale];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { signIn, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const notice = searchParams.get('notice');
  const authNotice = consumeAuthNotice();
  const noticeMessage =
    notice === 'email-verified'
      ? text.noticeEmailVerified
      : authNotice === 'pending'
        ? text.pendingApproval
        : authNotice === 'disabled'
          ? text.disabledAccount
        : '';
  const requiresVerification = /email not confirmed|email not verified/i.test(error);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setResendSuccess('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      if (err?.message === 'ACCOUNT_PENDING') {
        setError(text.pendingApproval);
      } else if (err?.message === 'ACCOUNT_DISABLED') {
        setError(text.disabledAccount);
      } else {
        setError(err.message || text.loginFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError(text.emailRequiredForResend);
      return;
    }

    setError('');
    setResendSuccess('');
    setResendLoading(true);

    try {
      await resendVerificationEmail(email.trim());
      setResendSuccess(text.resendSuccess);
    } catch (err: any) {
      setError(err.message || text.resendFailed);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <LogIn className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>
        </div>

        {noticeMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{noticeMessage}</div>
        )}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {resendSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{resendSuccess}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              {text.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setResendSuccess('');
              }}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={text.emailPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              {text.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={text.passwordPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? text.loading : text.submit}
          </button>
        </form>

        {requiresVerification && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-medium">{text.unverifiedHint}</p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="mt-3 inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
              {resendLoading ? text.resendLoading : text.resendVerification}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {text.noAccount}{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
              {text.register}
            </Link>
          </p>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
