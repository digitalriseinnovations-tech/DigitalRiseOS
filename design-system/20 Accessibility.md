# 20 — Accessibility

## Philosophy

Accessibility is not a feature added at the end. It is a quality standard applied from the first decision. Building accessibly is building correctly. An interface that cannot be used by a blind user, a keyboard-only user, or a user with motor impairments is a broken interface — regardless of how it looks.

Digital Rise OS conforms to WCAG 2.1 Level AA as the minimum standard. Level AAA conformance is targeted wherever achievable without compromising design.

---

## Color and Contrast

### Minimum Contrast Ratios

| Text Type | Minimum Ratio | Target |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 | 7:1 |
| Large text (≥ 18pt or ≥ 14pt bold) | 3:1 | 4.5:1 |
| UI components (buttons, inputs, icons) | 3:1 | 4.5:1 |
| Placeholder text | 4.5:1 | — |
| Disabled UI | No requirement | — |

### Verified Contrast Pairs (Design System Tokens)

| Foreground | Background | Ratio | Pass Level |
|---|---|---|---|
| `--color-neutral-900` | `--color-neutral-0` | 17.4:1 | AAA |
| `--color-neutral-700` | `--color-neutral-0` | 9.7:1 | AAA |
| `--color-neutral-600` | `--color-neutral-0` | 7.0:1 | AAA |
| `--color-neutral-500` | `--color-neutral-0` | 4.6:1 | AA |
| white | `--color-primary-500` | 4.7:1 | AA |
| white | `--color-primary-600` | 6.5:1 | AA |
| `--color-primary-700` | `--color-neutral-0` | 7.2:1 | AAA |
| white | `--color-neutral-900` | 17.4:1 | AAA |

### Color Independence
Never convey information through color alone. Always pair with:
- An icon (check, warning triangle, ✕)
- A text label ("Error:", "Success:", "Required")
- A pattern or texture (for charts and data visualizations)

---

## Keyboard Navigation

Every interactive element must be operable with a keyboard alone.

### Focus Order
- Focus order must follow the visual reading order (top-left to bottom-right, top to bottom).
- Never remove focus indicators. Never use `outline: none` without replacing it with a custom focus style.
- Skip links: a "Skip to main content" link must be the first focusable element on every page. It is visually hidden but becomes visible on focus.

### Focus Style
All interactive elements must have a visible focus indicator meeting these minimums:

| Property | Value |
|---|---|
| Outline color | `--color-primary-500` |
| Outline width | 2px minimum |
| Outline offset | 2px–4px |
| Contrast of focus indicator | 3:1 against adjacent colors |

Custom focus ring implementation:
- Box shadow: `0 0 0 2px white, 0 0 0 4px --color-primary-500`
- This "double ring" technique ensures visibility on both light and dark backgrounds.

### Keyboard Interaction Patterns

| Component | Expected Keyboard Behavior |
|---|---|
| Button | `Enter` or `Space` to activate |
| Link | `Enter` to activate |
| Dropdown / Select | `Enter` or `Space` to open, `↑↓` to navigate, `Enter` to select, `Escape` to close |
| Modal | `Tab` cycles within modal only (focus trap), `Escape` to close |
| Accordion | `Enter` or `Space` to expand/collapse |
| Tabs | `Tab` to reach tab list, `←→` to navigate tabs, `Enter` to select |
| Checkbox | `Space` to toggle |
| Radio group | `Tab` to reach group, `←→` or `↑↓` to change selection |
| Date picker | Arrow keys to navigate calendar, `Enter` to select |
| Slider | `←→` to adjust value, `Home`/`End` for min/max |

### Focus Management

When content changes dynamically, focus must be managed:
- When a modal opens: focus moves to the modal container or first focusable element inside.
- When a modal closes: focus returns to the trigger element.
- When a dropdown opens: focus moves to first option.
- When a form error occurs: focus moves to the first error message or invalid field.
- When a new page loads (SPA): focus moves to the page `<h1>`.

---

## Semantic HTML

Use the correct HTML element for every purpose. Semantic HTML provides accessibility for free.

