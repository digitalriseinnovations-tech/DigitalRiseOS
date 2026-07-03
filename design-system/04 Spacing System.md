# 04 — Spacing System

## Philosophy

Spacing is the invisible architecture of the interface. Consistent spacing creates rhythm, hierarchy, and breathing room. All spacing values are derived from a single base unit. Nothing is arbitrary.

---

## Base Unit

The base spacing unit is **4px**.

All spacing values are multiples of 4px. No half-values. No odd numbers. No exceptions.

---

## Spacing Scale

| Token | Value | Pixels | Common Use |
|---|---|---|---|
| `--space-0` | 0 | 0px | Reset |
| `--space-px` | 1px | 1px | Hairline borders |
| `--space-0.5` | 0.125rem | 2px | Micro gaps (icon + text) |
| `--space-1` | 0.25rem | 4px | Tight icon padding, badge gaps |
| `--space-1.5` | 0.375rem | 6px | Small component internal spacing |
| `--space-2` | 0.5rem | 8px | Inline label gaps, tight list items |
| `--space-3` | 0.75rem | 12px | Card internal padding (compact) |
| `--space-4` | 1rem | 16px | Default component padding, base gap |
| `--space-5` | 1.25rem | 20px | Medium component padding |
| `--space-6` | 1.5rem | 24px | Card padding, section internal gaps |
| `--space-7` | 1.75rem | 28px | — |
| `--space-8` | 2rem | 32px | Large component padding, row gaps |
| `--space-10` | 2.5rem | 40px | Between related sections |
| `--space-12` | 3rem | 48px | Between components in a section |
| `--space-14` | 3.5rem | 56px | — |
| `--space-16` | 4rem | 64px | Section vertical padding |
| `--space-20` | 5rem | 80px | Large section gaps |
| `--space-24` | 6rem | 96px | Hero sections, between major sections |
| `--space-32` | 8rem | 128px | Page-level vertical rhythm |
| `--space-40` | 10rem | 160px | Maximum section spacing |
| `--space-48` | 12rem | 192px | Cinematic hero padding |

---

## Spacing Intent Map

Each spacing value has an intended use context. This prevents inconsistent application.

### 2px–8px — Micro Spacing
Used inside components, between icons and labels, between badge elements.
- Icon-to-label gap: `--space-2` (8px)
- Button icon padding: `--space-1.5` (6px)
- Badge padding (horizontal): `--space-2` (8px)
- Badge padding (vertical): `--space-0.5` (2px)

### 12px–24px — Component Spacing
Used for padding inside components and gaps between closely related elements.
- Button padding (vertical): `--space-3` (12px)
- Button padding (horizontal): `--space-6` (24px)
- Card padding: `--space-6` (24px)
- Input padding (vertical): `--space-3` (12px)
- Input padding (horizontal): `--space-4` (16px)
- Form field gap: `--space-4` (16px)

### 32px–64px — Layout Spacing
Used between components within a section.
- Gap between cards in a grid: `--space-6` (24px) to `--space-8` (32px)
- Gap between a heading and its body text: `--space-4` (16px)
- Gap between a section heading and its components: `--space-10` (40px)
- Gap between stacked form sections: `--space-8` (32px)

### 64px–192px — Section Spacing
Used for vertical rhythm between major page sections.
- Default section vertical padding: `--space-16` (64px) to `--space-24` (96px)
- Hero section padding: `--space-32` (128px) to `--space-48` (192px)
- Footer top padding: `--space-24` (96px)

---

## Spacing on Responsive Breakpoints

Section-level spacing reduces on smaller screens to avoid excess whitespace.

| Spacing Role | Desktop | Tablet | Mobile |
|---|---|---|---|
| Major section padding | 96px | 72px | 48px |
| Hero section padding | 128–192px | 96px | 64px |
| Card padding | 24px | 20px | 16px |
| Between cards (gap) | 32px | 24px | 16px |
| Component internal | unchanged | unchanged | -4px max |

---

## Negative Space Rules

- Sections should breathe. Err toward more space, not less.
- Never compress vertical space to fit more content. Trim the content.
- When two adjacent elements feel too close, add `--space-4` before investigating more complex solutions.
- The space around a heading is part of the heading's visual weight.

---

## Spacing Anti-Patterns

- Do not use arbitrary px values not in the scale.
- Do not mix `px` and `rem` spacing within the same component.
- Do not rely on browser default margins. Always set explicitly.
- Do not add margin to the bottom of the last child inside a container — use gap on the parent.
