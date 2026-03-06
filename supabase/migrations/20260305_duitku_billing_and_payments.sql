-- Duitku (API v2) + Billing (Starter/Pro) + Invoice Payments
-- Created: 2026-03-05

-- -----------------------------------------------------------------------------
-- 1) Profiles (plan entitlement)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Profiles are viewable by owner'
  ) THEN
    CREATE POLICY "Profiles are viewable by owner"
      ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

-- updated_at helper (shared)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Automatically create profile row for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, plan, plan_expires_at)
  VALUES (NEW.id, 'free', NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();

-- -----------------------------------------------------------------------------
-- 2) Billing plans (price configuration)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.billing_plans (
  code TEXT PRIMARY KEY,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro')),
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  amount_idr INTEGER NOT NULL CHECK (amount_idr > 0),
  duration INTERVAL NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'billing_plans'
      AND policyname = 'Billing plans are readable'
  ) THEN
    CREATE POLICY "Billing plans are readable"
      ON public.billing_plans
      FOR SELECT
      TO anon, authenticated
      USING (active = TRUE);
  END IF;
END $$;

INSERT INTO public.billing_plans (code, plan, interval, amount_idr, duration, active)
VALUES
  ('starter_month', 'starter', 'month', 100000, INTERVAL '1 month', TRUE),
  ('starter_year',  'starter', 'year',  1000000, INTERVAL '1 year',  TRUE),
  ('pro_month',     'pro',     'month', 150000, INTERVAL '1 month', TRUE),
  ('pro_year',      'pro',     'year',  1500000, INTERVAL '1 year',  TRUE)
ON CONFLICT (code) DO UPDATE SET
  plan = EXCLUDED.plan,
  interval = EXCLUDED.interval,
  amount_idr = EXCLUDED.amount_idr,
  duration = EXCLUDED.duration,
  active = EXCLUDED.active;

-- -----------------------------------------------------------------------------
-- 3) Billing transactions (subscription payments)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.billing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_code TEXT NOT NULL REFERENCES public.billing_plans(code),
  amount_idr INTEGER NOT NULL CHECK (amount_idr > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  merchant_order_id TEXT NOT NULL UNIQUE,
  reference TEXT,
  payment_method TEXT,
  payment_url TEXT,
  raw_inquiry JSONB,
  raw_callback JSONB,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'billing_transactions'
      AND policyname = 'Billing transactions are viewable by owner'
  ) THEN
    CREATE POLICY "Billing transactions are viewable by owner"
      ON public.billing_transactions
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_billing_transactions_user_status
  ON public.billing_transactions (user_id, status);

DROP TRIGGER IF EXISTS trg_billing_transactions_set_updated_at ON public.billing_transactions;
CREATE TRIGGER trg_billing_transactions_set_updated_at
BEFORE UPDATE ON public.billing_transactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4) Invoice payments (client portal payments)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL,
  client_id UUID,
  amount_idr INTEGER NOT NULL CHECK (amount_idr > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  merchant_order_id TEXT NOT NULL UNIQUE,
  reference TEXT,
  payment_method TEXT,
  payment_url TEXT,
  raw_inquiry JSONB,
  raw_callback JSONB,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'invoice_payments'
      AND policyname = 'Invoice payments are viewable by owner'
  ) THEN
    CREATE POLICY "Invoice payments are viewable by owner"
      ON public.invoice_payments
      FOR SELECT
      USING (auth.uid() = owner_user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_invoice_payments_document_status
  ON public.invoice_payments (document_id, status);

CREATE INDEX IF NOT EXISTS idx_invoice_payments_owner_status
  ON public.invoice_payments (owner_user_id, status);

DROP TRIGGER IF EXISTS trg_invoice_payments_set_updated_at ON public.invoice_payments;
CREATE TRIGGER trg_invoice_payments_set_updated_at
BEFORE UPDATE ON public.invoice_payments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 5) Ensure schema for client portal and invoice status
-- -----------------------------------------------------------------------------

-- documents: client_id + status
ALTER TABLE IF EXISTS public.documents
  ADD COLUMN IF NOT EXISTS client_id UUID;

ALTER TABLE IF EXISTS public.documents
  ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE IF EXISTS public.documents
  ALTER COLUMN status SET DEFAULT 'draft';

DO $$
BEGIN
  -- Add FK only when both tables exist and constraint is missing
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clients'
  )
  AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'client_id'
  )
  AND NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_client_id_fkey'
  ) THEN
    ALTER TABLE public.documents
      ADD CONSTRAINT documents_client_id_fkey
      FOREIGN KEY (client_id)
      REFERENCES public.clients(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents(client_id);

-- clients: portal_token (canonical for portal URL)
ALTER TABLE IF EXISTS public.clients
  ADD COLUMN IF NOT EXISTS portal_token UUID;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'portal_access_token'
  ) THEN
    EXECUTE $q$
      UPDATE public.clients
      SET portal_token = COALESCE(portal_token, portal_access_token, gen_random_uuid())
      WHERE portal_token IS NULL
    $q$;
  ELSE
    EXECUTE $q$
      UPDATE public.clients
      SET portal_token = COALESCE(portal_token, gen_random_uuid())
      WHERE portal_token IS NULL
    $q$;
  END IF;
END $$;

ALTER TABLE public.clients
  ALTER COLUMN portal_token SET DEFAULT gen_random_uuid();

ALTER TABLE public.clients
  ALTER COLUMN portal_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_portal_token_unique ON public.clients(portal_token);

