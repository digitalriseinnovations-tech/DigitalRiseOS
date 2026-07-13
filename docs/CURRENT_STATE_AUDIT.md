# CURRENT STATE AUDIT — Digital Rise Daycare OS
_Phase 0 audit · 2026-07-09 · no code was changed to produce this document_

## 1. Stack & Infrastructure

| Layer | Current reality |
|---|---|
| Framework | **None.** Static multi-page HTML + vanilla ES5/ES6 JS. No build step, no bundler, no TypeScript, no component framework. |
| Hosting | Vercel. Root directory = `website/`. `cleanUrls: true`, slug routes via `rewrites` in `website/vercel.json`. Git integration: pushes to `master` auto-deploy to production (`digital-rise-os.vercel.app`). |
| Serverless API | `website/api/` — 4 Node functions (ESM, compiled to CJS by Vercel): `chat.js`, `lead.js`, `conversation.js`, `config.js`. |
| Database | Supabase project **provisioned and live**. `supabase/schema.sql` applied: 11 tables, RLS enabled, permissive widget policies (public INSERT on leads/conversations, public SELECT on businesses/KB). **Only the API routes use it.** The main app persists to browser `localStorage`. |
| AI | `api/chat.js` supports engine switch `rule-based | claude | openai`. `ANTHROPIC_API_KEY` is set on Vercel and verified working (Claude Haiku). The in-app tester/portal uses the local rule-based engine (`agents-actions.js`), not the API. |
| Auth | **None. Zero authentication anywhere.** No users, no sessions, no roles, no route protection. Every page is public. |
| Tenancy | Not enforced. localStorage is per-browser (accidental isolation, not real isolation). Supabase rows carry `business_id` but there is no auth to scope reads. |
| Env vars (Vercel) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ANTHROPIC_API_KEY` (all sensitive-flagged). |
| Styling | Three separate hand-rolled CSS systems (see §4). Inter font. Icons are **emoji** + a few inline SVGs (violates the new design rules). |
| Dark mode | Exists in the Gen-3 admin shell (`AG.toggleTheme`, `data-theme` attr, `dr_theme` key). **Missing** from the client portal, landing page, widget, and all Gen-1/Gen-2 pages. |

## 2. Three Generations of Build (the core problem)

The repo contains three overlapping product generations that do not share data or components:

### Gen 1 — `/platform/*` + `/client/daycare/*` (oldest)
- `platform/`: 11 pages — platform dashboard, businesses list, `businesses/new` (old onboarding), per-daycare pages (ai-employees, automations, conversations, **crm**, knowledge-base, reviews, settings). Data layer: `window.DR_DATA` seed + `DR.store` → localStorage. Own shell (`platform.css/js`, 59KB).
- `client/daycare/`: 17 pages — a daycare *management* OS (dashboard, children, staff, attendance, billing, daily-reports, calendar, admissions, tours, activities, parent-messages, reviews, knowledge-base, ai-employee, automations, settings). Data layer: `window.DC` seed (static). Own shell (`client.css/js`, 91KB).
- **Status: visual-only / seeded demo.** Root `index.html` and `website/index.html` still redirect to `/platform/dashboard`.

### Gen 2 — `/agents/agent-website-enquiry/*` + flat `/agents/{leads,bookings,conversations,employees,integrations,knowledge-base,reviews,automations}/`
- Single-agent era pages using `window.AD` (`agents-data.js` top half) + `AG` (`agents.js`). Seeded demo data, own nav.
- **Status: stale.** Not linked from current navigation but still deployed and reachable by URL.

### Gen 3 — `/agents/businesses/*` + shared `DRD/DRS/DRA/DRI/DRUI` (current, canonical)
- Admin console: Daycare Clients list, **New Daycare Setup** 7-step wizard (draft persistence works), business detail, AI-employee detail (9 tabs), 5-layer knowledge base, deploy/Connect Channels, leads/conversations/bookings/reviews pages.
- **Daycare Client Portal** (`businesses/portal.html`, served at `/agents/businesses/:slug/portal`): 7 tabs, driven by the same data.
- Conversation engine: real intent classifier (20+ intents incl. daycare-specific), fact-based response composer, conversation memory, honest fallback, structured outcomes (lead + booking + follow-up task records). **Covered by 54 automated Node checks** (scratchpad test harnesses; not committed).
- Embeddable widget (`agents/widget/widget.js`) + live API routes that really write to Supabase.
- Marketing landing page `/daycare-ai` (new, animated, self-contained).
- **Status: functionally real within localStorage limits.**

## 3. Page-by-Page Functional Assessment

Legend: ✅ functional (within localStorage/mock limits) · ◐ partially functional · 👁 visual only · 🗑 stale/superseded

| Area | Pages | State |
|---|---|---|
| `/agents/businesses` (clients list) | 1 | ✅ real data, statuses, portal links |
| `/agents/businesses/new` (New Daycare Setup) | 1 | ✅ saves drafts, imports (simulated), trains (simulated), tests (real engine), deploys with gates |
| `/agents/businesses/:slug` detail + agents + agent-detail | 3 | ✅ (agent-detail tester runs real engine, writes real records) |
| `/agents/businesses/:slug/knowledge-base` | 1 | ✅ 5-layer, editable, re-import works |
| `/agents/businesses/:slug/{leads,conversations,bookings,reviews}` | 4 | ✅ CRUD-light on real localStorage records |
| `/agents/businesses/:slug/deploy` | 1 | ◐ honest Demo/Live labels; "channels" are ready-states, no real integrations |
| `/agents/businesses/:slug/portal` (Client Portal) | 1 | ✅ reads real records; comm-template toggles persist; activity hub static catalog |
| `/agents/dashboard`, `/agents/industries`, `/agents/templates`, `/agents/settings` | 4 | ✅ (industries page is informational; hidden from nav) |
| `/agents/widget/*` + `/api/*` | 6 | ✅ widget works standalone; lead/conversation POST to Supabase verified; `api/chat` Claude verified |
| `/daycare-ai` landing | 1 | ✅ marketing page, self-contained |
| `/agents/agent-website-enquiry/*` | 6 | 🗑 Gen 2, seeded demo |
| `/agents/{leads,bookings,conversations,employees,integrations,knowledge-base,reviews,automations}` (flat) | 8 | 🗑 Gen 2 stale |
| `/platform/*` | 11 | 🗑👁 Gen 1, seeded demo; **still the target of the root redirect** |
| `/client/daycare/*` | 17 | 👁 Gen 1 daycare-management demo (kept per instruction as reference) |
| `/home`, `/demo`, `/industries`, `/industry`, `/admin` | ~6 | 👁 old marketing experiments |
| `/about`, `/audit`, `/contact`, `/solutions` | 0 files | Empty directories |

## 4. Duplicated / Hard-coded / Mocked / Broken

**Duplications**
1. Three app shells: `platform.css/js`, `client.css/js`, `agents.css/js + agents-ui.js`.
2. Three dashboards (platform, client/daycare, agents).
3. Three data layers seeded with the *same* fictional business (Sunshine Nursery): `DR_DATA`, `DC`, `DRS` seed — with **conflicting facts** (Edmonton vs Brampton; different phones).
4. Two knowledge-base implementations (Gen-2 agent KB vs Gen-3 5-layer KB), plus a third in `client/daycare`.
5. Two business-onboarding wizards (`platform/businesses/new` vs `agents/businesses/new`).
6. Legacy `AD` object still shipped inside `agents-data.js` (top ~180 lines) solely for Gen-2 pages.

**Simulated (honestly labeled, by design)**
- Website crawl/import (`agents-import.js` — realistic generator, modular for real fetcher swap).
- Training (timed status transitions; no model calls).
- Channel "sending" (WhatsApp/email/SMS) — records `tasks` rows labeled *prepared/scheduled*; nothing sends.
- Missed-call events (simulate button).
- Landing-page trust metrics (12,480 parents assisted etc.) — **marketing fiction; must be replaced or clearly framed before sale.**

**Hard-coded / fake data**
- All Gen-1 and Gen-2 page content.
- Gen-3 seed businesses (Sunshine Nursery, Smile Dental) — acceptable as dev seed only; must not ship to production tenants.
- Dashboard mockup numbers on `/daycare-ai`.

**Dead or weak interactive elements (Gen-3 only; Gen-1/2 have many more)**
- Topbar: global search input (no handler), notifications bell (toast stub) — in admin shell and portal-equivalent areas.
- Deploy page: channel cards have no config forms; "integration ready" states have no Test buttons.
- Portal: review "response draft" is static text (no send/copy action); printable cards have no generate/download (correctly not fake buttons — they are display cards, but the module is content-only).
- Widget demo page "Customised/Advanced" tab copy button `copyAdvanced()` is a broken no-op.
- `agents/settings` reset works; theme toggle works; nothing else configurable.

**Broken/inconsistent**
- Root redirect targets Gen-1 `/platform/dashboard` — the wrong product.
- `agents/businesses/detail.html` "Recent AI Actions" uses `tm.conversations` singularization hack (cosmetic).
- Gen-2 pages reference nav that no longer matches the shell.
- Widget on third-party sites reads Supabase-configured businesses only via `/api/config/:slug` (works), but Gen-3 businesses created in the admin **never reach Supabase** — a portal/widget data split: widget leads land in Supabase, admin/portal read localStorage. **The two stores never sync.** This is the single most important architectural gap.

## 5. Current Data Models (as-built)

**Gen-3 localStorage (`drp_*` via `DRS`)** — collections: `businesses`, `agents`, `leads`, `conversations`, `bookings`, `reviews`, `tasks` (fields documented in DATA_MODEL.md §2). Plus `dr_theme`, Gen-1/2 keys (`dc_*`, `DR.store` keys, `ad_*`).

**Supabase (live)** — `businesses`, `ai_employees`, `knowledge_base`, `qualification_templates`, `conversations`, `leads`, `bookings`, `reviews`, `automations`, `widget_installs`, `agency_settings`. RLS permissive (widget-oriented). No `users`, no `roles`, no `tenants/members`, no `tasks`, no `registrations`, no `waitlist`, no audit log.

**Auth/role system:** none (see §1).

## 6. What Is Genuinely Reusable

1. **The AI engine** (`agents-actions.js`: intent classifier, fact extraction, response composer, memory, outcomes) — portable pure-JS, test-covered. Port as a shared package.
2. **The daycare domain catalog** (`agents-data.js` DRD: 12 skills, 20+ intents, ops fields, scenarios, activities, printables, comm templates, follow-up sequences).
3. **The import layer contract** (`agents-import.js`) — Promise-based modules ready for real fetchers.
4. **Widget + API routes** — already production-shaped, already writing to Supabase.
5. **Supabase schema** — solid base to extend (add auth/tenancy/missing tables).
6. **UX flows** — the 7-step onboarding, 5-layer knowledge, scenario tester with outcome analysis, portal information architecture: keep the flows, rebuild the shell.
7. **Design tokens & patterns** in `agents.css` — map onto the new palette (see UI_DESIGN_SYSTEM.md).
8. Marketing landing page `/daycare-ai`.

## 7. Blocking Gaps for a Sellable Product

1. **No authentication / roles / tenancy** — cannot onboard a real customer.
2. **localStorage as primary store** — data is per-browser, unsynced, unbackuped; portal and admin only "share" data on the same machine.
3. **Split brain**: widget→Supabase vs app→localStorage.
4. Static-HTML architecture cannot enforce server-side permissions (§2 of the brief requires route + API protection).
5. No real channel integrations (email/WhatsApp send, calendar, GBP).
6. No registrations, waitlist-as-module (waitlist exists only as a lead flavor), documents, team, billing, audit logs.
7. "Demo Mode" labels and seed data are woven into the current UX — must become environment-scoped.

**Conclusion:** Gen 3 is a strong *product prototype with real logic*; the platform around it (auth, database, tenancy, integrations) must be built. See IMPLEMENTATION_ROADMAP.md for the migration strategy that reuses §6 and does not rebuild blindly.
