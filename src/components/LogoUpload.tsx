import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AppPlan } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

interface LogoUploadProps {
  logoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  userTier?: AppPlan;
}

const copy = {
  en: {
    sizeLimit: 'Maximum file size is 2MB',
    uploadSuccess: 'Logo uploaded successfully',
    uploadFailed: 'Failed to upload logo',
    upload: 'Upload logo',
    ownLogo: 'Use your own logo',
    ownLogoDescription: 'Upgrade to Starter (Rp 100.000/month) to add your company logo.',
    uploading: 'Uploading...',
    formats: 'PNG, JPG, SVG (max 2MB)',
    logoAlt: 'Company logo',
  },
  id: {
    sizeLimit: 'Ukuran file maksimal 2MB',
    uploadSuccess: 'Logo berhasil diupload',
    uploadFailed: 'Gagal upload logo',
    upload: 'Unggah logo',
    ownLogo: 'Gunakan Logo Sendiri',
    ownLogoDescription: 'Upgrade ke Starter (Rp 100.000/bulan) untuk menambahkan logo perusahaan Anda.',
    uploading: 'Mengunggah...',
    formats: 'PNG, JPG, SVG (maks 2MB)',
    logoAlt: 'Logo perusahaan',
  },
} as const;

export default function LogoUpload({ logoUrl, onLogoChange, userTier = 'free' }: LogoUploadProps) {
  const { locale } = useI18n();
  const text = copy[locale];
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(text.sizeLimit);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      onLogoChange(data.publicUrl);
      alert(text.uploadSuccess);
    } catch (error: any) {
      alert(`${text.uploadFailed}: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  if (userTier === 'free') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 className="mb-1 font-semibold text-amber-900">{text.ownLogo}</h3>
        <p className="text-sm text-amber-800">{text.ownLogoDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        <Upload className="h-4 w-4" />
        <span>{uploading ? text.uploading : text.upload}</span>
        <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
      </label>

      {logoUrl && (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <img src={logoUrl} alt={text.logoAlt} className="max-h-20 w-auto object-contain" />
        </div>
      )}

      <p className="text-xs text-gray-500 no-print">{text.formats}</p>
    </div>
  );
}
