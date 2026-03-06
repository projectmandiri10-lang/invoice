import React, { useState } from 'react';
import { Settings, Upload, Palette, Type, Layout, Eye, EyeOff } from 'lucide-react';
import type { AppPlan } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

interface DocumentSettings {
  logoUrl?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  font: {
    family: string;
    size: number;
  };
  layout: {
    margin: number;
    spacing: number;
    alignment: 'left' | 'center' | 'right';
  };
  visibleFields: {
    logo: boolean;
    companyNPWP: boolean;
    dueDate: boolean;
    subtotal: boolean;
    discount: boolean;
    tax: boolean;
    total: boolean;
    notes: boolean;
    paymentInfo: boolean;
    showPrice: boolean;
    showDecimals: boolean;
    paymentGateway: boolean;
  };
}

interface SettingsPanelProps {
  documentType: 'invoice' | 'surat_jalan' | 'kwitansi';
  settings: DocumentSettings;
  onChange: (settings: DocumentSettings) => void;
  effectivePlan?: AppPlan;
  onRequestUpgradePro?: () => void;
}

const defaultSettings: DocumentSettings = {
  colorScheme: {
    primary: '#2563eb',
    secondary: '#059669',
    accent: '#9333ea',
  },
  font: {
    family: 'Arial',
    size: 14,
  },
  layout: {
    margin: 20,
    spacing: 16,
    alignment: 'left',
  },
  visibleFields: {
    logo: true,
    companyNPWP: true,
    dueDate: true,
    subtotal: true,
    discount: false,
    tax: true,
    total: true,
    notes: true,
    paymentInfo: true,
    showPrice: true,
    showDecimals: true,
    paymentGateway: false,
  },
};

const copy = {
  en: {
    title: 'Settings',
    reset: 'Reset',
    appearance: 'Appearance',
    layout: 'Layout',
    colorScheme: 'Color scheme',
    primaryColor: 'Primary color',
    secondaryColor: 'Secondary color',
    accentColor: 'Accent color',
    font: 'Font',
    fontFamily: 'Font family',
    fontSize: 'Font size',
    visibleFields: 'Choose which fields appear in the document.',
    show: 'Show',
    hide: 'Hide',
    showPrice: 'Show price',
    showDecimals: 'Show decimals',
    margin: 'Margin',
    spacing: 'Spacing',
    alignment: 'Alignment',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    logo: 'Logo',
    companyNPWP: 'Company tax ID',
    dueDate: 'Due date',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    total: 'Total',
    notes: 'Notes',
    paymentInfo: 'Payment info',
    paymentGateway: 'Pay button',
  },
  id: {
    title: 'Pengaturan',
    reset: 'Reset',
    appearance: 'Tampilan',
    layout: 'Layout',
    colorScheme: 'Skema warna',
    primaryColor: 'Warna utama',
    secondaryColor: 'Warna sekunder',
    accentColor: 'Warna aksen',
    font: 'Font',
    fontFamily: 'Font family',
    fontSize: 'Ukuran font',
    visibleFields: 'Pilih field yang ingin ditampilkan dalam dokumen.',
    show: 'Tampil',
    hide: 'Sembunyikan',
    showPrice: 'Tampilkan harga',
    showDecimals: 'Tampilkan desimal',
    margin: 'Margin',
    spacing: 'Spasi',
    alignment: 'Perataan',
    left: 'Kiri',
    center: 'Tengah',
    right: 'Kanan',
    logo: 'Logo',
    companyNPWP: 'NPWP perusahaan',
    dueDate: 'Tanggal jatuh tempo',
    subtotal: 'Subtotal',
    discount: 'Diskon',
    tax: 'Pajak',
    total: 'Total',
    notes: 'Catatan',
    paymentInfo: 'Info pembayaran',
    paymentGateway: 'Tombol bayar',
  },
} as const;

