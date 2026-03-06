-- PDF export quota (Free + Anonymous)
-- Created: 2026-03-06

-- updated_at helper (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.pdf_export_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anon_token UUID,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0),
  quota_limit INTEGER NOT NULL DEFAULT 5 CHECK (quota_limit > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pdf_export_quotas_one_identifier CHECK ((user_id IS NULL) <> (anon_token IS NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pdf_export_quotas_user_id_unique
  ON public.pdf_export_quotas(user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pdf_export_quotas_anon_token_unique
  ON public.pdf_export_quotas(anon_token)
  WHERE anon_token IS NOT NULL;

ALTER TABLE public.pdf_export_quotas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'pdf_export_quotas'
      AND policyname = 'PDF export quotas are viewable by owner'
  ) THEN
    CREATE POLICY "PDF export quotas are viewable by owner"
      ON public.pdf_export_quotas
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_pdf_export_quotas_set_updated_at ON public.pdf_export_quotas;
CREATE TRIGGER trg_pdf_export_quotas_set_updated_at
BEFORE UPDATE ON public.pdf_export_quotas
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
