'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Clock, User, ArrowRight, Home, BookOpen, TrendingUp, Lightbulb, FileText, MessageCircle, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua', icon: <FileText className="w-4 h-4" /> },
    { id: 'tips', name: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'business', name: 'Bisnis', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'tutorial', name: 'Tutorial', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'news', name: 'Berita', icon: <MessageCircle className="w-4 h-4" /> }
  ]

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips Membuat Invoice Profesional yang Meningkatkan Kredibilitas Bisnis',
      excerpt: 'Pelajari cara membuat invoice yang tidak hanya rapi tapi juga meningkatkan kepercayaan klien terhadap bisnis Anda.',
      content: 'Invoice adalah dokumen penting yang mencerminkan profesionalisme bisnis Anda...',
      category: 'tips',
      author: 'Ahmad Wijaya',
      date: '15 Oktober 2024',
      readTime: '5 menit',
      image: '/api/placeholder/400/250',
      featured: true,
      likes: 234,
      comments: 18,
      tags: ['invoice', 'profesional', 'bisnis']
    },
    {
      id: 2,
      title: 'Cara Menghitung Pajak dalam Invoice untuk UMKM Indonesia',
      excerpt: 'Panduan lengkap menghitung dan mencantumkan pajak (PPN, PPh) dalam invoice sesuai aturan perpajakan Indonesia.',
      content: 'Memahami perpajakan adalah kunci untuk bisnis yang sehat dan compliant...',
      category: 'tutorial',
      author: 'Sarah Putri',
      date: '12 Oktober 2024',
      readTime: '8 menit',
      image: '/api/placeholder/400/250',
      featured: true,
      likes: 189,
      comments: 23,
      tags: ['pajak', 'UMKM', 'Indonesia']
    },
    {
      id: 3,
      title: 'Transformasi Digital: Mengapa Invoice Digital Penting untuk Bisnis Modern',
      excerpt: 'Manfaatkan teknologi untuk meningkatkan efisiensi dan profesionalisme dalam pengelolaan invoice bisnis Anda.',
      content: 'Era digital telah mengubah cara kita berbisnis, termasuk dalam hal invoicing...',
      category: 'business',
      author: 'Budi Santoso',
      date: '10 Oktober 2024',
      readTime: '6 menit',
      image: '/api/placeholder/400/250',
      featured: false,
      likes: 156,
      comments: 12,
      tags: ['digital', 'teknologi', 'efisiensi']
    },
    {
      id: 4,
      title: 'Template Invoice Terbaik untuk Berbagai Jenis Bisnis',
      excerpt: 'Temukan template invoice yang sempurna untuk jenis bisnis Anda, dari freelance hingga perusahaan besar.',
      content: 'Setiap bisnis memiliki kebutuhan invoice yang berbeda-beda...',
      category: 'tips',
      author: 'Maya Anggraini',
      date: '8 Oktober 2024',
      readTime: '4 menit',
      image: '/api/placeholder/400/250',
      featured: false,
      likes: 203,
      comments: 15,
      tags: ['template', 'desain', 'bisnis']
    },
    {
      id: 5,
      title: 'Cara Menghindari Kesalahan Umum dalam Pembuatan Invoice',
      excerpt: 'Hindari kesalahan yang sering terjadi saat membuat invoice yang bisa merusak citra profesional bisnis Anda.',
      content: 'Kesalahan kecil dalam invoice bisa berdampak besar pada bisnis Anda...',
      category: 'tutorial',
      author: 'Rizki Pratama',
      date: '5 Oktober 2024',
      readTime: '7 menit',
      image: '/api/placeholder/400/250',
      featured: false,
      likes: 178,
      comments: 9,
      tags: ['kesalahan', 'tips', 'profesional']
    },
    {
      id: 6,
      title: 'Update Fitur Baru: Kustomisasi Invoice yang Lebih Fleksibel',
      excerpt: 'Kami senang mengumumkan fitur baru yang memungkinkan kustomisasi invoice yang lebih personal dan profesional.',
      content: 'Berdasarkan feedback dari pengguna, kami menghadirkan fitur kustomisasi yang lebih powerful...',
      category: 'news',
      author: 'Tim MJW Invoice',
      date: '3 Oktober 2024',
      readTime: '3 menit',
      image: '/api/placeholder/400/250',
      featured: false,
      likes: 145,
      comments: 8,
      tags: ['update', 'fitur', 'new']
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Blog MJW Invoice
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Wawasan & Tips untuk Bisnis Anda
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Dapatkan informasi terbaru, tips berguna, dan panduan lengkap tentang invoice dan manajemen bisnis
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Artikel Pilihan
              </h2>
              <p className="text-xl text-gray-600">
                Konten terbaik yang wajib Anda baca
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-20 h-20 text-white/60" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {searchTerm ? `Hasil Pencarian (${filteredPosts.length})` : 'Semua Artikel'}
                </h2>
                
                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                        {category.icon}
                        <span className="hidden sm:inline">{category.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Posts Grid */}
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="sm:w-48 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-12 h-12 text-white/60" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{post.author}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Share2 className="w-4 h-4" />
                                  <span>Share</span>
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

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Artikel Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="group cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Tag Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['invoice', 'bisnis', 'tips', 'tutorial', 'pajak', 'UMKM', 'digital', 'template', 'profesional', 'efisiensi'].map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        onClick={() => setSearchTerm(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Newsletter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100 text-sm">
                    Dapatkan tips dan artikel terbaru langsung di inbox Anda
                  </p>
                  <Input
                    type="email"
                    placeholder="Email Anda"
                    className="bg-white/10 border-white/20 text-white placeholder-white/70"
                  />
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Berlangganan
                  </Button>
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
                        {blogPosts.filter(post => post.category === category.id).length}
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
            Siap Meningkatkan Bisnis Anda?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Mulai buat invoice profesional sekarang juga dan rasakan kemudahannya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Buat Invoice Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                Pelajari Fitur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}