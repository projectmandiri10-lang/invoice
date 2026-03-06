import React from 'react';
import LogoUpload from '@/components/LogoUpload';
import { DocumentSettings } from '@/components/SettingsPanel';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate, numberToWords } from '@/lib/documentUtils';
import { KwitansiData } from '@/types/document';
import type { AppPlan } from '@/contexts/AuthContext';

interface EditableKwitansiPreviewProps {
  data: KwitansiData;
  settings?: DocumentSettings;
  onChange: (data: KwitansiData) => void;
  onSettingsChange?: (settings: DocumentSettings) => void;
  userTier: AppPlan;
  onRequestUpgradeStarter?: () => void;
}

const copy = {
  en: {
    title: 'RECEIPT',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    date: 'Date:',
    receivedFrom: 'Received from',
    payerName: 'Payer Name',
    amount: 'Amount',
    amountInWords: 'Amount in words',
    forPayment: 'For payment',
    paymentMethod: 'Payment method',
    receiver: 'Receiver,',
    receiverName: 'Receiver Name',
    receiverTitle: 'Receiver Title',
    zeroAmount: 'Rp 0',
    moneySuffix: 'rupiah',
  },
  id: {
    title: 'KWITANSI',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    date: 'Tanggal:',
    receivedFrom: 'Sudah terima dari',
    payerName: 'Nama Pembayar',
    amount: 'Uang sejumlah',
    amountInWords: 'Terbilang',
    forPayment: 'Untuk pembayaran',
    paymentMethod: 'Metode Pembayaran',
    receiver: 'Penerima,',
    receiverName: 'Nama Penerima',
    receiverTitle: 'Jabatan',
    zeroAmount: 'Rp 0',
    moneySuffix: 'rupiah',
  },
} as const;

export default function EditableKwitansiPreview({
  data,
  settings,
  onChange,
  onSettingsChange,
  userTier,
  onRequestUpgradeStarter,
}: EditableKwitansiPreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const amountWords = data.amount > 0 ? `${numberToWords(data.amount, locale)} ${text.moneySuffix}` : '';
  const primaryColor = settings?.colorScheme.accent || '#9333ea';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;

  const updateField = (field: keyof KwitansiData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleLogoChange = (logoUrl: string) => {
    if (!onSettingsChange || !settings) return;
    onSettingsChange({ ...settings, logoUrl });
  };

  return (
    <div
      id="kwitansi-preview"
      className="bg-white shadow-lg"
      style={{
        minHeight: '297mm',
        fontFamily,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`,
      }}
    >
      <div className="p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="w-1/3">
            <LogoUpload
              logoUrl={settings?.logoUrl}
              onLogoChange={handleLogoChange}
              userTier={userTier}
              onRequestUpgradeStarter={onRequestUpgradeStarter}
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-gray-900" style={{ color: primaryColor }}>
              {text.title}
            </h1>
          </div>
          <div className="w-1/3" />
        </div>

        <div className="mb-6 text-right">
          <div className="flex items-center justify-end">
            <span className="mr-2 text-lg text-gray-600">No.</span>
            <input
              type="text"
              value={data.kwitansiNumber}
              onChange={(event) => updateField('kwitansiNumber', event.target.value)}
              className="w-32 border-b border-transparent bg-transparent text-center text-lg text-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div style={{ marginBottom: `${spacing * 2}px` }}>
          <input
            type="text"
            value={data.companyName}
            onChange={(event) => updateField('companyName', event.target.value)}
            className="mb-2 w-full border-b border-transparent bg-transparent text-xl font-bold text-gray-900 focus:border-purple-500 focus:outline-none"
            placeholder={text.companyName}
          />
          <textarea
            value={data.companyAddress}
            onChange={(event) => updateField('companyAddress', event.target.value)}
            className="w-full resize-none border-b border-transparent bg-transparent text-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder={text.companyAddress}
            rows={2}
          />
        </div>

        <div style={{ marginBottom: `${spacing}px` }}>
          <div className="mb-1 flex items-center">
            <span className="mr-2 font-semibold text-gray-900">{text.date}</span>
            <input
              type="date"
              value={data.kwitansiDate}
              onChange={(event) => updateField('kwitansiDate', event.target.value)}
              className="border-b border-transparent bg-transparent focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4" style={{ marginBottom: `${spacing * 2}px` }}>
          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.receivedFrom}</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.receivedFrom}
              onChange={(event) => updateField('receivedFrom', event.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none"
              placeholder={text.payerName}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.amount}</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="number"
              value={data.amount}
              onChange={(event) => updateField('amount', parseFloat(event.target.value) || 0)}
              className="border-b border-gray-400 bg-transparent focus:outline-none"
              placeholder={text.zeroAmount}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.amountInWords}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">{amountWords}</span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.forPayment}</span>
            <span className="font-semibold text-gray-900">:</span>
            <textarea
              value={data.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="resize-none border-b border-gray-400 bg-transparent focus:outline-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.paymentMethod}</span>
            <span className="font-semibold text-gray-900">:</span>
            <input
              type="text"
              value={data.paymentMethod}
              onChange={(event) => updateField('paymentMethod', event.target.value)}
              className="border-b border-gray-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-20 text-right">
          <p className="mb-16">{text.receiver}</p>
          <input
            type="text"
            value={data.receiverName}
            onChange={(event) => updateField('receiverName', event.target.value)}
            className="ml-auto block w-56 border-b border-gray-400 bg-transparent text-center focus:outline-none"
            placeholder={text.receiverName}
          />
          <input
            type="text"
            value={data.receiverPosition}
            onChange={(event) => updateField('receiverPosition', event.target.value)}
            className="ml-auto mt-2 block w-56 border-b border-transparent bg-transparent text-center text-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder={text.receiverTitle}
          />
        </div>
      </div>
    </div>
  );
}
