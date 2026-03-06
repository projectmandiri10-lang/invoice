# Panduan Testing Manual Invoice Generator

**URL Aplikasi**: https://szchfrpegmjr.space.minimax.io

## Status Verifikasi Teknis
- ✅ Build berhasil tanpa error kompilasi
- ✅ Code splitting berhasil (bundle size turun 72%: 1.2MB → 346KB)
- ✅ Deployment berhasil - semua assets accessible (verified via curl)
- ✅ Logic penyimpanan dokumen sudah konsisten (upsert di autoSave dan handleSave)
- ⚠️ Browser automated testing timeout (limitasi sistem testing, bukan error aplikasi)

## Checklist Testing Manual

### 1. Homepage & UI Dasar
- [ ] **Load homepage**: Website terbuka tanpa error
- [ ] **Navbar terlihat**: Ada navbar di bagian atas dengan logo/title
- [ ] **Tab system**: Ada 3 tabs - Invoice, Surat Jalan, Kwitansi
- [ ] **Layout 2 kolom**: Preview di kiri, Settings panel di kanan
- [ ] **Loading state**: Saat pertama load, ada loading spinner kemudian preview muncul

### 2. Tab Invoice - Editable Preview
- [ ] **Preview terlihat**: Dokumen invoice dengan data default terlihat
- [ ] **Edit company name**: Klik pada "PT ABC Company" (atau nama default), bisa diedit
- [ ] **Edit invoice number**: Klik pada invoice number, bisa diubah
- [ ] **Edit tanggal**: Klik pada tanggal, bisa diubah
- [ ] **Edit client name**: Klik pada nama client, bisa diedit
- [ ] **Edit client address**: Klik pada alamat client, bisa diedit
- [ ] **Edit item description**: Di tabel items, klik deskripsi item, bisa diedit
- [ ] **Edit item quantity**: Klik quantity, bisa diubah
- [ ] **Edit item price**: Klik harga, bisa diubah
- [ ] **Auto-calculation**: Setelah edit quantity/price, total otomatis terupdate
- [ ] **Tambah item**: Ada tombol plus/tambah item, klik dan item baru muncul
- [ ] **Hapus item**: Ada tombol trash/hapus di setiap item, klik dan item terhapus
- [ ] **Subtotal update**: Subtotal otomatis berubah saat item ditambah/dihapus/diedit
- [ ] **Tax calculation**: Tax (10% atau sesuai setting) otomatis terupdate
- [ ] **Grand total**: Grand total benar (subtotal + tax)

### 3. Tab Surat Jalan - Editable Preview
- [ ] **Switch tab**: Klik tab "Surat Jalan", preview berubah
- [ ] **Preview surat jalan terlihat**: Dokumen surat jalan dengan data default
- [ ] **Edit company info**: Bisa edit nama perusahaan, alamat, telepon
- [ ] **Edit nomor surat jalan**: Bisa edit nomor dokumen
- [ ] **Edit tanggal**: Bisa edit tanggal surat jalan
- [ ] **Edit pengirim**: Bisa edit nama dan alamat pengirim
- [ ] **Edit penerima**: Bisa edit nama dan alamat penerima
- [ ] **Edit items**: Bisa edit deskripsi, quantity, unit barang
- [ ] **Tambah/hapus barang**: Tombol tambah dan hapus barang berfungsi

### 4. Tab Kwitansi - Editable Preview
- [ ] **Switch tab**: Klik tab "Kwitansi", preview berubah
- [ ] **Preview kwitansi terlihat**: Dokumen kwitansi dengan data default
- [ ] **Edit company info**: Bisa edit nama perusahaan
- [ ] **Edit nomor kwitansi**: Bisa edit nomor dokumen
- [ ] **Edit "Sudah terima dari"**: Bisa edit field ini
- [ ] **Edit amount**: Klik pada jumlah uang, bisa diubah
- [ ] **Terbilang auto-generate**: Setelah edit amount, "terbilang" otomatis terupdate
- [ ] **Edit deskripsi**: Bisa edit field "Untuk pembayaran"
- [ ] **Edit payment method**: Bisa edit metode pembayaran
- [ ] **Edit penerima**: Bisa edit nama dan jabatan penerima

### 5. Settings Panel - Tab Tampilan
- [ ] **Settings panel terlihat**: Panel di kanan dengan 3 tabs
- [ ] **Tab Tampilan aktif**: Default atau klik tab Tampilan
- [ ] **Logo upload**: 
  - Ada tombol "Upload Logo" atau "Pilih Logo"
  - Klik dan bisa select image file
  - Setelah upload, logo muncul di preview dokumen
- [ ] **Primary color picker**: 
  - Ada color picker untuk primary color
  - Ubah warna, header/judul di preview ikut berubah warna
- [ ] **Secondary color**: Color picker berfungsi
- [ ] **Accent color**: Color picker berfungsi
- [ ] **Font family dropdown**: 
  - Ada dropdown untuk pilih font (Arial, Times New Roman, dll)
  - Ubah font, preview ikut berubah font-nya
