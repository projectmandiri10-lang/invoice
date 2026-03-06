import React from 'react';
import { DocumentSettings } from '@/components/SettingsPanel';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate } from '@/lib/documentUtils';
import { SuratJalanData } from '@/types/document';

interface SuratJalanPreviewProps {
  data: SuratJalanData;
  settings?: DocumentSettings;
}

const copy = {
  en: {
    title: 'DELIVERY NOTE',
    companyLogo: 'Company logo',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    phone: 'Phone',
    number: 'Delivery Note No.',
    date: 'Date',
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
    senderSign: 'Sender,',
    recipientSign: 'Recipient,',
  },
  id: {
    title: 'SURAT JALAN',
    companyLogo: 'Logo perusahaan',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    phone: 'Telepon',
    number: 'No. Surat Jalan',
    date: 'Tanggal',
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
    senderSign: 'Pengirim,',
    recipientSign: 'Penerima,',
  },
} as const;

export default function SuratJalanPreview({ data, settings }: SuratJalanPreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const primaryColor = settings?.colorScheme.secondary || '#059669';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;

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
      <div className="mb-6 pb-6">
        {settings?.logoUrl && settings.visibleFields.logo && (
          <img
            src={settings.logoUrl}
            alt={text.companyLogo}
            className="mb-4"
            style={{ maxHeight: '60px', maxWidth: '200px' }}
          />
        )}
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{text.title}</h1>
        <div className="flex justify-between" style={{ marginTop: `${spacing}px` }}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data.companyName || text.companyName}</h2>
            <p className="text-gray-600">{data.companyAddress || text.companyAddress}</p>
            <p className="text-gray-600">{data.companyPhone || text.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              <span className="font-semibold">{text.number}:</span> {data.suratJalanNumber || 'SJ-001'}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">{text.date}:</span> {data.suratJalanDate ? formatDate(data.suratJalanDate, locale) : text.date}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="rounded border border-gray-300 p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{text.sender}</h3>
          <p className="font-medium text-gray-900">{data.senderName || text.senderName}</p>
          <p className="text-gray-600">{data.senderAddress || text.senderAddress}</p>
        </div>
        <div className="rounded border border-gray-300 p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{text.recipient}</h3>
          <p className="font-medium text-gray-900">{data.recipientName || text.recipientName}</p>
          <p className="text-gray-600">{data.recipientAddress || text.recipientAddress}</p>
        </div>
      </div>

      <table className="mb-8 w-full border-collapse">
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
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-3">{item.description}</td>
              <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
              {settings?.visibleFields.showPrice && (
                <>
                  <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.price || 0, false, locale)}</td>
                  <td className="border border-gray-300 p-3 text-right">
                    {formatCurrency((item.price || 0) * item.quantity, false, locale)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.deliveryInfo && (
        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-gray-900">{text.deliveryInfo}</h4>
          <p className="whitespace-pre-wrap text-gray-600">{data.deliveryInfo}</p>
        </div>
      )}

      {settings?.visibleFields.notes && (
        <div className="mb-12">
          <h4 className="mb-2 font-semibold text-gray-900">{text.notes}</h4>
          <p className="whitespace-pre-wrap text-gray-600">{data.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-12">
        <div className="text-center">
          <p className="mb-16">{text.senderSign}</p>
          <div className="border-b border-gray-400 pb-1">{data.senderSignatureName || data.senderName || ''}</div>
        </div>
        <div className="text-center">
          <p className="mb-16">{text.recipientSign}</p>
          <div className="border-b border-gray-400 pb-1">{data.recipientSignatureName || data.recipientName || ''}</div>
        </div>
      </div>
    </div>
  );
}
