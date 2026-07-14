-- ============================================================
-- Migration 0002 — Auth functions, platform-admin RLS,
-- invitation flow, founder bootstrap (Phase 2)
-- ============================================================

-- ── Auto-create profile on signup ───────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Platform admin helper ───────────────────────────────────
CREATE OR REPLACE FUNCTION is_platform_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT is_platform_admin OR is_super_admin FROM profiles WHERE id = auth.uid()),
    false);
$$;

-- ── Founder bootstrap: the FIRST user to claim becomes admin ─
CREATE OR REPLACE FUNCTION claim_founder() RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM profiles WHERE is_platform_admin OR is_super_admin) THEN
    RETURN false;  -- an admin already exists; refuse silently
  END IF;
  UPDATE profiles SET is_platform_admin = true, is_super_admin = true
  WHERE id = auth.uid();
  INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
  VALUES (auth.uid(), 'founder_claimed', 'profile', auth.uid()::text);
  RETURN true;
END $$;

-- ── Invitation lookup (public, token-gated) ─────────────────
CREATE OR REPLACE FUNCTION get_invitation(p_token TEXT)
RETURNS TABLE (email TEXT, role TEXT, business_name TEXT, business_slug TEXT, status TEXT, expired BOOLEAN)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.email, i.role, b.name, b.slug, i.status, (i.expires_at < NOW())
  FROM invitations i JOIN businesses b ON b.id = i.business_id
  WHERE i.token = p_token;
$$;

-- ── Invitation acceptance (called by the just-signed-up user) ─
CREATE OR REPLACE FUNCTION accept_invitation(p_token TEXT) RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE inv RECORD; biz_slug TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO inv FROM invitations WHERE token = p_token;
  IF NOT FOUND THEN RAISE EXCEPTION 'invitation_not_found'; END IF;
  IF inv.status <> 'pending' THEN RAISE EXCEPTION 'invitation_%', inv.status; END IF;
  IF inv.expires_at < NOW() THEN
    UPDATE invitations SET status = 'expired' WHERE id = inv.id;
    RAISE EXCEPTION 'invitation_expired';
  END IF;
  IF LOWER(inv.email) <> LOWER((SELECT email FROM auth.users WHERE id = auth.uid())) THEN
    RAISE EXCEPTION 'email_mismatch';
  END IF;

  INSERT INTO members (business_id, user_id, role, invited_by)
  VALUES (inv.business_id, auth.uid(), inv.role, inv.sent_by)
  ON CONFLICT (business_id, user_id) DO UPDATE SET role = EXCLUDED.role, status = 'active';

  UPDATE invitations SET status = 'accepted' WHERE id = inv.id;

  UPDATE businesses SET onboarding_status = 'owner_activated'
  WHERE id = inv.business_id AND onboarding_status IN ('owner_invited','account_created');

  INSERT INTO audit_logs (business_id, actor_user_id, action, entity_type, entity_id)
  VALUES (inv.business_id, auth.uid(), 'invitation_accepted', 'invitation', inv.id::text);

  SELECT slug INTO biz_slug FROM businesses WHERE id = inv.business_id;
  RETURN biz_slug;
END $$;

-- ── Platform-admin RLS: full control, using the admin's own JWT ─
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['businesses','members','invitations','plans','subscriptions',
    'audit_logs','ai_employees','knowledge_base','conversations','leads','bookings',
    'reviews','automations','widget_installs','qualification_templates']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "platform admin all %s" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "platform admin all %s" ON %I FOR ALL USING (is_platform_admin()) WITH CHECK (is_platform_admin())',
      t, t);
  END LOOP;
END $$;

-- profiles: platform admins can read all profiles (support), users their own
DROP POLICY IF EXISTS "platform admin read profiles" ON profiles;
CREATE POLICY "platform admin read profiles" ON profiles
  FOR SELECT USING (is_platform_admin());

-- audit logs: any authenticated member may INSERT audit rows for their business
DROP POLICY IF EXISTS "members insert audit" ON audit_logs;
CREATE POLICY "members insert audit" ON audit_logs
  FOR INSERT WITH CHECK (
    actor_user_id = auth.uid() AND
    (business_id IS NULL AND is_platform_admin()
     OR business_id IN (SELECT my_business_ids())
     OR is_platform_admin())
  );

-- invitations: pending lookup handled by get_invitation() RPC only (no anon table read)
