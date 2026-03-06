-- Tabel untuk menyimpan klien unik per pengguna
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    portal_access_token UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Memastikan setiap pengguna hanya memiliki satu klien dengan nama yang sama
    UNIQUE(user_id, client_name)
);

-- Kebijakan Keamanan (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
ON clients
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indeks untuk mempercepat pencarian
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE UNIQUE INDEX idx_clients_portal_access_token ON clients(portal_access_token);
