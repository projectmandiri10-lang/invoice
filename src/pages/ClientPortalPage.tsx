import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CreditCard, FileDown, Loader2, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { InvoiceData } from '@/types/document';
import { exportInvoiceToPDF, formatCurrency, formatDate } from '@/lib/documentUtils';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

interface Client {
  client_name: string;
}

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
  reused?: boolean;
};

export default function ClientPortalPage() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [searchParams] = useSearchParams();

  const [client, setClient] = React.useState<Client | null>(null);
  const [documents, setDocuments] = React.useState<DocumentRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPortal = React.useCallback(async () => {
    if (!accessToken) {
      setError('Token akses tidak valid.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const portalData = await invokeEdgeFunction<PortalResponse>('client-portal-data', { accessToken });
      setClient({ client_name: portalData.client.client_name });
      setDocuments(portalData.documents || []);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data portal.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    fetchPortal();
  }, [fetchPortal]);

  // After returning from Duitku (returnUrl), verify status and refresh portal data
  const paidOrderId = searchParams.get('paidOrderId') || '';
  React.useEffect(() => {
    if (!accessToken || !paidOrderId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await invokeEdgeFunction<{ status: string }>('invoice-status', {
          accessToken,
          merchantOrderId: paidOrderId,
        });

        if (cancelled) return;
        if (res.status === 'paid') {
          toast.success('Pembayaran berhasil', { description: 'Invoice sudah ditandai lunas.' });
        } else if (res.status === 'failed' || res.status === 'expired') {
          toast.error('Pembayaran belum berhasil', { description: 'Silakan coba lagi atau pilih metode lain.' });
        } else {
          toast.info('Pembayaran sedang diproses', { description: 'Silakan tunggu beberapa saat.' });
        }
      } catch (err: any) {
        if (!cancelled) {
          toast.error('Gagal memeriksa status pembayaran', { description: err?.message || String(err) });
        }
      } finally {
        if (!cancelled) {
          fetchPortal().catch(() => {});
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, paidOrderId, fetchPortal]);

  const handleDownload = async (doc: DocumentRow) => {
    try {
      const settings =
        doc.settings ||
        ({
          colorScheme: { primary: '#2563eb', secondary: '#059669', accent: '#9333ea' },
          font: { family: 'Arial', size: 14 },
          layout: { margin: 20, spacing: 16, alignment: 'left' },
          visibleFields: {
            logo: true,
            companyNPWP: true,
            dueDate: true,
            notes: true,
            paymentInfo: true,
            showPrice: true,
            showDecimals: true,
            paymentGateway: false,
          },
        } as any);

      await exportInvoiceToPDF(doc.content, settings, 'pro');
    } catch (err) {
      console.error('Failed to download PDF:', err);
      toast.error('Gagal mengunduh PDF.');
    }
  };

  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentDoc, setPaymentDoc] = React.useState<DocumentRow | null>(null);
  const [methodsLoading, setMethodsLoading] = React.useState(false);
  const [methods, setMethods] = React.useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = React.useState<string>('');
  const [creatingPayment, setCreatingPayment] = React.useState(false);

  const openPayment = async (doc: DocumentRow) => {
    if (!accessToken) return;
    setPaymentDoc(doc);
    setPaymentOpen(true);
    setMethods([]);
    setSelectedMethod('');
    setCreatingPayment(false);
    setMethodsLoading(true);

    try {
      const res = await invokeEdgeFunction<InvoicePaymentMethodsResponse>('invoice-payment-methods', {
        accessToken,
        documentId: doc.id,
      });
      setMethods(res.methods || []);
    } catch (err: any) {
      toast.error('Gagal memuat metode pembayaran', { description: err?.message || String(err) });
      setPaymentOpen(false);
      setPaymentDoc(null);
    } finally {
      setMethodsLoading(false);
    }
  };

  const startPayment = async () => {
    if (!accessToken || !paymentDoc || !selectedMethod) return;
    setCreatingPayment(true);
    try {
      const res = await invokeEdgeFunction<InvoiceCreateTxResponse>('invoice-create-transaction', {
        accessToken,
        documentId: paymentDoc.id,
        paymentMethod: selectedMethod,
      });
      window.location.href = res.paymentUrl;
    } catch (err: any) {
      toast.error('Gagal membuat transaksi', { description: err?.message || String(err) });
      setCreatingPayment(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat Portal...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Portal Klien</h1>
          <p className="text-xl text-gray-600">Selamat datang, {client?.client_name}</p>
        </header>

        <main className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Riwayat Invoice Anda</h2>
            <button
              onClick={() => fetchPortal()}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>

          {documents.length === 0 ? (
            <p className="text-gray-600">Belum ada invoice untuk klien ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">No. Invoice</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const paymentEnabled = Boolean((doc.settings as any)?.visibleFields?.paymentGateway);
                    const paid = String(doc.status || '').toLowerCase() === 'paid';
                    return (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{doc.content.invoiceNumber}</td>
                        <td className="p-4">{formatDate(doc.content.invoiceDate)}</td>
                        <td className="p-4">{formatCurrency(doc.content.total)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {paid ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </td>
                        <td className="p-4 flex space-x-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Unduh PDF"
                          >
                            <FileDown />
                          </button>
                          {!paid && paymentEnabled && (
                            <button
                              onClick={() => openPayment(doc)}
                              className="text-green-600 hover:text-green-800"
                              title="Bayar Sekarang"
                            >
                              <CreditCard />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {paymentOpen && paymentDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Bayar Invoice</h2>
                  <p className="text-sm text-gray-600">{paymentDoc.content.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => {
                    setPaymentOpen(false);
                    setPaymentDoc(null);
                  }}
                  className="rounded p-2 hover:bg-gray-100"
                  aria-label="Tutup"
                  disabled={creatingPayment}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5">
                {methodsLoading ? (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memuat metode pembayaran...</span>
                  </div>
                ) : methods.length === 0 ? (
                  <p className="text-sm text-gray-600">Metode pembayaran tidak tersedia.</p>
                ) : (
                  <div className="max-h-64 overflow-auto rounded-lg border border-gray-200">
                    {methods.map((m) => {
                      const feeNum = m.totalFee != null ? Number(m.totalFee) : NaN;
                      return (
                        <label
                          key={m.paymentMethod}
                          className="flex cursor-pointer items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="portalPaymentMethod"
                              checked={selectedMethod === m.paymentMethod}
                              onChange={() => setSelectedMethod(m.paymentMethod)}
                              disabled={creatingPayment}
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{m.paymentName}</div>
                              {m.totalFee ? (
                                <div className="text-xs text-gray-500">
                                  Biaya: Rp {Number.isFinite(feeNum) ? feeNum.toLocaleString('id-ID') : m.totalFee}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          {m.paymentImage ? <img src={m.paymentImage} alt={m.paymentName} className="h-8 w-auto" /> : null}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
                <button
                  onClick={() => {
                    setPaymentOpen(false);
                    setPaymentDoc(null);
                  }}
                  className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={creatingPayment}
                >
                  Batal
                </button>
                <button
                  onClick={startPayment}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                  disabled={!selectedMethod || creatingPayment || methodsLoading}
                >
                  {creatingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>{creatingPayment ? 'Mengalihkan...' : 'Lanjut Bayar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-8 text-gray-500 text-sm">Disediakan oleh idCashier Invoice Generator</footer>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
