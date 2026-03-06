import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

export default function CheckEmailPage() {
  const location = useLocation();
  const email = location.state?.email || 'email Anda';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <MailCheck className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Verifikasi Email Anda</h1>
        <p className="text-gray-600 mt-4">
          Kami telah mengirimkan tautan verifikasi ke{' '}
          <span className="font-semibold text-gray-800">{email}</span>.
        </p>
        <p className="text-gray-600 mt-2">
          Silakan periksa kotak masuk Anda (dan folder spam) untuk menyelesaikan pendaftaran.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
