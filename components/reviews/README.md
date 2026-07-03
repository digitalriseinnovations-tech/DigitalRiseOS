# Reviews Component

## Purpose

The Reviews component renders the Customer Success section (Section 09) of the homepage. It presents real customer testimonials as a trust-building, social proof mechanism. It is designed to be dense, credible, and scannable — the user should be able to absorb 3–4 testimonials at a glance without interaction.

This component is explicitly not a carousel. All testimonials are visible simultaneously. The user does not need to click or swipe to see evidence of customer satisfaction.

---

## Variants

### `reviews--wall`
The primary variant for the homepage. A masonry or multi-column grid of testimonial cards, all visible simultaneously. The highest-density social proof format.

### `reviews--marquee`
A horizontally auto-scrolling strip of compact testimonial cards. Used as a secondary social proof band (e.g., between sections). Can run as a single row or two rows scrolling in opposite directions.

### `reviews--featured`
A single, full-width, high-impact testimonial. Used as a standalone section to anchor trust at a critical page moment (e.g., just above pricing).

### `reviews--filtered-wall`
An extension of `reviews--wall` with filter chips above the grid. Allows filtering testimonials by industry. Used on the homepage when industry personalization is a priority.

### `reviews--card`
The individual testimonial card sub-component. Used within all review variants. Can also be placed standalone within other sections.

---

## States

### `card--default`
Standard resting testimonial card. Fully visible, standard shadow and border.

### `card--hover`
Subtle lift and shadow increase. Applies only if the card is linked (to a full case study).

### `filter-chip--default`
Unselected industry filter chip. Standard neutral styling.

### `filter-chip--active`
Selected filter chip. Highlighted with brand color border and background.

### `filtered--dimmed`
In `reviews--filtered-wall`, testimonials that do not match the active filter have `opacity: 0.25`. Matching testimonials remain at full opacity.

### `marquee--paused`
The auto-scrolling marquee is paused because the user is hovering over it.

---

## Props

### `reviews--wall` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `testimonials` | `array` | required | Array of testimonial objects (see Testimonial Object) |
| `columns` | `number` | `3` | Number of columns in the grid (desktop) |
| `filterable` | `boolean` | `false` | Enables industry filter chips above the wall |
| `industries` | `array` | `[]` | Industry options for filter chips (if `filterable: true`) |
| `defaultFilter` | `string` | `'all'` | Default active filter key |
| `maxVisible` | `number` | `null` | If set, limits visible cards (remainder hidden until "Show more" is clicked) |

### `reviews--marquee` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `testimonials` | `array` | required | Array of testimonial objects |
| `rows` | `number` | `1` | Number of scrolling rows (1 or 2) |
| `speed` | `number` | `40` | Scroll speed in pixels per second |
| `pauseOnHover` | `boolean` | `true` | Whether scrolling pauses when the user hovers |
| `direction` | `'left' \| 'right'` | `'left'` | Scroll direction for the first (or only) row |

### `reviews--featured` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `testimonial` | `object` | required | Single testimonial object |
| `background` | `'dark' \| 'gradient' \| 'light'` | `'dark'` | Background treatment |
| `showLogo` | `boolean` | `true` | Whether the customer's company logo appears below the author info |

### Testimonial Object

```
{
  id: string,
  author: {
    name: string,
    role: string,
    company: string,
    industry: string,         // e.g., "dental-clinics" — used for filtering
    avatar: {
      src: string,
      alt: string
    },
    companyLogo?: {
      src: string,
      alt: string,
      width: number
    }
  },
  rating: number,             // 1–5
  quote: string,              // 40–100 words
  result?: {
    metric: string,           // e.g., "47%"
    label: string             // e.g., "increase in booked appointments"
  },
  href?: string               // Link to full case study (optional)
}
```

---

## Animations

### Wall Entrance (scroll trigger)
- Cards fade in and rise: `opacity 0 → 1` + `translateY(20px → 0)`
- Duration: 350ms, `--ease-out`
- Stagger: 60ms per card, reading order (left to right, top to bottom)

### Filter Transition
- Non-matching cards: `opacity 1 → 0.25`, `--duration-base` (200ms), `--ease-out`
- Matching cards: remain at `opacity 1`
- All cards: scale does not change — only opacity shifts

### Marquee Scroll
- Animation: `transform: translateX(0 → -50%)` on a duplicated list, `linear`, `infinite`
- Duration: calculated from `speed` prop and total content width
- Pause on hover: `animation-play-state: paused`
- Second row (if `rows: 2`): reverses direction, offset start time by 50% of duration

### Featured Quote Entrance
- Quote text: `opacity 0 → 1` + `translateY(12px → 0)`, 500ms ease-out
- Author row: `opacity 0 → 1`, 350ms ease-out, delayed 200ms

### Reduced Motion
- Marquee: stopped immediately, displayed as a static grid
- Entrance animations: elements visible immediately
- Filter transitions: instant opacity changes, no animation

---

## Accessibility

- Testimonial cards are `<article>` elements with `aria-label` of "[Author name]'s testimonial".
- Star ratings are not just visual — a visually hidden `<span>` reads "5 out of 5 stars".
- `reviews--marquee`: the scrolling container has `aria-label="Customer testimonials"`. Duplicate content in the scroll loop has `aria-hidden="true"` on the second copy.
- Filter chips: `role="group"` on the chip container with `aria-label="Filter by industry"`. Each chip is a `<button>` with `aria-pressed` state.
- `prefers-reduced-motion`: the marquee stops. Announcement via `aria-live` is not used for the marquee (it would be too verbose).
- Avatar images have `alt="[Author name]"`.
- Company logos have `alt="[Company name] logo"`.
- Linked cards (`href` present): the `<a>` wraps the card, and the accessible label is derived from the author name and quote excerpt.

---

## Responsive Behaviour

| Variant | Desktop (lg+) | Tablet (md) | Mobile (sm) |
|---|---|---|---|
| `reviews--wall` | 3-column masonry | 2-column masonry | 1-column stack |
| `reviews--marquee` | 2-row marquee (optional) | 1-row marquee | 1-row marquee, reduced speed |
| `reviews--featured` | Full-width, centered 800px | Full-width, centered | Full-width, stacked layout |
| `reviews--filtered-wall` | Chips above, 3-col grid | Chips above, 2-col grid | Scroll chips, 1-col grid |

On `sm`, the masonry layout collapses to a single column. Cards are full-width. Vertical gap: `--space-4` (16px).

Filter chips on `sm` become horizontally scrollable (no wrapping). Fade edges indicate scrollability.
