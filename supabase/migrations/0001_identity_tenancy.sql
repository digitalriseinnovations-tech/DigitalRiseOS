-- ============================================================
-- Migration 0001 — Identity & Tenancy foundation (Phase 1)
-- Additive only: does not alter existing v1 tables' data.
-- Apply via Supabase SQL editor or CLI.
-- ============================================================

-- ── Extend businesses into full tenant records ─────────────
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS legal_name        TEXT,
  ADD COLUMN IF NOT EXISTS display_name      TEXT,
  ADD COLUMN IF NOT EXISTS industry_edition  TEXT DEFAULT 'daycare',
  ADD COLUMN IF NOT EXISTS timezone          TEXT DEFAULT 'America/Toronto',
  ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'draft'
    CHECK (onboarding_status IN ('draft','account_created','owner_invited','owner_activated',
      'knowledge_pending','channels_pending','ai_setup_pending','testing','live','suspended','archived')),
  ADD COLUMN IF NOT EXISTS is_sandbox        BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS enabled_modules   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS limits            JSONB  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS brand             JSONB  DEFAULT '{}';

-- ── Plans & subscriptions ──────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT UNIQUE NOT NULL,          -- starter | professional | enterprise
  name       TEXT NOT NULL,
  limits     JSONB DEFAULT '{}',
  modules    TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  plan_id      UUID REFERENCES plans(id),
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','trialing','past_due','cancelled')),
  period_start TIMESTAMPTZ DEFAULT NOW(),
  period_end   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── User profiles (1:1 with auth.users) ────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT,
  avatar_url        TEXT,
  is_platform_admin BOOLEAN DEFAULT false,
  is_super_admin    BOOLEAN DEFAULT false,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  last_login_at     TIMESTAMPTZ,
  theme             TEXT DEFAULT 'system' CHECK (theme IN ('system','light','dark')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Business membership (tenancy + role) ───────────────────
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN
    ('owner','director','manager','reception','educator','marketing','readonly')),
  locations   TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  invited_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (business_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_members_user     ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_business ON members(business_id);

-- ── Invitations ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN
    ('owner','director','manager','reception','educator','marketing','readonly')),
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  sent_by     UUID REFERENCES auth.users(id),
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_invitations_business ON invitations(business_id);

-- ── Audit log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  actor_role    TEXT,
  action        TEXT NOT NULL,
  entity_type   TEXT,
  entity_id     TEXT,
  before        JSONB,
  after         JSONB,
  impersonation BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_business ON audit_logs(business_id, created_at DESC);

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs    ENABLE ROW LEVEL SECURITY;

-- Helper: current user's business ids
CREATE OR REPLACE FUNCTION my_business_ids() RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT business_id FROM members
  WHERE user_id = auth.uid() AND status = 'active';
$$;

-- profiles: user reads/updates own profile
DROP POLICY IF EXISTS "own profile read"   ON profiles;
DROP POLICY IF EXISTS "own profile update" ON profiles;
CREATE POLICY "own profile read"   ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "own profile update" ON profiles FOR UPDATE USING (id = auth.uid());

-- members: read memberships of businesses you belong to
DROP POLICY IF EXISTS "members read own businesses" ON members;
CREATE POLICY "members read own businesses" ON members
  FOR SELECT USING (business_id IN (SELECT my_business_ids()));

-- plans: readable by any authenticated user
DROP POLICY IF EXISTS "plans readable" ON plans;
CREATE POLICY "plans readable" ON plans FOR SELECT USING (auth.uid() IS NOT NULL);

-- subscriptions: members can read their business subscription
DROP POLICY IF EXISTS "subscription read" ON subscriptions;
CREATE POLICY "subscription read" ON subscriptions
  FOR SELECT USING (business_id IN (SELECT my_business_ids()));

-- audit_logs: owners/directors read their business audit trail
DROP POLICY IF EXISTS "audit read" ON audit_logs;
CREATE POLICY "audit read" ON audit_logs
  FOR SELECT USING (business_id IN (
    SELECT business_id FROM members
    WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner','director')
  ));

-- Tenancy on existing v1 tables: members read their business rows.
-- (Widget INSERT policies from schema v1 remain; writes from the app
--  go through server route handlers using the service role.)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['ai_employees','knowledge_base','conversations','leads','bookings','reviews','automations']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "members read %s" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "members read %s" ON %I FOR SELECT USING (business_id IN (SELECT my_business_ids()))',
      t, t);
  END LOOP;
END $$;

-- businesses: members read their own business record
DROP POLICY IF EXISTS "members read own business" ON businesses;
CREATE POLICY "members read own business" ON businesses
  FOR SELECT USING (id IN (SELECT my_business_ids()));

-- Seed plans
INSERT INTO plans (key, name, limits, modules) VALUES
  ('starter',      'Starter',      '{"ai_employees": 1,  "users": 3}',
    ARRAY['home','workforce','inbox','enquiries','tours']),
  ('professional', 'Professional', '{"ai_employees": 5,  "users": 10}',
    ARRAY['home','workforce','inbox','enquiries','tours','waitlist','communication','reviews','activities','printables','knowledge','analytics']),
  ('enterprise',   'Enterprise',   '{"ai_employees": -1, "users": -1}',
    ARRAY['home','workforce','inbox','enquiries','tours','waitlist','registrations','communication','phone','reviews','activities','printables','knowledge','documents','automations','analytics','integrations','team'])
ON CONFLICT (key) DO NOTHING;
