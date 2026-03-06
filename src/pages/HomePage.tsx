import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import SettingsPanel, { defaultSettings, DocumentSettings } from '@/components/SettingsPanel';
import { InvoiceData, SuratJalanData, KwitansiData, DocumentType } from '@/types/document';
import { dummyInvoiceData, dummySuratJalanData, dummyKwitansiData } from '@/lib/dummyData';
import { exportInvoiceToPDF, exportSuratJalanToPDF, exportKwitansiToPDF } from '@/lib/documentUtils';
import { consumePdfExportQuota } from '@/lib/pdfExportQuota';
import {
  CLIENT_LIMITS,
  DOCUMENT_LIMITS,
  formatCurrency,
  getDocumentTypeLabel,
  getLocaleTag,
  type Locale,
} from '@/lib/i18n';
import { FileDown, Save, FileText, Truck, Receipt, Check, AlertCircle, WifiOff, Repeat } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import HilltopAds from '@/components/HilltopAds';

// Lazy load editable preview components for better performance
const EditableInvoicePreview = lazy(() => import('@/components/EditableInvoicePreview'));
const EditableSuratJalanPreview = lazy(() => import('@/components/EditableSuratJalanPreview'));
const EditableKwitansiPreview = lazy(() => import('@/components/EditableKwitansiPreview'));
const RecurringInvoiceModal = lazy(() => import('@/components/RecurringInvoiceModal'));

