# 16 — FAQ

## Philosophy

The FAQ is a trust tool, not a content dump. Every question in an FAQ represents a user who was uncertain enough to stop and look for reassurance. A well-designed FAQ converts hesitation into confidence. Answer the real question — not the question you wished they asked.

---

## FAQ Component Types

### 1. Accordion FAQ (Default)
The standard implementation. Questions collapse/expand vertically. Efficient use of space.

### 2. Two-Column FAQ
Questions on the left, answers on the right. Used when answers are short and scannable.

### 3. Full-Width Answer FAQ
Questions expand to reveal long, detailed answers. Used for product or technical FAQs.

### 4. Categorized FAQ
Questions grouped into labeled tabs or sections. Used when FAQ exceeds 10 items.

---

## Accordion FAQ

### Container

| Property | Value |
|---|---|
| Max width | 720px |
| Centered | Yes |
| Background | transparent (sits on page background) |

### FAQ Item — Collapsed State

| Property | Value |
|---|---|
| Border bottom | 1px solid `--color-neutral-200` |
| Padding | `--space-5` (20px) 0 |
| Question text | `--text-base` to `--text-lg`, weight 600, `--color-neutral-900` |
| Icon | chevron-down, 20px, `--color-neutral-400`, right-aligned |
| Hover | Question color → `--color-primary-600`, icon color → `--color-primary-400` |
| Transition | color 150ms ease-out |
| Cursor | pointer |

**First item:** border-top also 1px solid `--color-neutral-200`

### FAQ Item — Expanded State

| Property | Value |
|---|---|
| Icon | chevron rotates 180° (transitions 200ms ease-out) |
| Question color | `--color-primary-600` |
| Answer container | expands below question |
| Answer padding | `--space-1` top, `--space-5` (20px) bottom |
| Answer text | `--text-base`, weight 400, `--color-neutral-600`, line-height 1.65 |
| Answer max width | 640px |
| Expand animation | height 0 → auto, opacity 0 → 1, 250ms ease-out |
| Collapse animation | height → 0, opacity → 0, 180ms ease-in |

Only one item open at a time (unless specified otherwise). Opening a new item closes the current.

---

## Two-Column FAQ

Used when answers are brief (under 60 words each) and the list is 4–8 items.

| Property | Value |
|---|---|
| Layout | 2-column grid, question left (5 cols), answer right (7 cols) |
| Row gap | `--space-8` (32px) |
| Border between rows | 1px `--color-neutral-100` |
| Question | `--text-base`, weight 600, `--color-neutral-900` |
| Answer | `--text-base`, weight 400, `--color-neutral-600` |
| On mobile | Stacks to single column: question above answer |

---

## Categorized FAQ

Used when there are 10+ FAQ items across multiple topics.

### Category Tabs

- Implemented as underline tabs or pill chips (see `09 Navigation.md — Tab Navigation`)
- Categories: 4–6 maximum
- Tab width: content-driven, not fixed
- Switching category: instantly filters visible questions (no page reload)
- Default open: first category

### Category Group Heading

- Font: `--text-xs`, weight 600, uppercase, `--color-neutral-500`, letter-spacing +0.06em
- Margin above group: `--space-8` (32px)
- Margin below: `--space-4` (16px)

---

## FAQ Section Header

| Element | Value |
|---|---|
| Eyebrow | "FREQUENTLY ASKED QUESTIONS" — `--text-xs`, weight 600, `--color-primary-500`, uppercase |
| Heading | `--text-3xl`, weight 700, `--color-neutral-900` |
| Subheading | Optional. `--text-lg`, `--color-neutral-500`. "Can't find your answer? [Contact us →]" |
| Max heading width | 640px, centered |
| Gap below header | `--space-12` (48px) before FAQ list |

---

## Inline Links Within Answers

FAQ answers frequently require links to deeper documentation or support.

- Style: `--color-primary-600`, underline
- External links: trailing external-link icon (12px), opens in new tab
- Internal links: no icon, same tab

---

## "Still Have Questions?" Footer Block

Placed below the FAQ section as a soft support CTA.

| Property | Value |
|---|---|
| Background | `--color-neutral-50` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 12px |
| Padding | `--space-8` (32px) |
| Heading | `--text-xl`, weight 600, `--color-neutral-900` |
| Body | `--text-base`, `--color-neutral-500` |
| Button | Secondary style, "Contact Support" |
| Layout | Centered or split (text left, button right on desktop) |

---

## FAQ SEO Considerations

- Each question is a `<dt>` or `<h3>` element, answer is `<dd>` or `<p>`.
- Page must include FAQ structured data (JSON-LD) with `FAQPage` schema.
- Questions should be phrased exactly as users would type them into a search engine.
- Do not duplicate FAQ content across multiple pages. Canonical source only.

---

## FAQ Writing Rules

- Lead with the user's concern, not the company's preferred framing.
- Answers are 40–120 words. If longer, link to a dedicated article.
- Avoid corporate jargon. Plain language only.
- Write as if answering a friend's question — honest, direct, reassuring.
- Review FAQ quarterly. Remove questions no longer relevant. Add questions from support tickets.
