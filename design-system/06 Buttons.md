# 06 — Buttons

## Philosophy

Buttons are the primary instrument of action. Every button must communicate its importance, its state, and its consequence with complete clarity. The system has exactly four variants. No new variants are created without system-level justification.

---

## Button Variants

### Primary Button
The highest-priority action on a page or within a section. There should be only one primary button visible at a time per focal area.

| Property | Value |
|---|---|
| Background | `--color-primary-500` (#6366F1) |
| Text color | #FFFFFF |
| Font size | `--text-sm` (14px) |
| Font weight | 600 |
| Border | none |
| Border radius | 8px |
| Padding | 12px 24px (vertical / horizontal) |
| Letter spacing | 0 |
| Height | 44px (minimum — accessibility) |

**Hover state:**
- Background: `--color-primary-600` (#4F46E5)
- Transition: `background-color 150ms ease-out`

**Pressed / Active state:**
- Background: `--color-primary-700` (#4338CA)
- Transform: scale(0.98)
- Transition: transform 80ms ease-in

**Focus state:**
- Outline: 2px solid `--color-primary-500`
- Outline offset: 3px

**Disabled state:**
- Background: `--color-neutral-200`
- Text color: `--color-neutral-400`
- Cursor: not-allowed
- No hover/active effects

---

### Secondary Button
A supporting action. Used alongside a primary button or when the action is important but not the dominant choice.

| Property | Value |
|---|---|
| Background | transparent |
| Text color | `--color-primary-600` |
| Font size | `--text-sm` (14px) |
| Font weight | 600 |
| Border | 1.5px solid `--color-primary-300` |
| Border radius | 8px |
| Padding | 11px 23px (accounts for border) |
| Height | 44px |

**Hover state:**
- Background: `--color-primary-50`
- Border color: `--color-primary-400`
- Transition: `all 150ms ease-out`

**Pressed state:**
- Background: `--color-primary-100`
- Border color: `--color-primary-500`

**Focus state:**
- Outline: 2px solid `--color-primary-500`
- Outline offset: 3px

**Disabled state:**
- Border color: `--color-neutral-200`
- Text color: `--color-neutral-400`
- Cursor: not-allowed

---

### Ghost Button
A tertiary action. Low visual weight. Used for non-critical actions that must remain accessible without competing with primary or secondary choices.

| Property | Value |
|---|---|
| Background | transparent |
| Text color | `--color-neutral-600` |
| Font size | `--text-sm` (14px) |
| Font weight | 500 |
| Border | none |
| Border radius | 8px |
| Padding | 12px 20px |
| Height | 44px |

**Hover state:**
- Background: `--color-neutral-100`
- Text color: `--color-neutral-900`
- Transition: `all 150ms ease-out`

**Pressed state:**
- Background: `--color-neutral-200`

---

### Destructive Button
Used for irreversible or high-consequence actions (delete, remove, cancel subscription). Never used for primary navigation or low-stakes choices.

| Property | Value |
|---|---|
| Background | `--color-error-500` (#EF4444) |
| Text color | #FFFFFF |
| Font size | `--text-sm` (14px) |
| Font weight | 600 |
| Border | none |
| Border radius | 8px |
| Padding | 12px 24px |
| Height | 44px |

**Hover state:**
- Background: `--color-error-600`
- Transition: `background-color 150ms ease-out`

**Pressed state:**
- Background: `--color-error-700`

---

## Button Sizes

| Size | Height | Padding (V / H) | Font Size | Use |
|---|---|---|---|---|
| `xs` | 32px | 6px / 12px | 12px | Compact tables, tight UI |
| `sm` | 36px | 8px / 16px | 13px | Sidebar actions, inline |
| `md` | 44px | 12px / 24px | 14px | **Default** |
| `lg` | 52px | 14px / 32px | 16px | Hero CTAs, prominent sections |
| `xl` | 60px | 16px / 40px | 18px | Maximum impact CTAs |

---

## Button with Icon

Icons can appear to the left (leading) or right (trailing) of button text.

| Property | Value |
|---|---|
| Icon size | 16px (md), 18px (lg), 14px (sm) |
| Gap between icon and label | 8px (`--space-2`) |
| Icon-only button padding | equal on all sides (16px for md) |
| Icon-only button: aria-label required | always |

Icon-only buttons must have a visible tooltip on hover with the action name.

---

## Button Loading State

When a button triggers an async action, it enters a loading state.

- Text is replaced with a spinner (16px animated circle, white stroke)
- Button width is locked to its resting width (no resize during loading)
- Button is not clickable while loading (pointer-events: none)
- Spinner animation: rotate 360deg in 600ms, linear, infinite

---

## Button Group

When multiple buttons appear together, they follow a strict hierarchy and spacing rule.

- Hierarchy order (left to right): Ghost → Secondary → Primary
- Gap between grouped buttons: `--space-3` (12px)
- Never place two Primary buttons side by side.
- On mobile, button groups stack vertically. Primary appears first (top).

---

## Full-Width Buttons

On mobile screens (`< 768px`), standalone CTAs become full-width.

- Apply full width only when the button is the only CTA in view.
- Form submit buttons are always full-width in single-column layouts.
- Maintain minimum 44px height at full width.

---

## Button Rules

- Every button must have a visible label (text or aria-label).
- Never disable a button without explaining why. Use helper text below or a tooltip.
- Never use color alone to distinguish button variants. Shape, border, and label reinforce the difference.
- Never place more than 3 buttons in a single button group.
- Avoid using links styled as buttons or buttons styled as links.
