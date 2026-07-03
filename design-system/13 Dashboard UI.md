# 13 — Dashboard UI

## Philosophy

The dashboard is where users spend the most time. It must balance information density with cognitive clarity. Every element visible on the dashboard screen should be there because a user needs it — not because it is technically available. Respect the user's attention.

---

## Dashboard Layout

### Shell Structure

The dashboard shell is the persistent outer frame that holds all dashboard views.

```
┌─────────────────────────────────────────────┐
│  Top Bar (64px)                             │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Main Content Area               │
│ (240px)  │                                  │
│          │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

| Region | Width / Height | Background |
|---|---|---|
| Top bar | 100% × 64px | `--color-neutral-950` |
| Sidebar | 240px (expanded) / 64px (collapsed) | `--color-neutral-950` |
| Main content | fluid | `--color-neutral-50` |
| Content padding | 32px (desktop), 24px (tablet), 16px (mobile) | — |

---

## Top Bar

| Property | Value |
|---|---|
| Height | 64px |
| Background | `--color-neutral-950` |
| Border bottom | 1px solid rgba(255,255,255,0.06) |
| Left: Page title | `--text-lg`, weight 600, `--color-neutral-100` |
| Right: User avatar | 36px circle, 2px border `--color-neutral-700` |
| Right: Notifications | bell icon, 20px, `--color-neutral-400` |
| Right: Help | question icon, 20px, `--color-neutral-400` |
| Icon gap (right) | `--space-5` (20px) |

---

## Dashboard Page Header

The heading area at the top of each content page, below the shell top bar.

| Property | Value |
|---|---|
| Page title | `--text-2xl`, weight 700, `--color-neutral-900` |
| Subtitle | `--text-sm`, weight 400, `--color-neutral-500` |
| Title-to-subtitle gap | `--space-1` (4px) |
| Right-aligned actions | primary button + optional secondary button |
| Bottom margin | `--space-8` (32px) before first content section |

---

## Stat Cards Row

The first content section of most dashboard views. A horizontal row of metric cards.

| Property | Value |
|---|---|
| Columns | 4 on desktop, 2 on tablet, 1 on mobile |
| Gap | `--space-5` (20px) |
| Card padding | `--space-5` (20px) |
| Card background | `--color-neutral-0` |
| Card border | 1px solid `--color-neutral-200` |
| Card border-radius | 10px |

**Stat card internal structure:**

1. **Metric label** — `--text-xs`, weight 500, `--color-neutral-500`, uppercase, letter-spacing +0.06em
2. **Value** — `--text-3xl`, weight 700, `--color-neutral-900`
3. **Change row** — delta value + period label
   - Positive: `--color-success-600`, ↑ arrow icon
   - Negative: `--color-error-600`, ↓ arrow icon
   - Neutral: `--color-neutral-400`
   - Font: `--text-xs`, weight 500

---

## Data Table

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 10px |
| Overflow | hidden (border-radius clips) |

**Table header:**
- Height: 44px
- Background: `--color-neutral-50`
- Font: `--text-xs`, weight 600, `--color-neutral-500`, uppercase, letter-spacing +0.06em
- Border bottom: 1px solid `--color-neutral-200`
- Padding: 0 `--space-4` (16px)

**Table row:**
- Height: 56px
- Border bottom: 1px solid `--color-neutral-100`
- Padding: 0 `--space-4` (16px)
- Font: `--text-sm`, weight 400, `--color-neutral-700`

**Table row (hover):**
- Background: `--color-neutral-50`
- Transition: 100ms ease-out

**Table row (selected):**
- Background: `--color-primary-50`
- Left border: 2px solid `--color-primary-500`

**Column alignment:**
- Text columns: left-aligned
- Number/currency columns: right-aligned
- Status columns: center-aligned

**Sort indicator:**
- Arrow icon (12px) to the right of the column header label
- Active sort: `--color-primary-500`, icon fully opaque
- Inactive: `--color-neutral-300`, icon 50% opacity

---

## Pagination

Used below data tables.

| Property | Value |
|---|---|
| Container height | 52px |
| Border top | 1px solid `--color-neutral-200` |
| Info text | `--text-sm`, `--color-neutral-500` |
| Page buttons | 32px × 32px, border-radius 6px |
| Active page | `--color-primary-500` background, white text |
| Inactive page | transparent, `--color-neutral-600` text |
| Prev/Next icons | chevron left/right, 16px |

---

## Charts and Data Visualization

| Property | Value |
|---|---|
| Chart container background | `--color-neutral-0` |
| Chart container border | 1px solid `--color-neutral-200` |
| Chart container radius | 10px |
| Chart container padding | `--space-5` (20px) |
| Chart heading | `--text-base`, weight 600, `--color-neutral-800` |
| Chart subheading | `--text-xs`, `--color-neutral-400` |
| Grid lines | 1px, `--color-neutral-100` |
| Axis labels | `--text-xs`, `--color-neutral-400` |
| Tooltip background | `--color-neutral-900` |
| Tooltip text | white, `--text-xs` |
| Tooltip border-radius | 6px |
| Tooltip padding | 8px 12px |

**Primary chart color:** `--color-primary-500`
**Secondary chart color:** `--color-secondary-500`
**Chart color palette (multi-series):** primary-500, secondary-500, success-500, warning-500, error-500 — in that order.

---

## Dashboard Empty States

When a section has no data yet:

| Property | Value |
|---|---|
| Container | same as the populated component |
| Illustration | empty state SVG, 160px |
| Heading | `--text-base`, weight 600, `--color-neutral-700` |
| Body | `--text-sm`, `--color-neutral-400` |
| CTA | secondary button, centered |
| Vertical centering | illustration + text + CTA centered in the container |

---

## Notification / Alert Banners

Inline alerts that appear within dashboard content (not toast notifications).

| Type | Left border | Background | Icon | Text color |
|---|---|---|---|---|
| Info | `--color-info-500` | `--color-info-50` | info circle | `--color-info-700` |
| Success | `--color-success-500` | `--color-success-50` | check circle | `--color-success-700` |
| Warning | `--color-warning-500` | `--color-warning-50` | alert triangle | `--color-warning-700` |
| Error | `--color-error-500` | `--color-error-50` | x circle | `--color-error-700` |

- Border radius: 8px
- Left border width: 4px
- Padding: `--space-4` (16px)
- Font: `--text-sm`, weight 500
- Dismiss button: × icon, right-aligned, `--color-neutral-400`

---

## Toast Notifications

Transient notifications that appear over the UI.

| Property | Value |
|---|---|
| Position | bottom-right, 24px from edge |
| Width | 320px–380px |
| Background | `--color-neutral-900` |
| Text | white, `--text-sm`, weight 400 |
| Title | white, `--text-sm`, weight 600 |
| Icon | 18px, colored by type |
| Border radius | 10px |
| Padding | `--space-4` (16px) |
| Box shadow | `0 8px 24px rgba(0,0,0,0.24)` |
| Auto-dismiss | 4 seconds (success), 6 seconds (error), none for warning |
| Enter animation | slide in from right + fade in, 280ms ease-out |
| Exit animation | fade out, 200ms ease-in |
| Stack behavior | toasts stack vertically, newest on top, 8px gap |
