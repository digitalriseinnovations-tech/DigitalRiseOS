# FAQ Component

## Purpose

The FAQ component renders the frequently asked questions section (Section 11) of the homepage and is reused on product, pricing, and industry pages. It reduces support load by proactively answering objections, removes hesitation before the final CTA, and contributes structured data (FAQPage schema) for SEO.

The FAQ must be effortless to scan. Users do not read every question — they scan for the one that matches their concern. The design must support rapid visual scanning and instant content access.

---

## Variants

### `faq--accordion`
The default variant. Questions are listed vertically. Clicking a question expands the answer below it. One question open at a time. Clean, minimal, high-density.

### `faq--two-column`
Questions on the left column, answers on the right column. Static — all answers visible simultaneously. Used when answers are short (under 60 words) and the list is 4–8 items.

### `faq--categorized`
A tabbed or filtered FAQ. Questions are grouped by category. A tab or chip row above the list lets users filter to their relevant category. Used when there are more than 10 questions across multiple topics.

### `faq--minimal`
A stripped-back version with no container border or card — just the question list and expand/collapse behavior. Used embedded within other page sections (e.g., pricing page inline FAQ).

---

## States

### `item--collapsed`
Default state. Only the question text and the chevron icon are visible. The answer is hidden.

### `item--expanded`
The answer is fully visible below the question. The chevron icon has rotated 180°. The item has slightly different visual weight (question text in a stronger color).

### `item--hover`
User is hovering over a collapsed question. Question text and chevron shift to highlight color to indicate interactivity.

### `category-chip--default`
Unselected category filter chip. Neutral styling.

### `category-chip--active`
Selected category. Brand color border and background. All questions in this category are visible.

---

## Props

### `faq--accordion` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `array` | required | Array of FAQ item objects (see FAQ Item Object) |
| `allowMultiple` | `boolean` | `false` | If true, multiple items can be open simultaneously |
| `defaultOpen` | `number \| null` | `null` | Index of item to be open by default on load |
| `maxWidth` | `string` | `'720px'` | Maximum width of the FAQ list container |

### `faq--categorized` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `categories` | `array` | required | Array of `{ key, label }` category objects |
| `items` | `array` | required | Array of FAQ items with `category` field |
| `defaultCategory` | `string` | first in array | Category selected on load |

### FAQ Item Object

```
{
  id: string,              // Unique ID (used for aria-controls and scroll targeting)
  question: string,        // The question text (written as users would phrase it)
  answer: string,          // The answer text (plain text or limited markdown)
  category?: string,       // Category key (for categorized variant)
  links?: [                // Optional links within the answer
    { label: string, href: string }
  ]
}
```

---

## Animations

### Item Expand
- Answer height: `0 → auto` (achieved via `max-height` transition or JS height measurement)
- Answer opacity: `0 → 1`
- Duration: `--duration-moderate` (250ms), `--ease-out`
- Chevron rotation: `0 → 180deg`, same duration

### Item Collapse
- Answer height: `auto → 0`
- Answer opacity: `1 → 0`
- Duration: `--duration-base` (180ms), `--ease-in`
- Chevron rotation: `180deg → 0deg`, same duration
- Collapses faster than it expands — gives a snappy feel without being abrupt

### Hover State
- Question text color change: `--duration-quick` (150ms), `--ease-out`
- Chevron color change: `--duration-quick` (150ms), `--ease-out`

### Category Filter
- Non-matching items fade out: `opacity 1 → 0`, 150ms ease-out, then `display: none`
- Matching items fade in: `display: block`, then `opacity 0 → 1`, 200ms ease-out
- Layout reflow after filter completes

### Section Entrance (scroll trigger)
- FAQ container: `opacity 0 → 1` + `translateY(20px → 0)`, 350ms ease-out
- Items do not stagger — the list appears as one unit

### Reduced Motion
- Expand/collapse: instant — no height or opacity animation. Item simply appears/disappears.
- Chevron: rotates instantly (no animation).
- Hover: instant color change.

---

## Accessibility

- The FAQ list uses a `<dl>` (description list) structure in the two-column variant, or an accordion pattern with `<button>` triggers in the accordion variant.
- **Accordion pattern:**
  - Each question is a `<button>` with `aria-expanded="true|false"` and `aria-controls="[panel-id]"`.
  - Each answer panel has `id="[panel-id]"` and `role="region"` with `aria-labelledby="[button-id]"`.
  - When collapsed, the panel has `hidden` attribute (or equivalent CSS that removes it from accessibility tree).
- Keyboard: `Tab` to reach each question, `Enter` or `Space` to expand/collapse.
- The "only one open" rule is enforced programmatically — when a new item opens, the previously open item's `aria-expanded` updates to `false`.
- Category chips: `role="group"` container with `aria-label="FAQ Categories"`. Each chip is a `<button>` with `aria-pressed`.
- The entire FAQ section is a `<section>` with `aria-label="Frequently Asked Questions"`.
- **Structured data:** JSON-LD `FAQPage` schema must be generated from the `items` array and injected into the page `<head>`. Every question and answer in the component must appear in the schema.
- Links within answers open in the same tab unless explicitly external (in which case they include `target="_blank"` and `rel="noopener noreferrer"`).

---

## Responsive Behaviour

| Variant | Desktop | Tablet | Mobile |
|---|---|---|---|
| `faq--accordion` | Centered, max-width 720px | Same | Full-width, 16px padding |
| `faq--two-column` | 2-column (5+7 cols) | 2-column | Single column — question above answer |
| `faq--categorized` | Tabs above list, accordion | Tabs above, accordion | Scrollable chip row, accordion |
| `faq--minimal` | Same as accordion, no border | Same | Same |

On `sm`, the two-column variant stacks — each question appears above its answer with a divider between pairs. The layout is not an accordion in this case — both question and answer are always visible.

Minimum touch target on question buttons: 44px height. Questions with short text are padded to meet this minimum.
