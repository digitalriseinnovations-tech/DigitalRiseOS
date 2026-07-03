# Footer Component

## Purpose

The Footer component is the final structural element on every marketing page. It provides secondary navigation, legal information, brand reinforcement, and a last-chance conversion opportunity. It must feel complete and trustworthy — not an afterthought.

The footer is also a practical tool: it is where users navigate to policies, social profiles, support, and secondary pages they didn't find in the main navigation.

---

## Variants

### `footer--full`
The primary footer used on all marketing pages. Contains the brand column, navigation columns, and a bottom bar with legal links and copyright.

### `footer--minimal`
Used on focused conversion pages (audit form, demo booking, onboarding). Contains only the logo, copyright line, and essential legal links. No navigation columns. No social links. No distractions.

### `footer--app`
Used inside the authenticated dashboard. A thin bottom bar within the sidebar or below the main content. Contains version number, help link, and legal links only.

---

## Structure — `footer--full`

### Top Section: Pre-Footer CTA Band (optional)
A high-contrast strip immediately above the footer that presents the final conversion opportunity. Not always present — used when the page's Section 12 (Final CTA) is not used.

- Background: `--color-primary-500` or `gradient-brand`
- Contains: heading, subheading, primary + secondary CTA buttons

### Main Footer Body

**Column 1 — Brand Column (3 of 12 columns)**
- Logo
- Company tagline (1 line, `--text-sm`, `--color-neutral-400`)
- Social media icons (LinkedIn, Twitter/X, Instagram, YouTube — as applicable)
- Newsletter/email capture (optional): `form--inline-email` sub-component

**Column 2 — Platform (2 of 12 columns)**
- Heading: "Platform"
- Links: Lead Capture, AI Employee, CRM, Reviews, Automation, Analytics, Growth Audit

**Column 3 — Solutions (2 of 12 columns)**
- Heading: "Solutions"
- Links: by industry — Daycares, Medical, Dental, Contractors, Home Services, etc.

**Column 4 — Company (2 of 12 columns)**
- Heading: "Company"
- Links: About, Blog, Careers, Press, Partners, Contact

**Column 5 — Support (2 of 12 columns)**
- Heading: "Support"
- Links: Help Centre, Documentation, Status, Book a Demo, Free Growth Audit

### Bottom Bar
- Left: Copyright notice — "© 2025 Digital Rise OS. All rights reserved."
- Center (optional): Compliance badges or trust marks
- Right: Legal links — Privacy Policy, Terms of Service, Cookie Policy

---

## States

### `link--default`
Footer nav links at rest. Color: `--color-neutral-400`.

### `link--hover`
Footer nav links on hover. Color: `--color-neutral-100` (dark footer) or `--color-neutral-700` (light footer). Transition: 150ms ease-out.

### `social-icon--default`
Social icon at rest. Color: `--color-neutral-500`.

### `social-icon--hover`
Social icon on hover. Color: white (dark footer) or `--color-neutral-900` (light footer). Optional: brand-specific color (LinkedIn blue, etc.) — use sparingly to avoid visual noise.

### `footer--light` (modifier)
Footer uses a light background (`--color-neutral-50`) instead of dark. All text and icon colors invert accordingly. Used in specific contexts where a dark footer creates too heavy a contrast against the preceding section.

---

## Props

### `footer--full` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `'dark' \| 'light'` | `'dark'` | Background and color treatment |
| `showPreFooterCTA` | `boolean` | `false` | Whether to render the pre-footer CTA band |
| `preFooterCTA` | `object` | `null` | `{ heading, subheading, ctaPrimary, ctaSecondary }` |
| `showNewsletter` | `boolean` | `true` | Whether the brand column includes an email capture |
| `navigationColumns` | `array` | required | Array of column objects (see Column Object) |
| `socialLinks` | `array` | required | Array of `{ platform, href, icon }` |
| `legalLinks` | `array` | required | Array of `{ label, href }` |
| `copyrightYear` | `number` | current year | Year for copyright notice |
| `companyName` | `string` | `'Digital Rise OS'` | Company name in copyright |

### Footer Column Object

```
{
  heading: string,
  links: [
    {
      label: string,
      href: string,
      badge?: string    // e.g., "New" — small badge appended to link
    }
  ]
}
```

### `footer--minimal` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `legalLinks` | `array` | required | Array of `{ label, href }` |
| `copyrightYear` | `number` | current year | Year for copyright |
| `showLogo` | `boolean` | `true` | Whether the logo appears |

---

## Animations

### Section Entrance (scroll trigger)
- Footer enters as a unit: `opacity 0 → 1` + `translateY(20px → 0)`, 400ms ease-out
- Applied once as the footer scrolls into view
- Column content does not stagger — the footer appears as one block

### Link Hover
- Color transition: `--duration-quick` (150ms), `--ease-out`

### Social Icon Hover
- Color transition + optional `translateY(-2px)`: `--duration-quick` (150ms), `--ease-out`

### Pre-Footer CTA Entrance
- Separate from the footer — triggers earlier as the user approaches it
- Heading: `opacity 0 → 1` + `translateY(16px → 0)`, 400ms ease-out
- Subheading: same, 80ms delay
- Buttons: same, 160ms delay

### Reduced Motion
- No entrance animation. Footer and all elements are visible at rest.
- Hover transitions retained at 50% duration.

---

## Accessibility

- The footer is a `<footer>` landmark element.
- Navigation columns are each a `<nav aria-label="[Column Heading] navigation">`. If multiple nav elements exist, each must have a unique `aria-label`.
- Social media links open in a new tab: include `target="_blank"` and `rel="noopener noreferrer"`. Each link must have `aria-label="Digital Rise OS on [Platform]"`.
- The email capture form within the footer follows all form accessibility rules defined in the Forms component (visible label, error handling).
- The copyright line is a `<p>` element — not a heading.
- Legal links in the bottom bar are a flat `<ul>` list of `<a>` links, not navigation (they do not require a `<nav>` wrapper if grouped with the copyright line in a utility row).
- All link hover states are visible without relying on color alone (underline appears on hover or is always present).
- The pre-footer CTA band contains a heading (`<h2>`) for screen reader navigation.

---

## Responsive Behaviour

| Element | Desktop (lg+) | Tablet (md) | Mobile (sm) |
|---|---|---|---|
| Footer columns | 5 columns inline | 2-column grid | 1-column stacked (accordion optional) |
| Brand column | 3 of 12 cols | Full width, first | Full width, first |
| Nav columns | 2 cols each | 2 per row | Full width, stacked |
| Social icons | Inline row | Inline row | Inline row |
| Newsletter field | Inline (field + button) | Inline | Full-width stacked |
| Bottom bar | 3-part horizontal | 3-part horizontal | Stacked: copyright top, links below |
| Pre-footer CTA | Side-by-side (text + buttons) | Centered stack | Centered stack |

On `sm`, navigation columns may collapse into accordions if space is very constrained. The column heading becomes a tap target that reveals the links below. This is optional and depends on column count — if fewer than 3 columns remain on mobile, stacking without accordions is preferred.

Footer padding on `sm`: `--space-10` (40px) top, `--space-8` (32px) bottom.
