# Industries Component

## Purpose

The Industries component powers the Industry Selector section (Section 06) of the homepage. It allows visitors to self-identify their business type and immediately see how Digital Rise OS applies to their specific context. Content updates in real time without a page reload.

This component is the primary personalization mechanism on the homepage. When it works correctly, it makes a dental clinic owner feel like the platform was built specifically for them — not just for "businesses in general."

---

## Variants

### `industries--selector`
The full interactive industry selector as used on the homepage. Contains an industry list (tabs or pill cards on the left or top) and a content panel that updates when an industry is selected.

### `industries--pill-list`
A compact list of industry pills. Used inside the `industries--selector` as the selection mechanism. Can also be used standalone (e.g., as a filter component in the Resources section).

### `industries--content-panel`
The right-side or bottom content area that renders industry-specific information when an industry is selected. Contains headline, description, key metric, and a relevant visual.

### `industries--page-hero`
Used at the top of individual industry landing pages (e.g., `/industries/dental-clinics`). Full-width hero with industry-specific headline, outcome metric, and visual.

---

## Industries

The following industries are supported. Each must have a complete content definition:

| Industry | Short Label | Icon |
|---|---|---|
| Daycares | Daycares | `heart` |
| Medical Clinics | Medical | `stethoscope` |
| Dental Clinics | Dental | `smile` |
| Contractors | Contractors | `hard-hat` |
| Home Services | Home Services | `home` |
| Law Firms | Law Firms | `scale` |
| Accounting Firms | Accounting | `calculator` |
| Local Retail | Retail | `shopping-bag` |
| Restaurants | Restaurants | `utensils` |
| Fitness Studios | Fitness | `activity` |
| Professional Services | Professional | `briefcase` |

---

## States

### `industry-pill--default`
Unselected industry pill. Neutral background and text. Visible but not prominent.

### `industry-pill--hover`
Cursor over an unselected pill. Slightly darker background. Border shifts to `--color-neutral-300`.

### `industry-pill--selected`
Currently active industry. Border `--color-primary-500`, background `--color-primary-50`, text `--color-primary-700`. Visually distinct from all others.

### `content-panel--transitioning`
The content panel is mid-transition between two industry content sets. Content is at opacity 0 (invisible) during the crossfade.

### `content-panel--loaded`
Industry content is fully visible after transition completes.

---

## Props

### `industries--selector` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `industries` | `array` | required | Array of industry content objects (see Content Object) |
| `defaultSelected` | `string` | first in array | Industry key pre-selected on load |
| `layout` | `'side-by-side' \| 'stacked'` | `'side-by-side'` | Whether list and content panel are horizontal or vertical |
| `onSelect` | `function` | `null` | Callback receiving selected industry key |

### Industry Content Object

Each industry in the `industries` array must define:

```
{
  key: string,               // e.g., "dental-clinics"
  label: string,             // Display name: "Dental Clinics"
  icon: string,              // Lucide icon name
  headline: string,          // Industry-specific H3: "Built for Dental Clinics"
  description: string,       // 2-3 sentences on how Digital Rise OS solves this industry's pain
  metric: {
    value: string,           // e.g., "40%"
    label: string,           // e.g., "More Booked Appointments"
  },
  visual: {
    type: 'image',
    src: string,
    alt: string
  },
  cta: {
    label: string,           // e.g., "See How It Works for Dental Clinics"
    href: string             // e.g., "/industries/dental-clinics"
  }
}
```

### `industries--pill-list` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `industries` | `array` | required | Array of `{ key, label, icon }` |
| `selected` | `string` | required | Currently selected industry key |
| `onSelect` | `function` | required | Callback receiving selected key |
| `layout` | `'horizontal' \| 'vertical' \| 'grid'` | `'horizontal'` | Pill arrangement |

---

## Animations

### Industry Selection
- **Outgoing content:** `opacity 1 → 0`, `--duration-quick` (150ms), `--ease-in`
- **Incoming content:** `opacity 0 → 1` + `translateY(8px → 0)`, `--duration-base` (200ms), `--ease-out`
- Sequence: outgoing completes first (150ms), then incoming begins
- Total transition time: ~350ms

### Pill Selection
- `border-color`, `background-color`, `color` change
- Duration: `--duration-base` (200ms), `--ease-out`

### Section Entrance (on scroll)
- Pill list: fades in as a group, 350ms ease-out
- Content panel: fades in with 100ms delay after pills, 350ms ease-out

### Metric Value
- The metric value inside the content panel counts up from 0 when the section first enters the viewport
- On industry switch: number cross-fades (does not re-animate from 0)

### Reduced Motion
- All transitions replaced with instant state changes
- No cross-fade on content switch — content updates immediately

---

## Accessibility

- The industry pill list is implemented as a `<div role="tablist">` with each pill as a `<button role="tab">`.
- Selected pill: `aria-selected="true"`. Others: `aria-selected="false"`.
- Each pill `id` matches the `aria-controls` attribute pointing to the content panel `id`.
- Content panel has `role="tabpanel"` and `aria-labelledby` pointing to the controlling tab.
- Keyboard navigation: `Tab` to reach the tab list, `←` `→` arrow keys to move between industries, `Enter` or `Space` to select.
- Industry content updates are announced to screen readers via an `aria-live="polite"` region.
- All icons within pills have `aria-hidden="true"` — the pill label is the accessible text.
- The CTA within the content panel has a descriptive label including the industry name.

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| `sm` (375px) | Vertical list of industry names. Selecting one expands an accordion panel below it with the content. No side-by-side layout. |
| `md` (768px) | Scrollable horizontal pill row at top. Content panel below, full width. |
| `lg` (1024px) | Side-by-side: pill list as vertical stack on the left (3 cols), content panel on the right (9 cols). |
| `xl`+ | Same as lg with more generous whitespace. |

On `sm`, the layout collapses to an accordion rather than a tab panel. Each industry expands its own content block below it. This is a different interaction pattern from the desktop tab model and must be handled separately.
