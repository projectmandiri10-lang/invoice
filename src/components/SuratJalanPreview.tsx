import React from 'react';
import { SuratJalanData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatDate } from '@/lib/documentUtils';

interface SuratJalanPreviewProps {
  data: SuratJalanData;
  settings?: DocumentSettings;
}

export default function SuratJalanPreview({ data, settings }: SuratJalanPreviewProps) {
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
        padding: `${padding}px`
      }}
    >
      <div className="pb-6 mb-6">
        {settings?.logoUrl && settings.visibleFields.logo && (
          <img 
            src={settings.logoUrl} 
            alt="Company Logo" 
            className="mb-4"
            style={{ maxHeight: '60px', maxWidth: '200px' }}
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SURAT JALAN</h1>
        <div className="flex justify-between" style={{ marginTop: `${spacing}px` }}>
          <div>
            <h2 
              className="text-xl font-bold text-gray-900" 
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
            <p 
              className="text-gray-600" 
              style={{ 
                color: data.companyPhone ? 'inherit' : '#9ca3af',
                fontStyle: data.companyPhone ? 'normal' : 'italic',
                opacity: data.companyPhone ? 1 : 0.7
              }}
            >
              {data.companyPhone || 'Telepon'}
            </p>
          </div>
          <div className="text-right">
            <p 
              className="text-gray-600" 
              style={{ 
                color: data.suratJalanNumber ? 'inherit' : '#9ca3af',
                fontStyle: data.suratJalanNumber ? 'normal' : 'italic',
                opacity: data.suratJalanNumber ? 1 : 0.7
              }}
            >
              <span className="font-semibold">No. Surat Jalan:</span> {data.suratJalanNumber || 'SJ-001'}
            </p>
            <p 
              className="text-gray-600" 
              style={{ 
                color: data.suratJalanDate ? 'inherit' : '#9ca3af',
                fontStyle: data.suratJalanDate ? 'normal' : 'italic',
                opacity: data.suratJalanDate ? 1 : 0.7
              }}
            >
              <span className="font-semibold">Tanggal:</span> {data.suratJalanDate ? formatDate(data.suratJalanDate) : 'Tanggal'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: `${spacing * 2}px` }}>
          <div className="border border-gray-300 p-4 rounded">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengirim:</h3>
            <p 
              className="text-gray-900 font-medium" 
              style={{ 
                color: data.senderName ? 'inherit' : '#9ca3af',
                fontStyle: data.senderName ? 'normal' : 'italic',
                opacity: data.senderName ? 1 : 0.7
              }}
            >
              {data.senderName || 'Nama Pengirim'}
            </p>
            <p 
              className="text-gray-600" 
              style={{ 
                color: data.senderAddress ? 'inherit' : '#9ca3af',
                fontStyle: data.senderAddress ? 'normal' : 'italic',
                opacity: data.senderAddress ? 1 : 0.7
              }}
            >
              {data.senderAddress || 'Alamat Pengirim'}
            </p>
          </div>
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Penerima:</h3>
          <p 
            className="text-gray-900 font-medium" 
            style={{ 
              color: data.recipientName ? 'inherit' : '#9ca3af',
              fontStyle: data.recipientName ? 'normal' : 'italic',
              opacity: data.recipientName ? 1 : 0.7
            }}
          >
            {data.recipientName || 'Nama Penerima'}
          </p>
          <p 
            className="text-gray-600" 
            style={{ 
              color: data.recipientAddress ? 'inherit' : '#9ca3af',
              fontStyle: data.recipientAddress ? 'normal' : 'italic',
              opacity: data.recipientAddress ? 1 : 0.7
            }}
          >
            {data.recipientAddress || 'Alamat Penerima'}
          </p>
        </div>
      </div>

      <table className="w-full" style={{ marginBottom: `${spacing * 2}px` }}>
        <thead>
          <tr style={{ backgroundColor: `${primaryColor}15` }}>
            <th className="text-left p-3 border border-gray-300">No</th>
            <th className="text-left p-3 border border-gray-300">Deskripsi Barang</th>
            <th className="text-center p-3 border border-gray-300">Qty</th>
            <th className="text-center p-3 border border-gray-300">Satuan</th>
            <th className="text-left p-3 border border-gray-300">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border border-gray-300">{index + 1}</td>
              <td className="p-3 border border-gray-300">{item.description}</td>
              <td className="text-center p-3 border border-gray-300">{item.quantity}</td>
              <td className="text-center p-3 border border-gray-300">{item.unit}</td>
              <td className="p-3 border border-gray-300">{item.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.deliveryInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Informasi Pengiriman:</h4>
          <p className="text-gray-700">{data.deliveryInfo}</p>
          {data.courierName && (
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Kurir:</span> {data.courierName}
            </p>
          )}
        </div>
      )}

      {settings?.visibleFields.notes && data.notes && (
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-2">Catatan:</h4>
          <p className="text-gray-700">{data.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <p className="mb-16">Pengirim,</p>
          <p className="inline-block px-12 pt-2" style={{ borderTop: `2px solid ${primaryColor}` }}>
            {data.senderName}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-16">Penerima,</p>
          <p className="inline-block px-12 pt-2" style={{ borderTop: `2px solid ${primaryColor}` }}>
            {data.recipientName}
          </p>
        </div>
      </div>
    </div>
  );
}
