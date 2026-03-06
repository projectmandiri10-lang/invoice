import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Truck,
  Receipt,
  Trash2,
  Eye,
  Calendar,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Document } from '@/types/document';
import { supabase } from '@/lib/supabase';
import { formatDateTime, getDocumentTypeLabel } from '@/lib/i18n';

const copy = {
  en: {
    loading: 'Loading documents...',
    title: 'My Documents',
    subtitle: 'Manage all documents you have created',
    grid: 'Grid view',
    list: 'List view',
    all: 'All',
    emptyTitle: 'No documents yet',
    emptyDescription: 'Start creating a new document from the home page.',
    createDocument: 'Create document',
    updatedAt: 'Updated',
    view: 'View',
    deleteSuccess: 'Document deleted successfully',
    deleteFailed: 'Failed to delete document',
    loadFailed: 'Failed to load documents',
    deleteTitle: 'Delete document?',
    deleteDescription: 'This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  id: {
    loading: 'Memuat dokumen...',
    title: 'Dokumen Saya',
    subtitle: 'Kelola semua dokumen yang telah Anda buat',
    grid: 'Tampilan grid',
    list: 'Tampilan list',
    all: 'Semua',
    emptyTitle: 'Belum ada dokumen',
    emptyDescription: 'Mulai buat dokumen baru dari halaman utama.',
    createDocument: 'Buat dokumen',
    updatedAt: 'Diperbarui',
    view: 'Lihat',
    deleteSuccess: 'Dokumen berhasil dihapus',
    deleteFailed: 'Gagal menghapus dokumen',
    loadFailed: 'Gagal memuat dokumen',
    deleteTitle: 'Hapus dokumen?',
    deleteDescription: 'Tindakan ini tidak bisa dibatalkan.',
    cancel: 'Batal',
    delete: 'Hapus',
  },
} as const;

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const { locale } = useI18n();
  const text = copy[locale];
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
      alert(text.loadFailed);
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
      const { error } = await supabase.from('documents').delete().eq('id', documentToDelete).eq('user_id', user!.id);
      if (error) throw error;
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete));
      closeDeleteModal();
      alert(text.deleteSuccess);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(text.deleteFailed);
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

  const filteredDocuments = documents.filter((doc) => (filter === 'all' ? true : doc.document_type === filter));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-xl text-gray-600">{text.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{text.title}</h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={text.grid}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={text.list}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {text.all} ({documents.length})
            </button>
            <button
              onClick={() => setFilter('invoice')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'invoice' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getDocumentTypeLabel('invoice', locale)} ({documents.filter((d) => d.document_type === 'invoice').length})
            </button>
            <button
              onClick={() => setFilter('surat_jalan')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'surat_jalan' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getDocumentTypeLabel('surat_jalan', locale)} ({documents.filter((d) => d.document_type === 'surat_jalan').length})
            </button>
            <button
              onClick={() => setFilter('kwitansi')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'kwitansi' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getDocumentTypeLabel('kwitansi', locale)} ({documents.filter((d) => d.document_type === 'kwitansi').length})
            </button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">{text.emptyTitle}</h3>
              <p className="mb-4 text-gray-600">{text.emptyDescription}</p>
              <Link to="/" className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                {text.createDocument}
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getIcon(doc.document_type)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <p className="text-sm text-gray-600">
                          {getDocumentTypeLabel(doc.document_type, locale)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(doc.updated_at, locale)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to="/"
                      state={{ documentToLoad: doc }}
                      className="flex flex-1 items-center justify-center space-x-2 rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{text.view}</span>
                    </Link>
                    <button
                      onClick={() => openDeleteModal(doc.id)}
                      className="flex items-center justify-center rounded bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
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
                <div
                  key={doc.id}
                  className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="mr-4 flex-shrink-0">{getIcon(doc.document_type)}</div>
                  <div className="flex-grow">
                    <h3 className="truncate text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{getDocumentTypeLabel(doc.document_type, locale)}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center space-x-6">
                    <p className="w-56 text-right text-sm text-gray-500">
                      {text.updatedAt}: {formatDateTime(doc.updated_at, locale)}
                    </p>
                    <Link
                      to="/"
                      state={{ documentToLoad: doc }}
                      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      {text.view}
                    </Link>
                    <button
                      onClick={() => openDeleteModal(doc.id)}
                      className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{text.deleteTitle}</h3>
                <p className="mt-1 text-sm text-gray-600">{text.deleteDescription}</p>
              </div>
              <button onClick={closeDeleteModal} className="rounded p-2 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                {text.cancel}
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                {text.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
