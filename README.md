# idCashier Invoice Generator

Web application untuk membuat dan mengelola dokumen bisnis profesional menggunakan idCashier Invoice Generator, React, TypeScript, Tailwind CSS, dan Supabase.

## 🎯 Fitur Utama

### Dokument Bisnis
- **Invoice** - Faktur penjualan dengan layout profesional
- **Surat Jalan** - Dokumen pengiriman barang  
- **Kwitansi** - Bukti pembayaran

### Interface & Editing
- **Direct Editing** - Edit langsung di preview dokumen
- **Real-time Preview** - Melihat perubahan secara langsung
- **Responsive Layout** - Tampilan optimal di desktop dan mobile
- **Settings Panel** - Panel pengaturan lengkap untuk customization

### Dokumentasi & Export
- **Export PDF** - Ekspor dokumen ke format PDF
- **Print Ready** - Cetak dokumen langsung dengan format professional
- **Auto Save** - Penyimpanan otomatis setiap 2 detik
- **Document Management** - Manajemen dokumen dengan My Documents

### Authentication & Storage
- **User Registration** - Sistem pendaftaran pengguna
- **Secure Login** - Login dengan Supabase Auth
- **Cloud Storage** - Penyimpanan dokumen di cloud
- **My Documents** - Lihat semua dokumen yang telah dibuat

## 🚀 Deployment

**Live Demo:** https://g2i11nba9r31.space.minimax.io

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI
- **Backend:** Supabase (Auth, Database, Storage)
- **PDF Export:** jsPDF + html2canvas
- **Icons:** Lucide React
- **State Management:** React Hooks + Context API

## 📁 Project Structure

```
invoice-generator/
├── src/
│   ├── components/        # UI components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── pages/           # Page components
│   └── types/           # TypeScript types
├── supabase/
│   ├── functions/       # Edge functions
│   ├── migrations/      # Database migrations
│   └── tables/          # Table schemas
├── public/              # Static assets
└── dist/               # Built files
```

## 🚦 Getting Started

### Windows (PowerShell) - Quick Start

1. **Masuk ke folder project:**
```powershell
cd C:\Users\LENOVO\Documents\POS\NOTA\INVOICE
```

2. **Pastikan pnpm tersedia (tanpa install global):**
```powershell
corepack pnpm -v
```
> Jika ingin perintah `pnpm` tersedia tanpa prefix `corepack`, jalankan PowerShell sebagai Administrator lalu:
> ```powershell
> corepack enable
> corepack prepare pnpm@latest --activate
> pnpm -v
> ```

3. **Siapkan environment Supabase (wajib):**
```powershell
Copy-Item .env.example .env.local
# Edit .env.local dan isi minimal:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```
> Catatan:
> - `.env` dipakai untuk nilai aman yang boleh ada di repo.
> - Secret privat seperti `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN`, dan `DUITKU_API_KEY` simpan di `.env.local`, bukan di `.env`.
> - Google OAuth dikonfigurasi di Supabase Auth provider, jadi tidak perlu `VITE_GOOGLE_CLIENT_SECRET` di frontend.

4. **Jalankan dev server:**
```powershell
corepack pnpm dev
```

5. **Buka di browser:**
- `http://localhost:5173` (default Vite; jika port berubah lihat output terminal)

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Supabase account

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/YOUR_USERNAME/invoice-generator.git
cd invoice-generator
```

2. **Install dependencies:**
```bash
corepack pnpm install
```

3. **Setup Supabase:**
   - Create new project di [Supabase](https://supabase.com)
   - Copy environment variables
   - Run migrations

4. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials
```
> Windows PowerShell:
> ```powershell
> Copy-Item .env.example .env.local
> ```

5. **Run development server:**
```bash
corepack pnpm dev
```

6. **Build for production:**
```bash
corepack pnpm build
```

### Environment Variables

```env
# Public client-side config
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_SITE_URL=https://invoice.idcashier.com
DUITKU_CALLBACK_URL=https://your-project-ref.supabase.co/functions/v1/duitku-callback

# Private/server-only config (.env.local only)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
DUITKU_MERCHANT_CODE=your_merchant_code
DUITKU_API_KEY=your_duitku_api_key
DUITKU_ENV=production
```

`VITE_` variables boleh dibaca frontend. Variabel tanpa prefix `VITE_` jangan ditaruh di file yang ikut di-commit.

### Troubleshooting

Jika muncul error browser seperti:
- `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` ke `*.supabase.co`

Artinya `VITE_SUPABASE_URL` mengarah ke domain Supabase yang tidak valid / project sudah tidak ada. Pastikan nilainya benar dan berbentuk seperti:
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
```
Ambil `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase Dashboard: **Project Settings → API**.

## 🏗️ Database Schema

### Documents Table
- `id` - Document ID (UUID)
- `user_id` - Owner user ID
- `type` - Document type (invoice/surat_jalan/kwitansi)
- `data` - Document content (JSONB)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Features per Document Type

#### Invoice
- Header: No, Tanggal, Jatuh Tempo
- Parties: DARI (pengirim) & KEPADA (penerima)
- Fields: Nama, Alamat, Telepon, Email, NPWP
- Items: Auto-numbered table
- Total: Automatic calculation
- Signature: Professional format

#### Surat Jalan
- Shipping information
- Item list with quantities
- Delivery details

#### Kwitansi  
- Payment confirmation
- Amount details
- Receipt formatting

## 🎨 Customization

### Settings Panel
- **Tampilan:** Logo, Colors, Fonts
- **Layout:** Margin, Spacing, Alignment
- **Field:** Visibility toggles per document type

### Professional Layout
- Standard business document formatting
- Clean, professional appearance
- Print-optimized styles

## 📱 User Interface

### Navigation
- **Home** - Document editor dengan tabs
- **My Documents** - Document list (requires login)
- **Settings** - User preferences

### Document Editor
- **75-25 Layout** - Preview (editable) | Settings
- **Tabbed Interface** - Switch between document types
- **Inline Editing** - Click to edit any text
- **Auto-save** - Background saving

### Authentication Flow
1. Registration dengan email
2. Email verification
3. Login untuk akses My Documents
4. Session persistence

## 🔧 Technical Features

### Performance
- **Code Splitting** - Lazy loading dengan React.lazy()
- **Debounced Save** - Optimized auto-save
- **Responsive** - Mobile-first design

### Security
- **Row Level Security** - Supabase RLS policies
- **User Isolation** - Documents scoped to user
- **Secure Auth** - Built-in authentication

### PDF Export
- **High Quality** - Vector-based output
- **Print Ready** - Professional formatting
- **Browser Compatible** - Works across browsers

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Review code examples

---

**Built with ❤️ using React, TypeScript, and Supabase**
