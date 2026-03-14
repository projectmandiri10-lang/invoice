import React from 'react';
import Navbar from '@/components/Navbar';
import LegalLinks from '@/components/LegalLinks';
import { useI18n } from '@/contexts/I18nContext';

const content = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: March 14, 2026',
    intro:
      'This Privacy Policy explains how idCashier Invoice Generator collects, uses, stores, and shares information when you use https://invoice.idcashier.com.',
    sections: [
      {
        title: '1. Information we collect',
        body:
          'We may collect account details, document content, client information, usage records, IP-related technical information, and metadata required to operate the platform and enforce plan limits.',
      },
      {
        title: '2. How we use information',
        body:
          'We use information to authenticate users, verify email addresses, manage account approval status, store documents, render previews, generate exports, support client portals, and maintain service reliability and security.',
      },
      {
        title: '3. Manual administration',
        body:
          'Account status and plan assignments are managed manually by the platform superuser. To do that, the superuser may access account metadata such as email address, created time, verification state, last sign-in time, assigned plan, and account status.',
      },
      {
        title: '4. Third-party services',
        body:
          'The platform uses third-party infrastructure and services, including Supabase for authentication, storage, database operations, and email delivery. Those services may process data under their own terms and privacy policies.',
      },
      {
        title: '5. Storage and retention',
        body:
          'We retain account, document, client, and operational metadata for as long as needed to run the service, enforce limits, resolve disputes, investigate abuse, and comply with legal obligations.',
      },
      {
        title: '6. Data sharing',
        body:
          'We do not sell your personal data. We may share data only with service providers that help operate the platform, or when required by law, legal process, or a legitimate security need.',
      },
      {
        title: '7. Security',
        body:
          'We apply reasonable technical and organizational safeguards, but no system can guarantee absolute security. You are responsible for maintaining the confidentiality of your own credentials and devices.',
      },
      {
        title: '8. Your choices',
        body:
          'You may choose whether to register, what document content to store, and whether to continue using the service. Because account management is administered manually, some requests such as activation, deactivation, or plan changes are handled by the superuser.',
      },
      {
        title: '9. Policy updates',
        body:
          'We may update this Privacy Policy to reflect service changes, security needs, or legal requirements. Continued use after updates become effective means you accept the revised policy.',
      },
    ],
  },
  id: {
    title: 'Kebijakan Privasi',
    updated: 'Terakhir diperbarui: 14 Maret 2026',
    intro:
      'Kebijakan Privasi ini menjelaskan bagaimana idCashier Invoice Generator mengumpulkan, menggunakan, menyimpan, dan membagikan informasi saat Anda menggunakan https://invoice.idcashier.com.',
    sections: [
      {
        title: '1. Informasi yang kami kumpulkan',
        body:
          'Kami dapat mengumpulkan detail akun, isi dokumen, informasi klien, catatan penggunaan, informasi teknis terkait IP, serta metadata yang diperlukan untuk menjalankan platform dan menerapkan batas paket.',
      },
      {
        title: '2. Cara kami menggunakan informasi',
        body:
          'Kami menggunakan informasi untuk mengautentikasi pengguna, memverifikasi email, mengelola status persetujuan akun, menyimpan dokumen, menampilkan preview, menghasilkan export, mendukung portal klien, serta menjaga keandalan dan keamanan layanan.',
      },
      {
        title: '3. Administrasi manual',
        body:
          'Status akun dan penetapan paket dikelola manual oleh superuser platform. Untuk itu, superuser dapat mengakses metadata akun seperti alamat email, waktu pembuatan akun, status verifikasi, waktu login terakhir, paket yang ditetapkan, dan status akun.',
      },
      {
        title: '4. Layanan pihak ketiga',
        body:
          'Platform ini menggunakan infrastruktur dan layanan pihak ketiga, termasuk Supabase untuk autentikasi, penyimpanan, operasi database, dan pengiriman email. Layanan tersebut dapat memproses data berdasarkan syarat dan kebijakan privasi mereka sendiri.',
      },
      {
        title: '5. Penyimpanan dan retensi',
        body:
          'Kami menyimpan metadata akun, dokumen, klien, dan operasional selama diperlukan untuk menjalankan layanan, menerapkan batasan, menyelesaikan sengketa, menyelidiki penyalahgunaan, dan memenuhi kewajiban hukum.',
      },
      {
        title: '6. Pembagian data',
        body:
          'Kami tidak menjual data pribadi Anda. Kami hanya dapat membagikan data kepada penyedia layanan yang membantu operasional platform, atau jika diwajibkan oleh hukum, proses hukum, atau kebutuhan keamanan yang sah.',
      },
      {
        title: '7. Keamanan',
        body:
          'Kami menerapkan langkah teknis dan organisasi yang wajar, tetapi tidak ada sistem yang dapat menjamin keamanan absolut. Anda bertanggung jawab menjaga kerahasiaan kredensial dan perangkat Anda sendiri.',
      },
      {
        title: '8. Pilihan Anda',
        body:
          'Anda dapat memilih apakah ingin mendaftar, konten dokumen apa yang disimpan, dan apakah akan terus menggunakan layanan. Karena pengelolaan akun dilakukan secara manual, beberapa permintaan seperti aktivasi, nonaktifkan akun, atau perubahan paket ditangani oleh superuser.',
      },
      {
        title: '9. Pembaruan kebijakan',
        body:
          'Kami dapat memperbarui Kebijakan Privasi ini untuk mencerminkan perubahan layanan, kebutuhan keamanan, atau kewajiban hukum. Penggunaan berkelanjutan setelah pembaruan berlaku berarti Anda menerima kebijakan yang direvisi.',
      },
    ],
  },
} as const;

export default function PrivacyPage() {
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
