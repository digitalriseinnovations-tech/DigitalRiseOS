# Hero Component

## Purpose

The Hero component is the first thing every visitor sees. It has one job: communicate the platform's value proposition with enough clarity and impact that the user immediately understands what Digital Rise OS is, who it is for, and what to do next.

The hero must establish brand premium, communicate outcome (not feature), and present the primary conversion action within the first viewport. It carries the most visual weight of any component on the homepage.

---

## Variants

### `hero--homepage`
The full primary hero for the Digital Rise OS homepage. Two-column layout on desktop: headline, subheadline, trust signals, and dual CTAs on the left; large product visual (dashboard or UI screenshot) on the right.

### `hero--interior`
Used on sub-pages (e.g., Platform page, Industry pages). Centered single-column layout. Headline, subheading, and optional single CTA. No product visual. More compact vertical padding.

### `hero--audit`
Used on the Growth Audit landing page. Centered layout with a form or strong single CTA. Dark background. High urgency.

### `hero--dark`
Homepage hero variant with a dark (navy or gradient) background instead of white. Used for seasonal campaigns or A/B testing.

---

## States

### `default`
Page has just loaded. All hero elements are in their initial (pre-animation) state: invisible / slightly translated down.

### `animated-in`
All elements have completed their entrance animations. The hero is fully visible and interactive.

### `video-playing`
Applies only if the hero visual includes an optional background or inline video. Video is actively playing.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'homepage' \| 'interior' \| 'audit' \| 'dark'` | `'homepage'` | Controls layout, background, and visual treatment |
| `headline` | `string` | required | Primary H1 text. Should be 6–10 words maximum. |
| `subheadline` | `string` | required | Supporting body text. Maximum 2 lines / 25 words. |
| `ctaPrimary` | `object` | required | `{ label: string, href: string }` |
| `ctaSecondary` | `object` | `null` | `{ label: string, href: string }` — optional second CTA |
| `trustLine` | `string` | `null` | Short text below CTAs: e.g., "No credit card required · Setup in 2 minutes" |
| `visual` | `object` | `null` | `{ type: 'image' \| 'video', src: string, alt: string }` |
| `eyebrow` | `string` | `null` | Optional overline text above the headline (e.g., "AI GROWTH PLATFORM") |
| `background` | `'white' \| 'dark' \| 'gradient'` | `'white'` | Background treatment |
| `parallaxEnabled` | `boolean` | `true` | Whether the background parallax effect is active |
| `magneticCTA` | `boolean` | `true` | Whether CTA buttons use the magnetic hover effect |

---

## Animations

All hero animations trigger on page load, not on scroll. They execute in sequence using staggered delays.

### Element Entrance Sequence

| Element | Animation | Delay | Duration | Easing |
|---|---|---|---|---|
| Eyebrow label | `opacity 0→1` + `translateY(12px→0)` | 0ms | 400ms | ease-out |
| Headline (H1) | `opacity 0→1` + `translateY(20px→0)` | 80ms | 500ms | ease-out |
| Subheadline | `opacity 0→1` + `translateY(16px→0)` | 180ms | 450ms | ease-out |
| CTA buttons | `opacity 0→1` + `translateY(12px→0)` | 260ms | 400ms | ease-out |
| Trust line | `opacity 0→1` | 360ms | 350ms | ease-out |
| Product visual | `opacity 0→1` + `scale(0.96→1)` | 120ms | 600ms | ease-out |

### Parallax (Background Layer)
- Background decorative elements move at 30–40% of scroll speed
- Applies only to non-content background layers
- Transition: `transform` only — no layout properties
- Disabled when `prefers-reduced-motion: reduce` is active

### Magnetic CTA Buttons
- On mouse enter: button begins tracking cursor position
- On mouse move within 80px: button shifts toward cursor — max offset 8px
- On mouse leave: button returns to resting position, 300ms ease-out
- Desktop only — disabled on touch devices

### Reduced Motion
- When `prefers-reduced-motion: reduce`: all entrance animations are disabled. Elements are visible immediately in their resting state.

---

## Accessibility

- The headline is always the page's `<h1>`. There is exactly one `<h1>` per page.
- The product visual `<img>` must have a descriptive `alt` attribute (e.g., `alt="Digital Rise OS dashboard showing lead capture, AI follow-up, and booking analytics"`).
- CTA buttons must have sufficient color contrast (white text on `--color-primary-500` meets WCAG AA).
- The trust line is informational text, not a functional element — no ARIA role needed.
- CTA buttons are `<a>` tags when linking to URLs, `<button>` elements when triggering an action (e.g., opening a modal).
- The eyebrow label has `aria-hidden="true"` if it is purely decorative and the headline communicates the same intent.
- Animations do not rely on motion to convey information — all content is accessible before and after animation.

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| `sm` (375px) | Single column. Headline first, product visual below, CTAs after visual. Headline: `clamp(1.875rem, 6vw, 3rem)`. |
| `md` (768px) | Single column, wider. Visual scales up. CTAs inline. |
| `lg` (1024px) | Two-column layout activates. Headline + CTAs left (5 of 12 cols), visual right (7 of 12 cols). |
| `xl` (1280px) | Two-column, more horizontal breathing room. Visual may be larger. |
| `2xl` (1440px) | Constrained to max container. Headline can reach `--text-7xl` (72px). |

### Mobile-Specific Rules
- Product visual is placed below the text on mobile (text is always above the fold).
- Both CTA buttons are full-width and stacked on `sm`. Primary button appears first.
- Trust line appears below the secondary CTA.
- Magnetic button effect is disabled — not applicable to touch.
- Parallax is disabled on mobile (performance and motion concerns).
