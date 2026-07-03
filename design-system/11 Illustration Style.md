# 11 — Illustration Style

## Philosophy

Illustrations in Digital Rise OS are not decorative. They explain, they orient, and they humanize. Every illustration earns its place by communicating something that text or icons alone cannot. When in doubt, the illustration is not needed.

---

## Illustration Categories

### 1. Hero Illustrations
Large, high-impact visuals used in page heroes and key landing moments. Abstract, conceptual, and brand-expressive.

### 2. Feature Illustrations
Mid-scale visuals attached to individual features or sections. Explanatory — they show what a feature does.

### 3. Empty State Illustrations
Small, friendly visuals for empty data views, zero results, and onboarding prompts. Human-feeling and encouraging.

### 4. Error State Illustrations
Used for 404, 500, and other error states. Light in tone — communicates the error without amplifying frustration.

### 5. Onboarding Illustrations
Step-by-step instructional visuals guiding new users through setup flows.

---

## Visual Style

### Line Weight
- 1.5px to 2px strokes as the primary structure.
- No thick outlines (>3px) unless used as an intentional brand moment.
- Consistent stroke weight throughout a single illustration.

### Shape Language
- Primarily geometric, with soft curves.
- Avoid sharp, aggressive angles.
- Circles and rounded rectangles are the dominant primitives.
- Asymmetry is used intentionally to add energy — not as the default.

### Depth and Dimension
- Light isometric perspective or flat 2D — never full 3D rendering.
- Depth suggested through layering and subtle shadows, not perspective distortion.
- Overlapping elements create hierarchy without 3D complexity.

---

## Color Usage in Illustrations

Illustrations use a constrained version of the brand palette.

| Role | Color |
|---|---|
| Primary shapes | `--color-primary-500`, `--color-primary-200` |
| Accent / highlight | `--color-secondary-400` |
| Neutral fills | `--color-neutral-100`, `--color-neutral-200` |
| Background shapes | `--color-primary-50`, `--color-neutral-50` |
| Strokes | `--color-neutral-300` to `--color-neutral-700` depending on contrast |
| Text within illustration | Never — use captions outside the illustration |

**Maximum 5 colors in any single illustration.** Palette simplicity is a quality marker.

Gradient fills are permitted on primary shapes. Use the `gradient-brand` token only.

---

## Illustration Sizing

| Category | Typical Size | Max Width |
|---|---|---|
| Hero illustrations | 480px – 640px | 640px |
| Feature illustrations | 240px – 360px | 400px |
| Empty state | 180px – 240px | 280px |
| Error state | 240px – 320px | 360px |
| Onboarding step | 200px – 280px | 320px |

All illustrations are exported as SVG. Fallback PNG at 2× density for environments that do not support SVG.

---

## Illustration Composition Rules

- **Visual weight** is balanced across the illustration. No single corner dominates.
- **Focal point** is established within the first 500ms of viewing.
- **Negative space** inside the illustration supports the focal point — do not fill every area.
- **Text** is never embedded inside an SVG illustration. Labels always exist outside.
- **Human figures**, if used, are abstract silhouettes or geometric avatars — not realistic faces.

---

## Empty State Illustration

Empty state illustrations follow a specific formula:

1. Central icon or simple scene (120px–180px) — friendly, not alarming.
2. Short heading below: `--text-lg`, weight 600, `--color-neutral-800`
3. Body text below: `--text-sm`, `--color-neutral-500`, max 2 lines
4. Optional CTA button below body text

**Tone:** encouraging. "Nothing here yet — let's change that" not "Error: no data found."

---

## Do Not

- Do not use stock illustration libraries without style-matching to this system.
- Do not use photographic textures, noise, or complex gradients in illustrations.
- Do not animate illustrations unless the motion serves a clear informational purpose.
- Do not create illustrations with fine detail that is lost below 200px.
- Do not include logos, brand names, or real-world UI screenshots inside illustrations.

---

## File Standards

- Format: SVG (primary), PNG 2× (fallback)
- Naming: `illustration-[category]-[descriptor].svg` (e.g., `illustration-empty-no-results.svg`)
- Optimization: run through SVGO before committing. No unnecessary `<g>` wrappers, no inline styles.
- Accessibility: each illustration SVG must include a `<title>` element with a descriptive label.
