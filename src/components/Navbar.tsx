import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User, Home, CreditCard, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { getLanguageLabel, getPlanLabel, SUPPORTED_LOCALES } from '@/lib/i18n';

const copy = {
  en: {
    brand: 'idCashier Invoice Generator',
    home: 'Home',
    myDocuments: 'My Documents',
    clients: 'Clients',
    billing: 'Billing',
    signOut: 'Sign out',
    signIn: 'Sign in',
    register: 'Register',
    language: 'Language',
  },
  id: {
    brand: 'idCashier Invoice Generator',
    home: 'Beranda',
    myDocuments: 'Dokumen Saya',
    clients: 'Klien',
    billing: 'Billing',
    signOut: 'Keluar',
    signIn: 'Masuk',
    register: 'Daftar',
    language: 'Bahasa',
  },
} as const;

export default function Navbar() {
  const { user, effectivePlan, signOut } = useAuth();
  const { locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const text = copy[locale];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-col gap-3 py-3 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt={text.brand} className="h-10 w-10 object-contain" />
            <span className="text-lg font-bold text-gray-900 sm:text-xl">{text.brand}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <span>{text.language}</span>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as 'en' | 'id')}
                className="bg-transparent text-sm text-gray-700 outline-none"
                aria-label={text.language}
              >
                {SUPPORTED_LOCALES.map((value) => (
                  <option key={value} value={value}>
                    {getLanguageLabel(value, locale)}
                  </option>
                ))}
              </select>
            </label>

            {user ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>{text.home}</span>
                </Link>
                <Link
                  to="/my-documents"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>{text.myDocuments}</span>
                </Link>
                <Link
                  to="/clients"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>{text.clients}</span>
                </Link>
                <Link
                  to="/billing"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>{text.billing}</span>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="max-w-40 truncate text-sm">{user.email}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase text-gray-700">
                    {getPlanLabel(effectivePlan, locale)}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{text.signOut}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  {text.signIn}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  {text.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
