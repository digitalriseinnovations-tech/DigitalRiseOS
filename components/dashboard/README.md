# Dashboard Component

## Purpose

The Dashboard component is the large interactive product preview used in the homepage Section 04 ("Meet Digital Rise OS"). It is a high-fidelity representation of the Digital Rise OS application interface — not a real working application, but a visually authentic, interactive showcase that demonstrates the platform's capability, depth, and design quality.

The Dashboard component must be convincing enough to make a prospect feel the quality of the product before they sign up. It is a trust and desire driver.

---

## Variants

### `dashboard--preview`
Used on the marketing homepage. Static or lightly animated visual with interactive hotspot callouts. May allow tab-switching between views. Not a real data application.

### `dashboard--app`
The real authenticated application dashboard. Displays live user data. Used inside the `/dashboard` route after login.

### `dashboard--onboarding`
A simplified version of the app dashboard shown during user onboarding. Guided with tooltips and step indicators. Data may be placeholder/demo data.

---

## Sub-Components

The Dashboard is a composed component. It contains the following sub-components:

### `dashboard__topbar`
The top navigation bar within the dashboard shell. Contains page title, global search, notification bell, help icon, and user avatar.

### `dashboard__sidebar`
The left sidebar navigation. Contains the logo, primary nav items, section labels, and a collapse toggle. Expands to 240px, collapses to 64px.

### `dashboard__main`
The main scrollable content area. Contains the page-specific content passed as children.

### `dashboard__stat-row`
A horizontal row of `card--stat` components. The first content element on most dashboard pages.

### `dashboard__chart`
A data visualization container. Wraps chart libraries and applies system tokens for colors, typography, and sizing.

### `dashboard__table`
A full-featured data table with header, rows, sorting, selection, and pagination.

### `dashboard__empty-state`
Displayed when a section has no data. Contains an illustration, heading, body text, and optional CTA.

### `dashboard__notification-badge`
A numeric badge displayed on the notification icon when unread notifications are present.

---

## States

### `sidebar--expanded`
Default state on desktop. Sidebar shows icon + label for all nav items. Width: 240px.

### `sidebar--collapsed`
Sidebar shows icon only. Width: 64px. Labels appear in tooltips on hover.

### `nav-item--default`
Standard nav item. Icon and label in muted color.

### `nav-item--active`
Currently selected nav item. Highlighted background, brand-colored icon and label, left accent bar.

### `nav-item--hover`
Slightly lighter background. Text color brightens.

### `table-row--default`
Standard data row.

### `table-row--hover`
Row background shifts to `--color-neutral-50` on hover.

### `table-row--selected`
Row has a checkbox checked. Background `--color-primary-50`, left accent `--color-primary-500`.

### `chart--loading`
Chart area displays skeleton shimmer while data loads.

### `chart--empty`
Chart area displays a zero-state message when no data is available for the selected period.

---

## Props

### `dashboard--preview` Props (marketing use)

| Prop | Type | Default | Description |
|---|---|---|---|
| `activeView` | `'crm' \| 'analytics' \| 'ai-chat' \| 'reviews'` | `'analytics'` | Which dashboard view is displayed |
| `tabs` | `array` | required | Array of `{ label, view }` objects for tab switcher |
| `hotspots` | `array` | `[]` | Array of callout definitions: `{ x, y, label, description }` — positioned over the visual |
| `animateIn` | `boolean` | `true` | Whether the dashboard animates in on scroll |
| `interactive` | `boolean` | `true` | Whether tabs and hotspots respond to user interaction |

### `dashboard__topbar` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `pageTitle` | `string` | required | Current page title |
| `notificationCount` | `number` | `0` | Unread notification count (0 hides badge) |
| `user` | `object` | required | `{ name, avatar }` |
| `searchEnabled` | `boolean` | `false` | Shows global search input |

### `dashboard__sidebar` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `collapsed` | `boolean` | `false` | Controls expand/collapse state |
| `navItems` | `array` | required | Array of `{ label, icon, href, active, badge? }` |
| `onCollapse` | `function` | required | Callback when collapse toggle is clicked |

