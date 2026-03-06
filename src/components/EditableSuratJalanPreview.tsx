import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import LogoUpload from '@/components/LogoUpload';
import { DocumentSettings } from '@/components/SettingsPanel';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency } from '@/lib/documentUtils';
import { SuratJalanData } from '@/types/document';
import type { AppPlan } from '@/contexts/AuthContext';

interface EditableSuratJalanPreviewProps {
  data: SuratJalanData;
  settings?: DocumentSettings;
  onChange: (data: SuratJalanData) => void;
  onSettingsChange?: (settings: DocumentSettings) => void;
  userTier: AppPlan;
}

const copy = {
  en: {
    title: 'DELIVERY NOTE',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    phone: 'Phone',
    number: 'Delivery Note No.:',
    date: 'Date:',
    sender: 'Sender:',
    senderName: 'Sender Name',
    senderAddress: 'Sender Address',
    recipient: 'Recipient:',
    recipientName: 'Recipient Name',
    recipientAddress: 'Recipient Address',
    description: 'Item Description',
    unit: 'Unit',
    unitPrice: 'Unit Price',
    total: 'Total',
    deliveryInfo: 'Delivery Information:',
    notes: 'Notes:',
    defaultNotes: 'Additional notes...',
    addItem: 'Add Item',
    removeItem: 'Remove item',
    senderSign: 'Sender,',
    recipientSign: 'Recipient,',
  },
  id: {
    title: 'SURAT JALAN',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    phone: 'Telepon',
    number: 'No. Surat Jalan:',
    date: 'Tanggal:',
    sender: 'Pengirim:',
    senderName: 'Nama Pengirim',
    senderAddress: 'Alamat Pengirim',
    recipient: 'Penerima:',
    recipientName: 'Nama Penerima',
    recipientAddress: 'Alamat Penerima',
    description: 'Deskripsi Barang',
    unit: 'Satuan',
    unitPrice: 'Harga Satuan',
    total: 'Total',
    deliveryInfo: 'Informasi Pengiriman:',
    notes: 'Catatan:',
    defaultNotes: 'Catatan tambahan...',
    addItem: 'Tambah Item',
    removeItem: 'Hapus item',
    senderSign: 'Pengirim,',
    recipientSign: 'Penerima,',
  },
} as const;

