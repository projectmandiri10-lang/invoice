# Rencana Pengembangan & Monetisasi Invoice Generator

Daftar tugas ini dibuat berdasarkan saran strategis untuk meningkatkan nilai dan potensi monetisasi aplikasi. Prioritas diatur dari yang paling mudah diimplementasikan hingga yang paling kompleks.

## Fase 1: Implementasi Batasan Sederhana (Paling Mudah)

Tujuan dari fase ini adalah untuk mengimplementasikan batasan yang paling terlihat dan mudah secara teknis, tanpa memerlukan perubahan besar pada database.

- [ ] **Watermark pada PDF**: Tambahkan watermark "Dibuat dengan MJW Invoice" secara otomatis pada setiap PDF yang diekspor oleh pengguna di tier gratis.
- [ ] **Batasan Kustomisasi Logo**:
  - [ ] Nonaktifkan fitur unggah dan tampilkan logo untuk pengguna di tier gratis.
  - [ ] Tampilkan pesan "Upgrade untuk menggunakan logo Anda sendiri" di area logo jika pengguna berada di tier gratis.
- [ ] **Dorongan Berdasarkan Nominal**: Tampilkan pesan non-intrusif (seperti *toast notification*) yang menyarankan upgrade ke tier Pro saat pengguna memasukkan nominal total invoice di atas ambang batas tertentu (misalnya, Rp 50.000.000).

## Fase 2: Batasan Berbasis Jumlah (Memerlukan Logika Backend/Database)

Fase ini memperkenalkan batasan yang memerlukan pelacakan penggunaan di sisi server.

- [ ] **Struktur Data Tier Pengguna**: Tambahkan kolom `plan` (misalnya, 'free', 'starter', 'pro') pada tabel `users` atau tabel `profiles` di Supabase untuk menyimpan informasi langganan pengguna.
- [ ] **Batasan Jumlah Dokumen**:
  - [ ] Buat logika di backend untuk menghitung jumlah dokumen yang telah dibuat oleh pengguna dalam satu bulan.
  - [ ] Saat pengguna mencoba menyimpan atau mengekspor dokumen baru yang melebihi batas (misalnya, dokumen ke-6), tampilkan *modal pop-up* yang memaksa mereka untuk melakukan upgrade.
- [ ] **Batasan Jumlah Klien**:
  - [ ] Rancang cara untuk melacak jumlah klien unik per pengguna. Ini mungkin memerlukan penambahan tabel `clients` baru di database.
  - [ ] Terapkan batasan yang sama seperti batasan jumlah dokumen.

## Fase 3: Fitur Profesional (Kompleks)

Fitur-fitur ini adalah pendorong utama untuk upgrade ke tier yang lebih tinggi dan memerlukan integrasi eksternal atau logika backend yang signifikan.

- [ ] **Integrasi Pembayaran Online (Duitku)**: Integrasikan dengan payment gateway Duitku untuk memungkinkan pengguna menerima pembayaran langsung melalui tautan di invoice.
- [ ] **Invoice Berulang (Recurring Invoices)**:
  - [ ] Buat antarmuka bagi pengguna untuk mengatur jadwal invoice berulang (misalnya, setiap bulan).
  - [ ] Buat sistem di backend (kemungkinan menggunakan *cron jobs* atau *scheduled functions*) untuk secara otomatis membuat dan mengirim invoice sesuai jadwal.
- [ ] **Portal Klien**:
  - [ ] Buat antarmuka terpisah di mana klien dari pengguna dapat melihat riwayat invoice mereka, mengunduh PDF, dan melakukan pembayaran.
  - [ ] Ini memerlukan sistem otentikasi atau akses berbasis tautan yang aman untuk klien.
- [ ] **Pengingat Otomatis (Automatic Reminders)**: Buat sistem backend untuk mengirim email pengingat secara otomatis kepada klien jika invoice mendekati atau melewati tanggal jatuh tempo.

## Fase 4: Monetisasi Iklan

- [ ] **Integrasi Iklan Native (Monetag)**: Tempatkan iklan native yang tidak mengganggu di area tertentu pada aplikasi (misalnya, di dashboard atau di bagian bawah halaman editor) untuk pengguna di tier gratis.