-- Manual account management + payment removal
-- Created: 2026-03-14

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  account_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT,
  ADD COLUMN IF NOT EXISTS account_status TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE public.profiles
SET
  plan = CASE
    WHEN LOWER(COALESCE(plan, 'free')) IN ('starter', 'pro') THEN LOWER(plan)
    WHEN LOWER(COALESCE(plan, 'free')) = 'premium' THEN 'pro'
    ELSE 'free'
  END,
  account_status = CASE
    WHEN account_status IN ('pending', 'active', 'disabled') THEN account_status
    ELSE 'active'
  END;

ALTER TABLE public.profiles
  ALTER COLUMN plan SET DEFAULT 'free',
  ALTER COLUMN plan SET NOT NULL,
  ALTER COLUMN account_status SET DEFAULT 'pending',
  ALTER COLUMN account_status SET NOT NULL;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS plan_expires_at;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_plan_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_plan_check
      CHECK (plan IN ('free', 'starter', 'pro'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_account_status_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_account_status_check
      CHECK (account_status IN ('pending', 'active', 'disabled'));
  END IF;
END $$;

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

DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, plan, account_status, created_at, updated_at)
  VALUES (
    NEW.id,
    CASE WHEN LOWER(COALESCE(NEW.email, '')) = 'jho.j80@gmail.com' THEN 'pro' ELSE 'free' END,
    CASE WHEN LOWER(COALESCE(NEW.email, '')) = 'jho.j80@gmail.com' THEN 'active' ELSE 'pending' END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();

INSERT INTO public.profiles (id, plan, account_status, created_at, updated_at)
SELECT
  u.id,
  CASE WHEN LOWER(COALESCE(u.email, '')) = 'jho.j80@gmail.com' THEN 'pro' ELSE 'free' END AS plan,
  CASE WHEN LOWER(COALESCE(u.email, '')) = 'jho.j80@gmail.com' THEN 'active' ELSE 'active' END AS account_status,
  COALESCE(u.created_at, NOW()),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

UPDATE public.profiles p
SET
  plan = 'pro',
  account_status = 'active',
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND LOWER(COALESCE(u.email, '')) = 'jho.j80@gmail.com';

DROP TABLE IF EXISTS public.invoice_payments;
DROP TABLE IF EXISTS public.billing_transactions;
DROP TABLE IF EXISTS public.billing_plans;

UPDATE public.documents
SET settings = jsonb_set(
  COALESCE(settings, '{}'::jsonb),
  '{visibleFields}',
  COALESCE(settings->'visibleFields', '{}'::jsonb) - 'paymentGateway',
  true
)
WHERE COALESCE(settings->'visibleFields', '{}'::jsonb) ? 'paymentGateway';
