# 02 — Color System

## Philosophy

Color in Digital Rise OS is functional first. Every color serves a purpose. The palette is restrained by design — a small set of colors used consistently communicates more than a large set used loosely.

---

## Color Roles

Every color in the system has a defined role. Colors are never used outside their role.

| Role | Purpose |
|---|---|
| Brand Primary | Core identity color. CTAs, active states, key highlights. |
| Brand Secondary | Supporting identity color. Accents, gradients, decorative elements. |
| Neutral | Text, backgrounds, borders, surfaces. |
| Semantic Success | Positive states, confirmations, completions. |
| Semantic Warning | Caution states, alerts requiring attention. |
| Semantic Error | Destructive actions, validation failures, critical alerts. |
| Semantic Info | Informational states, tooltips, contextual notes. |

---

## Brand Primary — Blue-Violet

The primary brand color communicates intelligence, precision, and ambition.

| Token | Value | Use |
|---|---|---|
| `--color-primary-50` | #EEF2FF | Subtle backgrounds, hover tints |
| `--color-primary-100` | #E0E7FF | Light backgrounds, focus rings |
| `--color-primary-200` | #C7D2FE | Borders on light backgrounds |
| `--color-primary-300` | #A5B4FC | Decorative accents |
| `--color-primary-400` | #818CF8 | Secondary interactive elements |
| `--color-primary-500` | #6366F1 | Primary brand color — default |
| `--color-primary-600` | #4F46E5 | Hover state for primary elements |
| `--color-primary-700` | #4338CA | Pressed/active state |
| `--color-primary-800` | #3730A3 | Dark mode interactive |
| `--color-primary-900` | #312E81 | Deepest brand tone |

---

## Neutral — Slate

Neutral colors carry the majority of the interface. They define surfaces, text, and structural elements.

| Token | Value | Use |
|---|---|---|
| `--color-neutral-0` | #FFFFFF | Page background (light), card surfaces |
| `--color-neutral-50` | #F8FAFC | App background, subtle containers |
| `--color-neutral-100` | #F1F5F9` | Card backgrounds, input fills |
| `--color-neutral-200` | #E2E8F0 | Dividers, borders |
| `--color-neutral-300` | #CBD5E1 | Disabled borders, placeholder text |
| `--color-neutral-400` | #94A3B8 | Helper text, captions |
| `--color-neutral-500` | #64748B | Secondary body text |
| `--color-neutral-600` | #475569 | Primary body text |
| `--color-neutral-700` | #334155 | Subheadings |
| `--color-neutral-800` | #1E293B | Headings |
| `--color-neutral-900` | #0F172A | Display headings, maximum contrast |
| `--color-neutral-950` | #020617 | Dark backgrounds |

---

## Brand Secondary — Cyan-Teal

Used for gradients, data visualizations, and decorative accents. Never used as the primary action color.

| Token | Value | Use |
|---|---|---|
| `--color-secondary-400` | #22D3EE | Decorative highlights |
| `--color-secondary-500` | #06B6D4 | Gradient end point |
| `--color-secondary-600` | #0891B2 | Active accent states |

---

## Semantic Colors

### Success — Green
| Token | Value |
|---|---|
| `--color-success-50` | #F0FDF4 |
| `--color-success-500` | #22C55E |
| `--color-success-700` | #15803D |

### Warning — Amber
| Token | Value |
|---|---|
| `--color-warning-50` | #FFFBEB |
| `--color-warning-500` | #F59E0B |
| `--color-warning-700` | #B45309 |

### Error — Red
| Token | Value |
|---|---|
| `--color-error-50` | #FFF1F2 |
| `--color-error-500` | #EF4444 |
| `--color-error-700` | #B91C1C |

### Info — Blue
| Token | Value |
|---|---|
| `--color-info-50` | #EFF6FF |
| `--color-info-500` | #3B82F6 |
| `--color-info-700` | #1D4ED8 |

---

## Gradient System

Gradients are used for hero backgrounds, feature highlights, and brand moments. Never used on text that must be read for function.

| Name | Definition |
|---|---|
| `gradient-brand` | 135deg, `--color-primary-500` → `--color-secondary-500` |
| `gradient-dark` | 135deg, `--color-neutral-900` → `--color-neutral-950` |
| `gradient-subtle` | 180deg, `--color-neutral-0` → `--color-neutral-50` |
| `gradient-hero` | 135deg, `#312E81` → `#0891B2` |

---

## Color Usage Rules

- **Never use color alone to convey meaning.** Always pair with an icon, label, or pattern.
- **Text on colored backgrounds must meet WCAG 2.1 AA** (4.5:1 for body text, 3:1 for large text).
- **Primary-500 is the default CTA color.** Primary-600 is hover. Primary-700 is pressed. No exceptions.
- **Never use more than 3 brand colors in a single component.**
- **Neutral-600 is the default body text color on white backgrounds.**
- **Neutral-900 is the default heading color.**

---

## Dark Mode Surface Mapping

| Light Role | Dark Equivalent |
|---|---|
| `--color-neutral-0` (page bg) | `--color-neutral-950` |
| `--color-neutral-50` (app bg) | `--color-neutral-900` |
| `--color-neutral-100` (card) | `--color-neutral-800` |
| `--color-neutral-200` (border) | `--color-neutral-700` |
| `--color-neutral-600` (body text) | `--color-neutral-300` |
| `--color-neutral-900` (heading) | `--color-neutral-50` |
