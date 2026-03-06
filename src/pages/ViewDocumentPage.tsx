import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileDown, Printer } from 'lucide-react';
import Navbar from '@/components/Navbar';
import InvoicePreview from '@/components/InvoicePreview';
import SuratJalanPreview from '@/components/SuratJalanPreview';
import KwitansiPreview from '@/components/KwitansiPreview';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { localizeInvoiceData, localizeKwitansiData, localizeSuratJalanData } from '@/lib/dummyData';
import { supabase } from '@/lib/supabase';
import { consumePdfExportQuota } from '@/lib/pdfExportQuota';
import { exportInvoiceToPDF, exportKwitansiToPDF, exportSuratJalanToPDF } from '@/lib/documentUtils';
import { Document, InvoiceData, KwitansiData, SuratJalanData } from '@/types/document';

const copy = {
  en: {
    loading: 'Loading document...',
    notFound: 'Document not found',
    loadFailed: 'Failed to load document',
    exportLimit: 'Free PDF export limit reached (max. 5). Upgrade to Starter for unlimited exports.',
    exportFailed: 'Failed to export PDF',
    printFailed: 'Failed to print document',
    back: 'Back',
    export: 'Export PDF',
    print: 'Print',
  },
  id: {
    loading: 'Memuat dokumen...',
    notFound: 'Dokumen tidak ditemukan',
    loadFailed: 'Gagal memuat dokumen',
    exportLimit: 'Batas export PDF untuk paket Free sudah tercapai (maks. 5x). Upgrade ke Starter untuk unlimited.',
    exportFailed: 'Gagal export PDF',
    printFailed: 'Gagal print dokumen',
    back: 'Kembali',
    export: 'Export PDF',
    print: 'Cetak',
  },
} as const;

export default function ViewDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { user, effectivePlan } = useAuth();
  const { locale } = useI18n();
  const text = copy[locale];
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const loadDocument = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setDocument(data);
      } catch (error: any) {
        console.error('Error loading document:', error);
        alert(error?.code === 'PGRST116' ? text.notFound : text.loadFailed);
        navigate('/my-documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, user, navigate, text.notFound, text.loadFailed]);

  const handleExport = async () => {
    if (!document) return;

    try {
      const quota = await consumePdfExportQuota(user, effectivePlan);
      if (!quota.allowed) {
        alert(text.exportLimit);
        return;
      }

      const localizedContent =
        document.document_type === 'invoice'
          ? localizeInvoiceData(document.content as InvoiceData, locale)
          : document.document_type === 'surat_jalan'
            ? localizeSuratJalanData(document.content as SuratJalanData, locale)
            : localizeKwitansiData(document.content as KwitansiData, locale);

      if (document.document_type === 'invoice') {
        await exportInvoiceToPDF(localizedContent as InvoiceData, document.settings, effectivePlan, locale);
      } else if (document.document_type === 'surat_jalan') {
        await exportSuratJalanToPDF(localizedContent as SuratJalanData, document.settings, effectivePlan, locale);
      } else if (document.document_type === 'kwitansi') {
        await exportKwitansiToPDF(localizedContent as KwitansiData, document.settings, effectivePlan, locale);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(text.exportFailed);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      console.error('Error printing document:', error);
      alert(text.printFailed);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-xl text-gray-600">{text.loading}</div>
        </div>
      </div>
    );
  }

  if (!document) return null;

  const localizedContent =
    document.document_type === 'invoice'
      ? localizeInvoiceData(document.content as InvoiceData, locale)
      : document.document_type === 'surat_jalan'
        ? localizeSuratJalanData(document.content as SuratJalanData, locale)
        : localizeKwitansiData(document.content as KwitansiData, locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate('/my-documents')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{text.back}</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <FileDown className="h-4 w-4" />
              <span>{text.export}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              <Printer className="h-4 w-4" />
              <span>{text.print}</span>
            </button>
          </div>
        </div>

        {document.document_type === 'invoice' && (
          <InvoicePreview data={localizedContent as InvoiceData} settings={document.settings} />
        )}
        {document.document_type === 'surat_jalan' && (
          <SuratJalanPreview data={localizedContent as SuratJalanData} settings={document.settings} />
        )}
        {document.document_type === 'kwitansi' && (
          <KwitansiPreview data={localizedContent as KwitansiData} settings={document.settings} />
        )}
      </div>
    </div>
  );
}
