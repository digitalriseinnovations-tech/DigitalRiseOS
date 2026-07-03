# Metrics Component

## Purpose

The Metrics component renders quantified outcomes and performance data. It is used in the homepage "Trusted Results" section (Section 02) as animated stat counters, and throughout the dashboard as data cards, change indicators, and KPI displays.

Numbers are the highest-trust content on the page. The Metrics component must present them with maximum visual clarity — large, legible, and backed by a clear label. Animation reinforces the sense that these numbers represent real, dynamic results.

---

## Variants

### `metrics--stat-strip`
Used in homepage Section 02. Four stat blocks arranged in a horizontal row. Each block shows a large animated number and a short label. No borders between blocks — separated only by spacing. This is a purely visual credibility section.

### `metrics--stat-card`
A bordered, contained stat card. Used inside the dashboard stat row and within industry-specific content panels. Contains a label, value, and optional change indicator.

### `metrics--counter`
A standalone animated number. Used inline within copy, hero sections, or anywhere a single metric needs visual emphasis without a full card treatment.

### `metrics--change-badge`
A compact indicator showing a delta value and direction (up/down/neutral). Used inside stat cards, table cells, and dashboard headers.

### `metrics--progress-bar`
A horizontal bar showing progress toward a goal. Used in dashboard views for quota tracking, audit scores, and completion percentages.

### `metrics--kpi-row`
A horizontal row of three to four KPI items. Used at the top of dashboard sub-pages as a quick snapshot of that section's performance.

---

## States

### `counter--idle`
The counter has not yet entered the viewport. The value is at 0 (or hidden until animation begins).

### `counter--animating`
The counter is counting up from 0 to its target value. In progress.

### `counter--complete`
The counter has reached its final value. Resting state.

### `change--positive`
A positive delta. Arrow points up. Color: `--color-success-600`.

### `change--negative`
A negative delta. Arrow points down. Color: `--color-error-600`.

### `change--neutral`
No significant change. No arrow. Color: `--color-neutral-400`.

### `progress--loading`
Progress bar is in an indeterminate loading state. Displays an animated shimmer instead of a defined fill.

### `progress--complete`
Progress bar has reached 100%. Optional completion color change (success green).

---

## Props

### `metrics--stat-strip` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `stats` | `array` | required | Array of stat objects (see Stat Object) |
| `animated` | `boolean` | `true` | Enables counter animation on viewport entry |
| `animationDuration` | `number` | `1200` | Duration of count-up animation in ms |
| `stagger` | `number` | `120` | Delay in ms between each counter starting |
| `dividers` | `boolean` | `false` | Whether to show vertical dividers between stat blocks |

### `metrics--stat-card` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Metric name |
| `value` | `string` | required | Display value (pre-formatted, e.g., "95%", "$12,400", "1,240") |
| `change` | `object` | `null` | `{ value: string, direction: 'up' \| 'down' \| 'neutral', period: string }` |
| `icon` | `string` | `null` | Optional Lucide icon displayed in top-left of card |
| `iconColor` | `string` | `'primary'` | Color token for the icon |
| `loading` | `boolean` | `false` | Shows skeleton shimmer in place of value |
| `animated` | `boolean` | `false` | Count-up animation on mount |

### `metrics--counter` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | required | The target number to count up to |
| `prefix` | `string` | `''` | Character(s) before the number (e.g., "$") |
| `suffix` | `string` | `''` | Character(s) after the number (e.g., "%", "K", "+") |
| `duration` | `number` | `1200` | Count-up duration in ms |
| `easing` | `string` | `'ease-out'` | Animation easing function |
| `triggerOnScroll` | `boolean` | `true` | Whether animation triggers on scroll or on mount |
| `decimals` | `number` | `0` | Number of decimal places to display |
| `separator` | `string` | `','` | Thousands separator character |

### Stat Object (for `metrics--stat-strip`)

```
{
  value: string,         // Display value: "95%", "40%", "24/7", "100%"
  numericValue: number,  // Numeric value for count-up animation (optional — skip for non-numeric values like "24/7")
  suffix: string,        // e.g., "%" appended after the animated number
  label: string,         // Short label: "Lead Response Rate"
  sublabel?: string      // Optional second line of context
}
```

### `metrics--change-badge` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | e.g., "+12%", "-3%", "No change" |
| `direction` | `'up' \| 'down' \| 'neutral'` | required | Determines color and icon |
| `period` | `string` | `null` | e.g., "vs last month" — displayed as smaller supplemental text |
| `size` | `'sm' \| 'md'` | `'sm'` | Controls badge size |

### `metrics--progress-bar` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | required | Current value (0–100) |
| `max` | `number` | `100` | Maximum value |
| `label` | `string` | `null` | Label displayed above the bar |
| `showValue` | `boolean` | `true` | Whether the current % or value is shown |
| `color` | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Fill color |
| `animated` | `boolean` | `true` | Whether fill animates from 0 on mount/scroll |
| `loading` | `boolean` | `false` | Indeterminate shimmer state |

---

## Animations

### Counter Count-Up
- Starts at 0, counts to `value` over `animationDuration` ms
- Easing: deceleration curve (starts fast, slows near target) — `cubic-bezier(0, 0, 0.2, 1)`
- For non-numeric values (e.g., "24/7"): value appears with a simple `opacity 0 → 1` fade, no counting
- Stagger in strip: 120ms between each counter

### Stat Strip Entrance
- Each stat block: `opacity 0 → 1` + `translateY(16px → 0)`, 350ms ease-out
- Stagger: 80ms per block
- Counters begin after the block has fully appeared (additional 60ms delay)

### Stat Card Entrance
- `opacity 0 → 1` + `translateY(20px → 0)`, 350ms ease-out, triggered on scroll

### Progress Bar Fill
- `width 0 → final%` or `transform: scaleX(0 → 1)`
- Duration: 600ms–1200ms depending on target value
- Easing: `--ease-out`
- Trigger: mount or scroll entry

### Change Badge Entrance
- `scale(0 → 1)`, 150ms, `--ease-spring`

### Reduced Motion
- All counter animations: value appears instantly at final value
- Progress bars: appear at full fill immediately
- Entrance animations: elements visible without movement

---

## Accessibility

- Counter values are present in the DOM at their final value from initial render. Animation is purely visual — the number counted to is always the correct accessible value.
- The `aria-live="polite"` attribute is not used on counters (would be excessively verbose during animation). The static final value is sufficient.
- Change badges use `aria-label` that includes both value and direction: e.g., `aria-label="Up 12% vs last month"`.
- Progress bars use `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`.
- Indeterminate progress bars (loading state) use `aria-valuetext="Loading"` instead of numeric values.
- Color-only change indicators (green up / red down) are supplemented by directional arrow icons and the text value — color is not the sole differentiator.
- Stat cards in a dashboard grid have a heading structure: the label is always a `<dt>` or appropriately structured element, not a decorative `<span>`.

---

## Responsive Behaviour

| Variant | Desktop | Tablet | Mobile |
|---|---|---|---|
| `metrics--stat-strip` | 4 across in a row | 2×2 grid | 1 column stacked |
| `metrics--stat-card` | Unchanged | Unchanged | Unchanged (full width of column) |
| `metrics--kpi-row` | 4 across | 2×2 | 2×2 or 1-col |
| `metrics--progress-bar` | Full width of container | Full width | Full width |
| `metrics--change-badge` | Inline | Inline | Inline |

Stat value font sizes on `sm`:
- Strip stat value: minimum 36px (down from 48–60px on desktop)
- Card stat value: minimum 28px (down from 36px)
- Label: unchanged at 12px
