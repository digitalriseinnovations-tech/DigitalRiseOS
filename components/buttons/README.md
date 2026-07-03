# Buttons Component

## Purpose

The Button component is the primary instrument of action across Digital Rise OS. It is used to trigger navigation, form submissions, modal openings, and all other user-initiated actions. Every interactive call-to-action on the site is rendered through this component.

Buttons carry hierarchy. Their visual weight must communicate their relative importance to the user without explanation.

---

## Variants

### `button--primary`
The highest-priority action. Used for the main conversion action within any given view. There should be at most one primary button visible in a single focal area at a time.

Examples: "Book a Demo", "Get Started Free", "Start My Free Audit"

### `button--secondary`
A supporting action. Used alongside a primary button when a secondary path is available, or as the sole button when the action is important but not the conversion goal.

Examples: "See How It Works", "Learn More", "View Pricing"

### `button--ghost`
A low-weight action. Used for tertiary paths, navigation-style actions, or destructive-confirmation cancellation.

Examples: "Cancel", "Sign In", "Maybe Later"

### `button--destructive`
Used exclusively for irreversible or high-consequence actions. Never used for routine navigation or non-harmful choices.

Examples: "Delete Account", "Remove Integration", "Cancel Subscription"

### `button--icon-only`
A button with no visible label — only an icon. Used in compact UI contexts (navigation controls, table row actions, sidebar items). Always accompanied by an `aria-label` and a hover tooltip.

### `button--cta-hero`
A specialised rendering of the primary button for use inside the Hero component only. Larger sizing, magnetic hover effect enabled, slightly elevated shadow treatment.

---

## Sizes

| Size Token | Height | H Padding | Font Size | Use Context |
|---|---|---|---|---|
| `xs` | 32px | 12px | 12px | Dense tables, compact UI |
| `sm` | 36px | 16px | 13px | Sidebar actions, inline controls |
| `md` | 44px | 24px | 14px | **Default — all standard uses** |
| `lg` | 52px | 32px | 16px | Section CTAs, feature areas |
| `xl` | 60px | 40px | 18px | Hero CTAs, final CTA section |

---

## States

### `default`
Resting state. No user interaction occurring.

### `hover`
User's cursor is over the button. Background color shifts to hover variant. Transition: 150ms ease-out.

### `active` / `pressed`
Button is being clicked or tapped. Scale compresses slightly (`scale(0.97–0.99)`). Transition: 80ms ease-in.

### `focus`
Button has keyboard focus. Focus ring appears: `0 0 0 2px white, 0 0 0 4px --color-primary-500`.

### `disabled`
Button is not interactive. Reduced opacity and color. Cursor: not-allowed. No hover or active effects apply.

### `loading`
An async action triggered by this button is in progress. Text is replaced by a spinner. Button width is locked. Click is suppressed.

### `success`
Action completed successfully. Brief state (1.5–2 seconds). Label changes to confirmation text (e.g., "Copied!"). Optional checkmark icon appears.

### `magnetic` (desktop only)
Active on `button--cta-hero` and `button--primary` in the final CTA section. Button follows the cursor within a defined radius. See Animations.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'icon-only' \| 'cta-hero'` | `'primary'` | Visual treatment |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `label` | `string` | required | Visible button text (not required for icon-only) |
| `href` | `string` | `null` | If provided, renders as an `<a>` tag. If null, renders as `<button>`. |
| `icon` | `string` | `null` | Lucide icon name. Placed leading (left) of label by default. |
| `iconPosition` | `'leading' \| 'trailing'` | `'leading'` | Position of icon relative to label |
| `disabled` | `boolean` | `false` | Puts button in disabled state |
| `loading` | `boolean` | `false` | Puts button in loading state |
| `fullWidth` | `boolean` | `false` | Button expands to 100% of its container width |
| `ariaLabel` | `string` | `null` | Required for icon-only buttons. Used as accessible label. |
| `magnetic` | `boolean` | `false` | Enables magnetic cursor tracking effect (desktop only) |
| `magneticRadius` | `number` | `80` | Pixels from button edge within which magnetic effect activates |
| `magneticMaxOffset` | `number` | `8` | Maximum px the button can shift in any direction |
| `onClick` | `function` | `null` | Callback when button is clicked (for `<button>` renders) |

---

## Animations

### Hover Transition
- Property: `background-color`, `border-color`, `color`
- Duration: `--duration-quick` (150ms)
- Easing: `--ease-out`

### Press / Active
- Property: `transform: scale(0.97–0.99)`
- Duration: `--duration-instant` (80ms)
- Easing: `--ease-in`

### Focus Ring
- Property: `box-shadow`
- Duration: `--duration-fast` (120ms)
- Easing: `--ease-out`

### Loading Spinner
- A circular SVG arc rotates 360° continuously
- Duration: 600ms, `linear`, `infinite`
- Spinner size: 16px (md), 18px (lg), 20px (xl)

### Success State
- Label text cross-fades: original label fades out (100ms), confirmation label fades in (150ms)
- Optional checkmark draws in via stroke-dashoffset: 200ms ease-out
- Reverts to default label after 2000ms

### Magnetic Effect (desktop only)
- On `mousemove` within `magneticRadius` px: calculate relative cursor offset from button center
- Apply `transform: translate(offsetX, offsetY)` — proportional to cursor distance
- Transition: none (follows cursor in real-time)
- On `mouseleave`: `transform: translate(0, 0)`, transition 300ms ease-out

### Reduced Motion
- Hover transitions retained at 50% duration (still communicate state)
- Magnetic effect completely disabled
- Loading spinner retained (communicates active state — not decorative)
- Success cross-fade replaced by instant label change

---

## Accessibility

- Buttons that navigate: render as `<a href>`. Buttons that trigger actions: render as `<button type="button">`. Submit buttons: `<button type="submit">`.
- Never use `<div>` or `<span>` as interactive buttons.
- Disabled buttons retain `aria-disabled="true"`. If the reason for disabling is non-obvious, a tooltip or helper text must explain it.
- Icon-only buttons must have `aria-label` describing the action.
- Loading state: `aria-busy="true"` on the button. The spinner has `role="status"` and a visually hidden label (e.g., "Loading...").
- All states must have distinct visible focus styles.
- Color is never the only differentiator between button variants in a group — shape, border, and label provide redundant cues.

---

## Responsive Behaviour

| Context | Mobile Behaviour |
|---|---|
| Hero CTA group | Both buttons full-width, stacked vertically. Primary first. |
| Section CTA | Primary button full-width. Secondary ghost button below, centered. |
| Button group (inline) | Stacks vertically on `sm`. Returns to inline on `md`+. |
| Form submit | Always full-width on `sm` and `md`. |
| Navigation CTA | Moves into mobile drawer on `sm`/`md`. |
| Icon-only (dashboard) | Size and touch target maintained at 44×44px. |

The magnetic effect is `pointer: coarse` device detection — automatically disabled when touch input is detected.
