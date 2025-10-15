'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Video, FileText, MessageCircle, Home, ArrowRight, ExternalLink, Clock, Users, Zap, Shield, Download, Printer, Settings, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua Topik', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'getting-started', name: 'Memulai', icon: <Zap className="w-4 h-4" /> },
    { id: 'features', name: 'Fitur', icon: <Settings className="w-4 h-4" /> },
    { id: 'billing', name: 'Pembayaran', icon: <Download className="w-4 h-4" /> },
    { id: 'technical', name: 'Teknis', icon: <Shield className="w-4 h-4" /> },
    { id: 'account', name: 'Akun', icon: <Users className="w-4 h-4" /> }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'Cara Membuat Invoice Pertama Anda',
      category: 'getting-started',
      description: 'Panduan langkah demi langkah untuk membuat invoice pertama dengan mudah',
      content: 'Pelajari cara membuat invoice profesional dalam hitungan menit',
      readTime: '3 menit',
      difficulty: 'Pemula',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Menggunakan Template Invoice',
      category: 'features',
      description: 'Cara memilih dan mengkustomisasi template invoice sesuai kebutuhan',
      content: 'Temukan template yang sempurna untuk bisnis Anda',
      readTime: '5 menit',
      difficulty: 'Pemula',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Setting Mata Uang dan Bahasa',
      category: 'features',
      description: 'Panduan mengatur mata uang dan bahasa untuk invoice internasional',
      content: 'Konfigurasi invoice untuk klien global',
      readTime: '4 menit',
      difficulty: 'Menengah',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Menambahkan Pajak dan Diskon',
      category: 'features',
      description: 'Cara menghitung dan menambahkan pajak serta diskon otomatis',
      content: 'Perhitungan otomatis untuk akurasi maksimal',
      readTime: '6 menit',
      difficulty: 'Menengah',
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Download dan Print Invoice',
      category: 'technical',
      description: 'Cara mendownload invoice dalam PDF dan mencetak dengan benar',
      content: 'Dapatkan invoice dalam format yang Anda butuhkan',
      readTime: '3 menit',
      difficulty: 'Pemula',
      icon: <Download className="w-5 h-5" />
    },
    {
      id: 6,
      title: 'Troubleshooting Umum',
      category: 'technical',
      description: 'Solusi untuk masalah-masalah yang sering terjadi',
      content: 'Atasi masalah teknis dengan mudah',
      readTime: '8 menit',
      difficulty: 'Menengah',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 7,
      title: 'Keamanan Data Invoice',
      category: 'technical',
      description: 'Bagaimana kami melindungi data dan privasi Anda',
      content: 'Keamanan adalah prioritas utama kami',
      readTime: '5 menit',
      difficulty: 'Menengah',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 8,
      title: 'Tips Invoice Profesional',
      category: 'getting-started',
      description: 'Cara membuat invoice yang terlihat profesional dan efektif',
      content: 'Tingkatkan citra bisnis Anda',
      readTime: '7 menit',
      difficulty: 'Pemula',
      icon: <BookOpen className="w-5 h-5" />
    }
  ]

  const videoTutorials = [
    {
      id: 1,
      title: 'Tutorial Lengkap: Buat Invoice dalam 2 Menit',
      duration: '2:34',
      thumbnail: '/api/placeholder/320/180',
      views: '12.5K',
      category: 'getting-started'
    },
    {
      id: 2,
      title: 'Cara Kustomisasi Template Invoice',
      duration: '5:12',
      thumbnail: '/api/placeholder/320/180',
      views: '8.3K',
      category: 'features'
    },
    {
      id: 3,
      title: 'Setting Pajak untuk Bisnis Indonesia',
      duration: '4:45',
      thumbnail: '/api/placeholder/320/180',
      views: '6.7K',
      category: 'features'
    }
  ]

  const quickActions = [
    {
      title: 'Video Tutorial',
      description: 'Tonton panduan visual langkah demi langkah',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
      action: 'Tonton Sekarang'
    },
    {
      title: 'Live Chat Support',
      description: 'Chat dengan tim support kami',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
      action: 'Mulai Chat'
    },
    {
      title: 'FAQ',
      description: 'Jawaban untuk pertanyaan umum',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      action: 'Lihat FAQ'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-600'
      case 'Menengah': return 'bg-yellow-100 text-yellow-600'
      case 'Lanjutan': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Pusat Bantuan
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Kami Siap Membantu Anda
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Temukan jawaban, tutorial, dan panduan untuk menggunakan invoice generator kami
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari bantuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        {action.action}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Panduan</h2>
                
                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                        {category.icon}
                        <span className="hidden sm:inline">{category.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Articles Grid */}
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            {article.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {article.title}
                              </h3>
                              <Badge className={getDifficultyColor(article.difficulty)}>
                                {article.difficulty}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{article.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>Artikel</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                                Baca Selengkapnya
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Artikel Ditemukan</h3>
                    <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian atau kategori</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                      }}
                    >
                      Reset Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Video Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Video Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {videoTutorials.map((video) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="relative rounded-lg overflow-hidden mb-2">
                        <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white/80" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-black/60 text-white text-xs">
                          {video.duration}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500">{video.views} views</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Topik Populer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Cara membuat invoice',
                    'Template invoice gratis',
                    'Setting pajak',
                    'Download PDF',
                    'Kustomisasi desain',
                    'Multi bahasa'
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{topic}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Butuh Bantuan Langsung?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100 text-sm">
                    Tim support kami siap membantu Anda 24/7
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Masih Punya Pertanyaan?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jangan ragu untuk menghubungi tim support kami yang siap membantu Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Hubungi Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}