export default function SettingsPanel({
  documentType,
  settings,
  onChange,
  effectivePlan = 'free',
  onRequestUpgradePro,
}: SettingsPanelProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const [activeTab, setActiveTab] = useState<'appearance' | 'layout'>('appearance');
  const [uploading, setUploading] = useState(false);


  const updateColorScheme = (key: keyof DocumentSettings['colorScheme'], value: string) => {
    onChange({
      ...settings,
      colorScheme: {
        ...settings.colorScheme,
        [key]: value,
      },
    });
  };

  const updateFont = (key: keyof DocumentSettings['font'], value: any) => {
    onChange({
      ...settings,
      font: {
        ...settings.font,
        [key]: value,
      },
    });
  };

  const updateLayout = (key: keyof DocumentSettings['layout'], value: any) => {
    onChange({
      ...settings,
      layout: {
        ...settings.layout,
        [key]: value,
      },
    });
  };

  const toggleField = (field: keyof DocumentSettings['visibleFields']) => {
    if (
      documentType === 'invoice' &&
      field === 'paymentGateway' &&
      effectivePlan !== 'pro' &&
      settings.visibleFields.paymentGateway === false
    ) {
      onRequestUpgradePro?.();
      return;
    }
    onChange({
      ...settings,
      visibleFields: {
        ...settings.visibleFields,
        [field]: !settings.visibleFields[field],
      },
    });
  };

  const resetSettings = () => {
    onChange(defaultSettings);
  };

  const visibleFieldLabel = (field: keyof DocumentSettings['visibleFields']) => {
    switch (field) {
      case 'logo':
        return text.logo;
      case 'companyNPWP':
        return text.companyNPWP;
      case 'dueDate':
        return text.dueDate;
      case 'subtotal':
        return text.subtotal;
      case 'discount':
        return text.discount;
      case 'tax':
        return text.tax;
      case 'total':
        return text.total;
      case 'notes':
        return text.notes;
      case 'paymentInfo':
        return text.paymentInfo;
      case 'paymentGateway':
        return text.paymentGateway;
      default:
        return field;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          {text.title}
        </h3>
        <button
          onClick={resetSettings}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {text.reset}
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'appearance'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          {text.appearance}
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'layout'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          {text.layout}
        </button>
      </div>

      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Palette className="h-4 w-4 mr-2" />
              {text.colorScheme}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">{text.primaryColor}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.colorScheme.primary}
                    onChange={(e) => updateColorScheme('primary', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colorScheme.primary}
                    onChange={(e) => updateColorScheme('primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">{text.secondaryColor}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.colorScheme.secondary}
                    onChange={(e) => updateColorScheme('secondary', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colorScheme.secondary}
                    onChange={(e) => updateColorScheme('secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">{text.accentColor}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.colorScheme.accent}
                    onChange={(e) => updateColorScheme('accent', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colorScheme.accent}
                    onChange={(e) => updateColorScheme('accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Type className="h-4 w-4 mr-2" />
              {text.font}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">{text.fontFamily}</label>
                <select
                  value={settings.font.family}
                  onChange={(e) => updateFont('family', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">{text.fontSize}: {settings.font.size}px</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={settings.font.size}
                  onChange={(e) => updateFont('size', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              {text.visibleFields}
            </p>
            {Object.entries(settings.visibleFields)
              .filter(([field]) => !['showPrice', 'showDecimals'].includes(field))
              .filter(([field]) => {
                if (documentType === 'invoice') return true;
                if (documentType === 'surat_jalan') return ['logo', 'notes'].includes(field);
                if (documentType === 'kwitansi') return ['logo', 'notes'].includes(field);
                return true;
              })
              .map(([field, visible]) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {visibleFieldLabel(field as keyof DocumentSettings['visibleFields'])}
                </span>
                <button
                  onClick={() => toggleField(field as keyof DocumentSettings['visibleFields'])}
                  className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                    visible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {visible ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">{text.show}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="text-xs">{text.hide}</span>
                    </>
                  )}
                </button>
              </div>
            ))}

            {documentType === 'surat_jalan' && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {text.showPrice}
                </span>
                <button
                  onClick={() => toggleField('showPrice')}
                  className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                    settings.visibleFields.showPrice
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {settings.visibleFields.showPrice ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">{text.show}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="text-xs">{text.hide}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">
                {text.showDecimals}
              </span>
              <button
                onClick={() => toggleField('showDecimals')}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  settings.visibleFields.showDecimals
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {settings.visibleFields.showDecimals ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">{text.show}</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="text-xs">{text.hide}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Layout className="h-4 w-4 mr-2" />
              {text.margin}: {settings.layout.margin}mm
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.layout.margin}
              onChange={(e) => updateLayout('margin', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              {text.spacing}: {settings.layout.spacing}px
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={settings.layout.spacing}
              onChange={(e) => updateLayout('spacing', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              {text.alignment}
            </label>
            <div className="flex space-x-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateLayout('alignment', align)}
                  className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    settings.layout.alignment === align
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {align === 'left' ? text.left : align === 'center' ? text.center : text.right}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export { defaultSettings };
export type { DocumentSettings };