const copy = {
  en: {
    recurringSaved: 'Recurring invoice scheduled successfully.',
    recurringSaveFailed: 'Failed to save recurring schedule.',
    recurringSaveFailedTitle: 'Failed to save schedule',
    templateFailed: 'Failed to load templates from Supabase.',
    templateFallback:
      'Using local templates. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.',
    documentLimitFreeTitle: 'Free document limit reached',
    documentLimitFreeDescription: 'Upgrade to Starter for up to 100 saved documents.',
    documentLimitStarterTitle: 'Starter document limit reached',
    documentLimitStarterDescription: 'Upgrade to Pro for unlimited saved documents.',
    clientCheckFailed: 'Failed to check client data.',
    clientCountFailed: 'Failed to check client count.',
    clientLimitStarterTitle: 'Starter client limit reached',
    clientLimitStarterDescription: 'Upgrade to Pro for unlimited clients and client management.',
    clientLimitFreeTitle: 'Free client limit reached',
    clientLimitFreeDescription: 'Upgrade to Starter for up to 25 clients.',
    loginRequired: 'Sign in required',
    loginRequiredDescription: 'You must sign in to save documents.',
    saveUpdated: 'Document updated successfully.',
    saveUpdatedDescription: (title: string) => `${title} has been updated.`,
    saveSaved: 'Document saved successfully.',
    saveSavedDescription: (title: string) => `${title} has been saved.`,
    offlineSaveTitle: 'Cannot save while offline',
    offlineSaveDescription: 'Check your connection and try again.',
    autosaveOfflineDescription: 'Changes will be saved automatically when your connection returns.',
    autosaveFailed: 'Auto-save failed',
    saveFailed: 'Failed to save document',
    exportLimitTitle: 'PDF export limit reached',
    exportLimitAnonymous: 'You can export PDF up to 5 times without an account. Sign in and upgrade to Starter for unlimited exports.',
    exportLimitFree: 'Free plan can export PDF up to 5 times. Upgrade to Starter for unlimited exports.',
    exportFailed: 'Failed to export PDF',
    sampleLoaded: 'Sample data loaded successfully.',
    heading: 'idCashier Invoice Generator',
    subheading: 'Create and manage your business documents with ease',
    loadSample: 'Load Sample Data',
    autoSaving: 'Saving automatically...',
    saved: 'Saved',
    saveRetry: 'Save failed — click Save to try again',
    loadingPreview: 'Loading preview...',
    saveBannerTitle: 'Save your documents',
    saveBannerTextStart: 'Sign in',
    saveBannerTextMiddle: 'or',
    saveBannerTextAction: 'register',
    saveBannerTextEnd: 'to save your work and access it later.',
    proFeature: 'Pro feature',
    proFeatureDescription: 'Invoice payment button is available on the Pro plan.',
    upgrade: 'Upgrade',
    login: 'Sign in',
    exportPdf: 'Export PDF',
    saveDocument: 'Save Document',
    saving: 'Saving...',
    saveErrorMessage: 'No data to save',
  },
  id: {
    recurringSaved: 'Invoice berulang berhasil dijadwalkan.',
    recurringSaveFailed: 'Gagal menyimpan jadwal berulang.',
    recurringSaveFailedTitle: 'Gagal menyimpan jadwal',
    templateFailed: 'Gagal memuat template dari Supabase.',
    templateFallback:
      'Menggunakan template lokal. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local.',
    documentLimitFreeTitle: 'Batas dokumen Free tercapai',
    documentLimitFreeDescription: 'Upgrade ke Starter untuk hingga 100 dokumen tersimpan.',
    documentLimitStarterTitle: 'Batas dokumen Starter tercapai',
    documentLimitStarterDescription: 'Upgrade ke Pro untuk dokumen tersimpan tanpa batas.',
    clientCheckFailed: 'Gagal memeriksa data klien.',
    clientCountFailed: 'Gagal memeriksa jumlah klien.',
    clientLimitStarterTitle: 'Batas klien Starter tercapai',
    clientLimitStarterDescription: 'Upgrade ke Pro untuk klien tanpa batas dan manajemen klien.',
    clientLimitFreeTitle: 'Batas klien Free tercapai',
    clientLimitFreeDescription: 'Upgrade ke Starter untuk hingga 25 klien.',
    loginRequired: 'Login diperlukan',
    loginRequiredDescription: 'Anda harus login untuk menyimpan dokumen.',
    saveUpdated: 'Dokumen berhasil diperbarui.',
    saveUpdatedDescription: (title: string) => `${title} telah diperbarui.`,
    saveSaved: 'Dokumen berhasil disimpan.',
    saveSavedDescription: (title: string) => `${title} telah disimpan.`,
    offlineSaveTitle: 'Tidak dapat menyimpan saat offline',
    offlineSaveDescription: 'Periksa koneksi internet Anda dan coba lagi.',
    autosaveOfflineDescription: 'Perubahan akan disimpan otomatis setelah koneksi kembali.',
    autosaveFailed: 'Gagal menyimpan otomatis',
    saveFailed: 'Gagal menyimpan dokumen',
    exportLimitTitle: 'Batas export PDF tercapai',
    exportLimitAnonymous: 'Maksimal 5 kali export PDF untuk pengguna tanpa akun. Silakan login dan upgrade ke Starter untuk unlimited.',
    exportLimitFree: 'Paket Free maksimal 5 kali export PDF. Upgrade ke Starter untuk unlimited.',
    exportFailed: 'Gagal export PDF',
    sampleLoaded: 'Contoh data berhasil dimuat.',
    heading: 'idCashier Invoice Generator',
    subheading: 'Buat dan kelola dokumen bisnis Anda dengan mudah',
    loadSample: 'Isi Contoh Data',
    autoSaving: 'Menyimpan otomatis...',
    saved: 'Tersimpan',
    saveRetry: 'Gagal menyimpan — klik tombol Simpan untuk coba lagi',
    loadingPreview: 'Memuat preview...',
    saveBannerTitle: 'Simpan dokumen Anda',
    saveBannerTextStart: 'Masuk',
    saveBannerTextMiddle: 'atau',
    saveBannerTextAction: 'daftar',
    saveBannerTextEnd: 'untuk menyimpan pekerjaan Anda dan mengaksesnya nanti.',
    proFeature: 'Fitur Pro',
    proFeatureDescription: 'Tombol bayar invoice tersedia di paket Pro.',
    upgrade: 'Upgrade',
    login: 'Masuk',
    exportPdf: 'Export PDF',
    saveDocument: 'Simpan Dokumen',
    saving: 'Menyimpan...',
    saveErrorMessage: 'Tidak ada data untuk disimpan',
  },
} as const;

