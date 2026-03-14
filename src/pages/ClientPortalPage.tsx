import React from 'react';
import { useParams } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';
import type { InvoiceData } from '@/types/document';
import { exportInvoiceToPDF, formatCurrency, formatDate } from '@/lib/documentUtils';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';

interface DocumentRow {
  id: string;
  title: string;
  document_type: string;
  content: InvoiceData;
  settings?: Record<string, unknown> | null;
  status: string;
  created_at: string;
}

type PortalResponse = {
  client: { id: string; client_name: string };
  documents: DocumentRow[];
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
    loadFailed: 'Failed to load client portal.',
    downloadFailed: 'Failed to download PDF.',
    poweredBy: 'Powered by idCashier Invoice Generator',
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
    loadFailed: 'Gagal memuat portal klien.',
    downloadFailed: 'Gagal mengunduh PDF.',
    poweredBy: 'Disediakan oleh idCashier Invoice Generator',
  },
} as const;

export default function ClientPortalPage() {
  const { accessToken = '' } = useParams<{ accessToken: string }>();
  const { locale } = useI18n();
  const text = copy[locale];
  const [loading, setLoading] = React.useState(true);
  const [clientName, setClientName] = React.useState('');
  const [documents, setDocuments] = React.useState<DocumentRow[]>([]);

  const fetchPortal = React.useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const portalData = await invokeEdgeFunction<PortalResponse>('client-portal-data', { accessToken });
      setClientName(portalData.client.client_name);
      setDocuments((portalData.documents || []).filter((doc) => doc.document_type === 'invoice'));
    } catch (error: any) {
      console.error('Failed to fetch portal:', error);
      toast.error(text.loadFailed, {
        description: error?.message || String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, text.loadFailed]);

  React.useEffect(() => {
    void fetchPortal();
  }, [fetchPortal]);

  const handleDownload = async (doc: DocumentRow) => {
    try {
      const rawSettings =
        doc.settings && typeof doc.settings === 'object' && !Array.isArray(doc.settings)
          ? (doc.settings as Record<string, any>)
          : {};
      const settings = {
        ...rawSettings,
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
          ...(rawSettings.visibleFields || {}),
        },
      };

      await exportInvoiceToPDF(doc.content, settings, 'pro', locale);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error(text.downloadFailed);
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
              onClick={() => void fetchPortal()}
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
                          <button
                            onClick={() => void handleDownload(doc)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            title={text.download}
                          >
                            <FileDown className="h-4 w-4" />
                            <span>{text.download}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">{text.poweredBy}</footer>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
