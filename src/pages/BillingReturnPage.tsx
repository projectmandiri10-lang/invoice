import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

type BillingStatusResponse = {
  status: 'pending' | 'paid' | 'failed' | 'expired';
  transaction?: any;
  profile?: { plan: string; planExpiresAt: string | null } | null;
};

const copy = {
  en: {
    checking: 'Processing payment...',
    checkingDescription: 'Please wait while we confirm your payment status.',
    success: 'Payment successful',
    successDescription: 'Your plan is active now.',
    incomplete: 'Payment not completed',
    incompleteDescription: 'If you already paid, try checking again in a few moments.',
    backToBilling: 'Back to billing',
    backHome: 'Back to home',
    statusFailed: 'Failed to check payment status',
  },
  id: {
    checking: 'Memproses pembayaran...',
    checkingDescription: 'Tunggu sebentar, kami sedang memastikan status pembayaran Anda.',
    success: 'Pembayaran berhasil',
    successDescription: 'Paket Anda sudah aktif sekarang.',
    incomplete: 'Pembayaran belum selesai',
    incompleteDescription: 'Jika Anda sudah membayar, coba cek ulang beberapa saat lagi.',
    backToBilling: 'Kembali ke billing',
    backHome: 'Kembali ke beranda',
    statusFailed: 'Gagal cek status pembayaran',
  },
} as const;

export default function BillingReturnPage() {
  const { refresh } = useAuth();
  const { locale } = useI18n();
  const text = copy[locale];
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('orderId') || '';

  const [status, setStatus] = React.useState<BillingStatusResponse['status']>('pending');
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    if (!orderId) {
      setChecking(false);
      setStatus('failed');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    async function checkOnce() {
      attempts += 1;
      try {
        const res = await invokeEdgeFunction<BillingStatusResponse>('billing-status', { merchantOrderId: orderId });
        if (cancelled) return;
        setStatus(res.status);
        if (res.status === 'paid') {
          setChecking(false);
          await refresh();
          return;
        }
        if (res.status === 'failed' || res.status === 'expired') {
          setChecking(false);
          return;
        }
      } catch (err: any) {
        if (cancelled) return;
        toast.error(text.statusFailed, { description: err?.message || String(err) });
        setChecking(false);
        setStatus('failed');
      }

      if (!cancelled && attempts < maxAttempts) {
        setTimeout(checkOnce, 2500);
      } else if (!cancelled) {
        setChecking(false);
      }
    }

    checkOnce();
    return () => {
      cancelled = true;
    };
  }, [orderId, refresh, text.statusFailed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {checking && status === 'pending' ? (
            <>
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900">{text.checking}</h1>
              <p className="text-gray-600">{text.checkingDescription}</p>
            </>
          ) : status === 'paid' ? (
            <>
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-600" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900">{text.success}</h1>
              <p className="text-gray-600">{text.successDescription}</p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto mb-4 h-10 w-10 text-red-600" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900">{text.incomplete}</h1>
              <p className="text-gray-600">{text.incompleteDescription}</p>
            </>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/billing')}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              {text.backToBilling}
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
            >
              {text.backHome}
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
