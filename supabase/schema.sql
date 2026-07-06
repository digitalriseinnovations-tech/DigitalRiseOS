-- ============================================================
-- DIGITAL RISE — AI EMPLOYEE PLATFORM
-- Supabase Schema v1.0
-- Multi-business, multi-agent, multi-industry
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean slate: drop any partially-created tables (safe on fresh project)
DROP TABLE IF EXISTS agency_settings, widget_installs, automations, reviews,
  bookings, leads, conversations, qualification_templates,
  knowledge_base, ai_employees, businesses CASCADE;

-- ── Businesses ──────────────────────────────────────────────
CREATE TABLE businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  industry      TEXT,
  business_type TEXT,
  plan          TEXT DEFAULT 'starter',  -- starter | professional | agency
  status        TEXT DEFAULT 'active',   -- active | paused | setup | cancelled
  contact_email TEXT,
  contact_phone TEXT,
  website       TEXT,
  whatsapp      TEXT,
  location      TEXT,
  color         TEXT DEFAULT '#6366F1',
  initial       TEXT,
  setup_score   INTEGER DEFAULT 0,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── AI Employees ─────────────────────────────────────────────
-- Each business can have multiple AI employees (agents)
CREATE TABLE ai_employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,          -- website-enquiry | booking | follow-up | review | phone | email
  name          TEXT DEFAULT 'Ava',
  avatar        TEXT,
  personality   TEXT DEFAULT 'warm-friendly',
  tone          TEXT DEFAULT 'Warm & Friendly',
  greeting      TEXT,
  unavail_msg   TEXT,
  engine        TEXT DEFAULT 'rule-based', -- rule-based | claude | openai | custom
  engine_config JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  config        JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Knowledge Base ───────────────────────────────────────────
CREATE TABLE knowledge_base (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,   -- hours | fees | services | faqs | policies | booking | escalation | links
  topic       TEXT,
  question    TEXT,
  answer      TEXT NOT NULL,
  keywords    TEXT[],          -- for rule-based matching
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Qualification Templates ──────────────────────────────────
CREATE TABLE qualification_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  question    TEXT NOT NULL,
  field_key   TEXT,   -- child_age | start_month | schedule | service | budget etc.
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT true
);

-- ── Conversations ────────────────────────────────────────────
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  ai_employee_id  UUID REFERENCES ai_employees(id),
  session_id      TEXT,             -- browser session fingerprint
  channel         TEXT DEFAULT 'website', -- website | whatsapp | email | phone
  source_url      TEXT,
  messages        JSONB DEFAULT '[]',
  metadata        JSONB DEFAULT '{}',
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_secs   INTEGER,
  lead_captured   BOOLEAN DEFAULT false
);

-- ── Leads ────────────────────────────────────────────────────
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  ai_employee_id  UUID REFERENCES ai_employees(id),
  conversation_id UUID REFERENCES conversations(id),
  name            TEXT,
  email           TEXT,
  phone           TEXT,
  enquiry_type    TEXT,
  channel         TEXT DEFAULT 'website',
  source          TEXT DEFAULT 'website-chat',
  status          TEXT DEFAULT 'New',   -- New | Qualified | Booked | Follow-up | Won | Lost | Escalated
  qual_score      INTEGER DEFAULT 0,
  qual_answers    JSONB DEFAULT '{}',
  intent_tags     TEXT[],
  notes           TEXT,
  next_action     TEXT,
  assigned_to     TEXT,
  priority        TEXT DEFAULT 'normal', -- low | normal | high | urgent
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE bookings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id      UUID REFERENCES leads(id),
  service      TEXT,
  staff_member TEXT,
  booking_date TIMESTAMPTZ,
  duration_min INTEGER,
  status       TEXT DEFAULT 'pending',  -- pending | confirmed | cancelled | completed | no-show
  notes        TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id     UUID REFERENCES leads(id),
  platform    TEXT,    -- google | facebook | yelp | trustpilot
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  content     TEXT,
  author_name TEXT,
  status      TEXT DEFAULT 'pending',  -- pending | published | flagged | responded
  response    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Automations ──────────────────────────────────────────────
CREATE TABLE automations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  trigger_type TEXT NOT NULL,  -- new_lead | qualified | booked | won | escalated | no_reply_24h
  action_type  TEXT NOT NULL,  -- send_email | send_whatsapp | notify_staff | create_task | webhook
  delay_mins   INTEGER DEFAULT 0,
  config       JSONB DEFAULT '{}',
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Widget Installations ─────────────────────────────────────
CREATE TABLE widget_installs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  install_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  domain      TEXT,
  is_active   BOOLEAN DEFAULT true,
  last_seen   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Agency / Platform ────────────────────────────────────────
CREATE TABLE agency_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_leads_business     ON leads(business_id);
CREATE INDEX idx_leads_status       ON leads(status);
CREATE INDEX idx_leads_created      ON leads(created_at DESC);
CREATE INDEX idx_convs_business     ON conversations(business_id);
CREATE INDEX idx_convs_session      ON conversations(session_id);
CREATE INDEX idx_kb_business        ON knowledge_base(business_id);
CREATE INDEX idx_kb_category        ON knowledge_base(category);
CREATE INDEX idx_bookings_business  ON bookings(business_id);
CREATE INDEX idx_bookings_date      ON bookings(booking_date);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE businesses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_employees       ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_installs    ENABLE ROW LEVEL SECURITY;

-- Public read for widget (leads/conversations insert only)
CREATE POLICY "Widget can insert conversations"
  ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Widget can insert leads"
  ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Widget can read KB"
  ON knowledge_base FOR SELECT USING (active = true);

CREATE POLICY "Widget can read businesses"
  ON businesses FOR SELECT USING (status = 'active');

-- ── Seed: Default businesses ─────────────────────────────────
INSERT INTO businesses (slug, name, industry, plan, status, contact_email, contact_phone, website, location, color, initial, setup_score) VALUES
  ('sunshine-nursery',    'Sunshine Nursery',     'Daycare',       'professional', 'active', 'hello@sunshinenursery.ca',    '+1 905-555-0101', 'sunshinenursery.ca',     'Brampton, ON',    '#7C3AED', 'SN', 92),
  ('smile-dental-studio', 'Smile Dental Studio',  'Dental Clinic', 'professional', 'active', 'info@smiledentalstudio.ca',   '+1 416-555-0202', 'smiledentalstudio.ca',   'Toronto, ON',     '#0891B2', 'SD', 85),
  ('bellas-restaurant',   'Bella''s Restaurant',  'Restaurant',    'starter',      'active', 'book@bellasrestaurant.ca',    '+1 647-555-0303', 'bellasrestaurant.ca',    'Mississauga, ON', '#D97706', 'BR', 70),
  ('probuild-contractors','ProBuild Contractors',  'Contractor',    'professional', 'active', 'quotes@probuild.ca',          '+1 905-555-0404', 'probuildcontractors.ca', 'Hamilton, ON',    '#16A34A', 'PB', 55),
  ('glow-beauty-lounge',  'Glow Beauty Lounge',   'Beauty Salon',  'starter',      'active', 'book@glowbeauty.ca',          '+1 416-555-0505', 'glowbeautylounge.ca',    'Vaughan, ON',     '#EC4899', 'GL', 78);
