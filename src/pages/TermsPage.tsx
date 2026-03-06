import React from 'react';
import Navbar from '@/components/Navbar';
import LegalLinks from '@/components/LegalLinks';
import { useI18n } from '@/contexts/I18nContext';

const content = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: March 6, 2026',
    intro:
      'These Terms of Service govern your use of idCashier Invoice Generator at https://invoice.idcashier.com. By using the service, you agree to these terms.',
    sections: [
      {
        title: '1. Service scope',
        body:
          'idCashier Invoice Generator provides invoice, delivery note, and receipt generation, document storage, client portal access, and selected payment features for eligible paid plans.',
      },
      {
        title: '2. Account and access',
        body:
          'You are responsible for your account credentials and for all activity performed through your account. Free and paid plan entitlements are enforced by the platform and may change when your subscription expires.',
      },
      {
        title: '3. Payments and Duitku',
        body:
          'Platform subscription payments and eligible client invoice payments are processed through Duitku. Available payment methods, fees, redirects, callbacks, and final payment status depend on Duitku and the payment channel selected by the payer.',
      },
      {
        title: '4. Payment status authority',
        body:
          'Displayed redirect results are not the final source of truth. A payment is treated as successful only after callback and/or transaction status verification confirms the final result.',
      },
      {
        title: '5. Your billing responsibilities',
        body:
          'You are responsible for choosing the correct subscription tier, keeping billing information accurate, and ensuring invoice amounts and recipient data are correct before sharing payment links with clients.',
      },
      {
        title: '6. Refunds, disputes, and reversals',
        body:
          'Refunds, charge disputes, and reversals are handled case by case according to platform policy, applicable law, and the rules of Duitku and the selected payment method. Access to paid features may be limited while a dispute is unresolved.',
      },
      {
        title: '7. Acceptable use',
        body:
          'You may not use the service for unlawful, fraudulent, deceptive, or unauthorized payment activity, or to process transactions that violate the policies of Duitku or applicable law.',
      },
      {
        title: '8. Availability and third parties',
        body:
          'The service may rely on third-party providers such as Supabase and Duitku. Service availability, callbacks, and payment completion may be affected by third-party outages or maintenance.',
      },
      {
        title: '9. Changes to the service',
        body:
          'We may update features, limits, pricing presentation, payment options, and these terms from time to time. Continued use of the service after updates means you accept the revised terms.',
      },
    ],
  },
  id: {
    title: 'Syarat & Ketentuan',
    updated: 'Terakhir diperbarui: 6 Maret 2026',
    intro:
      'Syarat & Ketentuan ini mengatur penggunaan idCashier Invoice Generator di https://invoice.idcashier.com. Dengan menggunakan layanan ini, Anda menyetujui syarat berikut.',
    sections: [
      {
        title: '1. Ruang lingkup layanan',
        body:
          'idCashier Invoice Generator menyediakan pembuatan invoice, surat jalan, dan kwitansi, penyimpanan dokumen, akses portal klien, serta fitur pembayaran tertentu untuk paket berbayar yang memenuhi syarat.',
      },
      {
        title: '2. Akun dan akses',
        body:
          'Anda bertanggung jawab atas kredensial akun dan seluruh aktivitas yang dilakukan melalui akun Anda. Hak akses paket gratis maupun berbayar diterapkan oleh platform dan dapat berubah saat masa aktif paket berakhir.',
      },
      {
        title: '3. Pembayaran dan Duitku',
        body:
          'Pembayaran langganan platform dan pembayaran invoice klien yang memenuhi syarat diproses melalui Duitku. Metode pembayaran, biaya, redirect, callback, dan status akhir pembayaran bergantung pada Duitku serta kanal pembayaran yang dipilih pembayar.',
      },
      {
        title: '4. Otoritas status pembayaran',
        body:
          'Hasil redirect yang tampil ke pengguna bukan sumber kebenaran akhir. Pembayaran hanya dianggap berhasil setelah callback dan/atau verifikasi transaction status mengonfirmasi hasil final.',
      },
      {
        title: '5. Tanggung jawab billing Anda',
        body:
          'Anda bertanggung jawab memilih paket langganan yang tepat, menjaga keakuratan informasi billing, serta memastikan nominal invoice dan data penerima benar sebelum membagikan tautan pembayaran ke klien.',
      },
      {
        title: '6. Refund, sengketa, dan reversal',
        body:
          'Refund, sengketa transaksi, dan reversal ditangani per kasus sesuai kebijakan platform, hukum yang berlaku, serta ketentuan Duitku dan metode pembayaran yang dipilih. Akses fitur berbayar dapat dibatasi selama sengketa belum selesai.',
      },
      {
        title: '7. Penggunaan yang diperbolehkan',
        body:
          'Anda tidak boleh menggunakan layanan ini untuk aktivitas yang melanggar hukum, penipuan, penyalahgunaan pembayaran, atau transaksi yang bertentangan dengan kebijakan Duitku maupun hukum yang berlaku.',
      },
      {
        title: '8. Ketersediaan dan pihak ketiga',
        body:
          'Layanan ini dapat bergantung pada penyedia pihak ketiga seperti Supabase dan Duitku. Ketersediaan layanan, callback, dan penyelesaian pembayaran dapat terpengaruh oleh gangguan atau pemeliharaan pihak ketiga.',
      },
      {
        title: '9. Perubahan layanan',
        body:
          'Kami dapat memperbarui fitur, batasan, tampilan harga, opsi pembayaran, dan syarat ini dari waktu ke waktu. Penggunaan berkelanjutan setelah pembaruan berarti Anda menerima syarat yang telah direvisi.',
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