| Use Case | Correct Element | Incorrect (avoid) |
|---|---|---|
| Page heading | `<h1>`–`<h6>` | `<div class="heading">` |
| Navigation landmark | `<nav>` | `<div class="nav">` |
| Main content | `<main>` | `<div id="main">` |
| Lists | `<ul>/<ol>/<li>` | `<div>/<span>` for list items |
| Buttons (trigger action) | `<button>` | `<div onclick>`, `<a>` without href |
| Links (navigate to URL) | `<a href>` | `<button>` |
| Form labels | `<label for="id">` | `<span>` or placeholder only |
| Tables | `<table>`, `<th>`, `<td>` with `scope` | CSS grid visually mimicking a table |
| Inline quotes | `<q>` | `<span class="quote">` |
| Block quotes | `<blockquote>` | `<div class="quote">` |
| Images | `<img alt="...">` | Background CSS for content images |
| Icons (decorative) | `aria-hidden="true"` | No attribute |
| Icons (informative) | `aria-label` on parent | No label |

---

## ARIA

Use ARIA roles, states, and properties only when native HTML semantics are insufficient. ARIA supplements HTML — it does not replace it.

### Common ARIA Patterns

| Component | ARIA Implementation |
|---|---|
| Navigation | `<nav aria-label="Primary">` |
| Secondary nav | `<nav aria-label="Footer">` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal heading |
| Dropdown menu | `role="menu"`, `role="menuitem"`, `aria-expanded` on trigger |
| Tab panel | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` |
| Accordion | `aria-expanded` on trigger button, `aria-controls` on button, matching `id` on panel |
| Alert banner | `role="alert"` for critical messages (auto-announced by screen readers) |
| Status message | `role="status"` for non-critical updates (e.g., "Copied to clipboard") |
| Loading indicator | `aria-live="polite"` region announcing "Loading..." and completion |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Tooltip | `role="tooltip"`, `aria-describedby` on trigger |

### ARIA Do Not

- Do not use `role="presentation"` or `aria-hidden="true"` on elements that contain focusable children.
- Do not use `tabindex` values greater than 0 — this disrupts natural focus order.
- Do not use `aria-label` to override visible text that already conveys the correct meaning.

---

## Images and Media

### Images
- All `<img>` elements require `alt` attribute.
- Descriptive alt text: describe the content and context, not the appearance.
  - Wrong: `alt="image1.jpg"`
  - Wrong: `alt="photo of a laptop"`
  - Correct: `alt="A dashboard view showing weekly growth metrics and AI content suggestions"`
- Decorative images: `alt=""` (empty string — not missing, not a space).
- Complex charts/infographics: provide a text description or data table as an alternative.

### Video
- Provide captions (synchronized, accurate) for all spoken content.
- Provide transcripts for all video content.
- Audio descriptions for important visual-only content in video.
- Autoplay is never used. User controls are always visible.

---

## Motion and Animation

- All animations must have a `prefers-reduced-motion` fallback.
- When `prefers-reduced-motion: reduce` is active:
  - All decorative animations stop.
  - Scroll animations are skipped (content appears immediately).
  - Parallax effects are disabled.
  - State-change animations (hover, focus) may continue at reduced intensity.
- Never use flashing content that strobes faster than 3 times per second (seizure risk).

---

## Forms and Error Handling

- Every input has a visible, persistent label (not just a placeholder).
- Required fields are indicated visually and programmatically (`aria-required="true"`).
- Error messages are programmatically associated with the relevant input (`aria-describedby`).
- Error summary appears at the top of the form when submitting with errors, and links to each error field.
- Success state is announced to screen readers via an `aria-live` region.
- Never rely solely on color to indicate an error.

---

## Testing Checklist

Before shipping any component or page, verify:

**Automated:**
- [ ] Run axe or Lighthouse accessibility audit — zero critical violations
- [ ] Color contrast checked for all text and UI components

**Manual:**
- [ ] Tab through all interactive elements — logical order, visible focus on every element
- [ ] Activate all buttons and links with keyboard only (Enter/Space)
- [ ] Navigate dropdowns, modals, and tabs with keyboard only
- [ ] Test with screen reader (NVDA + Firefox on Windows, VoiceOver + Safari on Mac/iOS)
- [ ] All images have meaningful alt text
- [ ] All form fields have visible labels
- [ ] All error states are announced by screen reader
- [ ] Resize text to 200% — layout does not break or overflow
- [ ] Test with `prefers-reduced-motion: reduce` active — no essential animations

---

## Accessibility Resources

| Resource | Purpose |
|---|---|
| WCAG 2.1 | The official standard — reference for all conformance decisions |
| WAI-ARIA Authoring Practices | Keyboard interaction patterns for complex widgets |
| axe DevTools | Browser extension for automated accessibility testing |
| NVDA | Free Windows screen reader for testing |
| VoiceOver | Built-in macOS/iOS screen reader |
| Colour Contrast Analyser | Desktop tool for precise contrast ratio measurement |
