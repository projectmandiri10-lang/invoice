import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, UserPlus } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { formatDateTime, getPlanLabel, type AppPlan } from '@/lib/i18n';
import type { AccountStatus } from '@/lib/authz';

type AdminUserRow = {
  id: string;
  email: string;
  plan: AppPlan;
  account_status: AccountStatus;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  is_superuser: boolean;
};

type AdminUsersListResponse = {
  users: AdminUserRow[];
};

const copy = {
  en: {
    loading: 'Loading users...',
    title: 'User Management',
    subtitle: 'Create, activate, disable, and manage user plans.',
    signInRequired: 'Please sign in as the superuser.',
    forbidden: 'Only the superuser can access this page.',
    email: 'Email',
    password: 'Password',
    accountStatus: 'Account status',
    plan: 'Plan',
    createUser: 'Create user',
    creating: 'Creating...',
    refresh: 'Refresh',
    status: 'Status',
    createdAt: 'Created',
    lastSignIn: 'Last sign in',
    emailVerified: 'Email verified',
    actions: 'Actions',
    save: 'Save',
    resetPassword: 'Reset password',
    delete: 'Delete',
    pending: 'Pending',
    active: 'Active',
    disabled: 'Disabled',
    yes: 'Yes',
    no: 'No',
    noUsers: 'No users found.',
    createdSuccess: 'User created successfully.',
    createFailed: 'Failed to create user.',
    updateSuccess: 'User updated successfully.',
    updateFailed: 'Failed to update user.',
    resetPrompt: 'Enter a new password for this user (minimum 6 characters).',
    resetCancelled: 'Password reset cancelled.',
    resetSuccess: 'Password updated successfully.',
    resetFailed: 'Failed to update password.',
    deleteConfirm: 'Delete this user and all of their data?',
    deleteSuccess: 'User deleted successfully.',
    deleteFailed: 'Failed to delete user.',
    cannotDeleteSuperuser: 'The superuser account cannot be deleted.',
    invalidPassword: 'Password must be at least 6 characters.',
    emailPlaceholder: 'user@example.com',
    passwordPlaceholder: 'Temporary password',
  },
  id: {
    loading: 'Memuat pengguna...',
    title: 'Manajemen Pengguna',
    subtitle: 'Buat, aktifkan, nonaktifkan, dan kelola paket pengguna.',
    signInRequired: 'Silakan masuk sebagai superuser.',
    forbidden: 'Hanya superuser yang dapat mengakses halaman ini.',
    email: 'Email',
    password: 'Password',
    accountStatus: 'Status akun',
    plan: 'Paket',
    createUser: 'Buat pengguna',
    creating: 'Membuat...',
    refresh: 'Muat ulang',
    status: 'Status',
    createdAt: 'Dibuat',
    lastSignIn: 'Login terakhir',
    emailVerified: 'Email terverifikasi',
    actions: 'Aksi',
    save: 'Simpan',
    resetPassword: 'Reset password',
    delete: 'Hapus',
    pending: 'Pending',
    active: 'Aktif',
    disabled: 'Nonaktif',
    yes: 'Ya',
    no: 'Tidak',
    noUsers: 'Belum ada pengguna.',
    createdSuccess: 'Pengguna berhasil dibuat.',
    createFailed: 'Gagal membuat pengguna.',
    updateSuccess: 'Pengguna berhasil diperbarui.',
    updateFailed: 'Gagal memperbarui pengguna.',
    resetPrompt: 'Masukkan password baru untuk pengguna ini (minimal 6 karakter).',
    resetCancelled: 'Reset password dibatalkan.',
    resetSuccess: 'Password berhasil diperbarui.',
    resetFailed: 'Gagal memperbarui password.',
    deleteConfirm: 'Hapus pengguna ini beserta semua datanya?',
    deleteSuccess: 'Pengguna berhasil dihapus.',
    deleteFailed: 'Gagal menghapus pengguna.',
    cannotDeleteSuperuser: 'Akun superuser tidak dapat dihapus.',
    invalidPassword: 'Password minimal 6 karakter.',
    emailPlaceholder: 'user@contoh.com',
    passwordPlaceholder: 'Password sementara',
  },
} as const;

const PLAN_OPTIONS: AppPlan[] = ['free', 'starter', 'pro'];
const STATUS_OPTIONS: AccountStatus[] = ['pending', 'active', 'disabled'];

