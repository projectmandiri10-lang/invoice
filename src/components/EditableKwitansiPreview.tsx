import React from 'react';
import { KwitansiData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatCurrency, formatDate, numberToWords } from '@/lib/documentUtils';
import LogoUpload from '@/components/LogoUpload';
import type { AppPlan } from '@/contexts/AuthContext';

interface EditableKwitansiPreviewProps {
  data: KwitansiData;
  settings?: DocumentSettings;
  onChange: (data: KwitansiData) => void;
  onSettingsChange?: (settings: DocumentSettings) => void;
  userTier: AppPlan;
}

export default function EditableKwitansiPreview({ data, settings, onChange, onSettingsChange, userTier }: EditableKwitansiPreviewProps) {
  const amountWords = data.amount > 0 ? numberToWords(data.amount) + ' rupiah' : '';
  const primaryColor = settings?.colorScheme.accent || '#9333ea';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;

  const updateField = (field: keyof KwitansiData, value: any) => {
    onChange({ ...data, [field]: value });
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
        {/* Logo Upload di pojok kiri atas */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-1/3">
            <LogoUpload 
              logoUrl={settings?.logoUrl} 
              onLogoChange={handleLogoChange} 
              userTier={userTier}
            />
          </div>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ color: primaryColor }}>
              KWITANSI
            </h1>
          </div>
          <div className="w-1/3"></div>
        </div>
        
        <div className="text-right pb-6 mb-6">
          <div className="flex items-center justify-end">
            <span className="text-lg text-gray-600 mr-2">No.</span>
            <input
              type="text"
              value={data.kwitansiNumber}
              onChange={(e) => updateField('kwitansiNumber', e.target.value)}
              className="text-lg text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none text-center w-32"
              placeholder="KWT-001"
              onFocus={(e) => e.target.value === 'KWT-001' && updateField('kwitansiNumber', '')}
              onBlur={(e) => e.target.value === '' && updateField('kwitansiNumber', 'KWT-001')}
              style={{ color: data.kwitansiNumber === 'KWT-001' ? '#9ca3af' : 'inherit' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: `${spacing * 2}px` }}>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            className="text-xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none w-full mb-2"
            placeholder="Nama Perusahaan"
            onFocus={(e) => e.target.value === 'Nama Perusahaan' && updateField('companyName', '')}
            onBlur={(e) => e.target.value === '' && updateField('companyName', 'Nama Perusahaan')}
            style={{ color: data.companyName === 'Nama Perusahaan' ? '#9ca3af' : 'inherit' }}
          />
          <textarea
            value={data.companyAddress}
            onChange={(e) => updateField('companyAddress', e.target.value)}
            className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none w-full resize-none"
            placeholder="Alamat Perusahaan"
            rows={2}
            onFocus={(e) => e.target.value === 'Alamat Perusahaan' && updateField('companyAddress', '')}
            onBlur={(e) => e.target.value === '' && updateField('companyAddress', 'Alamat Perusahaan')}
            style={{ color: data.companyAddress === 'Alamat Perusahaan' ? '#9ca3af' : 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: `${spacing}px` }}>
          <div className="flex items-center mb-1">
            <span className="font-semibold text-gray-900 mr-2">Tanggal:</span>
            <input
              type="date"
              value={data.kwitansiDate}
              onChange={(e) => updateField('kwitansiDate', e.target.value)}
              className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4" style={{ marginBottom: `${spacing * 2}px` }}>
          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Sudah terima dari</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.receivedFrom}
              onChange={(e) => updateField('receivedFrom', e.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-purple-500 px-2"
              placeholder="Nama Pembayar"
              onFocus={(e) => e.target.value === 'Nama Pembayar' && updateField('receivedFrom', '')}
              onBlur={(e) => e.target.value === '' && updateField('receivedFrom', 'Nama Pembayar')}
              style={{ color: data.receivedFrom === 'Nama Pembayar' ? '#9ca3af' : 'inherit' }}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Jumlah</span>
            <span className="font-semibold text-gray-900">:</span>
            <div className="border-b border-gray-400 px-2 py-1 font-bold text-lg" style={{ color: primaryColor }}>
              {formatCurrency(data.amount, settings?.visibleFields.showDecimals)}
            </div>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Uang sejumlah (input)</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="number"
              value={data.amount}
              onChange={(e) => {
                const value = e.target.value;
                const parsedValue = value === '' ? 0 : parseFloat(value);
                if (!isNaN(parsedValue)) {
                  updateField('amount', parsedValue);
                }
              }}
              className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-purple-500 px-2"
              placeholder="0"
              step={settings?.visibleFields.showDecimals ? "0.01" : "1"}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Terbilang</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.amountInWords}
              onChange={(e) => updateField('amountInWords', e.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-purple-500 px-2 italic capitalize"
              placeholder={amountWords || "terbilang (auto-generate dari jumlah)"}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Untuk pembayaran</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-purple-500 px-2"
              placeholder="Deskripsi pembayaran"
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-center gap-x-2">
            <span className="font-semibold text-gray-900">Metode Pembayaran</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.paymentMethod}
              onChange={(e) => updateField('paymentMethod', e.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-purple-500 px-2"
              placeholder="Tunai/Transfer"
              onFocus={(e) => e.target.value === 'Tunai/Transfer' && updateField('paymentMethod', '')}
              onBlur={(e) => e.target.value === '' && updateField('paymentMethod', 'Tunai/Transfer')}
              style={{ color: data.paymentMethod === 'Tunai/Transfer' ? '#9ca3af' : 'inherit' }}
            />
          </div>
        </div>

        {settings?.visibleFields.notes && (
          <div className="mb-8 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Catatan:</h4>
            <textarea
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full text-gray-700 bg-transparent border border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none resize-none p-2 rounded"
              placeholder="Catatan tambahan..."
              rows={2}
              onFocus={(e) => e.target.value === 'Catatan tambahan...' && updateField('notes', '')}
              onBlur={(e) => e.target.value === '' && updateField('notes', 'Catatan tambahan...')}
              style={{ color: data.notes === 'Catatan tambahan...' ? '#9ca3af' : 'inherit' }}
            />
          </div>
        )}

        <div className="flex justify-end mt-12">
          <div className="text-center w-64 flex flex-col items-center">
            <p className="mb-16">Penerima,</p>
            <div className="w-48 flex flex-col items-center">
              <input
                type="text"
                value={data.receiverName}
                onChange={(e) => updateField('receiverName', e.target.value)}
                className="font-semibold text-gray-900 px-8 pt-2 bg-transparent border-b-2 border-gray-900 focus:outline-none text-center w-full"
                placeholder="Nama Penerima"
                onFocus={(e) => e.target.value === 'Nama Penerima' && updateField('receiverName', '')}
                onBlur={(e) => e.target.value === '' && updateField('receiverName', 'Nama Penerima')}
                style={{ color: data.receiverName === 'Nama Penerima' ? '#9ca3af' : 'inherit' }}
              />
              <input
                type="text"
                value={data.receiverPosition}
                onChange={(e) => updateField('receiverPosition', e.target.value)}
                className="w-full text-center text-gray-600 text-sm mt-1 bg-transparent focus:outline-none"
                placeholder="Jabatan"
                onFocus={(e) => e.target.value === 'Jabatan' && updateField('receiverPosition', '')}
                onBlur={(e) => e.target.value === '' && updateField('receiverPosition', 'Jabatan')}
                style={{ color: data.receiverPosition === 'Jabatan' ? '#9ca3af' : 'inherit' }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
