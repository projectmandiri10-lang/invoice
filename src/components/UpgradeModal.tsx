import React from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, getBillingPlanLabel, type BillingPlanCode } from '@/lib/i18n';

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

const copy = {
  en: {
    title: 'Upgrade / Renew',
    close: 'Close',
    plan: 'Plan',
    amount: 'Plan amount',
    paymentMethod: 'Payment method',
    loadingMethods: 'Loading payment methods...',
    noMethods: 'No payment methods are available right now.',
    startPayment: 'Continue to payment',
    creating: 'Creating transaction...',
    selectMethod: 'Select a payment method first',
    loadFailed: 'Failed to load payment methods',
    createFailed: 'Failed to create transaction',
    fee: 'Fee',
  },
  id: {
    title: 'Upgrade / Perpanjang',
    close: 'Tutup',
    plan: 'Paket',
    amount: 'Nominal paket',
    paymentMethod: 'Metode pembayaran',
    loadingMethods: 'Memuat metode pembayaran...',
    noMethods: 'Belum ada metode pembayaran yang tersedia.',
    startPayment: 'Lanjut ke pembayaran',
    creating: 'Membuat transaksi...',
    selectMethod: 'Pilih metode pembayaran terlebih dulu',
    loadFailed: 'Gagal memuat metode pembayaran',
    createFailed: 'Gagal membuat transaksi',
    fee: 'Biaya',
  },
} as const;

export default function UpgradeModal({
  isOpen,
  onClose,
  defaultPlanCode = 'starter_month',
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanCode?: BillingPlanCode;
}) {
  const { locale } = useI18n();
  const text = copy[locale];
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
        toast.error(text.loadFailed, { description: err?.message || String(err) });
      } finally {
        if (!cancelled) setLoadingMethods(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, planCode, text.loadFailed]);

  const startPayment = async () => {
    if (!paymentMethod) {
      toast.error(text.selectMethod);
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
      toast.error(text.createFailed, { description: err?.message || String(err) });
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
            <h2 className="text-lg font-bold text-gray-900">{text.title}</h2>
          </div>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100" aria-label={text.close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">{text.plan}</label>
            <select
              value={planCode}
              onChange={(event) => setPlanCode(event.target.value as BillingPlanCode)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={creating}
            >
              {(['starter_month', 'starter_year', 'pro_month', 'pro_year'] as BillingPlanCode[]).map((code) => (
                <option key={code} value={code}>
                  {getBillingPlanLabel(code, locale)}
                </option>
              ))}
            </select>
            {amountIdr > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {text.amount}: <span className="font-semibold">{formatCurrency(amountIdr, false, locale)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">{text.paymentMethod}</label>
            {loadingMethods ? (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{text.loadingMethods}</span>
              </div>
            ) : methods.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500">
                {text.noMethods}
              </div>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {methods.map((method) => {
                  const fee = Number(method.totalFee || 0);
                  const checked = paymentMethod === method.paymentMethod;

                  return (
                    <button
                      key={method.paymentMethod}
                      type="button"
                      onClick={() => setPaymentMethod(method.paymentMethod)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition ${
                        checked
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {method.paymentImage ? (
                          <img src={method.paymentImage} alt={method.paymentName} className="h-8 w-8 object-contain" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{method.paymentName}</div>
                          {Number.isFinite(fee) && fee > 0 && (
                            <div className="text-xs text-gray-500">
                              {text.fee}: {formatCurrency(fee, false, locale)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border ${
                          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            disabled={creating}
          >
            {text.close}
          </button>
          <button
            type="button"
            onClick={startPayment}
            disabled={creating || loadingMethods || !paymentMethod}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {creating ? text.creating : text.startPayment}
          </button>
        </div>
      </div>
    </div>
  );
}
