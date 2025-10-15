'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, ChevronDown, ChevronUp, Home, ArrowRight, HelpCircle, BookOpen, MessageCircle, Zap, Shield, Download, Settings, FileText, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'getting-started', name: 'Memulai', icon: <Zap className="w-4 h-4" /> },
    { id: 'features', name: 'Fitur', icon: <Settings className="w-4 h-4" /> },
    { id: 'billing', name: 'Harga', icon: <Download className="w-4 h-4" /> },
    { id: 'technical', name: 'Teknis', icon: <Shield className="w-4 h-4" /> },
    { id: 'account', name: 'Akun', icon: <Users className="w-4 h-4" /> }
  ]

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: 'Apakah MJW Perfect INVOICE Maker Free benar-benar gratis?',
      answer: 'Ya, semua fitur dasar kami gratis selamanya. Tidak ada biaya tersembunyi, tidak perlu registrasi, dan tidak ada batasan penggunaan. Kami percaya bahwa setiap bisnis berhak mendapatkan tools profesional tanpa biaya.',
      helpful: 45,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Bagaimana cara membuat invoice pertama saya?',
      answer: 'Sangat mudah! 1) Buka halaman utama, 2) Isi informasi bisnis dan klien Anda, 3) Tambahkan item barang/jasa, 4) Atur pajak jika diperlukan, 5) Preview dan download PDF. Semua proses hanya membutuhkan 2-3 menit.',
      helpful: 38,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 3,
      category: 'features',
      question: 'Apakah saya bisa mengkustomisasi template invoice?',
      answer: 'Tentu saja! Kami menyediakan berbagai template profesional yang bisa Anda kustomisasi sesuai brand Anda. Anda bisa mengubah warna, font, logo, dan layout sesuai keinginan.',
      helpful: 52,
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 4,
      category: 'features',
      question: 'Berapa banyak item yang bisa saya tambahkan dalam satu invoice?',
      answer: 'Tidak ada batasan! Anda bisa menambahkan sebanyak mungkin item yang Anda butuhkan dalam satu invoice. Sistem kami dirancang untuk menghandle invoice dengan jumlah item yang banyak.',
      helpful: 29,
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 5,
      category: 'features',
      question: 'Apakah mendukung multiple mata uang?',
      answer: 'Ya, kami mendukung 50+ mata uang dari seluruh dunia termasuk IDR, USD, EUR, GBP, JPY, dan lainnya. Format otomatis akan menyesuaikan dengan simbol dan format mata uang yang dipilih.',
      helpful: 41,
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 6,
      category: 'technical',
      question: 'Apakah data saya aman?',
      answer: 'Keamanan adalah prioritas utama kami. Data Anda tidak disimpan di server kami dan diproses secara lokal di browser Anda. Kami menggunakan enkripsi SSL untuk semua komunikasi dan tidak pernah membagikan data Anda dengan pihak ketiga.',
      helpful: 67,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 7,
      category: 'technical',
      question: 'Browser apa yang didukung?',
      answer: 'Kami mendukung semua browser modern termasuk Chrome, Firefox, Safari, Edge, dan Opera. Pastikan browser Anda selalu update untuk pengalaman terbaik.',
      helpful: 22,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 8,
      category: 'technical',
      question: 'Apakah bisa digunakan di mobile?',
      answer: 'Ya, website kami fully responsive dan bekerja dengan sempurna di smartphone dan tablet. Interface yang mobile-friendly memudahkan Anda membuat invoice dimana saja.',
      helpful: 35,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 9,
      category: 'billing',
      question: 'Apakah ada fitur berbayar?',
      answer: 'Saat ini semua fitur gratis. Di masa depan kami mungkin menambahkan fitur premium opsional, namun fitur dasar akan tetap gratis selamanya.',
      helpful: 48,
      icon: <Download className="w-5 h-5" />
    },
    {
      id: 10,
      category: 'billing',
      question: 'Apakah ada batasan download PDF?',
      answer: 'Tidak ada batasan sama sekali. Anda bisa mendownload sebanyak mungkin invoice yang Anda butuhkan tanpa batasan harian, bulanan, atau total.',
      helpful: 31,
      icon: <Download className="w-5 h-5" />
    },
    {
      id: 11,
      category: 'account',
      question: 'Apakah perlu membuat akun?',
      answer: 'Tidak perlu! Anda bisa langsung menggunakan semua fitur tanpa registrasi. Ini membuat proses lebih cepat dan data Anda lebih privasi.',
      helpful: 56,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 12,
      category: 'account',
      question: 'Bagaimana cara menyimpan invoice untuk nanti?',
      answer: 'Karena tidak menggunakan akun, invoice Anda tidak tersimpan di server kami. Namun Anda bisa menyimpan file PDF yang sudah didownload atau menggunakan fitur print/save browser untuk menyimpan halaman.',
      helpful: 19,
      icon: <Users className="w-5 h-5" />
    }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const popularQuestions = faqData.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Temukan jawaban untuk pertanyaan umum tentang invoice generator kami
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
              <div className="text-gray-600">Pertanyaan Terjawab</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
              <div className="text-gray-600">Kepuasan Pengguna</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">&lt; 1hr</div>
              <div className="text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ List */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {searchTerm ? `Hasil Pencarian (${filteredFAQs.length})` : 'Semua Pertanyaan'}
                </h2>
                
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

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div 
                          className="cursor-pointer"
                          onClick={() => toggleExpanded(faq.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                {faq.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-4">
                                  {faq.question}
                                </h3>
                                {expandedItems.includes(faq.id) && (
                                  <div className="text-gray-600 leading-relaxed mb-4">
                                    {faq.answer}
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <Badge variant="secondary" className="text-xs">
                                      {categories.find(c => c.id === faq.category)?.name}
                                    </Badge>
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4" />
                                      <span>{faq.helpful} membantu</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-blue-600">
                                    {expandedItems.includes(faq.id) ? (
                                      <ChevronUp className="w-5 h-5" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Pertanyaan Ditemukan</h3>
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
              {/* Popular Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Pertanyaan Populer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {popularQuestions.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        toggleExpanded(faq.id)
                        // Scroll to the question
                        const element = document.getElementById(`faq-${faq.id}`)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {faq.question}
                      </h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === faq.category)?.name}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>{faq.helpful}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Masih Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100 text-sm">
                    Tidak menemukan jawaban yang Anda cari? Tim support kami siap membantu.
                  </p>
                  <div className="space-y-2">
                    <Link href="/contact">
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Hubungi Support
                      </Button>
                    </Link>
                    <Link href="/help-center">
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Help Center
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Kategori</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <div 
                      key={category.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {category.icon}
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {faqData.filter(faq => faq.category === category.id).length}
                      </span>
                    </div>
                  ))}
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
            Tidak Menemukan Jawaban?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jangan ragu untuk menghubungi tim support kami yang siap membantu Anda 24/7.
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