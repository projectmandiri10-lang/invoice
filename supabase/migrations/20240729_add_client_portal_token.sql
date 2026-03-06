-- Pastikan tabel clients sudah ada
-- Jika belum ada, jalankan perintah CREATE TABLE terlebih dahulu.
-- CREATE TABLE clients (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES auth.users(id),
--   client_name TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(user_id, client_name)
-- );

-- Tambahkan kolom portal_token ke tabel clients yang sudah ada
ALTER TABLE public.clients
ADD COLUMN portal_token UUID DEFAULT gen_random_uuid();

-- Buat index untuk pencarian token yang cepat
CREATE INDEX idx_clients_portal_token ON public.clients(portal_token);

-- Tambahkan RLS agar data portal_token tidak bisa diakses sembarangan
-- (Asumsi RLS sudah aktif untuk tabel ini)
-- Kebijakan ini memungkinkan pengguna untuk membaca token klien mereka sendiri.
CREATE POLICY "Enable read portal_token for own clients"
ON public.clients
FOR SELECT
USING (auth.uid() = user_id);
