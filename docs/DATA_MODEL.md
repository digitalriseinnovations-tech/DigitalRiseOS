# DATA MODEL — Digital Rise Daycare OS

## 1. Principles

- Every tenant-owned table has `business_id uuid NOT NULL REFERENCES businesses(id)` with RLS.
- UUID PKs, `created_at`/`updated_at` timestamps, soft-archive over hard delete where records have history.
- One shared record graph — no screen-only data (brief §23). All modules read/write the same parents, conversations, enquiries, tours, etc.
- `audit_logs` receives an event for every mutation.

## 2. As-Built Today (for migration reference)

**localStorage (`drp_*` via DRS)** — the current canonical app data:
- `businesses`: id, name, slug, industryGroup, businessType, website, phone, email, whatsapp, location, reviewLink, bookingLink, status, color, initial, selectedAgents[], **skills[]**, knowledge{ops fields}, intel{imported}, manualRules[], social{}, handoff{}, commSettings{}, setupStatus, testPassed, deployChannels[]
- `agents`: id, businessId, agentType, agentName, status, channels[], role, purpose, supportedIntents[], actionsEnabled{}, escalationRules[], responseStyle{}, knowledgeSources{}, trainingStatus, lastTrained, trainingRules[], tasksCompleted
- `leads`: id, businessId, agentId, name, phone, email, enquiryType, requestedService, channel, status, qualScore, score, urgency, priority, bookingRequested, quoteRequested, reviewRequested, escalated, lastInteraction, nextFollowUpDue, notes, nextAction, fields{childAge, ageUnit, startDate, schedule, allergyNoted, allergyDetail}
- `conversations`: id, businessId, agentId, leadId, channel, leadCaptured, messages[{role,text,ts}]
- `bookings`: id, businessId, agentId, leadId, service, status, bookingDate, notes
- `reviews`: id, businessId, agentId, platform, rating, authorName, content, status
- `tasks`: id, businessId, agentId, leadId, type, trigger, status, dueAt, message

**Supabase (live, widget-only writes)**: businesses, ai_employees, knowledge_base, qualification_templates, conversations, leads, bookings, reviews, automations, widget_installs, agency_settings.

**Migration note:** localStorage collections map ~1:1 onto target tables below; `leads` splits into `parents` + `enquiries`; `tasks` becomes `tasks` + `automation_runs`; wizard `handoff{}` folds into `integrations` + `business_settings`.

## 3. Target Schema

### Identity & tenancy
```
tenants/businesses(id, legal_name, display_name, slug, industry_edition, status,
  onboarding_status, plan_id, timezone, location, phone, email, website, whatsapp,
  review_link, booking_link, logo_url, brand{jsonb}, is_sandbox, limits{jsonb},
  enabled_modules text[], created_at, updated_at)

users(id → auth.users, full_name, avatar_url, is_platform_admin, is_super_admin,
  status active|inactive, last_login_at)

members(id, business_id, user_id, role owner|director|manager|reception|educator|
  marketing|readonly, locations text[], status, invited_by, created_at)

invitations(id, business_id, email, role, token, expires_at,
  status pending|accepted|expired|revoked, sent_by, sent_at)

plans(id, name, price, limits{jsonb}, modules text[])
subscriptions(id, business_id, plan_id, status, period_start, period_end)

audit_logs(id, business_id?, actor_user_id, actor_role, action, entity_type,
  entity_id, before{jsonb}, after{jsonb}, impersonation boolean, created_at)
```

### AI workforce
```
ai_employees(id, business_id, type ∈ 14-employee catalog, name, status active|paused|error,
  channels text[], settings{working_hours, languages[], tone, escalation_rules[],
  allowed_actions{}, prohibited_actions[], confidence_threshold, human_approval,
  fallback_response, notification_rules}, knowledge_source_ids uuid[],
  training_status, last_trained_at, stats{jsonb cached})

ai_activity_log(id, business_id, employee_id, kind, summary, entity_type, entity_id, created_at)
```

