# Forms Component

## Purpose

The Forms component library provides all input, selection, and submission elements used across Digital Rise OS. Forms appear in three primary contexts: the AI Growth Audit lead capture (homepage Section 08), the Book a Demo flow, and the authenticated application settings and onboarding.

Forms are the highest-friction interaction on any page. Every decision — label placement, field order, error messaging, and button copy — directly affects conversion rate.

---

## Variants

### `form--audit`
The AI Growth Audit lead capture form. 5–6 fields. Collects name, business name, industry, email, phone. Inline on the homepage (dark background section) or on a dedicated `/growth-audit` page. High-stakes — the primary lead magnet.

### `form--demo`
The "Book a Demo" form. May integrate with a calendar tool (e.g., Calendly embed) or collect basic details before connecting to a scheduling step. Fields: name, email, company, team size.

### `form--login`
Authentication form. Email + password fields. Includes "Forgot password" link and a divider with social login options.

### `form--signup`
New user registration form. Name, email, password (with strength meter). Checkbox for terms of service.

### `form--onboarding`
Multi-step onboarding form inside the dashboard. Uses a step indicator. 3–5 steps collecting business setup information.

### `form--settings`
Used inside the dashboard for account, billing, and integration settings. Multiple sections of form fields grouped with section headings.

### `form--inline-email`
A compact single-field email capture form. Used in the footer and within the Resources section. Email input + submit button side by side.

---

## Sub-Components

### `field--text`
Standard single-line text input with label, optional helper text, optional icon, and error state.

### `field--textarea`
Multi-line text input. Vertically resizable.

### `field--select`
Custom-styled dropdown select. Supports single selection with an options panel.

### `field--search`
Text input specialised for search. Includes a search icon on the left and an optional clear button.

### `field--phone`
Phone number input with optional country code selector prefix.

### `field--password`
Password input with show/hide toggle. Optional strength meter below the field.

### `field--checkbox`
Single checkbox with label. Used for terms, preferences, and optional features.

### `field--radio-group`
A group of radio buttons for mutually exclusive selection. Includes a group label above.

### `field--toggle`
A switch/toggle component for binary on/off settings.

### `field--file`
File upload input. Drag-and-drop area with fallback click-to-browse.

### `form__label`
The visible field label. Always rendered above the field.

### `form__helper`
Secondary text below a field. Shown when no error is present.

### `form__error`
Error message below a field. Replaces helper text when the field is in an error state.

### `form__step-indicator`
Used in multi-step forms. Shows current step and total steps. Can be numeric or a segmented progress bar.

### `form__section-heading`
A dividing heading used in long forms to group related fields.

---

## States

### `field--default`
Resting state. Border: `--color-neutral-200`.

### `field--hover`
Cursor over the field. Border: `--color-neutral-300`.

### `field--focus`
Field has keyboard or click focus. Border: `--color-primary-500`, shadow ring `0 0 0 3px rgba(99,102,241,0.15)`.

### `field--filled`
Field contains a value but is not focused. Border: `--color-neutral-300`.

### `field--error`
Field has failed validation. Border: `--color-error-500`, background: `--color-error-50`. Error message visible below.

### `field--disabled`
Field is not editable. Background: `--color-neutral-100`, border: `--color-neutral-200`, text: `--color-neutral-400`. Cursor: not-allowed.

### `field--loading`
Field is in a loading state (e.g., async validation). Right-side spinner visible.

### `form--submitting`
The form's submit button is in loading state. All fields are locked (non-interactive) while submission is in progress.

### `form--success`
Submission was successful. Form may be replaced by a success message or a next-step prompt.

### `form--error`
Submission failed. An error banner appears at the top of the form. Individual field errors are shown where applicable.

---

## Props

### Shared Field Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | required | Unique ID linking label to input |
| `name` | `string` | required | Form field name (for submission) |
| `label` | `string` | required | Visible label text |
| `value` | `string` | `''` | Controlled value |
| `placeholder` | `string` | `null` | Placeholder text (supplement to label, not a replacement) |
| `required` | `boolean` | `false` | Marks field as required |
| `disabled` | `boolean` | `false` | Disables the field |
| `helperText` | `string` | `null` | Text shown below field when no error is present |
| `error` | `string` | `null` | Error message text. Presence triggers error state. |
| `onChange` | `function` | required | Callback receiving new value |
| `onBlur` | `function` | `null` | Callback on field blur (triggers validation) |

