import { createHash } from 'node:crypto';
import { DuitkuEnvironment, requireEnv } from './env.ts';

export type DuitkuPaymentFee = {
  paymentMethod: string;
  paymentName: string;
  paymentImage?: string;
  totalFee?: string;
  feeCustomer?: string;
  feeMerchant?: string;
};

export type DuitkuGetPaymentMethodResponse = {
  paymentFee?: DuitkuPaymentFee[];
  responseCode?: string;
  responseMessage?: string;
};

export type DuitkuInquiryResponse = {
  merchantCode?: string;
  merchantOrderId?: string;
  paymentAmount?: string | number;
  productDetails?: string;
  additionalParam?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  signature?: string;
  reference?: string;
  statusCode?: string;
  statusMessage?: string;
};

export type DuitkuTransactionStatusResponse = {
  merchantOrderId?: string;
  reference?: string;
  amount?: string;
  fee?: string;
  statusCode?: string; // 00 success, 01 pending, 02 canceled
  statusMessage?: string;
};

export function getDuitkuBaseUrl(env: DuitkuEnvironment): string {
  return env === 'production'
    ? 'https://passport.duitku.com/webapi/api'
    : 'https://sandbox.duitku.com/webapi/api';
}

function md5Hex(value: string): string {
  return createHash('md5').update(value).digest('hex');
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function formatDuitkuDatetime(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function createInquirySignature(params: {
  merchantCode: string;
  merchantOrderId: string;
  paymentAmount: string;
  apiKey: string;
}): string {
  return md5Hex(params.merchantCode + params.merchantOrderId + params.paymentAmount + params.apiKey);
}

export function createCallbackSignature(params: {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  apiKey: string;
}): string {
  return md5Hex(params.merchantCode + params.amount + params.merchantOrderId + params.apiKey);
}

export function createTransactionStatusSignature(params: {
  merchantCode: string;
  merchantOrderId: string;
  apiKey: string;
}): string {
  return md5Hex(params.merchantCode + params.merchantOrderId + params.apiKey);
}

export function createPaymentMethodSignature(params: {
  merchantCode: string;
  amount: string;
  datetime: string;
  apiKey: string;
}): string {
  return sha256Hex(params.merchantCode + params.amount + params.datetime + params.apiKey);
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`DUITKU_HTTP_${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`DUITKU_BAD_JSON: ${text}`);
  }
}

export async function duitkuGetPaymentMethods(env: DuitkuEnvironment, amountIdr: number) {
  const merchantCode = requireEnv('DUITKU_MERCHANT_CODE');
  const apiKey = requireEnv('DUITKU_API_KEY');

  const datetime = formatDuitkuDatetime(new Date());
  const amount = String(Math.trunc(amountIdr));
  const signature = createPaymentMethodSignature({ merchantCode, amount, datetime, apiKey });

  const url = `${getDuitkuBaseUrl(env)}/merchant/paymentmethod/getpaymentmethod`;
  const body = {
    merchantCode,
    merchantcode: merchantCode,
    amount,
    datetime,
    signature,
  };

  const data = await postJson<DuitkuGetPaymentMethodResponse>(url, body);
  if (data.responseCode && data.responseCode !== '00') {
    throw new Error(`DUITKU_PAYMENT_METHOD_ERROR: ${data.responseCode} ${data.responseMessage || ''}`.trim());
  }
  return data;
}

export async function duitkuCreateInquiry(env: DuitkuEnvironment, input: {
  merchantOrderId: string;
  paymentAmount: number;
  paymentMethod: string;
  productDetails: string;
  callbackUrl: string;
  returnUrl: string;
  expiryPeriodMinutes: number;
  additionalParam?: string;
  email?: string;
  phoneNumber?: string;
  customerVaName?: string;
}) {
  const merchantCode = requireEnv('DUITKU_MERCHANT_CODE');
  const apiKey = requireEnv('DUITKU_API_KEY');

  const paymentAmount = String(Math.trunc(input.paymentAmount));
  const signature = createInquirySignature({
    merchantCode,
    merchantOrderId: input.merchantOrderId,
    paymentAmount,
    apiKey,
  });

  const url = `${getDuitkuBaseUrl(env)}/merchant/v2/inquiry`;
  const body: Record<string, unknown> = {
    merchantCode,
    merchantcode: merchantCode,
    paymentAmount: Number(paymentAmount),
    paymentMethod: input.paymentMethod,
    merchantOrderId: input.merchantOrderId,
    productDetails: input.productDetails,
    additionalParam: input.additionalParam || '',
    email: input.email || '',
    phoneNumber: input.phoneNumber || '',
    customerVaName: input.customerVaName || '',
    callbackUrl: input.callbackUrl,
    returnUrl: input.returnUrl,
    expiryPeriod: input.expiryPeriodMinutes,
    signature,
  };

  const data = await postJson<DuitkuInquiryResponse>(url, body);
  if (data.statusCode && data.statusCode !== '00') {
    throw new Error(`DUITKU_INQUIRY_ERROR: ${data.statusCode} ${data.statusMessage || ''}`.trim());
  }

  if (!data.paymentUrl || !data.reference) {
    throw new Error('DUITKU_INQUIRY_MISSING_FIELDS');
  }
  return data;
}

export async function duitkuTransactionStatus(env: DuitkuEnvironment, merchantOrderId: string) {
  const merchantCode = requireEnv('DUITKU_MERCHANT_CODE');
  const apiKey = requireEnv('DUITKU_API_KEY');
  const signature = createTransactionStatusSignature({ merchantCode, merchantOrderId, apiKey });

  const url = `${getDuitkuBaseUrl(env)}/merchant/transactionStatus`;
  const body = {
    merchantCode,
    merchantcode: merchantCode,
    merchantOrderId,
    signature,
  };

  const data = await postJson<DuitkuTransactionStatusResponse>(url, body);
  return data;
}

