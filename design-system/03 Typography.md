# 03 — Typography

## Philosophy

Typography is the voice of the interface. In Digital Rise OS, type is used with restraint and precision. One primary typeface. One monospace typeface. A clear scale. No decorative choices that sacrifice legibility.

---

## Typefaces

### Primary — Inter

Inter is the primary typeface for all UI text, headings, body copy, labels, and interface elements.

- **Why Inter:** Designed specifically for screens. Exceptional legibility at small sizes. Comprehensive weight range. Excellent number tabular alignment for data-heavy interfaces.
- **Source:** Google Fonts / bunny.net (self-hosted preferred for performance)
- **Loading strategy:** `font-display: swap`
- **Weights used:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Monospace — JetBrains Mono

Used exclusively for code snippets, technical values, tokens, and data fields.

- **Why JetBrains Mono:** Optimized for readability in code contexts. Distinctive ligatures. Clean rendering at small sizes.
- **Source:** Google Fonts / self-hosted
- **Weights used:** 400 (Regular), 500 (Medium)

---

## Type Scale

The scale is built on a 1.25 modular ratio (Major Third), starting from a 16px base.

| Token | Size | Line Height | Weight | Letter Spacing | Use |
|---|---|---|---|---|---|
| `--text-xs` | 12px / 0.75rem | 1.5 (18px) | 400 | +0.01em | Captions, badges, metadata |
| `--text-sm` | 14px / 0.875rem | 1.5 (21px) | 400 | 0 | Helper text, labels, secondary |
| `--text-base` | 16px / 1rem | 1.6 (25.6px) | 400 | 0 | Body copy — default |
| `--text-lg` | 18px / 1.125rem | 1.55 (27.9px) | 400–500 | -0.01em | Large body, lead paragraphs |
| `--text-xl` | 20px / 1.25rem | 1.4 (28px) | 500–600 | -0.01em | Card titles, section intros |
| `--text-2xl` | 24px / 1.5rem | 1.35 (32.4px) | 600 | -0.02em | Small headings (H3) |
| `--text-3xl` | 30px / 1.875rem | 1.3 (39px) | 600–700 | -0.02em | Section headings (H2) |
| `--text-4xl` | 36px / 2.25rem | 1.25 (45px) | 700 | -0.03em | Page headings (H1) |
| `--text-5xl` | 48px / 3rem | 1.15 (55.2px) | 700 | -0.03em | Hero headings |
| `--text-6xl` | 60px / 3.75rem | 1.1 (66px) | 700 | -0.04em | Display headings |
| `--text-7xl` | 72px / 4.5rem | 1.05 (75.6px) | 700 | -0.04em | Maximum display (rare) |

---

## Heading Hierarchy

### H1 — Page Title
- Size: `--text-4xl` to `--text-5xl` depending on context
- Weight: 700
- Color: `--color-neutral-900`
- Letter spacing: -0.03em
- One per page. Maximum.

### H2 — Section Heading
- Size: `--text-3xl`
- Weight: 700
- Color: `--color-neutral-900`
- Letter spacing: -0.02em
- Used to label major page sections.

### H3 — Subsection Heading
- Size: `--text-2xl`
- Weight: 600
- Color: `--color-neutral-800`
- Letter spacing: -0.02em

### H4 — Component Heading
- Size: `--text-xl`
- Weight: 600
- Color: `--color-neutral-700`
- Letter spacing: -0.01em

### H5 — Label Heading
- Size: `--text-lg`
- Weight: 600
- Color: `--color-neutral-700`

### H6 — Micro Heading
- Size: `--text-base`
- Weight: 600
- Color: `--color-neutral-600`

---

## Body Text

### Lead Paragraph
- Size: `--text-lg` or `--text-xl`
- Weight: 400
- Color: `--color-neutral-500`
- Line height: 1.6
- Used immediately below H1 and H2 headings as introductory text.

### Default Body
- Size: `--text-base`
- Weight: 400
- Color: `--color-neutral-600`
- Line height: 1.6
- Maximum line length: 72 characters (measure). Lines longer than this reduce readability.

### Small / Helper Text
- Size: `--text-sm`
- Weight: 400
- Color: `--color-neutral-400`
- Used for form hints, metadata, captions.

### Caption / Label
- Size: `--text-xs`
- Weight: 500
- Color: `--color-neutral-400`
- Letter spacing: +0.02em (uppercase labels: +0.08em)

---

## Overline / Eyebrow Text

Used above headings to introduce a topic or label a section category.

- Size: `--text-xs` to `--text-sm`
- Weight: 600
- Color: `--color-primary-500`
- Letter spacing: +0.1em
- Transform: UPPERCASE
- Example: "PLATFORM FEATURES" above an H2

---

## Link Typography

### Inline Links
- Color: `--color-primary-600`
- Decoration: underline (2px, `--color-primary-200`)
- Hover: `--color-primary-700`, underline color `--color-primary-400`
- No weight change on hover.

### Standalone Links (e.g., "Read more →")
- Color: `--color-primary-600`
- Weight: 500
- No underline by default
- Hover: underline appears, color shifts to `--color-primary-700`

---

## Code Typography

- Font: JetBrains Mono
- Inline code: `--text-sm`, background `--color-neutral-100`, border-radius 4px, padding 2px 6px
- Code blocks: `--text-sm`, background `--color-neutral-950`, color `--color-neutral-100`, border-radius 8px, padding 20px 24px

---

## Responsive Typography Adjustments

Display and hero headings scale down on smaller screens:

| Token | Desktop | Tablet (md) | Mobile (sm) |
|---|---|---|---|
| Display / `--text-7xl` | 72px | 60px | 48px |
| Hero / `--text-6xl` | 60px | 48px | 36px |
| Hero / `--text-5xl` | 48px | 36px | 30px |
| H1 / `--text-4xl` | 36px | 30px | 24px |
| H2 / `--text-3xl` | 30px | 24px | 20px |

Use `clamp()` to create fluid scaling between breakpoints:

- Hero: `clamp(2rem, 5vw + 1rem, 4.5rem)`
- H1: `clamp(1.5rem, 3vw + 1rem, 2.25rem)`

---

## Typography Rules

- Never set body text below 14px.
- Never set line height below 1.4 for paragraph text.
- Never use more than 2 typefaces in the system.
- Never use font weights outside the defined set (400, 500, 600, 700).
- Never use ALL CAPS on body text — only overlines and badges.
- Paragraphs max-width: 65–72ch for readability.
- Do not justify text — left-align is always preferred.
