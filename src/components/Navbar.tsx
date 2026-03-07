import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CreditCard, FileText, Home, Languages, LogOut, Settings2, User, Users } from 'lucide-react';
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
    account: 'Account',
    signOut: 'Sign out',
    signIn: 'Sign in',
    register: 'Register',
    language: 'Language',
    upgradeButton: 'Upgrade',
    upgradeStarter: 'Upgrade to Starter',
    upgradePro: 'Upgrade to Pro',
  },
  id: {
    brand: 'idCashier Invoice Generator',
    home: 'Beranda',
    myDocuments: 'Dokumen Saya',
    clients: 'Klien',
    billing: 'Billing',
    account: 'Akun',
    signOut: 'Keluar',
    signIn: 'Masuk',
    register: 'Daftar',
    language: 'Bahasa',
    upgradeButton: 'Upgrade',
    upgradeStarter: 'Upgrade ke Starter',
    upgradePro: 'Upgrade ke Pro',
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

  const upgradeTarget = effectivePlan === 'starter' ? 'pro_month' : 'starter_month';
  const upgradeLabel = effectivePlan === 'starter' ? text.upgradePro : text.upgradeStarter;

  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
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
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src="/logo.png" alt={text.brand} className="h-10 w-10 object-contain" />
            <span className="hidden text-lg font-bold leading-tight text-gray-900 sm:block lg:text-xl xl:whitespace-nowrap">
              {text.brand}
            </span>
            <span className="text-base font-bold text-gray-900 sm:hidden">idCashier</span>
          </Link>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700">
              <Languages className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="sr-only">{text.language}</span>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as 'en' | 'id')}
                className="cursor-pointer bg-transparent text-sm text-gray-700 outline-none"
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
                {effectivePlan !== 'pro' && (
                  <Link
                    to="/billing"
                    state={{ planCode: upgradeTarget }}
                    title={upgradeLabel}
                    aria-label={upgradeLabel}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">{text.upgradeButton}</span>
                  </Link>
                )}

                <Link
                  to="/account"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{text.account}</span>
                </Link>

                <div className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-gray-700">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="max-w-[140px] truncate text-sm">{user.email}</span>
                  <span className="rounded border border-gray-100 bg-white px-2 py-0.5 text-xs font-semibold uppercase text-gray-700">
                    {getPlanLabel(effectivePlan, locale)}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{text.signOut}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  {text.signIn}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {text.register}
                </Link>
              </>
            )}
          </div>
        </div>

        {user && (
          <div className="border-t border-gray-100 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {navigationItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={getNavLinkClassName}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
