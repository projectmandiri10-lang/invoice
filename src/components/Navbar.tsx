import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, LogOut, User, Home, CreditCard, Users } from 'lucide-react';

export default function Navbar() {
  const { user, effectivePlan, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="idCashier Invoice Generator" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-gray-900">idCashier Invoice Generator</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Beranda</span>
                </Link>
                <Link
                  to="/my-documents"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>Dokumen Saya</span>
                </Link>
                <Link
                  to="/clients"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Klien</span>
                </Link>
                <Link
                  to="/billing"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Billing</span>
                </Link>
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.email}</span>
                  <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase text-gray-700">
                    {effectivePlan}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
