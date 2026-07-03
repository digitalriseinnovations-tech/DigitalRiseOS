# 12 — Motion System

## Philosophy

Motion in Digital Rise OS communicates — it does not perform. Every animation has a job: guiding attention, confirming state changes, expressing hierarchy, or reducing perceived wait time. If an animation has no job, it is removed.

Motion should feel like the interface breathing — natural, purposeful, and never distracting.

---

## Core Motion Principles

1. **Purposeful.** Every animation explains something: what changed, what is available, what is happening.
2. **Fast.** The interface should feel instantaneous. Animations support that feeling — they never slow it down.
3. **Consistent.** Same interaction type = same animation signature across the entire system.
4. **Interruptible.** Any in-progress animation can be stopped by user input without breaking state.
5. **Accessible.** All animations respect `prefers-reduced-motion`. When that preference is active, all non-essential motion is removed.

---

## Duration Scale

| Token | Duration | Use |
|---|---|---|
| `--duration-instant` | 80ms | State confirmations, pressed states |
| `--duration-fast` | 120ms | Micro interactions (toggles, checkboxes) |
| `--duration-quick` | 150ms | Hover state changes, color transitions |
| `--duration-base` | 200ms | Default UI transitions |
| `--duration-moderate` | 280ms | Component entrances, panel reveals |
| `--duration-slow` | 350ms | Modal and dialog appearances |
| `--duration-deliberate` | 500ms | Page-level transitions, complex reveals |
| `--duration-cinematic` | 700ms–1000ms | Hero animations, brand moments (rare) |

**Rule:** UI animations should almost always fall between 150ms and 350ms. Anything slower feels sluggish. Anything faster feels imperceptible.

---

## Easing Functions

| Token | CSS Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen. Starts fast, decelerates to rest. |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen. Starts slow, accelerates out. |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Elements moving across the screen. |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default for most UI transitions. More physical feel. |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounce on completions and successes. Use sparingly. |
| `--ease-linear` | `linear` | Looping animations (spinners, progress bars). |

---

## Animation Patterns by Interaction Type

### Hover States
- Property: `background-color`, `border-color`, `color`, `box-shadow`
- Duration: `--duration-quick` (150ms)
- Easing: `--ease-out`
- Never animate `transform` on hover alone — only on press/click.

### Press / Active States
- Property: `transform: scale(0.97–0.99)`, `background-color`
- Duration: `--duration-instant` (80ms)
- Easing: `--ease-in`
- The element compresses slightly toward the touch point.

### Focus States
- Property: `box-shadow` (focus ring appears)
- Duration: `--duration-fast` (120ms)
- Easing: `--ease-out`

### Toggle / Switch
- Property: `transform: translateX()` (thumb), `background-color` (track)
- Duration: `--duration-fast` (120ms) to `--duration-base` (200ms)
- Easing: `--ease-spring` for the thumb (adds physicality)

### Checkbox / Radio
- Property: `opacity`, `stroke-dashoffset` (check draw-in)
- Duration: `--duration-fast` (120ms)
- Easing: `--ease-out`

### Dropdown / Menu Open
- Property: `opacity 0→1`, `transform: translateY(-8px → 0)`
- Duration: `--duration-moderate` (280ms)
- Easing: `--ease-out`
- Stagger children: 20ms per item, starting at 60ms

### Dropdown / Menu Close
- Property: `opacity 1→0`, `transform: translateY(0 → -4px)`
- Duration: `--duration-quick` (150ms)
- Easing: `--ease-in`
- Closes faster than it opens.

### Modal / Dialog Open
- Overlay: `opacity 0→1`, `--duration-moderate` (280ms), `--ease-out`
- Panel: `opacity 0→1`, `transform: scale(0.95→1) translateY(8px→0)`, `--duration-slow` (350ms), `--ease-out`

### Modal / Dialog Close
- Reverse of open, at 60% of open duration.

### Tooltip
- Open: `opacity 0→1`, `transform: translateY(4px→0)`, `--duration-fast` (120ms)
- Delay before showing: 400ms (prevents tooltips flashing on accidental hover)
- Close: `opacity 1→0`, `--duration-fast` (120ms), no delay

### Page / Route Transition
- Exit: `opacity 1→0`, `--duration-fast` (150ms)
- Enter: `opacity 0→1`, `transform: translateY(8px→0)`, `--duration-moderate` (280ms), `--ease-out`

---

## Scroll-Triggered Animations

Elements that animate into view on scroll.

| Property | Value |
|---|---|
| Default entrance | `opacity 0→1`, `translateY(20px→0)` |
| Duration | `--duration-slow` (350ms) |
| Easing | `--ease-out` |
| Trigger threshold | Element is 10% in viewport |
| Stagger for lists | 60ms per item |
| Play once | Yes — do not replay on scroll back |

**Reduced motion fallback:** Skip animation, show element immediately.

---

## Loading States

### Skeleton Screen
- Shimmer animation: `background-position` shifts from -100% to 200%
- Duration: 1.5s linear infinite
- Color range: `--color-neutral-100` → `--color-neutral-200` → `--color-neutral-100`

### Spinner
- Animation: `rotate(360deg)` on a circular SVG arc
- Duration: 600ms linear infinite
- Size: follows `--icon-sm` to `--icon-lg` sizing

### Progress Bar
- Animation: `width` transitions from 0 to target %
- Duration: matches actual progress — not fake
- Easing: `--ease-out`

---

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Remove all `transform` and `opacity` entrance animations.
- Remove scroll-triggered animations (show all content immediately).
- Remove parallax effects.
- Retain state-change animations (hover, focus, active) at 50% duration — they communicate meaning.
- Retain spinner animations (necessary to communicate loading).
- Retain progress animations.

---

## Motion Rules

- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. These cause layout recalculation. Always use `transform` and `opacity`.
- Never start an animation that the user cannot stop.
- Never loop a decorative animation indefinitely where the user has no way to pause it.
- Never chain more than 3 sequential animations without user intent.
- Do not use motion to mask poor performance. Fix the underlying issue.
