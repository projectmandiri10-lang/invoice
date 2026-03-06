import { getMoneyWordsSuffix, numberToWords, type Locale } from './i18n';
import { InvoiceData, KwitansiData, SuratJalanData } from '@/types/document';

type LocalizedText = Record<Locale, string>;

function pick(locale: Locale, value: LocalizedText) {
  return value[locale];
}

function replaceLocalizedValue(
  value: string | undefined,
  locale: Locale,
  candidates: LocalizedText[]
) {
  if (typeof value !== 'string') return value;

  for (const candidate of candidates) {
    if (value === candidate.en || value === candidate.id) {
      return candidate[locale];
    }
  }

  return value;
}

const invoiceText = {
  companyName: { en: 'Company Name', id: 'Nama Perusahaan' },
  companyAddress: { en: 'Company Address', id: 'Alamat Perusahaan' },
  companyPhone: { en: 'Phone: (021) xxx-xxxx', id: 'Telp: (021) xxx-xxxx' },
  companyEmail: { en: 'company@example.com', id: 'email@perusahaan.com' },
  companyTaxId: { en: 'Tax ID: xx.xxx.xxx.x-xxx.xxx', id: 'NPWP: xx.xxx.xxx.x-xxx.xxx' },
  clientName: { en: 'Client Name', id: 'Nama Klien' },
  clientAddress: { en: 'Client Address', id: 'Alamat Klien' },
  clientTaxId: { en: 'Tax ID', id: 'NPWP' },
  itemDescription: { en: 'Item Description', id: 'Deskripsi Item' },
  newItem: { en: 'New Item', id: 'Item Baru' },
  paymentPlaceholder: {
    en: 'Transfer to: Bank BCA - Account No. xxxx-xxxx-xxxx',
    id: 'Transfer ke: Bank BCA - No. Rek: xxxx-xxxx-xxxx',
  },
  notePlaceholder: {
    en: 'Thank you for your trust.',
    id: 'Terima kasih atas kepercayaan Anda.',
  },
  sampleItemOne: {
    en: 'IT Consulting Services (5 hours)',
    id: 'Jasa Konsultasi IT (5 jam)',
  },
  sampleItemTwo: {
    en: 'Website Development - Module A',
    id: 'Pengembangan Website - Modul A',
  },
  sampleNote: {
    en: 'Payment can be made via bank transfer.',
    id: 'Pembayaran dapat dilakukan melalui transfer bank.',
  },
  samplePaymentInfo: {
    en: 'Bank ABC, Account No. 123-456-7890 a/n PT. Solusi Teknologi Kreatif',
    id: 'Bank ABC, No. Rek: 123-456-7890 a/n PT. Solusi Teknologi Kreatif',
  },
  signatureName: { en: 'Name', id: 'Nama' },
  signatureTitle: { en: 'Title', id: 'Jabatan' },
} as const;

const suratJalanText = {
  companyName: { en: 'Company Name', id: 'Nama Perusahaan' },
  companyAddress: { en: 'Company Address', id: 'Alamat Perusahaan' },
  companyPhone: { en: 'Phone: (021) xxx-xxxx', id: 'Telp: (021) xxx-xxxx' },
  senderName: { en: 'Sender Name', id: 'Nama Pengirim' },
  senderAddress: { en: 'Sender Address', id: 'Alamat Pengirim' },
  recipientName: { en: 'Recipient Name', id: 'Nama Penerima' },
  recipientAddress: { en: 'Recipient Address', id: 'Alamat Penerima' },
  itemDescription: { en: 'Item Description', id: 'Deskripsi Barang' },
  deliveryPlaceholder: {
    en: 'Delivered via: Courier / Expedition',
    id: 'Dikirim dengan: Ekspedisi/Kurir',
  },
  notesPlaceholder: {
    en: 'Additional delivery notes...',
    id: 'Catatan tambahan...',
  },
  templateNote: {
    en: 'Goods received cannot be returned.',
    id: 'Barang yang sudah diterima tidak dapat dikembalikan.',
  },
  sampleItemOne: {
    en: 'All-in-One Computer',
    id: 'Komputer All-in-One',
  },
  sampleItemTwo: {
    en: 'LaserJet Printer',
    id: 'Printer Laserjet',
  },
  sampleDeliveryInfo: {
    en: 'Delivered by Budi, box truck B 1234 XYZ',
    id: 'Dikirim oleh Budi, Mobil Box B 1234 XYZ',
  },
  sampleNote: {
    en: 'Please inspect the goods upon handover.',
    id: 'Harap diperiksa saat serah terima barang.',
  },
} as const;

