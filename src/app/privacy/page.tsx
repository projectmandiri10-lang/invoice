'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Database, UserCheck, Home, ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  const lastUpdated = '15 Oktober 2024'

  const privacyPrinciples = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privasi adalah Hak',
      description: 'Kami percaya bahwa privasi adalah hak fundamental dan kami berkomitmen untuk melindunginya.'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Keamanan Data',
      description: 'Data Anda dilindungi dengan enkripsi tingkat enterprise dan keamanan berlapis.'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Transparansi Penuh',
      description: 'Kami jelas tentang data apa yang kami kumpulkan dan bagaimana kami menggunakannya.'
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Kontrol Pengguna',
      description: 'Anda memiliki kontrol penuh atas data Anda dan dapat menghapusnya kapan saja.'
    }
  ]

  const dataCategories = [
    {
      title: 'Data yang TIDAK Kami Kumpulkan',
      items: [
        'Informasi pribadi (nama, email, nomor telepon)',
        'Alamat rumah atau kantor',
        'Informasi pembayaran atau kartu kredit',
        'Password atau kredensial login',
        'Data lokasi GPS',
        'Riwayat browsing',
        'Informasi identitas pribadi (KTP, SIM, dll)'
      ],
      type: 'safe',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      title: 'Data yang Mungkin Diakses (Sementara)',
      items: [
        'Data invoice yang sedang dibuat (di browser lokal)',
        'Preferensi bahasa dan mata uang',
        'Template yang dipilih',
        'Pengaturan tampilan sementara'
      ],
      type: 'temporary',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  ]

  const yourRights = [
    {
      title: 'Hak untuk Tahu',
      description: 'Anda berhak mengetahui data apa saja yang kami proses dan bagaimana kami menggunakannya.'
    },
    {
      title: 'Hak untuk Menghapus',
      description: 'Anda dapat menghapus semua data Anda kapan saja dengan membersihkan browser atau menutup tab.'
    },
    {
      title: 'Hak untuk Koreksi',
      description: 'Anda dapat mengkoreksi data yang salah sebelum menyimpan atau mengunduh invoice.'
    },
    {
      title: 'Hak untuk Menolak',
      description: 'Anda berhak menolak pengumpulan data dengan tidak menggunakan layanan kami.'
    }
  ]

  const securityMeasures = [
    'Enkripsi SSL/TLS untuk semua komunikasi',
    'Tidak ada penyimpanan data di server',
    'Pemrosesan data lokal di browser',
    'Keamanan berlapis pada infrastruktur',
    'Audit keamanan berkala',
    'Kepatuhan terhadap standar internasional'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Kebijakan Privasi
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Privasi Anda Adalah Prioritas Kami
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Kami tidak mengumpulkan data pribadi Anda. Semua data invoice diproses secara lokal di browser Anda.
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

      {/* Key Message */}
      <section className="py-12 bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-3">
              Kami TIDAK Mengumpulkan Data Pribadi Anda
            </h2>
            <p className="text-green-700 max-w-3xl mx-auto">
              Tidak ada registrasi, tidak ada login, tidak ada penyimpanan data di server. Data Anda tetap privat dan aman.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Prinsip Privasi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nilai-nilai yang mendasari pendekatan kami terhadap privasi data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {privacyPrinciples.map((principle, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {principle.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{principle.title}</h3>
                <p className="text-gray-600 text-sm">{principle.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {dataCategories.map((category, index) => (
              <Card key={index} className={`${category.type === 'safe' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {category.icon}
                    <span className="text-xl">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          {category.type === 'safe' ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Info className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Kami Melindungi Data Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi dan proses yang kami gunakan untuk menjaga privasi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tidak Ada Database</h3>
              <p className="text-gray-600">Kami tidak memiliki database pengguna atau database invoice.</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Enkripsi Lokal</h3>
              <p className="text-gray-600">Data diproses dan dienkripsi langsung di browser Anda.</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Zero-Knowledge</h3>
              <p className="text-gray-600">Kami tidak memiliki akses ke data invoice Anda.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hak Anda sebagai Pengguna
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kontrol penuh atas data Anda adalah hak fundamental Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {yourRights.map((right, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{right.title}</h3>
                  <p className="text-gray-600">{right.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-600 border-blue-200">
                Keamanan
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Langkah Keamanan yang Kami Terapkan
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Kami menggunakan standar keamanan tertinggi untuk melindungi platform dan privasi Anda.
              </p>
              
              <div className="space-y-4">
                {securityMeasures.map((measure, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-8">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Penting untuk Diketahui</h3>
                  <div className="space-y-3 text-blue-100">
                    <p>• Data invoice hanya ada selama sesi browser aktif</p>
                    <p>• Setelah menutup tab, semua data akan hilang</p>
                    <p>• Simpan file PDF jika perlu backup invoice</p>
                    <p>• Kami tidak bertanggung jawab atas kehilangan data lokal</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Privacy */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Pertanyaan Tentang Privasi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang privasi data Anda, jangan ragu untuk menghubungi kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Hubungi Privacy Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline">
                Lihat FAQ Privasi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Kebijakan Privasi ini terakhir diperbarui pada: <strong>{lastUpdated}</strong>
            </p>
            <p className="text-sm">
              Dengan menggunakan layanan kami, Anda menyetujui praktik privasi yang dijelaskan dalam kebijakan ini.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}