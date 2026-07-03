# 08 — Cards

## Philosophy

Cards are self-contained units of content. They create visual grouping, allow scanning, and present related information as a cohesive object. A card should be digestible in under 5 seconds. If it takes longer, the content belongs in a different layout.

---

## Card Anatomy

Every card is built from a consistent set of layers:

1. **Container** — the outer shell with background, border, radius, and shadow
2. **Media** (optional) — image, illustration, or icon at the top
3. **Header** — eyebrow / category label + title
4. **Body** — supporting text or content
5. **Footer** (optional) — metadata, tags, or action buttons

---

## Base Card

The default card style used across feature lists, blog previews, and general content grouping.

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 12px |
| Padding | `--space-6` (24px) |
| Box shadow | `0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)` |

**Hover state (when card is interactive/linked):**
- Border color: `--color-neutral-300`
- Box shadow: `0 4px 16px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.06)`
- Transform: `translateY(-2px)`
- Transition: `all 220ms ease-out`

---

## Feature Card

Used to present platform features. Icon-led, concise, scannable.

| Property | Value |
|---|---|
| Layout | Vertical stack |
| Icon container | 48px × 48px, border-radius 10px, `--color-primary-50` background |
| Icon size | 24px, `--color-primary-500` |
| Icon-to-title gap | `--space-4` (16px) |
| Title | `--text-xl`, weight 600, `--color-neutral-900` |
| Title-to-body gap | `--space-2` (8px) |
| Body text | `--text-base`, weight 400, `--color-neutral-500` |
| Padding | `--space-6` (24px) |
| Border radius | 12px |
| Border | 1px solid `--color-neutral-200` |

---

## Blog / Article Card

Used in blog listing pages and content feeds.

| Property | Value |
|---|---|
| Layout | Vertical — image top, content below |
| Image aspect ratio | 16:9 |
| Image border radius | 8px 8px 0 0 (top corners only) |
| Content padding | `--space-5` (20px) `--space-6` (24px) |
| Category label | `--text-xs`, weight 600, `--color-primary-500`, uppercase, letter-spacing +0.08em |
| Title | `--text-xl`, weight 600, `--color-neutral-900`, margin-top: `--space-2` |
| Excerpt | `--text-sm`, weight 400, `--color-neutral-500`, line clamp 3 |
| Metadata row | Author avatar (24px) + name + date, `--text-xs`, `--color-neutral-400` |
| Metadata gap | `--space-4` from excerpt |

---

## Pricing Card

Used on pricing pages. Requires clear visual hierarchy.

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 16px |
| Padding | `--space-8` (32px) |
| Max width | 360px |

**Featured / Recommended variant:**
- Background: `--color-primary-500`
- All text: white
- Border: none
- Box shadow: `0 8px 32px rgba(99, 102, 241, 0.3)`
- Scale: slightly larger (`1.02`) on desktop

**Card structure:**
1. Plan name — `--text-sm`, weight 600, uppercase, letter-spacing +0.08em
2. Price — `--text-5xl`, weight 700 (number) + `--text-xl` (period/cycle label)
3. Description — `--text-sm`, `--color-neutral-500`
4. Divider — 1px `--color-neutral-200`
5. Feature list — each item: 16px check icon + `--text-sm` label, gap `--space-3`
6. CTA button — full-width, `--space-6` top margin

---

## Testimonial Card

Used for social proof sections.

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 12px |
| Padding | `--space-6` (24px) |

**Structure:**
1. Star rating — 5 stars, 16px, `--color-warning-500` (#F59E0B)
2. Quote text — `--text-base` to `--text-lg`, weight 400, `--color-neutral-700`, line height 1.6
3. Author row — 40px avatar (circle, 2px border `--color-neutral-200`) + name (`--text-sm`, weight 600, `--color-neutral-900`) + role (`--text-xs`, `--color-neutral-400`)
4. Author gap from quote: `--space-5` (20px)

---

## Stat / Metric Card

Used for dashboard numbers and key metrics.

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 10px |
| Padding | `--space-5` (20px) `--space-6` (24px) |

**Structure:**
1. Label — `--text-xs`, weight 500, `--color-neutral-500`, uppercase, letter-spacing +0.06em
2. Value — `--text-4xl`, weight 700, `--color-neutral-900`
3. Change indicator — `--text-sm`, weight 500, `--color-success-600` (positive) or `--color-error-600` (negative), with ↑ / ↓ arrow icon

---

## Card Grid Behavior

| Layout | Gap | Columns |
|---|---|---|
| Feature 3-up | 24px | 3 (lg+), 2 (md), 1 (sm) |
| Blog 3-up | 32px | 3 (lg+), 2 (md), 1 (sm) |
| Pricing 3-up | 24px | 3 (lg+), 1 stacked (sm/md) |
| Stat 4-up | 16px | 4 (lg+), 2 (sm/md) |

---

## Card Rules

- Every card must have a single focal point (icon, image, or leading number).
- Never put more than one CTA inside a card — it splits attention.
- Cards in a grid must be equal height. Use CSS grid stretch, not fixed height.
- Images inside cards always have a defined aspect ratio. Never unconstrained.
- Interactive cards (links, hover states) must have a visible focus state.
- Never nest a card inside a card.
