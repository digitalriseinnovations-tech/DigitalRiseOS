# Animations Component

## Purpose

The Animations component is not a visual UI element — it is a library of reusable motion behaviours that are applied to other components. It centralises all animation logic so that timing, easing, and behaviour are consistent across the entire Digital Rise OS interface.

Every animation in this library has a defined purpose. Animations that exist purely for decoration are not included.

---

## Animation Categories

### 1. Entrance Animations
Elements that appear for the first time — either on page load or on scroll.

### 2. State Transition Animations
Visual changes that communicate a shift in component state (hover, focus, active, loading, success, error).

### 3. Layout Animations
Elements that move, expand, or collapse as part of a structural UI change (accordion, sidebar, drawer).

### 4. Attention Animations
Looping or pulsing animations that draw attention to a specific element. Used sparingly.

### 5. Data Animations
Animated numbers, progress bars, and chart fills that visualise the transition from one data state to another.

### 6. Page-Level Animations
Scroll-driven effects (parallax, scroll progress indicator) and page/route transitions.

---

## Animation Variants

### `animate--fade-in`
Fades an element from invisible to visible. No movement.

```
opacity: 0 → 1
Duration: --duration-slow (350ms)
Easing: --ease-out
```

Use: subtle reveals where movement would be distracting.

---

### `animate--fade-up`
The default scroll entrance. Fades in and rises slightly.

```
opacity: 0 → 1
transform: translateY(20px → 0)
Duration: --duration-slow (350ms)
Easing: --ease-out
```

Use: cards, sections, content blocks.

---

### `animate--fade-down`
Fades in and descends slightly. Used for elements appearing from above (dropdowns, tooltips above their triggers).

```
opacity: 0 → 1
transform: translateY(-8px → 0)
Duration: --duration-moderate (280ms)
Easing: --ease-out
```

Use: dropdown menus, top-positioned tooltips.

---

### `animate--fade-scale`
Fades in with a subtle scale increase. More energetic than fade-up.

```
opacity: 0 → 1
transform: scale(0.95 → 1)
Duration: --duration-slow (350ms)
Easing: --ease-out
```

Use: modals, hero product visuals, featured cards.

---

### `animate--stagger-group`
Applies a stagger delay to a list of elements so they appear sequentially rather than simultaneously.

```
Each child element inherits the parent's animation
Stagger delay: configurable (default 60ms per item)
Applied via CSS custom property or JS class application
```

Use: card grids, navigation dropdowns, feature lists, customer journey stages.

---

### `animate--slide-right`
Element slides in from the right. Used for drawers and panels entering from the right edge.

```
transform: translateX(100% → 0)
opacity: 0 → 1
Duration: --duration-moderate (280ms)
Easing: --ease-out
```

Use: mobile navigation drawer, right-side panels.

---

### `animate--slide-left`
Element slides in from the left.

```
transform: translateX(-100% → 0)
opacity: 0 → 1
Duration: --duration-moderate (280ms)
Easing: --ease-out
```

Use: left sidebar entrance.

---

### `animate--expand-height`
Element expands from zero height to its natural height. Used for accordions and inline reveal panels.

```
height: 0 → auto (via max-height or JS measurement)
opacity: 0 → 1
Duration: --duration-moderate (250ms)
Easing: --ease-out
```

Use: FAQ accordion, collapsible form sections, inline notifications.

---

### `animate--collapse-height`
Reverses `animate--expand-height`. Collapses element to zero height.

```
height: auto → 0
opacity: 1 → 0
Duration: --duration-base (180ms)
Easing: --ease-in
```

Note: always faster than expand — the asymmetry feels more natural.

---

### `animate--counter`
Counts a numeric value from 0 to a target value over a defined duration.

```
Value: 0 → targetValue
Duration: configurable (default 1200ms)
Easing: deceleration curve (cubic-bezier(0, 0, 0.2, 1))
Trigger: scroll entry (default) or mount
```

Use: stat strip counters, metric cards.

---

### `animate--progress-fill`
Fills a progress bar from 0% to its target percentage.

```
width or transform: scaleX — 0 → target%
Duration: 600ms–1200ms (scales with target value)
Easing: --ease-out
Trigger: scroll entry or mount
```

Use: dashboard progress bars, audit score bars.

---

### `animate--shimmer`
A looping shimmer effect that communicates a loading state.

