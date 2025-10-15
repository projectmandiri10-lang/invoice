'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Users, Globe, Shield, Zap, Award, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Tentang Kami
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              MJW Perfect INVOICE Maker Free
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Solusi pembuatan invoice profesional yang cepat, mudah, dan gratis untuk bisnis Anda
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

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Our Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Cerita Kami</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    MJW Perfect INVOICE Maker Free lahir dari kebutuhan akan solusi pembuatan invoice yang 
                    sederhana namun powerful. Kami memahami bahwa setiap bisnis, dari usaha kecil hingga 
                    perusahaan besar, membutuhkan dokumen invoice yang profesional dan terpercaya.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Dengan pengalaman lebih dari 5 tahun dalam bidang pengembangan software bisnis, 
                    kami berkomitmen untuk menyediakan tools yang mudah digunakan, fitur lengkap, 
                    dan tentu saja gratis untuk membantu UMKM Indonesia berkembang.
                  </p>
                </CardContent>
              </Card>

              {/* Our Mission */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Misi Kami</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Mudah Digunakan</h4>
                        <p className="text-gray-600">Interface yang intuitif dan user-friendly untuk semua kalangan</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Gratis Selamanya</h4>
                        <p className="text-gray-600">Tidak ada biaya tersembunyi, semua fitur gratis untuk digunakan</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Profesional</h4>
                        <p className="text-gray-600">Template yang elegan dan sesuai standar bisnis internasional</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Terpercaya</h4>
                        <p className="text-gray-600">Keamanan data dan privasi Anda adalah prioritas kami</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Our Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Nilai-Nilai Kami</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Kepercayaan</h4>
                      <p className="text-gray-600 text-sm">Membangun kepercayaan melalui kualitas dan konsistensi</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Inovasi</h4>
                      <p className="text-gray-600 text-sm">Terus berinovasi untuk memberikan solusi terbaik</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Kolaborasi</h4>
                      <p className="text-gray-600 text-sm">Bekerja sama dengan pengguna untuk pengembangan berkelanjutan</p>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-lg">
                      <Globe className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Global</h4>
                      <p className="text-gray-600 text-sm">Mendukung bisnis lokal dengan standar global</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Statistik Kami</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Invoice Dibuat</span>
                    <span className="font-bold text-blue-600">100,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pengguna Aktif</span>
                    <span className="font-bold text-green-600">50,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Negara</span>
                    <span className="font-bold text-purple-600">25+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kepuasan</span>
                    <span className="font-bold text-orange-600">98%</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Mulai Sekarang!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100">
                    Bergabunglah dengan ribuan pengguna yang telah mempercayai kami untuk kebutuhan invoice mereka.
                  </p>
                  <Link href="/" className="block">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                      Buat Invoice Gratis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Hubungi Kami</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">support@mjwinvoice.com</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jam Operasional</p>
                    <p className="text-gray-600">Senin - Jumat: 09:00 - 18:00 WIB</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur-fitur unggulan yang membuat kami menjadi pilihan terbaik untuk kebutuhan invoice Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cepat & Mudah</h3>
              <p className="text-gray-600">Buat invoice profesional dalam hitungan menit tanpa perlu registrasi</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600">Data Anda aman dan tersimpan dengan enkripsi tingkat enterprise</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi Bahasa</h3>
              <p className="text-gray-600">Mendukung 25+ bahasa untuk kebutuhan bisnis internasional</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Template Profesional</h3>
              <p className="text-gray-600">Berbagai template elegan yang dapat disesuaikan dengan brand Anda</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dukungan 24/7</h3>
              <p className="text-gray-600">Tim support siap membantu Anda kapan saja dibutuhkan</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gratis Selamanya</h3>
              <p className="text-gray-600">Tidak ada biaya tersembunyi, gunakan semua fitur secara gratis</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}