### `field--select` Additional Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `array` | required | Array of `{ value, label }` objects |
| `emptyLabel` | `string` | `'Select an option'` | Placeholder option label |

### `field--password` Additional Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `showStrength` | `boolean` | `false` | Renders a password strength meter below the field |
| `showToggle` | `boolean` | `true` | Show/hide toggle in the input |

### `form--audit` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSubmit` | `function` | required | Callback receiving form data object |
| `submitLabel` | `string` | `'Get My Free Growth Audit'` | Submit button label |
| `trustLine` | `string` | `'No credit card. No obligation. Results in 24 hours.'` | Text below submit button |
| `industries` | `array` | required | Options for the industry select field |

### `form--onboarding` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `array` | required | Array of step objects `{ title, fields[] }` |
| `currentStep` | `number` | `0` | Current active step index |
| `onNext` | `function` | required | Advances to next step |
| `onBack` | `function` | required | Returns to previous step |
| `onComplete` | `function` | required | Called when final step is submitted |

---

## Animations

### Focus Transition
- Border color + box shadow: `--duration-quick` (150ms), `--ease-out`

### Error State Entrance
- Error message: `opacity 0 → 1` + `translateY(-4px → 0)`, `--duration-fast` (120ms), `--ease-out`
- Field border: color change, `--duration-fast` (120ms)

### Form Error Banner Entrance
- `opacity 0 → 1` + `translateY(-8px → 0)`, `--duration-moderate` (280ms), `--ease-out`
- Focus shifts to the banner after it appears

### Success Message
- Form fields fade out: `opacity 1 → 0`, 200ms ease-in
- Success content fades in: `opacity 0 → 1` + `scale(0.96 → 1)`, 350ms ease-out, 200ms delay

### Password Strength Meter
- Width of fill bar transitions from 0 to calculated width as user types
- Color transitions between red, amber, and green at strength thresholds
- Duration: `--duration-base` (200ms), `--ease-out`

### Step Transition (multi-step form)
- Exiting step: `opacity 1 → 0` + `translateX(0 → -20px)`, 180ms ease-in
- Entering step: `opacity 0 → 1` + `translateX(20px → 0)`, 280ms ease-out, 180ms delay

### Reduced Motion
- All transitions replaced with instant state changes
- Step transitions replaced with immediate content swap (no movement)

---

## Accessibility

- Every input has a `<label>` with a `for` attribute matching the input's `id`. Labels are never hidden.
- Required fields have `required` attribute on the input AND a visual asterisk (*) with a visually hidden "(Required)" label.
- Error messages are linked to their fields via `aria-describedby`. When an error appears, `aria-invalid="true"` is set on the input.
- On form submission with errors: focus moves to the first invalid field or an error summary at the top of the form.
- The error summary links to each invalid field by `id`.
- Multi-step forms: each step has a heading (`<h2>` or `<h3>`) labelling the step. Step indicator communicates progress via `aria-label` (e.g., "Step 2 of 4").
- File inputs: drag-and-drop zone has `role="region"` and `aria-label`. The fallback browse button is a visible `<button>`.
- Toggles/switches: `role="switch"`, `aria-checked`, and a visible label.
- All form field state changes (focus, error, success) are perceivable without relying on color alone.

---

## Responsive Behaviour

| Context | Mobile Behaviour |
|---|---|
| All fields | Full-width on `sm` and `md` |
| Two-column field rows | Stack to single column on `sm` |
| Submit button | Full-width on `sm` and `md` |
| `form--inline-email` | Input and button stack vertically on `sm` |
| `form--onboarding` | Step indicator becomes compact (numeric) on `sm` |
| `field--select` options panel | Bottom sheet on `sm` (not inline popup) |
| Form cards | Padding reduces from 32px to 20px on `sm` |

Font size for all input fields is minimum `16px` to prevent iOS Safari from auto-zooming on focus.
