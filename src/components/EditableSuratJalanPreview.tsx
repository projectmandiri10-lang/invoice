import React from 'react';
import { SuratJalanData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatCurrency, formatDate } from '@/lib/documentUtils';
import { Plus, Trash2 } from 'lucide-react';
import LogoUpload from '@/components/LogoUpload';
import type { AppPlan } from '@/contexts/AuthContext';

interface EditableSuratJalanPreviewProps {
  data: SuratJalanData;
  settings?: DocumentSettings;
  onChange: (data: SuratJalanData) => void;
  onSettingsChange?: (settings: DocumentSettings) => void;
  userTier: AppPlan;
}

export default function EditableSuratJalanPreview({ data, settings, onChange, onSettingsChange, userTier }: EditableSuratJalanPreviewProps) {
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
      items: [...data.items, { description: 'Barang Baru', quantity: 1, unit: 'pcs', price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const handleLogoChange = (logoUrl: string) => {
    if (onSettingsChange && settings) {
      onSettingsChange({
        ...settings,
        logoUrl
      });
    }
  };

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
        <div className="flex justify-between items-start" style={{ marginTop: `${spacing}px` }}>
          <div className="w-1/3">
            <LogoUpload 
              logoUrl={settings?.logoUrl} 
              onLogoChange={handleLogoChange} 
              userTier={userTier}
            />
          </div>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SURAT JALAN</h1>
          </div>
          <div className="w-1/3"></div>
        </div>
        <div className="flex justify-between" style={{ marginTop: `${spacing}px` }}>
          <div className="flex-1">
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full mb-1"
              placeholder="Nama Perusahaan"
              onFocus={(e) => e.target.value === 'Nama Perusahaan' && updateField('companyName', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyName', 'Nama Perusahaan')}
              style={{ color: data.companyName === 'Nama Perusahaan' ? '#9ca3af' : 'inherit' }}
            />
            <textarea
              value={data.companyAddress}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full resize-none"
              placeholder="Alamat Perusahaan"
              rows={2}
              onFocus={(e) => e.target.value === 'Alamat Perusahaan' && updateField('companyAddress', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyAddress', 'Alamat Perusahaan')}
              style={{ color: data.companyAddress === 'Alamat Perusahaan' ? '#9ca3af' : 'inherit' }}
            />
            <input
              type="text"
              value={data.companyPhone}
              onChange={(e) => updateField('companyPhone', e.target.value)}
              className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full"
              placeholder="Telepon"
              onFocus={(e) => e.target.value === 'Telepon' && updateField('companyPhone', '')}
              onBlur={(e) => e.target.value === '' && updateField('companyPhone', 'Telepon')}
              style={{ color: data.companyPhone === 'Telepon' ? '#9ca3af' : 'inherit' }}
            />
          </div>
          <div className="text-right ml-4">
            <div className="flex items-center justify-end mb-1">
              <span className="font-semibold mr-2">No. Surat Jalan:</span>
            <input
              type="text"
              value={data.suratJalanNumber}
              onChange={(e) => updateField('suratJalanNumber', e.target.value)}
              className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none text-right w-32"
              placeholder="SJ-001"
              onFocus={(e) => e.target.value === 'SJ-001' && updateField('suratJalanNumber', '')}
              onBlur={(e) => e.target.value === '' && updateField('suratJalanNumber', 'SJ-001')}
              style={{ color: data.suratJalanNumber === 'SJ-001' ? '#9ca3af' : 'inherit' }}
            />
            </div>
            <div className="flex items-center justify-end">
              <span className="font-semibold mr-2">Tanggal:</span>
              <input
                type="date"
                value={data.suratJalanDate}
                onChange={(e) => updateField('suratJalanDate', e.target.value)}
                className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none text-right"
                style={{ 
                  color: data.suratJalanDate ? 'inherit' : '#9ca3af',
                  fontStyle: data.suratJalanDate ? 'normal' : 'italic',
                  opacity: data.suratJalanDate ? 1 : 0.7
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: `${spacing * 2}px` }}>
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengirim:</h3>
          <input
            type="text"
            value={data.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            className="text-gray-900 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full mb-1"
            placeholder="Nama Pengirim"
            onFocus={(e) => e.target.value === 'Nama Pengirim' && updateField('senderName', '')}
            onBlur={(e) => e.target.value === '' && updateField('senderName', 'Nama Pengirim')}
            style={{ color: data.senderName === 'Nama Pengirim' ? '#9ca3af' : 'inherit' }}
          />
          <textarea
            value={data.senderAddress}
            onChange={(e) => updateField('senderAddress', e.target.value)}
            className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full resize-none"
            placeholder="Alamat Pengirim"
            rows={2}
            onFocus={(e) => e.target.value === 'Alamat Pengirim' && updateField('senderAddress', '')}
            onBlur={(e) => e.target.value === '' && updateField('senderAddress', 'Alamat Pengirim')}
            style={{ color: data.senderAddress === 'Alamat Pengirim' ? '#9ca3af' : 'inherit' }}
          />
        </div>
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Penerima:</h3>
          <input
            type="text"
            value={data.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            className="text-gray-900 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full mb-1"
            placeholder="Nama Penerima"
            onFocus={(e) => e.target.value === 'Nama Penerima' && updateField('recipientName', '')}
            onBlur={(e) => e.target.value === '' && updateField('recipientName', 'Nama Penerima')}
            style={{ color: data.recipientName === 'Nama Penerima' ? '#9ca3af' : 'inherit' }}
          />
          <textarea
            value={data.recipientAddress}
            onChange={(e) => updateField('recipientAddress', e.target.value)}
            className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full resize-none"
            placeholder="Alamat Penerima"
            rows={2}
            onFocus={(e) => e.target.value === 'Alamat Penerima' && updateField('recipientAddress', '')}
            onBlur={(e) => e.target.value === '' && updateField('recipientAddress', 'Alamat Penerima')}
            style={{ color: data.recipientAddress === 'Alamat Penerima' ? '#9ca3af' : 'inherit' }}
          />
        </div>
      </div>

      <table className="w-full" style={{ marginBottom: `${spacing * 2}px` }}>
        <thead>
          <tr style={{ backgroundColor: `${primaryColor}15` }}>
            <th className="text-left p-3 border border-gray-300 w-12">No</th>
            <th className="text-left p-3 border border-gray-300">Deskripsi Barang</th>
            <th className="text-center p-3 border border-gray-300 w-20">Qty</th>
            <th className="text-center p-3 border border-gray-300 w-24">Satuan</th>
            {settings?.visibleFields.showPrice && <th className="text-right p-3 border border-gray-300 w-40">Harga Satuan</th>}
            <th className="text-center p-3 border border-gray-300 w-16">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-green-500 px-2 py-1 rounded"
                  placeholder="Deskripsi barang"
                  onFocus={(e) => (e.target.value === 'Deskripsi barang' || e.target.value === 'Barang Baru') && updateItem(index, 'description', '')}
                  onBlur={(e) => e.target.value === '' && updateItem(index, 'description', 'Deskripsi barang')}
                  style={{ color: (item.description === 'Deskripsi barang' || item.description === 'Barang Baru') ? '#9ca3af' : 'inherit' }}
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-green-500 px-2 py-1 rounded"
                  style={{ 
                    color: item.quantity !== 0 ? 'inherit' : '#9ca3af',
                    fontStyle: item.quantity !== 0 ? 'normal' : 'italic',
                    opacity: item.quantity !== 0 ? 1 : 0.7
                  }}
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateItem(index, 'unit', e.target.value)}
                  className="w-full text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-green-500 px-2 py-1 rounded"
                  placeholder="pcs"
                  onFocus={(e) => e.target.value === 'pcs' && updateItem(index, 'unit', '')}
                  onBlur={(e) => e.target.value === '' && updateItem(index, 'unit', 'pcs')}
                  style={{ color: item.unit === 'pcs' ? '#9ca3af' : 'inherit' }}
                />
              </td>
              {settings?.visibleFields.showPrice && (
                  <td className="p-2 border border-gray-300 text-right">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-green-500 px-2 py-1 rounded"
                    />
                  </td>
              )}
              <td className="p-2 border border-gray-300 text-center">
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Hapus item"
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
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mb-4"
      >
        <Plus className="h-4 w-4" />
        <span>Tambah Barang</span>
      </button>

      <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-4">
        <h4 className="font-semibold text-gray-900 self-start pt-2">Informasi Pengiriman:</h4>
        <div className="space-y-2">
          <textarea
            value={data.deliveryInfo}
            onChange={(e) => updateField('deliveryInfo', e.target.value)}
            className="w-full text-gray-700 bg-gray-50 border border-gray-200 focus:border-green-500 focus:outline-none resize-none p-2 rounded"
            placeholder="Info pengiriman..."
            rows={2}
            onFocus={(e) => e.target.value === 'Info pengiriman...' && updateField('deliveryInfo', '')}
            onBlur={(e) => e.target.value === '' && updateField('deliveryInfo', 'Info pengiriman...')}
            style={{ color: data.deliveryInfo === 'Info pengiriman...' ? '#9ca3af' : 'inherit' }}
          />
          <input
            type="text"
            value={data.courierName}
            onChange={(e) => updateField('courierName', e.target.value)}
            className="w-full text-gray-700 bg-gray-50 border border-gray-200 focus:border-green-500 focus:outline-none p-2 rounded"
            placeholder="Nama Kurir"
            onFocus={(e) => e.target.value === 'Nama Kurir' && updateField('courierName', '')}
            onBlur={(e) => e.target.value === '' && updateField('courierName', 'Nama Kurir')}
            style={{ color: data.courierName === 'Nama Kurir' ? '#9ca3af' : 'inherit' }}
          />
        </div>

        {settings?.visibleFields.notes && (
          <>
            <h4 className="font-semibold text-gray-900 self-start pt-2">Catatan:</h4>
            <textarea
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full text-gray-700 bg-gray-50 border border-gray-200 focus:border-green-500 focus:outline-none resize-none p-2 rounded"
              placeholder="Catatan tambahan..."
              rows={2}
              onFocus={(e) => e.target.value === 'Catatan tambahan...' && updateField('notes', '')}
              onBlur={(e) => e.target.value === '' && updateField('notes', 'Catatan tambahan...')}
              style={{ color: data.notes === 'Catatan tambahan...' ? '#9ca3af' : 'inherit' }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <p className="mb-16">Pengirim,</p>
          <input
            type="text"
            value={data.senderSignatureName || ''}
            onChange={(e) => updateField('senderSignatureName', e.target.value)}
            className="text-center font-semibold text-gray-900 bg-transparent border-t-2 border-gray-900 focus:outline-none w-48 mb-1"
            placeholder="Nama Pengirim"
            style={{ color: data.senderSignatureName ? 'inherit' : '#9ca3af' }}
          />
        </div>
        <div className="text-center">
          <p className="mb-16">Penerima,</p>
          <input
            type="text"
            value={data.recipientSignatureName || ''}
            onChange={(e) => updateField('recipientSignatureName', e.target.value)}
            className="text-center font-semibold text-gray-900 bg-transparent border-t-2 border-gray-900 focus:outline-none w-48 mb-1"
            placeholder="Nama Penerima"
            style={{ color: data.recipientSignatureName ? 'inherit' : '#9ca3af' }}
          />
        </div>
      </div>

    </div>
  );
}
