# PROJECT_RULES.md — Digital Rise OS

These rules are non-negotiable. Every contributor must follow them without exception.

---

## Coding Standards

- Write clean, readable, self-documenting code.
- No inline styles. All styles live in CSS files.
- No inline scripts. All scripts live in JS files.
- No frameworks or libraries unless explicitly approved.
- HTML must be semantic — use the correct element for the correct purpose.
- CSS must use custom properties (variables) defined in the design token file.
- JavaScript must be written in ES6+ syntax.
- All code must pass a manual readability check before committing.

---

## Folder Naming

- All folder names use `kebab-case` (lowercase, words separated by hyphens).
- No spaces, underscores, or uppercase letters in folder names.
- Folder names must describe their contents clearly.

**Correct:** `design-system/`, `growth-engine/`, `claude-prompts/`
**Incorrect:** `DesignSystem/`, `growth_engine/`, `ClaudePrompts/`

---

## File Naming

- All file names use `kebab-case`.
- File names must be descriptive and specific.
- No generic names like `file1.html`, `new.css`, or `test.js`.
- Documentation files use `SCREAMING_SNAKE_CASE` (e.g., `README.md`, `PROJECT_RULES.md`).

**Correct:** `hero-section.html`, `typography-tokens.css`, `scroll-animation.js`
**Incorrect:** `Hero.html`, `typography_tokens.css`, `scrollAnimation.js`

---

## Accessibility

- All images must have descriptive `alt` attributes.
- All interactive elements must be keyboard-navigable.
- Color contrast must meet WCAG 2.1 AA minimum (4.5:1 for text).
- Use ARIA labels where semantic HTML alone is insufficient.
- Focus states must be visible and styled — never remove the default outline without replacing it.
- Test with a screen reader before marking any page as complete.

---

## Performance

- No page should exceed 3 seconds load time on a standard connection.
- Images must be compressed and served in modern formats (WebP preferred).
- Fonts must be loaded with `font-display: swap`.
- JavaScript must be deferred or loaded asynchronously unless render-critical.
- Minimize HTTP requests — combine files where logical.
- No unused CSS or JavaScript shipped to production.

---

## SEO

- Every page must have a unique, descriptive `<title>` tag (50–60 characters).
- Every page must have a unique `<meta name="description">` (150–160 characters).
- Heading hierarchy must be correct: one `<h1>` per page, followed by `<h2>`, `<h3>`.
- All pages must have Open Graph meta tags for social sharing.
- URLs must be clean, descriptive, and lowercase with hyphens.
- Canonical tags required on all pages.

---

## Animation Principles

- Animations must serve a purpose — guide attention, communicate state, or reinforce brand.
- No decorative animation that adds no informational value.
- All animations must respect `prefers-reduced-motion` media query.
- Default duration range: `200ms` (micro) to `600ms` (macro). Nothing slower unless cinematic.
- Easing: prefer `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for loops.
- Never animate properties that trigger layout (width, height, top, left) — use `transform` and `opacity` only.

---

## Responsive Rules

- Mobile-first approach. Build for smallest screen first, scale up.
- Breakpoints (defined in tokens):
  - `sm`: 375px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1440px
- No fixed pixel widths on layout containers — use `%`, `rem`, `clamp()`, or `grid`.
- Touch targets must be a minimum of `44px × 44px`.
- Test on real devices, not just browser resize.

---

## Git Commit Format

All commits must follow this format:

```
type(scope): short description

[optional body]
```

**Types:**
- `feat` — new feature or content
- `fix` — bug fix
- `docs` — documentation changes
- `style` — formatting, no logic change
- `refactor` — code restructure, no feature change
- `perf` — performance improvement
- `chore` — maintenance, config, tooling

**Examples:**
```
feat(website): add hero section markup
fix(nav): correct mobile menu z-index
docs(readme): update folder structure
style(tokens): reorder color variables
```

- Subject line: max 72 characters, lowercase, no period at end.
- Use present tense: "add feature" not "added feature".
- One logical change per commit.
