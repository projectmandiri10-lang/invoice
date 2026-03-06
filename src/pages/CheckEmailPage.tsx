import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    fallbackEmail: 'your email',
    title: 'Verify your email',
    intro: 'We have sent a verification link to',
    body: 'Please check your inbox and spam folder to complete registration.',
    backToLogin: 'Back to sign in',
  },
  id: {
    fallbackEmail: 'email Anda',
    title: 'Verifikasi email Anda',
    intro: 'Kami telah mengirimkan tautan verifikasi ke',
    body: 'Silakan periksa kotak masuk dan folder spam untuk menyelesaikan pendaftaran.',
    backToLogin: 'Kembali ke halaman login',
  },
} as const;

export default function CheckEmailPage() {
  const { locale } = useI18n();
  const text = copy[locale];
  const location = useLocation();
  const email = location.state?.email || text.fallbackEmail;

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
        <div className="mt-8">
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
