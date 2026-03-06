import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import LegalLinks from '@/components/LegalLinks';

const copy = {
  en: {
    loadingTitle: 'Processing authentication',
    loadingBody: 'Please wait while we verify your request.',
    failedTitle: 'Authentication link failed',
    backToLogin: 'Back to sign in',
  },
  id: {
    loadingTitle: 'Memproses autentikasi',
    loadingBody: 'Silakan tunggu sementara kami memverifikasi permintaan Anda.',
    failedTitle: 'Tautan autentikasi gagal diproses',
    backToLogin: 'Kembali ke halaman login',
  },
} as const;

function decodeUrlValue(value: string | null) {
  if (!value) return '';
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

export default function AuthCallbackPage() {
  const { locale } = useI18n();
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const text = copy[locale];
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;

    const finalizeAuth = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const hashParams = new URLSearchParams(currentUrl.hash.replace(/^#/, ''));
        const flow = currentUrl.searchParams.get('flow') || hashParams.get('type') || 'signup';
        const errorDescription =
          decodeUrlValue(currentUrl.searchParams.get('error_description')) ||
          decodeUrlValue(hashParams.get('error_description'));

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        const code = currentUrl.searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }

        await refresh();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (flow === 'recovery') {
          navigate('/reset-password', { replace: true });
          return;
        }

        if (flow === 'email-change') {
          navigate('/account?notice=email-updated', { replace: true });
          return;
        }

        if (user) {
          navigate('/account?notice=email-verified', { replace: true });
        } else {
          navigate('/login?notice=email-verified', { replace: true });
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || text.failedTitle);
        }
      }
    };

    void finalizeAuth();

    return () => {
      active = false;
    };
  }, [navigate, refresh, text.failedTitle]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <h1 className="text-2xl font-bold text-gray-900">{error ? text.failedTitle : text.loadingTitle}</h1>
        <p className="mt-3 text-gray-600">{error || text.loadingBody}</p>
        {error && (
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {text.backToLogin}
          </Link>
        )}
        <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
