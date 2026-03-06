import React from 'react';
import { InvoiceData } from '@/types/document';
import { DocumentSettings } from '@/components/SettingsPanel';
import { formatCurrency, formatDate, getInvoiceLabel } from '@/lib/documentUtils';

interface InvoicePreviewProps {
  data: InvoiceData;
  settings?: DocumentSettings;
}

export default function InvoicePreview({ data, settings }: InvoicePreviewProps) {
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
        padding: `${padding}px`
      }}
    >
      <div className="pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {settings?.logoUrl && settings.visibleFields.logo && (
              <img 
                src={settings.logoUrl} 
                alt="Company Logo" 
                className="mb-4"
                style={{ maxHeight: '60px', maxWidth: '200px' }}
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoiceLabel}</h1>
          </div>
        </div>
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
          <p 
            className="text-gray-600" 
            style={{ 
              color: data.companyEmail ? 'inherit' : '#9ca3af',
              fontStyle: data.companyEmail ? 'normal' : 'italic',
              opacity: data.companyEmail ? 1 : 0.7
            }}
          >
            {data.companyEmail || 'Email'}
          </p>
          {data.companyNPWP && settings?.visibleFields.companyNPWP && (
            <p 
              className="text-gray-600" 
              style={{ 
                color: data.companyNPWP ? 'inherit' : '#9ca3af',
                fontStyle: data.companyNPWP ? 'normal' : 'italic',
                opacity: data.companyNPWP ? 1 : 0.7
              }}
            >
              {data.companyNPWP || 'NPWP'}
            </p>
          )}
          </div>
          <div className="text-right">
            <p 
              className="text-gray-600"
              style={{ 
                color: data.invoiceNumber ? 'inherit' : '#9ca3af',
                fontStyle: data.invoiceNumber ? 'normal' : 'italic',
                opacity: data.invoiceNumber ? 1 : 0.7
              }}
            >
              <span className="font-semibold">No. Invoice:</span> {data.invoiceNumber || 'Nomor Invoice'}
            </p>
            <p 
              className="text-gray-600"
              style={{ 
                color: data.invoiceDate ? 'inherit' : '#9ca3af',
                fontStyle: data.invoiceDate ? 'normal' : 'italic',
                opacity: data.invoiceDate ? 1 : 0.7
              }}
            >
              <span className="font-semibold">Tanggal:</span> {data.invoiceDate ? formatDate(data.invoiceDate) : 'Tanggal'}
            </p>
            {showDueDate && (
              <p 
                className="text-gray-600"
                style={{ 
                  color: data.dueDate ? 'inherit' : '#9ca3af',
                  fontStyle: data.dueDate ? 'normal' : 'italic',
                  opacity: data.dueDate ? 1 : 0.7
                }}
              >
                <span className="font-semibold">Jatuh Tempo:</span> {data.dueDate ? formatDate(data.dueDate) : 'Jatuh Tempo'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: `${spacing * 2}px` }}>
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2" 
          style={{ 
            color: data.clientName ? 'inherit' : '#9ca3af',
            fontStyle: data.clientName ? 'normal' : 'italic',
            opacity: data.clientName ? 1 : 0.7
          }}
        >
          Kepada:
        </h3>
        <p 
          className="text-gray-900 font-medium" 
          style={{ 
            color: data.clientName ? 'inherit' : '#9ca3af',
            fontStyle: data.clientName ? 'normal' : 'italic',
            opacity: data.clientName ? 1 : 0.7
          }}
        >
          {data.clientName || 'Nama Klien'}
        </p>
        <p 
          className="text-gray-600" 
          style={{ 
            color: data.clientAddress ? 'inherit' : '#9ca3af',
            fontStyle: data.clientAddress ? 'normal' : 'italic',
            opacity: data.clientAddress ? 1 : 0.7
          }}
        >
          {data.clientAddress || 'Alamat Klien'}
        </p>
      </div>

      <table className="w-full" style={{ marginBottom: `${spacing * 2}px` }}>
        <thead>
          <tr style={{ backgroundColor: `${primaryColor}15` }}>
            <th className="text-left p-3 border border-gray-300">Deskripsi</th>
            <th className="text-center p-3 border border-gray-300">Qty</th>
            <th className="text-right p-3 border border-gray-300">Harga Satuan</th>
            <th className="text-right p-3 border border-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border border-gray-300">{item.description}</td>
              <td className="text-center p-3 border border-gray-300">{item.quantity}</td>
              <td className="text-right p-3 border border-gray-300">{formatCurrency(item.unitPrice, showDecimals)}</td>
              <td className="text-right p-3 border border-gray-300">{formatCurrency(item.total, showDecimals)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end" style={{ marginBottom: `${spacing * 2}px` }}>
        <div className="w-64">
          {showSubtotal && (
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(data.subtotal, showDecimals)}</span>
            </div>
          )}
          {showDiscount && (
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">Diskon:</span>
              <span>{formatCurrency(-(data.discount ?? 0), showDecimals)}</span>
            </div>
          )}
          {showTax && (
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">Pajak ({data.taxPercentage}%):</span>
              <span>{formatCurrency(data.tax, showDecimals)}</span>
            </div>
          )}
          {showTotal && (
            <div className="flex justify-between py-3" style={{ borderBottom: `2px solid ${primaryColor}` }}>
              <span className="font-bold text-lg" style={{ color: primaryColor }}>Total:</span>
              <span className="font-bold text-lg" style={{ color: primaryColor }}>{formatCurrency(data.total, showDecimals)}</span>
            </div>
          )}
        </div>
      </div>

      {settings?.visibleFields.paymentInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Informasi Pembayaran:</h4>
          <p 
            className="text-gray-700"
            style={{ 
              color: data.paymentInfo ? 'inherit' : '#9ca3af',
              fontStyle: data.paymentInfo ? 'normal' : 'italic',
              opacity: data.paymentInfo ? 1 : 0.7
            }}
          >
            {data.paymentInfo || 'Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx'}
          </p>
        </div>
      )}

      {settings?.visibleFields.notes && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Catatan:</h4>
          <p 
            className="text-gray-700"
            style={{ 
              color: data.notes ? 'inherit' : '#9ca3af',
              fontStyle: data.notes ? 'normal' : 'italic',
              opacity: data.notes ? 1 : 0.7
            }}
          >
            {data.notes || 'Terima kasih atas kepercayaan Anda.'}
          </p>
        </div>
      )}

      {/* Signature Section */}
      <div className="mt-16 mb-8">
        <div className="flex justify-end">
          <div className="w-72 text-center">
            <p className="mb-2 text-gray-700 text-left">Hormat kami,</p>
            {/* Ruang kosong untuk tanda tangan manual */}
            <div style={{ height: '100px' }}></div>
            {/* Nama dan Jabatan dengan garis di tengah */}
            <div className="pb-2">
              <p 
                className="text-center font-semibold text-gray-900"
                style={{ 
                  color: data.signatureName ? 'inherit' : '#9ca3af',
                  fontStyle: data.signatureName ? 'normal' : 'italic',
                  opacity: data.signatureName ? 1 : 0.7
                }}
              >
                {data.signatureName || '________________'}
              </p>
              <div className="border-t-2 border-gray-900 pt-1 mb-2"></div>
              <p 
                className="text-center text-gray-600"
                style={{ 
                  color: data.signatureTitle ? 'inherit' : '#9ca3af',
                  fontStyle: data.signatureTitle ? 'normal' : 'italic',
                  opacity: data.signatureTitle ? 1 : 0.7
                }}
              >
                {data.signatureTitle || 'Jabatan'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
