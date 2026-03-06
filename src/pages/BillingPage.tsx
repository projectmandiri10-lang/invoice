import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { formatDateTime, getPlanLabel, type BillingPlanCode } from '@/lib/i18n';

const copy = {
  en: {
    title: 'Billing',
    subtitle: 'Manage your Starter or Pro plan and renewals.',
    currentPlan: 'Your plan',
    status: 'Status',
    expiresAt: 'Active until',
    renew: 'Upgrade / Renew',
    comparison: 'Quick comparison',
    free: 'Free: ads + watermark, limited documents and clients.',
    starter: 'Starter: no ads/watermark, custom logo, up to 100 saved documents.',
    pro: 'Pro: unlimited saved documents, unlimited clients, client portal, and invoice payments.',
    missing: '-',
  },
  id: {
    title: 'Billing',
    subtitle: 'Kelola paket Starter atau Pro dan perpanjangannya.',
    currentPlan: 'Paket Anda',
    status: 'Status',
    expiresAt: 'Berlaku sampai',
    renew: 'Upgrade / Perpanjang',
    comparison: 'Perbandingan singkat',
    free: 'Free: iklan + watermark, limit dokumen dan klien.',
    starter: 'Starter: tanpa iklan/watermark, logo sendiri, hingga 100 dokumen tersimpan.',
    pro: 'Pro: dokumen tersimpan tanpa batas, klien tanpa batas, client portal, dan pembayaran invoice.',
    missing: '-',
  },
} as const;

function formatExpiry(expiresAt: string | null | undefined, locale: 'en' | 'id', fallback: string) {
  if (!expiresAt) return fallback;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return fallback;
  return formatDateTime(date.toISOString(), locale);
}

export default function BillingPage() {
  const { user, profile, effectivePlan } = useAuth();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const defaultPlanCode = (location.state as { planCode?: BillingPlanCode } | null)?.planCode;
  const text = copy[locale];

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{text.title}</h1>
        <p className="mb-6 text-gray-600">{text.subtitle}</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{text.currentPlan}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">{text.status}</span>
                <span className="font-semibold uppercase">{getPlanLabel(effectivePlan, locale)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">{text.expiresAt}</span>
                <span className="text-right font-semibold">
                  {formatExpiry(profile?.plan_expires_at, locale, text.missing)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setUpgradeOpen(true)}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              {text.renew}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{text.comparison}</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>{text.free}</li>
              <li>{text.starter}</li>
              <li>{text.pro}</li>
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
