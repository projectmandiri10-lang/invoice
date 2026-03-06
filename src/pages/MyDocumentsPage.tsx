import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { Document } from '@/types/document';
import { FileText, Truck, Receipt, Trash2, Eye, Calendar, X, LayoutGrid, List } from 'lucide-react';
import { formatDate } from '@/lib/documentUtils';
import { Link } from 'react-router-dom';

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadDocuments();
  }, [user, navigate]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      alert('Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDocumentToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete)
        .eq('user_id', user!.id);

      if (error) throw error;

      setDocuments(documents.filter((doc) => doc.id !== documentToDelete));
      closeDeleteModal();
      alert('Dokumen berhasil dihapus');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Gagal menghapus dokumen');
      closeDeleteModal();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-8 w-8 text-blue-600" />;
      case 'surat_jalan':
        return <Truck className="h-8 w-8 text-green-600" />;
      case 'kwitansi':
        return <Receipt className="h-8 w-8 text-purple-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Invoice';
      case 'surat_jalan':
        return 'Surat Jalan';
      case 'kwitansi':
        return 'Kwitansi';
      default:
        return type;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter === 'all') return true;
    return doc.document_type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Memuat dokumen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dokumen Saya</h1>
            <p className="text-gray-600">Kelola semua dokumen yang telah Anda buat</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title="Tampilan List"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semua ({documents.length})
            </button>
            <button
              onClick={() => setFilter('invoice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'invoice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Invoice ({documents.filter((d) => d.document_type === 'invoice').length})
            </button>
            <button
              onClick={() => setFilter('surat_jalan')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'surat_jalan'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Surat Jalan ({documents.filter((d) => d.document_type === 'surat_jalan').length})
            </button>
            <button
              onClick={() => setFilter('kwitansi')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'kwitansi'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Kwitansi ({documents.filter((d) => d.document_type === 'kwitansi').length})
            </button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada dokumen</h3>
              <p className="text-gray-600 mb-4">
                Mulai buat dokumen baru dari halaman utama
            </p>
            <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Buat Dokumen
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getIcon(doc.document_type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{getTypeLabel(doc.document_type)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(doc.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to="/"
                    state={{ documentToLoad: doc }}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Lihat</span>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(doc.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow flex items-center p-4">
                <div className="flex items-center flex-grow">
                  <div className="flex-shrink-0 mr-4">
                    {getIcon(doc.document_type)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{getTypeLabel(doc.document_type)}</p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0 space-x-6">
                  <p className="text-sm text-gray-500 text-right w-56">
                    Diperbarui: {new Date(doc.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <Link
                    to="/"
                    state={{ documentToLoad: doc }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    title="Lihat Dokumen"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => openDeleteModal(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    title="Hapus dokumen"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