export default function HomePage() {
  const { user, effectivePlan } = useAuth();
  const { locale } = useI18n();
  const text = copy[locale];
  const localeTag = getLocaleTag(locale);
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
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<DocumentType | null>(null);
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

  const getDocumentTitle = useCallback(
    (documentType: DocumentType, content: InvoiceData | SuratJalanData | KwitansiData) => {
      if (documentType === 'invoice') {
        return `${getDocumentTypeLabel('invoice', locale)} ${(content as InvoiceData).invoiceNumber}`;
      }
      if (documentType === 'surat_jalan') {
        return `${getDocumentTypeLabel('surat_jalan', locale)} ${(content as SuratJalanData).suratJalanNumber}`;
      }
      return `${getDocumentTypeLabel('kwitansi', locale)} ${(content as KwitansiData).kwitansiNumber}`;
    },
    [locale]
  );
  const starterMonthlyPrice = `${formatCurrency(100000, false, locale)}${locale === 'id' ? '/bulan' : '/month'}`;
  const proMonthlyPrice = `${formatCurrency(150000, false, locale)}${locale === 'id' ? '/bulan' : '/month'}`;

  useEffect(() => {
    const docToLoad = location.state?.documentToLoad;
    if (docToLoad) {
      const { id, document_type, content, settings } = docToLoad;
      setCurrentDocumentId(id || null);
      setCurrentDocumentType(document_type);
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
      setCurrentDocumentId(null);
      setCurrentDocumentType(null);
      loadTemplates();
    }
  }, [location.state]);

  // Auto-save functionality with debounce and error handling
  const autoSave = useCallback(async () => {
    if (!user || !currentDocumentId || currentDocumentType !== activeTab) return;

    setAutoSaving(true);
    setSaveError(false);

    try {
      let content;
      let clientId: string | null = null;

      if (activeTab === 'invoice' && invoiceData) {
        content = invoiceData;

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
      } else if (activeTab === 'kwitansi' && kwitansiData) {
        content = kwitansiData;
      } else {
        return;
      }

      const updatePayload: Record<string, unknown> = {
        title: getDocumentTitle(activeTab, content as InvoiceData | SuratJalanData | KwitansiData),
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
        .eq('id', currentDocumentId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Success
      setLastSaveTime(new Date());
      setSaveError(false);
    } catch (error: any) {
      console.error('Auto-save error:', error);
      setSaveError(true);
      
      if (!navigator.onLine) {
        toast.error(text.offlineSaveTitle, {
          description: text.autosaveOfflineDescription,
          icon: <WifiOff className="h-4 w-4" />,
          duration: 5000,
        });
      } else {
        toast.error(text.autosaveFailed, {
          description: error.message || text.saveFailed,
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
      }
    } finally {
      setAutoSaving(false);
    }
  }, [
    user,
    currentDocumentId,
    currentDocumentType,
    activeTab,
    invoiceData,
    suratJalanData,
    kwitansiData,
    settings,
    getDocumentTitle,
    text.offlineSaveTitle,
    text.autosaveOfflineDescription,
    text.autosaveFailed,
    text.saveFailed,
  ]);

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
      toast.error(text.recurringSaveFailedTitle, {
        description: text.loginRequiredDescription,
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

      toast.success(text.recurringSaved);
    } catch (err: any) {
      console.error('Error saving recurring invoice:', err);
      toast.error(text.recurringSaveFailed, {
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
      setCurrentDocumentId(null);
      setCurrentDocumentType(null);
    } catch (error) {
      console.error('Error loading templates:', error);
      setInvoiceData(dummyInvoiceData);
      setSuratJalanData(dummySuratJalanData);
      setKwitansiData(dummyKwitansiData);
      setCurrentDocumentId(null);
      setCurrentDocumentType(null);

      if (!hasShownTemplateLoadErrorRef.current) {
        hasShownTemplateLoadErrorRef.current = true;
        toast.warning(text.templateFailed, {
          description: text.templateFallback,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkDocumentLimit = async (): Promise<boolean> => {
    if (!user) return true;
    const limit = DOCUMENT_LIMITS[userTier];
    if (limit === null) return true;

    const { count, error } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching document count:', error);
      toast.error(text.saveFailed);
      return false;
    }

    if (count !== null && count >= limit) {
      const isStarter = userTier === 'starter';
      toast.error(isStarter ? text.documentLimitStarterTitle : text.documentLimitFreeTitle, {
        description: isStarter
          ? `${text.documentLimitStarterDescription} (${proMonthlyPrice})`
          : `${text.documentLimitFreeDescription} (${starterMonthlyPrice})`,
        action: {
          label: text.upgrade,
          onClick: () => navigate('/billing', { state: { planCode: isStarter ? 'pro_month' : 'starter_month' } }),
        },
      });
      return false;
    }

    return true;
  };

  const checkClientLimit = async (clientName: string): Promise<boolean> => {
    if (!user || !clientName) return true;

    const normalizedClientName = clientName.trim();
    if (!normalizedClientName) return true;

    const limit = CLIENT_LIMITS[userTier];
    if (limit === null) return true;

    // Check if client already exists
    const { data: existingClient, error: fetchClientError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .eq('client_name', normalizedClientName)
      .maybeSingle();

    if (fetchClientError) {
      console.error('Error fetching client:', fetchClientError);
      toast.error(text.clientCheckFailed);
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
      toast.error(text.clientCountFailed);
      return false; // Fail safe
    }

    if (count !== null && count >= limit) {
      if (userTier === 'starter') {
        toast.error(text.clientLimitStarterTitle, {
          description: `${text.clientLimitStarterDescription} (${proMonthlyPrice})`,
          action: {
            label: text.upgrade,
            onClick: () => navigate('/billing', { state: { planCode: 'pro_month' } }),
          },
        });
      } else {
        toast.error(text.clientLimitFreeTitle, {
          description: `${text.clientLimitFreeDescription} (${starterMonthlyPrice})`,
          action: {
            label: text.upgrade,
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
      toast.error(text.loginRequired, {
        description: text.loginRequiredDescription,
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
      const isExistingDocument = Boolean(currentDocumentId) && currentDocumentType === activeTab;

      if (activeTab === 'invoice' && invoiceData) {
        content = invoiceData;
        title = getDocumentTitle(activeTab, invoiceData);
        clientName = invoiceData.clientName;
      } else if (activeTab === 'surat_jalan' && suratJalanData) {
        content = suratJalanData;
        title = getDocumentTitle(activeTab, suratJalanData);
        clientName = suratJalanData.recipientName;
      } else if (activeTab === 'kwitansi' && kwitansiData) {
        content = kwitansiData;
        title = getDocumentTitle(activeTab, kwitansiData);
        clientName = kwitansiData.receivedFrom;
      } else {
        throw new Error(text.saveErrorMessage);
      }
      
      if (!navigator.onLine) {
        throw new Error('OFFLINE');
      }

      // Only check limits for brand new documents
      if (!isExistingDocument) {
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

      if (isExistingDocument && currentDocumentId) {
        const updatePayload: Record<string, unknown> = {
          title,
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
          .eq('id', currentDocumentId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast.success(text.saveUpdated, {
          description: text.saveUpdatedDescription(title),
        });
        setSaveMessage(text.saveUpdated);
        setCurrentDocumentType(activeTab);
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
        const { data: insertedDocument, error } = await supabase
          .from('documents')
          .insert(insertPayload)
          .select('id')
          .single();

        if (error) throw error;

        toast.success(text.saveSaved, {
          description: text.saveSavedDescription(title),
        });
        setSaveMessage(text.saveSaved);
        setCurrentDocumentId(insertedDocument?.id || null);
        setCurrentDocumentType(activeTab);
      }

      setLastSaveTime(new Date());
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving document:', error);
      
      if (error.message === 'OFFLINE') {
        toast.error(text.offlineSaveTitle, {
          description: text.offlineSaveDescription,
          icon: <WifiOff className="h-4 w-4" />,
        });
      } else {
        toast.error(text.saveFailed, {
          description: error.message || text.saveFailed,
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
        toast.error(text.exportLimitTitle, {
          description: isAnonymous
            ? text.exportLimitAnonymous
            : text.exportLimitFree,
          action: isAnonymous
            ? {
                label: text.login,
                onClick: () => navigate('/login'),
              }
            : {
                label: text.upgrade,
                onClick: () => navigate('/billing', { state: { planCode: 'starter_month' } }),
              },
        });
        return;
      }

      switch (activeTab) {
        case 'invoice':
          if (invoiceData) {
            await exportInvoiceToPDF(invoiceData, settings, userTier, locale);
          }
          break;
        case 'surat_jalan':
          if (suratJalanData) {
            await exportSuratJalanToPDF(suratJalanData, settings, userTier, locale);
          }
          break;
        case 'kwitansi':
          if (kwitansiData) {
            await exportKwitansiToPDF(kwitansiData, settings, userTier, locale);
          }
          break;
        default:
          throw new Error('Invalid document type');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(text.exportFailed, {
        description: error instanceof Error ? error.message : text.exportFailed,
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
    setCurrentDocumentId(null);
    setCurrentDocumentType(null);
    toast.success(text.sampleLoaded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">{text.loadingPreview}</div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.heading}</h1>
            <p className="text-gray-600">{text.subheading}</p>
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
                <span>{getDocumentTypeLabel('invoice', locale)}</span>
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
                <span>{getDocumentTypeLabel('surat_jalan', locale)}</span>
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
                <span>{getDocumentTypeLabel('kwitansi', locale)}</span>
              </button>
              <button
                onClick={handleDummyData}
                className="ml-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                {text.loadSample}
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                {user && autoSaving && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm">{text.autoSaving}</span>
                  </div>
                )}
                {user && !autoSaving && !saveError && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">
                      {text.saved}
                      {lastSaveTime && (
                        <span className="text-gray-500 ml-1">
                          • {new Date(lastSaveTime).toLocaleTimeString(localeTag, { 
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
                    <span className="text-sm">{text.saveRetry}</span>
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
                        <p className="text-gray-600">{text.loadingPreview}</p>
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
                      {text.saveBannerTitle}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-800">
                      <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-amber-950">
                        {text.saveBannerTextStart}
                      </Link>{' '}
                      {text.saveBannerTextMiddle}{' '}
                      <Link to="/register" className="font-bold underline decoration-2 underline-offset-4 hover:text-amber-950">
                        {text.saveBannerTextAction}
                      </Link>{' '}
                      {text.saveBannerTextEnd}
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
                    toast.info(text.proFeature, {
                      description: text.proFeatureDescription,
                      action: {
                        label: text.upgrade,
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
                  <p className="font-semibold text-gray-700 mb-2">{locale === 'id' ? 'Iklan' : 'Ads'}</p>
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
                <span>{text.exportPdf}</span>
              </button>
              {user && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? text.saving : text.saveDocument}</span>
                </button>
              )}
              {user && activeTab === 'invoice' && userTier === 'pro' && (
                <button
                  onClick={() => setIsRecurringModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Repeat className="h-5 w-5" />
                  <span>{locale === 'id' ? 'Atur Berulang' : 'Recurring'}</span>
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
