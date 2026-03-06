import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import SettingsPanel, { defaultSettings, DocumentSettings } from '@/components/SettingsPanel';
import { InvoiceData, SuratJalanData, KwitansiData, DocumentType } from '@/types/document';
import { dummyInvoiceData, dummySuratJalanData, dummyKwitansiData } from '@/lib/dummyData';
import { exportInvoiceToPDF, exportSuratJalanToPDF, exportKwitansiToPDF } from '@/lib/documentUtils';
import { consumePdfExportQuota } from '@/lib/pdfExportQuota';
import { FileDown, Save, FileText, Truck, Receipt, Check, AlertCircle, WifiOff, Repeat } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import HilltopAds from '@/components/HilltopAds';

// Lazy load editable preview components for better performance
const EditableInvoicePreview = lazy(() => import('@/components/EditableInvoicePreview'));
const EditableSuratJalanPreview = lazy(() => import('@/components/EditableSuratJalanPreview'));
const EditableKwitansiPreview = lazy(() => import('@/components/EditableKwitansiPreview'));
const RecurringInvoiceModal = lazy(() => import('@/components/RecurringInvoiceModal'));

export default function HomePage() {
  const { user, effectivePlan } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DocumentType>('invoice');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [suratJalanData, setSuratJalanData] = useState<SuratJalanData | null>(null);
  const [kwitansiData, setKwitansiData] = useState<KwitansiData | null>(null);
  const [settings, setSettings] = useState<DocumentSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const hasShownTemplateLoadErrorRef = useRef(false);

  const normalizeSettings = (incoming: Partial<DocumentSettings> | undefined | null): DocumentSettings => {
    if (!incoming) return defaultSettings;
    return {
      ...defaultSettings,
      ...incoming,
      colorScheme: {
        ...defaultSettings.colorScheme,
        ...(incoming as any).colorScheme,
      },
      font: {
        ...defaultSettings.font,
        ...(incoming as any).font,
      },
      layout: {
        ...defaultSettings.layout,
        ...(incoming as any).layout,
      },
      visibleFields: {
        ...defaultSettings.visibleFields,
        ...(incoming as any).visibleFields,
      },
    };
  };

  const userTier = effectivePlan;

  useEffect(() => {
    const docToLoad = location.state?.documentToLoad;
    if (docToLoad) {
      const { document_type, content, settings } = docToLoad;
      setActiveTab(document_type);
      setSettings(normalizeSettings(settings));
      
      if (document_type === 'invoice') {
        setInvoiceData(content as InvoiceData);
      } else if (document_type === 'surat_jalan') {
        setSuratJalanData(content as SuratJalanData);
      } else if (document_type === 'kwitansi') {
        setKwitansiData(content as KwitansiData);
      }
      setLoading(false);
    } else {
      loadTemplates();
    }
  }, [location.state]);

  // Auto-save functionality with debounce and error handling
  const autoSave = useCallback(async () => {
    if (!user) return;

    setAutoSaving(true);
    setSaveError(false);

    try {
      let content;
      let title;
      let clientId: string | null = null;

      if (activeTab === 'invoice' && invoiceData) {
        content = invoiceData;
        title = `Invoice ${invoiceData.invoiceNumber}`;

        const clientName = invoiceData.clientName?.trim();
        if (clientName) {
          const { data: clientRow, error: clientUpsertError } = await supabase
            .from('clients')
            .upsert({ user_id: user.id, client_name: clientName }, { onConflict: 'user_id,client_name' })
            .select('id')
            .maybeSingle();

          if (clientUpsertError) throw clientUpsertError;
          clientId = clientRow?.id || null;
        }
      } else if (activeTab === 'surat_jalan' && suratJalanData) {
        content = suratJalanData;
        title = `Surat Jalan ${suratJalanData.suratJalanNumber}`;
      } else if (activeTab === 'kwitansi' && kwitansiData) {
        content = kwitansiData;
        title = `Kwitansi ${kwitansiData.kwitansiNumber}`;
      } else {
        return;
      }

      // Check if document with this title exists
      const { data: existing, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', title)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        // Update existing
        const updatePayload: Record<string, unknown> = {
          content,
          settings,
          updated_at: new Date().toISOString(),
        };
        if (activeTab === 'invoice') {
          updatePayload.client_id = clientId;
        }
        const { error: updateError } = await supabase
          .from('documents')
          .update(updatePayload)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const insertPayload: Record<string, unknown> = {
          user_id: user.id,
          title,
          document_type: activeTab,
          content,
          settings,
        };
        if (activeTab === 'invoice') {
          insertPayload.client_id = clientId;
        }
        const { error: insertError } = await supabase
          .from('documents')
          .insert(insertPayload);

        if (insertError) throw insertError;
      }

      // Success
      setLastSaveTime(new Date());
      setSaveError(false);
    } catch (error: any) {
      console.error('Auto-save error:', error);
      setSaveError(true);
      
      if (!navigator.onLine) {
        toast.error('Tidak dapat menyimpan - Anda sedang offline', {
          description: 'Perubahan akan disimpan otomatis setelah koneksi kembali',
          icon: <WifiOff className="h-4 w-4" />,
          duration: 5000,
        });
      } else {
        toast.error('Gagal menyimpan otomatis', {
          description: error.message || 'Terjadi kesalahan saat menyimpan. Silakan coba simpan manual.',
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
      }
    } finally {
      setAutoSaving(false);
        }
  }, [user, activeTab, invoiceData, suratJalanData, kwitansiData, settings]);

  const handleLogoChange = (logoUrl: string) => {
    setSettings(prev => ({
      ...prev,
      logoUrl
    }));
  };

  useEffect(() => {
    if (!user) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [invoiceData, suratJalanData, kwitansiData, settings, user, autoSave]);

  const handleSaveRecurring = async (settings: any) => {
    if (!user || !invoiceData) {
      toast.error('Gagal menyimpan jadwal', {
        description: 'Pastikan Anda masuk dan invoice sudah lengkap.',
      });
      return;
    }

    try {
      // Create a template for the recurring invoice
      const templateData = { ...invoiceData };
      // Reset fields that should be generated new for each instance
      templateData.invoiceNumber = ''; // Will be generated by the backend function
      templateData.invoiceDate = ''; // Will be set on generation date
      templateData.dueDate = ''; // Will be calculated based on generation date

      const { error } = await supabase.from('recurring_invoices').insert({
        user_id: user.id,
        source_invoice_data: templateData,
        recurring_settings: settings,
        status: 'active',
        next_generation_date: settings.startDate,
      });

      if (error) throw error;

      toast.success('Invoice berulang berhasil dijadwalkan!');
    } catch (err: any) {
      console.error('Error saving recurring invoice:', err);
      toast.error('Gagal menyimpan jadwal berulang.', {
        description: err.message,
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_default', true);

      if (error) throw error;

      let loadedInvoice: InvoiceData | null = null;
      let loadedSuratJalan: SuratJalanData | null = null;
      let loadedKwitansi: KwitansiData | null = null;

      data?.forEach((template) => {
        if (template.document_type === 'invoice') {
          loadedInvoice = template.template_data as InvoiceData;
        } else if (template.document_type === 'surat_jalan') {
          const suratJalanTemplate = template.template_data as SuratJalanData;
          loadedSuratJalan = {
            ...suratJalanTemplate,
            companyPhone: '',
            items: suratJalanTemplate.items.map((item) => ({
              ...item,
              description: '',
            })),
            deliveryInfo: '',
            notes: '',
            senderName: '',
            recipientName: '',
            senderSignatureName: '',
            recipientSignatureName: '',
          };
        } else if (template.document_type === 'kwitansi') {
          const kwitansiTemplate = template.template_data as KwitansiData;
          loadedKwitansi = {
            ...kwitansiTemplate,
            amountInWords: '',
            description: '',
          };
        }
      });

      setInvoiceData(loadedInvoice ?? dummyInvoiceData);
      setSuratJalanData(loadedSuratJalan ?? dummySuratJalanData);
      setKwitansiData(loadedKwitansi ?? dummyKwitansiData);
    } catch (error) {
      console.error('Error loading templates:', error);
      setInvoiceData(dummyInvoiceData);
      setSuratJalanData(dummySuratJalanData);
      setKwitansiData(dummyKwitansiData);

      if (!hasShownTemplateLoadErrorRef.current) {
        hasShownTemplateLoadErrorRef.current = true;
        toast.warning('Gagal memuat template dari Supabase.', {
          description:
            'Menggunakan template lokal. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkDocumentLimit = async (): Promise<boolean> => {
    if (!user || userTier !== 'free') {
      return true; // No limit for paid users or logged out users
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { count, error } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', oneMonthAgo.toISOString());

    if (error) {
      console.error('Error fetching document count:', error);
      toast.error('Gagal memeriksa batas dokumen.');
      return false;
    }










        const isIndonesia = navigator.language.startsWith('id');
    const starterPrice = isIndonesia ? 'Rp 100.000/bulan' : '$5/month';

    if (count !== null && count >= 5) {
      toast.error(
        isIndonesia ? 'Batas 5 Dokumen Gratis Tercapai' : 'Free Document Limit Reached', 
        {
          description: isIndonesia 
            ? `Upgrade ke Starter (${starterPrice}) untuk dokumen tak terbatas.`
            : `Upgrade to Starter (${starterPrice}) for unlimited documents.`,
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/billing', { state: { planCode: 'starter_month' } }),
          },
        }
      );
      return false;
    }

        return true;
  };

  const checkClientLimit = async (clientName: string): Promise<boolean> => {
    if (!user || !clientName) return true;

    const normalizedClientName = clientName.trim();
    if (!normalizedClientName) return true;

    if (userTier === 'pro') return true;

    const limit = userTier === 'starter' ? 25 : 3;

    // Check if client already exists
    const { data: existingClient, error: fetchClientError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .eq('client_name', normalizedClientName)
      .maybeSingle();

    if (fetchClientError) {
      console.error('Error fetching client:', fetchClientError);
      toast.error('Gagal memeriksa data klien.');
      return false; // Fail safe
    }

    if (existingClient) {
      return true; // Existing client doesn't count towards limit
    }

    // Check current client count
    const { count, error: countError } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error fetching client count:', countError);
      toast.error('Gagal memeriksa jumlah klien.');
      return false; // Fail safe
    }










    const isIndonesia = navigator.language.startsWith('id');
    const starterPrice = isIndonesia ? 'Rp 100.000/bulan' : '$5/month';
    const proPrice = isIndonesia ? 'Rp 150.000/bulan' : '$15/month';

    if (count !== null && count >= limit) {
      if (userTier === 'starter') {
        toast.error(isIndonesia ? 'Batas 25 Klien Starter Tercapai' : 'Starter Client Limit Reached', {
          description: isIndonesia
            ? `Upgrade ke Pro (${proPrice}) untuk klien tak terbatas dan manajemen klien.`
            : `Upgrade to Pro (${proPrice}) for unlimited clients and client management.`,
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/billing', { state: { planCode: 'pro_month' } }),
          },
        });
      } else {
        toast.error(isIndonesia ? 'Batas 3 Klien Gratis Tercapai' : 'Free Client Limit Reached', {
          description: isIndonesia
            ? `Upgrade ke Starter (${starterPrice}) untuk hingga 25 klien.`
            : `Upgrade to Starter (${starterPrice}) for up to 25 clients.`,
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/billing', { state: { planCode: 'starter_month' } }),
          },
        });
      }
      return false;
    }

    return true;
  };


    const handleSave = async () => {
    if (!user) {
      toast.error('Login diperlukan', {
        description: 'Anda harus login untuk menyimpan dokumen',
      });
      return;
    }

    setSaving(true);
    setSaveMessage('');

    try {
      let content;
      let title;
      let clientName: string | undefined;
      let clientId: string | null = null;

      if (activeTab === 'invoice' && invoiceData) {
        content = invoiceData;
        title = `Invoice ${invoiceData.invoiceNumber}`;
        clientName = invoiceData.clientName;
      } else if (activeTab === 'surat_jalan' && suratJalanData) {
        content = suratJalanData;
        title = `Surat Jalan ${suratJalanData.suratJalanNumber}`;
        clientName = suratJalanData.recipientName;
      } else if (activeTab === 'kwitansi' && kwitansiData) {
        content = kwitansiData;
        title = `Kwitansi ${kwitansiData.kwitansiNumber}`;
        clientName = kwitansiData.receivedFrom;
      } else {
        throw new Error('No data to save');
      }
      
      if (!navigator.onLine) {
        throw new Error('OFFLINE');
      }

      const { data: existing, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', title)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      // Only check limits for brand new documents
      if (!existing) {
        const canSave = await checkDocumentLimit();
        if (!canSave) {
          setSaving(false);
          return;
        }
        if (activeTab === 'invoice' && clientName) {
          const canAddClient = await checkClientLimit(clientName);
          if (!canAddClient) {
            setSaving(false);
            return;
          }
        }
      }

      if (activeTab === 'invoice') {
        const normalizedClientName = clientName?.trim();
        if (normalizedClientName) {
          const { data: clientRow, error: clientUpsertError } = await supabase
            .from('clients')
            .upsert({ user_id: user.id, client_name: normalizedClientName }, { onConflict: 'user_id,client_name' })
            .select('id')
            .maybeSingle();

          if (clientUpsertError) throw clientUpsertError;
          clientId = clientRow?.id || null;
        }
      }

      if (existing) {
        const updatePayload: Record<string, unknown> = {
          content,
          settings,
          updated_at: new Date().toISOString(),
        };
        if (activeTab === 'invoice') {
          updatePayload.client_id = clientId;
        }
        const { error } = await supabase
          .from('documents')
          .update(updatePayload)
          .eq('id', existing.id);

        if (error) throw error;
        
        toast.success('Dokumen berhasil diperbarui!', {
          description: `${title} telah diperbarui`,
        });
        setSaveMessage('Dokumen berhasil diperbarui!');
      } else {
        const insertPayload: Record<string, unknown> = {
          user_id: user.id,
          title,
          document_type: activeTab,
          content,
          settings,
        };
        if (activeTab === 'invoice') {
          insertPayload.client_id = clientId;
        }
        const { error } = await supabase
          .from('documents')
          .insert(insertPayload);

        if (error) throw error;

        toast.success('Dokumen berhasil disimpan!', {
          description: `${title} telah disimpan`,
        });
        setSaveMessage('Dokumen berhasil disimpan!');
      }

      setLastSaveTime(new Date());
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving document:', error);
      
      if (error.message === 'OFFLINE') {
        toast.error('Tidak dapat menyimpan - Anda sedang offline', {
          description: 'Periksa koneksi internet Anda dan coba lagi',
          icon: <WifiOff className="h-4 w-4" />,
        });
      } else {
        toast.error('Gagal menyimpan dokumen', {
          description: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const quota = await consumePdfExportQuota(user, userTier);
      if (!quota.allowed) {
        const isAnonymous = !user;
        toast.error('Batas Export PDF (5x) Tercapai', {
          description: isAnonymous
            ? 'Maksimal 5 kali export PDF untuk pengguna tanpa akun. Silakan login & upgrade ke Starter untuk unlimited.'
            : 'Maksimal 5 kali export PDF untuk paket Free. Upgrade ke Starter untuk unlimited.',
          action: isAnonymous
            ? {
                label: 'Login',
                onClick: () => navigate('/login'),
              }
            : {
                label: 'Upgrade',
                onClick: () => navigate('/billing', { state: { planCode: 'starter_month' } }),
              },
        });
        return;
      }

      switch (activeTab) {
        case 'invoice':
          if (invoiceData) {
            await exportInvoiceToPDF(invoiceData, settings, userTier);
          }
          break;
        case 'surat_jalan':
          if (suratJalanData) {
            await exportSuratJalanToPDF(suratJalanData, settings, userTier);
          }
          break;
        case 'kwitansi':
          if (kwitansiData) {
            await exportKwitansiToPDF(kwitansiData, settings, userTier);
          }
          break;
        default:
          throw new Error('Invalid document type');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Gagal export PDF', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.',
      });
    }
  };

  const handleDummyData = () => {
    switch (activeTab) {
      case 'invoice':
        setInvoiceData(dummyInvoiceData);
        break;
      case 'surat_jalan':
        setSuratJalanData(dummySuratJalanData);
        break;
      case 'kwitansi':
        setKwitansiData(dummyKwitansiData);
        break;
    }
    toast.success('Contoh data berhasil dimuat!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Memuat...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">idCashier Invoice Generator</h1>
            <p className="text-gray-600">Buat dan kelola dokumen bisnis Anda dengan mudah</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex items-center border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'invoice'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Invoice</span>
              </button>
              <button
                onClick={() => setActiveTab('surat_jalan')}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'surat_jalan'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Truck className="h-5 w-5" />
                <span>Surat Jalan</span>
              </button>
              <button
                onClick={() => setActiveTab('kwitansi')}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'kwitansi'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Receipt className="h-5 w-5" />
                <span>Kwitansi</span>
              </button>
              <button
                onClick={handleDummyData}
                className="ml-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Isi Contoh Data
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                {user && autoSaving && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Menyimpan otomatis...</span>
                  </div>
                )}
                {user && !autoSaving && !saveError && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">
                      Tersimpan
                      {lastSaveTime && (
                        <span className="text-gray-500 ml-1">
                          • {new Date(lastSaveTime).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {user && !autoSaving && saveError && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Gagal menyimpan - klik tombol Simpan untuk coba lagi</span>
                  </div>
                )}
              </div>
            </div>

            {saveMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {saveMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="overflow-y-auto max-h-[800px] bg-gray-100 p-4 rounded">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-gray-600">Memuat preview...</p>
                      </div>
                    </div>
                  }>
                    {activeTab === 'invoice' && invoiceData && (
                    <EditableInvoicePreview 
                      data={invoiceData} 
                      onChange={setInvoiceData} 
                      settings={settings} 
                      onSettingsChange={setSettings}
                      userTier={userTier}
                      userId={user?.id}
                    />
                  )}
                  {activeTab === 'surat_jalan' && suratJalanData && (
                    <EditableSuratJalanPreview 
                      data={suratJalanData} 
                      onChange={setSuratJalanData} 
                      settings={settings} 
                      onSettingsChange={setSettings}
                      userTier={userTier}
                    />
                  )}
                  {activeTab === 'kwitansi' && kwitansiData && (
                    <EditableKwitansiPreview 
                      data={kwitansiData} 
                      onChange={setKwitansiData} 
                      settings={settings} 
                      onSettingsChange={setSettings}
                      userTier={userTier}
                    />
                  )}
                  </Suspense>
                </div>

                {!user && (
                  <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-6 text-center shadow-lg">
                    <p className="text-2xl font-extrabold tracking-tight text-amber-900">
                      Simpan Dokumen Anda!
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-800">
                      <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-amber-950">
                        Masuk
                      </Link>{' '}
                      atau{' '}
                      <Link to="/register" className="font-bold underline decoration-2 underline-offset-4 hover:text-amber-950">
                        daftar
                      </Link>{' '}
                      untuk menyimpan pekerjaan Anda dan mengaksesnya nanti.
                    </p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1 overflow-y-auto max-h-[800px]">
                <SettingsPanel
                  documentType={activeTab}
                  settings={settings}
                  onChange={setSettings}
                  effectivePlan={userTier}
                  onRequestUpgradePro={() => {
                    toast.info('Fitur Pro', {
                      description: 'Tombol bayar invoice tersedia di paket Pro.',
                      action: {
                        label: 'Upgrade',
                        onClick: () => navigate('/billing', { state: { planCode: 'pro_month' } }),
                      },
                    });
                  }}
                />
              </div>
            </div>

            {userTier === 'free' && (
              <div className="mt-6">
                <div className="bg-gray-200 rounded-lg p-4 text-center">
                  <p className="font-semibold text-gray-700 mb-2">Iklan</p>
                  <HilltopAds className="flex justify-center" />
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileDown className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
              {user && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Dokumen'}</span>
                </button>
              )}
              {user && activeTab === 'invoice' && userTier === 'pro' && (
                <button
                  onClick={() => setIsRecurringModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Repeat className="h-5 w-5" />
                  <span>Atur Berulang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 4000,
                }}
      />
      <Suspense>
        {isRecurringModalOpen && (
          <RecurringInvoiceModal
            isOpen={isRecurringModalOpen}
            onClose={() => setIsRecurringModalOpen(false)}
            onSave={handleSaveRecurring}
          />
        )}
      </Suspense>
    </>
  );
}
