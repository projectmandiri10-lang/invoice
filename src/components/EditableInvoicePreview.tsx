import React from 'react';
import { toast } from 'sonner';
import { InvoiceData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatCurrency, formatDate, getInvoiceLabel } from '@/lib/documentUtils';
import { Plus, Trash2 } from 'lucide-react';
import LogoUpload from '@/components/LogoUpload';
import type { AppPlan } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface EditableInvoicePreviewProps {
  data: InvoiceData;
  settings?: DocumentSettings;
  onChange: (data: InvoiceData) => void;
  onSettingsChange?: (settings: DocumentSettings) => void;
  userTier: AppPlan;
  userId?: string;
}

const copy = {
  en: {
    date: 'Date:',
    dueDate: 'Due Date:',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    companyEmail: 'company@example.com',
    phone: 'Phone',
    email: 'Email',
    clientName: 'Client Name',
    clientAddress: 'Client Address',
    itemDescription: 'Item Description',
    paymentInfo: 'Payment Information:',
    notes: 'Notes:',
    defaultNote: 'Thank you for your trust.',
    subtotal: 'Subtotal:',
    discount: 'Discount:',
    tax: 'Tax',
    total: 'Total:',
    discountTitle: 'Discount (Rp)',
    portalTitle: 'Payment portal link',
    portalDescription: 'Share this link with your client so they can view the invoice and pay online when the Pro plan is active.',
    proOnly: 'Invoice payments are available on the Pro plan.',
    preparingPortal: 'Preparing portal link...',
    copyLink: 'Copy Link',
    portalCopied: 'Portal link copied',
    portalCopyFailed: 'Failed to copy portal link',
    portalHintStart: 'Fill in',
    portalHintMiddle: 'Client Name',
    portalHintEnd: 'then click',
    portalHintSave: 'Save Document',
    portalHintLast: 'to generate the portal link.',
    regards: 'Regards,',
    signatureName: 'Name',
    signatureTitle: 'Title',
    addItem: 'Add Item',
    upgradeProTitle: 'Upgrade to Pro',
    upgradeProDescription: 'Large invoice? Enable the client portal and online payments with the Pro plan (Rp 150,000/month).',
  },
  id: {
    date: 'Tanggal:',
    dueDate: 'Jatuh Tempo:',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    companyEmail: 'email@perusahaan.com',
    phone: 'Telepon',
    email: 'Email',
    clientName: 'Nama Klien',
    clientAddress: 'Alamat Klien',
    itemDescription: 'Deskripsi Item',
    paymentInfo: 'Informasi Pembayaran:',
    notes: 'Catatan:',
    defaultNote: 'Terima kasih atas kepercayaan Anda.',
    subtotal: 'Subtotal:',
    discount: 'Diskon:',
    tax: 'Pajak',
    total: 'Total:',
    discountTitle: 'Diskon (Rp)',
    portalTitle: 'Link Portal Pembayaran',
    portalDescription: 'Bagikan link ini ke klien agar bisa melihat invoice dan membayar online saat paket Pro aktif.',
    proOnly: 'Fitur pembayaran invoice tersedia di paket Pro.',
    preparingPortal: 'Menyiapkan link portal...',
    copyLink: 'Salin Link',
    portalCopied: 'Link portal disalin',
    portalCopyFailed: 'Gagal menyalin link portal',
    portalHintStart: 'Isi',
    portalHintMiddle: 'Nama Klien',
    portalHintEnd: 'lalu klik',
    portalHintSave: 'Simpan Dokumen',
    portalHintLast: 'agar link portal terbentuk.',
    regards: 'Hormat kami,',
    signatureName: 'Nama',
    signatureTitle: 'Jabatan',
    addItem: 'Tambah Item',
    upgradeProTitle: 'Upgrade ke Pro',
    upgradeProDescription: 'Invoice besar? Aktifkan client portal dan pembayaran online dengan paket Pro (Rp 150.000/bulan).',
  },
} as const;

