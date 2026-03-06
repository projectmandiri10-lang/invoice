import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

type BillingPlanCode = 'starter_month' | 'starter_year' | 'pro_month' | 'pro_year';

function formatExpiry(expiresAt: string | null | undefined) {
  if (!expiresAt) return '-';
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function BillingPage() {
  const { user, profile, effectivePlan } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const defaultPlanCode = (location.state as any)?.planCode as BillingPlanCode | undefined;

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600 mb-6">Kelola paket Starter/Pro dan perpanjangan.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Paket Anda</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold uppercase">{effectivePlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Berlaku sampai</span>
                <span className="font-semibold">{formatExpiry(profile?.plan_expires_at)}</span>
              </div>
            </div>

            <button
              onClick={() => setUpgradeOpen(true)}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Upgrade / Perpanjang
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Perbandingan Singkat</h2>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
              <li>Free: iklan + watermark, limit dokumen/klien.</li>
              <li>Starter: tanpa iklan/watermark, logo sendiri, unlimited dokumen.</li>
              <li>Pro: unlimited klien + Client Portal + pembayaran invoice.</li>
            </ul>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        defaultPlanCode={defaultPlanCode || 'starter_month'}
      />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
