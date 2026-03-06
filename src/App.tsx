import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const MyDocumentsPage = lazy(() => import('@/pages/MyDocumentsPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const BillingReturnPage = lazy(() => import('@/pages/BillingReturnPage'));
const ClientsPage = lazy(() => import('@/pages/ClientsPage'));
const ClientPortalPage = lazy(() => import('@/pages/ClientPortalPage'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Memuat...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-documents" element={<MyDocumentsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing/return" element={<BillingReturnPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/portal/:accessToken" element={<ClientPortalPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
