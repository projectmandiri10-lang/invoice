import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    fallbackEmail: 'your email',
    title: 'Verify your email',
    intro: 'We have sent a verification link to',
    body: 'Please check your inbox and spam folder to complete registration.',
    resend: 'Resend verification email',
    resendLoading: 'Sending...',
    resendSuccess: 'A new verification email has been sent.',
    resendFailed: 'Failed to resend verification email.',
    backToLogin: 'Back to sign in',
  },
  id: {
    fallbackEmail: 'email Anda',
    title: 'Verifikasi email Anda',
    intro: 'Kami telah mengirimkan tautan verifikasi ke',
    body: 'Silakan periksa kotak masuk dan folder spam untuk menyelesaikan pendaftaran.',
    resend: 'Kirim ulang email verifikasi',
    resendLoading: 'Mengirim...',
    resendSuccess: 'Email verifikasi baru telah dikirim.',
    resendFailed: 'Gagal mengirim ulang email verifikasi.',
    backToLogin: 'Kembali ke halaman login',
  },
} as const;

export default function CheckEmailPage() {
  const { locale } = useI18n();
  const text = copy[locale];
  const location = useLocation();
  const { resendVerificationEmail } = useAuth();
  const email = location.state?.email || text.fallbackEmail;
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');

  const handleResend = async () => {
    if (!location.state?.email) return;

    setLoading(true);
    setStatus('');

    try {
      await resendVerificationEmail(location.state.email);
      setStatus(text.resendSuccess);
    } catch (error: any) {
      setStatus(error.message || text.resendFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <MailCheck className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
        <p className="mt-4 text-gray-600">
          {text.intro} <span className="font-semibold text-gray-800">{email}</span>.
        </p>
        <p className="mt-2 text-gray-600">{text.body}</p>
        {status && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">{status}</div>
        )}
        <div className="mt-8">
          {location.state?.email && (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="mb-3 inline-flex w-full items-center justify-center rounded-lg border border-blue-200 px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? text.resendLoading : text.resend}
            </button>
          )}
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {text.backToLogin}
          </Link>
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