### Parent journey
```
parents(id, business_id, name, email, phone, preferred_channel, source, stage,
  consent{jsonb, timestamps}, notes, assigned_member_id, next_action, created_at)

children(id, business_id, parent_id, name?, dob_or_age, program_interest,
  schedule_needs, allergies, medical_notes, start_date_preference)

enquiries(id, business_id, parent_id, employee_id?, channel, source,
  status ∈ {new, ai_handling, needs_human, qualified, tour_offered, tour_booked,
  waitlisted, registration_started, enrolled, not_interested, unreachable, closed},
  requested_service, urgency, score, first_message, assigned_member_id,
  next_follow_up_at, created_at, updated_at)

conversations(id, business_id, parent_id?, enquiry_id?, employee_id?, channel,
  status open|resolved|escalated, assigned_to ai|member_id, unread, tags text[], created_at)
messages(id, conversation_id, business_id, sender ai|parent|member_id|system,
  body, draft boolean, approved_by?, intent, confidence, knowledge_source, created_at)

tours(id, business_id, parent_id, child_id?, enquiry_id?, program, scheduled_at,
  duration_min, assigned_member_id, status ∈ {requested, pending_confirmation,
  confirmed, reminder_sent, completed, no_show, cancelled, rescheduled,
  follow_up_due, registration_started}, source, outcome_notes, created_at)

waitlist_entries(id, business_id, parent_id, child_id, program, preferred_start,
  schedule, priority, position, subsidy_required, status ∈ {active, contacted,
  offered, responded, tour_booked, registration_started, enrolled, deferred, removed},
  last_contact_at, next_follow_up_at, notes)

registrations(id, business_id, parent_id, child_id, token, stage ∈ 15 stages of brief §11,
  completion_pct, fields{jsonb per business registration_config}, missing_fields text[],
  consent_log[{item, ts, ip}], reviewed_by, decision, decision_reason, created_at)
documents(id, business_id, registration_id?, parent_id?, kind, storage_path,
  uploaded_by, status, created_at)   — files in Supabase Storage, signed URLs

calls(id, business_id, direction, from, to, status answered|missed|voicemail,
  transcript?, recording_path?, employee_id?, created_at)
callbacks(id, business_id, parent_id?, phone, reason, due_at,
  status pending|done|failed, assigned_member_id)
```

### Communication & reputation
```
templates(id, business_id, kind ∈ {closure, event, tour_confirm, waitlist_confirm,
  fee_reminder, document_reminder, review_request, custom}, channel, subject?, body,
  enabled, updated_by)

campaigns(id, business_id, kind announcement|newsletter|reminder|emergency, subject,
  body, audience{jsonb selector}, channels text[], status draft|scheduled|sending|sent,
  scheduled_at, created_by, approved_by)
deliveries(id, campaign_id, business_id, parent_id, channel,
  status queued|sent|delivered|failed, error?, sent_at)

review_requests(id, business_id, parent_id, channel, status, sent_at, resulted_review_id?)
reviews(id, business_id, source google|internal|other, rating, author, content,
  sentiment, status ∈ {new, draft_ready, needs_human, approved, responded, escalated,
  archived}, response_draft, responded_by, responded_at)
```

### Content & knowledge
```
activities(id, business_id?, title, age_groups text[], category ∈ brief §14 list,
  objective, materials, prep, steps, duration, setting, safety_notes, educator_notes,
  printable_ids uuid[], template boolean, classroom?, scheduled_for?, archived)

printables(id, business_id?, type ∈ brief §15 list, title, age_groups, season?,
  spec{jsonb}, file_path (generated PDF — real file), favourite, created_by)

knowledge_sources(id, business_id, kind website|document|faq|manual|social|profile,
  uri?, storage_path?, status ∈ {connected, syncing, processed, needs_review, error,
  outdated, disabled}, last_sync_at, assigned_employee_ids uuid[], created_by)
knowledge_entries(id, business_id, source_id, field_key?, question?, answer, keywords[],
  approved boolean, conflict_with uuid?, updated_by, updated_at)
```

### Automation & integrations
```
automations(id, business_id, name, template_key?, trigger, conditions{jsonb},
  actions[{type, config, delay, requires_approval}], active, created_by)
automation_runs(id, automation_id, business_id, trigger_entity, status
  success|failed|awaiting_approval|retrying, steps[{action, status, error?}],
  started_at, finished_at)
tasks(id, business_id, employee_id?, parent_id?, kind, due_at,
  status scheduled|done|failed|cancelled, payload{jsonb})

integrations(id, business_id, provider ∈ {widget, email, whatsapp, phone,
  google_calendar, outlook, gbp, meta, zapier, webhook, custom},
  status not_connected|connected|needs_attention, config{jsonb, secrets server-side},
  last_sync_at, last_test{status, at}, connected_by)
widget_installs(id, business_id, install_key, domain, active, last_seen)   — exists
```

### Analytics
Materialized views / rollups over the above: `mv_daily_impact`, `mv_channel_performance`, `mv_conversion_funnel` (enquiry→tour→registration→enrolled), `mv_employee_performance`, `mv_popular_questions`. Charts read only these — no invented numbers.

## 4. Retention & Integrity Rules

- Parents/children: PII minimization; consent timestamps mandatory before outbound marketing.
- `registrations.fields` schema is per-business (`settings/registration`), validated server-side.
- No table may be written without an authenticated actor except `api/public/*` widget inserts (enquiries/conversations/messages via install_key).
- Deletes: archive by default; hard delete only Super Admin + audit.
