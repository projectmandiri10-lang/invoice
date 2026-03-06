import React from 'react';
import Navbar from '@/components/Navbar';
import LegalLinks from '@/components/LegalLinks';
import { useI18n } from '@/contexts/I18nContext';

const content = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: March 6, 2026',
    intro:
      'This Privacy Policy explains how idCashier Invoice Generator collects, uses, stores, and shares information when you use https://invoice.idcashier.com.',
    sections: [
      {
        title: '1. Information we collect',
        body:
          'We may collect account details, document content, client information, invoice metadata, payment metadata, usage records, and technical information required to operate the platform.',
      },
      {
        title: '2. How we use information',
        body:
          'We use data to authenticate users, save and render documents, enforce plan limits, provide billing access, enable client portals, support invoice payments, and improve service reliability.',
      },
      {
        title: '3. Duitku-related processing',
        body:
          'When payment features are used, transaction-related information may be shared with Duitku and the selected payment channel to create payment instructions, process callbacks, verify transaction status, prevent fraud, and reconcile payment results.',
      },
      {
        title: '4. Payment status records',
        body:
          'We may store merchant order IDs, payment method identifiers, references, callback payloads, inquiry payloads, and invoice or billing status changes related to Duitku transactions.',
      },
      {
        title: '5. Storage and retention',
        body:
          'We retain account, document, client, and payment metadata for as long as needed to operate the service, comply with legal obligations, resolve disputes, and maintain accurate billing and invoice history.',
      },
      {
        title: '6. Third-party services',
        body:
          'The platform uses third-party infrastructure and services, including Supabase for data and authentication and Duitku for payment processing. Their services may process data under their own terms and policies.',
      },
      {
        title: '7. Security',
        body:
          'We apply reasonable technical and organizational measures to protect data, but no system can guarantee absolute security. You are responsible for safeguarding your own account access.',
      },
      {
        title: '8. Your choices',
        body:
          'You may manage saved documents and clients within the app, and you may stop using payment features if you no longer want payment links to be generated for invoices.',
      },
      {
        title: '9. Policy updates',
        body:
          'We may update this Privacy Policy to reflect changes in the service, legal requirements, or payment processing practices. Continued use after updates means you accept the revised policy.',
      },
    ],
  },
  id: {
    title: 'Kebijakan Privasi',
    updated: 'Terakhir diperbarui: 6 Maret 2026',
    intro:
      'Kebijakan Privasi ini menjelaskan bagaimana idCashier Invoice Generator mengumpulkan, menggunakan, menyimpan, dan membagikan informasi saat Anda menggunakan https://invoice.idcashier.com.',
    sections: [
      {
        title: '1. Informasi yang kami kumpulkan',
        body:
          'Kami dapat mengumpulkan detail akun, isi dokumen, informasi klien, metadata invoice, metadata pembayaran, catatan penggunaan, dan informasi teknis yang diperlukan untuk menjalankan platform.',
      },
      {
        title: '2. Cara kami menggunakan informasi',
        body:
          'Kami menggunakan data untuk mengautentikasi pengguna, menyimpan dan menampilkan dokumen, menerapkan limit paket, menyediakan akses billing, mengaktifkan portal klien, mendukung pembayaran invoice, dan meningkatkan keandalan layanan.',
      },
      {
        title: '3. Pemrosesan terkait Duitku',
        body:
          'Saat fitur pembayaran digunakan, informasi terkait transaksi dapat dibagikan ke Duitku dan kanal pembayaran yang dipilih untuk membuat instruksi pembayaran, memproses callback, memverifikasi transaction status, mencegah fraud, dan merekonsiliasi hasil pembayaran.',
      },
      {
        title: '4. Catatan status pembayaran',
        body:
          'Kami dapat menyimpan merchant order ID, identifier metode pembayaran, reference, payload callback, payload inquiry, serta perubahan status invoice atau billing yang terkait dengan transaksi Duitku.',
      },
      {
        title: '5. Penyimpanan dan retensi',
        body:
          'Kami menyimpan metadata akun, dokumen, klien, dan pembayaran selama diperlukan untuk menjalankan layanan, memenuhi kewajiban hukum, menyelesaikan sengketa, dan menjaga histori billing serta invoice tetap akurat.',
      },
      {
        title: '6. Layanan pihak ketiga',
        body:
          'Platform ini menggunakan infrastruktur dan layanan pihak ketiga, termasuk Supabase untuk data dan autentikasi serta Duitku untuk pemrosesan pembayaran. Layanan mereka dapat memproses data berdasarkan syarat dan kebijakan mereka sendiri.',
      },
      {
        title: '7. Keamanan',
        body:
          'Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data, tetapi tidak ada sistem yang dapat menjamin keamanan absolut. Anda bertanggung jawab menjaga akses akun Anda sendiri.',
      },
      {
        title: '8. Pilihan Anda',
        body:
          'Anda dapat mengelola dokumen dan klien yang tersimpan di dalam aplikasi, dan Anda dapat berhenti menggunakan fitur pembayaran jika tidak lagi ingin menghasilkan tautan pembayaran untuk invoice.',
      },
      {
        title: '9. Pembaruan kebijakan',
        body:
          'Kami dapat memperbarui Kebijakan Privasi ini untuk mencerminkan perubahan layanan, kewajiban hukum, atau praktik pemrosesan pembayaran. Penggunaan berkelanjutan setelah pembaruan berarti Anda menerima kebijakan yang direvisi.',
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
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-sm text-gray-500">{copy.updated}</p>
          <p className="mt-6 text-gray-700 leading-7">{copy.intro}</p>

          <div className="mt-8 space-y-6">
            {copy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                <p className="mt-2 text-gray-700 leading-7">{section.body}</p>
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
