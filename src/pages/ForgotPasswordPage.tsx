import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    title: 'Forgot password',
    subtitle: 'Enter your email and we will send you a reset link.',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    submit: 'Send reset link',
    sending: 'Sending...',
    successPrefix: 'Password reset instructions have been sent to',
    successSuffix: 'Check your inbox and spam folder.',
    backToLogin: 'Back to sign in',
    failed: 'Failed to send password reset email.',
  },
  id: {
    title: 'Lupa password',
    subtitle: 'Masukkan email Anda dan kami akan mengirimkan tautan reset password.',
    email: 'Email',
    emailPlaceholder: 'email@contoh.com',
    submit: 'Kirim tautan reset',
    sending: 'Mengirim...',
    successPrefix: 'Instruksi reset password telah dikirim ke',
    successSuffix: 'Silakan periksa kotak masuk dan folder spam Anda.',
    backToLogin: 'Kembali ke halaman login',
    failed: 'Gagal mengirim email reset password.',
  },
} as const;

export default function ForgotPasswordPage() {
  const { locale } = useI18n();
  const { sendPasswordResetEmail } = useAuth();
  const text = copy[locale];
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendPasswordResetEmail(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || text.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <KeyRound className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {text.successPrefix} <span className="font-semibold">{email}</span>. {text.successSuffix}
          </div>
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
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={text.emailPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? text.sending : text.submit}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            {text.backToLogin}
          </Link>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
