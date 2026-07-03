# 14 — Blog UI

## Philosophy

The blog is where Digital Rise OS builds authority and trust. The reading experience is the product. Every typographic, spacing, and layout decision must serve the reader — making it easy to start, impossible to stop, and effortless to share.

---

## Blog Listing Page

### Page Header
- Heading: `--text-4xl`, weight 700, `--color-neutral-900`
- Subheading: `--text-lg`, `--color-neutral-500`
- Max width of header text: 640px, centered
- Bottom margin before cards: `--space-16` (64px)

### Category Filter Bar
- Displayed as pill tabs or chip filters
- Container: centered, `--space-8` (32px) below header
- Chip default: `--text-sm`, weight 500, `--color-neutral-600`, background `--color-neutral-100`, border-radius 100px (pill), padding 8px 16px
- Chip active: `--color-primary-600` text, background `--color-primary-50`, border 1.5px solid `--color-primary-200`
- Chip hover: background `--color-neutral-200`

### Blog Card Grid
- Columns: 3 (desktop lg+), 2 (tablet md), 1 (mobile)
- Gap: `--space-8` (32px)
- Card details: see `08 Cards.md — Blog/Article Card`

### Load More / Pagination
- Prefer "Load More" button (secondary, centered below grid) over numbered pagination on listing pages.
- Show article count: "`Showing 9 of 24 articles`" in `--text-sm`, `--color-neutral-400` above the button.

---

## Blog Article Page

### Article Container
- Max width: 720px
- Centered on page
- Horizontal padding: `--space-4` (16px) on mobile

### Article Header

| Element | Style |
|---|---|
| Category label | `--text-xs`, weight 600, `--color-primary-500`, uppercase, letter-spacing +0.08em |
| Title (H1) | `--text-4xl` to `--text-5xl`, weight 700, `--color-neutral-900`, line-height 1.2 |
| Excerpt / subtitle | `--text-xl`, weight 400, `--color-neutral-500`, line-height 1.5 |
| Gap: category → title | `--space-3` (12px) |
| Gap: title → subtitle | `--space-4` (16px) |

### Author Row
Appears below the article header, above the hero image.

| Element | Style |
|---|---|
| Avatar | 40px circle, 2px border `--color-neutral-200` |
| Author name | `--text-sm`, weight 600, `--color-neutral-900` |
| Role / Publication | `--text-xs`, weight 400, `--color-neutral-400` |
| Date | `--text-xs`, `--color-neutral-400` |
| Read time | `--text-xs`, `--color-neutral-400`, preceded by "·" |
| Gap: avatar → text | `--space-3` (12px) |

### Article Hero Image
- Aspect ratio: 16:9
- Border radius: 12px
- Margin: `--space-8` (32px) above, `--space-10` (40px) below
- Alt text: always required, descriptive

### Article Body Typography

| Element | Style |
|---|---|
| Body text | `--text-base` to `--text-lg`, weight 400, `--color-neutral-700`, line-height 1.75 |
| Paragraph gap | `--space-6` (24px) between paragraphs |
| H2 (section heading) | `--text-2xl`, weight 700, `--color-neutral-900`, margin-top `--space-12` (48px), margin-bottom `--space-4` (16px) |
| H3 (subsection) | `--text-xl`, weight 600, `--color-neutral-800`, margin-top `--space-8` (32px), margin-bottom `--space-3` (12px) |
| Bold | weight 700, `--color-neutral-900` |
| Italic | standard italic |
| Inline code | JetBrains Mono, `--text-sm`, bg `--color-neutral-100`, padding 2px 6px, radius 4px |
| Links | `--color-primary-600`, underline, hover: `--color-primary-700` |

### Blockquote
- Left border: 4px solid `--color-primary-300`
- Padding left: `--space-6` (24px)
- Text: `--text-lg`, style italic, `--color-neutral-600`, line-height 1.6
- Margin: `--space-8` (32px) top and bottom

### Code Block
- Background: `--color-neutral-950`
- Border radius: 10px
- Padding: `--space-6` (24px)
- Font: JetBrains Mono, `--text-sm`, `--color-neutral-100`
- Language label: top-right, `--text-xs`, `--color-neutral-500`
- Copy button: top-right, icon + "Copy", transitions to "Copied ✓" for 2 seconds

### Lists
- Unordered: custom bullet — 6px circle, `--color-primary-400`, vertically centered on first line
- Ordered: counter in `--color-primary-500`, weight 600
- Item gap: `--space-2` (8px)
- Nested list indent: `--space-6` (24px)

### Callout / Tip Box

| Property | Value |
|---|---|
| Background | `--color-primary-50` |
| Border radius | 8px |
| Border left | 4px solid `--color-primary-400` |
| Padding | `--space-5` (20px) |
| Icon | 20px, `--color-primary-500`, top-left |
| Heading | `--text-sm`, weight 700, `--color-primary-700` |
| Body | `--text-sm`, `--color-primary-800` |

### Article Images (Inline)
- Max width: 100% of article container
- Border radius: 8px
- Caption below: `--text-xs`, `--color-neutral-400`, centered, margin-top `--space-2`

---

## Article Footer

### Tags / Topics
- Pill chips, same style as category chips
- Label above: `--text-xs`, weight 600, `--color-neutral-500`, uppercase

### Share Bar
- "Share this article" label: `--text-sm`, weight 500, `--color-neutral-600`
- Social icons: 36px × 36px, border 1px solid `--color-neutral-200`, border-radius 8px, icon 18px `--color-neutral-500`
- Hover: border `--color-neutral-300`, icon `--color-neutral-800`
- Copy link button: ghost button, "Copy link" label + link icon

### Author Bio Card
- Container: border 1px `--color-neutral-200`, border-radius 12px, padding `--space-6` (24px)
- Avatar: 64px circle
- Name: `--text-lg`, weight 600, `--color-neutral-900`
- Bio: `--text-sm`, `--color-neutral-500`, max 2 lines
- Follow button: secondary button, `sm` size

### Related Articles
- Heading: `--text-xl`, weight 700, `--color-neutral-900`
- Grid: 3 cards (desktop), 1 (mobile)
- Same card design as blog listing cards

---

## Reading Progress Indicator

A thin bar at the very top of the viewport showing reading progress.

- Height: 3px
- Color: `--color-primary-500`
- Position: fixed, top: 0, z-index above nav
- Width: animated from 0% to 100% as user scrolls the article
- Transition: `width 50ms linear`
