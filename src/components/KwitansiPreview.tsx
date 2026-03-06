import React from 'react';
import { DocumentSettings } from '@/components/SettingsPanel';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate, numberToWords } from '@/lib/documentUtils';
import { KwitansiData } from '@/types/document';

interface KwitansiPreviewProps {
  data: KwitansiData;
  settings?: DocumentSettings;
}

const copy = {
  en: {
    title: 'RECEIPT',
    companyLogo: 'Company logo',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    date: 'Date',
    receivedFrom: 'Received from',
    payerName: 'Payer Name',
    amount: 'Amount',
    amountInWords: 'Amount in words',
    forPayment: 'For payment',
    paymentMethod: 'Payment method',
    receiver: 'Receiver,',
    zeroAmount: 'Rp 0',
    moneySuffix: 'rupiah',
  },
  id: {
    title: 'KWITANSI',
    companyLogo: 'Logo perusahaan',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    date: 'Tanggal',
    receivedFrom: 'Sudah terima dari',
    payerName: 'Nama Pembayar',
    amount: 'Uang sejumlah',
    amountInWords: 'Terbilang',
    forPayment: 'Untuk pembayaran',
    paymentMethod: 'Metode Pembayaran',
    receiver: 'Penerima,',
    zeroAmount: 'Rp 0',
    moneySuffix: 'rupiah',
  },
} as const;

export default function KwitansiPreview({ data, settings }: KwitansiPreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const amountWords = data.amount > 0 ? `${numberToWords(data.amount, locale)} ${text.moneySuffix}` : '';
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
        padding: `${padding}px`,
      }}
    >
      <div className="p-8">
        {settings?.logoUrl && settings.visibleFields.logo && (
          <div className="mb-4 text-center">
            <img
              src={settings.logoUrl}
              alt={text.companyLogo}
              className="mx-auto"
              style={{ maxHeight: '60px', maxWidth: '200px' }}
            />
          </div>
        )}

        <div className="mb-6 pb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900" style={{ color: primaryColor }}>
            {text.title}
          </h1>
          <p className="text-lg text-gray-600">No. {data.kwitansiNumber}</p>
        </div>

        <div style={{ marginBottom: `${spacing * 2}px` }}>
          <h2 className="mb-2 text-xl font-bold text-gray-900">{data.companyName || text.companyName}</h2>
          <p className="text-gray-600">{data.companyAddress || text.companyAddress}</p>
        </div>

        <div style={{ marginBottom: `${spacing}px` }}>
          <p className="mb-1 text-gray-600">
            <span className="font-semibold">{text.date}:</span> {formatDate(data.kwitansiDate, locale)}
          </p>
        </div>

        <div className="space-y-4" style={{ marginBottom: `${spacing * 2}px` }}>
          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.receivedFrom}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">{data.receivedFrom || text.payerName}</span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.amount}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">
              {data.amount && data.amount !== 0 ? formatCurrency(data.amount, false, locale) : text.zeroAmount}
            </span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.amountInWords}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">{amountWords}</span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.forPayment}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">{data.description}</span>
          </div>

          <div className="grid grid-cols-[12rem_0.75rem_1fr] items-baseline gap-x-2">
            <span className="font-semibold text-gray-900">{text.paymentMethod}</span>
            <span className="font-semibold text-gray-900">:</span>
            <span className="border-b border-gray-400">{data.paymentMethod}</span>
          </div>
        </div>

        <div className="mt-20 text-right">
          <p className="mb-16">{text.receiver}</p>
          <div className="ml-auto w-56 border-b border-gray-400 pb-1">{data.receiverName}</div>
          <p className="mt-2 text-gray-600">{data.receiverPosition}</p>
        </div>
      </div>
    </div>
  );
}
