import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast, Toaster } from 'sonner';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { useAuth } from '@/contexts/AuthContext';

type BillingStatusResponse = {
  status: 'pending' | 'paid' | 'failed' | 'expired';
  transaction?: any;
  profile?: { plan: string; planExpiresAt: string | null } | null;
};

export default function BillingReturnPage() {
  const { refresh } = useAuth();
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
    const maxAttempts = 12; // ~30s at 2.5s interval

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
        toast.error('Gagal cek status pembayaran', { description: err?.message || String(err) });
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
  }, [orderId, refresh]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          {checking && status === 'pending' ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Memproses pembayaran...</h1>
              <p className="text-gray-600">Tunggu sebentar, kami sedang memastikan status pembayaran Anda.</p>
            </>
          ) : status === 'paid' ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran berhasil</h1>
              <p className="text-gray-600">Paket Anda sudah aktif. Terima kasih!</p>
            </>
          ) : (
            <>
              <XCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran belum selesai</h1>
              <p className="text-gray-600">Jika Anda sudah membayar, coba cek ulang beberapa saat lagi.</p>
            </>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/billing')}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Kembali ke Billing
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-gray-800 hover:bg-gray-200"
            >
              Ke Beranda
            </button>
          </div>

          {orderId ? (
            <p className="mt-4 text-xs text-gray-500">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          ) : null}
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
