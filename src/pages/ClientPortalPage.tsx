import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CreditCard, FileDown, Loader2, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';
import { InvoiceData } from '@/types/document';
import { exportInvoiceToPDF, formatCurrency, formatDate } from '@/lib/documentUtils';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

interface DocumentRow {
  id: string;
  title: string;
  document_type: string;
  content: InvoiceData;
  settings?: any;
  status: string;
  created_at: string;
}

type PortalResponse = {
  client: { id: string; client_name: string };
  documents: DocumentRow[];
};

type PaymentMethod = {
  paymentMethod: string;
  paymentName: string;
  paymentImage?: string;
  totalFee?: string;
};

type InvoicePaymentMethodsResponse = {
  amountIdr: number;
  methods: PaymentMethod[];
  clientName?: string;
};

type InvoiceCreateTxResponse = {
  merchantOrderId: string;
  paymentUrl: string;
  expiresAt: string;
  reference?: string;
};

type InvoiceStatusResponse = {
  status: 'pending' | 'paid' | 'failed' | 'expired';
  invoiceStatus?: string;
  transaction?: any;
};

const copy = {
  en: {
    loading: 'Loading client portal...',
    title: 'Client Portal',
    subtitle: 'Your invoice history',
    refresh: 'Refresh',
    empty: 'There are no invoices for this client yet.',
    number: 'Invoice No.',
    date: 'Date',
    total: 'Total',
    status: 'Status',
    actions: 'Actions',
    paid: 'Paid',
    unpaid: 'Unpaid',
    download: 'Download PDF',
    payNow: 'Pay Now',
    payTitle: 'Pay Invoice',
    close: 'Close',
    loadingMethods: 'Loading payment methods...',
    noMethods: 'Payment methods are not available.',
    fee: 'Fee',
    continuePay: 'Continue to payment',
    redirecting: 'Redirecting...',
    poweredBy: 'Powered by idCashier Invoice Generator',
    paymentSuccess: 'Payment successful',
    paymentSuccessDescription: 'Invoice has been marked as paid.',
    paymentFailed: 'Payment not completed',
    paymentFailedDescription: 'Please try again or choose another payment method.',
    paymentPending: 'Payment is being processed',
    paymentPendingDescription: 'Please wait a few moments.',
    statusFailed: 'Failed to check payment status',
    methodsFailed: 'Failed to load payment methods',
    createFailed: 'Failed to create transaction',
    downloadFailed: 'Failed to download PDF.',
  },
  id: {
    loading: 'Memuat portal klien...',
    title: 'Portal Klien',
    subtitle: 'Riwayat invoice Anda',
    refresh: 'Muat ulang',
    empty: 'Belum ada invoice untuk klien ini.',
    number: 'No. Invoice',
    date: 'Tanggal',
    total: 'Total',
    status: 'Status',
    actions: 'Aksi',
    paid: 'Lunas',
    unpaid: 'Belum Lunas',
    download: 'Unduh PDF',
    payNow: 'Bayar Sekarang',
    payTitle: 'Bayar Invoice',
    close: 'Tutup',
    loadingMethods: 'Memuat metode pembayaran...',
    noMethods: 'Metode pembayaran tidak tersedia.',
    fee: 'Biaya',
    continuePay: 'Lanjut Bayar',
    redirecting: 'Mengalihkan...',
    poweredBy: 'Disediakan oleh idCashier Invoice Generator',
    paymentSuccess: 'Pembayaran berhasil',
    paymentSuccessDescription: 'Invoice sudah ditandai lunas.',
    paymentFailed: 'Pembayaran belum berhasil',
    paymentFailedDescription: 'Silakan coba lagi atau pilih metode lain.',
    paymentPending: 'Pembayaran sedang diproses',
    paymentPendingDescription: 'Silakan tunggu beberapa saat.',
    statusFailed: 'Gagal memeriksa status pembayaran',
    methodsFailed: 'Gagal memuat metode pembayaran',
    createFailed: 'Gagal membuat transaksi',
    downloadFailed: 'Gagal mengunduh PDF.',
  },
} as const;

