import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    title: 'Register',
    subtitle: 'Create your new account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    emailPlaceholder: 'email@example.com',
    passwordPlaceholder: 'Minimum 6 characters',
    confirmPlaceholder: 'Repeat your password',
    submit: 'Create account',
    loading: 'Creating account...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    success: 'Registration successful. Verify your email first, then wait for administrator approval.',
    passwordMismatch: 'Passwords do not match',
    passwordLength: 'Password must be at least 6 characters',
    registerFailed: 'Failed to register. Please try again.',
    consentPrefix: 'By registering, you agree to our',
    consentAnd: 'and',
    consentRequired: 'You must agree to the Terms of Service and Privacy Policy.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },
  id: {
    title: 'Daftar',
    subtitle: 'Buat akun baru Anda',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi password',
    emailPlaceholder: 'email@contoh.com',
    passwordPlaceholder: 'Minimal 6 karakter',
    confirmPlaceholder: 'Ulangi password',
    submit: 'Buat akun',
    loading: 'Membuat akun...',
    alreadyHaveAccount: 'Sudah punya akun?',
    signIn: 'Masuk',
    success: 'Pendaftaran berhasil. Verifikasi email Anda terlebih dahulu, lalu tunggu persetujuan administrator.',
    passwordMismatch: 'Password tidak cocok',
    passwordLength: 'Password minimal 6 karakter',
    registerFailed: 'Gagal mendaftar. Silakan coba lagi.',
    consentPrefix: 'Dengan mendaftar Anda menyetujui',
    consentAnd: 'dan',
    consentRequired: 'Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Privasi.',
    terms: 'Syarat dan Ketentuan',
    privacy: 'Kebijakan Privasi',
  },
} as const;

export default function RegisterPage() {
  const { locale } = useI18n();
  const text = copy[locale];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError(text.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(text.passwordLength);
      return;
    }

    if (!agreed) {
      setError(text.consentRequired);
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/check-email', { state: { email } });
      }, 2000);
    } catch (err: any) {
      setError(err.message || text.registerFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <UserPlus className="h-12 w-12 text-blue-600" />
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

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              {text.consentPrefix}{' '}
              <Link to="/terms" className="font-semibold text-blue-600 hover:text-blue-700">
                {text.terms}
              </Link>{' '}
              {text.consentAnd}{' '}
              <Link to="/privacy" className="font-semibold text-blue-600 hover:text-blue-700">
                {text.privacy}
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? text.loading : text.submit}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {text.alreadyHaveAccount}{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              {text.signIn}
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
