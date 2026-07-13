# UI DESIGN SYSTEM — Digital Rise Daycare OS

_References: Linear, Stripe, Vercel, Intercom, Notion, Raycast — for quality bar, not copying. Style: calm, premium, friendly, daycare-oriented. Not childish, not gradient-heavy, not a generic admin template._

## 1. Color Tokens

### Light theme
| Token | Value | Use |
|---|---|---|
| `--bg` | `#F7F8FC` | App background |
| `--surface` | `#FFFFFF` | Cards, panels, popovers |
| `--surface-subtle` | `#F1F4F9` | Table headers, wells, input bg |
| `--primary` | `#6157F5` | Primary actions, active nav, focus |
| `--primary-hover` | `#5147E5` | Hover |
| `--primary-soft` | `#EDEBFE` | Selected bg, badges |
| `--text` | `#172033` | Headings, primary text |
| `--text-secondary` | `#68738A` | Secondary text, labels |
| `--border` | `#E2E7F0` | Dividers, card borders |
| `--success` | `#1F9D68` (soft `#E4F5EC`) | Live, connected, resolved |
| `--warning` | `#E59A23` (soft `#FCF1DD`) | Needs attention, pending |
| `--danger` | `#D94A55` (soft `#FBE7E9`) | Errors, destructive, escalations |
| `--info` | `#3B82F6` (soft `#E3EDFE`) | New, informational |

### Dark theme (toggle is mandatory on every authenticated screen)
`--bg #0F1420 · --surface #171D2E · --surface-subtle #1E2536 · --text #EDF0F7 · --text-secondary #98A2B8 · --border #29314A · --primary #7A71FF (hover #8B83FF, soft rgba(122,113,255,.14))` — status colors lightened one step for contrast (success `#34C186`, warning `#F0AC42`, danger `#EE6B75`, info `#5C9DFF`).

Rules: theme via `data-theme` on `<html>`, persisted per user (server profile + localStorage fallback), default `prefers-color-scheme`; toggle lives in the topbar of **both** shells and the parent registration page. Gradients only in brand moments (login panel, marketing, empty-state illustrations) — never on working components. Current `agents.css` vars map: `--accent→--primary`, `--bg-alt→--surface-subtle`, `--t1..t4→text/text-secondary`, green/amber/red badge sets → status tokens.

## 2. Typography

- Font: **Geist** (fallback Inter — already loaded today, acceptable substitute).
- Scale (rem): display 2.25/800 · h1 1.5/800 · h2 1.25/700 · h3 1.0625/700 · body 0.875/450 · small 0.8125 · caption 0.71875/600 · overline 0.6875/700 uppercase +0.06em.
- Line-height 1.5 body, 1.2 headings; letter-spacing −0.01–0.02em on large headings.
- Numbers in metrics: `font-variant-numeric: tabular-nums`.

## 3. Spacing, Radius, Elevation

- **8px spacing system**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Page gutter 24 (desktop) / 16 (mobile). Card padding 20–24. Section gap 24–32.
- Radius: sm 8 · md 12 · card 16 · feature panel 20–24 · pill 999.
- Shadows (subtle only): `sm 0 1px 2px rgba(23,32,51,.06)` · `md 0 4px 12px rgba(23,32,51,.08)` · `lg 0 12px 32px rgba(23,32,51,.12)` (drawers/modals only). Dark theme: rely on borders + slight surface lightening, not heavy shadows.

## 4. Iconography

- **Lucide** exclusively for UI icons (16/18/20px, stroke 1.75, `currentColor`).
- Emoji are banned as UI icons (current codebase violation — replaced during porting). Emoji allowed only inside user content and AI chat messages.
- AI employees get avatar chips: soft-color circle + Lucide role icon (e.g. `message-circle`, `calendar-check`, `phone-incoming`, `star`, `mail`, `clipboard-list`, `book-open`, `sparkles`).

## 5. App Shell

- **Sidebar** (260px, collapsible to 68px icon rail; mobile: drawer): grouped nav with overline group labels (OVERVIEW / PARENT JOURNEY / COMMUNICATION / DAYCARE CONTENT / AUTOMATION & INSIGHTS / ADMINISTRATION), active item = primary-soft bg + 2.5px left indicator, business switcher (platform admins) or business identity block (workspace) at top, user block at bottom.
- **Topbar** (sticky, 56px): breadcrumb/page context · global search (⌘K palette) · notifications · help · **theme toggle** · profile menu. Impersonation shows a full-width warning banner above the topbar.
- Content max-width 1240px (analytics/inbox may go fluid); consistent page header: title, description, status badge slot, primary action right-aligned.

## 6. Core Components (packages/ui)

Buttons (primary/secondary/ghost/danger/link; sm 32 · md 38 · lg 44; loading spinner state; icon-only variant) · Inputs (label, help text, required mark, inline validation, error from server, prefix/suffix) · Select/Combobox · Date/time pickers · Badges (status set matching token table; dot variant for live states) · Tabs (underline for page sections, pill for sub-filters) · Tables (sticky header, sort, filter row, pagination, row actions kebab, bulk-select bar, responsive card fallback, designed empty state) · Kanban board · Cards (metric, entity, list-row — **varied layouts by purpose**, never a grid of identical white boxes) · Drawer (right, 480/640) · Modal (sm 400 / md 560; destructive-confirm variant requires typed or explicit confirmation) · Toast (success/error/info; action link slot) · Empty states (icon, one-line explanation of the workflow, primary CTA — no meaningless zero grids) · Skeleton loaders · Timeline/feed item · Chat components (bubbles, AI-draft state with Approve/Edit, typing indicator, channel chip) · Calendar (day/week/month) · Stat chart set (line, bar, donut, funnel — 2px lines, soft grid, tabular legends).

## 7. Motion (Framer Motion, restrained)

- Page entrance: 150–200ms fade+4px rise, once.
- Panels/drawers/modals: 200ms ease-out transform.
- Count-up on metrics ≤800ms; chart reveal ≤600ms; live status dot pulse 2s.
- Hover: elevation/translateY(-1–2px) on interactive cards only.
- Respect `prefers-reduced-motion` (disable non-essential animation). Never block interaction on animation.

## 8. Interaction Standards (per brief §24)

Every interactive element defines: permission gate · action · validation · loading · success · error · disabled · empty state · confirmation (destructive) · audit event · refresh behavior. Forms: inline + server validation, unsaved-changes warning, sticky save bar on long forms. Tables/lists always ship search + filters + designed empty state.

## 9. Accessibility & Responsiveness

- WCAG AA contrast in both themes (all token pairs above pass on their intended surfaces).
- Full keyboard navigation, visible focus ring (`2px --primary` at 40% + offset), semantic landmarks, `aria-label` on icon buttons, focus-trapped modals with ESC, form errors announced.
- Breakpoints: ≥1280 full shell · 1024 collapsed rail · 768 drawer nav + stacked panels · ≤640 single column, tables → cards, 3-column inbox → stepped views.
- Loading states are skeletons or labeled spinners — never blank screens.

## 10. Voice & Content Style

Warm-professional, people-first, jargon-free: "Parents waiting for a reply", "Tour confirmed", "AI handled 18 conversations today". Avoid CRM vocabulary (pipeline, deal, contact record) and technical vocabulary (agent config, prompt, webhook) in workspace-facing copy — integration pages may use technical terms with plain-language descriptions. Honest status labels always: Connected / Not Connected / Needs Attention / Sandbox.