```
background-position: -100% → 200%
Duration: 1500ms
Easing: linear
Loop: infinite
Color: --color-neutral-100 → --color-neutral-200 → --color-neutral-100
```

Use: skeleton loading states for cards, tables, stat cards.

---

### `animate--pulse`
A looping scale-and-opacity pulse. Used sparingly for attention-drawing.

```
transform: scale(1 → 1.3 → 1)
opacity: 1 → 0 → 1
Duration: 1500ms
Easing: ease-in-out
Loop: infinite
```

Use: dashboard hotspot indicators on the marketing preview.

---

### `animate--magnetic`
Tracks cursor position and moves the element toward it within a defined radius.

```
Behaviour: mousemove listener within radius → calculate relative offset → transform: translate(x, y)
Max offset: configurable (default 8px)
On mouseleave: transform: translate(0, 0), transition 300ms ease-out
```

Use: Hero CTA buttons, Final CTA buttons (desktop only).

---

### `animate--parallax`
Background elements scroll at a reduced rate relative to foreground content.

```
Scroll rate: 30–50% of page scroll speed
Property: transform: translateY
Trigger: scroll event listener
```

Use: Hero section background layers, decorative elements.

---

### `animate--draw-path`
SVG path draws itself in via `stroke-dashoffset` animation.

```
stroke-dashoffset: totalLength → 0
Duration: configurable (default 400ms)
Easing: --ease-out
```

Use: Customer Journey connecting line, checkbox checkmark, success state icons.

---

### `animate--cross-fade`
Two pieces of content cross-fade — one fades out as another fades in.

```
Outgoing: opacity 1 → 0, Duration: --duration-quick (150ms), --ease-in
Incoming: opacity 0 → 1, Duration: --duration-base (200ms), --ease-out, Delay: 150ms
```

Use: Industry Selector content panel, Dashboard tab switching, FAQ category switching.

---

## Global Animation Props

All animation variants accept these shared configuration props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | variant default | Duration in ms |
| `delay` | `number` | `0` | Delay before animation starts (ms) |
| `easing` | `string` | variant default | CSS easing function or token |
| `triggerOnScroll` | `boolean` | `true` | If true, animation waits for viewport entry |
| `scrollThreshold` | `number` | `0.1` | Fraction of element in viewport before triggering (0–1) |
| `playOnce` | `boolean` | `true` | If true, animation does not replay on scroll-back |
| `staggerDelay` | `number` | `60` | Per-child delay in ms (for stagger-group) |

---

## Accessibility

### `prefers-reduced-motion`

All animations must implement a `prefers-reduced-motion: reduce` media query or JavaScript check.

When reduced motion is preferred:

| Animation Category | Behaviour |
|---|---|
| Entrance animations | Elements visible immediately. No fade, no movement. |
| State transitions (hover, focus, active) | Instant changes. No transition. |
| Parallax | Disabled. Background is static. |
| Counter count-up | Value displays at final state immediately. |
| Progress bar fill | Bar appears at full percentage immediately. |
| Skeleton shimmer | Static background. No animation. |
| Pulse / attention animations | Disabled. |
| Magnetic effect | Disabled. |
| SVG path draw | Path fully visible immediately. |
| Cross-fade | Content switches instantly (no opacity transition). |
| Loading spinner | Retained — communicates active state. |
| Page transitions | Replaced with instant content swap. |

### Performance

- All animations use `transform` and `opacity` only. No animations on `width`, `height`, `top`, `left`, `margin`, or `padding`.
- `will-change: transform, opacity` applied to elements that will animate — removed after animation completes to free GPU memory.
- Scroll listeners are passive (`{ passive: true }`) and debounced where appropriate.
- `IntersectionObserver` is used for scroll-triggered animations (preferred over scroll event listeners for performance).
- Looping animations (shimmer, pulse, spinner) use CSS animations — not JavaScript — for GPU compositing.

---

## Responsive Behaviour

| Animation | Mobile Adaptation |
|---|---|
| `animate--magnetic` | Disabled — not applicable to touch |
| `animate--parallax` | Disabled — performance and vestibular concerns |
| `animate--fade-up` | Retained, reduced translate distance: `translateY(12px → 0)` |
| `animate--stagger-group` | Stagger delay reduced to 40ms (fewer items per row) |
| `animate--counter` | Retained — communicates credibility |
| `animate--shimmer` | Retained |
| `animate--slide-right` | Retained (drawer behaviour) |
| All others | Retained unless `prefers-reduced-motion` is active |
