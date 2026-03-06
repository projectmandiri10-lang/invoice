import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AppPlan } from '@/contexts/AuthContext';

interface LogoUploadProps {
  logoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  userTier?: AppPlan;
}

export default function LogoUpload({ logoUrl, onLogoChange, userTier = 'free' }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onLogoChange(data.publicUrl);
      alert('Logo berhasil diupload');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert('Gagal upload logo: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setUploading(false);
    }
  };

  const isIndonesia = navigator.language.startsWith('id');
  const starterPrice = isIndonesia ? 'Rp 100.000/bulan' : '$5/month';
  
  return (
        <div className="mb-4 relative">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2 cursor-pointer no-print">
        <Upload className="h-4 w-4 mr-2" />
        <span>{isIndonesia ? 'Unggah Logo' : 'Upload Logo'}</span>
      </label>
      
      {logoUrl && userTier !== 'free' && (
        <div className="mb-2">
          <img
            src={logoUrl}
            alt="Company Logo"
            className="h-16 w-auto border border-gray-300 rounded"
          />
        </div>
      )}
      
      {userTier !== 'free' ? (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer no-print"
          />
          <p className="text-xs text-gray-500 mt-1 no-print">PNG, JPG, SVG (max 2MB)</p>
        </>
      ) : (
        <div className="mt-2 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm font-medium text-gray-800">
            {isIndonesia ? 'Gunakan Logo Sendiri' : 'Use Your Own Logo'}
          </p>
          <p className="text-xs text-gray-600">
            {isIndonesia 
              ? `Upgrade ke Starter (${starterPrice}) untuk menambahkan logo perusahaan Anda.`
              : `Upgrade to Starter (${starterPrice}) to add your company logo.`
            }
          </p>
        </div>
      )}
      
      {uploading && (
        <div className="flex items-center mt-2 text-blue-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm">{isIndonesia ? 'Mengunggah...' : 'Uploading...'}</span>
        </div>
      )}
    </div>
  );
}