const kwitansiText = {
  companyName: { en: 'Company Name', id: 'Nama Perusahaan' },
  companyAddress: { en: 'Company Address', id: 'Alamat Perusahaan' },
  receivedFrom: { en: 'Payer Name', id: 'Nama Pembayar' },
  descriptionPlaceholder: { en: 'For payment:', id: 'Untuk pembayaran:' },
  paymentMethodPlaceholder: { en: 'Cash / Bank Transfer', id: 'Tunai/Transfer' },
  receiverName: { en: 'Receiver Name', id: 'Nama Penerima' },
  receiverTitle: { en: 'Title', id: 'Jabatan' },
  amountInWordsPlaceholder: { en: 'Amount in words', id: 'Terbilang' },
  sampleDescription: {
    en: 'Payment for Invoice No. INV/2024/07/001.',
    id: 'Pembayaran untuk Invoice No. INV/2024/07/001.',
  },
  samplePaymentMethod: { en: 'Bank Transfer', id: 'Transfer Bank' },
  sampleReceiverTitle: { en: 'Cashier', id: 'Kasir' },
  sampleNote: {
    en: 'This receipt is valid without stamp duty.',
    id: 'Kwitansi ini sah tanpa materai.',
  },
} as const;

function getLocalizedAmountInWords(amount: number, locale: Locale) {
  return `${numberToWords(amount, locale)} ${getMoneyWordsSuffix(locale)}`;
}

export function createDummyInvoiceData(locale: Locale): InvoiceData {
  const subtotal = 1500000 + 250000;
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return {
    companyName: 'PT. Solusi Teknologi Kreatif',
    companyAddress: 'Jl. Jenderal Sudirman No. 123, Jakarta',
    companyPhone: '021-555-1234',
    companyEmail: 'kontak@solusitek.co.id',
    companyNPWP: '01.234.567.8-901.000',
    clientName: 'PT. Mitra Usaha Maju',
    clientAddress: 'Jl. Gatot Subroto No. 45, Jakarta',
    clientPhone: '0812-3456-7890',
    clientEmail: 'pembelian@mitrausaha.co.id',
    clientNPWP: '09.876.543.2-109.000',
    invoiceLabel: 'INVOICE',
    invoiceNumber: 'INV/2024/07/001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { description: pick(locale, invoiceText.sampleItemOne), quantity: 5, unitPrice: 300000, total: 1500000 },
      { description: pick(locale, invoiceText.sampleItemTwo), quantity: 1, unitPrice: 250000, total: 250000 },
    ],
    subtotal,
    discount: 0,
    tax,
    taxPercentage: 11,
    total,
    notes: pick(locale, invoiceText.sampleNote),
    paymentInfo: pick(locale, invoiceText.samplePaymentInfo),
    signatureName: 'Budi Santoso',
    signatureTitle: locale === 'id' ? 'Direktur Utama' : 'Managing Director',
  };
}

