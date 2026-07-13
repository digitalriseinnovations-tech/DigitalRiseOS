# PRODUCT ARCHITECTURE — Digital Rise Daycare OS
_Target architecture. Written Phase 0; implementation begins Phase 1 after review._

## 1. Product Definition

Digital Rise Daycare OS is a multi-tenant SaaS operating system for daycare businesses, enhanced by specialized daycare AI employees. It is **not** a CRM, not a demo, not a generic chatbot platform. Two platform levels:

- **Level A — Digital Rise Platform Admin**: internal console for onboarding, configuring, supporting and monitoring daycare businesses.
- **Level B — Daycare Business Workspace**: each daycare's isolated OS (owners, directors, managers, reception, educators, marketing).

Hard rules: complete features only (no half-finished AI employees shipped — an employee is either fully working or not offered); honest status labels (nothing shows "Connected"/"Live" unless authenticated/deployed); dark/light theme toggle available on **every** authenticated screen; tenant isolation enforced server-side.

## 2. Recommended Technology Decision

The current static-HTML + localStorage architecture cannot deliver authentication, server-enforced RBAC, or tenancy. Recommendation:

| Concern | Decision | Rationale |
|---|---|---|
| App framework | **Next.js (App Router, TypeScript)** on Vercel | Same host as today; server components + route handlers give server-side permission enforcement; incremental migration of existing vanilla-JS logic is straightforward. |
| Database | **Supabase Postgres** (already provisioned) | Schema base exists; RLS gives row-level tenancy; Storage for documents; Realtime for inbox/activity feeds. |
| Auth | **Supabase Auth** (email+password, invitations, password reset) | Ships all §3 brief flows; JWT claims carry `business_id` + `role` for RLS. MFA-ready. |
| AI | Anthropic Claude via existing `api/chat` pattern, with the **existing rule-based engine as deterministic fallback** and intent/outcome layer | Engine already test-covered; Claude key already live. |
| UI | Tailwind CSS + shadcn/ui primitives + **Lucide icons** + Framer Motion (restrained) | Matches UI_DESIGN_SYSTEM.md; replaces emoji icons. |
| Background jobs | Vercel Cron + Supabase queues (tasks table) | Follow-ups, reminders, resyncs, automation runs. |
| Email | Resend (or SES) | Invitations, notifications, parent communication. |
| WhatsApp | Meta WhatsApp Business Cloud API (later phase) | Honest "Not Connected" until credentials exist. |

**Reused as-is or ported** (from audit §6): AI engine + daycare catalog (ported to TS package `packages/engine`), import layer contract, widget (`widget.js` stays vanilla — it must run on any site), API route logic, Supabase schema (extended), onboarding/KB/tester/portal UX flows, `/daycare-ai` marketing page, `/client/daycare` kept as untouched reference until parity.

## 3. Repository Layout (target)

```
app/
  (platform)/platform/...      # Level A — Platform Admin
  (workspace)/w/[bizSlug]/...  # Level B — Daycare workspace
  (auth)/login, /invite, /reset, /forgot
  api/...                      # route handlers (typed, permission-checked)
packages/
  engine/        # intent classifier, composer, memory, outcomes (ported DRA/DRD)
  catalog/       # daycare skills, intents, scenarios, activities, printables, templates
  db/            # typed Supabase client, queries, zod schemas
  ui/            # design-system components (tokens per UI_DESIGN_SYSTEM.md)
public/widget/widget.js        # embeddable widget (vanilla, unchanged contract)
supabase/migrations/*          # versioned SQL migrations
website-legacy/                # current static site, frozen during migration
```

## 4. Level A — Platform Admin (module map)

| Module | Responsibilities |
|---|---|
| Businesses | Create/activate/pause/suspend/archive; industry edition (Daycare first); plan; modules; limits; onboarding status tracker (Draft → Account Created → Owner Invited → Owner Activated → Knowledge Pending → Channels Pending → AI Setup Pending → Testing → Live → Suspended → Archived). |
| Business Onboarding | 10-step flow of brief §22, every button with validation/loading/success/error. |
| AI Employee Assignment | Assign from the 14-employee catalog; per-business enablement; template management (global agent templates, global industry knowledge). |
| Users & Invitations | Create Business Owner; send/resend invitations; credential lifecycle. |
| Support | Secure impersonation (audited, banner-visible, time-boxed); support tickets. |
| Monitoring | Usage, performance, automation failures, system health, audit logs. |
| Billing | Plan/subscription status per business (Stripe later; manual status first). |

## 5. Level B — Daycare Workspace (module map)

