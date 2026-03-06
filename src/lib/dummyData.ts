import { InvoiceData, SuratJalanData, KwitansiData } from '@/types/document';
import { numberToWords } from './documentUtils';

// --- Data Contoh untuk Invoice ---
const dummyInvoiceSubtotal = 1500000 + 250000;
const dummyInvoiceTax = dummyInvoiceSubtotal * 0.11;
const dummyInvoiceTotal = dummyInvoiceSubtotal + dummyInvoiceTax;

export const dummyInvoiceData: InvoiceData = {
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
  invoiceNumber: 'INV/2024/07/001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  items: [
    { description: 'Jasa Konsultasi IT (5 jam)', quantity: 5, unitPrice: 300000, total: 1500000 },
    { description: 'Pengembangan Website - Modul A', quantity: 1, unitPrice: 250000, total: 250000 },
  ],
  subtotal: dummyInvoiceSubtotal,
  discount: 0,
  tax: dummyInvoiceTax,
  taxPercentage: 11,
  total: dummyInvoiceTotal,
  notes: 'Pembayaran dapat dilakukan melalui transfer bank.',
  paymentInfo: 'Bank ABC, No. Rek: 123-456-7890 a/n PT. Solusi Teknologi Kreatif',
  signatureName: 'Budi Santoso',
  signatureTitle: 'Direktur Utama',
};

// --- Data Contoh untuk Surat Jalan ---
export const dummySuratJalanData: SuratJalanData = {
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
    { description: 'Komputer All-in-One', quantity: 10, unit: 'Unit' },
    { description: 'Printer Laserjet', quantity: 5, unit: 'Unit' },
  ],
  deliveryInfo: 'Dikirim oleh Budi, Mobil Box B 1234 XYZ',
  notes: 'Harap diperiksa saat serah terima barang.',
  courierName: 'Budi',
  recipientSignature: '',
  recipientSignatureName: 'Andi',
  senderSignatureName: 'Rina',
};

// --- Data Contoh untuk Kwitansi ---
const dummyKwitansiAmount = 1942500;
export const dummyKwitansiData: KwitansiData = {
  companyName: 'PT. Solusi Teknologi Kreatif',
  companyAddress: 'Jl. Jenderal Sudirman No. 123, Jakarta',
  kwitansiNumber: 'KW/2024/07/003',
  kwitansiDate: new Date().toISOString().split('T')[0],
  receivedFrom: 'PT. Mitra Usaha Maju',
  amount: dummyKwitansiAmount,
  amountInWords: numberToWords(dummyKwitansiAmount) + ' rupiah',
  description: 'Pembayaran untuk Invoice No. INV/2024/07/001.',
  paymentMethod: 'Transfer Bank',
  receiverName: 'Citra Lestari',
  receiverPosition: 'Kasir',
  notes: 'Kwitansi ini sah tanpa materai.',
};
