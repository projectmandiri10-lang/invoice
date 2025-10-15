import { NextRequest, NextResponse } from 'next/server'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface InvoiceSettings {
  // Font Settings
  fontFamily: string
  fontSize: string
  fontWeight: string
  
  // Color Settings
  backgroundColor: string
  textColor: string
  accentColor: string
  
  // Layout Settings
  containerWidth: string
  invoiceWidth: string
  invoiceHeight: string
  invoiceMargin: string
  invoicePadding: string
  
  // Border Settings
  borderWidth: string
  borderColor: string
  borderRadius: string
  
  // Shadow Settings
  shadowSize: string
  
  // Alignment Settings
  headerAlignment: string
  invoiceAlignment: string
}

interface TaxItem {
  id: string
  name: string
  rate: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceTitle: string
  date: string
  dueDate: string
  showDueDate: boolean
  logoUrl: string
  fromName: string
  fromEmail: string
  fromAddress: string
  toName: string
  toEmail: string
  toAddress: string
  items: InvoiceItem[]
  taxes: TaxItem[]
  notes: string
  currency: string
  language: string
  showDecimals: boolean
  settings?: InvoiceSettings // Optional settings for custom styling
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json()
    
    console.log('Received invoice data:', invoiceData)

    // Validate required fields
    if (!invoiceData.fromName || !invoiceData.toName) {
      console.log('Validation failed: Missing fromName or toName')
      return NextResponse.json(
        { error: 'Missing required fields: fromName and toName are required' },
        { status: 400 }
      )
    }

    if (!invoiceData.items || invoiceData.items.length === 0) {
      console.log('Validation failed: No items')
      return NextResponse.json(
        { error: 'Missing required fields: at least one item is required' },
        { status: 400 }
      )
    }

