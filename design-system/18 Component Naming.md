# 18 — Component Naming

## Philosophy

Naming is design. A clearly named component can be found, understood, and used by anyone on the team without explanation. An ambiguously named component creates confusion, duplication, and inconsistency. The naming system must be rigid enough to be consistent and flexible enough to accommodate growth.

---

## Naming Principles

1. **Descriptive, not decorative.** Names describe what a component is, not what it looks like visually at a moment in time.
2. **Consistent casing.** File names use `kebab-case`. Class names use `BEM`. Token names use `kebab-case` with `--` prefix.
3. **Layered specificity.** Names move from general to specific: `card` → `card--feature` → `card__title`.
4. **No abbreviations.** Write it out. `navigation` not `nav`. `button` not `btn`. Clarity is worth the characters.
5. **No context embedding.** Name for what the component is, not where it lives. `testimonial-card` not `homepage-testimonial` — it may be used elsewhere.

---

## File Naming Convention

All component files use `kebab-case`. The file name describes the component type.

**Format:** `[component-type]-[variant]-[modifier].html|css|js`

| Example file name | What it is |
|---|---|
| `button-primary.css` | Primary button styles |
| `card-feature.html` | Feature card markup |
| `navigation-top.html` | Top navigation bar |
| `navigation-sidebar.html` | Dashboard sidebar navigation |
| `form-input-text.html` | Text input field |
| `badge-status.html` | Status badge component |
| `modal-confirmation.html` | Confirmation dialog |
| `section-hero.html` | Hero section layout |
| `section-cta-banner.html` | Full-width CTA banner section |

---

## CSS Class Naming — BEM

The BEM methodology (Block__Element--Modifier) governs all CSS class naming.

### Block
The standalone component name.

```
.button
.card
.navigation
.form
.badge
.modal
```

### Element
A part of the block that cannot exist independently.

```
.card__title
.card__body
.card__footer
.button__icon
.form__label
.navigation__logo
```

### Modifier
A variation or state of a block or element.

```
.button--primary
.button--secondary
.button--disabled
.button--loading
.card--feature
.card--pricing
.card--highlighted
.navigation--sticky
```

### Combined Example

```
<div class="card card--feature">
  <div class="card__icon"></div>
  <h3 class="card__title">Feature Name</h3>
  <p class="card__body">Description text.</p>
  <a class="card__link button button--ghost">Learn more</a>
</div>
```

---

## Component Categories

| Category | Prefix | Examples |
|---|---|---|
| Atoms | no prefix (the component IS the atom) | `button`, `badge`, `input`, `icon`, `label` |
| Molecules | descriptive noun | `card`, `form-field`, `search-bar`, `tooltip` |
| Organisms | descriptive noun | `navigation`, `hero`, `footer`, `testimonial-grid` |
| Templates | `section-` prefix | `section-hero`, `section-features`, `section-pricing` |
| Pages | `page-` prefix | `page-home`, `page-blog`, `page-dashboard` |

---

## Design Token Naming

All design tokens use CSS custom properties with `--` prefix and `kebab-case`.

**Format:** `--[category]-[sub-category]-[variant]`

| Category | Format | Example |
|---|---|---|
| Color | `--color-[role]-[scale]` | `--color-primary-500`, `--color-neutral-200` |
| Typography size | `--text-[size]` | `--text-base`, `--text-xl` |
| Font weight | `--font-weight-[name]` | `--font-weight-semibold` |
| Line height | `--line-height-[name]` | `--line-height-body` |
| Spacing | `--space-[scale]` | `--space-4`, `--space-12` |
| Border radius | `--radius-[name]` | `--radius-sm`, `--radius-lg` |
| Shadow | `--shadow-[name]` | `--shadow-card`, `--shadow-modal` |
| Duration | `--duration-[name]` | `--duration-base`, `--duration-slow` |
| Easing | `--ease-[name]` | `--ease-out`, `--ease-spring` |
| Z-index | `--z-[name]` | `--z-navigation`, `--z-modal`, `--z-tooltip` |
| Breakpoint | `--breakpoint-[name]` | `--breakpoint-md`, `--breakpoint-xl` |
| Icon size | `--icon-[name]` | `--icon-sm`, `--icon-lg` |

---

## Z-Index Scale

Z-index values are named, not arbitrary numbers.

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Default stacking |
| `--z-raised` | 10 | Slightly elevated cards, dropdowns |
| `--z-dropdown` | 100 | Dropdown menus, select panels |
| `--z-sticky` | 200 | Sticky headers, floating elements |
| `--z-navigation` | 1000 | Top navigation bar |
| `--z-drawer` | 1100 | Mobile navigation drawer |
| `--z-overlay` | 1200 | Modal/drawer overlay background |
| `--z-modal` | 1300 | Modal dialogs |
| `--z-toast` | 1400 | Toast notifications |
| `--z-tooltip` | 1500 | Tooltips (always on top) |

---

## State Class Naming

State classes are prefixed with `is-` or `has-`.

| State | Class |
|---|---|
| Active | `is-active` |
| Open | `is-open` |
| Closed | `is-closed` |
| Loading | `is-loading` |
| Disabled | `is-disabled` |
| Selected | `is-selected` |
| Expanded | `is-expanded` |
| Collapsed | `is-collapsed` |
| Visible | `is-visible` |
| Hidden | `is-hidden` |
| Has error | `has-error` |
| Has value | `has-value` |

State classes are applied via JavaScript and should never be styled alone — always scoped to a block.

```css
/* Correct */
.navigation.is-sticky { ... }
.form-field.has-error .form-field__input { ... }

/* Incorrect */
.is-active { ... }
```

---

## Naming Rules

- Never use presentational names: `blue-button`, `big-text`, `left-panel`.
- Never use page names in component names: `homepage-hero`, `pricing-card-top`.
- Never use numeric suffixes as the primary differentiator: `card1`, `card2`. Use semantic modifiers.
- When unsure of a name, ask: "Would a new team member know what this is from the name alone?"
