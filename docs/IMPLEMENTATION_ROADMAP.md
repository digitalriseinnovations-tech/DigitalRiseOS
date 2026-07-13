# IMPLEMENTATION ROADMAP — Digital Rise Daycare OS

_Phased. No phase starts until the previous is reviewed. Every phase reports completed / partial / pending honestly — mocked functionality is never reported as complete._

## Global Non-Negotiables (apply to every phase)

1. **No half-finished AI employees.** An AI employee ships only when its full vertical slice works (channel intake → engine → outcomes → workspace → tests). Until then it does not appear in any business-facing catalog.
2. **Dark/light theme toggle on every authenticated screen** (persisted per user; both platform admin and workspace shells; `prefers-color-scheme` default).
3. No dead buttons — every interactive element has permission, action, validation, loading, success, error, disabled, empty, confirmation (destructive) states + audit event (brief §24).
4. Tenant isolation + server-side permission checks on every route/action.
5. Honest labels: Connected/Live only when true; seed data only in sandbox/dev.
6. Reuse before rebuild: engine, catalog, import contract, widget, API routes, schema, UX flows (audit §6).

## Phase 0 — Audit ✅ (this delivery)
Docs produced: CURRENT_STATE_AUDIT, PRODUCT_ARCHITECTURE, ROUTES_AND_PERMISSIONS, DATA_MODEL, IMPLEMENTATION_ROADMAP, UI_DESIGN_SYSTEM. No code changed.

## Phase 1 — Architecture, App Shell, Data Foundation
**Exists:** static site; Supabase schema v1; engine/catalog in vanilla JS.
**Change:** scaffold Next.js app alongside `website/` (legacy frozen, still deployed); port engine+catalog to `packages/engine`, `packages/catalog` (typed, with the 54 existing checks converted to vitest); create `packages/ui` shell (sidebar groups, topbar, theme toggle, page header) per UI_DESIGN_SYSTEM; write Supabase migrations for DATA_MODEL §3 (identity/tenancy tables first); typed db client.
**Files:** new `app/`, `packages/*`, `supabase/migrations/0001–0004`; `vercel.json` routing split (legacy static under `/legacy` or frozen paths).
**DB/API:** new tables: businesses(extended), users, members, invitations, plans, subscriptions, audit_logs. No destructive change to existing tables.
**Risks:** routing collisions with legacy static paths (mitigate: legacy freeze + explicit rewrites); scope creep (shell only, no modules yet).

## Phase 2 — Authentication & Platform Business Onboarding
**Exists:** no auth; Gen-3 onboarding wizard UX (reused as the flow blueprint).
**Change:** Supabase Auth (login/logout/forgot/reset/invite-activation/expired-invite/suspended/inactive flows); middleware + RLS policies; Platform Admin area: businesses list, 10-step onboarding (port wizard steps + add plan/modules/limits/owner/invitation), onboarding status pipeline, impersonation (audited); root redirect → `/login`.
**DB:** RLS policies per role matrix; invitation tokens; audit events.
**Risks:** RLS mistakes = tenant leak — covered by isolation tests (user A must never read business B fixtures).

## Phase 3 — Daycare Home Command Center
Port portal Dashboard tab into `/w/[biz]` with: Today's Impact from real queries (meaningful empty states — no zero-card grids), AI Workforce status cards, actionable Priority Actions, Live Activity feed (`ai_activity_log`), performance charts (mv views), Quick Actions (each opens a real flow). Theme toggle in shell (already from Phase 1).

## Phase 4 — AI Workforce
Port the 12-skill/14-employee catalog; employee list cards; individual workspace (11 tabs); settings (working hours, languages, tone, escalation, allowed/prohibited actions, confidence threshold, human approval, fallback, notifications — **no raw system prompt editing**); pause/resume with audit. Engine wired server-side (`/api/engine/converse`) with Claude phrasing + rule-based floor. Ship employees in this order, each complete before the next: **Parent Enquiry AI + Website AI** (one slice with widget), then Tour Booking AI, then Knowledge AI (Phase 9 dependency), then Follow-up AI. Others land in Phases 5–10 with their modules.

## Phase 5 — Parent Inbox & Enquiries
3-column inbox (conversations/messages/parent context), AI draft → approve → send, human takeover/return-to-AI, notes, tags, assignment; enquiries module (12 statuses, table+kanban, saved views, bulk actions). Widget messages flow into inbox in realtime. Email channel intake (Resend inbound or forwarding) — WhatsApp remains "Not Connected" until Phase 10.

## Phase 6 — Tours, Waitlist, Registrations
Calendar-first tours (day/week/month/list, 10 statuses, reminders via tasks); waitlist as real module (position/priority/follow-ups/offer flow); registrations: token parent form (`/r/[token]`, save & continue, uploads to Storage), 15 stages, staff review/correction/approval, consent timestamps. Tour Booking AI + Waitlist AI + Registration AI complete here.

## Phase 7 — Communication, Phone & Callbacks, Reviews
Campaigns (Draft→Preview→Audience→Channel→Schedule→Results) with per-recipient deliveries; template manager (port 6 daycare templates); Phone & Callbacks module (manual + missed-call recovery; provider integration later); Reviews module (7 statuses, approval workflow, never auto-publish negative). Parent Communication AI + Review AI + Phone AI (recovery messaging portion) complete here.

## Phase 8 — Activities & Printable Hub
Port activity catalog + AI-assisted generation (engine + Claude), full CRUD, classroom assignment, calendar scheduling; printable hub with **real generated PDFs** (HTML→PDF service), preview/customize/download/print/favourite. Activity & Content AI + Printable AI complete here.

## Phase 9 — Knowledge Hub & Documents
Replace simulated import with real crawler service behind the existing `DRI` contract (fetch permitted pages → extract → `knowledge_entries` with `needs_review`); source lifecycle statuses; FAQ manager; conflict resolution; answer testing with citations; per-employee source assignment; documents module (secure storage, permissions). Knowledge AI complete here. Missing-critical-info warnings feed Command Center priorities.

## Phase 10 — Automations & Integrations
Executable automation engine: Trigger→Conditions→Actions→Delay→Approval→Outcome over `tasks`/cron; 10 daycare templates (brief §17 list); run history, failure logs, retry, approval steps. Integration center: widget (exists), email (real), WhatsApp Business API, Google/Outlook Calendar, GBP, Zapier/webhooks — each with truthful status, Configure, **Test**, Disconnect. Email AI + WhatsApp AI + Follow-up AI complete here.

## Phase 11 — Analytics, Team, Settings, Billing
Materialized-view analytics with filters (date/location/program/channel/employee/user/source); Team management (invite/roles≤own/deactivate/audit); full Settings categories (brief §21); billing status via plans/subscriptions (Stripe if approved, else manual status managed by Platform Admin — labeled accordingly).

## Phase 12 — Production Readiness
Security review (RLS audit, rate limits, secret handling, impersonation audit), performance (query/index pass, bundle budget), accessibility pass (keyboard, focus, contrast, SR labels, modals), cross-device QA, error monitoring, backups, seed-data purge from production, legacy retirement: Gen-1/Gen-2 pages redirected then removed; `/client/daycare` reviewed for salvage then archived; migration script for any real localStorage pilots.

## Reporting Template (every phase)
1. What existed · 2. What changed · 3. Files touched · 4. DB/API changes · 5. Risks encountered · 6. Test evidence (commands + results) · 7. Completed / Partial / Pending — with mocked items explicitly listed as **not complete**.