export function createDummySuratJalanData(locale: Locale): SuratJalanData {
  return {
    companyName: 'PT. Logistik Cepat',
    companyAddress: 'Jl. Raya Bogor KM 25, Jakarta Timur',
    companyPhone: '021-876-5432',
    suratJalanNumber: 'SJ/2024/07/002',
    suratJalanDate: new Date().toISOString().split('T')[0],
    senderName: 'Gudang Pusat PT. Logistik Cepat',
    senderAddress: 'Jl. Raya Bogor KM 25, Jakarta Timur',
    recipientName: 'Toko Elektronik Jaya',
    recipientAddress: 'Jl. Hayam Wuruk No. 101, Jakarta Barat',
    items: [
      { description: pick(locale, suratJalanText.sampleItemOne), quantity: 10, unit: 'Unit' },
      { description: pick(locale, suratJalanText.sampleItemTwo), quantity: 5, unit: 'Unit' },
    ],
    deliveryInfo: pick(locale, suratJalanText.sampleDeliveryInfo),
    notes: pick(locale, suratJalanText.sampleNote),
    courierName: 'Budi',
    recipientSignature: '',
    recipientSignatureName: 'Andi',
    senderSignatureName: 'Rina',
  };
}

export function createDummyKwitansiData(locale: Locale): KwitansiData {
  const amount = 1942500;

  return {
    companyName: 'PT. Solusi Teknologi Kreatif',
    companyAddress: 'Jl. Jenderal Sudirman No. 123, Jakarta',
    kwitansiNumber: 'KW/2024/07/003',
    kwitansiDate: new Date().toISOString().split('T')[0],
    receivedFrom: 'PT. Mitra Usaha Maju',
    amount,
    amountInWords: getLocalizedAmountInWords(amount, locale),
    description: pick(locale, kwitansiText.sampleDescription),
    paymentMethod: pick(locale, kwitansiText.samplePaymentMethod),
    receiverName: 'Citra Lestari',
    receiverPosition: pick(locale, kwitansiText.sampleReceiverTitle),
    notes: pick(locale, kwitansiText.sampleNote),
  };
}

export function localizeInvoiceData(data: InvoiceData, locale: Locale): InvoiceData {
  return {
    ...data,
    companyName: replaceLocalizedValue(data.companyName, locale, [invoiceText.companyName]) || data.companyName,
    companyAddress:
      replaceLocalizedValue(data.companyAddress, locale, [invoiceText.companyAddress]) || data.companyAddress,
    companyPhone: replaceLocalizedValue(data.companyPhone, locale, [invoiceText.companyPhone]) || data.companyPhone,
    companyEmail: replaceLocalizedValue(data.companyEmail, locale, [invoiceText.companyEmail]) || data.companyEmail,
    companyNPWP:
      replaceLocalizedValue(data.companyNPWP, locale, [invoiceText.companyTaxId]) || data.companyNPWP,
    clientName: replaceLocalizedValue(data.clientName, locale, [invoiceText.clientName]) || data.clientName,
    clientAddress:
      replaceLocalizedValue(data.clientAddress, locale, [invoiceText.clientAddress]) || data.clientAddress,
    clientNPWP: replaceLocalizedValue(data.clientNPWP, locale, [invoiceText.clientTaxId]),
    items: data.items.map((item) => ({
      ...item,
      description:
        replaceLocalizedValue(item.description, locale, [
          invoiceText.itemDescription,
          invoiceText.newItem,
          invoiceText.sampleItemOne,
          invoiceText.sampleItemTwo,
        ]) || item.description,
    })),
    paymentInfo:
      replaceLocalizedValue(data.paymentInfo, locale, [
        invoiceText.paymentPlaceholder,
        invoiceText.samplePaymentInfo,
      ]) || data.paymentInfo,
    notes:
      replaceLocalizedValue(data.notes, locale, [invoiceText.notePlaceholder, invoiceText.sampleNote]) || data.notes,
    signatureName: replaceLocalizedValue(data.signatureName, locale, [invoiceText.signatureName]) || data.signatureName,
    signatureTitle:
      replaceLocalizedValue(data.signatureTitle, locale, [invoiceText.signatureTitle]) || data.signatureTitle,
  };
}

