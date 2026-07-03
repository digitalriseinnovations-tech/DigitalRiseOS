# 09 — Navigation

## Philosophy

Navigation should disappear into the background when not needed and surface clearly when it is. A user should never wonder where they are, how to get somewhere else, or how to go back. Navigation is infrastructure — it should be dependable, not decorative.

---

## Primary Navigation (Top Bar)

The top navigation bar is persistent across all marketing pages.

### Layout

| Property | Value |
|---|---|
| Height | 64px |
| Background | `--color-neutral-0` with `backdrop-filter: blur(8px)` |
| Border bottom | 1px solid `--color-neutral-100` |
| Position | sticky, top: 0 |
| Z-index | 1000 |
| Container | full-width with max-width container padding |

### Structure (left to right)

1. **Logo** — left-aligned, height 32px, links to homepage
2. **Primary Links** — centered or left of center
3. **Actions** — right-aligned: secondary CTA + primary CTA

### Primary Navigation Links

| Property | Value |
|---|---|
| Font size | `--text-sm` (14px) |
| Font weight | 500 |
| Color | `--color-neutral-600` |
| Gap between links | `--space-8` (32px) |

**Hover:** color → `--color-neutral-900`, transition: 150ms ease-out

**Active (current page):** color → `--color-neutral-900`, weight 600, with 2px underline `--color-primary-500` at bottom

### Navigation CTA Buttons

- **Secondary:** "Sign In" — ghost style, `--text-sm`, weight 500
- **Primary:** "Get Started" — primary button, size `sm`
- Gap between them: `--space-3` (12px)

---

## Dropdown / Mega Menu

Used when a top-level nav item contains subcategories (e.g., "Platform", "Solutions").

| Property | Value |
|---|---|
| Trigger | Hover (200ms delay) + click on mobile |
| Background | `--color-neutral-0` |
| Border | 1px solid `--color-neutral-200` |
| Border radius | 12px |
| Box shadow | `0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)` |
| Padding | `--space-5` (20px) |
| Min width | 480px (mega) or 220px (simple dropdown) |
| Animation | fade + translateY(-8px → 0), 180ms ease-out |
| Position | below trigger, left-aligned to trigger or container edge |

**Dropdown item:**
- Icon: 20px, `--color-primary-500`, left-aligned
- Title: `--text-sm`, weight 600, `--color-neutral-900`
- Description: `--text-xs`, `--color-neutral-500`
- Hover: background `--color-primary-50`, border-radius 8px
- Padding: `--space-3` (12px)

---

## Mobile Navigation

On breakpoints below `lg` (1024px), the primary navigation collapses into a mobile drawer.

### Hamburger Toggle
- Size: 44px × 44px (touch target)
- Icon: 3-line hamburger (resting), animated X (open)
- Animation: lines morph into X over 250ms ease-in-out
- Position: right of logo, right-aligned

### Mobile Drawer
| Property | Value |
|---|---|
| Position | fixed, full height, right side |
| Width | 100% on mobile, 340px on tablet |
| Background | `--color-neutral-0` |
| Z-index | 1100 |
| Overlay | `rgba(0,0,0,0.4)` behind drawer |
| Animation | slide in from right, 280ms ease-out |
| Close | tap outside overlay, or X button |

**Drawer structure:**
- Logo + close button row at top (64px height)
- Divider
- Nav links as vertical list
  - Font: `--text-lg`, weight 500, `--color-neutral-800`
  - Item height: 52px
  - Divider between items: 1px `--color-neutral-100`
- Bottom section: secondary + primary buttons stacked, full-width

---

## Sidebar Navigation (Dashboard)

Used in the application dashboard.

| Property | Value |
|---|---|
| Width | 240px (expanded), 64px (collapsed) |
| Background | `--color-neutral-950` |
| Height | 100vh, sticky |
| Transition | width 250ms ease-in-out |
| Border right | 1px solid rgba(255,255,255,0.06) |

### Logo Area (top)
- Height: 64px
- Logo + product name in expanded state
- Logo icon only in collapsed state

### Nav Item (expanded)
| Property | Value |
|---|---|
| Height | 40px |
| Padding | 0 `--space-4` |
| Icon | 18px, `--color-neutral-400` |
| Icon-to-label gap | `--space-3` (12px) |
| Label | `--text-sm`, weight 500, `--color-neutral-400` |
| Border radius | 8px |
| Margin | 2px `--space-2` (left/right) |

**Active state:**
- Background: `rgba(99, 102, 241, 0.15)`
- Icon color: `--color-primary-400`
- Label color: `--color-primary-300`
- Left border accent: 2px solid `--color-primary-500`

**Hover state:**
- Background: rgba(255,255,255,0.05)
- Icon + label color: `--color-neutral-200`
- Transition: 150ms ease-out

### Section Labels in Sidebar
- Font: `--text-xs`, weight 600, `--color-neutral-600`, uppercase, letter-spacing +0.08em
- Margin above: `--space-6` (24px), margin below: `--space-2` (8px)

### Collapsed State
- Only icons visible, centered
- Tooltip appears on hover with label text (right-positioned)

---

## Breadcrumb Navigation

Used on deep pages to orient the user.

| Property | Value |
|---|---|
| Font size | `--text-sm` (14px) |
| Font weight | 400 |
| Color | `--color-neutral-400` |
| Active item | `--color-neutral-700`, weight 500 |
| Separator | `/` or `›`, `--color-neutral-300`, margin 0 `--space-2` |

---

## Tab Navigation

Used to switch between content panels within a page or section.

### Underline Tab (Default)

| Property | Value |
|---|---|
| Tab height | 40px |
| Font size | `--text-sm` (14px) |
| Font weight | 500 |
| Color (default) | `--color-neutral-500` |
| Color (active) | `--color-primary-600` |
| Active indicator | 2px bottom border, `--color-primary-500` |
| Container border | 1px bottom, `--color-neutral-200` |
| Tab gap | `--space-6` (24px) between tabs |

### Pill Tab (Alternative)

| Property | Value |
|---|---|
| Background (default) | transparent |
| Background (active) | `--color-primary-500` |
| Text (active) | white |
| Border radius | 6px |
| Padding | 6px 16px |
| Container bg | `--color-neutral-100` |
| Container border-radius | 8px |

---

## Navigation Rules

- The active state must be visible at all times. Never ambiguous.
- Navigation items must not have more than 7 items at the primary level. Past 7, reorganize.
- Never use navigation for decorative links (social icons belong in the footer, not main nav).
- Dropdown menus must close on Escape key press and when focus leaves.
- All navigation is keyboard-accessible via Tab and arrow keys.
- Mobile navigation must trap focus while open (no tabbing behind the overlay).
