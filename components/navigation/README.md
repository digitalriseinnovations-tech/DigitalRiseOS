# Navigation Component

## Purpose

The Navigation component is the persistent top-level wayfinding system for Digital Rise OS. It anchors every marketing page and the application dashboard. It communicates brand identity, provides access to all primary sections of the site, and always presents the primary conversion action (Book Demo) in view regardless of scroll position.

The navigation must remain usable, unobtrusive, and visually stable at every scroll depth and on every device.

---

## Variants

### `navigation--marketing`
The primary navigation for all public-facing marketing pages. Contains the logo, primary nav links, and two CTA buttons.

**Structure (left to right):**
1. Logo (links to homepage)
2. Primary links: Solutions, Platform, Industries, Resources, Pricing, About, Contact
3. Actions: "Sign In" (ghost) + "Book Demo" (primary button)

### `navigation--dashboard`
Used inside the authenticated application. Replaces marketing links with user account controls.

**Structure:**
1. Logo + product name (left)
2. Global search (center, optional)
3. Notifications icon, Help icon, User avatar (right)

### `navigation--minimal`
Used on focused pages (e.g., audit form, checkout, onboarding). Logo only — no nav links, no distractions.

---

## States

### `default`
Transparent or very light background. Full height (64px). All links and CTAs visible.

### `scrolled`
Activated after the user scrolls past 80px. Background transitions from transparent to `--color-neutral-0` with `backdrop-filter: blur(8px)`. Box shadow appears below the bar.

### `mobile-closed`
The mobile navigation drawer is hidden. Hamburger icon is visible. All nav links are hidden.

### `mobile-open`
The mobile navigation drawer is fully open. Overlay covers the page behind it. Focus is trapped inside the drawer. Hamburger icon has transitioned to a close (×) icon.

### `dropdown-open`
A navigation item with sub-links (e.g., "Solutions", "Platform") has its dropdown panel visible.

### `active-link`
The nav link corresponding to the current page is visually highlighted with a different text color and a 2px underline accent in `--color-primary-500`.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'marketing' \| 'dashboard' \| 'minimal'` | `'marketing'` | Controls which navigation layout renders |
| `theme` | `'light' \| 'dark'` | `'light'` | Sets the initial color scheme of the nav (dark when placed over a dark hero) |
| `activeLink` | `string` | `null` | The `href` of the currently active page — used to set the active-link state |
| `ctaPrimary` | `object` | `{ label: 'Book Demo', href: '/book-demo' }` | Label and destination of the primary CTA button |
| `ctaSecondary` | `object` | `{ label: 'Sign In', href: '/login' }` | Label and destination of the secondary ghost CTA |
| `stickyOnScroll` | `boolean` | `true` | Whether the nav becomes sticky and gains a background on scroll |
| `scrollThreshold` | `number` | `80` | Pixels scrolled before the `scrolled` state activates |
| `links` | `array` | See Variants | Array of nav link objects: `{ label, href, dropdown? }` |

### Dropdown Link Object
```
{
  label: string,
  href: string,
  dropdown: [
    {
      label: string,
      description: string,
      href: string,
      icon: string   // Lucide icon name
    }
  ]
}
```

---

## Animations

### Scroll State Transition
- Property: `background-color`, `box-shadow`, `backdrop-filter`
- Duration: `--duration-base` (200ms)
- Easing: `--ease-out`
- Trigger: `scrollY > scrollThreshold`

### Mobile Drawer Open
- Overlay: `opacity 0 → 0.4`, `--duration-moderate` (280ms), `--ease-out`
- Drawer: `transform: translateX(100% → 0)`, `--duration-moderate` (280ms), `--ease-out`

### Mobile Drawer Close
- Overlay + Drawer reverse, at `--duration-quick` (150ms), `--ease-in`

### Hamburger to Close Icon
- Lines morph into × via rotation and opacity
- Duration: 250ms, `--ease-in-out`

### Dropdown Open
- `opacity 0 → 1`, `transform: translateY(-8px → 0)`
- Duration: `--duration-moderate` (280ms), `--ease-out`
- Stagger children: 20ms per item

### Dropdown Close
- `opacity 1 → 0`, `transform: translateY(0 → -4px)`
- Duration: `--duration-quick` (150ms), `--ease-in`

---

## Accessibility

- The `<nav>` element must have `aria-label="Primary"`.
- The logo link must have `aria-label="Digital Rise OS — Home"`.
- The mobile menu toggle button must have `aria-expanded` (true/false) and `aria-controls` pointing to the drawer `id`.
- The mobile drawer must have `role="dialog"` and `aria-modal="true"` when open.
- Focus must be trapped inside the open mobile drawer. Escape key closes the drawer and returns focus to the hamburger button.
- Dropdown triggers must have `aria-expanded` and `aria-haspopup="true"`.
- Dropdown panels must have `role="menu"` with `role="menuitem"` on each option.
- Keyboard: arrow keys navigate dropdown items. Escape closes dropdown and returns focus to trigger.
- Skip navigation: a visually hidden "Skip to main content" link must be the first focusable element on the page, before the nav.
- All interactive elements have visible focus styles using the system focus ring.

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| `sm` (375px) | Hamburger menu only. Logo left, hamburger right. Drawer full-width. |
| `md` (768px) | Hamburger menu only. Logo left, hamburger right. Drawer 340px wide from right. |
| `lg` (1024px) | Full inline navigation. All links visible. CTAs visible. |
| `xl` (1280px) | Full inline navigation with more whitespace between links. |
| `2xl` (1440px) | Full inline navigation, constrained within max-width container. |

At `lg`+ the mobile drawer is always hidden (display: none), regardless of state.
At `sm` / `md` the inline nav links are always hidden — they exist only inside the drawer.
