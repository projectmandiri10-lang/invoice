'use client'

import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Download, Plus, Trash2, Loader2, RefreshCw, FileText, Upload, X, Settings, CheckCircle, Check, Zap, Globe, Shield, Edit2, Save, Menu, Printer, ChevronDown } from 'lucide-react'

// Add flag styles
if (typeof window !== 'undefined') {
  const flagStyles = document.createElement('link')
  flagStyles.rel = 'stylesheet'
  flagStyles.href = '/flags.css'
  document.head.appendChild(flagStyles)
}

// Add print styles and Google Fonts
if (typeof window !== 'undefined') {
  // Add print styles
  const printStyles = document.createElement('style')
  printStyles.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .invoice-print, .invoice-print * {
        visibility: visible;
      }
      .invoice-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white !important;
      }
      .invoice-print * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Force background colors to print only for invoice box */
      .invoice-print .invoice-box {
        background-color: inherit !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Ensure all elements with background colors are printed */
      @media print and (color) {
        .invoice-print .invoice-box * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
      /* Fix tax display layout in print */
      .invoice-print .flex.justify-between {
        display: flex !important;
        justify-content: space-between !important;
        width: 100% !important;
      }
      .invoice-print .flex.items-center {
        display: flex !important;
        align-items: center !important;
      }
      .invoice-print .space-y-2 > * + * {
        margin-top: 0.5rem !important;
      }
    }
  `
  document.head.appendChild(printStyles)

  // Add Google Fonts
  const googleFonts = document.createElement('link')
  googleFonts.rel = 'preconnect'
  googleFonts.href = 'https://fonts.googleapis.com'
  document.head.appendChild(googleFonts)
  
  const googleFontsCrossorigin = document.createElement('link')
  googleFontsCrossorigin.rel = 'preconnect'
  googleFontsCrossorigin.href = 'https://fonts.gstatic.com'
  googleFontsCrossorigin.crossOrigin = 'anonymous'
  document.head.appendChild(googleFontsCrossorigin)
  
  const fontFamilies = [
    'Inter:wght@300;400;500;600;700',
    'Roboto:wght@300;400;500;700',
    'Open+Sans:wght@300;400;600;700',
    'Lato:wght@300;400;700',
    'Montserrat:wght@300;400;600;700',
    'Poppins:wght@300;400;600;700',
    'Playfair+Display:wght@400;700',
    'Merriweather:wght@300;400;700',
    'Ubuntu:wght@300;400;500;700',
    'Raleway:wght@300;400;600;700'
  ].join('&family=')
  
  const googleFontsLink = document.createElement('link')
  googleFontsLink.rel = 'stylesheet'
  googleFontsLink.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`
  document.head.appendChild(googleFontsLink)
}

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
  
  // Decimal Settings
  decimalPlaces: number
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
}

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    invoiceTitle: 'INVOICE',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    showDueDate: true,
    logoUrl: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    items: [
      { id: '1', description: '', quantity: 1, price: 0 }
    ],
    taxes: [],
    notes: '',
    currency: 'USD',
    language: 'en',
    showDecimals: false
  })

  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    // Font Settings
    fontFamily: 'Inter',
    fontSize: 'base',
    fontWeight: 'normal',
    
    // Color Settings
    backgroundColor: 'white',
    textColor: 'slate-900',
    accentColor: 'blue-600',
    
    // Layout Settings
    containerWidth: 'w-full',
    invoiceWidth: 'w-full max-w-4xl',
    invoiceHeight: 'min-h-screen',
    invoiceMargin: 'mx-auto',
    invoicePadding: 'p-8',
    
    // Border Settings
    borderWidth: 'border-2',
    borderColor: 'border-slate-200',
    borderRadius: 'rounded-lg',
    
    // Shadow Settings
    shadowSize: 'shadow-lg',
    
    // Alignment Settings
    headerAlignment: 'text-left',
    invoiceAlignment: 'text-left',
    
    // Decimal Settings
    decimalPlaces: 2
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [editingTaxIndex, setEditingTaxIndex] = useState<number | null>(null)

  

  // Tax types based on country/language
  const getTaxesByCountry = () => {
    switch (invoiceData.language) {
      case 'id':
        return [
          { name: 'Pajak Pertambahan Nilai (PPN)', rate: 11 },
          { name: 'Pajak Penghasilan (PPh 23)', rate: 2 },
          { name: 'Pajak Penghasilan (PPh 21)', rate: 5 },
          { name: 'Pajak Penghasilan (PPh 4 ayat 2)', rate: 1.5 },
          { name: 'Pajak Bumi dan Bangunan (PBB)', rate: 0.5 },
          { name: 'Bea Materai', rate: 0.3 },
          { name: 'Pajak Restoran', rate: 10 },
          { name: 'Pajak Hotel', rate: 10 },
          { name: 'Pajak Hiburan', rate: 15 },
          { name: 'Pajak Parkir', rate: 20 }
        ]
      case 'en':
        return [
          { name: 'Sales Tax', rate: 8.25 },
          { name: 'Federal Income Tax', rate: 10 },
          { name: 'State Tax', rate: 5 },
          { name: 'Local Tax', rate: 2 },
          { name: 'Service Tax', rate: 10 },
          { name: 'Luxury Tax', rate: 20 },
          { name: 'Environmental Tax', rate: 1.5 },
          { name: 'Education Tax', rate: 2 }
        ]
      case 'ms':
        return [
          { name: 'Cukai Jualan (SST)', rate: 6 },
          { name: 'Cukai Pendapatan', rate: 5 },
          { name: 'Cukai Perkhidmatan', rate: 6 },
          { name: 'Cukai Hiburan', rate: 10 },
          { name: 'Cukai Hotel', rate: 5 },
          { name: 'Cukai Tumbuhan', rate: 5 }
        ]
      case 'th':
        return [
          { name: 'ภาษีมูลค่าเพิ่ม (VAT)', rate: 7 },
          { name: 'ภาษีเงินได้', rate: 5 },
          { name: 'ภาษีน้ำมัน', rate: 10 },
          { name: 'ภาษีสุรา', rate: 10 },
          { name: 'ภาษียาสูบ', rate: 20 }
        ]
      case 'vi':
        return [
          { name: 'Thuế Giá trị gia tăng (VAT)', rate: 10 },
          { name: 'Thuế Thu nhập cá nhân', rate: 5 },
          { name: 'Thuế Doanh nghiệp', rate: 20 },
          { name: 'Thuế Tiêu thụ đặc biệt', rate: 10 },
          { name: 'Thuế Môi trường', rate: 1 }
        ]
      case 'zh':
        return [
          { name: '增值税 (VAT)', rate: 13 },
          { name: '企业所得税', rate: 25 },
          { name: '个人所得税', rate: 3 },
          { name: '消费税', rate: 10 },
          { name: '城建税', rate: 7 }
        ]
      case 'ja':
        return [
          { name: '消費税', rate: 10 },
          { name: '法人税', rate: 23.2 },
          { name: '所得税', rate: 5 },
          { name: '住民税', rate: 10 },
          { name: '固定資産税', rate: 1.4 }
        ]
      case 'ko':
        return [
          { name: '부가가치세 (VAT)', rate: 10 },
          { name: '법인세', rate: 10 },
          { name: '소득세', rate: 6 },
          { name: '주민세', rate: 10 },
          { name: '재산세', rate: 0.3 }
        ]
      case 'fr':
        return [
          { name: 'Taxe sur la Valeur Ajoutée (TVA)', rate: 20 },
          { name: 'Impôt sur le Revenu', rate: 14 },
          { name: 'Impôt sur les Sociétés', rate: 25 },
          { name: 'Taxe Foncière', rate: 1 },
          { name: 'Contribution Foncière', rate: 15 }
        ]
      case 'de':
        return [
          { name: 'Mehrwertsteuer (MwSt)', rate: 19 },
          { name: 'Einkommensteuer', rate: 14 },
          { name: 'Körperschaftsteuer', rate: 15 },
          { name: 'Gewerbesteuer', rate: 3.5 },
          { name: 'Grundsteuer', rate: 0.35 }
        ]
      case 'es':
        return [
          { name: 'Impuesto sobre el Valor Añadido (IVA)', rate: 21 },
          { name: 'Impuesto sobre la Renta', rate: 19 },
          { name: 'Impuesto de Sociedades', rate: 25 },
          { name: 'Impuesto sobre Bienes Inmuebles', rate: 0.5 },
          { name: 'Impuesto de Actividades Económicas', rate: 10 }
        ]
      case 'it':
        return [
          { name: 'Imposta sul Valore Aggiunto (IVA)', rate: 22 },
          { name: 'Imposta sul Reddito', rate: 23 },
          { name: 'Imposta sulle Società', rate: 24 },
          { name: 'IMU', rate: 0.76 },
          { name: 'IRAP', rate: 3.9 }
        ]
      case 'pt':
        return [
          { name: 'Imposto sobre Valor Agregado (IVA)', rate: 23 },
          { name: 'Imposto de Renda', rate: 15 },
          { name: 'Imposto de Renda Pessoa Jurídica', rate: 15 },
          { name: 'ISS', rate: 5 },
          { name: 'ITBI', rate: 2 }
        ]
      case 'ru':
        return [
          { name: 'Налог на добавленную стоимость (НДС)', rate: 20 },
          { name: 'Налог на прибыль', rate: 20 },
          { name: 'Налог на доходы физических лиц', rate: 13 },
          { name: 'Налог на имущество', rate: 0.1 },
          { name: 'Транспортный налог', rate: 10 }
        ]
      default:
        return [
          { name: 'Value Added Tax (VAT)', rate: 20 },
          { name: 'Income Tax', rate: 10 },
          { name: 'Corporate Tax', rate: 15 },
          { name: 'Service Tax', rate: 10 },
          { name: 'Local Tax', rate: 5 }
        ]
    }
  }

  // Dynamic label function based on invoice title
  const getDocumentLabel = (labelType: 'number' | 'date' | 'due_date') => {
    // Always use dynamic labels based on exactly what's typed
    const documentName = invoiceData.invoiceTitle.trim()
    const numberPrefix = invoiceData.language === 'id' ? 'Nomor' : 'Number'
    const datePrefix = invoiceData.language === 'id' ? 'Tanggal' : 'Date'
    const dueDatePrefix = invoiceData.language === 'id' ? 'Jatuh Tempo' : 'Due Date'
    
    const customLabels = {
      number: `${numberPrefix} ${documentName}`,
      date: `${datePrefix} ${documentName}`,
      due_date: `${dueDatePrefix} ${documentName}`
    }
    
    return customLabels[labelType]
  }

  // Currency and Language data
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
    { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' }
  ]

  const languages = [
    { code: 'en', name: 'English', locale: 'en-US', flag: 'US' },
    { code: 'es', name: 'Español', locale: 'es-ES', flag: 'ES' },
    { code: 'fr', name: 'Français', locale: 'fr-FR', flag: 'FR' },
    { code: 'de', name: 'Deutsch', locale: 'de-DE', flag: 'DE' },
    { code: 'it', name: 'Italiano', locale: 'it-IT', flag: 'IT' },
    { code: 'pt', name: 'Português', locale: 'pt-BR', flag: 'BR' },
    { code: 'ru', name: 'Русский', locale: 'ru-RU', flag: 'RU' },
    { code: 'ja', name: '日本語', locale: 'ja-JP', flag: 'JP' },
    { code: 'zh', name: '中文', locale: 'zh-CN', flag: 'CN' },
    { code: 'ko', name: '한국어', locale: 'ko-KR', flag: 'KR' },
    { code: 'ar', name: 'العربية', locale: 'ar-SA', flag: 'SA' },
    { code: 'hi', name: 'हिन्दी', locale: 'hi-IN', flag: 'IN' },
    { code: 'th', name: 'ไทย', locale: 'th-TH', flag: 'TH' },
    { code: 'vi', name: 'Tiếng Việt', locale: 'vi-VN', flag: 'VN' },
    { code: 'id', name: 'Bahasa Indonesia', locale: 'id-ID', flag: 'ID' },
    { code: 'ms', name: 'Bahasa Melayu', locale: 'ms-MY', flag: 'MY' },
    { code: 'tl', name: 'Filipino', locale: 'tl-PH', flag: 'PH' },
    { code: 'tr', name: 'Türkçe', locale: 'tr-TR', flag: 'TR' },
    { code: 'pl', name: 'Polski', locale: 'pl-PL', flag: 'PL' },
    { code: 'nl', name: 'Nederlands', locale: 'nl-NL', flag: 'NL' },
    { code: 'sv', name: 'Svenska', locale: 'sv-SE', flag: 'SE' },
    { code: 'no', name: 'Norsk', locale: 'no-NO', flag: 'NO' },
    { code: 'da', name: 'Dansk', locale: 'da-DK', flag: 'DK' },
    { code: 'fi', name: 'Suomi', locale: 'fi-FI', flag: 'FI' },
    { code: 'el', name: 'Ελληνικά', locale: 'el-GR', flag: 'GR' },
    { code: 'he', name: 'עברית', locale: 'he-IL', flag: 'IL' },
    { code: 'cs', name: 'Čeština', locale: 'cs-CZ', flag: 'CZ' },
    { code: 'hu', name: 'Magyar', locale: 'hu-HU', flag: 'HU' },
    { code: 'ro', name: 'Română', locale: 'ro-RO', flag: 'RO' },
    { code: 'uk', name: 'Українська', locale: 'uk-UA', flag: 'UA' },
    { code: 'bg', name: 'Български', locale: 'bg-BG', flag: 'BG' },
    { code: 'hr', name: 'Hrvatski', locale: 'hr-HR', flag: 'HR' },
    { code: 'sk', name: 'Slovenčina', locale: 'sk-SK', flag: 'SK' },
    { code: 'sl', name: 'Slovenščina', locale: 'sl-SI', flag: 'SI' }
  ]

  // Translation dictionary
  const translations: { [key: string]: { [lang: string]: string } } = {
    // Invoice Generator
    'invoice_generator': {
      'en': 'Invoice Generator',
      'es': 'Generador de Facturas',
      'fr': 'Générateur de Factures',
      'de': 'Rechnungsgenerator',
      'it': 'Generatore di Fatture',
      'pt': 'Gerador de Faturas',
      'ru': 'Генератор Счетов',
      'ja': '請求書生成ツール',
      'zh': '发票生成器',
      'ko': '청구서 생성기',
      'ar': 'مولد الفواتير',
      'hi': 'इनवॉइस जेनरेटर',
      'th': 'เครื่องสร้างใบแจ้งหนี้',
      'vi': 'Trình tạo Hóa đơn',
      'id': 'MJW Perfect INVOICE Maker Free',
      'ms': 'Penjana Invois',
      'tl': 'Tagagawa ng Invoice',
      'tr': 'Fatura Oluşturucu',
      'pl': 'Generator Faktur',
      'nl': 'Factuur Generator',
      'sv': 'Fakturagenerator',
      'no': 'Fakturagenerator',
      'da': 'Fakturagenerator',
      'fi': 'Laskugeneraattori',
      'el': 'Γεννήτρια Τιμολογίων',
      'he': 'מחולל חשבוניות',
      'cs': 'Generátor Faktur',
      'hu': 'Számla Generátor',
      'ro': 'Generator Facturi',
      'uk': 'Генератор Рахунків',
      'bg': 'Генератор на фактури',
      'hr': 'Generator Računa',
      'sk': 'Generátor Faktúr',
      'sl': 'Generator Računov'
    },
    // Navigation
    'help': {
      'en': 'Help',
      'es': 'Ayuda',
      'fr': 'Aide',
      'de': 'Hilfe',
      'it': 'Aiuto',
      'pt': 'Ajuda',
      'ru': 'Помощь',
      'ja': 'ヘルプ',
      'zh': '帮助',
      'ko': '도움말',
      'ar': 'مساعدة',
      'hi': 'सहायता',
      'th': 'ช่วยเหลือ',
      'vi': 'Trợ giúp',
      'id': 'Bantuan',
      'ms': 'Bantuan',
      'tl': 'Tulong',
      'tr': 'Yardım',
      'pl': 'Pomoc',
      'nl': 'Help',
      'sv': 'Hjälp',
      'no': 'Hjelp',
      'da': 'Hjælp',
      'fi': 'Ohje',
      'el': 'Βοήθεια',
      'he': 'עזרה',
      'cs': 'Pomoc',
      'hu': 'Segítség',
      'ro': 'Ajutor',
      'uk': 'Допомога',
      'bg': 'Помощ',
      'hr': 'Pomoć',
      'sk': 'Pomoc',
      'sl': 'Pomoč'
    },
    'templates': {
      'en': 'Templates',
      'es': 'Plantillas',
      'fr': 'Modèles',
      'de': 'Vorlagen',
      'it': 'Modelli',
      'pt': 'Modelos',
      'ru': 'Шаблоны',
      'ja': 'テンプレート',
      'zh': '模板',
      'ko': '템플릿',
      'ar': 'قوالب',
      'hi': 'टेम्प्लेट',
      'th': 'เทมเพลต',
      'vi': 'Mẫu',
      'id': 'Template',
      'ms': 'Templat',
      'tl': 'Mga Template',
      'tr': 'Şablonlar',
      'pl': 'Szablony',
      'nl': 'Sjablonen',
      'sv': 'Mallar',
      'no': 'Maler',
      'da': 'Skabeloner',
      'fi': 'Mallipohjat',
      'el': 'Πρότυπα',
      'he': 'תבניות',
      'cs': 'Šablony',
      'hu': 'Sablonok',
      'ro': 'Șabloane',
      'uk': 'Шаблони',
      'bg': 'Шаблони',
      'hr': 'Predlošci',
      'sk': 'Šablóny',
      'sl': 'Predloge'
    },
    // Actions
    'load_sample_data': {
      'en': 'Load Sample Data',
      'es': 'Cargar Datos de Ejemplo',
      'fr': 'Charger des Données d\'Exemple',
      'de': 'Beispieldaten Laden',
      'it': 'Carica Dati di Esempio',
      'pt': 'Carregar Dados de Exemplo',
      'ru': 'Загрузить Пример Данных',
      'ja': 'サンプルデータを読み込む',
      'zh': '加载示例数据',
      'ko': '샘플 데이터 로드',
      'ar': 'تحميل بيانات نموذجية',
      'hi': 'नमूना डेटा लोड करें',
      'th': 'โหลดข้อมูลตัวอย่าง',
      'vi': 'Tải Dữ liệu Mẫu',
      'id': 'Muat Data Contoh',
      'ms': 'Muat Data Sampel',
      'tl': 'I-load ang Sample Data',
      'tr': 'Örnek Veri Yükle',
      'pl': 'Załaduj Dane Przykładowe',
      'nl': 'Voorbeeldgegevens Laden',
      'sv': 'Ladda Exempeldata',
      'no': 'Last Eksempeldata',
      'da': 'Indlæs Eksempeldata',
      'fi': 'Lataa Esimerkkidata',
      'el': 'Φόρτωση Δεδομένων Παραδείγματος',
      'he': 'טען נתוני דוגמה',
      'cs': 'Načíst Vzorová Data',
      'hu': 'Minta Adatok Betöltése',
      'ro': 'Încarcă Date Exemplu',
      'uk': 'Завантажити Приклад Даних',
      'bg': 'Зареди Примерни Данни',
      'hr': 'Učitaj Primjere Podataka',
      'sk': 'Načítať Vzorové Dáta',
      'sl': 'Naloži Vzorčne Podatke'
    },
    'reset': {
      'en': 'Reset',
      'es': 'Restablecer',
      'fr': 'Réinitialiser',
      'de': 'Zurücksetzen',
      'it': 'Reimposta',
      'pt': 'Redefinir',
      'ru': 'Сбросить',
      'ja': 'リセット',
      'zh': '重置',
      'ko': '재설정',
      'ar': 'إعادة تعيين',
      'hi': 'रीसेट करें',
      'th': 'รีเซ็ต',
      'vi': 'Đặt lại',
      'id': 'Reset',
      'ms': 'Tetapkan Semula',
      'tl': 'I-reset',
      'tr': 'Sıfırla',
      'pl': 'Resetuj',
      'nl': 'Resetten',
      'sv': 'Återställ',
      'no': 'Tilbakestill',
      'da': 'Nulstil',
      'fi': 'Nollaa',
      'el': 'Επαναφορά',
      'he': 'איפוס',
      'cs': 'Resetovat',
      'hu': 'Visszaállítás',
      'ro': 'Resetează',
      'uk': 'Скинути',
      'bg': 'Нулиране',
      'hr': 'Poništi',
      'sk': 'Resetovať',
      'sl': 'Ponastavi'
    },
    'download_pdf': {
      'en': 'Download PDF',
      'es': 'Descargar PDF',
      'fr': 'Télécharger PDF',
      'de': 'PDF Herunterladen',
      'it': 'Scarica PDF',
      'pt': 'Baixar PDF',
      'ru': 'Скачать PDF',
      'ja': 'PDFをダウンロード',
      'zh': '下载PDF',
      'ko': 'PDF 다운로드',
      'ar': 'تحميل PDF',
      'hi': 'PDF डाउनलोड करें',
      'th': 'ดาวน์โหลด PDF',
      'vi': 'Tải PDF',
      'id': 'Unduh PDF',
      'ms': 'Muat Turun PDF',
      'tl': 'I-download ang PDF',
      'tr': 'PDF İndir',
      'pl': 'Pobierz PDF',
      'nl': 'PDF Downloaden',
      'sv': 'Ladda ner PDF',
      'no': 'Last ned PDF',
      'da': 'Download PDF',
      'fi': 'Lataa PDF',
      'el': 'Λήψη PDF',
      'he': 'הורד PDF',
      'cs': 'Stáhnout PDF',
      'hu': 'PDF Letöltés',
      'ro': 'Descarcă PDF',
      'uk': 'Завантажити PDF',
      'bg': 'Изтегли PDF',
      'hr': 'Preuzmi PDF',
      'sk': 'Stiahnuť PDF',
      'sl': 'Prenesi PDF'
    },
    'print': {
      'en': 'Print',
      'es': 'Imprimir',
      'fr': 'Imprimer',
      'de': 'Drucken',
      'it': 'Stampa',
      'pt': 'Imprimir',
      'ru': 'Печать',
      'ja': '印刷',
      'zh': '打印',
      'ko': '인쇄',
      'ar': 'طباعة',
      'hi': 'प्रिंट करें',
      'th': 'พิมพ์',
      'vi': 'In',
      'id': 'Cetak',
      'ms': 'Cetak',
      'tl': 'I-print',
      'tr': 'Yazdır',
      'pl': 'Drukuj',
      'nl': 'Afdrukken',
      'sv': 'Skriv ut',
      'no': 'Skriv ut',
      'da': 'Print',
      'fi': 'Tulosta',
      'el': 'Εκτύπωση',
      'he': 'הדפס',
      'cs': 'Tisknout',
      'hu': 'Nyomtatás',
      'ro': 'Imprimare',
      'uk': 'Друк',
      'bg': 'Печат',
      'hr': 'Ispiši',
      'sk': 'Tlačiť',
      'sl': 'Natisni'
    },
    'generating': {
      'en': 'Generating...',
      'es': 'Generando...',
      'fr': 'Génération...',
      'de': 'Wird Generiert...',
      'it': 'Generazione...',
      'pt': 'Gerando...',
      'ru': 'Генерация...',
      'ja': '生成中...',
      'zh': '生成中...',
      'ko': '생성 중...',
      'ar': 'جار إنشاء...',
      'hi': 'जनरेट हो रहा है...',
      'th': 'กำลังสร้าง...',
      'vi': 'Đang tạo...',
      'id': 'Menghasilkan...',
      'ms': 'Menghasilkan...',
      'tl': 'Nagbu-build...',
      'tr': 'Oluşturuluyor...',
      'pl': 'Generowanie...',
      'nl': 'Genereren...',
      'sv': 'Genererar...',
      'no': 'Genererer...',
      'da': 'Genererer...',
      'fi': 'Luodaan...',
      'el': 'Δημιουργία...',
      'he': 'יוצר...',
      'cs': 'Generování...',
      'hu': 'Generálás...',
      'ro': 'Se generează...',
      'uk': 'Генерація...',
      'bg': 'Генериране...',
      'hr': 'Generiranje...',
      'sk': 'Generovanie...',
      'sl': 'Ustvarjanje...'
    },
    'settings': {
      'en': 'Settings',
      'es': 'Configuración',
      'fr': 'Paramètres',
      'de': 'Einstellungen',
      'it': 'Impostazioni',
      'pt': 'Configurações',
      'ru': 'Настройки',
      'ja': '設定',
      'zh': '设置',
      'ko': '설정',
      'ar': 'الإعدادات',
      'hi': 'सेटिंग्स',
      'th': 'การตั้งค่า',
      'vi': 'Cài đặt',
      'id': 'Pengaturan',
      'ms': 'Tetapan',
      'tl': 'Mga Setting',
      'tr': 'Ayarlar',
      'pl': 'Ustawienia',
      'nl': 'Instellingen',
      'sv': 'Inställningar',
      'no': 'Innstillinger',
      'da': 'Indstillinger',
      'fi': 'Asetukset',
      'el': 'Ρυθμίσεις',
      'he': 'הגדרות',
      'cs': 'Nastavení',
      'hu': 'Beállítások',
      'ro': 'Setări',
      'uk': 'Налаштування',
      'bg': 'Настройки',
      'hr': 'Postavke',
      'sk': 'Nastavenia',
      'sl': 'Nastavitve'
    },
    // Form Labels
    'invoice_number': {
      'en': 'Invoice Number',
      'es': 'Número de Factura',
      'fr': 'Numéro de Facture',
      'de': 'Rechnungsnummer',
      'it': 'Numero Fattura',
      'pt': 'Número da Fatura',
      'ru': 'Номер Счета',
      'ja': '請求書番号',
      'zh': '发票号码',
      'ko': '청구서 번호',
      'ar': 'رقم الفاتورة',
      'hi': 'इनवॉइस नंबर',
      'th': 'เลขที่ใบแจ้งหนี้',
      'vi': 'Số Hóa đơn',
      'id': 'Nomor Invoice',
      'ms': 'Nombor Invois',
      'tl': 'Numero ng Invoice',
      'tr': 'Fatura Numarası',
      'pl': 'Numer Faktury',
      'nl': 'Factuurnummer',
      'sv': 'Fakturanummer',
      'no': 'Fakturanummer',
      'da': 'Fakturanummer',
      'fi': 'Laskunumero',
      'el': 'Αριθμός Τιμολογίου',
      'he': 'מספר חשבונית',
      'cs': 'Číslo Faktury',
      'hu': 'Számlaszám',
      'ro': 'Număr Factură',
      'uk': 'Номер Рахунку',
      'bg': 'Номер на фактура',
      'hr': 'Broj Računa',
      'sk': 'Číslo Faktúry',
      'sl': 'Številka Računa'
    },
    'date': {
      'en': 'Date',
      'es': 'Fecha',
      'fr': 'Date',
      'de': 'Datum',
      'it': 'Data',
      'pt': 'Data',
      'ru': 'Дата',
      'ja': '日付',
      'zh': '日期',
      'ko': '날짜',
      'ar': 'التاريخ',
      'hi': 'दिनांक',
      'th': 'วันที่',
      'vi': 'Ngày',
      'id': 'Tanggal',
      'ms': 'Tarikh',
      'tl': 'Petsa',
      'tr': 'Tarih',
      'pl': 'Data',
      'nl': 'Datum',
      'sv': 'Datum',
      'no': 'Dato',
      'da': 'Dato',
      'fi': 'Päivämäärä',
      'el': 'Ημερομηνία',
      'he': 'תאריך',
      'cs': 'Datum',
      'hu': 'Dátum',
      'ro': 'Dată',
      'uk': 'Дата',
      'bg': 'Дата',
      'hr': 'Datum',
      'sk': 'Dátum',
      'sl': 'Datum'
    },
    'due_date': {
      'en': 'Due Date',
      'es': 'Fecha de Vencimiento',
      'fr': 'Date d\'Échéance',
      'de': 'Fälligkeitsdatum',
      'it': 'Data di Scadenza',
      'pt': 'Data de Vencimento',
      'ru': 'Срок Оплаты',
      'ja': '支払い期限',
      'zh': '到期日',
      'ko': '청구일',
      'ar': 'تاريخ الاستحقاق',
      'hi': 'अंबल तिथि',
      'th': 'วันครบกำหนด',
      'vi': 'Ngày Đóng Hạn',
      'id': 'Tanggal Jatuh Tempo',
      'ms': 'Tarikh Jatuh Tempo',
      'tl': 'Petsa ng Pagbabayad',
      'tr': 'Vade Tarihi',
      'pl': 'Termin Płatności',
      'nl': 'Vervaldatum',
      'sv': 'Förfallodatum',
      'no': 'Forfallsdato',
      'da': 'Forfaldsdato',
      'fi': 'Eräpäivä',
      'el': 'Ημερομηνία Λήξης',
      'he': 'תאריך פג',
      'cs': 'Datum Splatnosti',
      'hu': 'Esedékesség Dátuma',
      'ro': 'Scadență',
      'uk': 'Термін Платежу',
      'bg': 'Срок на плащане',
      'hr': 'Rok Dospijeća',
      'sk': 'Dátum Splatnosti',
      'sl': 'Datum Zapadlosti'
    },
    'your_name_company': {
      'en': 'Your Name / Company',
      'es': 'Tu Nombre / Empresa',
      'fr': 'Votre Nom / Entreprise',
      'de': 'Ihr Name / Unternehmen',
      'it': 'Tuo Nome / Azienda',
      'pt': 'Seu Nome / Empresa',
      'ru': 'Ваше Имя / Компания',
      'ja': 'あなたの名前/企業名',
      'zh': '您的姓名/公司',
      'ko': '이름/회사',
      'ar': 'اسمك / الشركة',
      'hi': 'आपका नाम / कंपनी',
      'th': 'ชื่อของคุณ/บริษัท',
      'vi': 'Tên của bạn / Công ty',
      'id': 'Nama Anda / Perusahaan',
      'ms': 'Nama Anda / Syarikat',
      'tl': 'Pangalan mo / Kumpanya',
      'tr': 'Adınız / Şirket',
      'pl': 'Twoje Imię / Firma',
      'nl': 'Jouw Naam / Bedrijf',
      'sv': 'Ditt Namn / Företag',
      'no': 'Ditt Navn / Bedrift',
      'da': 'Dit Navn / Virksomhed',
      'fi': 'Nimesi / Yritys',
      'el': 'Το Όνομά σας / Εταιρεία',
      'he': 'שמך / חברה',
      'cs': 'Vaše Jméno / Společnost',
      'hu': 'Neve / Cég',
      'ro': 'Numele Tău / Companie',
      'uk': 'Ваше Ім\'я / Компанія',
      'bg': 'Вашето име / Компания',
      'hr': 'Vaše Ime / Tvrtka',
      'sk': 'Vaše Meno / Spoločnosť',
      'sl': 'Vaše Ime / Podjetje'
    },
    'email': {
      'en': 'Email',
      'es': 'Correo Electrónico',
      'fr': 'Email',
      'de': 'E-Mail',
      'it': 'Email',
      'pt': 'Email',
      'ru': 'Email',
      'ja': 'メール',
      'zh': '电子邮件',
      'ko': '이메일',
      'ar': 'البريد الإلكتروني',
      'hi': 'ईमेल',
      'th': 'อีเมล',
      'vi': 'Email',
      'id': 'Email',
      'ms': 'E-mel',
      'tl': 'Email',
      'tr': 'E-posta',
      'pl': 'Email',
      'nl': 'Email',
      'sv': 'E-post',
      'no': 'E-post',
      'da': 'Email',
      'fi': 'Sähköposti',
      'el': 'Email',
      'he': 'אימייל',
      'cs': 'Email',
      'hu': 'Email',
      'ro': 'Email',
      'uk': 'Email',
      'bg': 'Имейл',
      'hr': 'Email',
      'sk': 'Email',
      'sl': 'Email'
    },
    'address': {
      'en': 'Address',
      'es': 'Dirección',
      'fr': 'Adresse',
      'de': 'Adresse',
      'it': 'Indirizzo',
      'pt': 'Endereço',
      'ru': 'Адрес',
      'ja': '住所',
      'zh': '地址',
      'ko': '주소',
      'ar': 'العنوان',
      'hi': 'पता',
      'th': 'ที่อยู่',
      'vi': 'Địa chỉ',
      'id': 'Alamat',
      'ms': 'Alamat',
      'tl': 'Address',
      'tr': 'Adres',
      'pl': 'Adres',
      'nl': 'Adres',
      'sv': 'Adress',
      'no': 'Adresse',
      'da': 'Adresse',
      'fi': 'Osoite',
      'el': 'Διεύθυνση',
      'he': 'כתובת',
      'cs': 'Adresa',
      'hu': 'Cím',
      'ro': 'Adresă',
      'uk': 'Адреса',
      'bg': 'Адрес',
      'hr': 'Adresa',
      'sk': 'Adresa',
      'sl': 'Naslov'
    },
    'client_name': {
      'en': 'Client Name',
      'es': 'Nombre del Cliente',
      'fr': 'Nom du Client',
      'de': 'Kundenname',
      'it': 'Nome Cliente',
      'pt': 'Nome do Cliente',
      'ru': 'Имя Клиента',
      'ja': 'クライアント名',
      'zh': '客户姓名',
      'ko': '고객명',
      'ar': 'اسم العميل',
      'hi': 'ग्राहक का नाम',
      'th': 'ชื่อลูกค้า',
      'vi': 'Tên Khách hàng',
      'id': 'Nama Klien',
      'ms': 'Nama Pelanggan',
      'tl': 'Pangalan ng Klient',
      'tr': 'Müşteri Adı',
      'pl': 'Nazwa Klienta',
      'nl': 'Klantnaam',
      'sv': 'Klientnamn',
      'no': 'Kundenavn',
      'da': 'Kundenavn',
      'fi': 'Asiakkaan nimi',
      'el': 'Όνομα Πελάτη',
      'he': 'שם לקוח',
      'cs': 'Jméno Zákazníka',
      'hu': 'Ügyfélnév',
      'ro': 'Nume Client',
      'uk': 'Ім\'я Клієнта',
      'bg': 'Име на клиент',
      'hr': 'Ime Klijenta',
      'sk': 'Meno Klienta',
      'sl': 'Ime Stranke'
    },
    'items': {
      'en': 'Items',
      'es': 'Artículos',
      'fr': 'Articles',
      'de': 'Positionen',
      'it': 'Articoli',
      'pt': 'Itens',
      'ru': 'Позиции',
      'ja': '項目',
      'zh': '项目',
      'ko': '품목',
      'ar': 'العناصر',
      'hi': 'आइटम',
      'th': 'รายการ',
      'vi': 'Mục',
      'id': 'Item',
      'ms': 'Item',
      'tl': 'Mga Item',
      'tr': 'Öğeler',
      'pl': 'Pozycje',
      'nl': 'Items',
      'sv': 'Artiklar',
      'no': 'Varer',
      'da': 'Varer',
      'fi': 'Tuotteet',
      'el': 'Στοιχεία',
      'he': 'פריטים',
      'cs': 'Položky',
      'hu': 'Tételek',
      'ro': 'Articole',
      'uk': 'Позиції',
      'bg': 'Артикули',
      'hr': 'Stavke',
      'sk': 'Položky',
      'sl': 'Predmeti'
    },
    'add_item': {
      'en': 'Add Item',
      'es': 'Agregar Artículo',
      'fr': 'Ajouter un Article',
      'de': 'Position Hinzufügen',
      'it': 'Aggiungi Articolo',
      'pt': 'Adicionar Item',
      'ru': 'Добавить Позицию',
      'ja': '項目を追加',
      'zh': '添加项目',
      'ko': '품목 추가',
      'ar': 'إضافة عنصر',
      'hi': 'आइटम जोड़ें',
      'th': 'เพิ่มรายการ',
      'vi': 'Thêm Mục',
      'id': 'Tambah Item',
      'ms': 'Tambah Item',
      'tl': 'Magdagdag ng Item',
      'tr': 'Öge Ekle',
      'pl': 'Dodaj Pozycję',
      'nl': 'Item Toevoegen',
      'sv': 'Lägg till Artikel',
      'no': 'Legg til Vare',
      'da': 'Tilføj Vare',
      'fi': 'Lisää Tuote',
      'el': 'Προσθήκη Στοιχείου',
      'he': 'הוסף פריט',
      'cs': 'Přidat Položku',
      'hu': 'Tétel Hozzáadása',
      'ro': 'Adaugă Articol',
      'uk': 'Додати Позицію',
      'bg': 'Добави Артикул',
      'hr': 'Dodaj Stavku',
      'sk': 'Pridať Položku',
      'sl': 'Dodaj Predmet'
    },
    'description': {
      'en': 'Description',
      'es': 'Descripción',
      'fr': 'Description',
      'de': 'Beschreibung',
      'it': 'Descrizione',
      'pt': 'Descrição',
      'ru': 'Описание',
      'ja': '説明',
      'zh': '描述',
      'ko': '설명',
      'ar': 'الوصف',
      'hi': 'विवरण',
      'th': 'คำอธิบาย',
      'vi': 'Mô tả',
      'id': 'Deskripsi',
      'ms': 'Penerangan',
      'tl': 'Deskripsyon',
      'tr': 'Açıklama',
      'pl': 'Opis',
      'nl': 'Beschrijving',
      'sv': 'Beskrivning',
      'no': 'Beskrivelse',
      'da': 'Beskrivelse',
      'fi': 'Kuvaus',
      'el': 'Περιγραφή',
      'he': 'תיאור',
      'cs': 'Popis',
      'hu': 'Leírás',
      'ro': 'Descriere',
      'uk': 'Опис',
      'bg': 'Описание',
      'hr': 'Opis',
      'sk': 'Popis',
      'sl': 'Opis'
    },
    'quantity': {
      'en': 'Quantity',
      'es': 'Cantidad',
      'fr': 'Quantité',
      'de': 'Menge',
      'it': 'Quantità',
      'pt': 'Quantidade',
      'ru': 'Количество',
      'ja': '数量',
      'zh': '数量',
      'ko': '수량',
      'ar': 'الكمية',
      'hi': 'मात्रा',
      'th': 'จำนวน',
      'vi': 'Số lượng',
      'id': 'Kuantitas',
      'ms': 'Kuantiti',
      'tl': 'Dami',
      'tr': 'Miktar',
      'pl': 'Ilość',
      'nl': 'Hoeveelheid',
      'sv': 'Kvantitet',
      'no': 'Antall',
      'da': 'Antal',
      'fi': 'Määrä',
      'el': 'Ποσότητα',
      'he': 'כמות',
      'cs': 'Množství',
      'hu': 'Mennyiség',
      'ro': 'Cantitate',
      'uk': 'Кількість',
      'bg': 'Количество',
      'hr': 'Količina',
      'sk': 'Množstvo',
      'sl': 'Količina'
    },
    'price': {
      'en': 'Price',
      'es': 'Precio',
      'fr': 'Prix',
      'de': 'Preis',
      'it': 'Prezzo',
      'pt': 'Preço',
      'ru': 'Цена',
      'ja': '価格',
      'zh': '价格',
      'ko': '가격',
      'ar': 'السعر',
      'hi': 'कीमत',
      'th': 'ราคา',
      'vi': 'Giá',
      'id': 'Harga',
      'ms': 'Harga',
      'tl': 'Presyo',
      'tr': 'Fiyat',
      'pl': 'Cena',
      'nl': 'Prijs',
      'sv': 'Pris',
      'no': 'Pris',
      'da': 'Pris',
      'fi': 'Hinta',
      'el': 'Τιμή',
      'he': 'מחיר',
      'cs': 'Cena',
      'hu': 'Ár',
      'ro': 'Preț',
      'uk': 'Ціна',
      'bg': 'Цена',
      'hr': 'Cijena',
      'sk': 'Cena',
      'sl': 'Cena'
    },
    'total': {
      'en': 'Total',
      'es': 'Total',
      'fr': 'Total',
      'de': 'Gesamt',
      'it': 'Totale',
      'pt': 'Total',
      'ru': 'Итого',
      'ja': '合計',
      'zh': '总计',
      'ko': '합계',
      'ar': 'المجموع',
      'hi': 'कुल',
      'th': 'รวม',
      'vi': 'Tổng',
      'id': 'Total',
      'ms': 'Jumlah',
      'tl': 'Kabuuan',
      'tr': 'Toplam',
      'pl': 'Suma',
      'nl': 'Totaal',
      'sv': 'Total',
      'no': 'Total',
      'da': 'Total',
      'fi': 'Yhteensä',
      'el': 'Σύνολο',
      'he': 'סה"כ',
      'cs': 'Celkem',
      'hu': 'Összesen',
      'ro': 'Total',
      'uk': 'Загалом',
      'bg': 'Общо',
      'hr': 'Ukupno',
      'sk': 'Spolu',
      'sl': 'Skupaj'
    },
    'subtotal': {
      'en': 'Subtotal',
      'es': 'Subtotal',
      'fr': 'Sous-total',
      'de': 'Zwischensumme',
      'it': 'Subtotale',
      'pt': 'Subtotal',
      'ru': 'Промежуточный Итог',
      'ja': '小計',
      'zh': '小计',
      'ko': '소계',
      'ar': 'المجموع الفرعي',
      'hi': 'उप-कुल',
      'th': 'รวมย่อย',
      'vi': 'Tạm tính',
      'id': 'Subtotal',
      'ms': 'Jumlah',
      'tl': 'Kabuuan',
      'tr': 'Ara Toplam',
      'pl': 'Suma',
      'nl': 'Subtotaal',
      'sv': 'Delsumma',
      'no': 'Delsum',
      'da': 'Subtotal',
      'fi': 'Välisumma',
      'el': 'Μερικό Σύνολο',
      'he': 'סך הכל',
      'cs': 'Mezisoučet',
      'hu': 'Részösszeg',
      'ro': 'Subtotal',
      'uk': 'Проміжний підсумок',
      'bg': 'Междинна сума',
      'hr': 'Međuzbroj',
      'sk': 'Medzisúčet',
      'sl': 'Vmesna vsota'
    },
    'tax_rate': {
      'en': 'Tax Rate',
      'es': 'Tasa de Impuesto',
      'fr': 'Taux de Taxe',
      'de': 'Steuersatz',
      'it': 'Aliquota d\'Imposta',
      'pt': 'Taxa de Imposto',
      'ru': 'Ставка Налога',
      'ja': '税率',
      'zh': '税率',
      'ko': '세율',
      'ar': 'معدل الضريبة',
      'hi': 'कर दर',
      'th': 'อัตราภาษี',
      'vi': 'Thuế suất',
      'id': 'Tarif Pajak',
      'ms': 'Kadar Cukai',
      'tl': 'Tax Rate',
      'tr': 'Vergi Oranı',
      'pl': 'Stawka Podatku',
      'nl': 'Belastingtarief',
      'sv': 'Skattesats',
      'no': 'Skattesats',
      'da': 'Skattesats',
      'fi': 'Veroprosentti',
      'el': 'Συντελεστής Φόρου',
      'he': 'שיעור מס',
      'cs': 'Daňová Sazba',
      'hu': 'Adókulcs',
      'ro': 'Rata Taxei',
      'uk': 'Ставка Податку',
      'bg': 'Данъчна Ставка',
      'hr': 'Porezna Stopa',
      'sk': 'Daňová Sadzba',
      'sl': 'Davekna Stopa'
    },
    'notes': {
      'en': 'Notes',
      'es': 'Notas',
      'fr': 'Notes',
      'de': 'Notizen',
      'it': 'Note',
      'pt': 'Notas',
      'ru': 'Примечания',
      'ja': '備考',
      'zh': '备注',
      'ko': '참고사항',
      'ar': 'ملاحظات',
      'hi': 'नोट्स',
      'th': 'หมายเหตุ',
      'vi': 'Ghi chú',
      'id': 'Catatan',
      'ms': 'Nota',
      'tl': 'Mga Tala',
      'tr': 'Notlar',
      'pl': 'Uwagi',
      'nl': 'Notities',
      'sv': 'Anteckningar',
      'no': 'Notater',
      'da': 'Noter',
      'fi': 'Huomautukset',
      'el': 'Σημειώσεις',
      'he': 'הערות',
      'cs': 'Poznámky',
      'hu': 'Megjegyzések',
      'ro': 'Note',
      'uk': 'Примітки',
      'bg': 'Бележки',
      'hr': 'Bilješke',
      'sk': 'Poznámky',
      'sl': 'Opombe'
    },
    'language': {
      'en': 'Language',
      'es': 'Idioma',
      'fr': 'Langue',
      'de': 'Sprache',
      'it': 'Lingua',
      'pt': 'Idioma',
      'ru': 'Язык',
      'ja': '言語',
      'zh': '语言',
      'ko': '언어',
      'ar': 'اللغة',
      'hi': 'भाषा',
      'th': 'ภาษา',
      'vi': 'Ngôn ngữ',
      'id': 'Bahasa',
      'ms': 'Bahasa',
      'tl': 'Wika',
      'tr': 'Dil',
      'pl': 'Język',
      'nl': 'Taal',
      'sv': 'Språk',
      'no': 'Språk',
      'da': 'Sprog',
      'fi': 'Kieli',
      'el': 'Γλώσσα',
      'he': 'שפה',
      'cs': 'Jazyk',
      'hu': 'Nyelv',
      'ro': 'Limbă',
      'uk': 'Мова',
      'bg': 'Език',
      'hr': 'Jezik',
      'sk': 'Jazyk',
      'sl': 'Jezik'
    },
    'change_logo': {
      'en': 'Change Logo',
      'es': 'Cambiar Logo',
      'fr': 'Changer le Logo',
      'de': 'Logo Ändern',
      'it': 'Cambia Logo',
      'pt': 'Alterar Logo',
      'ru': 'Изменить Логотип',
      'ja': 'ロゴ変更',
      'zh': '更换Logo',
      'ko': '로고 변경',
      'ar': 'تغيير الشعار',
      'hi': 'लोगो बदलें',
      'th': 'เปลี่ยนโลโก้',
      'vi': 'Thay đổi Logo',
      'id': 'Ganti Logo',
      'ms': 'Tukar Logo',
      'tl': 'Palitan ang Logo',
      'tr': 'Logo Değiştir',
      'pl': 'Zmień Logo',
      'nl': 'Logo Wijzigen',
      'sv': 'Byt Logo',
      'no': 'Bytt Logo',
      'da': 'Skift Logo',
      'fi': 'Vaihda Logo',
      'el': 'Αλλαγή Λογοτύπου',
      'he': 'שינוי לוגו',
      'cs': 'Změnit Logo',
      'hu': 'Logo Módosítása',
      'ro': 'Schimbă Logo',
      'uk': 'Змінити Логотип',
      'bg': 'Промяна на лого',
      'hr': 'Promijeni Logo',
      'sk': 'Zmeniť Logo',
      'sl': 'Spremeni Logo'
    },
    'invoice_title_placeholder': {
      'en': 'Invoice title',
      'es': 'Título de factura',
      'fr': 'Titre de facture',
      'de': 'Rechnungstitel',
      'it': 'Titolo fattura',
      'pt': 'Título da fatura',
      'ru': 'Заголовок счета',
      'ja': '請求書タイトル',
      'zh': '发票标题',
      'ko': '송장 제목',
      'ar': 'عنوان الفاتورة',
      'hi': 'इनवॉइस शीर्षक',
      'th': 'ชื่อเรื่องใบแจ้งหนี้',
      'vi': 'Tiêu đề hóa đơn',
      'id': 'Judul Invoice',
      'ms': 'Tajuk Invois',
      'tl': 'Pamagat ng Invoice',
      'tr': 'Fatura Başlığı',
      'pl': 'Tytuł faktury',
      'nl': 'Factuur titel',
      'sv': 'Fakturitel',
      'no': 'Fakturatittel',
      'da': 'Fakturatitel',
      'fi': 'Laskun otsikko',
      'el': 'Τίτλος Τιμολογίου',
      'he': 'כותרת חשבונית',
      'cs': 'Název faktury',
      'hu': 'Számla címe',
      'ro': 'Titlu factură',
      'uk': 'Заголовок рахунку',
      'bg': 'Заглавие на фактура',
      'hr': 'Naslov računa',
      'sk': 'Názov faktúry',
      'sl': 'Naslov računa'
    },
    'font_settings': {
      'en': 'Font Settings',
      'es': 'Configuración de Fuente',
      'fr': 'Paramètres de Police',
      'de': 'Schrifteinstellungen',
      'it': 'Impostazioni Carattere',
      'pt': 'Configurações de Fonte',
      'ru': 'Настройки Шрифта',
      'ja': 'フォント設定',
      'zh': '字体设置',
      'ko': '글꼴 설정',
      'ar': 'إعدادات الخط',
      'hi': 'फ़ॉन्ट सेटिंग्स',
      'th': 'การตั้งค่าฟอนต์',
      'vi': 'Cài đặt Phông chữ',
      'id': 'Pengaturan Font',
      'ms': 'Tetapan Fon',
      'tl': 'Mga Setting ng Font',
      'tr': 'Yazı Tipi Ayarları',
      'pl': 'Ustawienia Czcionki',
      'nl': 'Lettertype Instellingen',
      'sv': 'Typsnittsinställningar',
      'no': 'Skriftinnstillinger',
      'da': 'Skriftindstillinger',
      'fi': 'Fonttiasetukset',
      'el': 'Ρυθμίσεις Γραμματοσειράς',
      'he': 'הגדרות גופן',
      'cs': 'Nastavení Písma',
      'hu': 'Betűtípus Beállítások',
      'ro': 'Setări Font',
      'uk': 'Налаштування Шрифту',
      'bg': 'Настройки на шрифт',
      'hr': 'Postavke Fonta',
      'sk': 'Nastavenia Písma',
      'sl': 'Nastavitve Pisave'
    },
    'color_settings': {
      'en': 'Color Settings',
      'es': 'Configuración de Color',
      'fr': 'Paramètres de Couleur',
      'de': 'Farbeinstellungen',
      'it': 'Impostazioni Colore',
      'pt': 'Configurações de Cor',
      'ru': 'Настройки Цвета',
      'ja': 'カラー設定',
      'zh': '颜色设置',
      'ko': '색상 설정',
      'ar': 'إعدادات اللون',
      'hi': 'रंग सेटिंग्स',
      'th': 'การตั้งค่าสี',
      'vi': 'Cài đặt Màu sắc',
      'id': 'Pengaturan Warna',
      'ms': 'Tetapan Warna',
      'tl': 'Mga Setting ng Kulay',
      'tr': 'Renk Ayarları',
      'pl': 'Ustawienia Koloru',
      'nl': 'Kleur Instellingen',
      'sv': 'Färginställningar',
      'no': 'Fargeinnstillinger',
      'da': 'Farveindstillinger',
      'fi': 'Väriasetukset',
      'el': 'Ρυθμίσεις Χρώματος',
      'he': 'הגדרות צבע',
      'cs': 'Nastavení Barvy',
      'hu': 'Szín Beállítások',
      'ro': 'Setări Culoare',
      'uk': 'Налаштування Кольору',
      'bg': 'Настройки на цвят',
      'hr': 'Postavke Boje',
      'sk': 'Nastavenia Farby',
      'sl': 'Nastavitve Barve'
    },
    'border_settings': {
      'en': 'Border Settings',
      'es': 'Configuración de Borde',
      'fr': 'Paramètres de Bordure',
      'de': 'Rahmeneinstellungen',
      'it': 'Impostazioni Bordo',
      'pt': 'Configurações de Borda',
      'ru': 'Настройки Рамки',
      'ja': 'ボーダー設定',
      'zh': '边框设置',
      'ko': '테두리 설정',
      'ar': 'إعدادات الحدود',
      'hi': 'बॉर्डर सेटिंग्स',
      'th': 'การตั้งค่าเส้นขอบ',
      'vi': 'Cài đặt Viền',
      'id': 'Pengaturan Batas',
      'ms': 'Tetapan Sempadan',
      'tl': 'Mga Setting ng Border',
      'tr': 'Kenarlık Ayarları',
      'pl': 'Ustawienia Obramowania',
      'nl': 'Rand Instellingen',
      'sv': 'Kantinställningar',
      'no': 'Kantinnstillinger',
      'da': 'Kantindstillinger',
      'fi': 'Reuna-asetukset',
      'el': 'Ρυθμίσεις Περιγράμματος',
      'he': 'הגדרות מסגרת',
      'cs': 'Nastavení Ohraničení',
      'hu': 'Keret Beállítások',
      'ro': 'Setări Bordură',
      'uk': 'Налаштування Рамки',
      'bg': 'Настройки на граница',
      'hr': 'Postavke Obruba',
      'sk': 'Nastavenia Okraja',
      'sl': 'Nastavitve Roba'
    },
    'shadow_settings': {
      'en': 'Shadow Settings',
      'es': 'Configuración de Sombra',
      'fr': 'Paramètres d\'Ombre',
      'de': 'Schatteneinstellungen',
      'it': 'Impostazioni Ombra',
      'pt': 'Configurações de Sombra',
      'ru': 'Настройки Тени',
      'ja': 'シャドウ設定',
      'zh': '阴影设置',
      'ko': '그림자 설정',
      'ar': 'إعدادات الظل',
      'hi': 'छाया सेटिंग्स',
      'th': 'การตั้งค่าเงา',
      'vi': 'Cài đặt Bóng',
      'id': 'Pengaturan Bayangan',
      'ms': 'Tetapan Bayangan',
      'tl': 'Mga Setting ng Anino',
      'tr': 'Gölge Ayarları',
      'pl': 'Ustawienia Cienia',
      'nl': 'Schaduw Instellingen',
      'sv': 'Skugginställningar',
      'no': 'Skyggeinnstillinger',
      'da': 'Skyggeindstillinger',
      'fi': 'Varjoasetukset',
      'el': 'Ρυθμίσεις Σκιάς',
      'he': 'הגדרות צל',
      'cs': 'Nastavení Stínu',
      'hu': 'Árnyék Beállítások',
      'ro': 'Setări Umbră',
      'uk': 'Налаштування Тіні',
      'bg': 'Настройки на сянка',
      'hr': 'Postavke Sjenke',
      'sk': 'Nastavenia Tiena',
      'sl': 'Nastavitve Sence'
    },
    'tax_and_totals_calculated_automatically': {
      'en': 'Tax and totals calculated automatically',
      'es': 'Impuestos y totales calculados automáticamente',
      'fr': 'Taxe et totaux calculés automatiquement',
      'de': 'Steuer und Summen automatisch berechnet',
      'it': 'Imposte e totali calcolati automaticamente',
      'pt': 'Impostos e totais calculados automaticamente',
      'ru': 'Налоги и итоги рассчитываются автоматически',
      'ja': '税金と合計は自動計算',
      'zh': '税费和总计自动计算',
      'ko': '세금 및 총계 자동 계산',
      'ar': 'الضريبة والإجماليات محاسبة تلقائياً',
      'hi': 'कर और कुल स्वचालित रूप से गणना',
      'th': 'ภาษีและผลรวมคำนวณโดยอัตโนมัติ',
      'vi': 'Thuế và tổng số được tính tự động',
      'id': 'Pajak dan total dihitung otomatis',
      'ms': 'Cukai dan jumlah dikira secara automatik',
      'tl': 'Buwis at kabuuang kinakalkula nang awtomatiko',
      'tr': 'Vergi ve toplamlar otomatik olarak hesaplanır',
      'pl': 'Podatek i sumy obliczane automatycznie',
      'nl': 'Belasting en totalen automatisch berekend',
      'sv': 'Skatt och totaler beräknas automatiskt',
      'no': 'Skatt og totaler beregnes automatisk',
      'da': 'Skat og totaler beregnet automatisk',
      'fi': 'Vero ja summat lasketaan automaattisesti',
      'el': 'Φόρος και σύνολα υπολογίζονται αυτόματα',
      'he': 'מס וסכומים מחושבים אוטומטית',
      'cs': 'Daň a celkové částky automaticky vypočítány',
      'hu': 'Adó és összegek automatikusan kiszámítva',
      'ro': 'Taxă și totaluri calculate automat',
      'uk': 'Податок та суми розраховані автоматично',
      'bg': 'Данък и суми изчислени автоматично',
      'hr': 'Porez i ukupno izračunati automatski',
      'sk': 'Daň a sumy automaticky vypočítané',
      'sl': 'Davek in skupaj avtomatsko izračunani'
    },
    // Hero Section
    'professional_invoice_generator': {
      'en': 'Perfect Professional Invoice Generator',
      'es': 'Generador de Facturas Perfecto Profesional',
      'fr': 'Générateur de Factures Parfait Professionnel',
      'de': 'Perfekter Professioneller Rechnungsgenerator',
      'it': 'Generatore di Fatture Perfetto Professionale',
      'pt': 'Gerador de Faturas Perfeito Profissional',
      'ru': 'Идеальный Профессиональный Генератор Счетов',
      'ja': '完璧なプロフェッショナル請求書ジェネレーター',
      'zh': '完美专业发票生成器',
      'ko': '완벽한 전문 송장 생성기',
      'ar': 'مولّد الفواتير المثالى الاحترافي',
      'hi': 'परफेक्ट पेशेवर इनवॉइस जनरेटर',
      'th': 'เครื่องสร้างใบแจ้งหนี้ที่สมบูรณ์แบบแบบอาชีพ',
      'vi': 'Trình tạo Hóa đơn hoàn hảo Chuyên nghiệp',
      'id': 'Perfect Professional Invoice Generator',
      'ms': 'Penjana Invois Sempurna Profesional',
      'tl': 'Perfect na Propesyonal na Invoice Generator',
      'tr': 'Mükemmel Profesyonel Fatura Oluşturucu',
      'pl': 'Perfekcyjny Profesjonalny Generator Faktur',
      'nl': 'Perfecte Professionele Factuur Generator',
      'sv': 'Perfekt Professionell Fakturagenerator',
      'no': 'Perfekt Profesjonell Fakturagenerator',
      'da': 'Perfekt Professionel Fakturagenerator',
      'fi': 'Täydellinen Ammattimainen Laskugeneraattori',
      'el': 'Τέλεια Επαγγελματική Γεννήτρια Τιμολογίων',
      'he': 'מחולל חשבוניות מקצועי מושלם',
      'cs': 'Perfektní Profesionální Generátor Faktur',
      'hu': 'Tökéletes Professzionális Számla Generátor',
      'ro': 'Generator Facturi Perfect Profesional',
      'uk': 'Ідеальний Професійний Генератор Рахунків',
      'bg': 'Перфектен Професионален генератор на фактури',
      'hr': 'Savršen Profesionalni Generator Računa',
      'sk': 'Perfektný Profesionálny Generátor Faktúr',
      'sl': 'Popoln Profesionalni Generator Računov'
    },
    'hero_description': {
      'en': 'Create beautiful, professional invoices in seconds. No registration required. Download as PDF instantly.',
      'es': 'Cree facturas hermosas y profesionales en segundos. Sin registro requerido. Descargue como PDF instantáneamente.',
      'fr': 'Créez de belles factures professionnelles en quelques secondes. Aucune inscription requise. Téléchargez instantanément en PDF.',
      'de': 'Erstellen Sie in Sekunden schöne, professionelle Rechnungen. Keine Registrierung erforderlich. Sofort als PDF herunterladen.',
      'it': 'Crea fatture belle e professionali in pochi secondi. Nessuna registrazione richiesta. Scarica istantaneamente in PDF.',
      'pt': 'Crie faturas bonitas e profissionais em segundos. Sem registro necessário. Baixe instantaneamente como PDF.',
      'ru': 'Создавайте красивые профессиональные счета за секунды. Регистрация не требуется. Мгновенная загрузка в PDF.',
      'ja': '数秒で美しいプロフェッショナルな請求書を作成。登録不要。PDFで即座ダウンロード。',
      'zh': '在几秒钟内创建美观专业的发票。无需注册。立即下载PDF。',
      'ko': '몇 초 만에 아름답고 전문적인 송장을 만드세요. 등록이 필요하지 않습니다. 즉시 PDF로 다운로드하세요.',
      'ar': 'أنشئ فواتير جميلة واحترافية في ثوانٍ. لا تحتاج تسجيل. تحمل فوري كملف PDF.',
      'hi': 'सेकंड में सुंदर, पेशेवर इनवॉइस बनाएं। कोई पंजीकरण आवश्यक नहीं। तुरंत PDF डाउनलोड करें।',
      'th': 'สร้างใบแจ้งหนี้ที่สวยงามและเป็นมืออาชีพในไม่กี่วินาที ไม่ต้องสมัครสมาชิก ดาวน์โหลด PDF ทันที',
      'vi': 'Tạo hóa đơn đẹp, chuyên nghiệp trong vài giây. Không cần đăng ký. Tải xuống PDF ngay lập tức.',
      'id': 'Buat invoice yang indah dan profesional dalam hitungan detik. Tidak perlu registrasi. Unduh PDF langsung.',
      'ms': 'Cipta invois yang cantik dan profesional dalam saat. Tiada pendaftaran diperlukan. Muat turun PDF dengan segera.',
      'tl': 'Gumawa ng magagandang, propesyonal na invoice sa ilang segundo. Walang kailangang magrehistro. I-download agad bilang PDF.',
      'tr': 'Saniyeler içinde güzel, profesyonel faturalar oluşturun. Kayıt gerekli değil. Anında PDF olarak indirin.',
      'pl': 'Twórz piękne, profesjonalne faktury w kilka sekund. Nie jest wymagana rejestracja. Pobierz natychmiast jako PDF.',
      'nl': 'Maak in seconden mooie, professionele facturen. Geen registratie vereist. Direct downloaden als PDF.',
      'sv': 'Skapa vackra, professionella fakturor på några sekunder. Ingen registrering krävs. Ladda ner direkt som PDF.',
      'no': 'Lag vakre, profesjonelle fakturaer på sekunder. Ingen registrering påkrevd. Last ned umiddelbart som PDF.',
      'da': 'Opret smukke, professionelle fakturaer på sekunder. Ingen registrering påkrævet. Download øjeblikkeligt som PDF.',
      'fi': 'Luo kauniita, ammattimaisia laskuja sekunneissa. Ei rekisteröintiä vaadita. Lataa välittömästi PDF:nä.',
      'el': 'Δημιουργήστε όμορφα, επαγγελματικά τιμολόγια σε δευτερόλεπτα. Δεν απαιτείται εγγραφή. Άμεση λήψη ως PDF.',
      'he': 'צור חשבוניות יפות ומקצועייות בשניות. לא נדרשת רישום. הורד מיידית כ-PDF.',
      'cs': 'Vytvářejte krásné, profesionální faktury za několik sekund. Není vyžadována registrace. Okamžité stažení jako PDF.',
      'hu': 'Hozzon létre gyönyörű, professzionális számlákat másodpercek alatt. Nincs szükség regisztrációra. Azonnali letöltés PDF-ként.',
      'ro': 'Creați facturi frumoase, profesionale în câteva secunde. Nu este necesară înregistrarea. Descărcați instantaneu ca PDF.',
      'uk': 'Створюйте красиві професійні рахунки за лічені секунди. Реєстрація не потрібна. Миттєве завантаження PDF.',
      'bg': 'Създавайте красиви, професионални фактури за секунди. Не се изисква регистрация. Моментално изтегляне като PDF.',
      'hr': 'Stvorite lijepe, profesionalne račune u sekundama. Nije potrebna registracija. Odmah preuzmite kao PDF.',
      'sk': 'Vytvárajte krásne, profesionálne faktúry za niekoľko sekúnd. Nie je vyžadovaná registrácia. Okamžité stiahnutie ako PDF.',
      'sl': 'Ustvarite lepe, profesionalne račune v nekaj sekundah. Registracija ni potrebna. Takojšnje prenos kot PDF.'
    },
    'lightning_fast': {
      'en': 'Lightning Fast',
      'es': 'Rapidísimo',
      'fr': 'Rapide comme l\'éclair',
      'de': 'Blitzschnell',
      'it': 'Velocissimo',
      'pt': 'Ultra Rápido',
      'ru': 'Молниеносно',
      'ja': '超高速',
      'zh': '闪电般快速',
      'ko': '번개처럼 빠름',
      'ar': 'سريع كالبرق',
      'hi': 'तेज़ गति से',
      'th': 'เร็วเหมือนสายฟ้า',
      'vi': 'Cực Nhanh',
      'id': 'Luar Biasa Cepat',
      'ms': 'Luar Biasa Pantas',
      'tl': 'Kabilis-kilabot',
      'tr': 'Yıldırım Hızında',
      'pl': 'Błyskawicznie Szybki',
      'nl': 'Bliksemsnel',
      'sv': 'Lynsnabb',
      'no': 'Lynrask',
      'da': 'Lynhurtig',
      'fi': 'Salamannopea',
      'el': 'Αστραπιαία Γρήγορος',
      'he': 'מהיר כברק',
      'cs': 'Bleskově Rychlý',
      'hu': 'Villámgyors',
      'ro': 'Rapid ca Fulgerul',
      'uk': 'Блискавично Швидкий',
      'bg': 'Светкавично бърз',
      'hr': 'Brz kao munja',
      'sk': 'Bleskovo Rýchly',
      'sl': 'Streljno Hiter'
    },
    'create_invoices_under_60_seconds': {
      'en': 'Create and download invoices in under 60 seconds',
      'es': 'Cree y descargue facturas en menos de 60 segundos',
      'fr': 'Créez et téléchargez des factures en moins de 60 secondes',
      'de': 'Erstellen und laden Sie Rechnungen in unter 60 Sekunden herunter',
      'it': 'Crea e scarica fatture in meno di 60 secondi',
      'pt': 'Crie e baixe faturas em menos de 60 segundos',
      'ru': 'Создавайте и загружайте счета менее чем за 60 секунд',
      'ja': '60秒以内で請求書を作成・ダウンロード',
      'zh': '在60秒内创建和下载发票',
      'ko': '60초 이내에 송장 생성 및 다운로드',
      'ar': 'إنشاء الفواتير في أقل من 60 ثانية',
      'hi': '60 सेकंड में इनवॉइस बनाएं और डाउनलोड करें',
      'th': 'สร้างและดาวน์โหลดใบแจ้งหนี้ในไม่กี่วินาที',
      'vi': 'Tạo và tải xuống hóa đơn trong vưới 60 giây',
      'id': 'Buat dan unduh invoice dalam waktu kurang dari 60 detik',
      'ms': 'Cipta dan muat turun invois dalam masa kurang dari 60 saat',
      'tl': 'Gumawa at i-download ang mga invoice sa ilalim ng 60 segundo',
      'tr': '60 saniyeden az sürede fatura oluşturun ve indirin',
      'pl': 'Twórz i pobieraj faktury w mniej niż 60 sekund',
      'nl': 'Maak en download facturen in minder dan 60 seconden',
      'sv': 'Skapa och ladda ner fakturor på under 60 sekunder',
      'no': 'Opprett og last ned fakturaer på under 60 sekunder',
      'da': 'Opret og download fakturaer på under 60 sekunder',
      'fi': 'Luo ja lataa laskuja alle 60 sekunnissa',
      'el': 'Δημιουργήστε και κατεβάστε τιμολόγια σε λιγότερα από 60 δευτερόλεπτα',
      'he': 'צור ותải את החשבוניות בשניות',
      'cs': 'Vytvářejte a stahujte faktury za méně než 60 sekund',
      'hu': 'Hozzon létre és töltse le a számlákat 60 másodperc alatt',
      'ro': 'Creați și descărcați facturi în mai puțin de 60 de secunde',
      'uk': 'Створюйте та завантажуйте рахунки за менше ніж 60 секунд',
      'bg': 'Създавайте и изтегляйте фактури за по-малко от 60 секунди',
      'hr': 'Stvorite i preuzmite račune u manje od 60 sekundi',
      'sk': 'Vytvárajte a sťahujte faktúry za menej ako 60 sekúnd',
      'sl': 'Ustvarite in prenesite račune v manj kot 60 sekundah'
    },
    'global_access': {
      'en': 'Global Access',
      'es': 'Acceso Global',
      'fr': 'Accès Mondial',
      'de': 'Globaler Zugang',
      'it': 'Accesso Globale',
      'pt': 'Acesso Global',
      'ru': 'Глобальный Доступ',
      'ja': 'グローバルアクセス',
      'zh': '全球访问',
      'ko': '글로벌 접근',
      'ar': 'الوصول العالمي',
      'hi': 'वैश्विक पहुंच',
      'th': 'การเข้าถึงทั่วโลก',
      'vi': 'Truy Cập Toàn Cầu',
      'id': 'Akses Global',
      'ms': 'Akses Global',
      'tl': 'Global na Access',
      'tr': 'Küresel Erişim',
      'pl': 'Dostęp Globalny',
      'nl': 'Wereldwijde Toegang',
      'sv': 'Global Åtkomst',
      'no': 'Global Tilgang',
      'da': 'Global Adgang',
      'fi': 'Globaali Pääsy',
      'el': 'Παγκόσμια Πρόσβαση',
      'he': 'גישה גלובלית',
      'cs': 'Globální Přístup',
      'hu': 'Globális Hozzáférés',
      'ro': 'Acces Global',
      'uk': 'Глобальний Доступ',
      'bg': 'Глобален достъп',
      'hr': 'Globalni Pristup',
      'sk': 'Globálny Prístup',
      'sl': 'Globalni Dostop'
    },
    'works_anywhere_world': {
      'en': 'Works anywhere in the world with any currency',
      'es': 'Funciona en cualquier lugar del mundo con cualquier moneda',
      'fr': 'Fonctionne partout dans le monde avec n\'importe quelle devise',
      'de': 'Funktioniert überall auf der Welt mit jeder Währung',
      'it': 'Funziona in qualsiasi parte del mondo con qualsiasi valuta',
      'pt': 'Funciona em qualquer lugar do mundo com qualquer moeda',
      'ru': 'Работает в любой точке мира с любой валютой',
      'ja': '世界中のどこでも、どの通貨でも機能',
      'zh': '在全球任何地方使用任何货币',
      'ko': '세계 어디서나 어떤 화폐로도 작동',
      'ar': 'يعمل في أي مكان في العالم مع أي عملة',
      'hi': 'विश्व की किसी भी जगह पर किसी भी मुद्रा के साथ काम करता है',
      'th': 'ทำงานได้ทุกที่ในโลกโดยใช้สกุลเงินใดๆ',
      'vi': 'Hoạt động ở bất kỳ đâu trên thế giới với bất kỳ loại tiền tệ nào',
      'id': 'Bekerja di mana saja di dunia dengan mata uang apa pun',
      'ms': 'Berfungsi di mana-mana di dunia dengan mana-mana mata wang',
      'tl': 'Gumana kahit saan sa mundo kahit anong pera',
      'tr': 'Dünyanın her yerinde herhangi bir para birimiyle çalışır',
      'pl': 'Działa wszędzie na świecie z każdą walutą',
      'nl': 'Werkt overal ter wereld met elke valuta',
      'sv': 'Fungerar var som helst i världen med valfri valuta',
      'no': 'Fungerer hvor som helst i verden med hvilken som helst valuta',
      'da': 'Fungerer hvor som helst i verden med enhver valuta',
      'fi': 'Toimii missä tahansa maailmassa millä tahansa valuutalla',
      'el': 'Λειτουργεί οπουδήποτε στον κόσμο με οποιαδήποτε νόμισμα',
      'he': 'עובד בכל מקום בעולם עם כל מטבע',
      'cs': 'Funguje kdekoli na světě s jakoukoliv měnou',
      'hu': 'Bárhol a világon működik bármilyen pénznemmel',
      'ro': 'Funcționează oriunde în lume cu orice monedă',
      'uk': 'Працює будь-де у світі з будь-якою валютою',
      'bg': 'Работи навсякъде в света с всяка валута',
      'hr': 'Radi svugdje u svijetu s bilo kojom valutom',
      'sk': 'Funguje kdekoľvek na svete s akoukoľvek menou',
      'sl': 'Deluje povsod po svetu s katero koli valuto'
    },
    'secure_private': {
      'en': 'Secure & Private',
      'es': 'Seguro y Privado',
      'fr': 'Sécurisé et Privé',
      'de': 'Sicher & Privat',
      'it': 'Sicuro e Privato',
      'pt': 'Seguro e Privado',
      'ru': 'Безопасно и Приватно',
      'ja': '安全でプライベート',
      'zh': '安全保密',
      'ko': '안전하고 비공개',
      'ar': 'آمن وخاص',
      'hi': 'सुरक्षित और निजी',
      'th': 'ปลอดภัยและส่วนตัว',
      'vi': 'Bảo Mật & Riêng Tú',
      'id': 'Aman & Pribadi',
      'ms': 'Selamat & Peribadi',
      'tl': 'Ligtas at Pribado',
      'tr': 'Güvenli ve Özel',
      'pl': 'Bezpieczny i Prywatny',
      'nl': 'Veilig en Privé',
      'sv': 'Säkert och Privat',
      'no': 'Sikkert og Privat',
      'da': 'Sikkert og Privat',
      'fi': 'Turvallinen ja Yksityinen',
      'el': 'Ασφαλής και Ιδιωτικός',
      'he': 'ปลอดภัย ופרטי',
      'cs': 'Bezpečné a Soukromé',
      'hu': 'Biztonságos és Privát',
      'ro': 'Securizat și Privat',
      'uk': 'Безпечний та Приватний',
      'bg': 'Сигурен и личен',
      'hr': 'Sigurno i Privatno',
      'sk': 'Bezpečné a Súkromné',
      'sl': 'Varno in Zasebno'
    },
    'data_stays_private': {
      'en': 'Your data stays private. No registration needed',
      'es': 'Sus datos permanecen privados. No se necesita registro',
      'fr': 'Vos données restent privées. Aucune inscription n\'est nécessaire',
      'de': 'Ihre Daten bleiben privat. Keine Registrierung erforderlich',
      'it': 'I tuoi dati rimangono privati. Nessuna registrazione richiesta',
      'pt': 'Seus dados permanecem privados. Nenhum registro necessário',
      'ru': 'Ваши данные остаются конфиденциальными. Регистрация не требуется',
      'ja': 'データはプライベートのままです。登録不要',
      'zh': '您的数据保持私密。无需注册',
      'ko': '데이터는 비공개 상태입니다. 등록이 필요하지 않습니다',
      'ar': 'تبقى بياناتك خصوصية. لا تحتاج تسجيل',
      'hi': 'आपकी डेटा निजी रहेगी। कोई पंजीकरण आवश्यक नहीं',
      'th': 'ข้อมูลของคุณจะถูกจัดเก็บเป็นความลับ ไม่ต้องลงทะเบียน',
      'vi': 'Dữ liệu của bạn sẽ được giữ riêng tư. Không cần đăng ký',
      'id': 'Data Anda tetap pribadi. Tidak perlu registrasi',
      'ms': 'Data anda kekal peribadi. Tiada pendaftaran diperlukan',
      'tl': 'Ang iyong data ay nananatiling pribado. Walang kailangang magrehistro',
      'tr': 'Verileriniz özel kalır. Kayıt gerekli değil',
      'pl': 'Twoje dane pozostają prywatne. Nie jest wymagana rejestracja',
      'nl': 'Uw gegevens blijven privé. Geen registratie nodig',
      'sv': 'Dina data färdas privata. Ingen registrering krävs',
      'no': 'Dine data forblir private. Ingen registrering nødvendig',
      'da': 'Dine data forbliver private. Ingen registrering påkrævet',
      'fi': 'Tietosi pysyvät yksityisinä. Ei rekisteröintiä tarvita',
      'el': 'Τα δεδομένα σας παραμένουν ιδιωτικά. Δεν απαιτείται εγγραφή',
      'he': 'הנתונים שלכם נשמרים פרטיים. לא נדרשת רישום',
      'cs': 'Vaše data zůstávají soukromá. Není vyžadována registrace',
      'hu': 'Adatai privátok maradnak. Nincs szükség regisztrációra',
      'ro': 'Datele dvs. rămân private. Nu este necesară înregistrarea',
      'uk': 'Ваші дані залишаються конфіденційними. Реєстрація не потрібна',
      'bg': 'Вашите данни остават конфиденциални. Не се изисква регистрация',
      'hr': 'Vaši podaci ostaju privatni. Nije potrebna registracija',
      'sk': 'Vaše údaje zostávajú súkromné. Nie je vyžadovaná registrácia',
      'sl': 'Vaši podatki ostajajo zasebni. Registracija ni potrebna'
    },
    'why_choose_generator': {
      'en': 'Why Choose Our Invoice Generator?',
      'es': '¿Por Qué Elegir Nuestro Generador de Facturas?',
      'fr': 'Pourquoi Choisir Notre Générateur de Factures?',
      'de': 'Warum Unseren Rechnungsgenerator Wählen?',
      'it': 'Perché Scegliere il Nostro Generatore di Fatture?',
      'pt': 'Por Que Escolher Nosso Gerador de Faturas?',
      'ru': 'Почему Выбрать Наш Генератор Счетов?',
      'ja': 'なぜ私たちの請求書ジェネレーターを選択するのか？',
      'zh': '为什么选择我们的发票生成器？',
      'ko': '왜 우리 송장 생성기를 선택해야 하나요?',
      'ar': 'لماذا تختار مولد الفواتير الخاص بنا؟',
      'hi': 'हमारा इनवॉइस जनरेटर क्यों चुनें?',
      'th': 'ทำไมต้องเลือกเครื่องสร้างใบแจ้งหนี้ของเรา?',
      'vi': 'Tại Sao Chọn Trình Tạo Hóa Đơn Của Chúng Tôi?',
      'id': 'Mengapa Memilih Generator Invoice Kami?',
      'ms': 'Mengapa Pilih Penjana Invois Kami?',
      'tl': 'Bakit Piliin ang Invoice Generator Namin?',
      'tr': 'Neden Fatura Oluşturucumuzu Seçmelisiniz?',
      'pl': 'Dlaczego Wybrać Nasz Generator Faktur?',
      'nl': 'Waarom Onze Factuur Generator Kiezen?',
      'sv': 'Varför Välja Vår Fakturagenerator?',
      'no': 'Hvorfor Velge Vår Fakturagenerator?',
      'da': 'Hvorfor Vælge Vores Fakturagenerator?',
      'fi': 'Miksi Valita Laskugeneraattorimme?',
      'el': 'Γιατί να Επιλέξετε τη Γεννήτρια Τιμολογίων μας;',
      'he': 'למה לבחור במחולל החשבוניות שלנו?',
      'cs': 'Proč Si Vybrat Náš Generátor Faktur?',
      'hu': 'Miért Válassza Számla Generátorunkat?',
      'ro': 'De ce să Alegeți Generatorul nostru de Facturi?',
      'uk': 'Чому Обрати Наш Генератор Рахунків?',
      'bg': 'Защо да изберете нашия генератор на фактури?',
      'hr': 'Zašto Odabrati Naš Generator Računa?',
      'sk': 'Prečo Si Vybrať Náš Generátor Faktúr?',
      'sl': 'Zakaj Izbrati Naš Generator Računov?'
    },
    'no_registration_required': {
      'en': 'No Registration Required',
      'es': 'No se requiere registro',
      'fr': 'Aucune inscription requise',
      'de': 'Keine Registrierung erforderlich',
      'it': 'Nessuna registrazione richiesta',
      'pt': 'Nenhum registro necessário',
      'ru': 'Регистрация не требуется',
      'ja': '登録不要',
      'zh': '无需注册',
      'ko': '등록이 필요하지 않습니다',
      'ar': 'لا تحتاج تسجيل',
      'hi': 'कोई पंजीकरण आवश्यक नहीं',
      'th': 'ไม่ต้องลงทะเบียน',
      'vi': 'Không cần đăng ký',
      'id': 'Tidak Perlu Registrasi',
      'ms': 'Tiada Pendaftaran Diperlukan',
      'tl': 'Walang Kailangang Magrehistro',
      'tr': 'Kayıt Gerekli Değil',
      'pl': 'Nie jest wymagana rejestracja',
      'nl': 'Geen registratie vereist',
      'sv': 'Ingen registrering krävs',
      'no': 'Ingen registrering påkrevd',
      'da': 'Ingen registrering påkrævet',
      'fi': 'Ei rekisteröintiä vaadita',
      'el': 'Δεν απαιτείται εγγραφή',
      'he': 'לא נדרשת הרשמה',
      'cs': 'Není vyžadována registrace',
      'hu': 'Nincs szükség regisztrációra',
      'ro': 'Nu este necesară înregistrarea',
      'uk': 'Реєстрація не потрібна',
      'bg': 'Не се изисква регистрация',
      'hr': 'Nije potrebna registracija',
      'sk': 'Nie je vyžadovaná registrácia',
      'sl': 'Registracija ni potrebna'
    },
    'start_immediately': {
      'en': 'Start creating invoices immediately without signing up',
      'es': 'Comience a crear facturas inmediatamente sin registrarse',
      'fr': 'Commencez à créer des factures immédiatement sans vous inscrire',
      'de': 'Erstellen Sie sofort Rechnungen ohne sich anzumelden',
      'it': 'Inizia a creare fatture immediatamente senza registrarti',
      'pt': 'Comece a criar faturas imediatamente sem se inscrever',
      'ru': 'Начните создавать счета немедленно без регистрации',
      'ja': 'サインアップせずにすぐに請求書の作成を開始',
      'zh': '无需注册即可立即开始创建发票',
      'ko': '가입 없이 즉시 송장 생성 시작',
      'ar': 'ابدأ في إنشاء الفواتير فوراً دون التسجيل',
      'hi': 'बिना साइन अप किए तुरंत इनवॉइस बनाना शुरू करें',
      'th': 'เริ่มสร้างใบแจ้งหนี้ทันทีโดยไม่ต้องสมัคร',
      'vi': 'Bắt đầu tạo hóa đơn ngay lập tức mà không cần đăng ký',
      'id': 'Mulai membuat invoice langsung tanpa mendaftar',
      'ms': 'Mula cipta invois dengan serta-merta tanpa mendaftar',
      'tl': 'Magsimulang gumawa ng invoice kaagad nang hindi nagrerehistro',
      'tr': 'Kayıt olmadan hemen fatura oluşturmaya başlayın',
      'pl': 'Zacznij tworzyć faktury natychmiast bez rejestracji',
      'nl': 'Begin onmiddellijk met het maken van facturen zonder u te registreren',
      'sv': 'Börja skapa fakturor omedelbart utan att registrera dig',
      'no': 'Begynn å lage fakturaer umiddelbart uten å registrere deg',
      'da': 'Begynd at oprette fakturaer med det samme uden at tilmelde dig',
      'fi': 'Aloita laskujen luominen heti ilman rekisteröitymistä',
      'el': 'Ξεκινήστε να δημιουργείτε τιμολόγια αμέσως χωρίς εγγραφή',
      'he': 'התחל ליצור חשבוניות מיד ללא הרשמה',
      'cs': 'Začněte okamžitě vytvářet faktury bez registrace',
      'hu': 'Kezdje el azonnal a számlák létrehozását regisztráció nélkül',
      'ro': 'Începeți să creați facturi imediat fără vă înregistra',
      'uk': 'Негайно почніть створювати рахунки без реєстрації',
      'bg': 'Започнете да създавате фактури веднага без регистрация',
      'hr': 'Odmah počnite stvarati račune bez registracije',
      'sk': 'Začnite okamžite vytvárať faktúry bez registrácie',
      'sl': 'Takoj začnite ustvarjati račune brez registracije'
    },
    'professional_templates': {
      'en': 'Professional Templates',
      'es': 'Plantillas Profesionales',
      'fr': 'Modèles Professionnels',
      'de': 'Professionelle Vorlagen',
      'it': 'Modelli Professionali',
      'pt': 'Modelos Profissionais',
      'ru': 'Профессиональные Шаблоны',
      'ja': 'プロフェッショナルテンプレート',
      'zh': '专业模板',
      'ko': '전문 템플릿',
      'ar': 'قوالب احترافية',
      'hi': 'पेशेवर टेम्प्लेट',
      'th': 'เทมเพลตมืออาชีพ',
      'vi': 'Mẫu Chuyên nghiệp',
      'id': 'Template Profesional',
      'ms': 'Templat Profesional',
      'tl': 'Propesyonal na Template',
      'tr': 'Profesyonel Şablonlar',
      'pl': 'Profesjonalne Szablony',
      'nl': 'Professionele Sjablonen',
      'sv': 'Professionella Mallar',
      'no': 'Profesjonelle Maler',
      'da': 'Professionelle Skabeloner',
      'fi': 'Ammattimaiset Mallipohjat',
      'el': 'Επαγγελματικά Πρότυπα',
      'he': 'תבניות מקצועיות',
      'cs': 'Profesionální Šablony',
      'hu': 'Professzionális Sablonok',
      'ro': 'Șabloane Profesionale',
      'uk': 'Професійні Шаблони',
      'bg': 'Професионални шаблони',
      'hr': 'Profesionalni Predlošci',
      'sk': 'Profesionálne Šablóny',
      'sl': 'Profesionalne Predloge'
    },
    'clean_modern_design': {
      'en': 'Clean, modern design that impresses your clients',
      'es': 'Diseño limpio y moderno que impresiona a tus clientes',
      'fr': 'Design épuré et moderne qui impressionne vos clients',
      'de': 'Sauberes, modernes Design, das Ihre Kunden beeindruckt',
      'it': 'Design pulito e moderno che impressiona i tuoi clienti',
      'pt': 'Design limpo e moderno que impressiona seus clientes',
      'ru': 'Чистый, современный дизайн, который впечатляет ваших клиентов',
      'ja': 'クライアントに感嘆を与えるクールでモダンなデザイン',
      'zh': '给客户留下深刻印象的简洁现代设计',
      'ko': '고객에게 인상을 남기는 깔끔하고 현대적인 디자인',
      'ar': 'تصميم نظيف وحديث يثير إعجاب عملائك',
      'hi': 'आपके ग्राहकों को प्रभावित करने वाला साफ, आधुनिक डिज़ाइन',
      'th': 'ดีไซน์ที่สะอาดและทันสมัยที่ทำให้ลูกค้าประทับใจ',
      'vi': 'Thiết kế sạch sẽ, hiện đại gây ấn tượng với khách hàng của bạn',
      'id': 'Desain yang bersih dan modern yang mengesankan klien Anda',
      'ms': 'Reka bentuk yang bersih dan moden yang menarik perhatian pelanggan anda',
      'tl': 'Malinis, modern na disenyo na nagpukha sa iyong mga kliyente',
      'tr': 'Müşterilerinizi etkileyen temiz, modern tasarım',
      'pl': 'Czysty, nowoczesny design, który imponuje Twoim klientom',
      'nl': 'Schoon, modern ontwerp dat uw klanten imponneert',
      'sv': 'Ren, modern design som imponerar dina kunder',
      'no': 'Rent, moderne design som imponerer kundene dine',
      'da': 'Rent, moderne design der imponerer dine kunder',
      'fi': 'Siisti, moderni suunnittelu joka tekee vaikutuksen asiakkaisiisi',
      'el': 'Καθαρό, μοντέρνο σχεδιασμός που εντυπωσιάζει τους πελάτες σας',
      'he': 'עיצוב נקי ומודרני שמרשים את הלקוחות שלך',
      'cs': 'Čistý, moderní design, který ohromí vaše klienty',
      'hu': 'Tiszta, modern design, amely lenyűgözi ügyfeleit',
      'ro': 'Design curat, modern care îți impresionează clienții',
      'uk': 'Чистий, сучасний дизайн, який вражає ваших клієнтів',
      'bg': 'Изчистен, модерен дизайн, който впечатлява клиентите ви',
      'hr': 'Čist, modern dizajn koji oduševljava vaše klijente',
      'sk': 'Čistý, moderný dizajn, ktorý ohromí vašich klientov',
      'sl': 'Čist, sodoben dizajn, ki očaruje vaše stranke'
    },
    'pdf_download': {
      'en': 'PDF Download',
      'es': 'Descargar PDF',
      'fr': 'Téléchargement PDF',
      'de': 'PDF-Download',
      'it': 'Download PDF',
      'pt': 'Download PDF',
      'ru': 'Загрузка PDF',
      'ja': 'PDFダウンロード',
      'zh': 'PDF下载',
      'ko': 'PDF 다운로드',
      'ar': 'تحميل PDF',
      'hi': 'PDF डाउनलोड',
      'th': 'ดาวน์โหลด PDF',
      'vi': 'Tải PDF',
      'id': 'Unduh PDF',
      'ms': 'Muat Turun PDF',
      'tl': 'PDF Download',
      'tr': 'PDF İndir',
      'pl': 'Pobierz PDF',
      'nl': 'PDF Download',
      'sv': 'Ladda ner PDF',
      'no': 'Last ned PDF',
      'da': 'Download PDF',
      'fi': 'Lataa PDF',
      'el': 'Λήψη PDF',
      'he': 'הורד PDF',
      'cs': 'Stáhnout PDF',
      'hu': 'PDF Letöltés',
      'ro': 'Descarcă PDF',
      'uk': 'Завантажити PDF',
      'bg': 'Изтегли PDF',
      'hr': 'Preuzmi PDF',
      'sk': 'Stiahnuť PDF',
      'sl': 'Prenesi PDF'
    },
    'high_quality_pdfs': {
      'en': 'High-quality PDFs ready for printing or emailing',
      'es': 'PDFs de alta calidad listos para imprimir o enviar por correo',
      'fr': 'PDFs de haute qualité prêts pour l\'impression ou l\'envoi par e-mail',
      'de': 'Hochwertige PDFs bereit zum Drucken oder Versenden per E-Mail',
      'it': 'PDF di alta qualità pronti per la stampa o l\'invio via e-mail',
      'pt': 'PDFs de alta qualidade prontos para impressão ou envio por e-mail',
      'ru': 'PDF-файлы высокого качества, готовые для печати или отправки по электронной почте',
      'ja': '印刷やメール送信に対応した高品質PDF',
      'zh': '可直接打印或发送邮件的高质量PDF',
      'ko': '인쇄나 이메일 발송에 바로 사용할 수 있는 고품질 PDF',
      'ar': 'ملفات PDF عالية الجودة الجاهزة للطباعة أو الإرسال بالبريد الإلكتروني',
      'hi': 'प्रिंटिंग या ईमेल करने के लिए तैयार उच्च गुणवत्ता वाले PDF',
      'th': 'ไฟล์ PDF คุณภาพสูงพร้อมสำหรับการพิมพ์หรือส่งอีเมล',
      'vi': 'PDF chất lượng cao sẵn sàng để in hoặc gửi email',
      'id': 'PDF berkualitas tinggi siap untuk cetak atau kirim email',
      'ms': 'PDF berkualiti tinggi sedia untuk cetakan atau e-mel',
      'tl': 'Mataas na kalidad na PDF na handa para sa pag-print o pag-email',
      'tr': 'Yazdırma veya e-posta göndermeye hazır yüksek kaliteli PDF\'ler',
      'pl': 'PDF-y wysokiej jakości gotowe do druku lub wysyłki e-mailem',
      'nl': 'PDF\'s van hoge kwaliteit klaar om te printen of te e-mailen',
      'sv': 'Högkvalitets PDF:er redo för utskrift eller e-post',
      'no': 'Høykvalitets PDF-er klare for utskrift eller e-post',
      'da': 'Højkvalitets PDF\'er klar til print eller e-mail',
      'fi': 'Korkealaatuiset PDF:t valmiina tulostukseen tai sähköpostitse lähettämiseen',
      'el': 'PDF υψηλής ποιότητας έτοιμα για εκτύπωση ή αποστολή μέσω email',
      'he': 'קובצי PDF באיכות גבוהה מוכנים להדפסה או לשליחה בדוא"ל',
      'cs': 'PDF vysoké kvality připravené k tisku nebo odeslání e-mailem',
      'hu': 'Nyomtatásra vagy e-mail küldésre kész kiváló minőségű PDF-ek',
      'ro': 'PDF-uri de înaltă calitate gata pentru imprimare sau trimitere prin e-mail',
      'uk': 'PDF-файли високої якості, готові до друку або надсилання електронною поштою',
      'bg': 'PDF файлове с високо качество, готови за печат или изпращане по имейл',
      'hr': 'PDF-ovi visoke kvalitete spremni za ispis ili slanje e-poštom',
      'sk': 'PDF vysokej kvality pripravené na tlač alebo odoslanie e-mailom',
      'sl': 'PDF-ji visoke kakovosti pripravljeni za tiskanje ali pošiljanje po e-pošti'
    },
    'fully_customizable': {
      'en': 'Fully Customizable',
      'es': 'Totalmente Personalizable',
      'fr': 'Entièrement Personnalisable',
      'de': 'Vollständig Anpassbar',
      'it': 'Completamente Personalizzabile',
      'pt': 'Totalmente Personalizável',
      'ru': 'Полностью Настраиваемый',
      'ja': '完全にカスタマイズ可能',
      'zh': '完全可定制',
      'ko': '완전히 사용자 정의 가능',
      'ar': 'قابل للتخصيص بالكامل',
      'hi': 'पूरी तरह से अनुकूलन योग्य',
      'th': 'ปรับแต่งได้ทั้งหมด',
      'vi': 'Hoàn toàn Tùy chỉnh',
      'id': 'Sepenuhnya Dapat Disesuaikan',
      'ms': 'Boleh Disesuaikan Sepenuhnya',
      'tl': 'Puwedeng I-customize Buong-buoan',
      'tr': 'Tamamen Özelleştirilebilir',
      'pl': 'W pełni Konfigurowalny',
      'nl': 'Volledig Aanpasbaar',
      'sv': 'Fullt Anpassningsbar',
      'no': 'Fullt Tilpassbar',
      'da': 'Fuldt Tilpasselig',
      'fi': 'Täysin Mukautettavissa',
      'el': 'Πλήρως Προσαρμόσιμο',
      'he': 'ניתן להגדרה מלאה',
      'cs': 'Plně Přizpůsobitelný',
      'hu': 'Teljesen Testreszabható',
      'ro': 'Complet Personalizabil',
      'uk': 'Повністю Налаштовуваний',
      'bg': 'Напълно персонализируем',
      'hr': 'Potpuno Prilagodljiv',
      'sk': 'Plne Prispôsobiteľný',
      'sl': 'Popolnoma Prilagodljiv'
    },
    'add_logo_colors': {
      'en': 'Add your logo, colors, and personal touch',
      'es': 'Agregue su logo, colores y toque personal',
      'fr': 'Ajoutez votre logo, vos couleurs et votre touche personnelle',
      'de': 'Fügen Sie Ihr Logo, Farben und persönliche Note hinzu',
      'it': 'Aggiungi il tuo logo, colori e tocco personale',
      'pt': 'Adicione seu logo, cores e toque pessoal',
      'ru': 'Добавьте свой логотип, цвета и личные штрихи',
      'ja': 'ロゴ、色、個人的なタッチを追加',
      'zh': '添加您的标志、颜色和个人风格',
      'ko': '로고, 색상, 개인적인 터치 추가',
      'ar': 'أضف شعارك وألوانك ومزرك الشخصي',
      'hi': 'अपना लोगो, रंग और व्यक्तिगत स्पर्श जोड़ें',
      'th': 'เพิ่มโลโก้ สี และสัมผัสส่วนตัวของคุณ',
      'vi': 'Thêm logo, màu sắc và dấu ấn cá nhân của bạn',
      'id': 'Tambahkan logo, warna, dan sentuhan pribadi Anda',
      'ms': 'Tambah logo, warna dan sentuhan peribadi anda',
      'tl': 'Idagdag ang iyong logo, kulay, at personal na touch',
      'tr': 'Logonuzu, renklerinizi ve kişisel dokunuşunuzu ekleyin',
      'pl': 'Dodaj swój logo, kolory i osobisty akcent',
      'nl': 'Voeg uw logo, kleuren en persoonlijke touch toe',
      'sv': 'Lägg till din logotyp, färger och personliga touch',
      'no': 'Legg til din logo, farger og personlige touch',
      'da': 'Tilføj dit logo, farver og personlige touch',
      'fi': 'Lisää logosi, värisi ja henkilökohtainen tyyli',
      'el': 'Προσθέστε το λογότυπό σας, τα χρώματά σας και την προσωπική σας πινελιά',
      'he': 'הוסף את הלוגו, הצבעים והמגע האישי שלך',
      'cs': 'Přidejte své logo, barvy a osobní dotek',
      'hu': 'Adja hozzá logóját, színeit és személyes hangvételét',
      'ro': 'Adăugați logo-ul, culorile și atingerea personală',
      'uk': 'Додайте свій логотип, кольори та особисті деталі',
      'bg': 'Добавете своя логотип, цветове и личен щрих',
      'hr': 'Dodajte svoj logo, boje i osobni dodir',
      'sk': 'Pridajte svoje logo, farby a osobný dotyk',
      'sl': 'Dodajte svoje logo, barve in osebni dotik'
    },
    'mobile_friendly': {
      'en': 'Mobile Friendly',
      'es': 'Compatible con Móviles',
      'fr': 'Compatible Mobile',
      'de': 'Mobilfreundlich',
      'it': 'Compatibile con i Dispositivi Mobili',
      'pt': 'Compatível com Celulares',
      'ru': 'Мобильная Версия',
      'ja': 'モバイル対応',
      'zh': '移动友好',
      'ko': '모바일 친화적',
      'ar': 'متوافق مع الجوال',
      'hi': 'मोबाइल अनुकूल',
      'th': 'รองรับมือถือ',
      'vi': 'Thân thiện với Di Động',
      'id': 'Ramah Seluler',
      'ms': 'Mesra Mudah Alih',
      'tl': 'Mobile Friendly',
      'tr': 'Mobil Uyumlu',
      'pl': 'Przyjazny dla Urządzeń Mobilnych',
      'nl': 'Mobielvriendelijk',
      'sv': 'Mobilvänlig',
      'no': 'Mobilvennlig',
      'da': 'Mobilvenlig',
      'fi': 'Mobiiliystävällinen',
      'el': 'Φιλικό προς Κινητά',
      'he': 'ידידותי לנייד',
      'cs': 'Mobilní Přívětivý',
      'hu': 'Mobilbarát',
      'ro': 'Compatibil cu Mobilul',
      'uk': 'Сумісний з Мобільними',
      'bg': 'Съвместим с мобилни устройства',
      'hr': 'Prijateljski prema mobilnim uređajima',
      'sk': 'Mobilný Priateľský',
      'sl': 'Mobilno Prijazen'
    },
    'create_any_device': {
      'en': 'Create invoices on any device, anywhere',
      'es': 'Cree facturas en cualquier dispositivo, en cualquier lugar',
      'fr': 'Créez des factures sur n\'importe quel appareil, n\'importe où',
      'de': 'Erstellen Sie Rechnungen auf jedem Gerät, überall',
      'it': 'Crea fatture su qualsiasi dispositivo, ovunque',
      'pt': 'Crie faturas em qualquer dispositivo, em qualquer lugar',
      'ru': 'Создавайте счета на любом устройстве, где угодно',
      'ja': 'どこでも、どのデバイスでも請求書を作成',
      'zh': '在任何设备、任何地方创建发票',
      'ko': '어디서든 어떤 기기에서도 송장 생성',
      'ar': 'إنشاء فواتير على أي جهاز، في أي مكان',
      'hi': 'किसी भी डिवाइस पर, कहीं भी इनवॉइस बनाएं',
      'th': 'สร้างใบแจ้งหนี้บนอุปกรณ์ใดๆ ก็ได้ ที่ไหนก็ได้',
      'vi': 'Tạo hóa đơn trên bất kỳ thiết bị nào, ở bất cứ đâu',
      'id': 'Buat invoice di perangkat apa pun, di mana saja',
      'ms': 'Cipta invois pada mana-mana peranti, di mana-mana',
      'tl': 'Gumawa ng invoice sa anumang device, kahit saan',
      'tr': 'Herhangi bir cihazda, her yerde fatura oluşturun',
      'pl': 'Twórz faktury na dowolnym urządzeniu, gdziekolwiek',
      'nl': 'Maak facturen op elk apparaat, overal',
      'sv': 'Skapa fakturor på valfri enhet, var som helst',
      'no': 'Opprett fakturaer på enhver enhet, hvor som helst',
      'da': 'Opret fakturaer på enhver enhed, hvor som helst',
      'fi': 'Luo laskuja millä tahansa laitteella, missä tahansa',
      'el': 'Δημιουργήστε τιμολόγια σε οποιαδήποτε συσκευή, οπουδήποτε',
      'he': 'צור חשבוניות על כל מכשיר, בכל מקום',
      'cs': 'Vytvářejte faktury na jakémkoliv zařízení, kdekoli',
      'hu': 'Hozzon létre számlákat bármely eszközzel, bárhol',
      'ro': 'Creați facturi pe orice dispozitiv, oriunde',
      'uk': 'Створюйте рахунки на будь-якому пристрої, де завгодно',
      'bg': 'Създавайте фактури на всеки уред, навсякъде',
      'hr': 'Stvarajte račune na bilo kojem uređaju, bilo gdje',
      'sk': 'Vytvárajte faktúry na akomkoľvek zariadení, kdekoľvek',
      'sl': 'Ustvarjajte račune na kateri koli napravi, kjer koli'
    },
    'ready_to_get_started': {
      'en': 'Ready to Get Started?',
      'es': '¿Listo para Empezar?',
      'fr': 'Prêt à Commencer?',
      'de': 'Bereit loszulegen?',
      'it': 'Pronto per Iniziare?',
      'pt': 'Pronto para Começar?',
      'ru': 'Готовы Начать?',
      'ja': '始める準備はできましたか？',
      'zh': '准备开始了吗？',
      'ko': '시작할 준비 되셨나요？',
      'ar': 'هل أنت مستعد للبدء؟',
      'hi': 'शुरू करने के लिए तैयार हैं?',
      'th': 'พร้อมที่จะเริ่มต้นไหม?',
      'vi': 'Sẵn sàng Bắt đầu?',
      'id': 'Siap Memulai?',
      'ms': 'Sedia untuk Bermula?',
      'tl': 'Handa na Magsimula?',
      'tr': 'Başlamaya Hazır mısınız?',
      'pl': 'Gotowy na Start?',
      'nl': 'Klaar om te Beginnen?',
      'sv': 'Redo att Börja?',
      'no': 'Klar til Å Starte?',
      'da': 'Klar til at Starte?',
      'fi': 'Valmiina Aloittamaan?',
      'el': 'Έτοιμοι να Ξεκινήσετε;',
      'he': 'מוכנים להתחיל?',
      'cs': 'Připraveni Začít?',
      'hu': 'Készen áll az indulásra?',
      'ro': 'Pregătit să Începeți?',
      'uk': 'Готові Почати?',
      'bg': 'Готови ли сте да започнете?',
      'hr': 'Spremni za Početak?',
      'sk': 'Pripravení Začať?',
      'sl': 'Pripravljeni za Začetek?'
    },
    'join_thousands_businesses': {
      'en': 'Join thousands of businesses that trust our invoice generator for their billing needs.',
      'es': 'Únase a miles de empresas que confían en nuestro generador de facturas para sus necesidades de facturación.',
      'fr': 'Rejoignez des milliers d\'entreprises qui font confiance à notre générateur de factures pour leurs besoins de facturation.',
      'de': 'Schließen Sie sich Tausenden von Unternehmen an, die unseren Rechnungsgenerator für ihre Abrechnungsbedürfnisse vertrauen.',
      'it': 'Unisciti a migliaia di aziende che si affidano al nostro generatore di fatture per le loro esigenze di fatturazione.',
      'pt': 'Junte-se a milhares de empresas que confiam em nosso gerador de faturas para suas necessidades de cobrança.',
      'ru': 'Присоединяйтесь к тысячам компаний, которые доверяют нашему генератору счетов для своих потребностей в выставлении счетов.',
      'ja': '請求書作成のニーズを信頼して当社の請求書ジェネレーターを使用している何千もの企業に参加してください。',
      'zh': '加入数千家信任我们发票生成器来满足其计费需求的企业。',
      'ko': '청구 요건에 대해 우리 송장 생성기를 신뢰하는 수천 개의 기업에 동참하세요.',
      'ar': 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø¢Ù„Ø§Ù Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„ØªÙŠ ØªØ«Ù‚ ÙÙŠ Ù…ÙˆÙ„Ø¯ Ø§Ù„ÙÙˆØ§ØªÙŠØ± Ø§Ù„Ø®Ø§Øµ Ø¨Ù†Ø§ Ù„Ø§Ø­ØªÙŠØ§Ø¬Ø§Øª Ø§Ù„ÙÙˆØªØ±Ø© Ø§Ù„Ø®Ø§ØµØ© Ø¨Ù‡Ø§.',
      'hi': 'à¤…à¤ªà¤¨à¥€ à¤¬à¤¿à¤²à¤¿à¤‚à¤— à¤œà¤°à¥‚à¤°à¤¤à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤®à¤¾à¤°à¥‡ à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤œà¥‡à¤¨à¤°à¥‡à¤Ÿà¤° à¤ªà¤° à¤­à¤°à¥‹à¤¸à¤¾ à¤•à¤°à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤¹à¤œà¤¾à¤°à¥‹à¤‚ à¤µà¥à¤¯à¤µà¤¸à¤¾à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¶à¤¾à¤®à¤¿à¤² à¤¹à¥‹à¤‚à¥¤',
      'th': 'à¸£à¹ˆà¸§à¸¡à¸à¸±à¸šà¸˜à¸¸à¸£à¸à¸´à¸ˆà¸™à¸±à¸šà¸žà¸±à¸™à¸—à¸µà¹ˆà¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸±à¹ˆà¸™à¹ƒà¸™à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸‚à¸­à¸‡à¹€à¸£à¸²à¸ªà¸³à¸«à¸£à¸±à¸šà¸„à¸§à¸²à¸¡à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸—à¸²à¸‡à¸à¸²à¸£à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¹€à¸‡à¸´à¸™à¸‚à¸­à¸‡à¸žà¸§à¸à¹€à¸‚à¸²',
      'vi': 'Hãy tham gia hà ng nghà¬n doanh nghiá»‡p tin tÆ°á»Ÿng trà¬nh táº¡o hà³a Ä‘Æ¡n cá»§a chàºng tà´i cho nhu cáº§u thanh toán cá»§a há».',
      'id': 'Bergabunglah dengan ribuan bisnis yang mempercayai generator invoice kami untuk kebutuhan penagihan mereka.',
      'ms': ' sertai ribuan perniagaan yang mempercayai penjana invois kami untuk keperluan pengebilan mereka.',
      'tl': 'Sumali sa libo-libong negosyo na nagtiwala sa aming invoice generator para sa kanilang mga pangangailangan sa pag-billing.',
      'tr': 'Fatura ihtiyaçları için fatura oluşturucumuza güvenen binlerce işletmeye katılın.',
      'pl': 'DoÅ‚Ä…cz do tysiÄ™cy firm, ktà³re ufajÄ… naszemu generatorowi faktur w zakresie ich potrzeb rozliczeniowych.',
      'nl': 'Sluit u aan bij duizenden bedrijven die vertrouwen op onze factuur generator voor hun factureringsbehoeften.',
      'sv': 'Gà¥ med i tusentals fà¶retag som litar pà¥ và¥r fakturagenerator fà¶r sina faktureringsbehov.',
      'no': 'Bli med tusenvis av bedrifter som stoler pà¥ và¥r fakturagenerator for sine faktureringsbehov.',
      'da': 'Deltag i tusindvis af virksomheder, der stoler pà¥ vores fakturagenerator til deres faktureringsbehov.',
      'fi': 'Liity tuhansien yritysten joukkoon, jotka luottavat laskugeneraattoriimme laskutus tarpeisiinsa.',
      'el': 'Î•Î³Î³ÏÎ±Ï†ÎµÎ¯Ï„Îµ ÏƒÎµ Ï‡Î¹Î»Î¹Î¬Î´ÎµÏ‚ ÎµÏ€Î¹Ï‡ÎµÎ¹ÏÎ®ÏƒÎµÎ¹Ï‚ Ï€Î¿Ï… ÎµÎ¼Ï€Î¹ÏƒÏ„ÎµÏÎ¿Î½Ï„Î±Î¹ Ï„Î· Î³ÎµÎ½Î½Î®Ï„ÏÎ¹Î± Ï„Î¹Î¼Î¿Î»Î¿Î³Î¯Ï‰Î½ Î¼Î±Ï‚ Î³Î¹Î± Ï„Î¹Ï‚ Î±Î½Î¬Î³ÎºÎµÏ‚ Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î·ÏƒÎ®Ï‚ Ï„Î¿Ï…Ï‚.',
      'he': '×”×¦×˜×¨×£ ×œ××œ×¤×™ ×¢×¡×§×™× ×©×‘×•×˜×—×™× ×‘×ž×—×•×œ×œ ×”×—×©×‘×•× ×™×•×ª ×©×œ× ×• ×œ×¦×¨×›×™ ×”×—×™×•×‘ ×©×œ×”×.',
      'cs': 'PÅ™idejte se k tisà­cÅ¯m firem, které dÅ¯vÄ›Å™ujà­ naÅ¡emu generátoru faktur pro své fakturaÄnà­ potÅ™eby.',
      'hu': 'Csatlakozzon tà¶bb ezer vállalkozáshoz, amelyek számlázási igényeikhez a mi számla generátorunkat bà­zzák.',
      'ro': 'AlÄƒturaÈ›i-vÄƒ miilor de afaceri care au încredere à®n generatorul nostru de facturi pentru nevoile lor de facturare.',
      'uk': 'Ð”Ð¾Ð»ÑƒÑ‡Ð°Ð¹Ñ‚ÐµÑÑ Ð´Ð¾ Ñ‚Ð¸ÑÑÑ‡ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ñ–Ð¹, ÑÐºÑ– Ð´Ð¾Ð²Ñ–Ñ€ÑÑŽÑ‚ÑŒ Ð½Ð°ÑˆÐ¾Ð¼Ñƒ Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€Ñƒ Ñ€Ð°Ñ…ÑƒÐ½ÐºÑ–Ð² Ð´Ð»Ñ ÑÐ²Ð¾Ñ—Ñ… Ð¿Ð¾Ñ‚Ñ€ÐµÐ± Ð²Ð¸ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð½Ñ Ñ€Ð°Ñ…ÑƒÐ½ÐºÑ–Ð².',
      'bg': 'ÐŸÑ€Ð¸ÑÑŠÐµÐ´Ð¸Ð½ÐµÑ‚Ðµ ÑÐµ ÐºÑŠÐ¼ Ñ…Ð¸Ð»ÑÐ´Ð¸ Ð±Ð¸Ð·Ð½ÐµÑÐ¸, ÐºÐ¾Ð¸Ñ‚Ð¾ ÑÐµ Ð´Ð¾Ð²ÐµÑ€ÑÐ²Ð°Ñ‚ Ð½Ð° Ð½Ð°ÑˆÐ¸Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð½Ð° Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸ Ð·Ð° ÑÐ²Ð¾Ð¸Ñ‚Ðµ Ð½ÑƒÐ¶Ð´Ð¸ Ð·Ð° Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð°Ð½Ðµ.',
      'hr': 'PridruÅ¾ite se tisuÄ‡ama tvrtki koje vjeruju naÅ¡em generatoru raÄuna za njihove potrebe naplate.',
      'sk': 'Pridajte sa k tisà­ckam firiem, ktoré dà´verujàº náÅ¡mu generátoru faktàºr pre ich fakturaÄné potreby.',
      'sl': 'PridruÅ¾ite se tisoÄim podjetjem, ki zaupajo naÅ¡emu generatorju raÄunov za njihove potrebe poÅ¡iljanja raÄunov.'
    },
    'try_sample_invoice': {
      'en': 'Try Sample Invoice',
      'es': 'Probar Factura de Ejemplo',
      'fr': 'Essayer un Exemple de Facture',
      'de': 'Beispielrechnung Testen',
      'it': 'Prova Fattura di Esempio',
      'pt': 'Testar Fatura de Exemplo',
      'ru': 'ÐŸÐ¾Ð¿Ñ€Ð¾Ð±Ð¾Ð²Ð°Ñ‚ÑŒ ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð¡Ñ‡ÐµÑ‚Ð°',
      'ja': 'ã‚µãƒ³ãƒ—ãƒ«è«‹æ±‚æ›¸ã‚’è©¦ã™',
      'zh': 'å°è¯•ç¤ºä¾‹å‘ç¥¨',
      'ko': 'ìƒ˜í”Œ ì†¡ìž¥ ì‹œë„',
      'ar': 'Ø¬Ø±Ø¨ ÙØ§ØªÙˆØ±Ø© Ù†Ù…ÙˆØ°Ø¬ÙŠØ©',
      'hi': 'à¤¨à¤®à¥‚à¤¨à¤¾ à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤†à¤œà¤¼à¤®à¤¾à¤à¤‚',
      'th': 'à¸¥à¸­à¸‡à¹ƒà¸Šà¹‰à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡',
      'vi': 'Thá»­ Hà³a Ä‘Æ¡n Máº«u',
      'id': 'Coba Invoice Contoh',
      'ms': 'Cuba Invois Sampel',
      'tl': 'Subukan ang Sample Invoice',
      'tr': 'Örnek Fatura Deneyin',
      'pl': 'Wyprà³buj PrzykÅ‚adowÄ… FakturÄ™',
      'nl': 'Probeer Voorbeeldfactuur',
      'sv': 'Prova Exempelfaktura',
      'no': 'Prà¸v Eksempelfaktura',
      'da': 'Prà¸v Eksempelfaktura',
      'fi': 'Kokeile Esimerkkilaskua',
      'el': 'Î”Î¿ÎºÎ¹Î¼Î¬ÏƒÏ„Îµ Î Î±ÏÎ¬Î´ÎµÎ¹Î³Î¼Î± Î¤Î¹Î¼Î¿Î»Î¿Î³Î¯Î¿Ï…',
      'he': '× ×¡×” ×—×©×‘×•× ×™×ª ×œ×“×•×’×ž×”',
      'cs': 'VyzkouÅ¡ejte Vzorovou Fakturu',
      'hu': 'Prà³bálja Ki a Minta Számlát',
      'ro': 'Încercați o FacturÄƒ Exemplu',
      'uk': 'Ð¡Ð¿Ñ€Ð¾Ð±ÑƒÐ²Ð°Ñ‚Ð¸ ÐŸÑ€Ð¸ÐºÐ»Ð°Ð´ Ð Ð°Ñ…ÑƒÐ½ÐºÑƒ',
      'bg': 'ÐŸÑ€Ð¾Ð±Ð²Ð°Ð¹Ñ‚Ðµ ÐŸÑ€Ð¸Ð¼ÐµÑ€Ð½Ð° Ð¤Ð°ÐºÑ‚ÑƒÑ€Ð°',
      'hr': 'Isprobajte Primjer RaÄuna',
      'sk': 'VyskàºÅ¡ajte Vzorovàº Faktàºru',
      'sl': 'Preizkusite Primer RaÄuna'
    },
    'learn_more': {
      'en': 'Learn More',
      'es': 'Aprender Más',
      'fr': 'En Savoir Plus',
      'de': 'Mehr Erfahren',
      'it': 'Scopri di Più',
      'pt': 'Saiba Mais',
      'ru': 'Ð£Ð·Ð½Ð°Ñ‚ÑŒ Ð‘Ð¾Ð»ÑŒÑˆÐµ',
      'ja': 'è©³ç´°ã‚’è¦‹ã‚‹',
      'zh': 'äº†è§£æ›´å¤š',
      'ko': 'ë” ì•Œì•„ë³´ê¸°',
      'ar': 'Ø§Ø¹Ø±Ù Ø§Ù„Ù…Ø²ÙŠØ¯',
      'hi': 'à¤”à¤° à¤…à¤§à¤¿à¤• à¤œà¤¾à¤¨à¥‡à¤‚',
      'th': 'à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡',
      'vi': 'Tà¬m hiá»ƒu Thàªm',
      'id': 'Pelajari Lebih Lanjut',
      'ms': 'Ketahui Lebih Lanjut',
      'tl': 'Mag-Aral Pa',
      'tr': 'Daha Fazla Öğren',
      'pl': 'Dowiedz siÄ™ WiÄ™cej',
      'nl': 'Meer Leren',
      'sv': 'Là¤r Dig Mer',
      'no': 'Là¦r Mer',
      'da': 'Là¦r Mere',
      'fi': 'Lisà¤à¤ Tietoa',
      'el': 'ÎœÎ¬Î¸ÎµÏ„Îµ Î ÎµÏÎ¹ÏƒÏƒÏŒÏ„ÎµÏÎ±',
      'he': '×œ×ž×“ ×¢×•×“',
      'cs': 'Zjistit Và­ce',
      'hu': 'Tudj Meg Tıbbet',
      'ro': 'AflaÈ›i Mai Multe',
      'uk': 'Ð”Ñ–Ð·Ð½Ð°Ñ‚Ð¸ÑÑ Ð‘Ñ–Ð»ÑŒÑˆÐµ',
      'bg': 'ÐÐ°ÑƒÑ‡ÐµÑ‚Ðµ ÐŸÐ¾Ð²ÐµÑ‡Ðµ',
      'hr': 'Saznajte ViÅ¡e',
      'sk': 'DozvedieÅ¥ sa Viac',
      'sl': 'VeÄ o tem'
    },
    'everything_you_need': {
      'en': 'Everything You Need',
      'es': 'Todo lo que Necesitas',
      'fr': 'Tout ce dont Vous Avez Besoin',
      'de': 'Alles was Sie Brauchen',
      'it': 'Tutto ciò di cui Hai Bisogno',
      'pt': 'Tudo o que Vocé Precisa',
      'ru': 'Ð’ÑÐµ, Ñ‡Ñ‚Ð¾ Ð’Ð°Ð¼ ÐÑƒÐ¶Ð½Ð¾',
      'ja': 'å¿…è¦ãªã‚‚ã®ã™ã¹ã¦',
      'zh': 'æ‚¨éœ€è¦çš„ä¸€åˆ‡',
      'ko': 'í•„ìš”í•œ ëª¨ë“  ê²ƒ',
      'ar': 'ÙƒÙ„ Ù…Ø§ ØªØ­ØªØ§Ø¬Ù‡',
      'hi': 'à¤†à¤ªà¤•à¥‹ à¤œà¥‹ à¤šà¤¾à¤¹à¤¿à¤ à¤µà¤¹ à¤¸à¤¬',
      'th': 'à¸—à¸¸à¸à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸„à¸¸à¸“à¸•à¹‰à¸­à¸‡à¸à¸²à¸£',
      'vi': 'Má»i thá»© Báº¡n Cáº§n',
      'id': 'Semua yang Anda Butuhkan',
      'ms': 'Semua yang Anda Perlukan',
      'tl': 'Lahat ng Kailangan Mo',
      'tr': 'Ä°htiyacÄ±nÄ±z Olan Her Åžey',
      'pl': 'Wszystko, czego Potrzebujesz',
      'nl': 'Alles wat u Nodig Heeft',
      'sv': 'Allt du Behà¶ver',
      'no': 'Alt du Trenger',
      'da': 'Alt du Har Brug For',
      'fi': 'Kaikki Mità¤ Tarvitset',
      'el': 'ÎŒ,Ï„Î¹ Î§ÏÎµÎ¹Î¬Î¶ÎµÏƒÏ„Îµ',
      'he': '×›×œ ×ž×” ×©××ª×” ×¦×¨×™×š',
      'cs': 'VÅ¡e, co PotÅ™ebujete',
      'hu': 'Minden, amire Szà¼ksége van',
      'ro': 'Tot ce aveți Nevoie',
      'uk': 'Ð’ÑÐµ, Ñ‰Ð¾ Ð’Ð°Ð¼ ÐŸÐ¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾',
      'bg': 'Ð’ÑÐ¸Ñ‡ÐºÐ¾, Ð¾Ñ‚ ÐºÐ¾ÐµÑ‚Ð¾ ÑÐµ Ð½ÑƒÐ¶Ð´Ð°ÐµÑ‚Ðµ',
      'hr': 'Sve Å¡to Vam Treba',
      'sk': 'VÅ¡etko, Äo Potrebujete',
      'sl': 'Vse, kar Potrebujete'
    },
    'powerful_features': {
      'en': 'Powerful features to streamline your invoicing process',
      'es': 'Características poderosas para optimizar su proceso de facturacià³n',
      'fr': 'Fonctionnalités puissantes pour optimiser votre processus de facturation',
      'de': 'Leistungsstarke Funktionen zur Optimierung Ihres Rechnungsprozesses',
      'it': 'Funzionalità  potenti per ottimizzare il tuo processo di fatturazione',
      'pt': 'Recursos poderosos para otimizar seu processo de faturamento',
      'ru': 'ÐœÐ¾Ñ‰Ð½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð´Ð»Ñ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÑÑÐ° Ð²Ñ‹ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ‡ÐµÑ‚Ð¾Ð²',
      'ja': 'è«‹æ±‚æ›¸ãƒ—ãƒ­ã‚»ã‚¹ã‚’åˆç†åŒ–ã™ã‚‹å¼·åŠ›ãªæ©Ÿèƒ½',
      'zh': 'ç®€åŒ–æ‚¨å‘ç¥¨å¤„ç†æµç¨‹çš„å¼ºå¤§åŠŸèƒ½',
      'ko': 'ì†¡ìž¥ ì²˜ë¦¬ë¥¼ ê°„ì†Œí™”í•˜ëŠ” ê°•ë ¥í•œ ê¸°ëŠ¥',
      'ar': 'Ù…ÙŠØ²Ø§Øª Ù‚ÙˆÙŠØ© Ù„ØªØ¨Ø³ÙŠØ· Ø¹Ù…Ù„ÙŠØ© Ø§Ù„ÙÙˆØªØ±Ø©',
      'hi': 'à¤†à¤ªà¤•à¥€ à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‹ à¤¸à¤°à¤² à¤¬à¤¨à¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¶à¤•à¥à¤¤à¤¿à¤¶à¤¾à¤²à¥€ à¤¸à¥à¤µà¤¿à¤§à¤¾à¤à¤‚',
      'th': 'à¸„à¸¸à¸“à¸ªà¸¡à¸šà¸±à¸•à¸´à¸—à¸µà¹ˆà¸—à¸£à¸‡à¸žà¸¥à¸±à¸‡à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰à¸à¸²à¸£à¸—à¸³à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸‚à¸­à¸‡à¸„à¸¸à¸“à¸£à¸²à¸šà¸£à¸·à¹ˆà¸™à¸‚à¸¶à¹‰à¸™',
      'vi': 'Tà­nh nÄƒng máº¡nh máº½ Ä‘á»ƒ Ä‘Æ¡n giáº£n hà³a quy trà¬nh xuáº¥t hà³a Ä‘Æ¡n cá»§a báº¡n',
      'id': 'Fitur canggih untuk menyederhanakan proses invoice Anda',
      'ms': 'Ciri-ciri berkuasa untuk menstrimkan proses invois anda',
      'tl': 'Makapangyarihang mga feature para i-streamline ang iyong invoice process',
      'tr': 'Fatura sà¼recinizi kolaylaÅŸtÄ±rmak için güçlü özellişler',
      'pl': 'PotÄ™Å¼ne funkcje usprawniajÄ…ce proces fakturowania',
      'nl': 'Krachtige functies om uw factureringsproces te stroomlijnen',
      'sv': 'Kraftfulla funktioner fà¶r att effektivisera din faktureringsprocess',
      'no': 'Kraftfulle funksjoner for à¥ effektivisere faktureringsprosessen din',
      'da': 'Kraftfulde funktioner til at effektivisere din faktureringsproces',
      'fi': 'Tehokkaita ominaisuuksia laskutusprosessisi virtaviivaistamiseksi',
      'el': 'Î™ÏƒÏ‡Ï…ÏÎ¬ Ï‡Î±ÏÎ±ÎºÏ„Î·ÏÎ¹ÏƒÏ„Î¹ÎºÎ¬ Î³Î¹Î± Ï„Î·Î½ Î±Ï€Î»Î¿Ï€Î¿Î¯Î·ÏƒÎ· Ï„Î·Ï‚ Î´Î¹Î±Î´Î¹ÎºÎ±ÏƒÎ¯Î±Ï‚ Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î·ÏƒÎ·Ï‚',
      'he': '×ª×›×•× ×•×ª ×—×–×§×•×ª ×œ×™×™×¢×•×œ ×ª×”×œ×™×š ×”×—×™×•×‘ ×©×œ×š',
      'cs': 'Và½konné funkce pro zefektivnÄ›nà­ vaÅ¡eho fakturaÄnà­ho procesu',
      'hu': 'ErÅ‘teljes funkcià³k a számlázási folyamat egyszerÅ±sà­tésére',
      'ro': 'FuncÈ›ionalitÄƒÈ›i puternice pentru a eficientiza procesul de facturare',
      'uk': 'ÐŸÐ¾Ñ‚ÑƒÐ¶Ð½Ñ– Ñ„ÑƒÐ½ÐºÑ†Ñ–Ñ— Ð´Ð»Ñ Ð¾Ð¿Ñ‚Ð¸Ð¼Ñ–Ð·Ð°Ñ†Ñ–Ñ— Ð²Ð°ÑˆÐ¾Ð³Ð¾ Ð¿Ñ€Ð¾Ñ†ÐµÑÑƒ Ð²Ð¸ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð½Ñ Ñ€Ð°Ñ…ÑƒÐ½ÐºÑ–Ð²',
      'bg': 'ÐœÐ¾Ñ‰Ð½Ð¸ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð·Ð° Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð°Ð½Ðµ Ð½Ð° Ð¿Ñ€Ð¾Ñ†ÐµÑÐ° Ð¿Ð¾ Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð°Ð½Ðµ',
      'hr': 'MoÄ‡ne znaÄajke za pojednostavljanje vaÅ¡eg procesa naplate',
      'sk': 'Và½konné funkcie na zefektà­vnenie váÅ¡ho fakturaÄného procesu',
      'sl': 'Mojne funkcije za poenostavitev vaÅ¡ega postopka raÄunovodstva'
    },
    'professional_design': {
      'en': 'Professional Design',
      'es': 'Diseà±o Profesional',
      'fr': 'Design Professionnel',
      'de': 'Professionelles Design',
      'it': 'Design Professionale',
      'pt': 'Design Profissional',
      'ru': 'ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð”Ð¸Ð·Ð°Ð¹Ð½',
      'ja': 'ãƒ—ãƒ­ãƒ•ã‚§ãƒƒã‚·ãƒ§ãƒŠãƒ«ãƒ‡ã‚¶ã‚¤ãƒ³',
      'zh': 'ä¸“ä¸šè®¾è®¡',
      'ko': 'ì „ë¬¸ ë””ìžì¸',
      'ar': 'ØªØµÙ…ÙŠÙ… Ø§Ø­ØªØ±Ø§ÙÙŠ',
      'hi': 'à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤¡à¤¿à¤œà¤¼à¤¾à¤‡à¤¨',
      'th': 'à¸”à¸µà¹„à¸‹à¸™à¹Œà¸£à¸°à¸”à¸±à¸šà¸¡à¸·à¸­à¸­à¸²à¸Šà¸µà¸ž',
      'vi': 'Thiáº¿t káº¿ Chuyàªn nghiá»‡p',
      'id': 'Desain Profesional',
      'ms': 'Reka Bentuk Profesional',
      'tl': 'Propesyonal na Design',
      'tr': 'Profesyonel TasarÄ±m',
      'pl': 'Profesjonalny WyglÄ…d',
      'nl': 'Professioneel Ontwerp',
      'sv': 'Professionell Design',
      'no': 'Profesjonelt Design',
      'da': 'Professionelt Design',
      'fi': 'Ammattimainen Suunnittelu',
      'el': 'Î•Ï€Î±Î³Î³ÎµÎ»Î¼Î±Ï„Î¹ÎºÏŒÏ‚ Î£Ï‡ÎµÎ´Î¹Î±ÏƒÎ¼ÏŒÏ‚',
      'he': '×¢×™×¦×•×‘ ×ž×§×¦×•×¢×™',
      'cs': 'Profesionálnà­ Vzhled',
      'hu': 'Professzionális Dizájn',
      'ro': 'Design Profesional',
      'uk': 'ÐŸÑ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ð¸Ð¹ Ð”Ð¸Ð·Ð°Ð¹Ð½',
      'bg': 'ÐŸÑ€Ð¾Ñ„ÐµÑÐ¸Ð¾Ð½Ð°Ð»ÐµÐ½ Ð´Ð¸Ð·Ð°Ð¹Ð½',
      'hr': 'Profesionalni Dizajn',
      'sk': 'Profesionálny Dizajn',
      'sl': 'Profesionalen Oblikovalec'
    },
    'clean_modern_templates': {
      'en': 'Clean, modern invoice templates that make your business look professional',
      'es': 'Plantillas de factura limpias y modernas que hacen que su negocio se vea profesional',
      'fr': 'Modà¨les de factures propres et modernes qui donnent à  votre entreprise une apparence professionnelle',
      'de': 'Saubere, moderne Rechnungsvorlagen, die Ihr Unternehmen professionell aussehen lassen',
      'it': 'Modelli di fattura puliti e moderni che fanno sembrare la tua attività  professionale',
      'pt': 'Modelos de fatura limpos e modernos que fazem seu negà³cio parecer profissional',
      'ru': 'Ð§Ð¸ÑÑ‚Ñ‹Ðµ, ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ñ‹Ðµ ÑˆÐ°Ð±Ð»Ð¾Ð½Ñ‹ ÑÑ‡ÐµÑ‚Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð´ÐµÐ»Ð°ÑŽÑ‚ Ð²Ð°Ñˆ Ð±Ð¸Ð·Ð½ÐµÑ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¼',
      'ja': 'ã‚ãªãŸã®ãƒ“ã‚¸ãƒã‚¹ã‚’ãƒ—ãƒ­ãƒ•ã‚§ãƒƒã‚·ãƒ§ãƒŠãƒ«ã«è¦‹ã›ã‚‹ã‚¯ãƒªãƒ¼ãƒ³ã§ãƒ¢ãƒ€ãƒ³ãªè«‹æ±‚æ›¸ãƒ†ãƒ³ãƒ—ãƒ¬ãƒ¼ãƒˆ',
      'zh': 'è®©æ‚¨çš„ä¸šåŠ¡çœ‹èµ·æ¥ä¸“ä¸šçš„ç®€æ´çŽ°ä»£å‘ç¥¨æ¨¡æ¿',
      'ko': 'ê·€í•˜ì˜ ë¹„ì¦ˆë‹ˆìŠ¤ë¥¼ ì „ë¬¸ì ìœ¼ë¡œ ë³´ì´ê²Œ í•˜ëŠ” ê¹”ë”í•˜ê³  í˜„ëŒ€ì ì¸ ì†¡ìž¥ í…œí”Œë¦¿',
      'ar': 'Ù‚ÙˆØ§Ù„Ø¨ ÙÙˆØ§ØªÙŠØ± Ù†Ø¸ÙŠÙØ© ÙˆØ­Ø¯ÙŠØ«Ø© ØªØ¬Ø¹Ù„ Ø¹Ù…Ù„Ùƒ ÙŠØ¨Ø¯Ùˆ Ø§Ø­ØªØ±Ø§ÙÙŠØ§',
      'hi': 'à¤†à¤ªà¤•à¥‡ à¤µà¥à¤¯à¤µà¤¸à¤¾à¤¯ à¤•à¥‹ à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤¬à¤¨à¤¾à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤¸à¤¾à¤«, à¤†à¤§à¥à¤¨à¤¿à¤• à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤Ÿà¥‡à¤®à¥à¤ªà¥à¤²à¥‡à¤Ÿ',
      'th': 'à¹€à¸—à¸¡à¹€à¸žà¸¥à¸•à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸—à¸µà¹ˆà¸ªà¸°à¸­à¸²à¸”à¹à¸¥à¸°à¸—à¸±à¸™à¸ªà¸¡à¸±à¸¢à¸—à¸µà¹ˆà¸—à¸³à¹ƒà¸«à¹‰à¸˜à¸¸à¸£à¸à¸´à¸ˆà¸‚à¸­à¸‡à¸„à¸¸à¸“à¸”à¸¹à¹€à¸›à¹‡à¸™à¸¡à¸·à¸­à¸­à¸²à¸Šà¸µà¸ž',
      'vi': 'Máº«u hà³a Ä‘Æ¡n sáº¡ch sáº½, hiá»‡n Ä‘áº¡i là m cho doanh nghiá»‡p cá»§a báº¡n trà´ng chuyàªn nghiá»‡p',
      'id': 'Template invoice yang bersih dan modern yang membuat bisnis Anda terlihat profesional',
      'ms': 'Templat invois yang bersih dan moden yang menjadikan perniagaan anda kelihatan profesional',
      'tl': 'Malinis, modern na invoice template na gumagawa sa iyong negosyo na mukhang propesyonal',
      'tr': 'Ä°ÅŸinizi profesyonel gà¶steren temiz, modern fatura ÅŸablonlarÄ±',
      'pl': 'Czyste, nowoczesne szablony faktur, ktà³re sprawiajÄ…, Å¼e Twoja firma wyglÄ…da profesjonalnie',
      'nl': 'Schone, moderne factuursjablonen die uw bedrijf professioneel laten lijken',
      'sv': 'Ren, moderna fakturamallar som fà¥r ditt fà¶retag att se professionellt ut',
      'no': 'Rene, moderne fakturamaler som fà¥r bedriften din til à¥ se profesjonell ut',
      'da': 'Rene, moderne fakturaskabeloner der fà¥r din virksomhed til at se professionel ud',
      'fi': 'Siistit, modernit laskumallit, jotka saavat yrityksesi nà¤yttà¤mà¤à¤n ammattimaiselta',
      'el': 'ÎšÎ±Î¸Î±ÏÎ¬, Î¼Î¿Î½Ï„Î­ÏÎ½Î± Ï€ÏÏŒÏ„Ï…Ï€Î± Ï„Î¹Î¼Î¿Î»Î¿Î³Î¯Ï‰Î½ Ï€Î¿Ï… ÎºÎ¬Î½Î¿Ï…Î½ Ï„Î·Î½ ÎµÏ€Î¹Ï‡ÎµÎ¯ÏÎ·ÏƒÎ® ÏƒÎ±Ï‚ Î½Î± Ï†Î±Î¯Î½ÎµÏ„Î±Î¹ ÎµÏ€Î±Î³Î³ÎµÎ»Î¼Î±Ï„Î¹ÎºÎ®',
      'he': '×ª×‘× ×™×•×ª ×—×©×‘×•× ×™×•×ª × ×§×™×•×ª ×•×ž×•×“×¨× ×™×•×ª ×©×’×•×¨×ž×•×ª ×œ×¢×¡×§ ×©×œ×š ×œ×”×™×¨××•×ª ×ž×§×¦×•×¢×™',
      'cs': 'ÄŒisté, modernà­ Å¡ablony faktur, které dà­ky nim bude vaÅ¡e firma vypadat profesionálnÄ›',
      'hu': 'Tiszta, modern számlasablonok, amelyek professzionálissá teszik vállalkozását',
      'ro': 'È˜abloane de facturi curate È™i moderne care fac afacerea dvs. sÄƒ arate profesional',
      'uk': 'Ð§Ð¸ÑÑ‚Ñ–, ÑÑƒÑ‡Ð°ÑÐ½Ñ– ÑˆÐ°Ð±Ð»Ð¾Ð½Ð¸ Ñ€Ð°Ñ…ÑƒÐ½ÐºÑ–Ð², ÑÐºÑ– Ñ€Ð¾Ð±Ð»ÑÑ‚ÑŒ Ð²Ð°Ñˆ Ð±Ñ–Ð·Ð½ÐµÑ Ð¿Ñ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ð¸Ð¼',
      'bg': 'Ð§Ð¸ÑÑ‚Ð¸, Ð¼Ð¾Ð´ÐµÑ€Ð½Ð¸ ÑˆÐ°Ð±Ð»Ð¾Ð½Ð¸ Ð·Ð° Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸, ÐºÐ¾Ð¸Ñ‚Ð¾ Ð¿Ñ€Ð°Ð²ÑÑ‚ Ð±Ð¸Ð·Ð½ÐµÑÐ° Ð²Ð¸ Ð´Ð° Ð¸Ð·Ð³Ð»ÐµÐ¶Ð´Ð° Ð¿Ñ€Ð¾Ñ„ÐµÑÐ¸Ð¾Ð½Ð°Ð»Ð½Ð¾',
      'hr': 'ÄŒisti, moderni predloÅ¡ci raÄuna koji Äine vaÅ¡ posao profesionalnim',
      'sk': 'ÄŒisté, moderné Å¡ablà³ny faktàºr, ktoré váÅ¡ podnikanie robia profesionálnym',
      'sl': 'ÄŒisti, moderni predloge raÄunov, ki naredijo vaÅ¡emu podjetju profesionalen videz'
    },
    'instant_pdf_download': {
      'en': 'Instant PDF Download',
      'es': 'Descarga PDF Instantánea',
      'fr': 'Téléchargement PDF Instantané',
      'de': 'Sofortiger PDF-Download',
      'it': 'Download PDF Istantaneo',
      'pt': 'Download PDF Instantà¢neo',
      'ru': 'ÐœÐ³Ð½Ð¾Ð²ÐµÐ½Ð½Ð°Ñ Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° PDF',
      'ja': 'å³åº§PDFãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰',
      'zh': 'å³æ—¶PDFä¸‹è½½',
      'ko': 'ì¦‰ì‹œ PDF ë‹¤ìš´ë¡œë“œ',
      'ar': 'ØªØ­Ù…ÙŠÙ„ PDF ÙÙˆØ±ÙŠ',
      'hi': 'à¤¤à¤¤à¥à¤•à¤¾à¤² PDF à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡',
      'th': 'à¸”à¸²à¸§à¸™à¹Œà¹‚à¸«à¸¥à¸” PDF à¸—à¸±à¸™à¸—à¸µ',
      'vi': 'Táº£i PDF Ngay láº­p tá»©c',
      'id': 'Unduh PDF Langsung',
      'ms': 'Muat Turun PDF Serta-merta',
      'tl': 'Instant PDF Download',
      'tr': 'AnÄ±nda PDF Ä°ndirme',
      'pl': 'Natychmiastowe Pobieranie PDF',
      'nl': 'Directe PDF Download',
      'sv': 'Omedelbar PDF-nedladdning',
      'no': 'Umiddelbar PDF-nedlasting',
      'da': 'à˜jeblikkelig PDF-download',
      'fi': 'Và¤lità¶n PDF-lataus',
      'el': 'Î†Î¼ÎµÏƒÎ· Î›Î®ÏˆÎ· PDF',
      'he': '×”×•×¨×“×ª PDF ×ž×™×™×“×™×ª',
      'cs': 'OkamÅ¾ité StaÅ¾enà­ PDF',
      'hu': 'Azonnali PDF Letà¶ltés',
      'ro': 'DescÄƒrcare Instantanee PDF',
      'uk': 'ÐœÐ¸Ñ‚Ñ‚Ñ”Ð²Ðµ Ð—Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÐµÐ½Ð½Ñ PDF',
      'bg': 'ÐœÐ¾Ð¼ÐµÐ½Ñ‚Ð°Ð»Ð½Ð¾ Ð¸Ð·Ñ‚ÐµÐ³Ð»ÑÐ½Ðµ Ð½Ð° PDF',
      'hr': 'Trenutno Preuzimanje PDF',
      'sk': 'OkamÅ¾ité Stiahnutie PDF',
      'sl': 'TakojÅ¡nje Prenos PDF'
    },
    'download_high_quality_pdfs': {
      'en': 'Download your invoices as high-quality PDFs ready to share',
      'es': 'Descargue sus facturas como PDFs de alta calidad listos para compartir',
      'fr': 'Téléchargez vos factures en PDF de haute qualité pràªts à  partager',
      'de': 'Laden Sie Ihre Rechnungen als hochwertige PDFs herunter, bereit zum Teilen',
      'it': 'Scarica le tue fatture come PDF di alta qualità  pronti da condividere',
      'pt': 'Baixe suas faturas como PDFs de alta qualidade prontos para compartilhar',
      'ru': 'Ð—Ð°Ð³Ñ€ÑƒÐ¶Ð°Ð¹Ñ‚Ðµ Ð²Ð°ÑˆÐ¸ ÑÑ‡ÐµÑ‚Ð° Ð² Ð²Ð¸Ð´Ðµ PDF-Ñ„Ð°Ð¹Ð»Ð¾Ð² Ð²Ñ‹ÑÐ¾ÐºÐ¾Ð³Ð¾ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°, Ð³Ð¾Ñ‚Ð¾Ð²Ñ‹Ñ… Ðº Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐµ',
      'ja': 'å…±æœ‰æº–å‚™å®Œäº†ã®é«˜å“è³ªPDFã¨ã—ã¦è«‹æ±‚æ›¸ã‚’ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰',
      'zh': 'å°†æ‚¨çš„å‘ç¥¨ä¸‹è½½ä¸ºå¯ç›´æŽ¥åˆ†äº«çš„é«˜è´¨é‡PDF',
      'ko': 'ê³µìœ í•  ì¤€ë¹„ê°€ ëœ ê³ í’ˆì§ˆ PDFë¡œ ì†¡ìž¥ ë‹¤ìš´ë¡œë“œ',
      'ar': 'Ù‚Ù… Ø¨ØªÙ†Ø²ÙŠÙ„ ÙÙˆØ§ØªÙŠØ±Ùƒ ÙƒÙ…Ù„ÙØ§Øª PDF Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¬Ø§Ù‡Ø²Ø© Ù„Ù„Ù…Ø´Ø§Ø±ÙƒØ©',
      'hi': 'à¤…à¤ªà¤¨à¥‡ à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤•à¥‹ à¤¸à¤¾à¤à¤¾ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤‰à¤šà¥à¤š à¤—à¥à¤£à¤µà¤¤à¥à¤¤à¤¾ à¤µà¤¾à¤²à¥‡ PDF à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤°à¥‡à¤‚',
      'th': 'à¸”à¸²à¸§à¸™à¹Œà¹‚à¸«à¸¥à¸”à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸‚à¸­à¸‡à¸„à¸¸à¸“à¹€à¸›à¹‡à¸™ PDF à¸„à¸¸à¸“à¸ à¸²à¸žà¸ªà¸¹à¸‡à¸—à¸µà¹ˆà¸žà¸£à¹‰à¸­à¸¡à¹à¸Šà¸£à¹Œ',
      'vi': 'Táº£i xuá»‘ng hà³a Ä‘Æ¡n cá»§a báº¡n dÆ°á»›i dáº¡ng PDF cháº¥t lÆ°á»£ng cao sáºµn sà ng Ä‘á»ƒ chia sáº»',
      'id': 'Unduh invoice Anda sebagai PDF berkualitas tinggi siap untuk dibagikan',
      'ms': 'Muat turun invois anda sebagai PDF berkualiti tinggi sedia untuk dikongsi',
      'tl': 'I-download ang iyong mga invoice bilang high-quality PDF na handa na ibahagi',
      'tr': 'FaturalarÄ±nÄ±zÄ± paylaÅŸmaya hazÄ±r yà¼ksek kaliteli PDF\'ler olarak indirin',
      'pl': 'Pobierz swoje faktury jako wysokiej jakoÅ›ci PDF-y gotowe do udostÄ™pnienia',
      'nl': 'Download uw facturen als hoogwaardige PDF\'s klaar om te delen',
      'sv': 'Ladda ner dina fakturor som hà¶gkvalitets PDF:er redo att delas',
      'no': 'Last ned fakturaene dine som hà¸ykvalitets PDF-er klare til à¥ deles',
      'da': 'Download dine fakturaer som hà¸j kvalitets PDF\'er klar til deling',
      'fi': 'Lataa laskusi korkealaatuisina PDF:inà¤, valmiina jakoon',
      'el': 'ÎšÎ±Ï„ÎµÎ²Î¬ÏƒÏ„Îµ Ï„Î± Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î¹Î¬ ÏƒÎ±Ï‚ Ï‰Ï‚ PDF Ï…ÏˆÎ·Î»Î®Ï‚ Ï€Î¿Î¹ÏŒÏ„Î·Ï„Î±Ï‚ Î­Ï„Î¿Î¹Î¼Î± Î³Î¹Î± ÎºÎ¿Î¹Î½Î¿Ï€Î¿Î¯Î·ÏƒÎ·',
      'he': '×”×•×¨×“ ××ª ×”×—×©×‘×•× ×™×•×ª ×©×œ×š ×›×§×‘×¦×™ PDF ×‘××™×›×•×ª ×’×‘×•×”×” ×ž×•×›× ×™× ×œ×©×™×ª×•×£',
      'cs': 'StáhnÄ›te si své faktury jako vysoce kvalitnà­ PDF pÅ™ipravené ke sdà­lenà­',
      'hu': 'Tà¶ltse le számláit kiválà³ minÅ‘ségÅ± PDF-ként, készen a megosztásra',
      'ro': 'DescÄƒrcaÈ›i facturile dvs. ca PDF-uri de à®naltÄƒ calitate gata de partajat',
      'uk': 'Ð—Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÑƒÐ¹Ñ‚Ðµ Ð²Ð°ÑˆÑ– Ñ€Ð°Ñ…ÑƒÐ½ÐºÐ¸ ÑÐº PDF-Ñ„Ð°Ð¹Ð»Ð¸ Ð²Ð¸ÑÐ¾ÐºÐ¾Ñ— ÑÐºÐ¾ÑÑ‚Ñ–, Ð³Ð¾Ñ‚Ð¾Ð²Ñ– Ð´Ð¾ Ð¿Ð¾ÑˆÐ¸Ñ€ÐµÐ½Ð½Ñ',
      'bg': 'Ð˜Ð·Ñ‚ÐµÐ³Ð»ÐµÑ‚Ðµ Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸Ñ‚Ðµ ÑÐ¸ ÐºÐ°Ñ‚Ð¾ PDF Ñ„Ð°Ð¹Ð»Ð¾Ð²Ðµ Ñ Ð²Ð¸ÑÐ¾ÐºÐ¾ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾, Ð³Ð¾Ñ‚Ð¾Ð²Ð¸ Ð·Ð° ÑÐ¿Ð¾Ð´ÐµÐ»ÑÐ½Ðµ',
      'hr': 'Preuzmite svoje raÄune kao PDF-ove visoke kvalitete spremne za dijeljenje',
      'sk': 'Stiahnite si svoje faktàºry ako PDF vysokej kvality pripravené na zdieÄ¾anie',
      'sl': 'Prenesite svoje raÄune kot PDF visoke kakovosti pripravljene za deljenje'
    },
    'customizable': {
      'en': 'Customizable',
      'es': 'Personalizable',
      'fr': 'Personnalisable',
      'de': 'Anpassbar',
      'it': 'Personalizzabile',
      'pt': 'Personalizável',
      'ru': 'ÐÐ°ÑÑ‚Ñ€Ð°Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ð¹',
      'ja': 'ã‚«ã‚¹ã‚¿ãƒžã‚¤ã‚ºå¯èƒ½',
      'zh': 'å¯å®šåˆ¶',
      'ko': 'ì‚¬ìš©ìž ì •ì˜ ê°€ëŠ¥',
      'ar': 'Ù‚Ø§Ø¨Ù„ Ù„Ù„ØªØ®ØµÙŠØµ',
      'hi': 'à¤…à¤¨à¥à¤•à¥‚à¤²à¤¨ à¤¯à¥‹à¤—à¥à¤¯',
      'th': 'à¸›à¸£à¸±à¸šà¹à¸•à¹ˆà¸‡à¹„à¸”à¹‰',
      'vi': 'Tà¹y chá»‰nh',
      'id': 'Dapat Disesuaikan',
      'ms': 'Boleh Disesuaikan',
      'tl': 'Pwedeng I-customize',
      'tr': 'à–zelleÅŸtirilebilir',
      'pl': 'Konfigurowalny',
      'nl': 'Aanpasbaar',
      'sv': 'Anpassningsbar',
      'no': 'Tilpassbar',
      'da': 'Tilpasselig',
      'fi': 'Mukautettavissa',
      'el': 'Î ÏÎ¿ÏƒÎ±ÏÎ¼ÏŒÏƒÎ¹Î¼Î¿',
      'he': '× ×™×ª×Ÿ ×œ×”×ª××ž×”',
      'cs': 'PÅ™izpÅ¯sobitelnà½',
      'hu': 'Testreszabhatà³',
      'ro': 'Personalizabil',
      'uk': 'ÐÐ°Ð»Ð°ÑˆÑ‚Ð¾Ð²ÑƒÐ²Ð°Ð½Ð¸Ð¹',
      'bg': 'ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÐ¼',
      'hr': 'Prilagodljiv',
      'sk': 'Prispà´sobiteÄ¾nà½',
      'sl': 'Prilagodljiv'
    },
    'add_branding_logo': {
      'en': 'Add your branding, logo, and personal touch to every invoice',
      'es': 'Agregue su marca, logo y toque personal a cada factura',
      'fr': 'Ajoutez votre image de marque, votre logo et votre touche personnelle à  chaque facture',
      'de': 'Fà¼gen Sie jedem Rechnung Ihre Marke, Ihr Logo und Ihre persà¶nliche Note hinzu',
      'it': 'Aggiungi il tuo brand, logo e tocco personale a ogni fattura',
      'pt': 'Adicione sua marca, logo e toque pessoal a cada fatura',
      'ru': 'Ð”Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ ÑÐ²Ð¾Ð¹ Ð±Ñ€ÐµÐ½Ð´, Ð»Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿ Ð¸ Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ ÑˆÑ‚Ñ€Ð¸Ñ…Ð¸ Ðº ÐºÐ°Ð¶Ð´Ð¾Ð¼Ñƒ ÑÑ‡ÐµÑ‚Ñƒ',
      'ja': 'å„è«‹æ±‚æ›¸ã«ãƒ–ãƒ©ãƒ³ãƒ‰ã€ãƒ­ã‚´ã€å€‹äººçš„ãªã‚¿ãƒƒãƒã‚’è¿½åŠ ',
      'zh': 'ä¸ºæ¯å¼ å‘ç¥¨æ·»åŠ æ‚¨çš„å“ç‰Œã€æ ‡å¿—å’Œä¸ªäººé£Žæ ¼',
      'ko': 'ëª¨ë“  ì†¡ìž¥ì— ë¸Œëžœë“œ, ë¡œê³ , ê°œì¸ì ì¸ í„°ì¹˜ ì¶”ê°€',
      'ar': 'Ø£Ø¶Ù Ø¹Ù„Ø§Ù…ØªÙƒ Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© ÙˆØ´Ø¹Ø§Ø±Ùƒ ÙˆÙ„Ù…Ø³ØªÙƒ Ø§Ù„Ø´Ø®ØµÙŠØ© Ø¥Ù„Ù‰ ÙƒÙ„ ÙØ§ØªÙˆØ±Ø©',
      'hi': 'à¤ªà¥à¤°à¤¤à¥à¤¯à¥‡à¤• à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¤¾ à¤¬à¥à¤°à¤¾à¤‚à¤¡, à¤²à¥‹à¤—à¥‹ à¤”à¤° à¤µà¥à¤¯à¤•à¥à¤¤à¤¿à¤—à¤¤ à¤¸à¥à¤ªà¤°à¥à¤¶ à¤œà¥‹à¤¡à¤¼à¥‡à¤‚',
      'th': 'à¹€à¸žà¸´à¹ˆà¸¡à¹à¸šà¸£à¸™à¸”à¹Œ à¹‚à¸¥à¹‚à¸à¹‰ à¹à¸¥à¸°à¸ªà¸±à¸¡à¸œà¸±à¸ªà¸ªà¹ˆà¸§à¸™à¸•à¸±à¸§à¸‚à¸­à¸‡à¸„à¸¸à¸“à¹ƒà¸™à¸—à¸¸à¸à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰',
      'vi': 'Thàªm thÆ°Æ¡ng hiá»‡u, logo và  dáº¥u áº¥n cá nhà¢n cá»§a báº¡n và o má»—i hà³a Ä‘Æ¡n',
      'id': 'Tambahkan merek, logo, dan sentuhan pribadi Anda ke setiap invoice',
      'ms': 'Tambahkan jenama, logo dan sentuhan peribadi anda ke setiap invois',
      'tl': 'Idagdag ang iyong branding, logo, at personal touch sa bawat invoice',
      'tr': 'Her faturaya markanÄ±zÄ±, logonuzu ve kiÅŸisel dokunuÅŸunuzu ekleyin',
      'pl': 'Dodaj swojÄ… markÄ™, logo i osobisty akcent do kaÅ¼dej faktury',
      'nl': 'Voeg uw merk, logo en persoonlijke touch toe aan elke factuur',
      'sv': 'Là¤gg till ditt varumà¤rke, logotyp och personliga touch till varje faktura',
      'no': 'Legg til merkevaren din, logoen din og personlige touch til hver faktura',
      'da': 'Tilfà¸j dit brand, logo og personlige touch til hver faktura',
      'fi': 'Lisà¤à¤ brà¤ndisi, logosi ja henkilà¶kohtainen tyyli jokaiseen laskuun',
      'el': 'Î ÏÎ¿ÏƒÎ¸Î­ÏƒÏ„Îµ Ï„Î¿ brand ÏƒÎ±Ï‚, Ï„Î¿ Î»Î¿Î³ÏŒÏ„Ï…Ï€ÏŒ ÏƒÎ±Ï‚ ÎºÎ±Î¹ Ï„Î·Î½ Ï€ÏÎ¿ÏƒÏ‰Ï€Î¹ÎºÎ® ÏƒÎ±Ï‚ Ï€Î¹Î½ÎµÎ»Î¹Î¬ ÏƒÎµ ÎºÎ¬Î¸Îµ Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î¹Î¿',
      'he': '×”×•×¡×£ ××ª ×”×ž×•×ª×’, ×”×œ×•×’×• ×•×”×ž×’×¢ ×”××™×©×™ ×©×œ×š ×œ×›×œ ×—×©×‘×•× ×™×ª',
      'cs': 'PÅ™idejte svou znaÄku, logo a osobnà­ dotek ke kaÅ¾dé faktuÅ™e',
      'hu': 'Adja hozzá márkáját, logà³ját és személyes hangvételét minden számlához',
      'ro': 'AdÄƒugaÈ›i brandul, logo-ul È™i atingerea personalÄƒ la fiecare facturÄƒ',
      'uk': 'Ð”Ð¾Ð´Ð°Ð¹Ñ‚Ðµ ÑÐ²Ñ–Ð¹ Ð±Ñ€ÐµÐ½Ð´, Ð»Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿ Ñ‚Ð° Ð¾ÑÐ¾Ð±Ð¸ÑÑ‚Ñ– Ð´ÐµÑ‚Ð°Ð»Ñ– Ð´Ð¾ ÐºÐ¾Ð¶Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ñ…ÑƒÐ½ÐºÑƒ',
      'bg': 'Ð”Ð¾Ð±Ð°Ð²ÐµÑ‚Ðµ Ð²Ð°ÑˆÐ¸Ñ Ð±Ñ€Ð°Ð½Ð´, Ð»Ð¾Ð³Ð¾ Ð¸ Ð»Ð¸Ñ‡ÐµÐ½ Ñ‰Ñ€Ð¸Ñ… ÐºÑŠÐ¼ Ð²ÑÑÐºÐ° Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð°',
      'hr': 'Dodajte svoj brand, logo i osobni dodir svakom raÄunu',
      'sk': 'Pridajte svoju znaÄku, logo a osobnà½ dotyk ku kaÅ¾dej faktàºre',
      'sl': 'Dodajte svoj brand, logo in osebni dotek vsakemu raÄunu'
    },
    'fast_simple': {
      'en': 'Fast & Simple',
      'es': 'Rápido y Sencillo',
      'fr': 'Rapide et Simple',
      'de': 'Schnell & Einfach',
      'it': 'Veloce e Semplice',
      'pt': 'Rápido e Simples',
      'ru': 'Ð‘Ñ‹ÑÑ‚Ñ€Ð¾ Ð¸ ÐŸÑ€Ð¾ÑÑ‚Ð¾',
      'ja': 'é«˜é€Ÿï¼†ã‚·ãƒ³ãƒ—ãƒ«',
      'zh': 'å¿«é€Ÿç®€å•',
      'ko': 'ë¹ ë¥´ê³  ê°„ë‹¨',
      'ar': 'Ø³Ø±ÙŠØ¹ ÙˆØ¨Ø³ÙŠØ·',
      'hi': 'à¤¤à¥‡à¤œà¤¼ à¤”à¤° à¤¸à¤°à¤²',
      'th': 'à¸£à¸§à¸”à¹€à¸£à¹‡à¸§à¹à¸¥à¸°à¸‡à¹ˆà¸²à¸¢',
      'vi': 'Nhanh & ÄÆ¡n giáº£n',
      'id': 'Cepat & Sederhana',
      'ms': 'Pantas & Mudah',
      'tl': 'Mabilis at Simple',
      'tr': 'HÄ±zlÄ± ve Basit',
      'pl': 'Szybki i Prosty',
      'nl': 'Snel & Eenvoudig',
      'sv': 'Snabbt & Enkelt',
      'no': 'Raskt & Enkelt',
      'da': 'Hurtigt & Simpelt',
      'fi': 'Nopea & Yksinkertainen',
      'el': 'Î“ÏÎ®Î³Î¿ÏÎ¿ & Î‘Ï€Î»ÏŒ',
      'he': '×ž×”×™×¨ ×•×¤×©×•×˜',
      'cs': 'Rychlé & Jednoduché',
      'hu': 'Gyors & EgyszerÅ±',
      'ro': 'Rapid & Simplu',
      'uk': 'Ð¨Ð²Ð¸Ð´ÐºÐ¾ & ÐŸÑ€Ð¾ÑÑ‚Ð¾',
      'bg': 'Ð‘ÑŠÑ€Ð·Ð¾ Ð¸ ÐŸÑ€Ð¾ÑÑ‚Ð¾',
      'hr': 'Brzo i Jednostavno',
      'sk': 'Rà½chle & Jednoduché',
      'sl': 'Hitro & Preprosto'
    },
    'create_invoices_minutes': {
      'en': 'Create professional invoices in minutes, not hours',
      'es': 'Cree facturas profesionales en minutos, no horas',
      'fr': 'Créez des factures professionnelles en minutes, pas en heures',
      'de': 'Erstellen Sie professionelle Rechnungen in Minuten, nicht in Stunden',
      'it': 'Crea fatture professionali in minuti, non ore',
      'pt': 'Crie faturas profissionais em minutos, não horas',
      'ru': 'Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÑ‡ÐµÑ‚Ð° Ð·Ð° Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹, Ð° Ð½Ðµ Ñ‡Ð°ÑÑ‹',
      'ja': 'æ™‚é–“ã§ã¯ãªãåˆ†ã§ãƒ—ãƒ­ãƒ•ã‚§ãƒƒã‚·ãƒ§ãƒŠãƒ«ãªè«‹æ±‚æ›¸ã‚’ä½œæˆ',
      'zh': 'å‡ åˆ†é’Ÿè€Œä¸æ˜¯å‡ å°æ—¶åˆ›å»ºä¸“ä¸šå‘ç¥¨',
      'ko': 'ì‹œê°„ì´ ì•„ë‹Œ ëª‡ ë¶„ ë§Œì— ì „ë¬¸ ì†¡ìž¥ ìƒì„±',
      'ar': 'Ø¥Ù†Ø´Ø§Ø¡ ÙÙˆØ§ØªÙŠØ± Ø§Ø­ØªØ±Ø§ÙÙŠØ© ÙÙŠ Ø¯Ù‚Ø§Ø¦Ù‚ØŒ ÙˆÙ„ÙŠØ³ Ø³Ø§Ø¹Ø§Øª',
      'hi': 'à¤˜à¤‚à¤Ÿà¥‹à¤‚ à¤•à¥‡ à¤¬à¤œà¤¾à¤¯ à¤®à¤¿à¤¨à¤Ÿà¥‹à¤‚ à¤®à¥‡à¤‚ à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤¬à¤¨à¤¾à¤à¤‚',
      'th': 'à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸£à¸°à¸”à¸±à¸šà¸¡à¸·à¸­à¸­à¸²à¸Šà¸µà¸žà¹ƒà¸™à¹„à¸¡à¹ˆà¸à¸µà¹ˆà¸™à¸²à¸—à¸µ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸Šà¸±à¹ˆà¸§à¹‚à¸¡à¸‡',
      'vi': 'Táº¡o hà³a Ä‘Æ¡n chuyàªn nghiá»‡p trong và i phàºt, khà´ng pháº£i và i giá»',
      'id': 'Buat invoice profesional dalam hitungan menit, bukan jam',
      'ms': 'Cipta invois profesional dalam minit, bukan jam',
      'tl': 'Gumawa ng propesyonal na invoice sa mga minuto, hindi oras',
      'tr': 'Profesyonel faturalarÄ± saatler deÄŸil, dakikalar içinde oluÅŸturun',
      'pl': 'Twà³rz profesjonalne faktury w minutach, a nie godzinach',
      'nl': 'Maak professionele facturen in minuten, niet uren',
      'sv': 'Skapa professionella fakturor pà¥ minuter, inte timmar',
      'no': 'Lag profesjonelle fakturaer pà¥ minutter, ikke timer',
      'da': 'Opret professionelle fakturaer pà¥ minutter, ikke timer',
      'fi': 'Luo ammattimaisia laskuja minuuteissa, ei tunteina',
      'el': 'Î”Î·Î¼Î¹Î¿Ï…ÏÎ³Î®ÏƒÏ„Îµ ÎµÏ€Î±Î³Î³ÎµÎ»Î¼Î±Ï„Î¹ÎºÎ¬ Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î¹Î± ÏƒÎµ Î»ÎµÏ€Ï„Î¬, ÏŒÏ‡Î¹ ÏŽÏÎµÏ‚',
      'he': '×¦×•×¨ ×—×©×‘×•× ×™×•×ª ×ž×§×¦×•×¢×™×•×ª ×‘×“×§×•×ª, ×œ× ×‘×©×¢×•×ª',
      'cs': 'VytváÅ™ejte profesionálnà­ faktury za minuty, ne za hodiny',
      'hu': 'Hozzon létre professzionális számlákat percek alatt, nem à³rák alatt',
      'ro': 'CreaÈ›i facturi profesionale à®n minute, nu à®n ore',
      'uk': 'Ð¡Ñ‚Ð²Ð¾Ñ€ÑŽÐ¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ñ– Ñ€Ð°Ñ…ÑƒÐ½ÐºÐ¸ Ð·Ð° Ñ…Ð²Ð¸Ð»Ð¸Ð½Ð¸, Ð° Ð½Ðµ Ð³Ð¾Ð´Ð¸Ð½Ð¸',
      'bg': 'Ð¡ÑŠÐ·Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÐ¸Ð¾Ð½Ð°Ð»Ð½Ð¸ Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸ Ð·Ð° Ð¼Ð¸Ð½ÑƒÑ‚Ð¸, Ð½Ðµ Ð·Ð° Ñ‡Ð°ÑÐ¾Ð²Ðµ',
      'hr': 'Stvarajte profesionalne raÄune u minutama, ne u satima',
      'sk': 'Vytvárajte profesionálne faktàºry za minàºty, nie za hodiny',
      'sl': 'Ustvarjte profesionalne raÄune v minutah, ne v urah'
    },

    // Footer Translations
    'footer_invoice_generator': {
      'en': 'Invoice Generator',
      'es': 'Generador de Facturas',
      'fr': 'Générateur de Factures',
      'de': 'Rechnungsgenerator',
      'it': 'Generatore di Fatture',
      'pt': 'Gerador de Faturas',
      'ru': 'Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð¡Ñ‡ÐµÑ‚Ð¾Ð²',
      'ja': 'è«‹æ±‚æ›¸ã‚¸ã‚§ãƒãƒ¬ãƒ¼ã‚¿ãƒ¼',
      'zh': 'å‘ç¥¨ç”Ÿæˆå™¨',
      'ko': 'ì†¡ìž¥ ìƒì„±ê¸°',
      'ar': 'Ù…ÙˆÙ„Ø¯ Ø§Ù„ÙÙˆØ§ØªÙŠØ±',
      'hi': 'à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤œà¥‡à¤¨à¤°à¥‡à¤Ÿà¤°',
      'th': 'à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰',
      'vi': 'Trà¬nh táº¡o Hà³a Ä‘Æ¡n',
      'id': 'MJW Perfect INVOICE Maker Free',
      'ms': 'Penjana Invois',
      'tl': 'Tagagawa ng Invoice',
      'tr': 'Fatura OluÅŸturucu',
      'pl': 'Generator Faktur',
      'nl': 'Factuur Generator',
      'sv': 'Fakturagenerator',
      'no': 'Fakturagenerator',
      'da': 'Fakturagenerator',
      'fi': 'Laskugeneraattori',
      'el': 'Î“ÎµÎ½Î½Î®Ï„ÏÎ¹Î± Î¤Î¹Î¼Î¿Î»Î¿Î³Î¯Ï‰Î½',
      'he': '×™×•×¦×¨ ×—×©×‘×•× ×™×•×ª',
      'cs': 'Generátor Faktur',
      'hu': 'Számla Generátor',
      'ro': 'Generator Facturi',
      'uk': 'Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð Ð°Ñ…ÑƒÐ½ÐºÑ–Ð²',
      'bg': 'Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð½Ð° Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸',
      'hr': 'Generator RaÄuna',
      'sk': 'Generátor Faktàºr',
      'sl': 'Generator RaÄunov'
    },
    'footer_description': {
      'en': 'Create professional invoices in seconds. No registration required.',
      'es': 'Cree facturas profesionales en segundos. Sin registro requerido.',
      'fr': 'Créez des factures professionnelles en secondes. Aucune inscription requise.',
      'de': 'Erstellen Sie professionelle Rechnungen in Sekunden. Keine Registrierung erforderlich.',
      'it': 'Crea fatture professionali in secondi. Nessuna registrazione richiesta.',
      'pt': 'Crie faturas profissionais em segundos. Sem registro necessário.',
      'ru': 'Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÑ‡ÐµÑ‚Ð° Ð·Ð° ÑÐµÐºÑƒÐ½Ð´Ñ‹. Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð½Ðµ Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ.',
      'ja': 'æ•°ç§’ã§ãƒ—ãƒ­ãƒ•ã‚§ãƒƒã‚·ãƒ§ãƒŠãƒ«ãªè«‹æ±‚æ›¸ã‚’ä½œæˆã€‚ç™»éŒ²ä¸è¦ã€‚',
      'zh': 'å‡ ç§’é’Ÿå†…åˆ›å»ºä¸“ä¸šå‘ç¥¨ã€‚æ— éœ€æ³¨å†Œã€‚',
      'ko': 'ì´ˆ ë‹¨ìœ„ë¡œ ì „ë¬¸ ì†¡ìž¥ ìƒì„±. ë“±ë¡ í•„ìš” ì—†ìŒ.',
      'ar': 'Ø¥Ù†Ø´Ø§Ø¡ ÙÙˆØ§ØªÙŠØ± Ø§Ø­ØªØ±Ø§ÙÙŠØ© ÙÙŠ Ø«ÙˆØ§Ù†Ù. Ù„Ø§ ÙŠØªØ·Ù„Ø¨ ØªØ³Ø¬ÙŠÙ„.',
      'hi': 'à¤¸à¥‡à¤•à¤‚à¤¡ à¤®à¥‡à¤‚ à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤‡à¤¨à¤µà¥‰à¤‡à¤¸ à¤¬à¤¨à¤¾à¤à¤‚à¥¤ à¤•à¥‹à¤ˆ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤†à¤µà¤¶à¥à¤¯à¤• à¤¨à¤¹à¥€à¤‚à¥¤',
      'th': 'à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸£à¸°à¸”à¸±à¸šà¸¡à¸·à¸­à¸­à¸²à¸Šà¸µà¸žà¹ƒà¸™à¹„à¸¡à¹ˆà¸à¸µà¹ˆà¸§à¸´à¸™à¸²à¸—à¸µ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸ªà¸¡à¸±à¸„à¸£à¸ªà¸¡à¸²à¸Šà¸´à¸',
      'vi': 'Táº¡o hà³a Ä‘Æ¡n chuyàªn nghiá»‡p trong và i già¢y. Khà´ng cáº§n Ä‘Äƒng kà½.',
      'id': 'Buat invoice profesional dalam hitungan detik. Tidak perlu registrasi.',
      'ms': 'Cipta invois profesional dalam saat. Tiada pendaftaran diperlukan.',
      'tl': 'Gumawa ng propesyonal na invoice sa ilang segundo. Walang registration required.',
      'tr': 'Saniyeler içinde profesyonel faturalar oluÅŸturun. KayÄ±t gerekmez.',
      'pl': 'Twà³rz profesjonalne faktury w sekundy. Bez rejestracji.',
      'nl': 'Maak professionele facturen in seconden. Geen registratie vereist.',
      'sv': 'Skapa professionella fakturor pà¥ sekunder. Ingen registrering krà¤vs.',
      'no': 'Lag profesjonelle fakturaer pà¥ sekunder. Ingen registrering nà¸dvendig.',
      'da': 'Opret professionelle fakturaer pà¥ sekunder. Ingen registrering pà¥krà¦vet.',
      'fi': 'Luo ammattimaisia laskuja sekunneissa. Ei rekisterà¶intià¤ vaadita.',
      'el': 'Î”Î·Î¼Î¹Î¿Ï…ÏÎ³Î®ÏƒÏ„Îµ ÎµÏ€Î±Î³Î³ÎµÎ»Î¼Î±Ï„Î¹ÎºÎ¬ Ï„Î¹Î¼Î¿Î»ÏŒÎ³Î¹Î± ÏƒÎµ Î´ÎµÏ…Ï„ÎµÏÏŒÎ»ÎµÏ€Ï„Î±. Î”ÎµÎ½ Î±Ï€Î±Î¹Ï„ÎµÎ¯Ï„Î±Î¹ ÎµÎ³Î³ÏÎ±Ï†Î®.',
      'he': '×¦×•×¨ ×—×©×‘×•× ×™×•×ª ×ž×§×¦×•×¢×™×•×ª ×‘×©× ×™×•×ª. ×œ× × ×“×¨×©×ª ×”×¨×©×ž×”.',
      'cs': 'VytváÅ™ejte profesionálnà­ faktury za sekundy. Nenà­ vyÅ¾adována registrace.',
      'hu': 'Hozzon létre professzionális számlákat másodpercek alatt. Nincs szà¼kség regisztrácià³ra.',
      'ro': 'CreaÈ›i facturi profesionale à®n secunde. Nu este necesarÄƒ à®nregistrarea.',
      'uk': 'Ð¡Ñ‚Ð²Ð¾Ñ€ÑŽÐ¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ñ– Ñ€Ð°Ñ…ÑƒÐ½ÐºÐ¸ Ð·Ð° ÑÐµÐºÑƒÐ½Ð´Ð¸. Ð ÐµÑ”ÑÑ‚Ñ€Ð°Ñ†Ñ–Ñ Ð½Ðµ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð°.',
      'bg': 'Ð¡ÑŠÐ·Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÐ¸Ð¾Ð½Ð°Ð»Ð½Ð¸ Ñ„Ð°ÐºÑ‚ÑƒÑ€Ð¸ Ð·Ð° ÑÐµÐºÑƒÐ½Ð´Ð¸. ÐÐµ ÑÐµ Ð¸Ð·Ð¸ÑÐºÐ²Ð° Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ.',
      'hr': 'Stvarajte profesionalne raÄune u sekundama. Nije potrebna registracija.',
      'sk': 'Vytvárajte profesionálne faktàºry za sekundy. Nie je vyÅ¾adovaná registrácia.',
      'sl': 'Ustvarjte profesionalne raÄune v sekundah. Registracija ni potrebna.'
    },
    'footer_product': {
      'en': 'Product',
      'es': 'Producto',
      'fr': 'Produit',
      'de': 'Produkt',
      'it': 'Prodotto',
      'pt': 'Produto',
      'ru': 'ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚',
      'ja': 'è£½å“',
      'zh': 'äº§å“',
      'ko': 'ì œí’ˆ',
      'ar': 'Ø§Ù„Ù…Ù†ØªØ¬',
      'hi': 'à¤‰à¤¤à¥à¤ªà¤¾à¤¦',
      'th': 'à¸œà¸¥à¸´à¸•à¸ à¸±à¸“à¸‘à¹Œ',
      'vi': 'Sáº£n pháº©m',
      'id': 'Produk',
      'ms': 'Produk',
      'tl': 'Produkto',
      'tr': 'àœrà¼n',
      'pl': 'Produkt',
      'nl': 'Product',
      'sv': 'Produkt',
      'no': 'Produkt',
      'da': 'Produkt',
      'fi': 'Tuote',
      'el': 'Î ÏÎ¿ÏŠÏŒÎ½',
      'he': '×ž×•×¦×¨',
      'cs': 'Produkt',
      'hu': 'Termék',
      'ro': 'Produs',
      'uk': 'ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚',
      'bg': 'ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚',
      'hr': 'Proizvod',
      'sk': 'Produkt',
      'sl': 'Izdelek'
    },
    'footer_support': {
      'en': 'Support',
      'es': 'Soporte',
      'fr': 'Support',
      'de': 'Support',
      'it': 'Support',
      'pt': 'Suporte',
      'ru': 'ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ°',
      'ja': 'ã‚µãƒãƒ¼ãƒˆ',
      'zh': 'æ”¯æŒ',
      'ko': 'ì§€ì›',
      'ar': 'Ø§Ù„Ø¯Ø¹Ù…',
      'hi': 'à¤¸à¤®à¤°à¥à¤¥à¤¨',
      'th': 'à¸à¸²à¸£à¸ªà¸™à¸±à¸šà¸ªà¸™à¸¸à¸™',
      'vi': 'Há»— trá»£',
      'id': 'Dukungan',
      'ms': 'Sokongan',
      'tl': 'Suporta',
      'tr': 'Destek',
      'pl': 'Wsparcie',
      'nl': 'Ondersteuning',
      'sv': 'Support',
      'no': 'Support',
      'da': 'Support',
      'fi': 'Tuki',
      'el': 'Î¥Ï€Î¿ÏƒÏ„Î®ÏÎ¹Î¾Î·',
      'he': '×ª×ž×™×›×”',
      'cs': 'Podpora',
      'hu': 'Támogatás',
      'ro': 'Suport',
      'uk': 'ÐŸÑ–Ð´Ñ‚Ñ€Ð¸Ð¼ÐºÐ°',
      'bg': 'ÐŸÐ¾Ð´ÐºÑ€ÐµÐ¿Ð°',
      'hr': 'PodrÅ¡ka',
      'sk': 'Podpora',
      'sl': 'Podpora'
    },
    'footer_company': {
      'en': 'Company',
      'es': 'Empresa',
      'fr': 'Entreprise',
      'de': 'Unternehmen',
      'it': 'Azienda',
      'pt': 'Empresa',
      'ru': 'ÐšÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ñ',
      'ja': 'ä¼šç¤¾',
      'zh': 'å…¬å¸',
      'ko': 'íšŒì‚¬',
      'ar': 'Ø§Ù„Ø´Ø±ÙƒØ©',
      'hi': 'à¤•à¤‚à¤ªà¤¨à¥€',
      'th': 'à¸šà¸£à¸´à¸©à¸±à¸—',
      'vi': 'Cà´ng ty',
      'id': 'Perusahaan',
      'ms': 'Syarikat',
      'tl': 'Kumpanya',
      'tr': 'Åžirket',
      'pl': 'Firma',
      'nl': 'Bedrijf',
      'sv': 'Fà¶retag',
      'no': 'Selskap',
      'da': 'Virksomhed',
      'fi': 'Yritys',
      'el': 'Î•Ï„Î±Î¹ÏÎµÎ¯Î±',
      'he': '×—×‘×¨×”',
      'cs': 'SpoleÄnost',
      'hu': 'Vállalat',
      'ro': 'Companie',
      'uk': 'ÐšÐ¾Ð¼Ð¿Ð°Ð½Ñ–Ñ',
      'bg': 'ÐšÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ñ',
      'hr': 'Tvrtka',
      'sk': 'SpoloÄnosÅ¥',
      'sl': 'Podjetje'
    },
    'footer_features': {
      'en': 'Features',
      'es': 'Características',
      'fr': 'Fonctionnalités',
      'de': 'Funktionen',
      'it': 'Caratteristiche',
      'pt': 'Recursos',
      'ru': 'Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸',
      'ja': 'æ©Ÿèƒ½',
      'zh': 'åŠŸèƒ½',
      'ko': 'ê¸°ëŠ¥',
      'ar': 'Ø§Ù„Ù…ÙŠØ²Ø§Øª',
      'hi': 'à¤µà¤¿à¤¶à¥‡à¤·à¤¤à¤¾à¤à¤‚',
      'th': 'à¸„à¸¸à¸“à¸ªà¸¡à¸šà¸±à¸•à¸´',
      'vi': 'Tà­nh nÄƒng',
      'id': 'Fitur',
      'ms': 'Ciri-ciri',
      'tl': 'Mga Tampok',
      'tr': 'à–zellikler',
      'pl': 'Funkcje',
      'nl': 'Functies',
      'sv': 'Funktioner',
      'no': 'Funksjoner',
      'da': 'Funktioner',
      'fi': 'Ominaisuudet',
      'el': 'Î§Î±ÏÎ±ÎºÏ„Î·ÏÎ¹ÏƒÏ„Î¹ÎºÎ¬',
      'he': '×ª×›×•× ×•×ª',
      'cs': 'Funkce',
      'hu': 'Funkcià³k',
      'ro': 'FuncÈ›ionalitÄƒÈ›i',
      'uk': 'Ð¤ÑƒÐ½ÐºÑ†Ñ–Ñ—',
      'bg': 'Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸',
      'hr': 'ZnaÄajke',
      'sk': 'Funkcie',
      'sl': 'ZnaÄilnosti'
    },
    'footer_templates': {
      'en': 'Templates',
      'es': 'Plantillas',
      'fr': 'Modà¨les',
      'de': 'Vorlagen',
      'it': 'Modelli',
      'pt': 'Modelos',
      'ru': 'Ð¨Ð°Ð±Ð»Ð¾Ð½Ñ‹',
      'ja': 'ãƒ†ãƒ³ãƒ—ãƒ¬ãƒ¼ãƒˆ',
      'zh': 'æ¨¡æ¿',
      'ko': 'í…œí”Œë¦¿',
      'ar': 'Ù‚ÙˆØ§Ù„Ø¨',
      'hi': 'à¤Ÿà¥‡à¤®à¥à¤ªà¥à¤²à¥‡à¤Ÿ',
      'th': 'à¹€à¸—à¸¡à¹€à¸žà¸¥à¸•',
      'vi': 'Máº«u',
      'id': 'Template',
      'ms': 'Templat',
      'tl': 'Mga Template',
      'tr': 'Åžablonlar',
      'pl': 'Szablony',
      'nl': 'Sjablonen',
      'sv': 'Mallar',
      'no': 'Maler',
      'da': 'Skabeloner',
      'fi': 'Mallipohjat',
      'el': 'Î ÏÏŒÏ„Ï…Ï€Î±',
      'he': '×ª×‘× ×™×•×ª',
      'cs': 'Å ablony',
      'hu': 'Sablonok',
      'ro': 'È˜abloane',
      'uk': 'Ð¨Ð°Ð±Ð»Ð¾Ð½Ð¸',
      'bg': 'Ð¨Ð°Ð±Ð»Ð¾Ð½Ð¸',
      'hr': 'PredloÅ¡ci',
      'sk': 'Å ablà³ny',
      'sl': 'Predloge'
    },
    'footer_pricing': {
      'en': 'Pricing',
      'es': 'Precios',
      'fr': 'Tarifs',
      'de': 'Preise',
      'it': 'Prezzi',
      'pt': 'Preços',
      'ru': 'Ð¦ÐµÐ½Ñ‹',
      'ja': 'æ–™é‡‘',
      'zh': 'ä»·æ ¼',
      'ko': 'ê°€ê²©',
      'ar': 'Ø§Ù„Ø£Ø³Ø¹Ø§Ø±',
      'hi': 'à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£',
      'th': 'à¸£à¸²à¸„à¸²',
      'vi': 'Giá cáº£',
      'id': 'Harga',
      'ms': 'Harga',
      'tl': 'Presyo',
      'tr': 'FiyatlandÄ±rma',
      'pl': 'Cennik',
      'nl': 'Prijzen',
      'sv': 'Priser',
      'no': 'Priser',
      'da': 'Priser',
      'fi': 'Hinnasto',
      'el': 'Î¤Î¹Î¼Î­Ï‚',
      'he': '×ž×—×™×¨×™×',
      'cs': 'Ceny',
      'hu': 'àrak',
      'ro': 'PreÈ›uri',
      'uk': 'Ð¦Ñ–Ð½Ð¸',
      'bg': 'Ð¦ÐµÐ½Ð¸',
      'hr': 'Cijene',
      'sk': 'Ceny',
      'sl': 'Cene'
    },
    'footer_api': {
      'en': 'API',
      'es': 'API',
      'fr': 'API',
      'de': 'API',
      'it': 'API',
      'pt': 'API',
      'ru': 'API',
      'ja': 'API',
      'zh': 'API',
      'ko': 'API',
      'ar': 'API',
      'hi': 'API',
      'th': 'API',
      'vi': 'API',
      'id': 'API',
      'ms': 'API',
      'tl': 'API',
      'tr': 'API',
      'pl': 'API',
      'nl': 'API',
      'sv': 'API',
      'no': 'API',
      'da': 'API',
      'fi': 'API',
      'el': 'API',
      'he': 'API',
      'cs': 'API',
      'hu': 'API',
      'ro': 'API',
      'uk': 'API',
      'bg': 'API',
      'hr': 'API',
      'sk': 'API',
      'sl': 'API'
    },
    'footer_help_center': {
      'en': 'Help Center',
      'es': 'Centro de Ayuda',
      'fr': 'Centre d\'Aide',
      'de': 'Hilfezentrum',
      'it': 'Centro Assistenza',
      'pt': 'Central de Ajuda',
      'ru': 'Ð¦ÐµÐ½Ñ‚Ñ€ ÐŸÐ¾Ð¼Ð¾Ñ‰Ð¸',
      'ja': 'ãƒ˜ãƒ«ãƒ—ã‚»ãƒ³ã‚¿ãƒ¼',
      'zh': 'å¸®åŠ©ä¸­å¿ƒ',
      'ko': 'ë„ì›€ë§ ì„¼í„°',
      'ar': 'Ù…Ø±ÙƒØ² Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©',
      'hi': 'à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤•à¥‡à¤‚à¤¦à¥à¤°',
      'th': 'à¸¨à¸¹à¸™à¸¢à¹Œà¸Šà¹ˆà¸§à¸¢à¹€à¸«à¸¥à¸·à¸­',
      'vi': 'Trung tà¢m Trá»£ giàºp',
      'id': 'Pusat Bantuan',
      'ms': 'Pusat Bantuan',
      'tl': 'Help Center',
      'tr': 'YardÄ±m Merkezi',
      'pl': 'Centrum Pomocy',
      'nl': 'Helpcentrum',
      'sv': 'Hjà¤lpcenter',
      'no': 'Hjelpesenter',
      'da': 'Hjà¦lpcenter',
      'fi': 'Ohjekeskus',
      'el': 'ÎšÎ­Î½Ï„ÏÎ¿ Î’Î¿Î®Î¸ÎµÎ¹Î±Ï‚',
      'he': '×ž×¨×›×– ×¢×–×¨×”',
      'cs': 'Centrum Pomoci',
      'hu': 'Sàºgà³kà¶zpont',
      'ro': 'Centru de Ajutor',
      'uk': 'Ð¦ÐµÐ½Ñ‚Ñ€ Ð”Ð¾Ð¿Ð¾Ð¼Ð¾Ð³Ð¸',
      'bg': 'ÐŸÐ¾Ð¼Ð¾Ñ‰ÐµÐ½ Ñ†ÐµÐ½Ñ‚ÑŠÑ€',
      'hr': 'Centar za pomoÄ‡',
      'sk': 'Centrum Pomoci',
      'sl': 'PomoÄni center'
    },
    'footer_contact': {
      'en': 'Contact',
      'es': 'Contacto',
      'fr': 'Contact',
      'de': 'Kontakt',
      'it': 'Contatto',
      'pt': 'Contato',
      'ru': 'ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚',
      'ja': 'ãŠå•ã„åˆã‚ã›',
      'zh': 'è”ç³»',
      'ko': 'ì—°ë½ì²˜',
      'ar': 'Ø§ØªØµØ§Ù„',
      'hi': 'à¤¸à¤‚à¤ªà¤°à¥à¤•',
      'th': 'à¸•à¸´à¸”à¸•à¹ˆà¸­',
      'vi': 'Liàªn há»‡',
      'id': 'Kontak',
      'ms': 'Hubungi',
      'tl': 'Kontak',
      'tr': 'Ä°letiÅŸim',
      'pl': 'Kontakt',
      'nl': 'Contact',
      'sv': 'Kontakt',
      'no': 'Kontakt',
      'da': 'Kontakt',
      'fi': 'Yhteystiedot',
      'el': 'Î•Ï€Î¹ÎºÎ¿Î¹Î½Ï‰Î½Î¯Î±',
      'he': '×¦×•×¨ ×§×©×¨',
      'cs': 'Kontakt',
      'hu': 'Kapcsolat',
      'ro': 'Contact',
      'uk': 'ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚',
      'bg': 'ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚',
      'hr': 'Kontakt',
      'sk': 'Kontakt',
      'sl': 'Stik'
    },
    'footer_faq': {
      'en': 'FAQ',
      'es': 'FAQ',
      'fr': 'FAQ',
      'de': 'FAQ',
      'it': 'FAQ',
      'pt': 'FAQ',
      'ru': 'Ð§Ð—Ð’',
      'ja': 'ã‚ˆãã‚ã‚‹è³ªå•',
      'zh': 'å¸¸è§é—®é¢˜',
      'ko': 'ìžì£¼ ë¬»ëŠ” ì§ˆë¬¸',
      'ar': 'Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©',
      'hi': 'अक्सर पूछे जाने वाले प्रश्न',
      'th': 'à¸„à¸³à¸–à¸²à¸¡à¸—à¸µà¹ˆà¸žà¸šà¸šà¹ˆà¸­à¸¢',
      'vi': 'Cà¢u há»i thÆ°á»ng gáº·p',
      'id': 'FAQ',
      'ms': 'FAQ',
      'tl': 'FAQ',
      'tr': 'SSS',
      'pl': 'FAQ',
      'nl': 'FAQ',
      'sv': 'FAQ',
      'no': 'FAQ',
      'da': 'FAQ',
      'fi': 'Usein kysytyt kysymykset',
      'el': 'Î£Ï…Ï‡Î½Î­Ï‚ Î•ÏÏ‰Ï„Î®ÏƒÎµÎ¹Ï‚',
      'he': '×©××œ×•×ª × ×¤×•×¦×•×ª',
      'cs': 'ÄŒasto kladené otázky',
      'hu': 'GYIK',
      'ro': 'àŽntrebÄƒri frecvente',
      'uk': 'Ð§Ð—Ð’',
      'bg': 'Ð§Ð—Ð’',
      'hr': 'ÄŒPP',
      'sk': 'ÄŒasto kladené otázky',
      'sl': 'Pogosta vpraÅ¡anja'
    },
    'footer_status': {
      'en': 'Status',
      'es': 'Estado',
      'fr': 'Statut',
      'de': 'Status',
      'it': 'Stato',
      'pt': 'Status',
      'ru': 'Ð¡Ñ‚Ð°Ñ‚ÑƒÑ',
      'ja': 'ã‚¹ãƒ†ãƒ¼ã‚¿ã‚¹',
      'zh': 'çŠ¶æ€',
      'ko': 'ìƒíƒœ',
      'ar': 'Ø§Ù„Ø­Ø§Ù„Ø©',
      'hi': 'à¤¸à¥à¤¥à¤¿à¤¤à¤¿',
      'th': 'à¸ªà¸–à¸²à¸™à¸°',
      'vi': 'Tráº¡ng thái',
      'id': 'Status',
      'ms': 'Status',
      'tl': 'Status',
      'tr': 'Durum',
      'pl': 'Status',
      'nl': 'Status',
      'sv': 'Status',
      'no': 'Status',
      'da': 'Status',
      'fi': 'Tila',
      'el': 'ÎšÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·',
      'he': '×¡×˜×˜×•×¡',
      'cs': 'Status',
      'hu': 'àllapot',
      'ro': 'Stare',
      'uk': 'Ð¡Ñ‚Ð°Ñ‚ÑƒÑ',
      'bg': 'Ð¡Ñ‚Ð°Ñ‚ÑƒÑ',
      'hr': 'Status',
      'sk': 'Status',
      'sl': 'Status'
    },
    'footer_about': {
      'en': 'About',
      'es': 'Acerca de',
      'fr': 'À propos',
      'de': 'Über',
      'it': 'Informazioni',
      'pt': 'Sobre',
      'ru': 'Ðž Ð½Ð°Ñ',
      'ja': 'ã«ã¤ã„ã¦',
      'zh': 'å…³äºŽ',
      'ko': 'ì •ë³´',
      'ar': 'Ø­ÙˆÙ„',
      'hi': 'à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚',
      'th': 'à¹€à¸à¸µà¹ˆà¸¢à¸§à¸à¸±à¸š',
      'vi': 'Vá»',
      'id': 'Tentang',
      'ms': 'Tentang',
      'tl': 'Tungkol sa',
      'tr': 'HakkÄ±nda',
      'pl': 'O nas',
      'nl': 'Over',
      'sv': 'Om',
      'no': 'Om',
      'da': 'Om',
      'fi': 'Tietoa',
      'el': 'Î£Ï‡ÎµÏ„Î¹ÎºÎ¬ Î¼Îµ',
      'he': '×¢×œ×™× ×•',
      'cs': 'O nás',
      'hu': 'Rà³lunk',
      'ro': 'Despre',
      'uk': 'ÐŸÑ€Ð¾ Ð½Ð°Ñ',
      'bg': 'Ð—Ð° Ð½Ð°Ñ',
      'hr': 'O nama',
      'sk': 'O nás',
      'sl': 'O nas'
    },
    'footer_blog': {
      'en': 'Blog',
      'es': 'Blog',
      'fr': 'Blog',
      'de': 'Blog',
      'it': 'Blog',
      'pt': 'Blog',
      'ru': 'Ð‘Ð»Ð¾Ð³',
      'ja': 'ãƒ–ãƒ­ã‚°',
      'zh': 'åšå®¢',
      'ko': 'ë¸”ë¡œê·¸',
      'ar': 'Ø§Ù„Ù…Ø¯ÙˆÙ†Ø©',
      'hi': 'à¤¬à¥à¤²à¥‰à¤—',
      'th': 'à¸šà¸¥à¹‡à¸­à¸',
      'vi': 'Blog',
      'id': 'Blog',
      'ms': 'Blog',
      'tl': 'Blog',
      'tr': 'Blog',
      'pl': 'Blog',
      'nl': 'Blog',
      'sv': 'Blogg',
      'no': 'Blogg',
      'da': 'Blog',
      'fi': 'Blogi',
      'el': 'Blog',
      'he': '×‘×œ×•×’',
      'cs': 'Blog',
      'hu': 'Blog',
      'ro': 'Blog',
      'uk': 'Ð‘Ð»Ð¾Ð³',
      'bg': 'Ð‘Ð»Ð¾Ð³',
      'hr': 'Blog',
      'sk': 'Blog',
      'sl': 'Blog'
    },
    'footer_privacy': {
      'en': 'Privacy',
      'es': 'Privacidad',
      'fr': 'Confidentialité',
      'de': 'Datenschutz',
      'it': 'Privacy',
      'pt': 'Privacidade',
      'ru': 'ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ',
      'ja': 'ãƒ—ãƒ©ã‚¤ãƒã‚·ãƒ¼',
      'zh': 'éšç§',
      'ko': 'ê°œì¸ì •ë³´ ë³´í˜¸',
      'ar': 'Ø§Ù„Ø®ØµÙˆØµÙŠØ©',
      'hi': 'à¤—à¥‹à¤ªà¤¨à¥€à¤¯à¤¤à¤¾',
      'th': 'à¸„à¸§à¸²à¸¡à¹€à¸›à¹‡à¸™à¸ªà¹ˆà¸§à¸™à¸•à¸±à¸§',
      'vi': 'Quyá»n riàªng tÆ°',
      'id': 'Privasi',
      'ms': 'Privasi',
      'tl': 'Privacy',
      'tr': 'Gizlilik',
      'pl': 'PrywatnoÅ›Ä‡',
      'nl': 'Privacy',
      'sv': 'Integritet',
      'no': 'Personvern',
      'da': 'Privatliv',
      'fi': 'Yksityisyydensuoja',
      'el': 'Î‘Ï€ÏŒÏÏÎ·Ï„Î¿',
      'he': '×¤×¨×˜×™×•×ª',
      'cs': 'Soukromà­',
      'hu': 'Adatvédelem',
      'ro': 'ConfidenÈ›ialitate',
      'uk': 'ÐšÐ¾Ð½Ñ„Ñ–Ð´ÐµÐ½Ñ†Ñ–Ð¹Ð½Ñ–ÑÑ‚ÑŒ',
      'bg': 'ÐŸÐ¾Ð²ÐµÑ€Ð¸Ñ‚ÐµÐ»Ð½Ð¾ÑÑ‚',
      'hr': 'Privatnost',
      'sk': 'Sàºkromie',
      'sl': 'Zasebnost'
    },
    'footer_terms': {
      'en': 'Terms',
      'es': 'Términos',
      'fr': 'Conditions',
      'de': 'Bedingungen',
      'it': 'Termini',
      'pt': 'Termos',
      'ru': 'Ð£ÑÐ»Ð¾Ð²Ð¸Ñ',
      'ja': 'åˆ©ç”¨è¦ç´„',
      'zh': 'æ¡æ¬¾',
      'ko': 'ì•½ê´€',
      'ar': 'Ø§Ù„Ø´Ø±ÙˆØ·',
      'hi': 'à¤¨à¤¿à¤¯à¤® à¤”à¤° à¤¶à¤°à¥à¤¤à¥‡à¤‚',
      'th': 'à¹€à¸‡à¸·à¹ˆà¸­à¸™à¹„à¸‚',
      'vi': 'Äiá»u khoáº£n',
      'id': 'Syarat & Ketentuan',
      'ms': 'Terma',
      'tl': 'Mga Tuntunin',
      'tr': 'Åžartlar',
      'pl': 'Warunki',
      'nl': 'Voorwaarden',
      'sv': 'Villkor',
      'no': 'Vilkà¥r',
      'da': 'Betingelser',
      'fi': 'Ehdot',
      'el': 'ÎŒÏÎ¿Î¹',
      'he': '×ª× ××™×',
      'cs': 'Podmà­nky',
      'hu': 'Feltételek',
      'ro': 'Termeni',
      'uk': 'Ð£Ð¼Ð¾Ð²Ð¸',
      'bg': 'Ð£ÑÐ»Ð¾Ð²Ð¸Ñ',
      'hr': 'Uvjeti',
      'sk': 'Podmienky',
      'sl': 'Pogoji'
    },
    'footer_copyright': {
      'en': '&copy; 2024 Invoice Generator. All rights reserved.',
      'es': '&copy; 2024 Generador de Facturas. Todos los derechos reservados.',
      'fr': '&copy; 2024 Générateur de Factures. Tous droits réservés.',
      'de': '&copy; 2024 Rechnungsgenerator. Alle Rechte vorbehalten.',
      'it': '&copy; 2024 Generatore di Fatture. Tutti i diritti riservati.',
      'pt': '&copy; 2024 Gerador de Faturas. Todos os direitos reservados.',
      'ru': '&copy; 2024 Генератор Счетов. Все права защищены.',
      'ja': '&copy; 2024 請求書ジェネレーター。すべての権利予約済み。',
      'zh': '&copy; 2024 发票生成器。保留所有权利。',
      'ko': '&copy; 2024 송장 생성기. 모든 권리 보유.',
      'ar': '&copy; 2024 مولد الفواتير. جميع الحقوق محفوظة.',
      'hi': '&copy; 2024 इनवॉइस जनरेटर। सभी अधिकार सुरक्षित।',
      'th': '&copy; 2024 เครื่องสร้างใบแจ้งหนี้ สงวนลิขสิทธิ์',
      'vi': '&copy; 2024 Trình tạo Hóa đơn. Đã đăng ký bản quyền.',
      'id': '&copy; 2025 MJW Perfect INVOICE Maker Free. Semua hak dilindungi.',
      'ms': '&copy; 2024 Penjana Invois. Hak cipta terpelihara.',
      'tl': '&copy; 2024 Tagagawa ng Invoice. Lahat ng karapatan ay nakalaan.',
      'tr': '&copy; 2024 Fatura Oluşturucu. Tüm hakları saklıdır.',
      'pl': '&copy; 2024 Generator Faktur. Wszelkie prawa zastrzeżone.',
      'nl': '&copy; 2024 Factuur Generator. Alle rechten voorbehouden.',
      'sv': '&copy; 2024 Fakturagenerator. Alla rättigheter reserverade.',
      'no': '&copy; 2024 Fakturagenerator. Alle rettigheter reservert.',
      'da': '&copy; 2024 Fakturagenerator. Alle rettigheder forbeholdes.',
      'fi': '&copy; 2024 Laskugeneraattori. Kaikki oikeudet pidätetään.',
      'el': '&copy; 2024 Γεννήτρια Τιμολογίων. Με την επιφύλαξη παντός δικαιώματος.',
      'he': '&copy; 2024 יוצר חשבוניות. כל הזכויות שמורות.',
      'cs': '&copy; 2024 Generátor Faktur. Všechna práva vyhrazena.',
      'hu': '&copy; 2024 Számla Generátor. Minden jog fenntartva.',
      'ro': '&copy; 2024 Generator Facturi. Toate drepturile rezervate.',
      'uk': '&copy; 2024 Генератор Рахунків. Всі права захищені.',
      'bg': '&copy; 2024 Генератор на фактури. Всички права запазени.',
      'hr': '&copy; 2024 Generator Računa. Sva prava pridržana.',
      'sk': '&copy; 2024 Generátor Faktúr. Všetky práva vyhradené.',
      'sl': '&copy; 2024 Generator Računov. Vse pravice pridržane.'
    },
    'footer_thank_you': {
      'en': 'Thank you for your business!',
      'es': '¡Gracias por su negocio!',
      'fr': 'Merci pour votre entreprise !',
      'de': 'Vielen Dank für Ihre Geschäftstätigkeit!',
      'it': 'Grazie per il tuo business!',
      'pt': 'Obrigado pelos seus negócios!',
      'ru': 'Спасибо за ваш бизнес!',
      'ja': 'お取り引きありがとうございます！',
      'zh': '感谢您的业务！',
      'ko': '비즈니스에 감사드립니다!',
      'ar': 'شكرا لك على عملك!',
      'hi': 'आपके व्यवसाय के लिए धन्यवाद!',
      'th': 'ขอบคุณสำหรับธุรกิจของคุณ!',
      'vi': 'Cảm ơn vì đã kinh doanh cùng bạn!',
      'id': 'Terima kasih atas bisnis Anda!',
      'ms': 'Terima kasih di atas perniagaan anda!',
      'tl': 'Salamat sa iyong negosyo!',
      'tr': 'İşiniz için teşekkürler!',
      'pl': 'Dziękujemy za współpracę!',
      'nl': 'Bedankt voor uw bedrijf!',
      'sv': 'Tack för din verksamhet!',
      'no': 'Takk for virksomheten!',
      'da': 'Tak for din forretning!',
      'fi': 'Kiitos yrityksestänne!',
      'el': 'Ευχαριστούμε για την επιχείρησή σας!',
      'he': 'תודה על העסק שלך!',
      'cs': 'Děkujeme za vaši obchodní spolupráci!',
      'hu': 'Köszönjük az üzletet!',
      'ro': 'Vă mulțumim pentru afacerea dvs.!',
      'uk': 'Дякуємо за ваш бізнес!',
      'bg': 'Благодарим за бизнеса ви!',
      'hr': 'Hvala vam na poslovanju!',
      'sk': 'Ďakujeme za vaše podnikanie!',
      'sl': 'Hvala za poslovanje!'
    },
      'he': '×ª×©×œ×•× ×ª×•×š 30 ×™×ž×™×. ×ª×•×“×” ×¢×œ ×”×¢×¡×§ ×©×œ×š!',
      'cs': 'Platba do 30 dnÅ¯. DÄ›kujeme za vaÅ¡i obchodnà­ spolupráci!',
      'hu': 'Fizetés 30 napon belà¼l. Kà¶szà¶njà¼k az à¼zletet!',
      'ro': 'PlatÄƒ à®n 30 de zile. VÄƒ mulÈ›umim pentru afacerea dvs.!',
      'uk': 'ÐžÐ¿Ð»Ð°Ñ‚Ð° Ð¿Ñ€Ð¾Ñ‚ÑÐ³Ð¾Ð¼ 30 Ð´Ð½Ñ–Ð². Ð”ÑÐºÑƒÑ”Ð¼Ð¾ Ð·Ð° Ð²Ð°Ñˆ Ð±Ñ–Ð·Ð½ÐµÑ!',
      'bg': 'ÐŸÐ»Ð°Ñ‰Ð°Ð½Ðµ Ð² Ñ€Ð°Ð¼ÐºÐ¸Ñ‚Ðµ Ð½Ð° 30 Ð´Ð½Ð¸. Ð‘Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€Ð¸Ð¼ Ð·Ð° Ð±Ð¸Ð·Ð½ÐµÑÐ° Ð²Ð¸!',
      'hr': 'PlaÄ‡anje unutar 30 dana. Hvala vam na poslovanju!',
      'sk': 'Platba do 30 dnà­. ÄŽakujeme za vaÅ¡e podnikanie!',
      'sl': 'PlaÄilo v 30 dneh. Hvala za poslovanje!'
    },
    'notes_placeholder': {
      'en': 'Additional notes or payment instructions...',
      'es': 'Notas adicionales o instrucciones de pago...',
      'fr': 'Notes supplémentaires ou instructions de paiement...',
      'de': 'Zusà¤tzliche Hinweise oder Zahlungsanweisungen...',
      'it': 'Note aggiuntive o istruzioni di pagamento...',
      'pt': 'Notas adicionais ou instruçàµes de pagamento...',
      'ru': 'Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ñ Ð¸Ð»Ð¸ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ð»Ð°Ñ‚Ðµ...',
      'ja': 'è¿½åŠ ã®ãƒ¡ãƒ¢ã¾ãŸã¯æ”¯æ‰•ã„æŒ‡ç¤º...',
      'zh': 'é™„åŠ è¯´æ˜Žæˆ–ä»˜æ¬¾è¯´æ˜Ž...',
      'ko': 'ì¶”ê°€ ì°¸ê³ ì‚¬í•­ ë˜ëŠ” ê²°ì œ ì§€ì‹œì‚¬í•­...',
      'ar': 'Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ© Ø£Ùˆ ØªØ¹Ù„ÙŠÙ…Ø§Øª Ø§Ù„Ø¯ÙØ¹...',
      'hi': 'à¤…à¤¤à¤¿à¤°à¤¿à¤•à¥à¤¤ à¤¨à¥‹à¤Ÿà¥à¤¸ à¤¯à¤¾ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶...',
      'th': 'à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡à¸«à¸£à¸·à¸­à¸„à¸³à¹à¸™à¸°à¸™à¸³à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™...',
      'vi': 'Ghi chàº bá»• sung hoáº·c hÆ°á»›ng dáº«n thanh toán...',
      'id': 'Catatan tambahan atau instruksi pembayaran...',
      'ms': 'Nota tambahan atau arahan pembayaran...',
      'tl': 'Karagdagang talaan o tagubilin sa pagbabayad...',
      'tr': 'Ek notlar veya à¶deme talimatlarÄ±...',
      'pl': 'Dodatkowe uwagi lub instrukcje pÅ‚atnoÅ›ci...',
      'nl': 'Aanvullende opmerkingen of betaalinstructies...',
      'sv': 'Ytterligare anteckningar eller betalningsinstruktioner...',
      'no': 'Tilleggsnotater eller betalingsinstruksjoner...',
      'da': 'Yderligere bemà¦rkninger eller betalingsinstruktioner...',
      'fi': 'Lisà¤huomautuksia tai maksuohjeita...',
      'el': 'Î ÏÏŒÏƒÎ¸ÎµÏ„ÎµÏ‚ ÏƒÎ·Î¼ÎµÎ¹ÏŽÏƒÎµÎ¹Ï‚ Î® Î¿Î´Î·Î³Î¯ÎµÏ‚ Ï€Î»Î·ÏÏ‰Î¼Î®Ï‚...',
      'he': '×”×¢×¨×•×ª × ×•×¡×¤×•×ª ××• ×”×•×¨××•×ª ×ª×©×œ×•×...',
      'cs': 'DalÅ¡à­ poznámky nebo pokyny k platbÄ›...',
      'hu': 'További megjegyzések vagy fizetési utasà­tások...',
      'ro': 'Note suplimentare sau instrucÈ›iuni de platÄƒ...',
      'uk': 'Ð”Ð¾Ð´Ð°Ñ‚ÐºÐ¾Ð²Ñ– Ð¿Ñ€Ð¸Ð¼Ñ–Ñ‚ÐºÐ¸ Ð°Ð±Ð¾ Ñ–Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ñ–Ñ— Ñ‰Ð¾Ð´Ð¾ Ð¾Ð¿Ð»Ð°Ñ‚Ð¸...',
      'bg': 'Ð”Ð¾Ð¿ÑŠÐ»Ð½Ð¸Ñ‚ÐµÐ»Ð½Ð¸ Ð±ÐµÐ»ÐµÐ¶ÐºÐ¸ Ð¸Ð»Ð¸ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¸ Ð·Ð° Ð¿Ð»Ð°Ñ‰Ð°Ð½Ðµ...',
      'hr': 'Dodatne napomene ili upute za plaÄ‡anje...',
      'sk': 'ÄŽalÅ¡ie poznámky alebo inÅ¡trukcie k platbe...',
      'sl': 'Dodatne opombe ali navodila za plaÄilo...'
    },
    'show_due_date': {
      'en': 'Show Due Date',
      'es': 'Mostrar Fecha de Vencimiento',
      'fr': 'Afficher la Date d\'à‰chéance',
      'de': 'Fà¤lligkeitsdatum anzeigen',
      'it': 'Mostra Data di Scadenza',
      'pt': 'Mostrar Data de Vencimento',
      'ru': 'ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ ÑÑ€Ð¾Ðº Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹',
      'ja': 'æ”¯æ‰•æœŸæ—¥ã‚’è¡¨ç¤º',
      'zh': 'æ˜¾ç¤ºåˆ°æœŸæ—¥',
      'ko': 'ë§Œë£Œì¼ í‘œì‹œ',
      'ar': 'Ø¥Ø¸Ù‡Ø§Ø± ØªØ§Ø±ÙŠØ® Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚',
      'hi': 'à¤¨à¤¿à¤¯à¤¤ à¤¤à¤¿à¤¥à¤¿ à¤¦à¤¿à¤–à¤¾à¤à¤‚',
      'th': 'à¹à¸ªà¸”à¸‡à¸§à¸±à¸™à¸—à¸µà¹ˆà¸„à¸£à¸šà¸à¸³à¸«à¸™à¸”',
      'vi': 'Hiá»ƒn thá»‹ Ngà y Ä‘áº¿n háº¡n',
      'id': 'Tampilkan Tanggal Jatuh Tempo',
      'ms': 'Tunjukkan Tarikh Jatuh Tempo',
      'tl': 'Ipakita ang Petsa ng Pagkakabayaran',
      'tr': 'Vade Tarihi Gà¶ster',
      'pl': 'PokaÅ¼ Termin PÅ‚atnoÅ›ci',
      'nl': 'Vervaldatum weergeven',
      'sv': 'Visa Fà¶rfallodatum',
      'no': 'Vis Forfallsdato',
      'da': 'Vis Forfaldsdato',
      'fi': 'Nà¤ytà¤ erà¤pà¤ivà¤',
      'el': 'Î•Î¼Ï†Î¬Î½Î¹ÏƒÎ· Î—Î¼ÎµÏÎ¿Î¼Î·Î½Î¯Î±Ï‚ Î›Î®Î¾Î·Ï‚',
      'he': '×”×¦×’ ×ª××¨×™×š ×¤×™×¨×¢×•×Ÿ',
      'cs': 'Zobrazit datum splatnosti',
      'hu': 'Esedékesség dátumának megjelenà­tése',
      'ro': 'AfiÈ™eazÄƒ Data ScadenÈ›ei',
      'uk': 'ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚Ð¸ Ð´Ð°Ñ‚Ñƒ Ð·Ð°ÐºÑ–Ð½Ñ‡ÐµÐ½Ð½Ñ',
      'bg': 'ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ð´Ð°Ñ‚Ð° Ð½Ð° Ð¿Ð°Ð´ÐµÐ¶Ð°',
      'hr': 'PrikaÅ¾i datum dospijeÄ‡a',
      'sk': 'ZobraziÅ¥ dátum splatnosti',
      'sl': 'PrikaÅ¾i datum zapadlosti'
    },
    'currency_settings': {
      'en': 'Currency Settings',
      'es': 'Configuracià³n de Moneda',
      'fr': 'Paramà¨tres de Devise',
      'de': 'Wà¤hrungseinstellungen',
      'it': 'Impostazioni Valuta',
      'pt': 'Configuraçàµes de Moeda',
      'ru': 'ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð’Ð°Ð»ÑŽÑ‚Ñ‹',
      'ja': 'é€šè²¨è¨­å®š',
      'zh': 'è´§å¸è®¾ç½®',
      'ko': 'í†µí™” ì„¤ì •',
      'ar': 'Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø©',
      'hi': 'à¤®à¥à¤¦à¥à¤°à¤¾ à¤¸à¥‡à¤Ÿà¤¿à¤‚à¤—à¥à¤¸',
      'th': 'à¸à¸²à¸£à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸²à¸ªà¸à¸¸à¸¥à¹€à¸‡à¸´à¸™',
      'vi': 'Cà i Ä‘áº·t Tiá»n tá»‡',
      'id': 'Pengaturan Mata Uang',
      'ms': 'Tetapan Mata Wang',
      'tl': 'Mga Setting ng Currency',
      'tr': 'Para Birimi AyarlarÄ±',
      'pl': 'Ustawienia Waluty',
      'nl': 'Valuta Instellingen',
      'sv': 'Valutainstà¤llningar',
      'no': 'Valutainnstillinger',
      'da': 'Valutaindstillinger',
      'fi': 'Valutta-asetukset',
      'el': 'Î¡Ï…Î¸Î¼Î¯ÏƒÎµÎ¹Ï‚ ÎÎ¿Î¼Î¯ÏƒÎ¼Î±Ï„Î¿Ï‚',
      'he': '×”×’×“×¨×•×ª ×ž×˜×‘×¢',
      'cs': 'Nastavenà­ MÄ›ny',
      'hu': 'Pénznem Beállà­tások',
      'ro': 'SetÄƒri ValutÄƒ',
      'uk': 'ÐÐ°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ Ð’Ð°Ð»ÑŽÑ‚Ð¸',
      'bg': 'ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð½Ð° Ð’Ð°Ð»ÑƒÑ‚Ð°',
      'hr': 'Postavke Valute',
      'sk': 'Nastavenia Meny',
      'sl': 'Nastavitve Valute'
    },
    'show_decimals': {
      'en': 'Show Decimals',
      'es': 'Mostrar Decimales',
      'fr': 'Afficher les Décimales',
      'de': 'Dezimalen Anzeigen',
      'it': 'Mostra Decimali',
      'pt': 'Mostrar Decimais',
      'ru': 'ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ð”ÐµÑÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ðµ',
      'ja': 'å°æ•°ç‚¹ã‚’è¡¨ç¤º',
      'zh': 'æ˜¾ç¤ºå°æ•°',
      'ko': 'ì†Œìˆ˜ì  í‘œì‹œ',
      'ar': 'Ø¹Ø±Ø¶ Ø§Ù„ÙƒØ³ÙˆØ± Ø§Ù„Ø¹Ø´Ø±ÙŠØ©',
      'hi': 'à¤¦à¤¶à¤®à¤²à¤µ à¤¦à¤¿à¤–à¤¾à¤à¤‚',
      'th': 'à¹à¸ªà¸”à¸‡à¸—à¸¨à¸™à¸´à¸¢à¸¡',
      'vi': 'Hiá»ƒn thá»‹ Sá»‘ Tháº­p phà¢n',
      'id': 'Tampilkan Desimal',
      'ms': 'Tunjuk Perpuluhan',
      'tl': 'Ipakita ang Decimals',
      'tr': 'OndalÄ±klarÄ± Gà¶ster',
      'pl': 'PokaÅ¼ UÅ‚amki DziesiÄ™tne',
      'nl': 'Decimalen Weergeven',
      'sv': 'Visa Decimaler',
      'no': 'Vis Desimaler',
      'da': 'Vis Decimaler',
      'fi': 'Nà¤ytà¤ Desimaalit',
      'el': 'Î•Î¼Ï†Î¬Î½Î¹ÏƒÎ· Î”ÎµÎºÎ±Î´Î¹ÎºÏŽÎ½',
      'he': '×”×¦×’ ×¢×©×¨×•× ×™×•×ª',
      'cs': 'Zobrazit Desetinná Mà­sta',
      'hu': 'Tizedesjegyek Megjelenà­tése',
      'ro': 'AfiÈ™are Zecimale',
      'uk': 'ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚Ð¸ Ð”ÐµÑÑÑ‚ÐºÐ¾Ð²Ñ–',
      'bg': 'ÐŸÐ¾ÐºÐ°Ð·Ð²Ð°Ð½Ðµ Ð½Ð° Ð´ÐµÑÐµÑ‚Ð¸Ñ‡Ð½Ð¸',
      'hr': 'PrikaÅ¾i Decimalne',
      'sk': 'ZobraziÅ¥ Desatinné Miesta',
      'sl': 'PrikaÅ¾i Decimalke'
    },
    'no': {
      'en': 'No',
      'es': 'No',
      'fr': 'Non',
      'de': 'Nein',
      'it': 'No',
      'pt': 'Não',
      'ru': 'ÐÐµÑ‚',
      'ja': 'ã„ã„ãˆ',
      'zh': 'å¦',
      'ko': 'ì•„ë‹ˆì˜¤',
      'ar': 'Ù„Ø§',
      'hi': 'à¤¨à¤¹à¥€à¤‚',
      'th': 'à¹„à¸¡à¹ˆ',
      'vi': 'Khà´ng',
      'id': 'Tidak',
      'ms': 'Tidak',
      'tl': 'Hindi',
      'tr': 'HayÄ±r',
      'pl': 'Nie',
      'nl': 'Nee',
      'sv': 'Nej',
      'no': 'Nei',
      'da': 'Nej',
      'fi': 'Ei',
      'el': 'ÎŒÏ‡Î¹',
      'he': '×œ×',
      'cs': 'Ne',
      'hu': 'Nem',
      'ro': 'Nu',
      'uk': 'ÐÑ–',
      'bg': 'ÐÐµ',
      'hr': 'Ne',
      'sk': 'Nie',
      'sl': 'Ne'
    },
    'yes': {
      'en': 'Yes',
      'es': 'Sà­',
      'fr': 'Oui',
      'de': 'Ja',
      'it': 'Sà¬',
      'pt': 'Sim',
      'ru': 'Ð”Ð°',
      'ja': 'ã¯ã„',
      'zh': 'æ˜¯',
      'ko': 'ì˜ˆ',
      'ar': 'Ù†Ø¹Ù…',
      'hi': 'à¤¹à¤¾à¤',
      'th': 'à¹ƒà¸Šà¹ˆ',
      'vi': 'Cà³',
      'id': 'Ya',
      'ms': 'Ya',
      'tl': 'Oo',
      'tr': 'Evet',
      'pl': 'Tak',
      'nl': 'Ja',
      'sv': 'Ja',
      'no': 'Ja',
      'da': 'Ja',
      'fi': 'Kyllà¤',
      'el': 'ÎÎ±Î¹',
      'he': '×›×Ÿ',
      'cs': 'Ano',
      'hu': 'Igen',
      'ro': 'Da',
      'uk': 'Ð¢Ð°Ðº',
      'bg': 'Ð”Ð°',
      'hr': 'Da',
      'sk': 'àno',
      'sl': 'Da'
    }
  }

  // Translation function
  const t = (key: string): string => {
    return translations[key]?.[invoiceData.language] || translations[key]?.['en'] || key
  }

  // Detect browser locale and set default language and currency
  React.useEffect(() => {
    // Get browser language with better fallback handling
    const browserLocales = navigator.languages || [navigator.language || 'en-US']
    const browserLocale = browserLocales[0] || 'en-US'
    
    // Try to find exact match first, then fallback to language code only match
    let detectedLanguage = languages.find(lang => lang.locale.toLowerCase() === browserLocale.toLowerCase()) || 
                          languages.find(lang => browserLocale.toLowerCase().startsWith(lang.code.toLowerCase())) || 
                          languages[0]
    
    // If still not found, try a more comprehensive matching with all browser locales
    if (detectedLanguage === languages[0]) {
      for (let i = 1; i < browserLocales.length; i++) {
        const locale = browserLocales[i]
        const exactMatch = languages.find(lang => lang.locale.toLowerCase() === locale.toLowerCase())
        const langMatch = languages.find(lang => locale.toLowerCase().startsWith(lang.code.toLowerCase()))
        
        if (exactMatch) {
          detectedLanguage = exactMatch
          break
        } else if (langMatch) {
          detectedLanguage = langMatch
          break
        }
      }
      
      // If still not found, try with just the language code
      if (detectedLanguage === languages[0]) {
        const langCode = browserLocale.split('-')[0]
        detectedLanguage = languages.find(lang => lang.code === langCode) || languages[0]
      }
    }
    
    // Map common locales to currencies
    const localeCurrencyMap: { [key: string]: string } = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'en-NZ': 'NZD',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'it-IT': 'EUR',
      'es-ES': 'EUR',
      'pt-BR': 'BRL',
      'pt-PT': 'EUR',
      'ja-JP': 'JPY',
      'zh-CN': 'CNY',
      'zh-TW': 'TWD',
      'ko-KR': 'KRW',
      'ru-RU': 'RUB',
      'hi-IN': 'INR',
      'th-TH': 'THB',
      'vi-VN': 'VND',
      'id-ID': 'IDR',
      'ms-MY': 'MYR',
      'tl-PH': 'PHP',
      'tr-TR': 'TRY',
      'pl-PL': 'PLN',
      'nl-NL': 'EUR',
      'sv-SE': 'SEK',
      'no-NO': 'NOK',
      'da-DK': 'DKK',
      'fi-FI': 'EUR',
      'el-GR': 'EUR',
      'he-IL': 'ILS',
      'cs-CZ': 'CZK',
      'hu-HU': 'HUF',
      'ro-RO': 'RON',
      'uk-UA': 'UAH',
      'bg-BG': 'BGN',
      'hr-HR': 'HRK',
      'sk-SK': 'EUR',
      'sl-SI': 'EUR',
      'ar-SA': 'SAR',
      'ar-AE': 'AED',
      'ar-EG': 'EGP'
    }
    
    // Try to detect currency based on locale
    let detectedCurrency = currencies.find(curr => curr.code === localeCurrencyMap[browserLocale])
    
    // If not found, try with other browser locales
    if (!detectedCurrency) {
      for (let i = 1; i < browserLocales.length; i++) {
        const locale = browserLocales[i]
        const currency = currencies.find(curr => curr.code === localeCurrencyMap[locale])
        if (currency) {
          detectedCurrency = currency
          break
        }
      }
    }
    
    // If not found, try with just the language code
    if (!detectedCurrency) {
      const localeParts = browserLocale.split('-')
      if (localeParts.length > 1) {
        const country = localeParts[1]
        // Map country codes to currencies
        const countryCurrencyMap: { [key: string]: string } = {
          'US': 'USD',
          'GB': 'GBP',
          'CA': 'CAD',
          'AU': 'AUD',
          'NZ': 'NZD',
          'FR': 'EUR',
          'DE': 'EUR',
          'IT': 'EUR',
          'ES': 'EUR',
          'BR': 'BRL',
          'PT': 'EUR',
          'JP': 'JPY',
          'CN': 'CNY',
          'TW': 'TWD',
          'KR': 'KRW',
          'RU': 'RUB',
          'IN': 'INR',
          'TH': 'THB',
          'VN': 'VND',
          'ID': 'IDR',
          'MY': 'MYR',
          'PH': 'PHP',
          'TR': 'TRY',
          'PL': 'PLN',
          'NL': 'EUR',
          'SE': 'SEK',
          'NO': 'NOK',
          'DK': 'DKK',
          'FI': 'EUR',
          'GR': 'EUR',
          'IL': 'ILS',
          'CZ': 'CZK',
          'HU': 'HUF',
          'RO': 'RON',
          'UA': 'UAH',
          'BG': 'BGN',
          'HR': 'HRK',
          'SK': 'EUR',
          'SI': 'EUR',
          'SA': 'SAR',
          'AE': 'AED',
          'EG': 'EGP'
        }
        detectedCurrency = currencies.find(curr => curr.code === countryCurrencyMap[country])
      }
    }
    
    // Fallback to USD if nothing found
    detectedCurrency = detectedCurrency || currencies[0]
    
    setInvoiceData(prev => ({
      ...prev,
      language: detectedLanguage.code,
      currency: detectedCurrency.code
    }))
  }, [])

  // Ensure fonts are loaded and applied
  useEffect(() => {
    if (typeof window !== 'undefined' && document.fonts) {
      // Force font loading by checking if fonts are loaded
      const loadFonts = async () => {
        try {
          await document.fonts.ready
          // Trigger a re-render to ensure fonts are applied
          setInvoiceSettings(prev => ({ ...prev, decimalPlaces: prev.decimalPlaces || 2 }))
        } catch (error) {
          console.log('Font loading error:', error)
        }
      }
      loadFonts()
    }
  }, [invoiceSettings.fontFamily])

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }))
  }

  const updateInvoiceSettings = (field: keyof InvoiceSettings, value: string) => {
    setInvoiceSettings(prev => ({ ...prev, [field]: value }))
  }

  const resetSettings = () => {
    setInvoiceSettings({
      // Font Settings
      fontFamily: 'Inter',
      fontSize: 'base',
      fontWeight: 'normal',
      
      // Color Settings
      backgroundColor: 'white',
      textColor: 'slate-900',
      accentColor: 'blue-600',
      
      // Layout Settings
      containerWidth: 'w-full',
      invoiceWidth: 'w-full max-w-4xl',
      invoiceHeight: 'min-h-screen',
      invoiceMargin: 'mx-auto',
      invoicePadding: 'p-8',
      
      // Border Settings
      borderWidth: 'border-2',
      borderColor: 'border-slate-200',
      borderRadius: 'rounded-lg',
      
      // Shadow Settings
      shadowSize: 'shadow-lg',
      
      // Alignment Settings
      headerAlignment: 'text-left',
      invoiceAlignment: 'text-left',
      
      // Decimal Settings
      decimalPlaces: 2
    })
  }

  const startEditingTitle = () => {
    setTempTitle(invoiceData.invoiceTitle)
    setIsEditingTitle(true)
  }

  const saveTitle = () => {
    if (tempTitle.trim()) {
      updateInvoiceData('invoiceTitle', tempTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const cancelEditingTitle = () => {
    setTempTitle('')
    setIsEditingTitle(false)
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    return currency ? currency.symbol : '$'
  }

  const formatCurrency = (amount: number) => {
    const symbol = getCurrencySymbol(invoiceData.currency)
    return `${symbol}${amount.toFixed(invoiceSettings.decimalPlaces)}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    // Format based on language
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    try {
      return date.toLocaleDateString(invoiceData.language === 'id' ? 'id-ID' : 'en-US', options)
    } catch (error) {
      // Fallback to simple format if locale fails
      return date.toLocaleDateString('en-US', options)
    }
  }

  // Helper functions to convert settings to CSS values
  const getFontSize = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
    return sizeMap[size] || '1rem'
  }

  const getFontFamily = (font: string) => {
    const fontMap: { [key: string]: string } = {
      'Inter': '"Inter", sans-serif',
      'Roboto': '"Roboto", sans-serif',
      'Open Sans': '"Open Sans", sans-serif',
      'Lato': '"Lato", sans-serif',
      'Montserrat': '"Montserrat", sans-serif',
      'Poppins': '"Poppins", sans-serif',
      'Playfair Display': '"Playfair Display", serif',
      'Merriweather': '"Merriweather", serif',
      'Ubuntu': '"Ubuntu", sans-serif',
      'Raleway': '"Raleway", sans-serif',
      'Georgia': 'Georgia, serif',
      'Arial': 'Arial, sans-serif',
      'Times New Roman': '"Times New Roman", serif',
      'Courier New': '"Courier New", monospace',
      'Verdana': 'Verdana, sans-serif'
    }
    return fontMap[font] || '"Inter", sans-serif'
  }

  const getTextColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'slate-900': '#0f172a',
      'slate-800': '#1e293b',
      'slate-700': '#334155',
      'slate-600': '#475569',
      'gray-900': '#111827',
      'gray-800': '#1f2937',
      'gray-700': '#374151',
      'gray-600': '#4b5563',
      'black': '#000000',
      'white': '#ffffff',
      'blue-900': '#1e3a8a',
      'green-900': '#14532d',
      'red-900': '#7f1d1d'
    }
    return colorMap[color] || '#0f172a'
  }

  const getBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'white': '#ffffff',
      'gray-50': '#f9fafb',
      'gray-100': '#f3f4f6',
      'slate-50': '#f8fafc',
      'blue-50': '#eff6ff',
      'green-50': '#f0fdf4',
      'yellow-50': '#fefce8',
      'red-50': '#fef2f2',
      'purple-50': '#faf5ff',
      'orange-50': '#fff7ed'
    }
    return colorMap[color] || '#ffffff'
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0
    }
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateTotalTax = () => {
    return invoiceData.taxes.reduce((sum, tax) => sum + (calculateSubtotal() * (tax.rate / 100)), 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax()
  }

  const addTax = () => {
    const taxCount = invoiceData.taxes.length
    
    const newTax: TaxItem = {
      id: Date.now().toString(),
      name: '', // Kosongkan nama pajak
      rate: 0 // Kosongkan rate pajak
    }
    setInvoiceData(prev => ({
      ...prev,
      taxes: [...prev.taxes, newTax]
    }))
    
    // Langsung mulai mode edit untuk pajak baru
    setEditingTaxIndex(taxCount)
  }

  const updateTax = (index: number, field: 'name' | 'rate', value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      taxes: prev.taxes.map((tax, i) => 
        i === index 
          ? { 
              ...tax, 
              [field]: field === 'rate' ? 
                (typeof value === 'string' ? 
                  // Parse and validate rate input - allow up to 2 decimal places, max 100
                  (() => {
                    const num = parseFloat(value)
                    if (isNaN(num)) return 0
                    // Round to 2 decimal places to prevent floating point issues
                    return Math.round(Math.min(100, Math.max(0, num)) * 100) / 100
                  })() 
                  : value
                ) : value 
            }
          : tax
      )
    }))
  }

  const handleTaxRateChange = (index: number, value: string) => {
    // Allow empty input, numbers, and single decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      updateTax(index, 'rate', value)
    }
  }

  const startEditingTax = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setEditingTaxIndex(index)
  }

  const stopEditingTax = () => {
    setEditingTaxIndex(null)
  }

  const cancelTaxEdit = () => {
    setEditingTaxIndex(null)
  }

  const removeTax = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      taxes: prev.taxes.filter((_, i) => i !== index)
    }))
    if (editingTaxIndex === index) {
      setEditingTaxIndex(null)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(invoiceData.language === 'id' ? 'Silakan pilih file gambar (JPG, PNG, GIF, dll.)' : 'Please select an image file (JPG, PNG, GIF, etc.)')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(invoiceData.language === 'id' ? 'Ukuran file gambar harus kurang dari 5MB' : 'Image file size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        updateInvoiceData('logoUrl', reader.result as string)
        console.log('Logo uploaded successfully')
      }
      reader.onerror = () => {
        alert(invoiceData.language === 'id' ? 'Gagal membaca file gambar. Silakan coba lagi.' : 'Failed to read the image file. Please try again.')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    updateInvoiceData('logoUrl', '')
  }

  const resetForm = () => {
    setInvoiceData({
      invoiceNumber: `INV-${Date.now()}`,
      invoiceTitle: 'INVOICE',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      showDueDate: true,
      logoUrl: '',
      fromName: '',
      fromEmail: '',
      fromAddress: '',
      toName: '',
      toEmail: '',
      toAddress: '',
      items: [
        { id: '1', description: '', quantity: 1, price: 0 }
      ],
      taxes: [
        { id: '1', name: 'TAX', rate: 10 }
      ],
      notes: '',
      currency: 'USD',
      language: 'en',
      showDecimals: false
    })
  }

  const loadSampleData = () => {
    setInvoiceData({
      invoiceNumber: `INV-${Date.now()}`,
      invoiceTitle: 'INVOICE',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      showDueDate: true,
      logoUrl: '',
      fromName: 'John Doe',
      fromEmail: 'john@example.com',
      fromAddress: '123 Main St\nNew York, NY 10001',
      toName: 'Acme Corporation',
      toEmail: 'billing@acme.com',
      toAddress: '456 Business Ave\nLos Angeles, CA 90001',
      items: [
        { id: '1', description: 'Web Design Services', quantity: 10, price: 150 },
        { id: '2', description: 'SEO Optimization', quantity: 1, price: 500 },
        { id: '3', description: 'Website Hosting (1 year)', quantity: 1, price: 299 }
      ],
      taxes: [
        { id: '1', name: 'TAX', rate: 10 }
      ],
      notes: t('payment_due_message'),
      currency: 'USD',
      language: 'en',
      showDecimals: false
    })
  }

  const generatePDF = async () => {
    // Validation
    if (!invoiceData.fromName || !invoiceData.toName) {
      alert(t('fill_required_fields'))
      return
    }

    // Filter valid items and check if there are any
    const validItems = invoiceData.items.filter(item => item.description.trim() && item.price > 0)
    if (validItems.length === 0) {
      alert('Please add at least one item with description and price greater than 0')
      return
    }

    setIsGenerating(true)
    try {
      // Prepare data with default values for missing fields
      const pdfData = {
        invoiceNumber: invoiceData.invoiceNumber || 'INV-001',
        invoiceTitle: invoiceData.invoiceTitle || 'INVOICE',
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || '',
        showDueDate: invoiceData.showDueDate !== undefined ? invoiceData.showDueDate : true, // Default to true to match initial state
        logoUrl: invoiceData.logoUrl || '',
        fromName: invoiceData.fromName || '',
        fromEmail: invoiceData.fromEmail || '',
        fromAddress: invoiceData.fromAddress || '',
        toName: invoiceData.toName || '',
        toEmail: invoiceData.toEmail || '',
        toAddress: invoiceData.toAddress || '',
        items: validItems,
        taxes: invoiceData.taxes || [],
        notes: invoiceData.notes || '',
        currency: invoiceData.currency || 'USD',
        language: invoiceData.language || 'en',
        showDecimals: invoiceData.showDecimals || false,
        settings: invoiceSettings // Include current settings for proper styling
      }

      console.log('Sending PDF data:', pdfData)

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('PDF response:', result)

      if (result.success) {
        // Create a new window with the HTML content for printing/saving
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(result.html)
          newWindow.document.close()
          
          // Add a success message
          console.log('PDF generated successfully!')
          
          // Add enhanced print styles to ensure background colors are printed only for invoice
          const enhancedPrintStyles = document.createElement('style')
          enhancedPrintStyles.textContent = `
            @media print {
              body {
                margin: 0;
                padding: 0;
                background: white !important;
              }
              .invoice-box {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .invoice-box * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `
          newWindow.document.head.appendChild(enhancedPrintStyles)
          
          // Wait a bit for the content to render before printing
          setTimeout(() => {
            newWindow.print()
          }, 500)
        } else {
          alert('Failed to open print window. Please allow pop-ups for this site.')
        }
      } else {
        console.error('PDF generation failed:', result.error)
        alert('Failed to generate PDF: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error generating PDF: ' + errorMessage + '. Please check your internet connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const printInvoice = async () => {
    // Validation
    if (!invoiceData.fromName || !invoiceData.toName) {
      alert(t('fill_required_fields'))
      return
    }

    // Filter valid items and check if there are any
    const validItems = invoiceData.items.filter(item => item.description.trim() && item.price > 0)
    if (validItems.length === 0) {
      alert('Please add at least one item with description and price greater than 0')
      return
    }

    setIsGenerating(true)
    try {
      // Prepare data with current settings
      const printData = {
        invoiceNumber: invoiceData.invoiceNumber || 'INV-001',
        invoiceTitle: invoiceData.invoiceTitle || 'INVOICE',
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || '',
        showDueDate: invoiceData.showDueDate !== undefined ? invoiceData.showDueDate : true, // Default to true to match initial state
        logoUrl: invoiceData.logoUrl || '',
        fromName: invoiceData.fromName || '',
        fromEmail: invoiceData.fromEmail || '',
        fromAddress: invoiceData.fromAddress || '',
        toName: invoiceData.toName || '',
        toEmail: invoiceData.toEmail || '',
        toAddress: invoiceData.toAddress || '',
        items: validItems,
        taxes: invoiceData.taxes || [],
        notes: invoiceData.notes || '',
        currency: invoiceData.currency || 'USD',
        language: invoiceData.language || 'en',
        showDecimals: invoiceData.showDecimals || false,
        settings: invoiceSettings // Include current settings for proper styling
      }

      console.log('Sending print data:', printData)

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Print response:', result)

      if (result.success) {
        // Create a new window with the HTML content for printing
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(result.html)
          newWindow.document.close()
          
          // Add enhanced print styles to ensure background colors are printed only for invoice
          const enhancedPrintStyles = document.createElement('style')
          enhancedPrintStyles.textContent = `
            @media print {
              body {
                margin: 0;
                padding: 0;
                background: white !important;
              }
              .invoice-box {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .invoice-box * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `
          newWindow.document.head.appendChild(enhancedPrintStyles)
          
          // Wait a bit for the content and styles to render before printing
          setTimeout(() => {
            newWindow.print()
          }, 1000)
        } else {
          alert('Failed to open print window. Please allow pop-ups for this site.')
        }
      } else {
        console.error('Print generation failed:', result.error)
        alert('Failed to generate print preview: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error generating print preview:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error generating print preview: ' + errorMessage + '. Please check your internet connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">{t('invoice_generator')}</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <Select value={invoiceData.language} onValueChange={(value) => updateInvoiceData('language', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className={`flag ${lang.flag}`}></span> {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">{t('help')}</Button>
              <Button variant="outline" size="sm">{t('templates')}</Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Masuk
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Daftar
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Select value={invoiceData.language} onValueChange={(value) => updateInvoiceData('language', value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className={`flag ${lang.flag}`}></span> {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                {t('help')}
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                {t('templates')}
              </Button>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="px-2">
                <Label className="text-sm font-medium mb-2 block">{t('language')}</Label>
                <Select value={invoiceData.language} onValueChange={(value) => updateInvoiceData('language', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className={`flag ${lang.flag}`}></span> {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50" size="sm">
                  Masuk
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invoice Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Invoice Form */}
          <div className={`${isSettingsOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300 ease-in-out`}>
            <div className={`${isSettingsOpen ? '' : 'max-w-4xl mx-auto'}`}>
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
                <Button onClick={loadSampleData} variant="outline" size="sm">
                  {t('load_sample_data')}
                </Button>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('reset')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4" />
                  {t('settings')}
                </Button>
              </div>

              {/* Invoice Card */}
              <div className={`invoice-print ${invoiceSettings.borderRadius} ${invoiceSettings.borderWidth} ${invoiceSettings.shadowSize} ${invoiceSettings.invoicePadding} ${invoiceSettings.borderColor} border transition-all duration-300 ease-in-out overflow-x-auto`}
                   style={{ 
                     fontFamily: getFontFamily(invoiceSettings.fontFamily),
                     fontSize: getFontSize(invoiceSettings.fontSize)
                   }}>
                <div className={`invoice-box ${invoiceSettings.backgroundColor} ${invoiceSettings.borderRadius} ${invoiceSettings.borderWidth} ${invoiceSettings.shadowSize} ${invoiceSettings.invoicePadding} ${invoiceSettings.borderColor} border transition-all duration-300 ease-in-out min-w-[320px]`}
                     style={{ 
                       backgroundColor: getBackgroundColor(invoiceSettings.backgroundColor),
                       color: getTextColor(invoiceSettings.textColor)
                     }}>
                <div className={`${invoiceSettings.headerAlignment} ${invoiceSettings.invoiceAlignment} transition-all duration-300 ease-in-out`}>
                {/* Invoice Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6 lg:mb-8">
                  {/* Left Column - Logo, Title, Invoice Number, and From Info */}
                  <div className="space-y-6">
                    {/* Logo and Title Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                      {/* Logo Upload Section */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        {invoiceData.logoUrl ? (
                          <div className="relative group">
                            <img
                              src={invoiceData.logoUrl}
                              alt="Company Logo"
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain border border-gray-200 rounded-lg p-2 sm:p-3 bg-white shadow-sm"
                            />
                            <button
                              onClick={removeLogo}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        ) : (
                          <label 
                            htmlFor="logo-upload"
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 hidden sm:block">{t('logo')}</span>
                            <span className="text-xs text-gray-500 sm:hidden">Logo</span>
                          </label>
                        )}
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="mt-2 text-xs text-blue-600 hover:text-blue-700 cursor-pointer text-center"
                        >
                          {invoiceData.logoUrl ? t('change_logo') : t('upload_logo')}
                        </label>
                      </div>

                      {/* Invoice Title */}
                      <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                          {isEditingTitle ? (
                            <div className="flex items-center gap-2 flex-1 w-full">
                              <Input
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold flex-1"
                                placeholder={t('invoice_title_placeholder')}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    saveTitle()
                                  } else if (e.key === 'Escape') {
                                    cancelEditingTitle()
                                  }
                                }}
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                              />
                              <Button
                                onClick={saveTitle}
                                size="sm"
                                className="flex-shrink-0 bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEditingTitle}
                                size="sm"
                                variant="outline"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <h2 
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate"
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                              >
                                {invoiceData.invoiceTitle}
                              </h2>
                              <Button
                                onClick={startEditingTitle}
                                size="sm"
                                variant="outline"
                                className="opacity-60 hover:opacity-100 flex-shrink-0"
                              >
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="invoiceNumber" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{getDocumentLabel('number')}</Label>
                            <Input
                              id="invoiceNumber"
                              value={invoiceData.invoiceNumber}
                              onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                              className="w-full sm:w-48 mt-1 transition-all duration-300 ease-in-out"
                              style={{ 
                                fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                fontSize: getFontSize(invoiceSettings.fontSize),
                                color: getTextColor(invoiceSettings.textColor)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* From Info */}
                    <div className="space-y-4">
                      <div className="pt-4">
                        <Label htmlFor="fromName" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('your_name_company')}</Label>
                        <Input
                          id="fromName"
                          value={invoiceData.fromName}
                          onChange={(e) => updateInvoiceData('fromName', e.target.value)}
                          placeholder={t('your_name_company')}
                          className="font-semibold mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromEmail" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('email')}</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={invoiceData.fromEmail}
                          onChange={(e) => updateInvoiceData('fromEmail', e.target.value)}
                          placeholder={t('email')}
                          className="mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromAddress" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('address')}</Label>
                        <Textarea
                          id="fromAddress"
                          value={invoiceData.fromAddress}
                          onChange={(e) => updateInvoiceData('fromAddress', e.target.value)}
                          placeholder={t('address')}
                          rows={3}
                          className="mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Dates and Client Info */}
                  <div className="space-y-8">
                    {/* Dates Section - Positioned at the top of right column */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-medium text-gray-700">{getDocumentLabel('date')}</Label>
                        <Input
                          id="date"
                          type="date"
                          value={invoiceData.date}
                          onChange={(e) => updateInvoiceData('date', e.target.value)}
                          className="w-full mt-1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="showDueDate" className="text-sm font-medium text-gray-700">{t('show_due_date')}</Label>
                          <input
                            type="checkbox"
                            id="showDueDate"
                            checked={invoiceData.showDueDate}
                            onChange={(e) => updateInvoiceData('showDueDate', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        {invoiceData.showDueDate && (
                          <div>
                            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">{getDocumentLabel('due_date')}</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={invoiceData.dueDate}
                              onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
                              className="w-full mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Client Info - Positioned below dates with additional spacing */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <div>
                        <Label htmlFor="toName" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('client_name')}</Label>
                        <Input
                          id="toName"
                          value={invoiceData.toName}
                          onChange={(e) => updateInvoiceData('toName', e.target.value)}
                          placeholder={t('client_name')}
                          className="font-semibold mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="toEmail" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('email')}</Label>
                        <Input
                          id="toEmail"
                          type="email"
                          value={invoiceData.toEmail}
                          onChange={(e) => updateInvoiceData('toEmail', e.target.value)}
                          placeholder={t('email')}
                          className="mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="toAddress" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('address')}</Label>
                        <Textarea
                          id="toAddress"
                          value={invoiceData.toAddress}
                          onChange={(e) => updateInvoiceData('toAddress', e.target.value)}
                          placeholder={t('address')}
                          rows={3}
                          className="mt-1 transition-all duration-300 ease-in-out"
                          style={{ 
                            fontFamily: getFontFamily(invoiceSettings.fontFamily),
                            fontSize: getFontSize(invoiceSettings.fontSize),
                            color: getTextColor(invoiceSettings.textColor)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('items')}</h3>
                    <div className="flex items-center gap-3">
                      <Select value={invoiceData.currency} onValueChange={(value) => updateInvoiceData('currency', value)}>
                        <SelectTrigger className="w-32" style={{ fontFamily: getFontFamily(invoiceSettings.fontFamily) }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addItem} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('add_item')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className={`border ${invoiceSettings.borderColor} ${invoiceSettings.borderRadius} overflow-x-auto`}>
                    <table className="w-full min-w-[320px] sm:min-w-[500px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('description')}</th>
                          <th className="text-center p-2 sm:p-4 text-xs sm:text-sm font-medium w-16 sm:w-24" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('quantity')}</th>
                          <th className="text-right p-2 sm:p-4 text-xs sm:text-sm font-medium w-24 sm:w-32" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('price')} ({getCurrencySymbol(invoiceData.currency)})</th>
                          <th className="text-right p-2 sm:p-4 text-xs sm:text-sm font-medium w-24 sm:w-32 hidden sm:table-cell" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('total')} ({getCurrencySymbol(invoiceData.currency)})</th>
                          <th className="text-center p-2 sm:p-4 text-xs sm:text-sm font-medium w-12 sm:w-16" style={{ color: getTextColor(invoiceSettings.textColor) }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, index) => (
                          <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2 sm:p-4">
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder={t('description')}
                                className="border-none shadow-none p-0 h-auto focus-visible:ring-0 transition-all duration-300 ease-in-out text-sm"
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  fontSize: getFontSize(invoiceSettings.fontSize),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                              />
                            </td>
                            <td className="p-2 sm:p-4">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="border-none shadow-none p-0 h-auto text-center focus-visible:ring-0 transition-all duration-300 ease-in-out text-sm"
                                min="1"
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  fontSize: getFontSize(invoiceSettings.fontSize),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                              />
                            </td>
                            <td className="p-2 sm:p-4">
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                className="border-none shadow-none p-0 h-auto text-right focus-visible:ring-0 transition-all duration-300 ease-in-out text-sm"
                                min="0"
                                step="0.01"
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  fontSize: getFontSize(invoiceSettings.fontSize),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                              />
                            </td>
                            <td className="p-2 sm:p-4 text-right font-medium text-sm hidden sm:table-cell" style={{ color: getTextColor(invoiceSettings.textColor) }}>
                              {formatCurrency(item.quantity * item.price)}
                            </td>
                            <td className="p-2 sm:p-4 text-center">
                              {invoiceData.items.length > 1 && (
                                <Button
                                  onClick={() => removeItem(item.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}
                              {/* Mobile total display */}
                              <div className="sm:hidden text-right font-medium text-xs mt-1" style={{ color: getTextColor(invoiceSettings.textColor) }}>
                                {formatCurrency(item.quantity * item.price)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Section - Inside Invoice Box */}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <div className="w-full max-w-xs">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('subtotal')}:</span>
                        <span className="font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      
                      {invoiceData.taxes.length === 0 ? (
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={addTax}
                              className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              style={{ 
                                fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                fontSize: getFontSize(invoiceSettings.fontSize)
                              }}
                              title="Tambah pajak"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <span style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('tax_rate')}:</span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm" style={{ color: getTextColor(invoiceSettings.textColor) }}>0%</span>
                        </div>
                      ) : (
                        invoiceData.taxes.map((tax, index) => (
                        <div key={index} className="flex justify-between items-center text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2 flex-1">
                            {index === 0 && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={addTax}
                                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Tambah pajak"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingTax(index)}
                                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Edit pajak"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            {index > 0 && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingTax(index)}
                                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Edit pajak"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTax(index)}
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Hapus pajak"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            {editingTaxIndex === index ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Input
                                  type="text"
                                  value={tax.name}
                                  onChange={(e) => updateTax(index, 'name', e.target.value)}
                                  className="w-20 sm:w-24 h-6 sm:h-8 border border-blue-300 shadow-none p-1 focus-visible:ring-0 focus:border-blue-500 transition-all duration-300 ease-in-out text-xs sm:text-sm"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize),
                                    color: getTextColor(invoiceSettings.textColor)
                                  }}
                                  placeholder="Nama pajak"
                                  autoFocus
                                />
                                <Input
                                  type="number"
                                  value={tax.rate}
                                  onChange={(e) => updateTax(index, 'rate', e.target.value)}
                                  className="w-12 sm:w-16 h-6 sm:h-8 text-right border border-blue-300 shadow-none p-1 focus-visible:ring-0 focus:border-blue-500 transition-all duration-300 ease-in-out text-xs sm:text-sm"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize),
                                    color: getTextColor(invoiceSettings.textColor)
                                  }}
                                  placeholder="%"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={stopEditingTax}
                                  className="h-4 w-4 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Selesai edit"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelTaxEdit}
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  style={{ 
                                    fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                    fontSize: getFontSize(invoiceSettings.fontSize)
                                  }}
                                  title="Batal edit"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <span 
                                className="font-medium text-xs sm:text-sm cursor-pointer hover:text-blue-600 transition-colors"
                                style={{ 
                                  fontFamily: getFontFamily(invoiceSettings.fontFamily),
                                  fontSize: getFontSize(invoiceSettings.fontSize),
                                  color: getTextColor(invoiceSettings.textColor)
                                }}
                                onClick={() => startEditingTax(index)}
                                title="Klik untuk edit pajak"
                              >
                                {tax.name || 'Pajak'} ({tax.rate}%)
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-xs sm:text-sm" style={{ color: getTextColor(invoiceSettings.textColor) }}>{formatCurrency(calculateSubtotal() * (tax.rate / 100))}</span>
                        </div>
                        ))
                      )}
                      <Separator />
                      <div className="flex justify-between text-base sm:text-lg font-bold">
                        <span style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('total')}:</span>
                        <span style={{ color: getTextColor(invoiceSettings.textColor) }}>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section - Moved to bottom of invoice */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium" style={{ color: getTextColor(invoiceSettings.textColor) }}>{t('notes')}</Label>
                    <Textarea
                      id="notes"
                      value={invoiceData.notes}
                      onChange={(e) => updateInvoiceData('notes', e.target.value)}
                      placeholder={t('notes_placeholder')}
                      rows={3}
                      className="mt-1 transition-all duration-300 ease-in-out text-sm"
                      style={{ 
                        fontFamily: getFontFamily(invoiceSettings.fontFamily),
                        fontSize: getFontSize(invoiceSettings.fontSize),
                        color: getTextColor(invoiceSettings.textColor)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings Panel */}
          {isSettingsOpen && (
            <div className="hidden lg:block lg:col-span-5 transition-all duration-300 ease-in-out">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">{t('settings')}</h2>
                  <Button onClick={() => setIsSettingsOpen(false)} size="sm" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              <div className="space-y-4">
                {/* Font Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('font_settings')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Font Family</Label>
                      <Select value={invoiceSettings.fontFamily} onValueChange={(value) => updateInvoiceSettings('fontFamily', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          <SelectItem value="Merriweather">Merriweather</SelectItem>
                          <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                          <SelectItem value="Raleway">Raleway</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Font Size</Label>
                      <Select value={invoiceSettings.fontSize} onValueChange={(value) => updateInvoiceSettings('fontSize', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">Extra Small</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="base">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                          <SelectItem value="2xl">2X Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Color Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('color_settings')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Background Color</Label>
                      <Select value={invoiceSettings.backgroundColor} onValueChange={(value) => updateInvoiceSettings('backgroundColor', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="gray-50">Gray 50</SelectItem>
                          <SelectItem value="gray-100">Gray 100</SelectItem>
                          <SelectItem value="slate-50">Slate 50</SelectItem>
                          <SelectItem value="blue-50">Blue 50</SelectItem>
                          <SelectItem value="green-50">Green 50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Text Color</Label>
                      <Select value={invoiceSettings.textColor} onValueChange={(value) => updateInvoiceSettings('textColor', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slate-900">Slate 900</SelectItem>
                          <SelectItem value="slate-800">Slate 800</SelectItem>
                          <SelectItem value="slate-700">Slate 700</SelectItem>
                          <SelectItem value="gray-900">Gray 900</SelectItem>
                          <SelectItem value="gray-800">Gray 800</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Border Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('border_settings')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Border Width</Label>
                      <Select value={invoiceSettings.borderWidth} onValueChange={(value) => updateInvoiceSettings('borderWidth', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="border-0">None</SelectItem>
                          <SelectItem value="border">1px</SelectItem>
                          <SelectItem value="border-2">2px</SelectItem>
                          <SelectItem value="border-4">4px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Border Radius</Label>
                      <Select value={invoiceSettings.borderRadius} onValueChange={(value) => updateInvoiceSettings('borderRadius', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded-none">None</SelectItem>
                          <SelectItem value="rounded">Small</SelectItem>
                          <SelectItem value="rounded-lg">Medium</SelectItem>
                          <SelectItem value="rounded-xl">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Shadow Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('shadow_settings')}</h3>
                  <div>
                    <Label className="text-xs text-gray-600">Shadow Size</Label>
                    <Select value={invoiceSettings.shadowSize} onValueChange={(value) => updateInvoiceSettings('shadowSize', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadow-none">None</SelectItem>
                        <SelectItem value="shadow-sm">Small</SelectItem>
                        <SelectItem value="shadow">Medium</SelectItem>
                        <SelectItem value="shadow-lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Alignment Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Alignment Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Header Alignment</Label>
                      <Select value={invoiceSettings.headerAlignment} onValueChange={(value) => updateInvoiceSettings('headerAlignment', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-left">Left</SelectItem>
                          <SelectItem value="text-center">Center</SelectItem>
                          <SelectItem value="text-right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Content Alignment</Label>
                      <Select value={invoiceSettings.invoiceAlignment} onValueChange={(value) => updateInvoiceSettings('invoiceAlignment', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-left">Left</SelectItem>
                          <SelectItem value="text-center">Center</SelectItem>
                          <SelectItem value="text-right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetSettings}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Default Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

    {/* Download PDF Section */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600 mb-2">{t('tax_calculated_automatically')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                onClick={printInvoice} 
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 mr-2" />
                {isGenerating ? t('generating') : t('print')}
              </Button>
              <Button 
                onClick={generatePDF} 
                disabled={isGenerating}
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {t('download_pdf')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Features Grid */}
    <section className="mt-8 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('powerful_features')}</h2>
          <p className="text-base sm:text-lg text-gray-600">{t('powerful_features')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="bg-blue-100 rounded-lg p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <img src="/logo.png" alt="Professional Design" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('professional_design')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{t('clean_modern_templates')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="bg-green-100 rounded-lg p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('instant_pdf_download')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{t('download_high_quality_pdfs')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="bg-purple-100 rounded-lg p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('customizable')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{t('add_branding_logo')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="bg-orange-100 rounded-lg p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('fast_simple')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{t('create_invoices_minutes')}</p>
          </div>
        </div>
      </div>
    </section>
  
  {/* Footer */}
  <footer className="bg-gray-900 text-white mt-12 sm:mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <div className="flex items-center mb-3 sm:mb-4">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            <h3 className="text-base sm:text-lg font-bold">{t('footer_invoice_generator')}</h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {t('footer_description')}
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer_product')}</h4>
          <ul className="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
            <li><a href="/features" className="hover:text-white">{t('footer_features')}</a></li>
            <li><a href="/templates" className="hover:text-white">{t('footer_templates')}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer_support')}</h4>
          <ul className="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
            <li><a href="/help-center" className="hover:text-white">{t('footer_help_center')}</a></li>
            <li><a href="/contact" className="hover:text-white">{t('footer_contact')}</a></li>
            <li><a href="/faq" className="hover:text-white">{t('footer_faq')}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer_company')}</h4>
          <ul className="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
            <li><a href="/about" className="hover:text-white">{t('footer_about')}</a></li>
            <li><a href="/blog" className="hover:text-white">{t('footer_blog')}</a></li>
            <li><a href="/privacy" className="hover:text-white">{t('footer_privacy')}</a></li>
            <li><a href="/terms" className="hover:text-white">{t('footer_terms')}</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
        <p>{t('footer_copyright')}</p>
      </div>
    </div>
  </footer>
</main>
    </div>
  )
}
