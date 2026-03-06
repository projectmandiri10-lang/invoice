import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { AppPlan } from '@/contexts/AuthContext';

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

export function formatCurrency(amount: number, showDecimals = false): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function numberToWords(num: number): string {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];

  if (num === 0) return 'nol';
  if (num < 10) return units[num];
  if (num >= 10 && num < 20) return teens[num - 10];
  if (num >= 20 && num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return tens[ten] + (unit > 0 ? ' ' + units[unit] : '');
  }
  if (num >= 100 && num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredWord = hundred === 1 ? 'seratus' : units[hundred] + ' ratus';
    return hundredWord + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  if (num >= 1000 && num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandWord = thousand === 1 ? 'seribu' : numberToWords(thousand) + ' ribu';
    return thousandWord + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  if (num >= 1000000) {
    const million = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return numberToWords(million) + ' juta' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }

  return num.toString();
}

// --- PDF Generation Functions ---

export async function exportInvoiceToPDF(invoiceData: any, settings: any, userTier: AppPlan) {
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
  doc.text('INVOICE', 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 50);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`No: ${invoiceData.invoiceNumber}`, 15, startY);
  doc.text(`Tanggal: ${formatDate(invoiceData.invoiceDate)}`, 195, startY, { align: 'right' });
  if (settings.visibleFields.dueDate) {
    doc.text(`Jatuh Tempo: ${formatDate(invoiceData.dueDate)}`, 195, startY + 5, { align: 'right' });
  }

  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text('Dari:', 15, startY + 15);
  doc.text('Kepada:', 110, startY + 15);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(invoiceData.companyName, 15, startY + 22);
  doc.text(invoiceData.clientName, 110, startY + 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoiceData.companyAddress, 15, startY + 28, { maxWidth: 80 });
  doc.text(invoiceData.clientAddress, 110, startY + 28, { maxWidth: 80 });

  const tableColumn = ["No", "Deskripsi", "Qty", "Harga Satuan", "Total"];
  const tableRows: any[][] = [];
  invoiceData.items.forEach((item: any, index: number) => {
    tableRows.push([
      index + 1,
      item.description,
      item.quantity,
      formatCurrency(item.unitPrice, settings.visibleFields.showDecimals),
      formatCurrency(item.total, settings.visibleFields.showDecimals)
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
    doc.text('Subtotal:', totalsLabelX, totalsY);
    doc.text(formatCurrency(invoiceData.subtotal, settings.visibleFields.showDecimals), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showDiscount) {
    doc.text('Diskon:', totalsLabelX, totalsY);
    doc.text(formatCurrency(-discountValue, settings.visibleFields.showDecimals), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showTax) {
    doc.text(`Pajak (${invoiceData.taxPercentage}%):`, totalsLabelX, totalsY);
    doc.text(formatCurrency(invoiceData.tax, settings.visibleFields.showDecimals), totalsValueX, totalsY, { align: 'right' });
    totalsY += totalsLineHeight;
  }

  if (showTotal) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(settings.colorScheme.primary);
    doc.text('Total:', totalsLabelX, totalsY + 2);
    doc.text(formatCurrency(invoiceData.total, settings.visibleFields.showDecimals), totalsValueX, totalsY + 2, { align: 'right' });
    totalsY += 12;
  }

  let notesY = totalsY + 15;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');

  if (settings.visibleFields.paymentInfo) {
    doc.text('Informasi Pembayaran:', 15, notesY);
    doc.text(invoiceData.paymentInfo, 15, notesY + 5, { maxWidth: 90 });
  }

  if (settings.visibleFields.notes) {
    notesY += settings.visibleFields.paymentInfo ? 20 : 0;
    doc.text('Catatan:', 15, notesY);
    doc.text(invoiceData.notes, 15, notesY + 5, { maxWidth: 90 });
  }

  doc.text('Hormat kami,', 160, notesY + 30);
  doc.text(invoiceData.signatureName || '', 160, notesY + 55);
  doc.line(160, notesY + 57, 195, notesY + 57);
  doc.text(invoiceData.signatureTitle || '', 160, notesY + 62);
  
  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Dibuat dengan idCashier Invoice Generator', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
}

export async function exportSuratJalanToPDF(suratJalanData: any, settings: any, userTier: AppPlan) {
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
  doc.text('SURAT JALAN', 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 50);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(suratJalanData.companyName, 15, startY);
  doc.text(`No. Surat Jalan: ${suratJalanData.suratJalanNumber}`, 195, startY, { align: 'right' });
  doc.text(suratJalanData.companyAddress, 15, startY + 5, { maxWidth: 80 });
  doc.text(`Tanggal: ${formatDate(suratJalanData.suratJalanDate)}`, 195, startY + 5, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text('Pengirim:', 15, startY + 20);
  doc.text('Penerima:', 110, startY + 20);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(suratJalanData.senderName, 15, startY + 27);
  doc.text(suratJalanData.recipientName, 110, startY + 27);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(suratJalanData.senderAddress, 15, startY + 33, { maxWidth: 80 });
  doc.text(suratJalanData.recipientAddress, 110, startY + 33, { maxWidth: 80 });

  const tableColumn = ["No", "Deskripsi Barang", "Qty", "Satuan"];
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
  doc.text('Pengirim,', 15, finalY + 20);
  doc.line(15, finalY + 42, 60, finalY + 42);
  doc.text(suratJalanData.senderSignatureName || '', 15, finalY + 47);
  doc.text('Penerima,', 150, finalY + 20);
  doc.line(150, finalY + 42, 195, finalY + 42);
  doc.text(suratJalanData.recipientSignatureName || '', 150, finalY + 47);

  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Dibuat dengan idCashier Invoice Generator', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`SuratJalan-${suratJalanData.suratJalanNumber}.pdf`);
}

export async function exportKwitansiToPDF(kwitansiData: any, settings: any, userTier: AppPlan) {
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
  doc.text('KWITANSI', 105, 30, { align: 'center' });

  const startY = Math.max(logoBottomY + 10, 40);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`No: ${kwitansiData.kwitansiNumber}`, 195, startY, { align: 'right' });
  doc.text(`Tanggal: ${formatDate(kwitansiData.kwitansiDate)}`, 195, startY + 5, { align: 'right' });

  doc.setFontSize(12);
  doc.setTextColor(0);
  
  const details = [
    { label: 'Sudah terima dari', value: kwitansiData.receivedFrom },
    { label: 'Uang sejumlah', value: formatCurrency(kwitansiData.amount, settings.visibleFields.showDecimals) },
    { label: 'Terbilang', value: `${numberToWords(kwitansiData.amount)} rupiah` },
    { label: 'Untuk pembayaran', value: kwitansiData.description },
    { label: 'Metode Pembayaran', value: kwitansiData.paymentMethod },
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
  doc.text('Penerima,', 160, yPosition + 30);
  doc.text(kwitansiData.receiverName || '', 160, yPosition + 55);
  doc.line(160, yPosition + 57, 195, yPosition + 57);
  doc.text(kwitansiData.receiverPosition || '', 160, yPosition + 62);
  
  const addWatermark = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Dibuat dengan idCashier Invoice Generator', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

    if (userTier === 'free') {
    addWatermark();
  }
  doc.save(`Kwitansi-${kwitansiData.kwitansiNumber}.pdf`);
}
