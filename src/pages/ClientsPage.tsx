import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { Plus, Link as LinkIcon, Clipboard, Users } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Client {
  id: string;
  client_name: string;
  portal_token: string;
}

export default function ClientsPage() {
  const { user } = useAuth();
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
      toast.error('Gagal memuat daftar klien.');
    } else if (data) {
      setClients(data);
    }
    setLoading(false);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newClientName.trim()) return;

    const { data, error } = await supabase
      .from('clients')
      .insert({ user_id: user.id, client_name: newClientName.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
      toast.error('Gagal menambahkan klien.', { description: 'Mungkin nama klien sudah ada.' });
    } else if (data) {
      setClients([...clients, data]);
      setNewClientName('');
      toast.success('Klien baru berhasil ditambahkan.');
    }
  };
  
  const copyPortalLink = (token: string) => {
    const link = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Tautan portal klien disalin ke clipboard!');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 text-blue-600" />
              Manajemen Klien
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Daftar Klien</h2>
                {loading ? (
                  <p>Memuat...</p>
                ) : clients.length === 0 ? (
                  <p className="text-gray-500">Anda belum memiliki klien. Tambahkan klien baru untuk memulai.</p>
                ) : (
                  <ul className="space-y-3">
                    {clients.map(client => (
                      <li key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{client.client_name}</span>
                        <button 
                          onClick={() => copyPortalLink(client.portal_token)}
                          className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                          title="Salin Tautan Portal Klien"
                        >
                          <LinkIcon size={16} />
                          <span>Salin Tautan</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Tambah Klien Baru</h2>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Klien
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: PT. Jaya Abadi"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Tambah Klien
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