### `dashboard__table` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `array` | required | Array of `{ key, label, sortable, align }` |
| `rows` | `array` | required | Array of row data objects |
| `selectable` | `boolean` | `false` | Enables row checkboxes |
| `sortColumn` | `string` | `null` | Currently sorted column key |
| `sortDirection` | `'asc' \| 'desc'` | `'asc'` | Sort direction |
| `onSort` | `function` | `null` | Callback when a sortable column header is clicked |
| `loading` | `boolean` | `false` | Shows skeleton loader in place of rows |
| `emptyState` | `object` | required | `{ illustration, heading, body, cta? }` |
| `pagination` | `object` | `null` | `{ total, perPage, currentPage, onPageChange }` |

---

## Animations

### Dashboard Preview — Scroll Entrance
- Container: `opacity 0 → 1`, `scale(0.96 → 1)`
- Duration: 600ms, `--ease-out`
- Trigger: component enters 10% of viewport

### Hotspot Callouts
- Callout dot: pulse animation (scale 1 → 1.3 → 1, opacity 1 → 0), 1.5s loop — draws attention to hotspots
- Callout panel on hover: `opacity 0 → 1`, `translateY(4px → 0)`, 150ms ease-out
- Callout panel on mouse leave: `opacity 1 → 0`, 100ms ease-in
- Reduced motion: pulse animation disabled. Callouts remain permanently visible as static labels.

### Tab Switcher (dashboard--preview)
- Content cross-fades: `opacity 1 → 0` (100ms) then `opacity 0 → 1` (200ms)
- Easing: `--ease-out`

### Sidebar Collapse / Expand
- Width animates: 240px ↔ 64px
- Duration: 250ms, `--ease-in-out`
- Labels: fade out on collapse (100ms), fade in on expand (150ms, delayed 120ms)
- Icon position: stays centered throughout

### Notification Badge
- Entrance: `scale(0 → 1)`, `--duration-fast` (120ms), `--ease-spring`
- Number change: scale pulse 1 → 1.2 → 1, 200ms

---

## Accessibility

- The marketing `dashboard--preview` component is `aria-hidden="true"` for screen readers — it is a decorative visual, not a functional interface. An adjacent text description of the dashboard capabilities serves as the accessible alternative.
- The app `dashboard--app` sidebar navigation is a `<nav aria-label="Dashboard">` landmark.
- Active nav item: `aria-current="page"` on the link.
- The sidebar collapse toggle: `aria-expanded`, `aria-label="Collapse navigation"` / `"Expand navigation"`.
- Data tables: `<table>` with `<th scope="col">` on all column headers. Sortable headers have `aria-sort="ascending"` or `"descending"`.
- Row selection checkboxes: `aria-label="Select [row identifier]"`.
- Charts: each chart has an adjacent `<caption>` or `aria-label` describing the data shown. A visually hidden data table may serve as an alternative for complex charts.
- Notification badge: announced via `aria-live="polite"` when count changes.
- Empty states: focus is managed to the empty state heading when the view loads with no data.

---

## Responsive Behaviour

| Component | Desktop (lg+) | Tablet (md) | Mobile (sm) |
|---|---|---|---|
| `dashboard--preview` | Full width, all hotspots visible | Scaled down, fewer hotspots | Scrollable image in fixed-height container |
| `dashboard__sidebar` | Persistent, 240px expanded | Collapsed to 64px by default | Hidden — accessible via hamburger drawer |
| `dashboard__topbar` | Full with search | Full without search | Compact — title + avatar only |
| `dashboard__stat-row` | 4 columns | 2×2 grid | 1-column stack |
| `dashboard__table` | Full columns | Reduced columns | Horizontal scroll within fixed container |
| `dashboard__chart` | Full size | Reduced height | Reduced height, simplified labels |

On `sm`, the dashboard sidebar is a full-screen drawer triggered by a hamburger icon in the top bar. It behaves identically to the mobile navigation drawer pattern.
