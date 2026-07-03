# 05 — Grid System

## Philosophy

The grid is the invisible skeleton of every page. It creates alignment, consistency, and rhythm. Every element on screen should snap to the grid or have a deliberate reason for not doing so.

---

## Container

The container constrains content width and provides consistent horizontal padding.

| Breakpoint | Max Width | Horizontal Padding |
|---|---|---|
| Mobile (`< 768px`) | 100% | 16px each side |
| Tablet (`768px–1023px`) | 100% | 24px each side |
| Desktop (`1024px–1279px`) | 100% | 32px each side |
| Wide (`1280px–1439px`) | 1280px | 40px each side |
| Max (`≥ 1440px`) | 1440px | auto (centered) |

The container is always horizontally centered. It never stretches beyond its max-width.

---

## Column Grid

The system uses a **12-column grid** across all breakpoints. Column count collapses gracefully on smaller screens.

| Breakpoint | Columns | Gutter | Column Width (approx.) |
|---|---|---|---|
| Mobile (`sm`, 375px) | 4 | 16px | fluid |
| Tablet (`md`, 768px) | 8 | 24px | fluid |
| Desktop (`lg`, 1024px) | 12 | 24px | fluid |
| Wide (`xl`, 1280px) | 12 | 32px | fluid |
| Max (`2xl`, 1440px) | 12 | 32px | fluid |

---

## Column Span Reference

Common layout patterns and their column spans:

### Full Width
- Span: 12 columns
- Used for: hero backgrounds, full-bleed images, section wrappers

### Centered Content (Narrow)
- Span: 6 columns, centered (col-start: 4 on 12-col grid)
- Used for: blog posts, long-form copy, pricing headers

### Centered Content (Medium)
- Span: 8 columns, centered (col-start: 3)
- Used for: section headings, testimonials, CTAs

### Two-Column Layout
- Left: 6 columns | Right: 6 columns
- Used for: feature pairs, text + image, comparison

### Two-Column (Asymmetric)
- Left: 7 columns | Right: 5 columns
- Used for: hero with text + visual, feature detail

### Three-Column Layout
- Each: 4 columns
- Used for: feature cards, pricing tiers, testimonials (3-up)

### Four-Column Layout
- Each: 3 columns
- Used for: icon-feature grids, stat grids

### Sidebar Layout
- Sidebar: 3 columns | Main content: 9 columns
- Used for: documentation, dashboard navigation

---

## Auto Grid (Component-Level)

For component grids where column count is content-driven, use auto-fit rules:

| Component | Min Card Width | Behavior |
|---|---|---|
| Feature cards | 280px | 1 → 2 → 3 columns |
| Blog cards | 300px | 1 → 2 → 3 columns |
| Testimonial cards | 320px | 1 → 2 → 3 columns |
| Stat blocks | 180px | 2 → 4 columns |
| Logo grid | 120px | 2 → 3 → 5 → 6 columns |

---

## Vertical Rhythm

Vertical rhythm is managed through the spacing system, not the grid. The grid governs horizontal structure. Spacing governs vertical structure.

- Section-to-section: `--space-24` (96px) default
- Component-to-component within a section: `--space-10` to `--space-12` (40–48px)
- See `04 Spacing System.md` for full vertical spacing definitions.

---

## Grid Rules

- All layout components must align to the column grid.
- Gutters are uniform on both sides of every column. Never collapse a gutter to save space.
- Never nest more than 2 levels of grid containers. Complexity beyond this is a design problem.
- On mobile (4-column), most grids collapse to single column. Two-column layouts may remain if content allows.
- Full-bleed sections (dark backgrounds, hero areas) extend to viewport edge. Their inner content is still constrained by the container.

---

## Breakpoints Reference

| Name | Token | Width |
|---|---|---|
| `sm` | `--breakpoint-sm` | 375px |
| `md` | `--breakpoint-md` | 768px |
| `lg` | `--breakpoint-lg` | 1024px |
| `xl` | `--breakpoint-xl` | 1280px |
| `2xl` | `--breakpoint-2xl` | 1440px |

---

## Safe Zones

Safe zones define areas where no critical content should be placed, to account for device edge spacing, notches, and overflow.

- Horizontal: always respect container padding (16px minimum)
- Vertical: never place interactive elements within 8px of the top/bottom viewport edge on mobile
- Notch/Dynamic Island: allow 44px safe area at top on mobile where applicable
