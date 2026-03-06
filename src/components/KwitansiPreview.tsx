import React from 'react';
import { KwitansiData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatCurrency, formatDate, numberToWords } from '@/lib/documentUtils';

interface KwitansiPreviewProps {
  data: KwitansiData;
  settings?: DocumentSettings;
}

export default function KwitansiPreview({ data, settings }: KwitansiPreviewProps) {
  const amountWords = data.amount > 0 ? numberToWords(data.amount) + ' rupiah' : '';
  const primaryColor = settings?.colorScheme.accent || '#9333ea';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;

  return (
    <div 
      id="kwitansi-preview" 
      className="bg-white shadow-lg" 
      style={{ 
        minHeight: '297mm',
        fontFamily,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`
      }}
    >
      <div className="p-8">
        {settings?.logoUrl && settings.visibleFields.logo && (
          <div className="text-center mb-4">
            <img 
              src={settings.logoUrl} 
              alt="Company Logo" 
              className="mx-auto"
              style={{ maxHeight: '60px', maxWidth: '200px' }}
            />
          </div>
        )}
        <div className="text-center pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ color: primaryColor }}>
            KWITANSI
          </h1>
          <p className="text-lg text-gray-600">No. {data.kwitansiNumber}</p>
        </div>

        <div style={{ marginBottom: `${spacing * 2}px` }}>
          <h2 
            className="text-xl font-bold text-gray-900 mb-2" 
            style={{ 
              color: data.companyName ? 'inherit' : '#9ca3af',
              fontStyle: data.companyName ? 'normal' : 'italic',
              opacity: data.companyName ? 1 : 0.7
            }}
          >
            {data.companyName || 'Nama Perusahaan'}
          </h2>
          <p 
            className="text-gray-600" 
            style={{ 
              color: data.companyAddress ? 'inherit' : '#9ca3af',
              fontStyle: data.companyAddress ? 'normal' : 'italic',
              opacity: data.companyAddress ? 1 : 0.7
            }}
          >
            {data.companyAddress || 'Alamat Perusahaan'}
          </p>
        </div>

        <div style={{ marginBottom: `${spacing}px` }}>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Tanggal:</span> {formatDate(data.kwitansiDate)}
          </p>
        </div>

        <div className="space-y-4" style={{ marginBottom: `${spacing * 2}px` }}>
          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">Sudah terima dari</span>
            <span className="font-semibold text-gray-900">:</span>
            <span
              className="border-b border-gray-400"
              style={{
                color: data.receivedFrom ? 'inherit' : '#9ca3af',
                fontStyle: data.receivedFrom ? 'normal' : 'italic',
                opacity: data.receivedFrom ? 1 : 0.7,
              }}
            >
              {data.receivedFrom || 'Nama Pembayar'}
            </span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">Uang sejumlah</span>
            <span className="font-semibold text-gray-900">:</span>
            <span
              className="border-b border-gray-400"
              style={{
                color: data.amount && data.amount !== 0 ? 'inherit' : '#9ca3af',
                fontStyle: data.amount && data.amount !== 0 ? 'normal' : 'italic',
                opacity: data.amount && data.amount !== 0 ? 1 : 0.7,
              }}
            >
              {data.amount && data.amount !== 0 ? formatCurrency(data.amount) : 'Rp 0'}
            </span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">Terbilang</span>
            <span className="font-semibold text-gray-900">:</span>
            <span
              className="border-b border-gray-400 italic capitalize"
              style={{
                color: data.amountInWords || amountWords ? 'inherit' : '#9ca3af',
                fontStyle: data.amountInWords || amountWords ? 'normal' : 'italic',
                opacity: data.amountInWords || amountWords ? 1 : 0.7,
              }}
            >
              {data.amountInWords || amountWords || 'terbilang (auto-generate dari jumlah)'}
            </span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">Untuk pembayaran</span>
            <span className="font-semibold text-gray-900">:</span>
            <span
              className="border-b border-gray-400"
              style={{
                color: data.description ? 'inherit' : '#9ca3af',
                fontStyle: data.description ? 'normal' : 'italic',
                opacity: data.description ? 1 : 0.7,
              }}
            >
              {data.description || 'Deskripsi pembayaran'}
            </span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">Metode Pembayaran</span>
            <span className="font-semibold text-gray-900">:</span>
            <span
              className="border-b border-gray-400"
              style={{
                color: data.paymentMethod ? 'inherit' : '#9ca3af',
                fontStyle: data.paymentMethod ? 'normal' : 'italic',
                opacity: data.paymentMethod ? 1 : 0.7,
              }}
            >
              {data.paymentMethod || 'Tunai/Transfer'}
            </span>
          </div>
        </div>

        {settings?.visibleFields.notes && data.notes && (
          <div className="mb-8 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Catatan:</h4>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        )}

        <div className="flex justify-end mt-12">
          <div className="text-center w-64">
            <p className="mb-16">Penerima,</p>
            <div>
              <p 
                className="font-semibold text-gray-900 inline-block px-8 pt-2"
                style={{ borderTop: `2px solid ${primaryColor}` }}
              >
                {data.receiverName}
              </p>
              {data.receiverPosition && (
                <p className="text-gray-600 text-sm mt-1">{data.receiverPosition}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
