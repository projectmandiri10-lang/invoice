import React from 'react';
import { DocumentSettings } from '@/components/SettingsPanel';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate, getInvoiceLabel } from '@/lib/documentUtils';
import { InvoiceData } from '@/types/document';

interface InvoicePreviewProps {
  data: InvoiceData;
  settings?: DocumentSettings;
}

const copy = {
  en: {
    companyLogo: 'Company logo',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    phone: 'Phone',
    email: 'Email',
    invoiceNumber: 'Invoice No.',
    invoiceNumberPlaceholder: 'Invoice Number',
    date: 'Date',
    dueDate: 'Due Date',
    clientName: 'Client Name',
    clientAddress: 'Client Address',
    description: 'Description',
    unitPrice: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal:',
    discount: 'Discount:',
    tax: 'Tax',
    paymentInfo: 'Payment Information:',
    notes: 'Notes:',
    defaultNote: 'Thank you for your trust.',
    regards: 'Regards,',
  },
  id: {
    companyLogo: 'Logo perusahaan',
    companyName: 'Nama Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    phone: 'Telepon',
    email: 'Email',
    invoiceNumber: 'No. Invoice',
    invoiceNumberPlaceholder: 'Nomor Invoice',
    date: 'Tanggal',
    dueDate: 'Jatuh Tempo',
    clientName: 'Nama Klien',
    clientAddress: 'Alamat Klien',
    description: 'Deskripsi',
    unitPrice: 'Harga Satuan',
    total: 'Total',
    subtotal: 'Subtotal:',
    discount: 'Diskon:',
    tax: 'Pajak',
    paymentInfo: 'Informasi Pembayaran:',
    notes: 'Catatan:',
    defaultNote: 'Terima kasih atas kepercayaan Anda.',
    regards: 'Hormat kami,',
  },
} as const;

export default function InvoicePreview({ data, settings }: InvoicePreviewProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const primaryColor = settings?.colorScheme.primary || '#2563eb';
  const fontFamily = settings?.font.family || 'Arial';
  const fontSize = settings?.font.size || 14;
  const padding = settings?.layout.margin || 20;
  const spacing = settings?.layout.spacing || 16;
  const invoiceLabel = getInvoiceLabel(data);
  const showDecimals = settings?.visibleFields.showDecimals ?? false;
  const showDueDate = settings?.visibleFields.dueDate ?? true;
  const showSubtotal = settings?.visibleFields.subtotal ?? true;
  const showDiscount = settings?.visibleFields.discount ?? false;
  const showTax = settings?.visibleFields.tax ?? true;
  const showTotal = settings?.visibleFields.total ?? true;

  return (
    <div
      id="invoice-preview"
      className="bg-white shadow-lg"
      style={{
        minHeight: '297mm',
        fontFamily,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`,
      }}
    >
      <div className="mb-6 pb-6">
        <div className="flex justify-between items-start">
          <div>
            {settings?.logoUrl && settings.visibleFields.logo && (
              <img
                src={settings.logoUrl}
                alt={text.companyLogo}
                className="mb-4"
                style={{ maxHeight: '60px', maxWidth: '200px' }}
              />
            )}
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{invoiceLabel}</h1>
          </div>
        </div>

        <div className="flex justify-between" style={{ marginTop: `${spacing}px` }}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data.companyName || text.companyName}</h2>
            <p className="text-gray-600">{data.companyAddress || text.companyAddress}</p>
            <p className="text-gray-600">{data.companyPhone || text.phone}</p>
            <p className="text-gray-600">{data.companyEmail || text.email}</p>
            {data.companyNPWP && settings?.visibleFields.companyNPWP && <p className="text-gray-600">{data.companyNPWP}</p>}
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              <span className="font-semibold">{text.invoiceNumber}:</span> {data.invoiceNumber || text.invoiceNumberPlaceholder}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">{text.date}:</span> {data.invoiceDate ? formatDate(data.invoiceDate, locale) : text.date}
            </p>
            {showDueDate && (
              <p className="text-gray-600">
                <span className="font-semibold">{text.dueDate}:</span> {data.dueDate ? formatDate(data.dueDate, locale) : text.dueDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-gray-300 p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{data.clientName || text.clientName}</h3>
        <p className="text-gray-600">{data.clientAddress || text.clientAddress}</p>
        {data.clientPhone && <p className="text-gray-600">{data.clientPhone}</p>}
        {data.clientEmail && <p className="text-gray-600">{data.clientEmail}</p>}
        {data.clientNPWP && <p className="text-gray-600">{data.clientNPWP}</p>}
      </div>

      <table className="mb-8 w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
            <th className="border border-gray-300 p-3 text-left">No</th>
            <th className="border border-gray-300 p-3 text-left">{text.description}</th>
            <th className="border border-gray-300 p-3 text-center">Qty</th>
            <th className="border border-gray-300 p-3 text-right">{text.unitPrice}</th>
            <th className="border border-gray-300 p-3 text-right">{text.total}</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-3">{item.description}</td>
              <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.unitPrice, showDecimals, locale)}</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.total, showDecimals, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-8 ml-auto w-full max-w-sm">
        {showSubtotal && (
          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className="font-medium">{text.subtotal}</span>
            <span>{formatCurrency(data.subtotal, showDecimals, locale)}</span>
          </div>
        )}
        {showDiscount && (
          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className="font-medium">{text.discount}</span>
            <span>{formatCurrency(-(data.discount || 0), showDecimals, locale)}</span>
          </div>
        )}
        {showTax && (
          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className="font-medium">{text.tax} ({data.taxPercentage}%):</span>
            <span>{formatCurrency(data.tax, showDecimals, locale)}</span>
          </div>
        )}
        {showTotal && (
          <div className="flex justify-between py-3" style={{ borderBottom: `2px solid ${primaryColor}` }}>
            <span className="text-lg font-bold" style={{ color: primaryColor }}>
              {text.total}:
            </span>
            <span className="text-lg font-bold" style={{ color: primaryColor }}>
              {formatCurrency(data.total, showDecimals, locale)}
            </span>
          </div>
        )}
      </div>

      {settings?.visibleFields.paymentInfo && data.paymentInfo && (
        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-gray-900">{text.paymentInfo}</h4>
          <p className="whitespace-pre-wrap text-gray-600">{data.paymentInfo}</p>
        </div>
      )}

      {settings?.visibleFields.notes && (
        <div className="mb-12">
          <h4 className="mb-2 font-semibold text-gray-900">{text.notes}</h4>
          <p className="whitespace-pre-wrap text-gray-600">{data.notes || text.defaultNote}</p>
        </div>
      )}

      <div className="ml-auto w-56 text-left">
        <p className="mb-2 text-gray-700">{text.regards}</p>
        <div className="mt-16 border-b border-gray-400 pb-1">{data.signatureName || ''}</div>
        <p className="mt-2 text-gray-600">{data.signatureTitle || ''}</p>
      </div>
    </div>
  );
}
