import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

export default function LegalLinks({ className = '' }: { className?: string }) {
  const { locale } = useI18n();
  const copy =
    locale === 'id'
      ? {
          terms: 'Syarat & Ketentuan',
          privacy: 'Kebijakan Privasi',
        }
      : {
          terms: 'Terms of Service',
          privacy: 'Privacy Policy',
        };

  return (
    <div className={className}>
      <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
        {copy.terms}
      </Link>
      <span className="mx-2 text-gray-400">•</span>
      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
        {copy.privacy}
      </Link>
    </div>
  );
}
