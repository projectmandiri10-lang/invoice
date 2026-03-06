import React from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

type BillingPlanCode = 'starter_month' | 'starter_year' | 'pro_month' | 'pro_year';

type PaymentMethod = {
  paymentMethod: string;
  paymentName: string;
  paymentImage?: string;
  totalFee?: string;
};

type PaymentMethodsResponse = {
  amountIdr: number;
  methods: PaymentMethod[];
};

type CreateBillingTxResponse = {
  merchantOrderId: string;
  reference: string;
  paymentUrl: string;
  expiresAt: string;
  reused?: boolean;
};

const planLabel: Record<BillingPlanCode, string> = {
  starter_month: 'Starter • Bulanan (Rp 100.000)',
  starter_year: 'Starter • Tahunan (Rp 1.000.000)',
  pro_month: 'Pro • Bulanan (Rp 150.000)',
  pro_year: 'Pro • Tahunan (Rp 1.500.000)',
};

export default function UpgradeModal({
  isOpen,
  onClose,
  defaultPlanCode = 'starter_month',
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanCode?: BillingPlanCode;
}) {
  const [planCode, setPlanCode] = React.useState<BillingPlanCode>(defaultPlanCode);
  const [loadingMethods, setLoadingMethods] = React.useState(false);
  const [methods, setMethods] = React.useState<PaymentMethod[]>([]);
  const [amountIdr, setAmountIdr] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState<string>('');
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    setPlanCode(defaultPlanCode);
  }, [isOpen, defaultPlanCode]);

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function load() {
      setLoadingMethods(true);
      setMethods([]);
      setPaymentMethod('');
      try {
        const res = await invokeEdgeFunction<PaymentMethodsResponse>('billing-payment-methods', { planCode });
        if (cancelled) return;
        setAmountIdr(res.amountIdr);
        setMethods(res.methods || []);
      } catch (err: any) {
        if (cancelled) return;
        toast.error('Gagal memuat metode pembayaran', { description: err?.message || String(err) });
      } finally {
        if (!cancelled) setLoadingMethods(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, planCode]);

  const startPayment = async () => {
    if (!paymentMethod) {
      toast.error('Pilih metode pembayaran terlebih dulu');
      return;
    }

    setCreating(true);
    try {
      const res = await invokeEdgeFunction<CreateBillingTxResponse>('billing-create-transaction', {
        planCode,
        paymentMethod,
      });
      window.location.href = res.paymentUrl;
    } catch (err: any) {
      toast.error('Gagal membuat transaksi', { description: err?.message || String(err) });
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Upgrade / Perpanjang</h2>
          </div>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paket</label>
            <select
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value as BillingPlanCode)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={creating}
            >
              {Object.entries(planLabel).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            {amountIdr > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Nominal paket: <span className="font-semibold">Rp {amountIdr.toLocaleString('id-ID')}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
            {loadingMethods ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memuat metode...</span>
              </div>
            ) : methods.length === 0 ? (
              <p className="text-sm text-gray-600">Metode pembayaran belum tersedia.</p>
            ) : (
              <div className="max-h-64 overflow-auto rounded-lg border border-gray-200">
                {methods.map((m) => (
                  <label
                    key={m.paymentMethod}
                    className="flex cursor-pointer items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.paymentMethod}
                        checked={paymentMethod === m.paymentMethod}
                        onChange={() => setPaymentMethod(m.paymentMethod)}
                        disabled={creating}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{m.paymentName}</div>
                        {m.totalFee && (
                          <div className="text-xs text-gray-500">Biaya: Rp {Number(m.totalFee).toLocaleString('id-ID')}</div>
                        )}
                      </div>
                    </div>
                    {m.paymentImage ? (
                      <img src={m.paymentImage} alt={m.paymentName} className="h-8 w-auto" />
                    ) : null}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            disabled={creating}
          >
            Batal
          </button>
          <button
            onClick={startPayment}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={creating || loadingMethods || !paymentMethod}
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{creating ? 'Mengalihkan...' : 'Lanjut Bayar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

