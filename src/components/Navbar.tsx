import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CreditCard, FileText, Home, Languages, LogOut, User, Users } from 'lucide-react';
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
  const navigationItems = [
    { to: '/', label: text.home, icon: Home },
    { to: '/my-documents', label: text.myDocuments, icon: FileText },
    { to: '/clients', label: text.clients, icon: Users },
    { to: '/billing', label: text.billing, icon: CreditCard },
  ];

  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
    }`;

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
        <div className="flex min-h-16 flex-col gap-4 py-3 xl:flex-row xl:items-center xl:justify-between xl:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src="/logo.png" alt={text.brand} className="h-10 w-10 object-contain" />
            <span className="max-w-[260px] text-lg font-bold leading-tight text-gray-900 sm:text-xl">
              {text.brand}
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 flex-col gap-3 xl:items-end">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
              <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
                <Languages className="h-4 w-4 text-gray-500" />
                <span className="sr-only">{text.language}</span>
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as 'en' | 'id')}
                  className="min-w-[150px] bg-transparent text-sm text-gray-700 outline-none"
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
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="max-w-[180px] truncate text-sm">{user.email}</span>
                    <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold uppercase text-gray-700">
                      {getPlanLabel(effectivePlan, locale)}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{text.signOut}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                  >
                    {text.signIn}
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {text.register}
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                {navigationItems.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} className={getNavLinkClassName}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
