import React from 'react';
import Navbar from '@/components/Navbar';
import LegalLinks from '@/components/LegalLinks';
import { useI18n } from '@/contexts/I18nContext';

const content = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: March 14, 2026',
    intro:
      'These Terms of Service govern your use of idCashier Invoice Generator at https://invoice.idcashier.com. By using the service, you agree to these terms.',
    sections: [
      {
        title: '1. Service scope',
        body:
          'idCashier Invoice Generator provides invoice, delivery note, and receipt generation, document storage, client management, and a read-only client portal for eligible plans.',
      },
      {
        title: '2. Registration and approval',
        body:
          'Public registration is available by email and password. New accounts must verify their email address and then wait for manual approval by the platform superuser before access is activated.',
      },
      {
        title: '3. Manual plans and access control',
        body:
          'Plan assignments are managed manually by the platform superuser. Free, Starter, and Pro entitlements do not auto-renew. Access, limits, and available features may change when the superuser updates your account status or assigned plan.',
      },
      {
        title: '4. Account status',
        body:
          'An account may be marked as pending, active, or disabled. Pending and disabled accounts may not sign in to use the application. The superuser may suspend or disable access when necessary for operational, security, or policy reasons.',
      },
      {
        title: '5. Your responsibilities',
        body:
          'You are responsible for the accuracy of account information, document contents, recipient data, and any files or links you share through the service. You must keep your credentials secure and may not share account access without permission.',
      },
      {
        title: '6. Acceptable use',
        body:
          'You may not use the service for unlawful, fraudulent, misleading, abusive, or unauthorized activity. You may not upload malicious content, attempt to interfere with the service, or use the platform in a way that harms other users or clients.',
      },
      {
        title: '7. Third-party infrastructure',
        body:
          'The service relies on third-party providers such as Supabase for authentication, storage, and database operations. Service availability may be affected by third-party outages, maintenance, or policy changes.',
      },
      {
        title: '8. Data and retention',
        body:
          'Documents, clients, and related metadata may be stored for as long as needed to operate the service, meet operational requirements, enforce limits, resolve disputes, and maintain system integrity.',
      },
      {
        title: '9. Changes to the service',
        body:
          'We may update features, plan limits, workflows, and these terms from time to time. Continued use of the service after changes become effective means you accept the revised terms.',
      },
    ],
  },
  id: {
    title: 'Syarat & Ketentuan',
    updated: 'Terakhir diperbarui: 14 Maret 2026',
    intro:
      'Syarat & Ketentuan ini mengatur penggunaan idCashier Invoice Generator di https://invoice.idcashier.com. Dengan menggunakan layanan ini, Anda menyetujui syarat berikut.',
    sections: [
      {
        title: '1. Ruang lingkup layanan',
        body:
          'idCashier Invoice Generator menyediakan pembuatan invoice, surat jalan, dan kwitansi, penyimpanan dokumen, pengelolaan klien, serta portal klien versi lihat saja untuk paket yang memenuhi syarat.',
      },
      {
        title: '2. Pendaftaran dan persetujuan',
        body:
          'Pendaftaran publik tersedia melalui email dan password. Akun baru wajib memverifikasi email lalu menunggu persetujuan manual dari superuser platform sebelum akses diaktifkan.',
      },
      {
        title: '3. Paket manual dan kontrol akses',
        body:
          'Penetapan paket dikelola manual oleh superuser platform. Hak akses Free, Starter, dan Pro tidak diperpanjang otomatis. Akses, batasan, dan fitur yang tersedia dapat berubah saat superuser memperbarui status akun atau paket Anda.',
      },
      {
        title: '4. Status akun',
        body:
          'Akun dapat berstatus pending, active, atau disabled. Akun pending dan disabled tidak dapat masuk ke aplikasi. Superuser dapat menangguhkan atau menonaktifkan akses jika diperlukan untuk alasan operasional, keamanan, atau kebijakan.',
      },
      {
        title: '5. Tanggung jawab Anda',
        body:
          'Anda bertanggung jawab atas keakuratan informasi akun, isi dokumen, data penerima, serta file atau tautan yang Anda bagikan melalui layanan. Anda wajib menjaga kerahasiaan kredensial dan tidak boleh membagikan akses akun tanpa izin.',
      },
      {
        title: '6. Penggunaan yang diperbolehkan',
        body:
          'Anda tidak boleh menggunakan layanan ini untuk aktivitas yang melanggar hukum, penipuan, menyesatkan, penyalahgunaan, atau tanpa izin. Anda juga tidak boleh mengunggah konten berbahaya, mengganggu layanan, atau menggunakan platform dengan cara yang merugikan pengguna lain maupun klien.',
      },
      {
        title: '7. Infrastruktur pihak ketiga',
        body:
          'Layanan ini bergantung pada penyedia pihak ketiga seperti Supabase untuk autentikasi, penyimpanan, dan operasi database. Ketersediaan layanan dapat terpengaruh oleh gangguan, pemeliharaan, atau perubahan kebijakan pihak ketiga.',
      },
      {
        title: '8. Data dan retensi',
        body:
          'Dokumen, klien, dan metadata terkait dapat disimpan selama diperlukan untuk menjalankan layanan, memenuhi kebutuhan operasional, menerapkan batasan, menyelesaikan sengketa, dan menjaga integritas sistem.',
      },
      {
        title: '9. Perubahan layanan',
        body:
          'Kami dapat memperbarui fitur, batas paket, alur kerja, dan syarat ini dari waktu ke waktu. Penggunaan berkelanjutan setelah perubahan berlaku berarti Anda menerima syarat yang telah direvisi.',
      },
    ],
  },
} as const;

export default function TermsPage() {
  const { locale } = useI18n();
  const copy = content[locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-sm text-gray-500">{copy.updated}</p>
          <p className="mt-6 leading-7 text-gray-700">{copy.intro}</p>

          <div className="mt-8 space-y-6">
            {copy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                <p className="mt-2 leading-7 text-gray-700">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <LegalLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
