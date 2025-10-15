'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Home, ArrowRight, CheckCircle, Users, HeadphonesIcon, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'support@mjwinvoice.com',
      description: 'Kami akan membalas dalam 24 jam',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telepon',
      value: '+62 812-3456-7890',
      description: 'Senin - Jumat, 09:00 - 18:00 WIB',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Alamat',
      value: 'Jakarta, Indonesia',
      description: 'Kantor pusat kami',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Jam Operasional',
      value: '09:00 - 18:00 WIB',
      description: 'Senin - Jumat',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const supportCategories = [
    'Bantuan Teknis',
    'Pertanyaan Umum',
    'Saran & Masukan',
    'Kerjasama',
    'Laporan Bug',
    'Lainnya'
  ]

  const faqItems = [
    {
      question: 'Berapa lama waktu respons untuk email?',
      answer: 'Kami berusaha membalas semua email dalam 24 jam pada hari kerja.'
    },
    {
      question: 'Apakah ada biaya untuk menggunakan layanan?',
      answer: 'Tidak, semua fitur dasar kami gratis selamanya tanpa biaya tersembunyi.'
    },
    {
      question: 'Bagaimana cara melaporkan bug atau masalah?',
      answer: 'Anda dapat melaporkan bug melalui form kontak atau email ke support@mjwinvoice.com'
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
              Hubungi Kami
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Kami Siap Membantu Anda
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Ada pertanyaan, saran, atau butuh bantuan? Jangan ragu untuk menghubungi tim kami.
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

      {/* Contact Info Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${info.color}`}>
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Kirim Pesan</CardTitle>
                  <p className="text-gray-600">
                    Isi form di bawah ini dan kami akan segera menghubungi Anda.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Pesan Terkirim!</h3>
                      <p className="text-gray-600">Terima kasih telah menghubungi kami. Kami akan membalas segera.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Nama Lengkap *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Kategori *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subjek *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Pertanyaan tentang fitur invoice"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Pesan *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Jelaskan pertanyaan atau keluhan Anda secara detail..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Support */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center">
                    <HeadphonesIcon className="w-5 h-5 mr-2" />
                    Support Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100 text-sm">
                    Butuh bantuan segera? Coba opsi berikut:
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                      <Zap className="w-4 h-4 mr-2" />
                      FAQ Cepat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Pertanyaan Umum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                      <h4 className="font-medium text-gray-900 mb-1">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Waktu Respons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-green-600">24 jam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Live Chat</span>
                    <span className="font-medium text-blue-600">Instan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Telepon</span>
                    <span className="font-medium text-purple-600">Segera</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Lain Menghubungi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih metode yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat langsung dengan tim support kami untuk bantuan instan
              </p>
              <Button className="w-full">Mulai Chat</Button>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Komunitas</h3>
              <p className="text-gray-600 mb-4">
                Bergabung dengan komunitas pengguna untuk berbagi tips dan trik
              </p>
              <Button variant="outline" className="w-full">Gabung Komunitas</Button>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Kirim email detail untuk pertanyaan yang membutuhkan penjelasan panjang
              </p>
              <Button variant="outline" className="w-full">Kirim Email</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
            <p className="text-gray-600 mb-6">
              Dapatkan update terbaru dan tips berguna melalui social media
            </p>
            <div className="flex justify-center space-x-4">
              {/* Social media buttons would go here */}
              <Button variant="outline" size="sm">Facebook</Button>
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">LinkedIn</Button>
              <Button variant="outline" size="sm">Instagram</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}