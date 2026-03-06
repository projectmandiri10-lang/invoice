import React, { useState } from 'react';
import { X, Calendar, Repeat } from 'lucide-react';

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

export default function RecurringInvoiceModal({ isOpen, onClose, onSave }: RecurringInvoiceModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Repeat className="mr-2" />
            Atur Invoice Berulang
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frekuensi</label>
            <div className="flex space-x-2 mt-1">
              <select
                value={settings.frequency}
                onChange={(e) => setSettings({ ...settings, frequency: e.target.value as RecurringSettings['frequency'] })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
              <input
                type="number"
                min="1"
                value={settings.interval}
                onChange={(e) => setSettings({ ...settings, interval: parseInt(e.target.value) || 1 })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input
              id="startDate"
              type="date"
              value={settings.startDate}
              onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Tanggal Berakhir (Opsional)</label>
            <input
              id="endDate"
              type="date"
              value={settings.endDate || ''}
              onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simpan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}
