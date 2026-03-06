export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyNPWP: string;
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  clientEmail?: string;
  clientNPWP?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  tax: number;
  taxPercentage: number;
  total: number;
  notes: string;
  paymentInfo: string;
  signatureName?: string;
  signatureTitle?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SuratJalanData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  suratJalanNumber: string;
  suratJalanDate: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  items: SuratJalanItem[];
  deliveryInfo: string;
  notes: string;
  courierName: string;
  recipientSignature: string;
  senderSignatureName?: string;
  recipientSignatureName?: string;
}

export interface SuratJalanItem {
  description: string;
  quantity: number;
  unit: string;
  price?: number;
  notes?: string;
}

export interface KwitansiData {
  companyName: string;
  companyAddress: string;
  kwitansiNumber: string;
  kwitansiDate: string;
  receivedFrom: string;
  amount: number;
  amountInWords: string;
  description: string;
  paymentMethod: string;
  receiverName: string;
  receiverPosition: string;
  notes: string;
}

export type DocumentType = 'invoice' | 'surat_jalan' | 'kwitansi';

export interface Document {
  id: string;
  user_id: string;
  title: string;
  document_type: DocumentType;
  content: InvoiceData | SuratJalanData | KwitansiData;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  document_type: DocumentType;
  template_data: InvoiceData | SuratJalanData | KwitansiData;
  is_default: boolean;
  created_at: string;
}
