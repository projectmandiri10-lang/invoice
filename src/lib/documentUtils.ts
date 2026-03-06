import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { AppPlan } from '@/contexts/AuthContext';
import type { InvoiceData } from '@/types/document';
import {
  formatCurrency as formatCurrencyLocalized,
  formatDate as formatDateLocalized,
  getMoneyWordsSuffix,
  numberToWords as numberToWordsLocalized,
  resolveInitialLocale,
  type Locale,
} from '@/lib/i18n';

const pdfCopy = {
  en: {
    invoiceNumber: 'No',
    date: 'Date',
    dueDate: 'Due Date',
    from: 'From:',
    to: 'To:',
    description: 'Description',
    unitPrice: 'Unit Price',
    subtotal: 'Subtotal:',
    discount: 'Discount:',
    tax: 'Tax',
    total: 'Total:',
    paymentInfo: 'Payment Information:',
    notes: 'Notes:',
    signature: 'Regards,',
    watermark: 'Created with idCashier Invoice Generator',
    deliveryNote: 'DELIVERY NOTE',
    deliveryNumber: 'Delivery Note No.',
    sender: 'Sender:',
    recipient: 'Recipient:',
    senderSignature: 'Sender,',
    itemDescription: 'Item Description',
    unit: 'Unit',
    receipt: 'RECEIPT',
    receivedFrom: 'Received from',
    amount: 'Amount',
    amountInWords: 'Amount in words',
    forPayment: 'For payment',
    paymentMethod: 'Payment method',
    receiver: 'Receiver,',
  },
  id: {
    invoiceNumber: 'No',
    date: 'Tanggal',
    dueDate: 'Jatuh Tempo',
    from: 'Dari:',
    to: 'Kepada:',
    description: 'Deskripsi',
    unitPrice: 'Harga Satuan',
    subtotal: 'Subtotal:',
    discount: 'Diskon:',
    tax: 'Pajak',
    total: 'Total:',
    paymentInfo: 'Informasi Pembayaran:',
    notes: 'Catatan:',
    signature: 'Hormat kami,',
    watermark: 'Dibuat dengan idCashier Invoice Generator',
    deliveryNote: 'SURAT JALAN',
    deliveryNumber: 'No. Surat Jalan',
    sender: 'Pengirim:',
    recipient: 'Penerima:',
    senderSignature: 'Pengirim,',
    itemDescription: 'Deskripsi Barang',
    unit: 'Satuan',
    receipt: 'KWITANSI',
    receivedFrom: 'Sudah terima dari',
    amount: 'Uang sejumlah',
    amountInWords: 'Terbilang',
    forPayment: 'Untuk pembayaran',
    paymentMethod: 'Metode Pembayaran',
    receiver: 'Penerima,',
  },
} as const;

// Fungsi ini hanya digunakan untuk fallback jika diperlukan, bisa dihapus nanti.
function cloneAndClean(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('button').forEach(btn => btn.remove());
  clone.querySelectorAll('input').forEach(input => {
    const value = input.value;
    const parent = input.parentElement;
    if (parent) {
      const textNode = document.createTextNode(value);
      parent.replaceChild(textNode, input);
    }
  });
  clone.querySelectorAll('textarea').forEach(textarea => {
    const value = textarea.value;
    const parent = textarea.parentElement;
    if (parent) {
      const textNode = document.createTextNode(value);
      parent.replaceChild(textNode, textarea);
    }
  });
  clone.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable');
  });
  return clone;
}

export function formatCurrency(amount: number, showDecimals = false, locale: Locale = resolveInitialLocale()): string {
  return formatCurrencyLocalized(amount, showDecimals, locale);
}

export function formatDate(date: string, locale: Locale = resolveInitialLocale()): string {
  return formatDateLocalized(date, locale);
}

export function numberToWords(num: number, locale: Locale = resolveInitialLocale()): string {
  return numberToWordsLocalized(num, locale);
}

export function getInvoiceLabel(invoiceData?: Pick<InvoiceData, 'invoiceLabel'> | null): string {
  const label = invoiceData?.invoiceLabel?.trim();
  return label || 'INVOICE';
}

// --- PDF Generation Functions ---

