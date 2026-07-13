# ROUTES & PERMISSIONS — Digital Rise Daycare OS

## 1. Roles

| # | Role | Scope |
|---|---|---|
| 1 | Platform Super Admin | Whole platform, all tenants, destructive ops, role grants |
| 2 | Platform Admin | Onboarding, AI setup, support, plans, monitoring (no platform-role grants, no billing writes unless granted) |
| 3 | Business Owner | Everything in own workspace incl. billing, integrations, team |
| 4 | Daycare Director | Operations, registrations, tours, staff modules, analytics, parent communication |
| 5 | Daycare Manager | Operational access; **no** billing, **no** high-risk integrations (connect/disconnect) |
| 6 | Reception / Admin Staff | Parent Inbox, Enquiries, Tours, Waitlist, Callbacks, registration support, messages |
| 7 | Educator / Staff | Activities, Printable Hub, classroom content, approved parent updates, limited child info where permitted |
| 8 | Marketing User | Reviews, campaigns, social content, announcements, analytics |
| 9 | Read-only User | Approved dashboards & reports only |

Rules: a user can never grant a role higher than their own · every route **and** every API action checks permissions server-side (hiding nav is cosmetic only) · all mutations write `audit_logs`.

## 2. Permission Matrix (Level B workspace)

`F` full · `E` edit/operate · `V` view · `–` none

| Module | Owner | Director | Manager | Reception | Educator | Marketing | Read-only |
|---|---|---|---|---|---|---|---|
| Home | F | F | F | E | V | V | V |
| AI Workforce (view/pause) | F | E | E | V | – | V | V |
| AI Workforce (settings) | F | E | – | – | – | – | – |
| Parent Inbox | F | F | F | F | – | V | – |
| Enquiries | F | F | F | F | – | V | V |
| Tours | F | F | F | F | – | – | V |
| Waitlist | F | F | F | F | – | – | V |
| Registrations | F | F | E | E | – | – | V |
| Registration approval | F | F | – | – | – | – | – |
| Parent Communication | F | F | E | E (drafts) | E (approved updates) | F | V |
| Phone & Callbacks | F | F | F | F | – | – | – |
| Reviews & Reputation | F | F | E | – | – | F | V |
| Activities | F | F | F | V | F | V | V |
| Printable Hub | F | F | F | V | F | V | V |
| Knowledge Hub | F | F | E | V | – | V | – |
| Documents | F | F | E | E | V (permitted) | – | – |
| Automations | F | F | V | – | – | V | – |
| Analytics | F | F | F | V | – | F | V |
| Integrations | F | V | V | – | – | – | – |
| Team | F | E (≤Manager) | – | – | – | – | – |
| Settings: Business/Brand/AI/Comm/Tours/Registration | F | E | V | – | – | – | – |
| Settings: Security | F | V | – | – | – | – | – |
| Settings: Billing | F | – | – | – | – | – | – |

## 3. Route Map — Target

### Auth (public)
```
/login              /forgot-password       /reset-password
/invite/[token]     (first-time password setup, expired-invite handling)
/suspended          (suspended business landing)
/unauthorized       (403 page)
```

### Level A — Platform Admin  `/platform/*`  (Platform roles only)
```
/platform                          → overview (health, onboarding pipeline, usage)
/platform/businesses               → list + statuses
/platform/businesses/new           → 10-step onboarding (brief §22)
/platform/businesses/[id]          → business profile, plan, modules, limits
/platform/businesses/[id]/agents   → AI employee assignment
/platform/businesses/[id]/users    → owner + invitations
/platform/businesses/[id]/audit    → audit log
/platform/templates                → agent templates, global industry knowledge
/platform/support                  → tickets, impersonation launcher
/platform/system                   → system health, usage
```

### Level B — Daycare Workspace  `/w/[bizSlug]/*`  (members of that business only)
```
/w/[biz]                    → Home / Command Center
/w/[biz]/workforce          → AI Workforce list
/w/[biz]/workforce/[emp]    → employee workspace (11 tabs)
/w/[biz]/inbox              → Parent Inbox (3-column)
/w/[biz]/enquiries          → Enquiries (table/kanban)
/w/[biz]/tours              → Tours (calendar-first)
/w/[biz]/waitlist
/w/[biz]/registrations      + /registrations/[id]
/w/[biz]/communication      → campaigns, templates
/w/[biz]/phone              → calls & callbacks
/w/[biz]/reviews
/w/[biz]/activities
/w/[biz]/printables
/w/[biz]/knowledge
/w/[biz]/documents
/w/[biz]/automations        + /automations/[id]/runs
/w/[biz]/analytics
/w/[biz]/integrations
/w/[biz]/team
/w/[biz]/settings/(business|brand|ai|communication|tours|registration|security|billing)
```

### Public / parent-facing
```
/daycare-ai                 → marketing site (exists)
/widget/widget.js           → embeddable widget (exists; keyed by install_key)
/r/[registrationToken]      → parent registration form (save & continue)
/api/public/*               → widget chat/lead/config endpoints (rate-limited, insert-only)
```

## 4. Current → Target Route Mapping

| Current (static) | Target | Disposition |
|---|---|---|
| `/agents/businesses` | `/platform/businesses` | Port UX, add auth/status pipeline |
| `/agents/businesses/new` | `/platform/businesses/new` | Extend 7-step → 10-step (plan, owner user, invitation) |
| `/agents/businesses/:slug/*` (admin pages) | `/platform/businesses/[id]/*` | Port |
| `/agents/businesses/:slug/portal` | `/w/[bizSlug]` (whole workspace) | Portal tabs become real modules |
| `/agents/widget/*`, `/api/*` | `/public/widget`, `/api/public/*` | Keep contract, add install-key auth |
| `/daycare-ai` | unchanged | Keep; update fictional metrics before launch |
| `/platform/*` (Gen 1), `/agents/agent-website-enquiry/*`, flat `/agents/*` (Gen 2) | — | Freeze → redirect → remove after parity |
| `/client/daycare/*` | — | Reference only; untouched until Phase 12 review |
| Root `/` redirect → `/platform/dashboard` | `/login` (or `/daycare-ai` for logged-out) | Fix in Phase 2 |

## 5. Enforcement Rules

1. Middleware resolves session → `role`, `business_id`; unauthenticated → `/login`; suspended business → `/suspended`; inactive user → blocked with message.
2. Every server action/route handler re-validates: session, role permission (matrix above), tenant ownership of every touched record.
3. RLS as final backstop: workspace queries run as the user (JWT), platform-admin queries via service role in server code only, never in the browser.
4. Impersonation: `impersonating_business_id` claim, audit-logged start/stop, persistent on-screen banner, no billing/security writes while impersonating.
5. Destructive actions (delete/archive/suspend/disconnect/pause employee/cancel tour/remove user) require confirmation dialogs and write audit events.
