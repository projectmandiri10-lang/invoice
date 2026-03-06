import React, { useEffect, useState } from 'react';
import { Link as LinkIcon, Users } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  client_name: string;
  portal_token: string;
}

const copy = {
  en: {
    title: 'Client Management',
    list: 'Client list',
    addNew: 'Add new client',
    loading: 'Loading...',
    empty: 'You do not have any clients yet. Add your first client to get started.',
    copyLink: 'Copy link',
    copyTitle: 'Copy client portal link',
    addButton: 'Add client',
    clientName: 'Client name',
    clientNamePlaceholder: 'PT Example Client',
    loadFailed: 'Failed to load clients.',
    createFailed: 'Failed to add client.',
    createFailedDescription: 'The client name may already exist.',
    created: 'New client added successfully.',
    copied: 'Client portal link copied to clipboard.',
  },
  id: {
    title: 'Manajemen Klien',
    list: 'Daftar klien',
    addNew: 'Tambah klien baru',
    loading: 'Memuat...',
    empty: 'Anda belum memiliki klien. Tambahkan klien pertama untuk memulai.',
    copyLink: 'Salin tautan',
    copyTitle: 'Salin tautan portal klien',
    addButton: 'Tambah klien',
    clientName: 'Nama klien',
    clientNamePlaceholder: 'PT Contoh Klien',
    loadFailed: 'Gagal memuat daftar klien.',
    createFailed: 'Gagal menambahkan klien.',
    createFailedDescription: 'Mungkin nama klien sudah ada.',
    created: 'Klien baru berhasil ditambahkan.',
    copied: 'Tautan portal klien disalin ke clipboard.',
  },
} as const;

export default function ClientsPage() {
  const { user } = useAuth();
  const { locale } = useI18n();
  const text = copy[locale];
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('id, client_name, portal_token')
      .eq('user_id', user.id)
      .order('client_name', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      toast.error(text.loadFailed);
    } else if (data) {
      setClients(data);
    }
    setLoading(false);
  };

  const handleAddClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !newClientName.trim()) return;

    const { data, error } = await supabase
      .from('clients')
      .insert({ user_id: user.id, client_name: newClientName.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
      toast.error(text.createFailed, { description: text.createFailedDescription });
    } else if (data) {
      setClients([...clients, data]);
      setNewClientName('');
      toast.success(text.created);
    }
  };

  const copyPortalLink = async (token: string) => {
    const link = `${window.location.origin}/portal/${token}`;
    await navigator.clipboard.writeText(link);
    toast.success(text.copied);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="flex items-center text-3xl font-bold text-gray-900">
              <Users className="mr-3 text-blue-600" />
              {text.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">{text.list}</h2>
                {loading ? (
                  <p>{text.loading}</p>
                ) : clients.length === 0 ? (
                  <p className="text-gray-500">{text.empty}</p>
                ) : (
                  <ul className="space-y-3">
                    {clients.map((client) => (
                      <li key={client.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="font-medium">{client.client_name}</span>
                        <button
                          onClick={() => copyPortalLink(client.portal_token)}
                          className="flex items-center space-x-2 rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                          title={text.copyTitle}
                        >
                          <LinkIcon size={16} />
                          <span>{text.copyLink}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">{text.addNew}</h2>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div>
                    <label htmlFor="clientName" className="mb-2 block text-sm font-medium text-gray-700">
                      {text.clientName}
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      value={newClientName}
                      onChange={(event) => setNewClientName(event.target.value)}
                      placeholder={text.clientNamePlaceholder}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
                  >
                    {text.addButton}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
