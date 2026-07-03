# Cards Component

## Purpose

The Card component is a self-contained content unit. It groups related information into a visually bounded object that can be scanned, compared, and acted upon. Cards are used throughout the homepage and dashboard to present features, blog content, testimonials, pricing, platform modules, and metrics.

All card variants share a common structural foundation but differ in their content layout, visual weight, and interactive behaviour.

---

## Variants

### `card--feature`
Used in the Platform Modules section and feature grids. Icon-led, with a title and short description. Non-interactive (no click action). Communicates a platform capability.

### `card--problem`
Used in the "Why Businesses Lose Customers" section. Icon + problem title + one-line description. Has a subtle visual treatment that implies friction (slightly warmer border, muted palette).

### `card--module`
Used in the Platform Modules section. Similar to feature card but more compact — part of a dense grid. Icon + name + one-liner.

### `card--blog`
Used in the Resources section and blog listing page. Image top, category label, title, excerpt, and author row. Fully linked (entire card is a link target).

### `card--testimonial`
Used in the Customer Success section. Star rating, quote text, and author identity (avatar + name + role + company). Non-interactive by default.

### `card--pricing`
Used on the Pricing page. Plan name, price, billing cycle, description, feature list, and CTA button. Has a `featured` modifier for the recommended plan.

### `card--stat`
Used in the dashboard and the Trusted Results section. Large numeric value, label, and change indicator (positive/negative).

### `card--industry`
Used in the Industry Selector section. An industry name label (and optional icon) that can be selected. Has selected and default states.

### `card--resource`
Used in the Resources section. Larger editorial card variant. Supports a featured layout (full-width or 8-column) and standard layout (smaller).

---

## States

### `default`
Resting state. Visible with standard border and shadow.

### `hover` (interactive cards only)
Border color darkens, shadow deepens, card lifts slightly with `translateY(-2px)`. Applies to `card--blog`, `card--industry`, `card--resource`, and any card wrapped in an anchor.

### `selected` (card--industry only)
Card has an active border in `--color-primary-500`, a tinted background, and a visible selection indicator.

### `featured` (card--pricing only)
Card has a `--color-primary-500` background, white text, elevated shadow, and slightly larger scale.

### `loading`
Card skeleton state. Content is replaced with animated shimmer placeholders. Used while data is being fetched (dashboard context).

---

## Props

### Shared Props (all variants)

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `string` | required | One of the variant names above |
| `className` | `string` | `null` | Additional class names for custom styling contexts |

### `card--feature` / `card--module` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | required | Lucide icon name |
| `iconColor` | `string` | `'primary'` | Token color for the icon |
| `title` | `string` | required | Card heading |
| `description` | `string` | required | One to two sentence supporting text |

### `card--problem` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | required | Lucide icon name representing the problem |
| `problem` | `string` | required | Problem title (2–4 words) |
| `description` | `string` | required | One-line problem description |

### `card--blog` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `image` | `object` | required | `{ src, alt }` — 16:9 image |
| `category` | `string` | required | Article category label |
| `title` | `string` | required | Article headline |
| `excerpt` | `string` | required | 2–3 sentence preview |
| `author` | `object` | required | `{ name, avatar, role }` |
| `date` | `string` | required | Publication date (formatted) |
| `readTime` | `string` | required | e.g., "5 min read" |
| `href` | `string` | required | Link destination |

### `card--testimonial` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rating` | `number` | `5` | Star rating (1–5) |
| `quote` | `string` | required | Testimonial text (40–100 words) |
| `author` | `object` | required | `{ name, role, company, avatar }` |

### `card--pricing` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `planName` | `string` | required | Plan tier name |
| `price` | `string` | required | Display price (e.g., "$297") |
| `cycle` | `string` | `'/month'` | Billing cycle label |
| `description` | `string` | required | Short plan summary |
| `features` | `array` | required | Array of feature strings |
| `cta` | `object` | required | `{ label, href }` |
| `featured` | `boolean` | `false` | Enables the featured visual treatment |
| `badge` | `string` | `null` | Optional badge text (e.g., "Most Popular") |

### `card--stat` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Metric name (e.g., "Lead Response Rate") |
| `value` | `string` | required | Display value (e.g., "95%") |
| `change` | `object` | `null` | `{ value: string, direction: 'up' \| 'down' \| 'neutral', period: string }` |
| `animated` | `boolean` | `false` | If true, value counts up from 0 on scroll trigger |

### `card--industry` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `industry` | `string` | required | Industry name |
| `icon` | `string` | `null` | Optional Lucide icon |
| `selected` | `boolean` | `false` | Whether this card is the currently selected industry |
| `onClick` | `function` | required | Callback when card is clicked |

---

## Animations

### Scroll Entrance (all variants)
- `opacity 0 → 1` + `translateY(20px → 0)`
- Duration: `--duration-slow` (350ms)
- Easing: `--ease-out`
- Stagger in grids: 60ms per card

### Hover Lift (interactive cards)
- `transform: translateY(-2px)`
- `box-shadow` deepens
- `border-color` shifts
- Duration: `--duration-base` (200ms), `--ease-out`
- Returns to resting on mouse leave: `--duration-quick` (150ms)

### Industry Card Selection
- `border-color`, `background-color` change
- Duration: `--duration-base` (200ms), `--ease-out`

### Skeleton Shimmer (loading state)
- Background shimmer: `background-position` shifts -100% → 200%
- Duration: 1500ms, `linear`, `infinite`
- Color: `--color-neutral-100` → `--color-neutral-200` → `--color-neutral-100`

---

## Accessibility

- `card--blog` and `card--resource`: the entire card is a link. Use a single `<a>` wrapping the card. The title text provides the accessible link label.
- `card--industry`: rendered as a `<button>` with `aria-pressed` reflecting selected state.
- `card--pricing`: the CTA button inside has a descriptive label that includes the plan name (e.g., "Get started with Pro").
- `card--stat` with `animated` prop: the animated number target is present in the DOM from load (not written in by JS) — animation only affects the visible counter, not the accessible value.
- All card images have descriptive `alt` text.
- All cards in a grid are siblings at the same DOM level — no nested landmark roles.

---

## Responsive Behaviour

| Variant | Desktop | Tablet | Mobile |
|---|---|---|---|
| `card--feature` | 3-up grid | 2-up grid | 1-up |
| `card--module` | 3 or 4-up grid | 2-up grid | 1-up |
| `card--problem` | 3-up grid | 2-up grid | 1-up |
| `card--blog` | 3-up grid | 2-up grid | 1-up |
| `card--testimonial` | 3-up masonry | 2-up | 1-up |
| `card--pricing` | 3-up inline | 1-up stacked | 1-up stacked |
| `card--stat` | 4-up row | 2×2 grid | 1-up stacked |
| `card--industry` | Horizontal pill list | Pill grid | Vertical list |
| `card--resource` | 1 featured + 2 small | 1 featured + 2 stacked | 1-up stacked |

Card padding reduces by `--space-1` (4px) on mobile where space is constrained.
