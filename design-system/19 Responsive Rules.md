# 19 — Responsive Rules

## Philosophy

Every interface in Digital Rise OS is designed for the smallest screen first and enhanced progressively for larger screens. Responsive design is not about making the desktop version fit on a phone — it is about designing the right experience for each context. The constraints of mobile make design better.

---

## Breakpoints

| Name | Token | Width | Description |
|---|---|---|---|
| `sm` | `--breakpoint-sm` | 375px | Small mobile (iPhone SE, older Android) |
| `md` | `--breakpoint-md` | 768px | Tablet portrait / large mobile landscape |
| `lg` | `--breakpoint-lg` | 1024px | Tablet landscape / small desktop |
| `xl` | `--breakpoint-xl` | 1280px | Standard desktop |
| `2xl` | `--breakpoint-2xl` | 1440px | Wide desktop |

---

## Mobile-First Approach

All base CSS is written for mobile (`< 768px`). Larger breakpoints add or override styles using `min-width` media queries only.

```
/* Mobile first */
.component { /* mobile styles */ }

@media (min-width: 768px) { /* tablet overrides */ }
@media (min-width: 1024px) { /* desktop overrides */ }
@media (min-width: 1280px) { /* wide desktop overrides */ }
```

Never use `max-width` media queries as the primary breakpoint strategy. They lead to fighting specificity and become impossible to maintain.

---

## Layout Behavior by Breakpoint

### Navigation
| Breakpoint | Behavior |
|---|---|
| `sm` / `md` (< 1024px) | Hamburger menu, full-screen drawer |
| `lg`+ (≥ 1024px) | Inline horizontal navigation |

### Grid Columns
| Layout | sm | md | lg | xl |
|---|---|---|---|---|
| Feature cards | 1 | 2 | 3 | 3 |
| Blog cards | 1 | 2 | 3 | 3 |
| Pricing cards | 1 | 1 | 3 | 3 |
| Stat blocks | 2 | 2 | 4 | 4 |
| Two-column sections | 1 (stacked) | 1 (stacked) | 2 | 2 |
| Sidebar + content | 1 (stacked) | 1 (stacked) | sidebar+content | sidebar+content |
| Logo grid | 2 | 3 | 5 | 6 |

### Button Behavior
| Context | sm | md | lg+ |
|---|---|---|---|
| Hero CTA group | Stacked, full-width | Inline or stacked | Inline |
| Button groups | Stacked | Inline | Inline |
| Form submit | Full-width | Full-width | Full-width (forms) |

### Typography Scaling

See `03 Typography.md` for full responsive type table. Summary:

| Token | sm | md | lg | xl |
|---|---|---|---|---|
| Display | 36px | 48px | 60px | 72px |
| Hero H1 | 30px | 36px | 48px | 60px |
| Section H2 | 24px | 28px | 30px | 36px |

---

## Container Responsive Behavior

| Breakpoint | Max Width | H-Padding |
|---|---|---|
| `sm` (375px) | 100% | 16px |
| `md` (768px) | 100% | 24px |
| `lg` (1024px) | 100% | 32px |
| `xl` (1280px) | 1280px | 40px |
| `2xl` (1440px) | 1440px | auto (centered) |

---

## Spacing Responsive Behavior

Section-level vertical padding scales down on smaller screens.

| Spacing Role | lg+ | md | sm |
|---|---|---|---|
| Section padding (standard) | 96px | 72px | 48px |
| Section padding (hero) | 128–192px | 96px | 64px |
| Section gap (between sections) | 96px | 72px | 48px |
| Card grid gap | 32px | 24px | 16px |
| Container card padding | 32px | 24px | 20px |

---

## Image Responsive Behavior

- All images use `width: 100%` with a defined `aspect-ratio`.
- Never use fixed pixel dimensions on images in layout contexts.
- Use `srcset` and `sizes` for performance across resolutions.
- Hero images: landscape on desktop, cropped to square or portrait on mobile.
- Feature illustration images: may be hidden on `sm` breakpoint if redundant with visible text.

---

## Touch Targets

All interactive elements meet minimum touch target size on mobile:

| Element | Minimum Size |
|---|---|
| Buttons | 44px × 44px |
| Links (standalone) | 44px height minimum |
| Checkboxes / radios | 44px × 44px clickable area |
| Icon-only buttons | 44px × 44px |
| Navigation items | 44px height minimum |
| Table row actions | 36px (acceptable in dense data tables) |

The visible size of an element may be smaller, but the clickable/tappable area must meet these minimums using padding.

---

## Content Priority on Mobile

When space collapses on mobile, content follows a priority order:

1. **Primary headline** — always visible
2. **Primary CTA** — always visible, always first in stacked order
3. **Supporting body text** — visible, may be condensed
4. **Secondary CTAs** — visible
5. **Supporting visuals** — may be hidden on `sm` if space is constrained
6. **Decorative elements** — hidden on `sm`

---

## Component-Specific Mobile Rules

| Component | Mobile Adaptation |
|---|---|
| Navigation | Drawer replaces top bar links |
| Hero section | Text-only or text + small image (stacked) |
| Two-column sections | Text stacks above image |
| Cards grid | Single column |
| Data tables | Horizontal scroll (do not collapse table structure) |
| Modals | Full-screen on sm (100vw × 100vh) |
| Toast notifications | Full-width at top of screen, not bottom-right |
| Forms | Full-width fields, full-width submit |
| Dropdowns | Full-screen bottom sheet on sm (not inline popup) |
| Pricing cards | Single card visible, swipe to see others |

---

## Responsive Testing Requirements

Before marking any component or page as complete, test at:

| Device Class | Test At |
|---|---|
| Small mobile | 375px (iPhone SE equivalent) |
| Large mobile | 430px (iPhone Pro Max equivalent) |
| Tablet portrait | 768px |
| Tablet landscape | 1024px |
| Standard desktop | 1280px |
| Wide desktop | 1440px |

Test in a real browser (not just browser resize). Test with actual touch input on at least one mobile device class before shipping.

---

## What Responsive is NOT

- Responsive is not shrinking a desktop layout to fit a phone.
- Responsive is not hiding all content on mobile.
- Responsive is not making everything full-width at sm and calling it done.
- Responsive is not optional. Every component shipped must be responsive.