export default function ClientPortalPage() {
  const { accessToken = '' } = useParams<{ accessToken: string }>();
  const { locale } = useI18n();
  const text = copy[locale];
  const [params, setParams] = useSearchParams();
  const paidOrderId = params.get('paidOrderId') || '';

  const [loading, setLoading] = React.useState(true);
  const [clientName, setClientName] = React.useState('');
  const [documents, setDocuments] = React.useState<DocumentRow[]>([]);
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentRow | null>(null);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('');
  const [creatingPayment, setCreatingPayment] = React.useState(false);

  const fetchPortal = React.useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const portalData = await invokeEdgeFunction<PortalResponse>('client-portal-data', { accessToken });
      setClientName(portalData.client.client_name);
      setDocuments((portalData.documents || []).filter((doc) => doc.document_type === 'invoice'));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    fetchPortal().catch((err) => {
      console.error('Failed to fetch portal:', err);
      toast.error(locale === 'id' ? 'Gagal memuat portal klien' : 'Failed to load client portal', {
        description: err instanceof Error ? err.message : String(err),
      });
    });
  }, [fetchPortal, locale]);

  React.useEffect(() => {
    if (!paidOrderId) return;

    let cancelled = false;
    const checkStatus = async () => {
      try {
        const res = await invokeEdgeFunction<InvoiceStatusResponse>('invoice-status', {
          accessToken,
          merchantOrderId: paidOrderId,
        });
        if (cancelled) return;
        if (res.status === 'paid') {
          toast.success(text.paymentSuccess, { description: text.paymentSuccessDescription });
        } else if (res.status === 'failed' || res.status === 'expired') {
          toast.error(text.paymentFailed, { description: text.paymentFailedDescription });
        } else {
          toast.info(text.paymentPending, { description: text.paymentPendingDescription });
        }
      } catch (err: any) {
        if (!cancelled) {
          toast.error(text.statusFailed, { description: err?.message || String(err) });
        }
      } finally {
        if (!cancelled) {
          fetchPortal().catch(() => {});
          params.delete('paidOrderId');
          setParams(params, { replace: true });
        }
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [accessToken, paidOrderId, fetchPortal, params, setParams, text]);

  const handleDownload = async (doc: DocumentRow) => {
    try {
      const settings = {
        ...doc.settings,
        visibleFields: {
          companyNPWP: true,
          dueDate: true,
          subtotal: true,
          discount: false,
          tax: true,
          total: true,
          notes: true,
          paymentInfo: true,
          showDecimals: false,
          ...(doc.settings?.visibleFields || {}),
        },
      };

      await exportInvoiceToPDF(doc.content, settings, 'pro', locale);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      toast.error(text.downloadFailed);
    }
  };

  const openPaymentModal = async (doc: DocumentRow) => {
    try {
      setSelectedDocument(doc);
      setLoadingMethods(true);
      setPaymentMethods([]);
      setSelectedPaymentMethod('');

      const res = await invokeEdgeFunction<InvoicePaymentMethodsResponse>('invoice-payment-methods', {
        accessToken,
        documentId: doc.id,
      });

      setPaymentMethods(res.methods || []);
    } catch (err: any) {
      toast.error(text.methodsFailed, { description: err?.message || String(err) });
      setSelectedDocument(null);
    } finally {
      setLoadingMethods(false);
    }
  };

  const startPayment = async () => {
    if (!selectedDocument || !selectedPaymentMethod) return;

    try {
      setCreatingPayment(true);
      const res = await invokeEdgeFunction<InvoiceCreateTxResponse>('invoice-create-transaction', {
        accessToken,
        documentId: selectedDocument.id,
        paymentMethod: selectedPaymentMethod,
      });
      window.location.href = res.paymentUrl;
    } catch (err: any) {
      toast.error(text.createFailed, { description: err?.message || String(err) });
      setCreatingPayment(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{text.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{text.title}</h1>
              <p className="mt-1 text-gray-600">{clientName}</p>
            </div>
            <button
              onClick={() => fetchPortal()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {text.refresh}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">{text.subtitle}</h2>
          {documents.length === 0 ? (
            <p className="text-gray-600">{text.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-600">
                    <th className="p-4">{text.number}</th>
                    <th className="p-4">{text.date}</th>
                    <th className="p-4">{text.total}</th>
                    <th className="p-4">{text.status}</th>
                    <th className="p-4">{text.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const paid = doc.status === 'paid';
                    const paymentEnabled = Boolean((doc.settings as any)?.visibleFields?.paymentGateway);
                    return (
                      <tr key={doc.id} className="border-t border-gray-100">
                        <td className="p-4 font-medium text-gray-900">{doc.content.invoiceNumber}</td>
                        <td className="p-4 text-gray-600">{formatDate(doc.content.invoiceDate, locale)}</td>
                        <td className="p-4 text-gray-600">{formatCurrency(doc.content.total, false, locale)}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {paid ? text.paid : text.unpaid}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleDownload(doc)}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              title={text.download}
                            >
                              <FileDown className="h-4 w-4" />
                            </button>
                            {!paid && paymentEnabled && (
                              <button
                                onClick={() => openPaymentModal(doc)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                title={text.payNow}
                              >
                                <CreditCard className="h-4 w-4" />
                                <span>{text.payNow}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{text.payTitle}</h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="rounded p-2 text-gray-500 hover:bg-gray-100"
                  aria-label={text.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {loadingMethods ? (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-4 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{text.loadingMethods}</span>
                </div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-gray-600">{text.noMethods}</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const feeNum = Number(method.totalFee || 0);
                    const checked = selectedPaymentMethod === method.paymentMethod;
                    return (
                      <button
                        key={method.paymentMethod}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.paymentMethod)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition ${
                          checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
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
                            {Number.isFinite(feeNum) && feeNum > 0 && (
                              <div className="text-xs text-gray-500">
                                {text.fee}: {formatCurrency(feeNum, false, locale)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`h-4 w-4 rounded-full border ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`} />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {text.close}
                </button>
                <button
                  onClick={startPayment}
                  disabled={!selectedPaymentMethod || creatingPayment}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {creatingPayment ? text.redirecting : text.continuePay}
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-gray-500">{text.poweredBy}</footer>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