Navigation groups (per brief §4): OVERVIEW (Home, AI Workforce) · PARENT JOURNEY (Parent Inbox, Enquiries, Tours, Waitlist, Registrations) · COMMUNICATION (Parent Communication, Phone & Callbacks, Reviews & Reputation) · DAYCARE CONTENT (Activities, Printable Hub, Knowledge Hub, Documents) · AUTOMATION & INSIGHTS (Automations, Analytics, Integrations) · ADMINISTRATION (Team, Settings).

| Module | Core objects | Notes |
|---|---|---|
| Home (Command Center) | aggregates | Today's Impact (real data or meaningful empty state), AI Workforce status, Priority Actions (every item actionable), Live Activity, Performance charts, Quick Actions. |
| AI Workforce | `ai_employees` | 14 employee types; per-employee workspace with 11 tabs (Overview, Live Work, Conversations, Tasks, Skills, Knowledge, Channels, Automations, Performance, Settings, Activity Log). Safety: business users configure behavior settings, never raw system prompts. |
| Parent Inbox | `conversations`, `messages`, `parents` | Unified 3-column inbox; AI draft → human approve; takeover/return; all conversation actions of brief §7. |
| Enquiries | `enquiries` | 12 statuses; table + kanban; saved views; bulk actions. |
| Tours | `tours` | Calendar-first (day/week/month/list); 10 statuses; reminders. |
| Waitlist | `waitlist_entries` | Real module (position, priority, follow-ups) — replaces "waitlist-flavored lead". |
| Registrations | `registrations`, `registration_fields`, `documents` | 15-stage guided onboarding; save-and-continue; staff review; consent timestamps. No compliance claims. |
| Parent Communication | `campaigns`, `templates`, `deliveries` | Draft → Preview → Audience → Channel → Schedule/Send → Results; AI drafts, human review. |
| Phone & Callbacks | `calls`, `callbacks` | Missed-call recovery, callback queue, transcripts (when phone provider connected). |
| Reviews & Reputation | `reviews`, `review_requests` | 7 statuses; approval workflow; never auto-publish negative responses. |
| Activities | `activities` | AI-assisted generation from `packages/catalog`; classroom assignment; calendar. |
| Printable Hub | `printables` | Real generated files (HTML→PDF) — no fake download buttons. |
| Knowledge Hub | `knowledge_sources`, `knowledge_entries` | Source lifecycle (Connected→Syncing→Processed→Needs Review→Error→Outdated→Disabled); answer testing with citations; conflict resolution. Replaces simulated import with a real crawler service behind the existing `DRI` contract. |
| Automations | `automations`, `automation_runs` | Trigger→Conditions→Actions→Delay→Approval→Outcome, with run history, failure logs, retry. Executable, not visual-only. |
| Analytics | materialized views | Brief §18 metrics from real records. |
| Integrations | `integrations` | Widget, Email, WhatsApp, Phone, Google/Outlook Calendar, GBP, Meta, Zapier, Webhooks, CSV. Status truthful; Configure/Test/Disconnect. |
| Team | `members`, `invitations` | Role assignment ≤ own role. |
| Settings | `business_settings` | Categories per brief §21. |
| Documents | Supabase Storage | Secure, permission-scoped access. |

## 6. AI Layer

- **Engine pipeline** (exists, ported): detect intent → load business knowledge (5 layers: industry defaults → type defaults → imported → manual rules → employee rules) → compose human response from approved facts only → push next action → persist structured outcomes (enquiry, tour, waitlist, callback, escalation, follow-up task) → log activity.
- **LLM enhancement**: Claude generates phrasing *constrained to engine-selected facts and intent*; rule-based composer remains the deterministic fallback and the safety floor (never invent fees/availability/safety policies).
- **Confidence & escalation**: per-employee confidence threshold + human-approval requirement (drafts land in Parent Inbox for approval when below threshold or when rules demand).
- **The 14 employees** ship in complete vertical slices (channel + workspace + outcomes + tests) — an employee that isn't finished is not exposed to businesses.

## 7. Tenancy & Security Model

- Every row: `business_id` FK. Postgres RLS: members can only read/write rows of their business; platform admins bypass via service role in server code only.
- JWT claims: `role`, `business_id`. Server route handlers re-check permissions (never trust client).
- Widget/public endpoints: keyed by `widget_installs.install_key` + domain check; insert-only.
- Impersonation: platform-admin-initiated, audited (`audit_logs`), visually banner-marked, session-scoped.
- Audit log on every mutating action (actor, business, entity, before/after, timestamp).
- Secrets only in server env; the publishable Supabase key is the only client-side key.

## 8. Environments

- **Production**: real tenants only. No seed data, no "Demo Mode" labels.
- **Sandbox**: explicit `is_sandbox` businesses for sales demos (Sunshine Nursery seed lives here).
- **Development**: seed scripts (ported from current DRS seed).
