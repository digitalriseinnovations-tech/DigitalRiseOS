-- ============================================================
-- Migration 0003 — Activity log, tasks, member write access
-- (Phase 3: Command Center). Run AFTER 0001 and 0002.
-- ============================================================

-- ── AI activity log (the workspace Live Activity feed) ─────
CREATE TABLE IF NOT EXISTS ai_activity_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  employee_id   UUID REFERENCES ai_employees(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  kind          TEXT NOT NULL,   -- enquiry_answered | tour_booked | escalated | review_received | task_prepared | employee_paused | ...
  summary       TEXT NOT NULL,
  entity_type   TEXT,
  entity_id     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_business ON ai_activity_log(business_id, created_at DESC);

-- ── Tasks (follow-ups, callbacks, reminders) ────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES ai_employees(id) ON DELETE SET NULL,
  lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
  kind        TEXT NOT NULL,     -- whatsapp-followup | callback | reminder | review-request
  trigger     TEXT,
  status      TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','done','failed','cancelled')),
  due_at      TIMESTAMPTZ,
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_business ON tasks(business_id, status, due_at);

ALTER TABLE ai_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks           ENABLE ROW LEVEL SECURITY;

-- ── Role helper ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION member_has_role(p_business UUID, p_roles TEXT[]) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE business_id = p_business AND user_id = auth.uid()
      AND status = 'active' AND role = ANY(p_roles)
  ) OR is_platform_admin();
$$;

-- ── Policies: new tables ────────────────────────────────────
DROP POLICY IF EXISTS "members read activity" ON ai_activity_log;
CREATE POLICY "members read activity" ON ai_activity_log
  FOR SELECT USING (business_id IN (SELECT my_business_ids()) OR is_platform_admin());
DROP POLICY IF EXISTS "members write activity" ON ai_activity_log;
CREATE POLICY "members write activity" ON ai_activity_log
  FOR INSERT WITH CHECK (business_id IN (SELECT my_business_ids()) OR is_platform_admin());

DROP POLICY IF EXISTS "members read tasks" ON tasks;
CREATE POLICY "members read tasks" ON tasks
  FOR SELECT USING (business_id IN (SELECT my_business_ids()) OR is_platform_admin());
DROP POLICY IF EXISTS "ops write tasks" ON tasks;
CREATE POLICY "ops write tasks" ON tasks
  FOR ALL USING (member_has_role(business_id, ARRAY['owner','director','manager','reception']))
  WITH CHECK (member_has_role(business_id, ARRAY['owner','director','manager','reception']));

-- ── Member write access on operational v1 tables ────────────
-- Reception and above can create/update parent-journey records.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['leads','bookings','conversations']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "ops insert %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "ops update %s" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "ops insert %s" ON %I FOR INSERT WITH CHECK (member_has_role(business_id, ARRAY[''owner'',''director'',''manager'',''reception'']))', t, t);
    EXECUTE format(
      'CREATE POLICY "ops update %s" ON %I FOR UPDATE USING (member_has_role(business_id, ARRAY[''owner'',''director'',''manager'',''reception'']))', t, t);
  END LOOP;
END $$;

-- reviews: marketing + leadership can update (respond/escalate)
DROP POLICY IF EXISTS "reviews update" ON reviews;
CREATE POLICY "reviews update" ON reviews
  FOR UPDATE USING (member_has_role(business_id, ARRAY['owner','director','manager','marketing']));

-- ai_employees: owner/director may update (pause/resume, settings)
DROP POLICY IF EXISTS "leadership update employees" ON ai_employees;
CREATE POLICY "leadership update employees" ON ai_employees
  FOR UPDATE USING (member_has_role(business_id, ARRAY['owner','director']));
