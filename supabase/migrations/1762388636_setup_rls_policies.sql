-- Migration: setup_rls_policies
-- Created at: 1762388636

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents"
ON documents FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert own documents"
ON documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents"
ON documents FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON documents FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on templates table
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view templates
CREATE POLICY "Everyone can view templates"
ON templates FOR SELECT
TO authenticated, anon
USING (true);

-- Policy: Only authenticated users can insert templates (for future admin features)
CREATE POLICY "Authenticated users can insert templates"
ON templates FOR INSERT
TO authenticated
WITH CHECK (true);;