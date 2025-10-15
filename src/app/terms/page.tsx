'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Shield, AlertTriangle, CheckCircle, Home, ArrowRight, Users, Gavel, Zap } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const lastUpdated = '15 Oktober 2024'

  const keyPoints = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Gratis Selamanya',
      description: 'Layanan dasar kami gratis tanpa biaya tersembunyi.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Tidak Ada Registrasi',
      description: 'Gunakan semua fitur tanpa perlu membuat akun.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Responsibilitas Pengguna',
      description: 'Anda bertanggung jawab atas konten yang Anda buat.'
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: 'Kepatuhan Hukum',
      description: 'Gunakan layanan sesuai dengan hukum yang berlaku.'
    }
  ]

  const termsSections = [
    {
      title: '1. Penerimaan Syarat dan Ketentuan',
      content: [
        'Dengan mengakses dan menggunakan MJW Perfect INVOICE Maker Free, Anda menerima dan setuju untuk terikat oleh Syarat dan Ketentuan ini.',
        'Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan layanan kami.',
        'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu dengan memberitahukan pengguna melalui website.'
      ]
    },
    {
      title: '2. Deskripsi Layanan',
      content: [
        'MJW Perfect INVOICE Maker Free adalah alat online gratis untuk membuat invoice profesional.',
        'Layanan kami mencakup: template invoice, kalkulasi otomatis, multi bahasa, export PDF, dan fitur dasar lainnya.',
        'Tidak diperlukan instalasi software atau registrasi untuk menggunakan layanan dasar.'
      ]
    },
    {
      title: '3. Penggunaan yang Diperbolehkan',
      content: [
        'Membuat invoice untuk keperluan bisnis yang sah dan legal.',
        'Menggunakan template yang disediakan untuk keperluan komersial dan pribadi.',
        'Mengkustomisasi invoice sesuai dengan kebutuhan bisnis Anda.',
        'Mendownload dan menyimpan invoice dalam format PDF untuk arsip.'
      ]
    },
    {
      title: '4. Penggunaan yang Dilarang',
      content: [
        'Membuat invoice palsu atau untuk transaksi fiktif.',
        'Menggunakan layanan untuk aktivitas ilegal atau penipuan.',
        'Mencoba meretas, membobol, atau merusak sistem kami.',
        'Menggunakan konten yang melanggar hak cipta atau hak kekayaan intelektual.',
        'Membuat invoice untuk barang atau jasa yang ilegal.'
      ]
    },
    {
      title: '5. Hak Kekayaan Intelektual',
      content: [
        'Semua template, desain, dan konten di website ini dilindungi oleh hak cipta.',
        'Anda diperbolehkan menggunakan invoice yang Anda buat untuk keperluan komersial.',
        'Anda tidak diperbolehkan menjual ulang, mendistribusikan, atau mengklaim template kami sebagai milik Anda.',
        'Logo dan merek "MJW Perfect INVOICE Maker Free" adalah milik kami.'
      ]
    },
    {
      title: '6. Privasi dan Data',
      content: [
        'Kami tidak mengumpulkan data pribadi Anda.',
        'Data invoice diproses secara lokal di browser Anda.',
        'Kami tidak menyimpan invoice Anda di server kami.',
        'Anda bertanggung jawab untuk menyimpan backup invoice yang Anda butuhkan.',
        'Untuk detail lengkap, lihat Kebijakan Privasi kami.'
      ]
    },
    {
      title: '7. Pembatasan Tanggung Jawab',
      content: [
        'Layanan disediakan "sebagaimana adanya" tanpa jaminan apapun.',
        'Kami tidak bertanggung jawab atas kehilangan data yang terjadi di browser Anda.',
        'Kami tidak bertanggung jawab atas akurasi atau keabsahan invoice yang Anda buat.',
        'Pengguna bertanggung jawab penuh atas konten invoice yang dibuat.',
        'Kami tidak bertanggung jawab atas kerugian bisnis yang timbul dari penggunaan layanan.'
      ]
    },
    {
      title: '8. Ketersediaan Layanan',
      content: [
        'Kami berusaha menjaga layanan tersedia 24/7, namun tidak ada jaminan 100% uptime.',
        'Kami berhak melakukan maintenance atau downtime untuk perbaikan sistem.',
        'Kami tidak bertanggung jawab atas kerugian akibat downtime layanan.',
        'Layanan dapat dihentikan sementara atau permanen dengan pemberitahuan sebelumnya.'
      ]
    },
    {
      title: '9. Perubahan Layanan',
      content: [
        'Kami berhak menambah, mengubah, atau menghapus fitur sewaktu-waktu.',
        'Perubahan signifikan akan diinformasikan melalui website.',
        'Pengguna setuju bahwa layanan dapat berubah dari waktu ke waktu.',
        'Kami tidak bertanggung jawab jika perubahan tidak sesuai dengan kebutuhan Anda.'
      ]
    },
    {
      title: '10. Terminasi',
      content: [
        'Kami berhak menghentikan akses pengguna yang melanggar syarat dan ketentuan.',
        'Pengguna dapat berhenti menggunakan layanan kapan saja.',
        'Setelah terminasi, hak akses ke layanan akan dihentikan segera.',
        'Beberapa ketentuan akan tetap berlaku setelah terminasi.'
      ]
    },
    {
      title: '11. Hukum yang Berlaku',
      content: [
        'Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.',
        'Sengketa akan diselesaikan melalui negosiasi terlebih dahulu.',
        'Jika tidak ada kesepakatan, sengketa akan diselesaikan melalui pengadilan yang berwenang.',
        'Bahasa resmi adalah Bahasa Indonesia.'
      ]
    },
    {
      title: '12. Kontak',
      content: [
        'Untuk pertanyaan tentang syarat dan ketentuan, hubungi kami melalui:',
        'Email: support@mjwinvoice.com',
        'Website: www.mjwinvoice.com',
        'Kami akan berusaha merespons pertanyaan Anda dalam waktu 24 jam pada hari kerja.'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Syarat & Ketentuan
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Syarat & Ketentuan Layanan
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Aturan main untuk menggunakan MJW Perfect INVOICE Maker Free secara bertanggung jawab
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 bg-blue-50 border-y border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">
              Prinsip Dasar Layanan Kami
            </h2>
            <p className="text-blue-700">
              Empat poin penting yang perlu Anda ketahui
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPoints.map((point, index) => (
              <Card key={index} className="bg-white border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                    {point.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8 text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Syarat & Ketentuan Lengkap
              </h2>
              <p className="text-gray-600">
                Terakhir diperbarui: {lastUpdated}
              </p>
            </div>

            <div className="space-y-8">
              {termsSections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Penting
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Hal yang Perlu Diperhatikan
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Gunakan Secara Bertanggung Jawab</h4>
                    <p className="text-gray-600">Anda bertanggung jawab penuh atas konten invoice yang Anda buat.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Simpan Backup Anda</h4>
                    <p className="text-gray-600">Kami tidak menyimpan data, pastikan Anda menyimpan invoice yang penting.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Patuhi Hukum</h4>
                    <p className="text-gray-600">Gunakan layanan sesuai dengan hukum dan regulasi yang berlaku.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-8">
                  <AlertTriangle className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Peringatan</h3>
                  <div className="space-y-3 text-orange-100">
                    <p>• Jangan gunakan untuk aktivitas ilegal</p>
                    <p>• Jangan buat invoice palsu atau fiktif</p>
                    <p>• Jangan mencoba merusak sistem</p>
                    <p>• Pelanggaran dapat mengakibatkan pemblokiran akses</p>
                  </div>
                  <div className="mt-6 p-4 bg-white/20 rounded-lg">
                    <p className="text-sm font-medium">
                      Dengan menggunakan layanan kami, Anda menyatakan telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Pertanyaan Tentang Syarat & Ketentuan?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jika ada bagian yang tidak jelas atau perlu penjelasan lebih lanjut, jangan ragu untuk menghubungi kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Hubungi Kami
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline">
                Lihat FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2">
              Syarat & Ketentuan ini terakhir diperbarui pada: <strong>{lastUpdated}</strong>
            </p>
            <p className="text-gray-400 text-sm">
              Penggunaan layanan ini tunduk pada syarat dan ketentuan yang berlaku.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}