export async function exportInvoiceToPDF(
  invoiceData: any,
  settings: any,
  userTier: AppPlan,
  locale: Locale = resolveInitialLocale()
) {
  const text = pdfCopy[locale];
  const doc = new jsPDF();
  let logoBottomY = 15;

  if (settings.logoUrl) {
    try {
      const response = await fetch(settings.logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const maxWidth = 25; // Ukuran logo
            const aspectRatio = img.width / img.height;
            const calculatedHeight = maxWidth / aspectRatio;
            doc.addImage(reader.result as string, 'PNG', 15, 15, maxWidth, calculatedHeight);
            logoBottomY = 15 + calculatedHeight;
            resolve();
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  doc.setFontSize(22);
  doc.setTextColor(settings.colorScheme.primary);
  doc.text(getInvoiceLabel(invoiceData), 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 50);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${text.invoiceNumber}: ${invoiceData.invoiceNumber}`, 15, startY);
  doc.text(`${text.date}: ${formatDate(invoiceData.invoiceDate, locale)}`, 195, startY, { align: 'right' });
  if (settings.visibleFields.dueDate) {
    doc.text(`${text.dueDate}: ${formatDate(invoiceData.dueDate, locale)}`, 195, startY + 5, { align: 'right' });
  }

  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(text.from, 15, startY + 15);
  doc.text(text.to, 110, startY + 15);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(invoiceData.companyName, 15, startY + 22);
  doc.text(invoiceData.clientName, 110, startY + 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoiceData.companyAddress, 15, startY + 28, { maxWidth: 80 });
  doc.text(invoiceData.clientAddress, 110, startY + 28, { maxWidth: 80 });

  const tableColumn = [text.invoiceNumber, text.description, 'Qty', text.unitPrice, 'Total'];
  const tableRows: any[][] = [];
  invoiceData.items.forEach((item: any, index: number) => {
    tableRows.push([
      index + 1,
      item.description,
      item.quantity,
      formatCurrency(item.unitPrice, settings.visibleFields.showDecimals, locale),
      formatCurrency(item.total, settings.visibleFields.showDecimals, locale)
    ]);
  });

  autoTable(doc, {
    startY: startY + 40,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: settings.colorScheme.primary, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY;
  const showSubtotal = settings.visibleFields.subtotal !== false;
  const showDiscount = settings.visibleFields.discount === true;
  const showTax = settings.visibleFields.tax !== false;
  const showTotal = settings.visibleFields.total !== false;
  const discountValue = Math.max(0, invoiceData.discount || 0);

  let totalsY = finalY + 10;
  const totalsLabelX = 140;
  const totalsValueX = 195;
  const totalsLineHeight = 7;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');

  if (showSubtotal) {
    doc.text(text.subtotal, totalsLabelX, totalsY);
    doc.text(formatCurrency(invoiceData.subtotal, settings.visibleFields.showDecimals, locale), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showDiscount) {
    doc.text(text.discount, totalsLabelX, totalsY);
    doc.text(formatCurrency(-discountValue, settings.visibleFields.showDecimals, locale), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showTax) {
    doc.text(`${text.tax} (${invoiceData.taxPercentage}%):`, totalsLabelX, totalsY);
    doc.text(formatCurrency(invoiceData.tax, settings.visibleFields.showDecimals, locale), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showTotal) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(settings.colorScheme.primary);
    doc.text(text.total, totalsLabelX, totalsY + 2);
    doc.text(formatCurrency(invoiceData.total, settings.visibleFields.showDecimals, locale), totalsValueX, totalsY + 2, { align: 'right' });
    totalsY += 12;
  }

  let notesY = totalsY + 15;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');

  if (settings.visibleFields.paymentInfo) {
    doc.text(text.paymentInfo, 15, notesY);
    doc.text(invoiceData.paymentInfo, 15, notesY + 5, { maxWidth: 90 });
  }

  if (settings.visibleFields.notes) {
    notesY += settings.visibleFields.paymentInfo ? 20 : 0;
    doc.text(text.notes, 15, notesY);
    doc.text(invoiceData.notes, 15, notesY + 5, { maxWidth: 90 });
  }

  doc.text(text.signature, 160, notesY + 30);
  doc.text(invoiceData.signatureName || '', 160, notesY + 55);
  doc.line(160, notesY + 57, 195, notesY + 57);
  doc.text(invoiceData.signatureTitle || '', 160, notesY + 62);
  
  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(text.watermark, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`${locale === 'id' ? 'Invoice' : 'Invoice'}-${invoiceData.invoiceNumber}.pdf`);
}

export async function exportSuratJalanToPDF(
  suratJalanData: any,
  settings: any,
  userTier: AppPlan,
  locale: Locale = resolveInitialLocale()
) {
  const text = pdfCopy[locale];
  const doc = new jsPDF();
  let logoBottomY = 15;

  if (settings.logoUrl) {
    try {
      const response = await fetch(settings.logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const maxWidth = 25;
            const aspectRatio = img.width / img.height;
            const calculatedHeight = maxWidth / aspectRatio;
            doc.addImage(reader.result as string, 'PNG', 15, 15, maxWidth, calculatedHeight);
            logoBottomY = 15 + calculatedHeight;
            resolve();
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  doc.setFontSize(22);
  doc.setTextColor(settings.colorScheme.secondary);
  doc.text(text.deliveryNote, 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 50);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(suratJalanData.companyName, 15, startY);
  doc.text(`${text.deliveryNumber}: ${suratJalanData.suratJalanNumber}`, 195, startY, { align: 'right' });
  doc.text(suratJalanData.companyAddress, 15, startY + 5, { maxWidth: 80 });
  doc.text(`${text.date}: ${formatDate(suratJalanData.suratJalanDate, locale)}`, 195, startY + 5, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(text.sender, 15, startY + 20);
  doc.text(text.recipient, 110, startY + 20);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(suratJalanData.senderName, 15, startY + 27);
  doc.text(suratJalanData.recipientName, 110, startY + 27);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(suratJalanData.senderAddress, 15, startY + 33, { maxWidth: 80 });
  doc.text(suratJalanData.recipientAddress, 110, startY + 33, { maxWidth: 80 });

  const tableColumn = [text.invoiceNumber, text.itemDescription, 'Qty', text.unit];
  const tableRows: any[][] = [];
  suratJalanData.items.forEach((item: any, index: number) => {
    tableRows.push([index + 1, item.description, item.quantity, item.unit]);
  });

  autoTable(doc, {
    startY: startY + 50,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: settings.colorScheme.secondary, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' } }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(text.senderSignature, 15, finalY + 20);
  doc.line(15, finalY + 42, 60, finalY + 42);
  doc.text(suratJalanData.senderSignatureName || '', 15, finalY + 47);
  doc.text(text.receiver, 150, finalY + 20);
  doc.line(150, finalY + 42, 195, finalY + 42);
  doc.text(suratJalanData.recipientSignatureName || '', 150, finalY + 47);

  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(text.watermark, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`${locale === 'id' ? 'SuratJalan' : 'DeliveryNote'}-${suratJalanData.suratJalanNumber}.pdf`);
}

export async function exportKwitansiToPDF(
  kwitansiData: any,
  settings: any,
  userTier: AppPlan,
  locale: Locale = resolveInitialLocale()
) {
  const text = pdfCopy[locale];
  const doc = new jsPDF();
  let logoBottomY = 15;

  if (settings.logoUrl) {
    try {
      const response = await fetch(settings.logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const maxWidth = 25;
            const aspectRatio = img.width / img.height;
            const calculatedHeight = maxWidth / aspectRatio;
            doc.addImage(reader.result as string, 'PNG', 15, 15, maxWidth, calculatedHeight);
            logoBottomY = 15 + calculatedHeight;
            resolve();
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  doc.setFontSize(22);
  doc.setTextColor(settings.colorScheme.accent);
  doc.text(text.receipt, 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 40);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`No: ${kwitansiData.kwitansiNumber}`, 195, startY, { align: 'right' });
  doc.text(`${text.date}: ${formatDate(kwitansiData.kwitansiDate, locale)}`, 195, startY + 5, { align: 'right' });

  doc.setFontSize(12);
  doc.setTextColor(0);
  
  const details = [
    { label: text.receivedFrom, value: kwitansiData.receivedFrom },
    { label: text.amount, value: formatCurrency(kwitansiData.amount, settings.visibleFields.showDecimals, locale) },
    { label: text.amountInWords, value: `${numberToWords(kwitansiData.amount, locale)} ${getMoneyWordsSuffix(locale)}` },
    { label: text.forPayment, value: kwitansiData.description },
    { label: text.paymentMethod, value: kwitansiData.paymentMethod },
  ];
  
  let yPosition = startY + 30;
  const labelX = 15;
  const maxLabelWidth = Math.max(...details.map((detail) => doc.getTextWidth(detail.label)));
  const colonX = labelX + maxLabelWidth + 2;
  const valueX = colonX + 4;
  const valueMaxWidth = 195 - valueX;
  details.forEach(detail => {
    doc.text(detail.label, labelX, yPosition);
    doc.text(':', colonX, yPosition);
    doc.text(detail.value, valueX, yPosition, { maxWidth: valueMaxWidth });
    doc.line(valueX, yPosition + 2, 195, yPosition + 2);
    yPosition += 10;
  });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(text.receiver, 160, yPosition + 30);
  doc.text(kwitansiData.receiverName || '', 160, yPosition + 55);
  doc.line(160, yPosition + 57, 195, yPosition + 57);
  doc.text(kwitansiData.receiverPosition || '', 160, yPosition + 62);
  
  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(text.watermark, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`${locale === 'id' ? 'Kwitansi' : 'Receipt'}-${kwitansiData.kwitansiNumber}.pdf`);
}