export default function EditableSuratJalanPreview({
  data,
  settings,
  onChange,
  onSettingsChange,
  userTier,
}: EditableSuratJalanPreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const primaryColor = settings?.colorScheme.secondary || '#059669';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;

  const updateField = (field: keyof SuratJalanData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { description: text.description, quantity: 1, unit: 'pcs', price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, itemIndex) => itemIndex !== index) });
  };

  const handleLogoChange = (logoUrl: string) => {
    if (!onSettingsChange || !settings) return;
    onSettingsChange({ ...settings, logoUrl });
  };

  return (
    <div
      id="surat-jalan-preview"
      className="bg-white shadow-lg"
      style={{
        minHeight: '297mm',
        fontFamily,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`,
      }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="w-1/3">
          <LogoUpload logoUrl={settings?.logoUrl} onLogoChange={handleLogoChange} userTier={userTier} />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: primaryColor }}>
            {text.title}
          </h1>
        </div>
        <div className="w-1/3 text-right">
          <div className="mb-1 flex items-center justify-end">
            <span className="mr-2 font-semibold">{text.number}</span>
            <input
              type="text"
              value={data.suratJalanNumber}
              onChange={(event) => updateField('suratJalanNumber', event.target.value)}
              className="w-36 border-b border-transparent bg-transparent text-right focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="mr-2 font-semibold">{text.date}</span>
            <input
              type="date"
              value={data.suratJalanDate}
              onChange={(event) => updateField('suratJalanDate', event.target.value)}
              className="border-b border-transparent bg-transparent text-right focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6" style={{ marginTop: `${spacing}px` }}>
        <div>
          <input
            type="text"
            value={data.companyName}
            onChange={(event) => updateField('companyName', event.target.value)}
            className="mb-2 w-full border-b border-transparent bg-transparent text-xl font-bold focus:border-green-500 focus:outline-none"
            placeholder={text.companyName}
          />
          <textarea
            value={data.companyAddress}
            onChange={(event) => updateField('companyAddress', event.target.value)}
            className="mb-1 w-full resize-none border-b border-transparent bg-transparent text-gray-600 focus:border-green-500 focus:outline-none"
            placeholder={text.companyAddress}
            rows={2}
          />
          <input
            type="text"
            value={data.companyPhone}
            onChange={(event) => updateField('companyPhone', event.target.value)}
            className="w-full border-b border-transparent bg-transparent text-gray-600 focus:border-green-500 focus:outline-none"
            placeholder={text.phone}
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="rounded border border-gray-300 p-4">
          <h3 className="mb-2 text-lg font-semibold">{text.sender}</h3>
          <input
            type="text"
            value={data.senderName}
            onChange={(event) => updateField('senderName', event.target.value)}
            className="mb-2 w-full border-b border-transparent bg-transparent font-medium focus:border-green-500 focus:outline-none"
            placeholder={text.senderName}
          />
          <textarea
            value={data.senderAddress}
            onChange={(event) => updateField('senderAddress', event.target.value)}
            className="w-full resize-none border-b border-transparent bg-transparent text-gray-600 focus:border-green-500 focus:outline-none"
            placeholder={text.senderAddress}
            rows={2}
          />
        </div>
        <div className="rounded border border-gray-300 p-4">
          <h3 className="mb-2 text-lg font-semibold">{text.recipient}</h3>
          <input
            type="text"
            value={data.recipientName}
            onChange={(event) => updateField('recipientName', event.target.value)}
            className="mb-2 w-full border-b border-transparent bg-transparent font-medium focus:border-green-500 focus:outline-none"
            placeholder={text.recipientName}
          />
          <textarea
            value={data.recipientAddress}
            onChange={(event) => updateField('recipientAddress', event.target.value)}
            className="w-full resize-none border-b border-transparent bg-transparent text-gray-600 focus:border-green-500 focus:outline-none"
            placeholder={text.recipientAddress}
            rows={2}
          />
        </div>
      </div>

      <table className="mb-4 w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
            <th className="border border-gray-300 p-3 text-left">No</th>
            <th className="border border-gray-300 p-3 text-left">{text.description}</th>
            <th className="border border-gray-300 p-3 text-center">Qty</th>
            <th className="border border-gray-300 p-3 text-center">{text.unit}</th>
            {settings?.visibleFields.showPrice && (
              <>
                <th className="border border-gray-300 p-3 text-right">{text.unitPrice}</th>
                <th className="border border-gray-300 p-3 text-right">{text.total}</th>
              </>
            )}
            <th className="border border-gray-300 p-3 text-center">#</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(event) => updateItem(index, 'description', event.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                  placeholder={text.description}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(event) => updateItem(index, 'quantity', parseFloat(event.target.value) || 0)}
                  className="w-full bg-transparent text-center focus:outline-none"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={item.unit}
                  onChange={(event) => updateItem(index, 'unit', event.target.value)}
                  className="w-full bg-transparent text-center focus:outline-none"
                />
              </td>
              {settings?.visibleFields.showPrice && (
                <>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={item.price || 0}
                      onChange={(event) => updateItem(index, 'price', parseFloat(event.target.value) || 0)}
                      className="w-full bg-transparent text-right focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-3 text-right">
                    {formatCurrency((item.price || 0) * item.quantity, false, locale)}
                  </td>
                </>
              )}
              <td className="border border-gray-300 p-2 text-center">
                <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-700" title={text.removeItem}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addItem}
        className="mb-8 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        <Plus className="h-4 w-4" />
        <span>{text.addItem}</span>
      </button>

      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-gray-900">{text.deliveryInfo}</h4>
        <textarea
          value={data.deliveryInfo}
          onChange={(event) => updateField('deliveryInfo', event.target.value)}
          className="w-full resize-none rounded border border-gray-200 bg-gray-50 p-2 focus:border-green-500 focus:outline-none"
          rows={3}
        />
      </div>

      {settings?.visibleFields.notes && (
        <div className="mb-12">
          <h4 className="mb-2 font-semibold text-gray-900">{text.notes}</h4>
          <textarea
            value={data.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            className="w-full resize-none rounded border border-gray-200 bg-gray-50 p-2 focus:border-green-500 focus:outline-none"
            placeholder={text.defaultNotes}
            rows={3}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-12">
        <div className="text-center">
          <p className="mb-16">{text.senderSign}</p>
          <input
            type="text"
            value={data.senderSignatureName || ''}
            onChange={(event) => updateField('senderSignatureName', event.target.value)}
            className="w-48 border-b border-gray-400 bg-transparent text-center focus:outline-none"
            placeholder={text.senderName}
          />
        </div>
        <div className="text-center">
          <p className="mb-16">{text.recipientSign}</p>
          <input
            type="text"
            value={data.recipientSignatureName || ''}
            onChange={(event) => updateField('recipientSignatureName', event.target.value)}
            className="w-48 border-b border-gray-400 bg-transparent text-center focus:outline-none"
            placeholder={text.recipientName}
          />
        </div>
      </div>
    </div>
  );
}
