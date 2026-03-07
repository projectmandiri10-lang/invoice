import type { Locale } from '@/lib/i18n';

type DuitkuPaymentMethod = {
  paymentMethod: string;
  paymentName: string;
  paymentImage?: string;
  totalFee?: string;
};

export type DuitkuPaymentCategory = 'qris' | 'ewallet' | 'retail' | 'va' | 'other';

const QRIS_CODES = new Set(['SP', 'NQ', 'GQ', 'SQ', 'DQ', 'QR']);
const EWALLET_CODES = new Set(['OV', 'SA', 'DA', 'LA', 'LF', 'SL', 'OL']);
const RETAIL_CODES = new Set(['FT', 'IR']);
const VA_CODES = new Set(['VA', 'A1', 'AG', 'B1', 'BR', 'BT', 'BV', 'DM', 'I1', 'M2', 'NC', 'S1']);

const CATEGORY_PRIORITY: Record<DuitkuPaymentCategory, number> = {
  qris: 0,
  ewallet: 1,
  retail: 2,
  va: 3,
  other: 4,
};

const CATEGORY_LABELS: Record<Locale, Record<DuitkuPaymentCategory, string>> = {
  en: {
    qris: 'QRIS',
    ewallet: 'E-Wallet',
    retail: 'Retail',
    va: 'Virtual Account',
    other: 'Other',
  },
  id: {
    qris: 'QRIS',
    ewallet: 'E-Wallet',
    retail: 'Retail',
    va: 'Virtual Account',
    other: 'Lainnya',
  },
};

export function getDuitkuPaymentCategory(method: Pick<DuitkuPaymentMethod, 'paymentMethod' | 'paymentName'>): DuitkuPaymentCategory {
  const code = method.paymentMethod?.trim().toUpperCase();
  const name = method.paymentName?.trim().toUpperCase() || '';

  if (QRIS_CODES.has(code) || name.includes('QRIS')) return 'qris';
  if (
    EWALLET_CODES.has(code) ||
    name.includes('OVO') ||
    name.includes('SHOPEE') ||
    name.includes('DANA') ||
    name.includes('LINKAJA') ||
    name.includes('LINK AJA')
  ) {
    return 'ewallet';
  }
  if (RETAIL_CODES.has(code) || name.includes('RETAIL') || name.includes('ALFAMART') || name.includes('INDOMARET')) {
    return 'retail';
  }
  if (VA_CODES.has(code) || name.includes(' VA')) return 'va';
  return 'other';
}

export function sortDuitkuPaymentMethods<T extends DuitkuPaymentMethod>(methods: T[]): T[] {
  return [...methods].sort((left, right) => {
    const leftCategory = getDuitkuPaymentCategory(left);
    const rightCategory = getDuitkuPaymentCategory(right);
    const categoryDiff = CATEGORY_PRIORITY[leftCategory] - CATEGORY_PRIORITY[rightCategory];
    if (categoryDiff !== 0) return categoryDiff;
    return left.paymentName.localeCompare(right.paymentName);
  });
}

export function getDuitkuPaymentCategoryLabel(category: DuitkuPaymentCategory, locale: Locale): string {
  return CATEGORY_LABELS[locale][category];
}
