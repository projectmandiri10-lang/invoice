-- Menambahkan kolom client_id untuk menautkan dokumen ke klien
ALTER TABLE documents
ADD COLUMN client_id UUID REFERENCES clients(id);

-- Menambahkan kolom status untuk melacak status invoice
ALTER TABLE documents
ADD COLUMN status TEXT DEFAULT 'draft'; -- Nilai bisa: 'draft', 'sent', 'paid', 'overdue'

-- Tambahkan indeks untuk performa
CREATE INDEX idx_documents_client_id ON documents(client_id);
