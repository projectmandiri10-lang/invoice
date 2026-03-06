import React, { useState } from 'react';
import { X, Repeat } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export interface RecurringSettings {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: string;
  endDate?: string;
}

interface RecurringInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: RecurringSettings) => void;
}

const copy = {
  en: {
    title: 'Recurring invoice schedule',
    frequency: 'Frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    startDate: 'Start date',
    endDate: 'End date (optional)',
    cancel: 'Cancel',
    save: 'Save schedule',
  },
  id: {
    title: 'Atur invoice berulang',
    frequency: 'Frekuensi',
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    yearly: 'Tahunan',
    startDate: 'Tanggal mulai',
    endDate: 'Tanggal berakhir (opsional)',
    cancel: 'Batal',
    save: 'Simpan jadwal',
  },
} as const;

export default function RecurringInvoiceModal({ isOpen, onClose, onSave }: RecurringInvoiceModalProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const [settings, setSettings] = useState<RecurringSettings>({
    frequency: 'monthly',
    interval: 1,
    startDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-bold text-gray-800">
            <Repeat className="mr-2" />
            {text.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{text.frequency}</label>
            <div className="mt-1 flex space-x-2">
              <select
                value={settings.frequency}
                onChange={(event) =>
                  setSettings({ ...settings, frequency: event.target.value as RecurringSettings['frequency'] })
                }
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">{text.daily}</option>
                <option value="weekly">{text.weekly}</option>
                <option value="monthly">{text.monthly}</option>
                <option value="yearly">{text.yearly}</option>
              </select>
              <input
                type="number"
                min="1"
                value={settings.interval}
                onChange={(event) => setSettings({ ...settings, interval: parseInt(event.target.value, 10) || 1 })}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              {text.startDate}
            </label>
            <input
              id="startDate"
              type="date"
              value={settings.startDate}
              onChange={(event) => setSettings({ ...settings, startDate: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              {text.endDate}
            </label>
            <input
              id="endDate"
              type="date"
              value={settings.endDate || ''}
              onChange={(event) => setSettings({ ...settings, endDate: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
            {text.cancel}
          </button>
          <button onClick={handleSave} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