export function localizeSuratJalanData(data: SuratJalanData, locale: Locale): SuratJalanData {
  return {
    ...data,
    companyName: replaceLocalizedValue(data.companyName, locale, [suratJalanText.companyName]) || data.companyName,
    companyAddress:
      replaceLocalizedValue(data.companyAddress, locale, [suratJalanText.companyAddress]) || data.companyAddress,
    companyPhone:
      replaceLocalizedValue(data.companyPhone, locale, [suratJalanText.companyPhone]) || data.companyPhone,
    senderName: replaceLocalizedValue(data.senderName, locale, [suratJalanText.senderName]) || data.senderName,
    senderAddress:
      replaceLocalizedValue(data.senderAddress, locale, [suratJalanText.senderAddress]) || data.senderAddress,
    recipientName:
      replaceLocalizedValue(data.recipientName, locale, [suratJalanText.recipientName]) || data.recipientName,
    recipientAddress:
      replaceLocalizedValue(data.recipientAddress, locale, [suratJalanText.recipientAddress]) ||
      data.recipientAddress,
    items: data.items.map((item) => ({
      ...item,
      description:
        replaceLocalizedValue(item.description, locale, [
          suratJalanText.itemDescription,
          suratJalanText.sampleItemOne,
          suratJalanText.sampleItemTwo,
        ]) || item.description,
    })),
    deliveryInfo:
      replaceLocalizedValue(data.deliveryInfo, locale, [
        suratJalanText.deliveryPlaceholder,
        suratJalanText.sampleDeliveryInfo,
      ]) || data.deliveryInfo,
    notes:
      replaceLocalizedValue(data.notes, locale, [
        suratJalanText.notesPlaceholder,
        suratJalanText.templateNote,
        suratJalanText.sampleNote,
      ]) || data.notes,
  };
}

export function localizeKwitansiData(data: KwitansiData, locale: Locale): KwitansiData {
  const currentGeneratedAmountInWords = getLocalizedAmountInWords(data.amount, locale);
  const fallbackGeneratedAmountInWords = getLocalizedAmountInWords(data.amount, locale === 'en' ? 'id' : 'en');
  const shouldRecomputeAmountInWords =
    !data.amountInWords ||
    data.amountInWords === currentGeneratedAmountInWords ||
    data.amountInWords === fallbackGeneratedAmountInWords ||
    data.amountInWords === kwitansiText.amountInWordsPlaceholder.en ||
    data.amountInWords === kwitansiText.amountInWordsPlaceholder.id;

  return {
    ...data,
    companyName: replaceLocalizedValue(data.companyName, locale, [kwitansiText.companyName]) || data.companyName,
    companyAddress:
      replaceLocalizedValue(data.companyAddress, locale, [kwitansiText.companyAddress]) || data.companyAddress,
    receivedFrom:
      replaceLocalizedValue(data.receivedFrom, locale, [kwitansiText.receivedFrom]) || data.receivedFrom,
    amountInWords: shouldRecomputeAmountInWords ? currentGeneratedAmountInWords : data.amountInWords,
    description:
      replaceLocalizedValue(data.description, locale, [
        kwitansiText.descriptionPlaceholder,
        kwitansiText.sampleDescription,
      ]) || data.description,
    paymentMethod:
      replaceLocalizedValue(data.paymentMethod, locale, [
        kwitansiText.paymentMethodPlaceholder,
        kwitansiText.samplePaymentMethod,
      ]) || data.paymentMethod,
    receiverName:
      replaceLocalizedValue(data.receiverName, locale, [kwitansiText.receiverName]) || data.receiverName,
    receiverPosition:
      replaceLocalizedValue(data.receiverPosition, locale, [
        kwitansiText.receiverTitle,
        kwitansiText.sampleReceiverTitle,
      ]) || data.receiverPosition,
    notes: replaceLocalizedValue(data.notes, locale, [kwitansiText.sampleNote]) || data.notes,
  };
}

export const dummyInvoiceData: InvoiceData = createDummyInvoiceData('en');
export const dummySuratJalanData: SuratJalanData = createDummySuratJalanData('en');
export const dummyKwitansiData: KwitansiData = createDummyKwitansiData('en');
