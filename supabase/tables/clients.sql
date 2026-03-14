CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    portal_token UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, client_name)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
ON clients
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read portal_token for own clients"
ON clients
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE UNIQUE INDEX idx_clients_portal_token ON clients(portal_token);
