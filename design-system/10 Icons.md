# 10 — Icons

## Philosophy

Icons support communication — they do not replace it. Every icon must be paired with a label (visible or accessible) unless it is universally recognized. Icons reduce cognitive load when used correctly and increase it when overused.

---

## Icon Library

**Primary library:** Lucide Icons

Lucide is the approved icon set for Digital Rise OS.

- Style: Line-based (stroke), consistent 2px stroke width
- Grid: 24px base grid
- Corner style: Rounded caps and joins (not sharp)
- Design language: Minimal, neutral, universally readable

**Do not mix Lucide with icons from other libraries.** If a needed icon does not exist in Lucide, create a custom icon that matches the Lucide visual language exactly.

---

## Icon Sizes

| Token | Size | Use |
|---|---|---|
| `--icon-xs` | 12px | Inline with `--text-xs` labels, badges |
| `--icon-sm` | 16px | Inline with `--text-sm`, button icons, nav items |
| `--icon-md` | 20px | Default UI size, dropdown items, list items |
| `--icon-lg` | 24px | Feature cards, section icons, dialog headers |
| `--icon-xl` | 32px | Large feature icons on landing pages |
| `--icon-2xl` | 40px | Hero icons, empty state illustrations |
| `--icon-3xl` | 48px | Card-top feature icons |

---

## Icon Color

Icons inherit color from their context by default. Named color values are:

| Context | Color Token |
|---|---|
| Default UI icon | `--color-neutral-500` |
| Active / interactive icon | `--color-primary-500` |
| Icon in dark sidebar | `--color-neutral-400` |
| Icon active (dark sidebar) | `--color-primary-400` |
| Success state icon | `--color-success-500` |
| Warning state icon | `--color-warning-500` |
| Error state icon | `--color-error-500` |
| Icon in button (primary) | white |
| Icon in ghost button | `--color-neutral-600` |

Never hardcode icon colors. Always reference a token.

---

## Icon in Context

### Inline with Text

When an icon appears beside text, the icon aligns to the center of the text's cap height (not the line height).

| Text size | Icon size | Gap |
|---|---|---|
| `--text-xs` | 12px | `--space-1` (4px) |
| `--text-sm` | 16px | `--space-1.5` (6px) |
| `--text-base` | 16px | `--space-2` (8px) |
| `--text-lg` | 20px | `--space-2` (8px) |
| `--text-xl` | 20px | `--space-2.5` (10px) |

### Icon in Button

- Leading icon (left): gap to label `--space-2` (8px)
- Trailing icon (right, for navigation/external links): gap `--space-1.5` (6px), icon size 14px
- Icon-only button: icon centered, equal padding all sides

### Icon Containers (Feature Cards)

Feature card icons are placed inside a styled container:

| Container size | Icon size | Border radius | Background |
|---|---|---|---|
| 40px × 40px | 20px | 8px | `--color-primary-50` |
| 48px × 48px | 24px | 10px | `--color-primary-50` |
| 56px × 56px | 28px | 12px | `--color-primary-50` |

Container border: 1px solid `--color-primary-100`

---

## Icon Accessibility

- Icons that convey meaning without visible text labels must have `aria-label` on their container or `title` on the SVG.
- Decorative icons (purely visual, label present) must have `aria-hidden="true"`.
- Never rely on an icon alone in a required form field — use an icon + visible label.
- Color-only icon meaning (e.g., green check vs. red ✕) must also use shape or label to distinguish.

---

## Icon Animation

Icons can animate to communicate state changes. All icon animations must:

- Use `transform` and `opacity` only (no layout-triggering properties).
- Complete within 200ms (micro) to 400ms (transitional).

**Common animated icon patterns:**

| Pattern | Animation | Duration |
|---|---|---|
| Hamburger → X | Lines morph via rotation | 250ms ease-in-out |
| Chevron expand | Rotate 180deg | 200ms ease-out |
| Loading spinner | Rotate 360deg, infinite | 600ms linear |
| Checkbox check | Draw path (stroke-dashoffset) | 200ms ease-out |
| Toggle thumb | TranslateX | 200ms ease-in-out |
| Bell notification | Scale bounce | 300ms spring-like |

---

## Custom Icon Guidelines

When a required icon does not exist in Lucide:

1. Use a 24px grid as the base.
2. Apply 2px stroke width, rounded caps and joins.
3. Maintain consistent visual weight with surrounding Lucide icons.
4. Export as SVG with optimized paths (no unnecessary nodes).
5. Confirm with a visual comparison at 16px, 20px, and 24px before shipping.
6. Submit the icon for review before adding to the design system.

---

## Icon Rules

- Never scale an icon beyond its defined sizes using arbitrary values.
- Never use raster (PNG/JPG) icons. SVG only.
- Never use filled icon variants mixed with line variants in the same section.
- Never place an icon without a visual or accessible label in a functional context.
- Always align icons to the pixel grid to avoid subpixel blurring.
