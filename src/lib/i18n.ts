export type Locale = 'en' | 'id';
export type DocumentTypeKey = 'invoice' | 'surat_jalan' | 'kwitansi';

export const LOCALE_STORAGE_KEY = 'idcashier_locale_v1';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'id'];

const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-US',
  id: 'id-ID',
};

const PLAN_LABELS = {
  en: {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
  },
  id: {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
  },
} as const;

const LANGUAGE_LABELS = {
  en: {
    en: 'English',
    id: 'Bahasa Indonesia',
  },
  id: {
    en: 'English',
    id: 'Bahasa Indonesia',
  },
} as const;

const DOCUMENT_LABELS = {
  en: {
    invoice: 'Invoice',
    surat_jalan: 'Delivery Note',
    kwitansi: 'Receipt',
  },
  id: {
    invoice: 'Invoice',
    surat_jalan: 'Surat Jalan',
    kwitansi: 'Kwitansi',
  },
} as const;

export type AppPlan = 'free' | 'starter' | 'pro';
export type BillingPlanCode = 'starter_month' | 'starter_year' | 'pro_month' | 'pro_year';

export const BILLING_PLAN_AMOUNTS: Record<BillingPlanCode, number> = {
  starter_month: 100000,
  starter_year: 1000000,
  pro_month: 150000,
  pro_year: 1500000,
};

export const DOCUMENT_LIMITS: Record<AppPlan, number | null> = {
  free: 3,
  starter: 100,
  pro: null,
};

export const CLIENT_LIMITS: Record<AppPlan, number | null> = {
  free: 3,
  starter: 25,
  pro: null,
};

function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'id';
}

export function detectLocaleFromNavigator(): Locale {
  if (typeof navigator === 'undefined') return 'en';

  const candidates = [...(navigator.languages || []), navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    if (normalized.startsWith('id')) return 'id';
    if (normalized.startsWith('en')) return 'en';
  }

  return 'en';
}

export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isSupportedLocale(stored) ? stored : null;
}

export function resolveInitialLocale(): Locale {
  return getStoredLocale() || detectLocaleFromNavigator();
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function getLocaleTag(locale: Locale = resolveInitialLocale()): string {
  return LOCALE_TAGS[locale];
}

export function formatCurrency(amount: number, showDecimals = false, locale: Locale = resolveInitialLocale()): string {
  const numeric = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat(getLocaleTag(locale), {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numeric);

  return `Rp ${formatted}`;
}

export function formatDate(date: string, locale: Locale = resolveInitialLocale()): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function formatDateTime(date: string, locale: Locale = resolveInitialLocale()): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function numberToWordsId(num: number): string {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];

  if (num === 0) return 'nol';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return tens[ten] + (unit > 0 ? ` ${units[unit]}` : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredWord = hundred === 1 ? 'seratus' : `${units[hundred]} ratus`;
    return hundredWord + (remainder > 0 ? ` ${numberToWordsId(remainder)}` : '');
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandWord = thousand === 1 ? 'seribu' : `${numberToWordsId(thousand)} ribu`;
    return thousandWord + (remainder > 0 ? ` ${numberToWordsId(remainder)}` : '');
  }
  if (num < 1000000000) {
    const million = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return `${numberToWordsId(million)} juta` + (remainder > 0 ? ` ${numberToWordsId(remainder)}` : '');
  }

  return String(num);
}

function numberToWordsEn(num: number): string {
  const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return tens[ten] + (unit > 0 ? `-${units[unit]}` : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return `${units[hundred]} hundred` + (remainder > 0 ? ` ${numberToWordsEn(remainder)}` : '');
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return `${numberToWordsEn(thousand)} thousand` + (remainder > 0 ? ` ${numberToWordsEn(remainder)}` : '');
  }
  if (num < 1000000000) {
    const million = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return `${numberToWordsEn(million)} million` + (remainder > 0 ? ` ${numberToWordsEn(remainder)}` : '');
  }

  return String(num);
}

export function numberToWords(num: number, locale: Locale = resolveInitialLocale()): string {
  const value = Math.max(0, Math.round(num));
  return locale === 'id' ? numberToWordsId(value) : numberToWordsEn(value);
}

export function getMoneyWordsSuffix(locale: Locale): string {
  return locale === 'id' ? 'rupiah' : 'rupiah';
}

export function getPlanLabel(plan: AppPlan, locale: Locale): string {
  return PLAN_LABELS[locale][plan];
}

export function getLanguageLabel(value: Locale, locale: Locale): string {
  return LANGUAGE_LABELS[locale][value];
}

export function getDocumentTypeLabel(type: DocumentTypeKey, locale: Locale): string {
  return DOCUMENT_LABELS[locale][type];
}

export function getBillingPlanLabel(code: BillingPlanCode, locale: Locale): string {
  const amount = formatCurrency(BILLING_PLAN_AMOUNTS[code], false, locale);
  const plan = code.startsWith('starter') ? getPlanLabel('starter', locale) : getPlanLabel('pro', locale);
  const interval = code.endsWith('month')
    ? locale === 'id'
      ? 'Bulanan'
      : 'Monthly'
    : locale === 'id'
      ? 'Tahunan'
      : 'Yearly';

  return `${plan} • ${interval} (${amount})`;
}

export function getIntervalPriceLabel(amount: number, interval: 'month' | 'year', locale: Locale): string {
  const suffix =
    interval === 'month'
      ? locale === 'id'
        ? '/bulan'
        : '/month'
      : locale === 'id'
        ? '/tahun'
        : '/year';

  return `${formatCurrency(amount, false, locale)}${suffix}`;
}
