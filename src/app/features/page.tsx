'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Globe, Shield, Download, Printer, Settings, FileText, Palette, Calculator, Clock, Star, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Pembuatan Cepat',
      description: 'Buat invoice profesional dalam hitungan menit tanpa perlu registrasi atau instalasi software.',
      color: 'bg-blue-100 text-blue-600',
      features: ['Tidak perlu registrasi', 'Interface intuitif', 'Hasil instan']
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Template Profesional',
      description: 'Pilih dari berbagai template invoice yang elegan dan profesional untuk berbagai jenis bisnis.',
      color: 'bg-green-100 text-green-600',
      features: ['10+ template pilihan', 'Desain modern', 'Mobile friendly']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi Bahasa & Mata Uang',
      description: 'Mendukung 25+ bahasa dan 50+ mata uang untuk kebutuhan bisnis internasional Anda.',
      color: 'bg-purple-100 text-purple-600',
      features: ['25+ bahasa', '50+ mata uang', 'Format otomatis']
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: 'Kalkulasi Otomatis',
      description: 'Hitung subtotal, pajak, dan total secara otomatis dengan akurasi tinggi.',
      color: 'bg-orange-100 text-orange-600',
      features: ['Perhitungan otomatis', 'Multi pajak', 'Diskon otomatis']
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Export PDF Berkualitas',
      description: 'Download invoice dalam format PDF berkualitas tinggi yang siap untuk dikirim ke klien.',
      color: 'bg-red-100 text-red-600',
      features: ['PDF HD quality', 'Size optimal', 'Compatible semua device']
    },
    {
      icon: <Printer className="w-8 h-8" />,
      title: 'Print Ready',
      description: 'Format yang dioptimalkan untuk pencetakan dengan hasil yang tajam dan profesional.',
      color: 'bg-indigo-100 text-indigo-600',
      features: ['Print optimized', 'High resolution', 'Paper size options']
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Kustomisasi Lengkap',
      description: 'Sesuaikan warna, font, dan layout invoice sesuai dengan brand identity Anda.',
      color: 'bg-pink-100 text-pink-600',
      features: ['Custom colors', 'Font options', 'Layout flexibility']
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Pengaturan Lanjutan',
      description: 'Atur detail bisnis, informasi pajak, dan preferensi lainnya dengan mudah.',
      color: 'bg-yellow-100 text-yellow-600',
      features: ['Business info', 'Tax settings', 'Preferences']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Keamanan Terjamin',
      description: 'Data Anda aman dengan enkripsi tingkat enterprise dan tidak disimpan di server kami.',
      color: 'bg-teal-100 text-teal-600',
      features: ['Data encryption', 'No server storage', 'Privacy first']
    }
  ]

  const benefits = [
    {
      title: 'Hemat Waktu',
      description: 'Kurangi waktu pembuatan invoice hingga 90% dibandingkan metode manual',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Tingkatkan Profesionalisme',
      description: 'Invoice yang rapi dan profesional meningkatkan kepercayaan klien',
      icon: <Star className="w-6 h-6" />
    },
    {
      title: 'Kelola dengan Mudah',
      description: 'Semua fitur dalam satu platform tanpa perlu multiple tools',
      icon: <Settings className="w-6 h-6" />
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
              Fitur Unggulan
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Fitur Lengkap untuk Kebutuhan Invoice Anda
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Semua yang Anda butuhkan untuk membuat invoice profesional dalam satu platform
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Home className="w-5 h-5 mr-2" />
                Coba Sekarang Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur-Fitur Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dilengkapi dengan fitur-fitur canggih untuk memenuhi semua kebutuhan pembuatan invoice Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manfaat nyata yang akan Anda dapatkan dengan menggunakan platform kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-600 border-blue-200">
                Fitur Lanjutan
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Lebih dari Sekadar Invoice Generator
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Platform kami dirancang untuk memberikan pengalaman terbaik dengan fitur-fitur lanjutan yang akan memudahkan pekerjaan Anda.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Auto-Save & Recovery</h4>
                    <p className="text-gray-600">Data Anda tersimpan otomatis dan dapat dipulihkan kapan saja</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Smart Calculations</h4>
                    <p className="text-gray-600">Perhitungan pajak dan diskon yang akurat sesuai aturan lokal</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cloud Sync</h4>
                    <p className="text-gray-600">Akses invoice Anda dari mana saja, kapan saja</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Siap Memulai?</h3>
                <p className="text-blue-100 mb-6">
                  Bergabunglah dengan ribuan pengguna yang telah mempercayai kami untuk kebutuhan invoice mereka.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Gratis selamanya, tidak ada biaya tersembunyi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Tidak perlu instalasi atau registrasi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Hasil instan, siap digunakan</span>
                  </div>
                </div>
                <Link href="/" className="block mt-6">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Mulai Sekarang
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Siap Meningkatkan Efisiensi Bisnis Anda?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Mulai buat invoice profesional sekarang juga dan rasakan kemudahannya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Buat Invoice Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}