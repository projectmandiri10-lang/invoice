import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import InvoicePreview from '@/components/InvoicePreview';
import SuratJalanPreview from '@/components/SuratJalanPreview';
import KwitansiPreview from '@/components/KwitansiPreview';
import { Document, InvoiceData, SuratJalanData, KwitansiData } from '@/types/document';
import { exportInvoiceToPDF, exportSuratJalanToPDF, exportKwitansiToPDF } from '@/lib/documentUtils';
import { consumePdfExportQuota } from '@/lib/pdfExportQuota';
import { FileDown, Printer, ArrowLeft } from 'lucide-react';

export default function ViewDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { user, effectivePlan } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const userTier = effectivePlan;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadDocument();
  }, [id, user, navigate]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        alert('Dokumen tidak ditemukan');
        navigate('/my-documents');
        return;
      }

      setDocument(data);
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Gagal memuat dokumen');
      navigate('/my-documents');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!document) return;

    try {
      const quota = await consumePdfExportQuota(user, userTier);
      if (!quota.allowed) {
        alert('Batas export PDF untuk paket Free sudah tercapai (maks. 5x). Silakan upgrade ke Starter untuk unlimited.');
        return;
      }

      switch (document.document_type) {
        case 'invoice':
          await exportInvoiceToPDF(document.content as InvoiceData, document.settings, userTier);
          break;
        case 'surat_jalan':
          await exportSuratJalanToPDF(document.content as SuratJalanData, document.settings, userTier);
          break;
        case 'kwitansi':
          await exportKwitansiToPDF(document.content as KwitansiData, document.settings, userTier);
          break;
        default:
          throw new Error('Invalid document type');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal export PDF');
    }
  };

  const handlePrint = () => {
    if (!document) return;

    try {
      window.print();
    } catch (error) {
      console.error('Error printing:', error);
      alert('Gagal print dokumen');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Memuat dokumen...</div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/my-documents')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Dokumen Saya</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileDown className="h-5 w-5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{document.title}</h1>

          <div className="bg-gray-100 p-4 rounded">
            {document.document_type === 'invoice' && (
              <InvoicePreview data={document.content as InvoiceData} settings={document.settings as any} />
            )}
            {document.document_type === 'surat_jalan' && (
              <SuratJalanPreview data={document.content as SuratJalanData} settings={document.settings as any} />
            )}
            {document.document_type === 'kwitansi' && (
              <KwitansiPreview data={document.content as KwitansiData} settings={document.settings as any} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