export default function AdminUsersPage() {
  const { user, isSuperuser, loading } = useAuth();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const text = copy[locale];
  const [users, setUsers] = React.useState<AdminUserRow[]>([]);
  const [pageLoading, setPageLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    plan: 'free' as AppPlan,
    account_status: 'active' as AccountStatus,
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, navigate, user]);

  const loadUsers = React.useCallback(async () => {
    if (!isSuperuser) return;
    setPageLoading(true);
    try {
      const response = await invokeEdgeFunction<AdminUsersListResponse>('admin-users-list');
      setUsers(response.users || []);
    } catch (error: any) {
      toast.error(text.forbidden, { description: error?.message || String(error) });
    } finally {
      setPageLoading(false);
    }
  }, [isSuperuser, text.forbidden]);

  React.useEffect(() => {
    if (isSuperuser) {
      void loadUsers();
    }
  }, [isSuperuser, loadUsers]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.password.trim().length < 6) {
      toast.error(text.invalidPassword);
      return;
    }

    setCreating(true);
    try {
      await invokeEdgeFunction('admin-users-create', {
        email: form.email.trim(),
        password: form.password,
        plan: form.plan,
        accountStatus: form.account_status,
      });
      toast.success(text.createdSuccess);
      setForm({
        email: '',
        password: '',
        plan: 'free',
        account_status: 'active',
      });
      await loadUsers();
    } catch (error: any) {
      toast.error(text.createFailed, { description: error?.message || String(error) });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (row: AdminUserRow) => {
    try {
      await invokeEdgeFunction('admin-users-update', {
        userId: row.id,
        plan: row.plan,
        accountStatus: row.account_status,
      });
      toast.success(text.updateSuccess);
      await loadUsers();
    } catch (error: any) {
      toast.error(text.updateFailed, { description: error?.message || String(error) });
    }
  };

  const handleResetPassword = async (row: AdminUserRow) => {
    const nextPassword = window.prompt(text.resetPrompt, '');
    if (nextPassword === null) {
      toast.info(text.resetCancelled);
      return;
    }
    if (nextPassword.trim().length < 6) {
      toast.error(text.invalidPassword);
      return;
    }

    try {
      await invokeEdgeFunction('admin-users-reset-password', {
        userId: row.id,
        newPassword: nextPassword.trim(),
      });
      toast.success(text.resetSuccess);
    } catch (error: any) {
      toast.error(text.resetFailed, { description: error?.message || String(error) });
    }
  };

  const handleDelete = async (row: AdminUserRow) => {
    if (row.is_superuser) {
      toast.error(text.cannotDeleteSuperuser);
      return;
    }
    if (!window.confirm(text.deleteConfirm)) return;

    try {
      await invokeEdgeFunction('admin-users-delete', { userId: row.id });
      toast.success(text.deleteSuccess);
      await loadUsers();
    } catch (error: any) {
      toast.error(text.deleteFailed, { description: error?.message || String(error) });
    }
  };

  const updateRow = (userId: string, field: 'plan' | 'account_status', value: string) => {
    setUsers((current) =>
      current.map((row) =>
        row.id === userId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center text-gray-600">{text.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isSuperuser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{text.forbidden}</h1>
            <p className="mt-3 text-gray-600">{text.signInRequired}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
              <p className="mt-2 text-gray-600">{text.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadUsers()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {text.refresh}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">{text.createUser}</h2>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{text.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder={text.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{text.password}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder={text.passwordPlaceholder}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{text.plan}</label>
                  <select
                    value={form.plan}
                    onChange={(event) => setForm((current) => ({ ...current, plan: event.target.value as AppPlan }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    {PLAN_OPTIONS.map((plan) => (
                      <option key={plan} value={plan}>
                        {getPlanLabel(plan, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{text.accountStatus}</label>
                  <select
                    value={form.account_status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        account_status: event.target.value as AccountStatus,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {text[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {creating ? text.creating : text.createUser}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {users.length === 0 ? (
                <div className="p-8 text-center text-gray-600">{text.noUsers}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 text-left text-sm font-medium text-gray-600">
                      <tr>
                        <th className="px-4 py-3">{text.email}</th>
                        <th className="px-4 py-3">{text.plan}</th>
                        <th className="px-4 py-3">{text.status}</th>
                        <th className="px-4 py-3">{text.emailVerified}</th>
                        <th className="px-4 py-3">{text.createdAt}</th>
                        <th className="px-4 py-3">{text.lastSignIn}</th>
                        <th className="px-4 py-3">{text.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {users.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{row.email}</div>
                            {row.is_superuser && (
                              <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                Superuser
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={row.plan}
                              onChange={(event) => updateRow(row.id, 'plan', event.target.value)}
                              disabled={row.is_superuser}
                              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                            >
                              {PLAN_OPTIONS.map((plan) => (
                                <option key={plan} value={plan}>
                                  {getPlanLabel(plan, locale)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={row.account_status}
                              onChange={(event) => updateRow(row.id, 'account_status', event.target.value)}
                              disabled={row.is_superuser}
                              className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {text[status]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">{row.email_confirmed_at ? text.yes : text.no}</td>
                          <td className="px-4 py-3">{formatDateTime(row.created_at, locale)}</td>
                          <td className="px-4 py-3">
                            {row.last_sign_in_at ? formatDateTime(row.last_sign_in_at, locale) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => void handleUpdate(row)}
                                disabled={row.is_superuser}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                              >
                                {text.save}
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleResetPassword(row)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                {text.resetPassword}
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(row)}
                                disabled={row.is_superuser}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{text.delete}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