export default function EditableInvoicePreview({ data, settings, onChange, onSettingsChange, userTier, userId }: EditableInvoicePreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const primaryColor = settings?.colorScheme.primary || '#2563eb';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;
  const invoiceLabel = getInvoiceLabel(data);
  const applyDiscount = settings?.visibleFields.discount ?? false;
  const applyTax = settings?.visibleFields.tax ?? true;

  const calculateInvoiceTotals = React.useCallback((items: InvoiceData['items'], discountValue: number, taxPercentage: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const clampedDiscount = Math.max(0, Math.min(discountValue, subtotal));
    const discountApplied = applyDiscount ? clampedDiscount : 0;
    const taxableAmount = subtotal - discountApplied;
    const tax = applyTax ? (taxableAmount * taxPercentage) / 100 : 0;
    const total = taxableAmount + tax;

    return {
      subtotal,
      discount: clampedDiscount,
      tax,
      total,
    };
  }, [applyDiscount, applyTax]);

  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? value : newItems[index].unitPrice;
      newItems[index].total = quantity * unitPrice;
    }

    const { subtotal, discount, tax, total } = calculateInvoiceTotals(
      newItems,
      data.discount ?? 0,
      data.taxPercentage
    );

    onChange({ ...data, items: newItems, subtotal, discount, tax, total });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { description: 'Item Baru', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    const { subtotal, discount, tax, total } = calculateInvoiceTotals(
      newItems,
      data.discount ?? 0,
      data.taxPercentage
    );
    onChange({ ...data, items: newItems, subtotal, discount, tax, total });
  };

  const handleLogoChange = (logoUrl: string) => {
    if (onSettingsChange && settings) {
      onSettingsChange({
        ...settings,
        logoUrl
      });
        }
  };

  const [portalLink, setPortalLink] = React.useState<string | null>(null);
  const [portalLinkLoading, setPortalLinkLoading] = React.useState(false);

  React.useEffect(() => {
    const paymentGatewayEnabled = Boolean(settings?.visibleFields.paymentGateway);
    const clientName = data.clientName?.trim();

    if (userTier !== 'pro' || !paymentGatewayEnabled || !userId || !clientName) {
      setPortalLink(null);
      setPortalLinkLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setPortalLinkLoading(true);
      try {
        const { data: clientRow, error } = await supabase
          .from('clients')
          .select('portal_token')
          .eq('user_id', userId)
          .eq('client_name', clientName)
          .maybeSingle();

        if (cancelled) return;
        if (error || !clientRow?.portal_token) {
          setPortalLink(null);
          return;
        }
        setPortalLink(`${window.location.origin}/portal/${clientRow.portal_token}`);
      } finally {
        if (!cancelled) setPortalLinkLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data.clientName, settings?.visibleFields.paymentGateway, userId, userTier]);

  React.useEffect(() => {
    if (data.total > 50000000) {
      toast.info(text.upgradeProTitle, {
        description: text.upgradeProDescription,
        duration: 8000,
      });
    }
  }, [data.total, text.upgradeProTitle, text.upgradeProDescription]);

  React.useEffect(() => {
    const { subtotal, discount, tax, total } = calculateInvoiceTotals(
      data.items,
      data.discount ?? 0,
      data.taxPercentage
    );

    const needsUpdate =
      subtotal !== data.subtotal ||
      discount !== (data.discount ?? 0) ||
      tax !== data.tax ||
      total !== data.total;

    if (needsUpdate) {
      onChange({ ...data, subtotal, discount, tax, total });
    }
  }, [
    calculateInvoiceTotals,
    data.items,
    data.taxPercentage,
    data.discount,
    data.subtotal,
    data.tax,
    data.total,
    onChange,
  ]);

  return (
    <div 
      id="invoice-preview" 
      className="bg-white shadow-lg" 
      style={{ 
        minHeight: '297mm',
        fontFamily,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`
      }}
    >
      {/* Logo Upload di pojok kiri atas */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-1/3">
                    <LogoUpload 
            logoUrl={settings?.logoUrl} 
            onLogoChange={handleLogoChange}
            userTier={userTier}
          />
        </div>
        <div className="w-2/3 text-right">
          {/* Spacer for right alignment */}
        </div>
      </div>

      {/* Judul INVOICE - Center (di atas) */}
      <div className="text-center mb-6">
        <input
          type="text"
          value={data.invoiceLabel ?? 'INVOICE'}
          onChange={(e) => updateField('invoiceLabel', e.target.value)}
          onBlur={(e) => updateField('invoiceLabel', e.target.value.trim() || 'INVOICE')}
          className="w-full bg-transparent text-center text-5xl font-bold mb-4 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          style={{ color: primaryColor }}
          aria-label={locale === 'id' ? 'Judul invoice' : 'Invoice title'}
          placeholder={invoiceLabel}
        />
      </div>

      {/* Invoice Number dan Date (Left-Right) */}
      <div className="mb-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="font-semibold mr-2">No:</span>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              onFocus={(e) => e.target.value === 'INV-001' && updateField('invoiceNumber', '')}
              onBlur={(e) => e.target.value === '' && updateField('invoiceNumber', 'INV-001')}
              className="text-gray-900 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-40"
              placeholder="INV-001"
              style={{ color: data.invoiceNumber === 'INV-001' ? '#9ca3af' : 'inherit' }}
            />
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <span className="font-semibold mr-2">{text.date}</span>
              <input
                type="date"
                value={data.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
                className="text-gray-900 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {settings?.visibleFields.dueDate && (
              <div className="flex items-center justify-end">
                <span className="font-semibold mr-2">{text.dueDate}</span>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="text-gray-900 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header DARI dan KEPADA (2 Kolom) */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Kolom Kiri: DARI */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Dari:</h3>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              onFocus={(e) => e.target.value === text.companyName && updateField('companyName', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyName', text.companyName)}
              className="text-base font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-2"
              placeholder={text.companyName}
              style={{ color: data.companyName === text.companyName ? '#9ca3af' : 'inherit' }}
            />
            <textarea
              value={data.companyAddress}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              onFocus={(e) => e.target.value === text.companyAddress && updateField('companyAddress', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyAddress', text.companyAddress)}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full resize-none mb-1"
              placeholder={text.companyAddress}
              rows={2}
              style={{ color: data.companyAddress === text.companyAddress ? '#9ca3af' : 'inherit' }}
            />
            <input
              type="text"
              value={data.companyPhone}
              onChange={(e) => updateField('companyPhone', e.target.value)}
              onFocus={(e) => e.target.value === 'Telp: (021) xxx-xxxx' && updateField('companyPhone', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyPhone', 'Telp: (021) xxx-xxxx')}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-1"
              placeholder="Telp: (021) xxx-xxxx"
              style={{ color: data.companyPhone === 'Telp: (021) xxx-xxxx' ? '#9ca3af' : 'inherit' }}
            />
            <input
              type="email"
              value={data.companyEmail}
              onChange={(e) => updateField('companyEmail', e.target.value)}
              onFocus={(e) => e.target.value === text.companyEmail && updateField('companyEmail', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyEmail', text.companyEmail)}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-1"
              placeholder={text.companyEmail}
              style={{ color: data.companyEmail === text.companyEmail ? '#9ca3af' : 'inherit' }}
            />
            {settings?.visibleFields.companyNPWP && (
              <input
                type="text"
                value={data.companyNPWP}
                onChange={(e) => updateField('companyNPWP', e.target.value)}
                onFocus={(e) => e.target.value === 'NPWP: xx.xxx.xxx.x-xxx.xxx' && updateField('companyNPWP', '')}
                onBlur={(e) => e.target.value === '' && updateField('companyNPWP', 'NPWP: xx.xxx.xxx.x-xxx.xxx')}
                className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                placeholder="NPWP: xx.xxx.xxx.x-xxx.xxx"
                style={{ color: data.companyNPWP === 'NPWP: xx.xxx.xxx.x-xxx.xxx' ? '#9ca3af' : 'inherit' }}
              />
            )}
          </div>

          {/* Kolom Kanan: KEPADA */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Kepada:</h3>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              onFocus={(e) => e.target.value === text.clientName && updateField('clientName', '')}
              onBlur={(e) => e.target.value === '' && updateField('clientName', text.clientName)}
              className="text-base font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-2"
              placeholder={text.clientName}
              style={{ color: data.clientName === text.clientName ? '#9ca3af' : 'inherit' }}
            />
            <textarea
              value={data.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
              onFocus={(e) => e.target.value === text.clientAddress && updateField('clientAddress', '')}
              onBlur={(e) => e.target.value === '' && updateField('clientAddress', text.clientAddress)}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full resize-none mb-1"
              placeholder={text.clientAddress}
              rows={2}
              style={{ color: data.clientAddress === text.clientAddress ? '#9ca3af' : 'inherit' }}
            />
            <input
              type="text"
              value={data.clientPhone || ''}
              onChange={(e) => updateField('clientPhone', e.target.value)}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-1"
              placeholder={text.phone}
              style={{ 
                color: data.clientPhone ? 'inherit' : '#9ca3af',
                fontStyle: data.clientPhone ? 'normal' : 'italic',
                opacity: data.clientPhone ? 1 : 0.7
              }}
            />
            <input
              type="email"
              value={data.clientEmail || ''}
              onChange={(e) => updateField('clientEmail', e.target.value)}
              className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-1"
              placeholder={text.email}
              style={{ 
                color: data.clientEmail ? 'inherit' : '#9ca3af',
                fontStyle: data.clientEmail ? 'normal' : 'italic',
                opacity: data.clientEmail ? 1 : 0.7
              }}
            />
            {settings?.visibleFields.companyNPWP && (
              <input
                type="text"
                value={data.clientNPWP || ''}
                onChange={(e) => updateField('clientNPWP', e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                placeholder="NPWP"
                style={{ 
                  color: data.clientNPWP ? 'inherit' : '#9ca3af',
                  fontStyle: data.clientNPWP ? 'normal' : 'italic',
                  opacity: data.clientNPWP ? 1 : 0.7
                }}
              />
            )}
          </div>
        </div>
      </div>

      <table className="w-full" style={{ marginBottom: `${spacing * 2}px` }}>
        <thead>
          <tr style={{ backgroundColor: `${primaryColor}15` }}>
            <th className="text-center p-3 border border-gray-300 w-16">No</th>
            <th className="text-left p-3 border border-gray-300">{locale === 'id' ? 'Deskripsi' : 'Description'}</th>
            <th className="text-center p-3 border border-gray-300 w-24">Qty</th>
            <th className="text-right p-3 border border-gray-300 w-32">{locale === 'id' ? 'Harga Satuan' : 'Unit Price'}</th>
            <th className="text-right p-3 border border-gray-300 w-32">Total</th>
            <th className="text-center p-3 border border-gray-300 w-16">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border border-gray-300 text-center font-medium text-gray-700">
                {index + 1}
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  onFocus={(e) => (e.target.value === text.itemDescription || e.target.value === 'Item Baru') && updateItem(index, 'description', '')}
                  onBlur={(e) => e.target.value === '' && updateItem(index, 'description', text.itemDescription)}
                  className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1 rounded"
                  placeholder={text.itemDescription}
                  style={{ color: (item.description === text.itemDescription || item.description === 'Item Baru') ? '#9ca3af' : 'inherit' }}
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1 rounded"
                                    style={{ 
                    color: item.quantity !== 0 ? 'inherit' : '#9ca3af',
                    fontStyle: item.quantity !== 0 ? 'normal' : 'italic',
                    opacity: item.quantity !== 0 ? 1 : 0.7
                  }}
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1 rounded"
                  style={{ 
                    color: item.unitPrice && item.unitPrice !== 0 ? 'inherit' : '#9ca3af',
                    fontStyle: item.unitPrice && item.unitPrice !== 0 ? 'normal' : 'italic',
                    opacity: item.unitPrice && item.unitPrice !== 0 ? 1 : 0.7
                  }}
                />
              </td>
              <td className="p-3 border border-gray-300 text-right text-gray-600">
                {formatCurrency(item.total, settings?.visibleFields.showDecimals, locale)}
              </td>
              <td className="p-2 border border-gray-300 text-center">
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                    title={locale === 'id' ? 'Hapus item' : 'Remove item'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-4"
      >
        <Plus className="h-4 w-4" />
                <span>{text.addItem}</span>
      </button>

            <div className="flex justify-between items-start" style={{ marginBottom: `${spacing * 2}px` }}>
        <div className="w-1/2 pr-4">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-4">
            {settings?.visibleFields.paymentInfo && (
              <>
                <h4 className="font-semibold text-gray-900 self-start pt-2">{text.paymentInfo}</h4>
                <textarea
                  value={data.paymentInfo}
                  onChange={(e) => updateField('paymentInfo', e.target.value)}
                  onFocus={(e) => e.target.value === 'Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx' && updateField('paymentInfo', '')}
                  onBlur={(e) => e.target.value === '' && updateField('paymentInfo', 'Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx')}
                  className="w-full text-gray-700 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none resize-none p-2 rounded"
                  placeholder="Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx"
                  rows={3}
                  style={{ color: data.paymentInfo === 'Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx' ? '#9ca3af' : 'inherit' }}
                />
              </>
            )}

            {settings?.visibleFields.notes && (
              <>
                <h4 className="font-semibold text-gray-900 self-start pt-2">{text.notes}</h4>
                <textarea
                  value={data.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  onFocus={(e) => e.target.value === text.defaultNote && updateField('notes', '')}
                  onBlur={(e) => e.target.value === '' && updateField('notes', text.defaultNote)}
                  className="w-full text-gray-700 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none resize-none p-2 rounded"
                  placeholder={text.defaultNote}
                  rows={3}
                  style={{ color: data.notes === text.defaultNote ? '#9ca3af' : 'inherit' }}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-64">
          {settings?.visibleFields.subtotal && (
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">{text.subtotal}</span>
              <span>{formatCurrency(data.subtotal, settings?.visibleFields.showDecimals, locale)}</span>
            </div>
          )}

          {settings?.visibleFields.discount && (
            <div className="flex items-center justify-between py-2 border-b border-gray-300">
              <span className="font-medium">{text.discount}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={settings?.visibleFields.showDecimals ? '0.01' : '1'}
                value={data.discount ?? 0}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === '' ? 0 : parseFloat(value);
                  const discountValue = Number.isFinite(parsedValue) ? parsedValue : 0;
                  const { subtotal, discount, tax, total } = calculateInvoiceTotals(
                    data.items,
                    discountValue,
                    data.taxPercentage
                  );
                  onChange({ ...data, subtotal, discount, tax, total });
                }}
                className="w-32 text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                title={text.discountTitle}
              />
            </div>
          )}

          {settings?.visibleFields.tax && (
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">{text.tax} ({data.taxPercentage}%):</span>
              <span>{formatCurrency(data.tax, settings?.visibleFields.showDecimals, locale)}</span>
            </div>
          )}

          {settings?.visibleFields.total && (
            <div className="flex justify-between py-3" style={{ borderBottom: `2px solid ${primaryColor}` }}>
              <span className="font-bold text-lg" style={{ color: primaryColor }}>{text.total}</span>
              <span className="font-bold text-lg" style={{ color: primaryColor }}>{formatCurrency(data.total, settings?.visibleFields.showDecimals, locale)}</span>
            </div>
          )}

          {settings?.visibleFields.paymentGateway && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{text.portalTitle}</p>
                  <p className="text-xs text-gray-600">
                    {text.portalDescription}
                  </p>
                </div>
              </div>

              {userTier !== 'pro' ? (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {text.proOnly}
                </div>
              ) : portalLinkLoading ? (
                <div className="mt-3 text-sm text-gray-600">{text.preparingPortal}</div>
              ) : portalLink ? (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={portalLink}
                    readOnly
                    className="w-full flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(portalLink);
                        toast.success(text.portalCopied);
                      } catch (err: any) {
                        toast.error(text.portalCopyFailed, { description: err?.message || String(err) });
                      }
                    }}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    {text.copyLink}
                  </button>
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                  {text.portalHintStart} <span className="font-semibold">{text.portalHintMiddle}</span> {text.portalHintEnd}{' '}
                  <span className="font-semibold">{text.portalHintSave}</span> {text.portalHintLast}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

            {/* Signature Section dengan ruang lebih besar */}
      <div className="mt-16 mb-8">
        <div className="flex justify-end">
          <div className="w-72 text-center">
            <p className="mb-20 text-gray-700">{text.regards}</p>
            {/* Nama dan Jabatan dengan garis di tengah */}
            <div className="pb-2">
              <input
                type="text"
                value={data.signatureName || ''}
                onChange={(e) => updateField('signatureName', e.target.value)}
                className="text-center font-semibold text-gray-900 bg-transparent border-b-2 border-gray-900 focus:outline-none w-48 mb-1"
                placeholder={text.signatureName}
                style={{ 
                  color: data.signatureName ? 'inherit' : '#9ca3af',
                  fontStyle: data.signatureName ? 'normal' : 'italic',
                  opacity: data.signatureName ? 1 : 0.7
                }}
              />
              <input
                type="text"
                value={data.signatureTitle || ''}
                onChange={(e) => updateField('signatureTitle', e.target.value)}
                className="text-center text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-48"
                placeholder={text.signatureTitle}
                style={{ 
                  color: data.signatureTitle ? 'inherit' : '#9ca3af',
                  fontStyle: data.signatureTitle ? 'normal' : 'italic',
                  opacity: data.signatureTitle ? 1 : 0.7
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