    // Filter out empty items
    const validItems = invoiceData.items.filter(item => 
      item.description && 
      item.description.trim() !== '' && 
      item.price > 0
    )
    if (validItems.length === 0) {
      console.log('Validation failed: No valid items')
      return NextResponse.json(
        { error: 'No valid items found. Each item must have a non-empty description and price > 0' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const totalTax = (invoiceData.taxes || []).reduce((sum, tax) => sum + (subtotal * (tax.rate / 100)), 0)
    const total = subtotal + totalTax

    console.log('Calculations:', { subtotal, totalTax, total })

    // Currency formatting function
    const getCurrencySymbol = (currencyCode: string) => {
      const currencies: { [key: string]: string } = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥',
        'INR': '₹', 'AUD': '$', 'CAD': '$', 'CHF': 'CHF', 'SEK': 'kr',
        'NOK': 'kr', 'DKK': 'kr', 'SGD': '$', 'HKD': '$', 'NZD': '$',
        'ZAR': 'R', 'KRW': '₩', 'MXN': '$', 'BRL': 'R$', 'RUB': '₽',
        'TRY': '₺', 'THB': '฿', 'IDR': 'Rp', 'MYR': 'RM', 'PHP': '₱',
        'VND': '₫', 'EGP': '£', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft',
        'ILS': '₪', 'AED': 'د.إ'
      }
      return currencies[currencyCode] || '$'
    }

    const formatCurrency = (amount: number) => {
      const symbol = getCurrencySymbol(invoiceData.currency || 'USD')
      return `${symbol}${amount.toFixed(invoiceData.showDecimals ? 2 : 0)}`
    }

    // Translation function for PDF
    const t = (key: string): string => {
      const translations: { [key: string]: { [lang: string]: string } } = {
        'from': {
          'en': 'From', 'es': 'De', 'fr': 'De', 'de': 'Von', 'it': 'Da',
          'pt': 'De', 'ru': 'От', 'ja': '差出人', 'zh': '发件人', 'ko': '발신인',
          'ar': 'من', 'hi': 'से', 'th': 'จาก', 'vi': 'Từ', 'id': 'Dari',
          'ms': 'Dari', 'tl': 'Mula sa', 'tr': 'Kimden', 'pl': 'Od',
          'nl': 'Van', 'sv': 'Från', 'no': 'Fra', 'da': 'Fra',
          'fi': 'Lähettäjä', 'el': 'Από', 'he': 'מאת', 'cs': 'Od',
          'hu': 'Feladó', 'ro': 'De la', 'uk': 'Від', 'bg': 'От',
          'hr': 'Od', 'sk': 'Od', 'sl': 'Od'
        },
        'to': {
          'en': 'To', 'es': 'Para', 'fr': 'À', 'de': 'An', 'it': 'A',
          'pt': 'Para', 'ru': 'Кому', 'ja': '宛先', 'zh': '收件人', 'ko': '수신인',
          'ar': 'إلى', 'hi': 'को', 'th': 'ถึง', 'vi': 'Đến', 'id': 'Kepada',
          'ms': 'Kepada', 'tl': 'Para sa', 'tr': 'Kime', 'pl': 'Do',
          'nl': 'Aan', 'sv': 'Till', 'no': 'Til', 'da': 'Til',
          'fi': 'Vastaanottaja', 'el': 'Προς', 'he': 'אל', 'cs': 'Komu',
          'hu': 'Címzett', 'ro': 'Către', 'uk': 'Кому', 'bg': 'До',
          'hr': 'Za', 'sk': 'Komu', 'sl': 'Za'
        },
        'description': {
          'en': 'Description', 'es': 'Descripción', 'fr': 'Description', 'de': 'Beschreibung',
          'it': 'Descrizione', 'pt': 'Descrição', 'ru': 'Описание', 'ja': '説明',
          'zh': '描述', 'ko': '설명', 'ar': 'الوصف', 'hi': 'विवरण',
          'th': 'คำอธิบาย', 'vi': 'Mô tả', 'id': 'Deskripsi', 'ms': 'Penerangan',
          'tl': 'Deskripsyon', 'tr': 'Açıklama', 'pl': 'Opis', 'nl': 'Beschrijving',
          'sv': 'Beskrivning', 'no': 'Beskrivelse', 'da': 'Beskrivelse',
          'fi': 'Kuvaus', 'el': 'Περιγραφή', 'he': 'תיאור', 'cs': 'Popis',
          'hu': 'Leírás', 'ro': 'Descriere', 'uk': 'Опис', 'bg': 'Описание',
          'hr': 'Opis', 'sk': 'Popis', 'sl': 'Opis'
        },
        'quantity': {
          'en': 'Quantity', 'es': 'Cantidad', 'fr': 'Quantité', 'de': 'Menge',
          'it': 'Quantità', 'pt': 'Quantidade', 'ru': 'Количество', 'ja': '数量',
          'zh': '数量', 'ko': '수량', 'ar': 'الكمية', 'hi': 'मात्रा',
          'th': 'จำนวน', 'vi': 'Số lượng', 'id': 'Kuantitas', 'ms': 'Kuantiti',
          'tl': 'Dami', 'tr': 'Miktar', 'pl': 'Ilość', 'nl': 'Hoeveelheid',
          'sv': 'Kvantitet', 'no': 'Antall', 'da': 'Antal',
          'fi': 'Määrä', 'el': 'Ποσότητα', 'he': 'כמות', 'cs': 'Množství',
          'hu': 'Mennyiség', 'ro': 'Cantitate', 'uk': 'Кількість', 'bg': 'Количество',
          'hr': 'Količina', 'sk': 'Množstvo', 'sl': 'Količina'
        },
        'price': {
          'en': 'Price', 'es': 'Precio', 'fr': 'Prix', 'de': 'Preis',
          'it': 'Prezzo', 'pt': 'Preço', 'ru': 'Цена', 'ja': '価格',
          'zh': '价格', 'ko': '가격', 'ar': 'السعر', 'hi': 'कीमत',
          'th': 'ราคา', 'vi': 'Giá', 'id': 'Harga', 'ms': 'Harga',
          'tl': 'Presyo', 'tr': 'Fiyat', 'pl': 'Cena', 'nl': 'Prijs',
          'sv': 'Pris', 'no': 'Pris', 'da': 'Pris',
          'fi': 'Hinta', 'el': 'Τιμή', 'he': 'מחיר', 'cs': 'Cena',
          'hu': 'Ár', 'ro': 'Preț', 'uk': 'Ціна', 'bg': 'Цена',
          'hr': 'Cijena', 'sk': 'Cena', 'sl': 'Cena'
        },
        'total': {
          'en': 'Total', 'es': 'Total', 'fr': 'Total', 'de': 'Gesamt',
          'it': 'Totale', 'pt': 'Total', 'ru': 'Итого', 'ja': '合計',
          'zh': '总计', 'ko': '합계', 'ar': 'المجموع', 'hi': 'कुल',
          'th': 'รวม', 'vi': 'Tổng', 'id': 'Total', 'ms': 'Jumlah',
          'tl': 'Kabuuan', 'tr': 'Toplam', 'pl': 'Suma', 'nl': 'Totaal',
          'sv': 'Total', 'no': 'Total', 'da': 'Total',
          'fi': 'Yhteensä', 'el': 'Σύνολο', 'he': 'סה"כ', 'cs': 'Celkem',
          'hu': 'Összesen', 'ro': 'Total', 'uk': 'Загалом', 'bg': 'Общо',
          'hr': 'Ukupno', 'sk': 'Spolu', 'sl': 'Skupaj'
        },
        'subtotal': {
          'en': 'Subtotal', 'es': 'Subtotal', 'fr': 'Sous-total', 'de': 'Zwischensumme',
          'it': 'Subtotale', 'pt': 'Subtotal', 'ru': 'Промежуточный Итог', 'ja': '小計',
          'zh': '小计', 'ko': '소계', 'ar': 'المجموع الفرعي', 'hi': 'उप-कुल',
          'th': 'รวมย่อย', 'vi': 'Tạm tính', 'id': 'Subtotal', 'ms': 'Jumlah',
          'tl': 'Kabuuan', 'tr': 'Ara Toplam', 'pl': 'Suma', 'nl': 'Subtotaal',
          'sv': 'Delsumma', 'no': 'Delsum', 'da': 'Subtotal',
          'fi': 'Välisumma', 'el': 'Μερικό Σύνολο', 'he': 'סך הכל', 'cs': 'Mezisoučet',
          'hu': 'Részösszeg', 'ro': 'Subtotal', 'uk': 'Проміжний підсумок', 'bg': 'Междинна сума',
          'hr': 'Međuzbroj', 'sk': 'Medzisúčet', 'sl': 'Vmesna vsota'
        },
        'tax': {
          'en': 'Tax', 'es': 'Impuesto', 'fr': 'Taxe', 'de': 'Steuer',
          'it': 'Imposta', 'pt': 'Imposto', 'ru': 'Налог', 'ja': '税金',
          'zh': '税', 'ko': '세금', 'ar': 'ضريبة', 'hi': 'टैक्स',
          'th': 'ภาษี', 'vi': 'Thuế', 'id': 'Pajak', 'ms': 'Cukai',
          'tl': 'Buwis', 'tr': 'Vergi', 'pl': 'Podatek', 'nl': 'Belasting',
          'sv': 'Skatt', 'no': 'Skatt', 'da': 'Skat',
          'fi': 'Vero', 'el': 'Φόρος', 'he': 'מס', 'cs': 'Daň',
          'hu': 'Adó', 'ro': 'Taxă', 'uk': 'Податок', 'bg': 'Данък',
          'hr': 'Porez', 'sk': 'Daň', 'sl': 'Davek'
        },
        'notes': {
          'en': 'Notes', 'es': 'Notas', 'fr': 'Notes', 'de': 'Notizen',
          'it': 'Note', 'pt': 'Notas', 'ru': 'Примечания', 'ja': '備考',
          'zh': '备注', 'ko': '참고사항', 'ar': 'ملاحظات', 'hi': 'नोट्स',
          'th': 'หมายเหตุ', 'vi': 'Ghi chú', 'id': 'Catatan', 'ms': 'Nota',
          'tl': 'Mga Tala', 'tr': 'Notlar', 'pl': 'Uwagi', 'nl': 'Notities',
          'sv': 'Anteckningar', 'no': 'Notater', 'da': 'Noter',
          'fi': 'Huomautukset', 'el': 'Σημειώσεις', 'he': 'הערות', 'cs': 'Poznámky',
          'hu': 'Megjegyzések', 'ro': 'Note', 'uk': 'Примітки', 'bg': 'Бележки',
          'hr': 'Bilješke', 'sk': 'Poznámky', 'sl': 'Opombe'
        },
        'due_date': {
          'en': 'Due Date', 'es': 'Fecha de Vencimiento', 'fr': 'Date d\'Échéance',
          'de': 'Fälligkeitsdatum', 'it': 'Data di Scadenza', 'pt': 'Data de Vencimento',
          'ru': 'Срок Оплаты', 'ja': '支払期日', 'zh': '到期日期', 'ko': '만료일',
          'ar': 'تاريخ الاستحقاق', 'hi': 'नियत तारीख', 'th': 'วันครบกำหนด',
          'vi': 'Ngày Đến Hạn', 'id': 'Tanggal Jatuh Tempo', 'ms': 'Tarikh Jatuh Tempo',
          'tl': 'Petsa ng Pagbabayad', 'tr': 'Vade Tarihi', 'pl': 'Termin Płatności',
          'nl': 'Vervaldatum', 'sv': 'Förfallodatum', 'no': 'Forfallsdato',
          'da': 'Forfaldsdato', 'fi': 'Eräpäivä', 'el': 'Ημερομηνία Λήξης',
          'he': 'תאריך פירעון', 'cs': 'Datum Splatnosti', 'hu': 'Esedékesség Dátuma',
          'ro': 'Scadență', 'uk': 'Термін Платежу', 'bg': 'Срок на плащане',
          'hr': 'Rok Dospijeća', 'sk': 'Dátum Splatnosti', 'sl': 'Datum Zapadlosti'
        }
      }
      
      return translations[key]?.[invoiceData.language || 'en'] || translations[key]?.['en'] || key
    }

    // Helper functions to convert Tailwind classes to CSS values
    const getBackgroundColor = (color: string) => {
      const colors: { [key: string]: string } = {
        'white': '#ffffff',
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'blue-50': '#eff6ff',
        'blue-100': '#dbeafe',
        'green-50': '#f0fdf4',
        'green-100': '#dcfce7',
        'yellow-50': '#fefce8',
        'yellow-100': '#fef3c7',
        'red-50': '#fef2f2',
        'red-100': '#fee2e2'
      }
      return colors[color] || '#ffffff'
    }

    const getTextColor = (color: string) => {
      const colors: { [key: string]: string } = {
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
        'slate-700': '#334155',
        'slate-600': '#475569',
        'gray-900': '#111827',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
        'gray-600': '#4b5563',
        'black': '#000000',
        'blue-900': '#1e3a8a',
        'blue-800': '#1e40af',
        'blue-700': '#1d4ed8',
        'blue-600': '#2563eb'
      }
      return colors[color] || '#0f172a'
    }

    const getBorderColor = (color: string) => {
      const colors: { [key: string]: string } = {
        'border-slate-200': '#e2e8f0',
        'border-gray-200': '#e5e7eb',
        'border-gray-300': '#d1d5db',
        'border-blue-200': '#dbeafe',
        'border-blue-300': '#93c5fd'
      }
      return colors[color] || '#e2e8f0'
    }

    const getBorderWidth = (width: string) => {
      const widths: { [key: string]: string } = {
        'border': '1px',
        'border-2': '2px',
        'border-4': '4px',
        'border-8': '8px'
      }
      return widths[width] || '1px'
    }

    const getBorderRadius = (radius: string) => {
      const radii: { [key: string]: string } = {
        'rounded-none': '0px',
        'rounded-sm': '0.125rem',
        'rounded': '0.25rem',
        'rounded-md': '0.375rem',
        'rounded-lg': '0.5rem',
        'rounded-xl': '0.75rem',
        'rounded-2xl': '1rem',
        'rounded-full': '9999px'
      }
      return radii[radius] || '0.5rem'
    }

    const getShadow = (shadow: string) => {
      const shadows: { [key: string]: string } = {
        'shadow-none': 'none',
        'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      }
      return shadows[shadow] || '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }

    const getFontSize = (size: string) => {
      const sizes: { [key: string]: string } = {
        'text-xs': '0.75rem',
        'text-sm': '0.875rem',
        'text-base': '1rem',
        'text-lg': '1.125rem',
        'text-xl': '1.25rem',
        'text-2xl': '1.5rem',
        'text-3xl': '1.875rem',
        'text-4xl': '2.25rem'
      }
      return sizes[size] || '1rem'
    }

    const getFontFamily = (font: string) => {
      const fonts: { [key: string]: string } = {
        'Inter': "'Inter', sans-serif",
        'Roboto': "'Roboto', sans-serif",
        'Open Sans': "'Open Sans', sans-serif",
        'Lato': "'Lato', sans-serif",
        'Montserrat': "'Montserrat', sans-serif",
        'Poppins': "'Poppins', sans-serif",
        'Playfair Display': "'Playfair Display', serif",
        'Merriweather': "'Merriweather', serif",
        'Ubuntu': "'Ubuntu', sans-serif",
        'Raleway': "'Raleway', sans-serif"
      }
      return fonts[font] || "'Inter', sans-serif"
    }

    const getAlignment = (alignment: string) => {
      const alignments: { [key: string]: string } = {
        'text-left': 'left',
        'text-center': 'center',
        'text-right': 'right',
        'text-justify': 'justify'
      }
      return alignments[alignment] || 'left'
    }

    // Get custom styles or use defaults
    const settings = invoiceData.settings
    const customStyles = settings ? `
      body {
        font-family: ${getFontFamily(settings.fontFamily)};
        color: ${getTextColor(settings.textColor)};
        background-color: white !important;
        font-size: ${getFontSize(settings.fontSize)};
      }
      .invoice-box {
        background-color: ${getBackgroundColor(settings.backgroundColor)} !important;
        border: ${getBorderWidth(settings.borderWidth)} solid ${getBorderColor(settings.borderColor)};
        border-radius: ${getBorderRadius(settings.borderRadius)};
        box-shadow: ${getShadow(settings.shadowSize)};
      }
      .invoice-box table tr.heading td {
        background-color: ${getBackgroundColor(settings.backgroundColor === 'white' ? 'gray-100' : 'white')};
        border-bottom: ${getBorderWidth(settings.borderWidth)} solid ${getBorderColor(settings.borderColor)};
      }
      .invoice-box table tr.item td {
        border-bottom: 1px solid ${getBorderColor(settings.borderColor)};
      }
      .invoice-box table tr.total td:nth-child(3),
      .invoice-box table tr.total td:nth-child(4) {
        border-top: 2px solid ${getBorderColor(settings.borderColor)};
      }
      .invoice-box table tr.top table td.title {
        text-align: ${getAlignment(settings.headerAlignment)};
      }
      .invoice-box table tr.information table td:first-child {
        text-align: ${getAlignment(settings.invoiceAlignment)};
      }
      .invoice-box table tr.information table td:last-child {
        text-align: ${getAlignment(settings.invoiceAlignment === 'text-left' ? 'text-right' : settings.invoiceAlignment)};
      }
    ` : `
      body {
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
        background: #fff;
      }
    `

    // Generate HTML for PDF
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        ${customStyles}
        body {
          padding: 40px;
          margin: 0;
        }
        .invoice-box {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          font-size: 16px;
          line-height: 24px;
        }
        .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
          border-collapse: collapse;
        }
        .invoice-box table td {
          padding: 5px;
          vertical-align: top;
        }
        .invoice-box table tr.top table td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
          font-size: 16px;
          line-height: 16px;
          color: #1f2937;
          font-weight: 600;
          padding-bottom: 4px;
        }
        .invoice-box table tr.top table td.title h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .invoice-box table tr.top table td.invoice-info {
          font-size: 12px;
          color: #6b7280;
          text-align: left;
        }
        .invoice-box table tr.top table td.logo {
          width: 80px;
          height: 80px;
          text-align: center;
          vertical-align: middle;
          padding-right: 16px;
        }
        .invoice-box table tr.top table td.logo img {
          max-width: 72px;
          max-height: 72px;
          object-fit: contain;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 4px;
          background-color: white;
        }
        .invoice-box table tr.top table td.title {
          font-size: 16px;
          line-height: 16px;
          color: #1f2937;
          font-weight: 600;
          padding-bottom: 4px;
        }
        .invoice-box table tr.top table td.title h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .invoice-box table tr.information table td {
          padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
          text-align: left;
        }
        .invoice-box table tr.details td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        .invoice-box table tr.item.last td {
          border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(3),
        .invoice-box table tr.total td:nth-child(4) {
          border-top: 2px solid #eee;
          font-weight: bold;
          text-align: right;
        }
        .text-right {
          text-align: right;
        }
        .notes {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      </style>
      ${settings && settings.fontFamily && settings.fontFamily !== 'Inter' ? `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      ` : ''}
    </head>
    <body>
      <div class="invoice-box">
        <table>
          <tr class="top">
            <td colspan="4">
              <table>
                <tr>
                  ${invoiceData.logoUrl ? `
                    <td class="logo">
                      <img src="${invoiceData.logoUrl}" alt="Company Logo" />
                    </td>
                  ` : ''}
                  <td class="title">
                    <h1>${invoiceData.invoiceTitle || 'INVOICE'}</h1>
                    <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Invoice #${invoiceData.invoiceNumber || 'N/A'}</div>
                  </td>
                  <td class="text-right">
                    <div><strong>Date:</strong> ${invoiceData.date || 'N/A'}</div>
                    ${invoiceData.showDueDate ? `<div style="margin-top: 4px;"><strong>${t('due_date')}:</strong> ${invoiceData.dueDate || 'N/A'}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    <strong>${t('from')}:</strong><br>
                    ${invoiceData.fromName || 'N/A'}<br>
                    ${invoiceData.fromEmail || 'N/A'}<br>
                    ${invoiceData.fromAddress ? invoiceData.fromAddress.replace(/\n/g, '<br>') : 'N/A'}
                  </td>
                  <td class="text-right">
                    <strong>${t('to')}:</strong><br>
                    ${invoiceData.toName || 'N/A'}<br>
                    ${invoiceData.toEmail || 'N/A'}<br>
                    ${invoiceData.toAddress ? invoiceData.toAddress.replace(/\n/g, '<br>') : 'N/A'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="heading">
            <td>${t('description')}</td>
            <td class="text-center">${t('quantity')}</td>
            <td class="text-right">${t('price')} (${getCurrencySymbol(invoiceData.currency || 'USD')})</td>
            <td class="text-right">${t('total')} (${getCurrencySymbol(invoiceData.currency || 'USD')})</td>
          </tr>
          ${validItems.map(item => `
            <tr class="item">
              <td>${item.description}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.price)}</td>
              <td class="text-right">${formatCurrency(item.quantity * item.price)}</td>
            </tr>
          `).join('')}
          <tr class="total">
            <td colspan="2"></td>
            <td class="text-right">
              <strong>${t('subtotal')}:</strong>
            </td>
            <td class="text-right">
              ${formatCurrency(subtotal)}
            </td>
          </tr>
          ${(invoiceData.taxes || []).map(tax => `
            <tr class="total">
              <td colspan="2"></td>
              <td class="text-right">
                <strong>${tax.name} (${tax.rate}%):</strong>
              </td>
              <td class="text-right">
                ${formatCurrency(subtotal * (tax.rate / 100))}
              </td>
            </tr>
          `).join('')}
          <tr class="total">
            <td colspan="2"></td>
            <td class="text-right">
              <strong>${t('total')}:</strong>
            </td>
            <td class="text-right">
              ${formatCurrency(total)}
            </td>
          </tr>
        </table>
        ${invoiceData.notes && invoiceData.notes.trim() ? `
          <div class="notes">
            <strong>${t('notes')}:</strong><br>
            ${invoiceData.notes.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
    `

    // For now, we'll return the HTML as a response
    // In a real implementation, you would use a PDF library like puppeteer or jsPDF
    return NextResponse.json({
      success: true,
      html: html,
      message: 'PDF generation successful. HTML content returned for demo purposes.'
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to generate PDF: ' + errorMessage },
      { status: 500 }
    )
  }
}