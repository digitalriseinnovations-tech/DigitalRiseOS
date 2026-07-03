# 07 — Forms

## Philosophy

Forms are where user intent becomes action. They must be frictionless, clear, and forgiving. Good form design reduces hesitation, makes errors recoverable, and makes completion feel natural.

---

## Form Layout

### Single-Column Default
All forms default to single-column layout. Two-column layouts are permitted only for short, closely related fields (e.g., First Name / Last Name).

- Max width for a standalone form: 480px
- Max width for inline marketing forms (e.g., email signup): 560px
- Padding around a form card: `--space-8` (32px)

### Vertical Rhythm
- Gap between form fields: `--space-5` (20px)
- Gap between form sections (grouped fields): `--space-8` (32px)
- Gap between the last field and the submit button: `--space-6` (24px)

---

## Input Field

The standard text input field.

| Property | Value |
|---|---|
| Height | 44px |
| Font size | `--text-base` (16px) — prevents iOS zoom |
| Font weight | 400 |
| Text color | `--color-neutral-900` |
| Placeholder color | `--color-neutral-400` |
| Background | `--color-neutral-0` (white) |
| Border | 1.5px solid `--color-neutral-200` |
| Border radius | 8px |
| Padding | 12px 16px |

**States:**

| State | Border Color | Background | Notes |
|---|---|---|---|
| Default | `--color-neutral-200` | `--color-neutral-0` | Resting state |
| Hover | `--color-neutral-300` | `--color-neutral-0` | Indicates interactivity |
| Focus | `--color-primary-500` | `--color-neutral-0` | 2px, outline-offset: 0 |
| Filled | `--color-neutral-300` | `--color-neutral-0` | Has value, not focused |
| Error | `--color-error-500` | `--color-error-50` | With error message below |
| Disabled | `--color-neutral-200` | `--color-neutral-100` | Not editable, lower opacity |

Transition on all interactive states: `border-color 150ms ease-out, box-shadow 150ms ease-out`

Focus shadow: `0 0 0 3px rgba(99, 102, 241, 0.15)`

---

## Textarea

Same visual properties as the text input, with these additions:

- Min height: 120px
- Resize: vertical only
- Scrollbar visible when content exceeds height
- Padding: 12px 16px (all sides)

---

## Field Labels

Every input must have a visible label. Placeholder text is not a substitute for a label.

| Property | Value |
|---|---|
| Font size | `--text-sm` (14px) |
| Font weight | 500 |
| Color | `--color-neutral-700` |
| Margin below label | `--space-1.5` (6px) |
| Position | Above the input |

**Required field indicator:**
- Append an asterisk (*) in `--color-error-500` after the label text
- Include "(Required)" in a visually hidden `<span>` for screen readers

---

## Helper Text

Additional context below a field. Appears before any error state.

- Font size: `--text-xs` (12px)
- Font weight: 400
- Color: `--color-neutral-400`
- Margin above: `--space-1.5` (6px)

---

## Validation and Error Messages

Error messages appear below the field, replacing helper text.

| Property | Value |
|---|---|
| Font size | `--text-xs` (12px) |
| Font weight | 500 |
| Color | `--color-error-600` |
| Icon | 14px error icon, left of text |
| Margin above | `--space-1.5` (6px) |

**Validation timing:**
- Validate on blur (when the user leaves the field), not on keystroke.
- Exception: password strength meter updates on keystroke.
- On form submission, all errors surface simultaneously and focus moves to the first error.

---

## Select / Dropdown

| Property | Value |
|---|---|
| Appearance | Custom styled (native select as fallback) |
| Height | 44px |
| Font size | `--text-base` (16px) |
| Padding | 12px 40px 12px 16px |
| Chevron icon | 16px, right-aligned, `--color-neutral-400` |
| Border, radius | Same as text input |

Dropdown options panel:
- Background: `--color-neutral-0`
- Border: 1px solid `--color-neutral-200`
- Border radius: 8px
- Box shadow: `0 8px 24px rgba(0,0,0,0.08)`
- Option height: 40px
- Option hover bg: `--color-primary-50`
- Option selected: `--color-primary-500` text, `--color-primary-50` background, checkmark icon

---

## Checkbox

| Property | Value |
|---|---|
| Size | 18px × 18px |
| Border | 1.5px solid `--color-neutral-300` |
| Border radius | 4px |
| Background (unchecked) | `--color-neutral-0` |
| Background (checked) | `--color-primary-500` |
| Checkmark | white, 12px, 2px stroke |
| Label gap | `--space-2` (8px) from checkbox |
| Label font | `--text-sm`, weight 400, `--color-neutral-700` |

Focus state: `0 0 0 3px rgba(99, 102, 241, 0.2)` ring around the checkbox.

Checked animation: checkmark draws in over 120ms ease-out.

---

## Radio Button

| Property | Value |
|---|---|
| Size | 18px × 18px |
| Border | 1.5px solid `--color-neutral-300` |
| Border radius | 50% (circle) |
| Background (unselected) | `--color-neutral-0` |
| Dot (selected) | 8px circle, `--color-primary-500`, centered |
| Outer ring (selected) | border color `--color-primary-500` |
| Label | Same as checkbox label |

---

## Toggle / Switch

| Property | Value |
|---|---|
| Track width | 44px |
| Track height | 24px |
| Track radius | 12px |
| Track color (off) | `--color-neutral-300` |
| Track color (on) | `--color-primary-500` |
| Thumb size | 20px × 20px |
| Thumb color | white |
| Thumb position (off) | 2px from left |
| Thumb position (on) | 2px from right |
| Transition | 200ms ease-in-out |
| Label | Right of toggle, `--text-sm`, weight 500 |

---

## Search Input

| Property | Value |
|---|---|
| Height | 44px |
| Icon | 16px search icon, left inside input, `--color-neutral-400` |
| Left padding | 40px (to clear icon) |
| Right padding | 16px |
| Clear button | appears when value present, right-aligned, 16px ✕ icon |

---

## Form Card

When a form is presented as a standalone UI card:

- Background: `--color-neutral-0`
- Border: 1px solid `--color-neutral-200`
- Border radius: 12px
- Padding: `--space-8` (32px)
- Box shadow: `0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)`

---

## Form Rules

- Labels are always visible — never hide them inside the field.
- Never use more than 5–7 fields in a single form without breaking into steps.
- Always confirm destructive form submissions with a secondary modal or confirmation pattern.
- Form submit button is always the last element in a form, full-width on mobile.
- Never clear a form after a failed submission. Preserve the user's work.
