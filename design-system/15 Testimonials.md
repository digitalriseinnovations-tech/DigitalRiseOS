# 15 — Testimonials

## Philosophy

Testimonials are the voice of the customer placed inside the product story. They must feel authentic, human, and contextually relevant. A poorly placed or visually weak testimonial is worse than none — it signals that the brand is trying too hard. Every testimonial component must earn trust, not demand it.

---

## Testimonial Types

### 1. Inline Quote Card
The most common testimonial format. Used in sections within marketing pages.

### 2. Marquee / Scroll Strip
A horizontally scrolling strip of compact testimonial cards. Used for social proof density without vertical space cost.

### 3. Featured Testimonial
Full-width, high-impact quote. Used as a standalone section to anchor trust at critical moments (e.g., just above pricing).

### 4. Testimonial with Result
Testimonial paired with a measurable outcome. Used in case study contexts.

### 5. Video Testimonial Thumbnail
A video play card in place of text. Used for premium, high-trust evidence.

---

## Inline Quote Card

| Property | Value |
|---|---|
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 12px |
| Padding | `--space-6` (24px) |
| Box shadow | `0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)` |
| Max width | 380px (in grid), 100% (standalone) |

**Card structure (top to bottom):**

1. **Star Rating**
   - 5 stars, 16px each, `--color-warning-500`, gap `--space-1` (4px)
   - Margin below: `--space-4` (16px)

2. **Quote Text**
   - Font: `--text-base` to `--text-lg`
   - Weight: 400
   - Color: `--color-neutral-700`
   - Line height: 1.65
   - Opening quotation mark: decorative, `--text-3xl`, `--color-primary-200`, above the text
   - Max 3–4 lines. Longer quotes use line clamping with "Read more" link.

3. **Author Row**
   - Avatar: 40px circle, 2px border `--color-neutral-100`
   - Name: `--text-sm`, weight 600, `--color-neutral-900`
   - Title + Company: `--text-xs`, `--color-neutral-400`
   - Avatar-to-text gap: `--space-3` (12px)
   - Row margin-top: `--space-5` (20px)

---

## Testimonial Grid Layout

| Layout | Columns | Gap |
|---|---|---|
| 3-up (standard) | 3 (lg+), 2 (md), 1 (sm) | `--space-6` (24px) |
| 2-up (wide cards) | 2 (lg+), 1 (sm/md) | `--space-8` (32px) |
| Masonry (varied heights) | 3 (lg+), 2 (md) | `--space-6` (24px) |

For masonry layouts, column balancing is achieved with CSS columns, not flexbox/grid.

---

## Marquee / Scroll Strip

A continuous horizontal scroll of compact testimonial cards. Creates high-density social proof.

| Property | Value |
|---|---|
| Card width | 300px–360px (fixed) |
| Card padding | `--space-5` (20px) |
| Card border radius | 10px |
| Card border | 1px solid `--color-neutral-200` |
| Gap between cards | `--space-4` (16px) |
| Scroll speed | 40px/sec (slow, readable) |
| Direction | left (default), reversed on second row if double-row layout |
| Pause on hover | Yes — `animation-play-state: paused` |
| Fade edges | Gradient mask on left and right edges, 80px wide |
| Rows | 1 or 2 (2-row marquee alternates direction) |

Marquee accessibility: `prefers-reduced-motion` disables scrolling, shows static grid instead.

---

## Featured Testimonial (Full Width)

Used as a standalone section for maximum impact.

| Property | Value |
|---|---|
| Background | `--color-neutral-950` or `gradient-hero` |
| Padding | `--space-24` (96px) vertical |
| Max content width | 800px, centered |

**Structure:**

1. **Opening quote icon** — large decorative `"` mark, `--color-primary-400`, 80px, above quote
2. **Quote** — `--text-2xl` to `--text-3xl`, weight 400, white, centered, line-height 1.5, italic
3. **Author** — `--text-base`, weight 600, white, margin-top `--space-8`
4. **Title / Company** — `--text-sm`, `--color-neutral-400`, margin-top `--space-1`
5. **Company logo** — 24px height, white/tinted, margin-top `--space-6`

---

## Testimonial with Result

For case study-style testimonials where a metric is highlighted.

**Result block (above the quote card):**
- Large metric: `--text-4xl`, weight 700, `--color-primary-500`
- Metric label: `--text-sm`, `--color-neutral-500`
- This block is visually separate from but spatially connected to the quote below

---

## Video Testimonial Card

| Property | Value |
|---|---|
| Aspect ratio | 16:9 |
| Border radius | 12px |
| Play button | 56px circle, white fill, 50% opacity background, centered |
| Play icon | triangle, 20px, `--color-neutral-900` |
| Hover | background opacity 70%, play button scale 1.05 |
| Overlay on hover | none — keep simple |
| Author name + title | below the thumbnail, same style as inline card author row |

---

## Section Heading for Testimonials

| Element | Recommended Value |
|---|---|
| Eyebrow | "WHAT OUR CUSTOMERS SAY" or "TRUSTED BY TEAMS LIKE YOURS" |
| Heading | Direct, not generic: "The results speak for themselves" |
| Subheading | Optional, `--text-lg`, `--color-neutral-500` |
| Max width | 640px, centered |
| Bottom gap before cards | `--space-12` (48px) |

---

## Testimonial Rules

- Never fabricate or paraphrase testimonials without explicit written consent.
- Always include at minimum: name, title, and company (or use case if B2C).
- Avatars are real photos — no illustrations or initials as a substitute for testimonial cards.
- Never use more than 150 words in a displayed testimonial. Edit for length with author consent.
- Do not lead a page with a testimonial — establish the product claim first, then validate with testimony.