- [ ] **Font size slider**: Ubah size, font di preview jadi lebih besar/kecil

### 6. Settings Panel - Tab Layout
- [ ] **Switch ke tab Layout**: Klik tab Layout
- [ ] **Margin control**: 
  - Ada slider atau input untuk margin (10-40mm)
  - Ubah margin, preview spacing berubah
- [ ] **Spacing control**:
  - Ada slider untuk spacing (8-32px)
  - Ubah spacing, jarak antar elemen di preview berubah
- [ ] **Alignment options**: Dropdown atau radio untuk alignment (left/center/right)

### 7. Settings Panel - Tab Field
- [ ] **Switch ke tab Field**: Klik tab Field
- [ ] **Toggle logo visibility**: 
  - Ada toggle/checkbox "Tampilkan Logo"
  - Matikan, logo hilang dari preview
  - Nyalakan lagi, logo muncul
- [ ] **Toggle NPWP**: Toggle on/off, field NPWP muncul/hilang
- [ ] **Toggle due date**: Toggle on/off, tanggal jatuh tempo muncul/hilang
- [ ] **Toggle notes**: Toggle on/off, field catatan muncul/hilang
- [ ] **Toggle payment info**: Toggle on/off, info pembayaran muncul/hilang

### 8. Export & Print Features
- [ ] **Tombol Export PDF terlihat**: Ada tombol "Export PDF"
- [ ] **Export PDF berfungsi**: 
  - Klik Export PDF
  - File PDF terdownload (biasanya muncul notifikasi download di browser)
  - Buka PDF, isi dokumen benar sesuai preview
- [ ] **Tombol Print terlihat**: Ada tombol "Print"
- [ ] **Print dialog muncul**:
  - Klik Print
  - Browser print dialog muncul
  - Preview print terlihat benar

### 9. Auto-save (Login Required)
**Prerequisites**: Harus register dan login dulu
- [ ] **Register**: Klik "Register" di navbar, isi form, submit berhasil
- [ ] **Login**: Klik "Login", masukkan credentials, berhasil login
- [ ] **Auto-save indicator**: 
  - Setelah login, edit dokumen (ubah invoice number misalnya)
  - Tunggu 2 detik
  - Lihat indicator "Menyimpan otomatis..." dengan spinner
  - Setelah selesai, indicator berubah menjadi "Tersimpan" dengan check icon
- [ ] **Manual save**: 
  - Klik tombol "Simpan"
  - Muncul pesan "Dokumen berhasil disimpan!" atau "Dokumen berhasil diperbarui!"

### 10. My Documents Page
- [ ] **Navigate ke My Documents**: Klik menu "My Documents" di navbar
- [ ] **List dokumen terlihat**: Dokumen yang disimpan muncul di list
- [ ] **Filter by type**: Dropdown filter (All/Invoice/Surat Jalan/Kwitansi) berfungsi
- [ ] **View document**: Klik "Lihat" pada dokumen, redirect ke detail view
- [ ] **Delete document**:
  - Klik tombol "Hapus" pada dokumen
  - Modal konfirmasi muncul dengan tombol "Batal" dan "Hapus"
  - Klik "Hapus", dokumen terhapus dari list
  - Klik "Batal", modal tutup tanpa hapus

### 11. View Document Page
- [ ] **Document detail terlihat**: Preview dokumen yang dipilih
- [ ] **Export PDF dari detail**: Tombol export berfungsi
- [ ] **Print dari detail**: Tombol print berfungsi
- [ ] **Back to list**: Link/tombol kembali ke My Documents

### 12. Responsive Design
- [ ] **Desktop (>1024px)**: Layout 2 kolom side-by-side
- [ ] **Tablet (768-1024px)**: Layout masih nyaman dilihat
- [ ] **Mobile (<768px)**: Layout stack vertical (preview di atas, settings di bawah)

### 13. Error Handling
- [ ] **Console errors**: Buka Developer Tools (F12), check Console tab, tidak ada error merah
- [ ] **Network errors**: Check Network tab, semua requests status 200 OK (atau 304)
- [ ] **Invalid input**: Coba input invalid (text di field number), ada validasi atau tidak crash

## Hasil Testing

**Tester**: [Nama Anda]  
**Tanggal**: [Tanggal Testing]  
**Browser**: [Chrome/Firefox/Safari/Edge]  
**OS**: [Windows/Mac/Linux]

**Total Checklist**: 100+ items  
**Passed**: [Jumlah]  
**Failed**: [Jumlah]

### Issues Found
| No | Issue Description | Severity | Screenshot/Video |
|----|------------------|----------|------------------|
| 1  |                  |          |                  |

### Overall Assessment
- [ ] ✅ Aplikasi ready untuk production
- [ ] ⚠️ Minor issues, bisa launch dengan catatan
- [ ] ❌ Critical issues, perlu perbaikan sebelum launch

### Notes
[Tambahkan catatan tambahan di sini]
