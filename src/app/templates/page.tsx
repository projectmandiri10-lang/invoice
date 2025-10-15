'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Download, Star, Filter, Search, Home, ArrowRight, FileText, Briefcase, ShoppingBag, Car, Wrench, Heart, Palette } from 'lucide-react'
import Link from 'next/link'

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua Template', icon: <FileText className="w-4 h-4" /> },
    { id: 'business', name: 'Bisnis', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'retail', name: 'Retail', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'service', name: 'Jasa', icon: <Wrench className="w-4 h-4" /> },
    { id: 'freelance', name: 'Freelance', icon: <Palette className="w-4 h-4" /> },
    { id: 'creative', name: 'Kreatif', icon: <Heart className="w-4 h-4" /> }
  ]

  const templates = [
    {
      id: 1,
      name: 'Modern Business',
      category: 'business',
      description: 'Template profesional untuk bisnis modern dengan desain clean dan minimalis',
      image: '/api/placeholder/400/300',
      features: ['Clean Design', 'Professional Layout', 'Multi Currency'],
      rating: 4.8,
      downloads: 15234,
      isPremium: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Creative Studio',
      category: 'creative',
      description: 'Template kreatif untuk studio desain dan agensi kreatif',
      image: '/api/placeholder/400/300',
      features: ['Colorful Design', 'Portfolio Style', 'Brand Focus'],
      rating: 4.9,
      downloads: 8921,
      isPremium: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'Retail Shop',
      category: 'retail',
      description: 'Template sempurna untuk toko retail dan e-commerce',
      image: '/api/placeholder/400/300',
      features: ['Product Focus', 'Tax Included', 'SKU Support'],
      rating: 4.7,
      downloads: 12456,
      isPremium: false,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      name: 'Freelance Pro',
      category: 'freelance',
      description: 'Template khusus untuk freelancer dan konsultan',
      image: '/api/placeholder/400/300',
      features: ['Hourly Rate', 'Project Based', 'Time Tracking'],
      rating: 4.9,
      downloads: 9876,
      isPremium: false,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      name: 'Service Provider',
      category: 'service',
      description: 'Template untuk penyedia jasa dan kontraktor',
      image: '/api/placeholder/400/300',
      features: ['Service Details', 'Labor & Materials', 'Progress Billing'],
      rating: 4.6,
      downloads: 7654,
      isPremium: false,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 6,
      name: 'Minimal Corporate',
      category: 'business',
      description: 'Template korporat dengan desain minimalis dan elegan',
      image: '/api/placeholder/400/300',
      features: ['Corporate Style', 'Minimal Design', 'Professional'],
      rating: 4.8,
      downloads: 11234,
      isPremium: false,
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 7,
      name: 'Fashion Boutique',
      category: 'retail',
      description: 'Template stylish untuk butik dan fashion store',
      image: '/api/placeholder/400/300',
      features: ['Fashion Focus', 'Size Options', 'Style Notes'],
      rating: 4.7,
      downloads: 6789,
      isPremium: false,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 8,
      name: 'Tech Startup',
      category: 'business',
      description: 'Template modern untuk startup teknologi dan SaaS',
      image: '/api/placeholder/400/300',
      features: ['Tech Focus', 'Subscription Billing', 'Usage Metrics'],
      rating: 4.9,
      downloads: 8901,
      isPremium: false,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 9,
      name: 'Photography Studio',
      category: 'creative',
      description: 'Template elegan untuk studio foto dan videografi',
      image: '/api/placeholder/400/300',
      features: ['Visual Focus', 'Package Deals', 'License Terms'],
      rating: 4.8,
      downloads: 5432,
      isPremium: false,
      color: 'from-violet-500 to-purple-500'
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Template Gallery
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Template Invoice Profesional
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Pilih dari berbagai template elegan yang siap digunakan untuk berbagai jenis bisnis
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Home className="w-5 h-5 mr-2" />
                Buat Invoice Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'Semua Template' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-xl text-gray-600">
              {filteredTemplates.length} template tersedia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${template.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white/80" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{template.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {template.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{template.downloads.toLocaleString()} downloads</span>
                    {template.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Link href="/" className="flex-1">
                      <Button className="w-full" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Gunakan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Template Ditemukan</h3>
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
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Template Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Template yang dirancang profesional dengan fitur-fitur lengkap untuk kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Desain Profesional</h3>
              <p className="text-gray-600 text-sm">Template yang dirancang oleh desainer profesional</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mudah Diedit</h3>
              <p className="text-gray-600 text-sm">Kustomisasi sesuai kebutuhan bisnis Anda</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export PDF</h3>
              <p className="text-gray-600 text-sm">Download dalam format PDF berkualitas tinggi</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gratis</h3>
              <p className="text-gray-600 text-sm">Semua template gratis untuk digunakan</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Tidak Menemukan Template yang Cocok?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Buat invoice kustom Anda sendiri dengan semua fitur yang Anda butuhkan.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Buat Invoice Kustom
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}