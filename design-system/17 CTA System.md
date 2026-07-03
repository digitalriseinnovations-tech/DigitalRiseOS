# 17 — CTA System

## Philosophy

A call to action is a promise. The visual treatment of every CTA must match the weight of what is being asked. A primary CTA is a significant ask — it deserves prominence and clarity. A secondary CTA is a lower-stakes offer. The hierarchy must be readable at a glance, with no ambiguity about which action matters most.

---

## CTA Hierarchy

Every page or section has a single most-important action. That action receives the highest visual weight. Supporting actions receive proportionally less weight.

| Level | Visual Weight | Button Type | Use |
|---|---|---|---|
| Primary CTA | Highest | Primary button | The main conversion goal |
| Secondary CTA | Medium | Secondary button | Alternative or supporting action |
| Tertiary CTA | Low | Ghost or link | Soft exit, explore more, learn more |

Never use two Primary CTAs in the same visual field.

---

## CTA Types by Context

### Hero CTA
The most important CTA on the page. Appears in the hero section.

| Property | Value |
|---|---|
| Button | Primary, size `lg` (52px height) |
| Secondary option | Secondary button, same size, beside primary |
| Gap between | `--space-4` (16px) |
| Label examples | "Get Started Free", "Start Your Trial", "See How It Works" |
| Below CTA | Optional trust line: `--text-xs`, `--color-neutral-400` — "No credit card required · Setup in 2 minutes" |
| Trust line margin | `--space-3` (12px) above |
| On mobile | Stack vertically, both full-width, primary first |

### Section CTA
Appears within a feature or content section. Converts mid-page interest.

| Property | Value |
|---|---|
| Button | Primary or secondary, size `md` |
| Placement | Below the section content, left-aligned (for text sections) or centered (for centered sections) |
| Accompaniment | Optional ghost link: "Learn more →" |

### Inline CTA (within text)
A link-style CTA embedded within body copy.

| Property | Value |
|---|---|
| Style | `--color-primary-600`, underline, weight 500 |
| Trailing arrow | "→" character, same color, `--space-1` gap |
| Hover | Color → `--color-primary-700`, underline thickness increases |

### Banner CTA
A full-width section dedicated entirely to a single action. High urgency or high importance.

| Property | Value |
|---|---|
| Background | `--color-primary-500` or `gradient-brand` |
| Padding | `--space-16` (64px) vertical |
| Heading | `--text-3xl`, weight 700, white |
| Subheading | `--text-lg`, white, opacity 85% |
| Button | white background, `--color-primary-600` text, primary-sized |
| Layout | Centered text + button, or split (text left, button right) |

### Exit CTA (Footer)
The final conversion opportunity on every marketing page.

| Property | Value |
|---|---|
| Background | `--color-neutral-950` or `--color-primary-900` |
| Heading | `--text-4xl`, weight 700, white, centered |
| Subheading | `--text-lg`, `--color-neutral-400`, centered |
| Button | Primary, size `lg`, centered |
| Width constraint | Max 640px, centered |
| Padding | `--space-24` (96px) vertical |

---

## CTA Copy Principles

### Be Specific
Vague CTAs convert poorly. Generic labels signal generic value.

| Weak | Strong |
|---|---|
| "Click Here" | "Start Your Free Trial" |
| "Submit" | "Get My Growth Plan" |
| "Learn More" | "See How It Works" |
| "Sign Up" | "Join 2,400+ Founders" |

### Match Commitment Level
The language must match what the user is actually being asked to do.

- Free action: "Try Free", "See a Demo" — no commitment implied
- Account creation: "Create Your Account" — lightweight commitment
- Paid action: "Start Free Trial", "Upgrade Now" — transparent about next step
- Irreversible action: "Delete Account", "Cancel Subscription" — unambiguous

### Reduce Friction with a Trust Line
A single line of text below the primary CTA that removes a potential objection.

Examples:
- "No credit card required"
- "Cancel anytime"
- "Setup in under 5 minutes"
- "Join 2,400+ teams already growing"

Font: `--text-xs`, color: `--color-neutral-400`

---

## CTA Placement Rules

- **Above the fold:** The hero CTA must be visible without scrolling on 1280px desktop.
- **Repeat every 2–3 sections:** A user who reads past the hero needs another opportunity to act.
- **End of page:** Every marketing page ends with a CTA section before the footer.
- **After social proof:** Place a CTA immediately following a testimonial section.
- **After pricing:** CTA is the natural next step after a user reads pricing details.

---

## CTA Disabled States

A disabled CTA is a failed design. If an action is unavailable:

1. Explain why, adjacent to the button.
2. Show what must happen for it to become available.
3. If the action is coming soon, use a "Notify Me" secondary CTA instead.

A greyed-out button with no explanation creates confusion and damages trust.

---

## CTA A/B Testing Conventions

When running A/B tests on CTAs, document:

| Field | Record |
|---|---|
| Control label | The current button text |
| Variant label | The text being tested |
| Button type | Primary / Secondary |
| Page and position | e.g., "Homepage hero — primary" |
| Metric | e.g., "Click-through rate", "Trial signups" |
| Duration | Start and end date |
| Result | Winning variant and lift % |

Never run more than one CTA test per page simultaneously — results become uninterpretable.
