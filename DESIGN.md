# Overview

AURORA ESTATES' marketing and portfolio design system is built like a piece of high-precision architectural documentation that learned graphic design—every page is a structured cascade of dense, factual real estate asset information arranged on a paper-white grid, framed top and bottom by deep black hero and footer chapters. There is exactly one accent color in the entire system, and it carries the entire brand weight: **Aurora Green** (`#76B900`), used for every primary CTA, every active tab, every link affordance on dark surfaces, and the small decorative corner squares that mark out card containers. Nothing else competes for attention.

The system's character comes from extreme typographic discipline and an uncompromisingly angular geometry. Every container, button, card, input, and image uses a strict **2px radius**—a token that is barely-there but never zero, giving the system the precise, technical feel of CAD blueprints rather than soft consumer software. Cards sit directly on the plain white canvas with a 1px hairline border (no shadow, no elevation blur), separated by a tight 8px-base spacing rhythm. Long-form pages stack these cards into dense multi-column technical grids without ever introducing decorative breaks or soft floating panels.

The black-canvas hero and footer chapters are the system's "headline moments"—a single full-bleed architectural photographic or 3D-rendered structural image with Display XL headline copy laid in crisp white, a single green CTA button, and a small green corner square as the only ornamentation. Everything else is subordinate.

**Key Characteristics:**
* **Single-accent system:** `#76B900` carries every CTA, active state, and decorative motif. The rest is monochrome black/white/gray.
* **Two-mode surface architecture:** Deep black surface for hero and footer chapters; crisp white canvas for body alternating in a predictable, high-contrast rhythm down the page.
* **Hyper-angular geometry:** Strict 2px radius on every interactive element. There are no pill buttons, no rounded cards, no glassmorphic blurs, and no soft chrome.
* **Typographic hierarchy:** Scaled across a 12-tier hierarchy using the open-source **Inter** typeface (falling back to Arial and Helvetica) at weights 400 and 700. Hierarchy is established purely through size and weight contrast, not colorful text.
* **Flat hairline elevation:** The card library leans exclusively on 1px hairline borders (`#CCCCCC`) and flat surfaces rather than drop shadows for separation.
* **Signature decorative element:** The 12×12px solid `#76B900` corner square anchored to one corner of resource and feature cards.
* **Dense technical footer:** Multi-column footer with 4–6 link columns on a deep black surface with structured global navigation.

---

## Colors

### Brand & Accent
* **Aurora Green** (`#76B900`): The brand anchor. Used for every primary CTA, every active state, every link affordance on dark surfaces, every corner square, and the brand wordmark icon.
* **Aurora Green Dark** (`#5A8D00`): Pressed / active state for primary buttons and interactive green highlights.
* **Accent Green Pale** (`#BFF230`): Rare highlight tint used in editorial callouts and decorative micro-blocks; never on primary chrome.

### Surface
* **Page Canvas** (`#FFFFFF`): The body canvas of every page. Cards sit directly on it with 1px hairline rules.
* **Soft Surface** (`#F7F7F7`): Breadcrumb strips, sub-nav bars, stat callout blocks, table headers, alternating row backgrounds.
* **Black Canvas** (`#000000`): Hero chapters, dark CTA strips, primary navigation, footers. The system's frame color.
* **Surface Elevated** (`#1A1A1A`): Nested dark panels inside the footer, column dividers, fine-print bars.
* **Hairline** (`#CCCCCC`): 1px card border, table rule, divider between light sections.
* **Hairline Strong** (`#5E5E5E`): 1px divider on dark surfaces (footer column rules, dark-mode card edges).

### Text
* **Ink** (`#000000`): Headlines and high-contrast title text on white canvas.
* **Body** (`#1A1A1A`): Long-form paragraph text and card body prose.
* **Mute** (`#757575`): Secondary metadata, breadcrumb separators, footer legal copyright.
* **Stone** (`#898989`): Least-emphasis text, disabled state labels.
* **Ash** (`#A7A7A7`): Disabled icon color and faint utility text.
* **On Dark** (`#FFFFFF`): Primary headline and body text on black canvas.
* **On Dark Mute** (`rgba(255, 255, 255, 0.70)`): Secondary footer link text, dark-canvas subheads.

### Semantic
* **Error** (`#E52020`): Form validation errors and critical notices.
* **Error Deep** (`#650B0B`): Pressed state for destructive confirmation buttons.
* **Warning** (`#DF6500`): Caution callouts and status banners.
* **Success Deep** (`#3F8500`): Positive transaction confirmation where Aurora Green's vivid saturation would clash.
* **Link Blue** (`#0046A4`): Inline anchor link color on light canvas—the ONLY blue in the system, strictly reserved for prose-embedded hyperlinks.

---

## Typography

### Font Family
* **Inter** (weights 400 Regular and 700 Bold) is the primary font family across all roles.
* **Arial, Helvetica, sans-serif** serves as the universal fallback stack.
* Iconography relies on crisp SVG glyphs rendered at 14px to 22px with 1.5px to 2px stroke weight.

AURORA ESTATES' type system relies on weight contrast and disciplined scale jumps—not color tinting—to establish hierarchy, giving marketing copy and property listings an editorial, high-trust architectural documentation aesthetic.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Case | Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`Display XL`** | 48px | 700 | 1.25 | -0.02em | Sentence | Hero headline on dark hero cards |
| **`Display LG`** | 36px | 700 | 1.25 | -0.015em | Sentence | Section headlines, large stat callouts |
| **`Heading XL`** | 24px | 700 | 1.25 | -0.01em | Sentence | Sub-section title, dark CTA strip headline |
| **`Heading LG`** | 22px | 400 | 1.65 | 0 | Sentence | Long-form intro paragraphs |
| **`Heading MD`** | 20px | 700 | 1.30 | 0 | Sentence | Card group titles, sub-nav anchor headings |
| **`Heading SM`** | 18px | 700 | 1.40 | 0 | Sentence | Sidebar filter groups, small section labels |
| **`Card Title`** | 17px | 700 | 1.45 | 0 | Sentence | Property card titles, development names |
| **`Body MD`** | 16px | 400 | 1.50 | 0 | Sentence | Standard paragraph prose |
| **`Body Strong`** | 16px | 700 | 1.50 | 0 | Sentence | Inline emphasis, primary nav links |
| **`Body SM`** | 15px | 400 | 1.60 | 0 | Sentence | Card descriptions, secondary copy |
| **`Button LG`** | 18px | 700 | 1.25 | 0 | Sentence | Dark hero primary CTA |
| **`Button MD`** | 16px | 700 | 1.25 | 0 | Sentence | Standard primary/secondary buttons |
| **`Button SM`** | 14px | 700 | 1.00 | +0.02em | Sentence | Compact tab pills, in-card secondary CTAs |
| **`Link MD`** | 15px | 400 | 1.50 | 0 | Sentence | Inline anchor links in body prose (`#0046A4`) |
| **`Caption MD`** | 14px | 700 | 1.40 | +0.06em | UPPERCASE | Eyebrows over section headings, breadcrumbs |
| **`Caption SM`** | 12px | 400 | 1.25 | +0.02em | Sentence | Footnote copy, metadata, table captions |
| **`Caption XS`** | 11px | 700 | 1.00 | +0.04em | UPPERCASE | Category tag badges, pill chip labels |
| **`Utility XS`** | 10px | 700 | 1.50 | +0.08em | UPPERCASE | Legal fine-print bar, status tags |

---

## Layout

### Spacing System (8px Base Unit)
* **Tokens:** `2px`, `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`
* **Universal section rhythm:** Every page uses `64px` as the vertical gap between major content blocks. Card grids use `24px` gutters; in-card padding sits at `24px` to `32px` depending on density.
* **Hero chapter padding:** `80px` vertical and `48px` horizontal (collapsing to `24px` on mobile).

### Grid & Container
* **Max width:** `1280px` content area at desktop, with `24px` gutters that expand to `48px` on ultrawide viewports.
* **Column patterns:**
  * **Card grids:** 4-up at desktop (≥1280px), 3-up at 1024px, 2-up at 768px, 1-up at 480px.
  * **Feature cards:** 3-up or 4-up technical grid.
  * **Footer:** 5 or 6 columns at desktop, 2-up at tablet, accordion on mobile.
* **Card aspects:**
  * Property / Resource cards: `16:9` thumbnail at top with title, description, and ghost link below.
  * Feature cards: Square or vertical ratio with green accent index or technical glyph.

---

## Elevation & Depth

| Level | Treatment | Use |
| :--- | :--- | :--- |
| **0 - Flat** | No border, no shadow | Canvas-on-canvas blocks, hero chapter content, footer column bodies |
| **1 - Hairline border** | 1px solid `#CCCCCC` | All cards on canvas, table cells, stat callouts, comparison panels |
| **2 - Hairline strong** | 1px solid `#5E5E5E` | Dividers on dark surface (footer rules, dark hero panel borders) |
| **3 - Soft shadow** | `0 0 5px 0 rgba(0,0,0,0.25)` | Sticky nav bottom edge when scrolled only; never on cards |

AURORA ESTATES has zero drop-shadow elevation in card or content surfaces. Depth is created through stark surface contrast (black hero chapters vs. white body grids) and high-resolution architectural photography.

---

## Shapes & Geometry

### Border Radius Scale
* **None (`0px`):** Hero chapter containers, primary navigation, footers, full-bleed CTA strips.
* **XS (`1px`):** Decorative micro-rules, hairline inset accent strips.
* **SM (`2px`):** **Universal standard** for every interactive element—buttons, cards, inputs, tab pills, and badges.
* **Full (`9999px`):** Exclusively reserved for circular user avatars and circular social media icons.

### Decorative Corner Square
* **Dimensions:** Exactly `12px × 12px` solid `#76B900` square (`16px × 16px` on hero callouts).
* **Placement:** Anchored to the top-left or bottom-right corner of feature and property cards.
* **Purpose:** Signature architectural marker of the AURORA ESTATES identity.

---

## Components

### Buttons

**`button-primary`**
* Background: `#76B900`
* Text: `#000000` (high-contrast technical legibility) or `#FFFFFF`
* Typography: Button MD (`16px`, weight 700)
* Height: `44px` | Padding: `11px 24px` | Radius: `2px`
* Active/Pressed: Background `#5A8D00`

**`button-outline`**
* Background: `transparent` | Border: `2px solid #76B900` | Text: `#000000`
* Typography: Button MD (`16px`, weight 700)
* Height: `44px` | Padding: `11px 22px` | Radius: `2px`
* Active/Pressed: Background `rgba(118, 185, 0, 0.08)`

**`button-outline-on-dark`**
* Background: `transparent` | Border: `1px solid #FFFFFF` | Text: `#FFFFFF`
* Typography: Button MD (`16px`, weight 700)
* Height: `44px` | Padding: `11px 24px` | Radius: `2px`
* Active/Pressed: Background `rgba(255, 255, 255, 0.15)`

**`button-ghost-link`**
* Text: `#76B900` with trailing arrow `→`
* Typography: `15px`, weight 700
* Background: `none` | Border: `none` | Radius: `0px`

**`button-disabled`**
* Background: `#F7F7F7` | Text: `#A7A7A7` | Border: `1px solid #CCCCCC` | Radius: `2px`

### Tabs & Badges

**`pill-tab`**
* Default: Background `transparent`, Text `#1A1A1A`, Button SM (`14px`, 700), Padding `10px 18px`, Radius `2px`.
* Active: Background `#000000`, Text `#FFFFFF`, Radius `2px`.

**`badge-tag`**
* Background: `#F7F7F7` | Text: `#1A1A1A` | Border: `1px solid #CCCCCC` | Radius: `2px`
* Typography: Caption XS (`11px`, 700, uppercase) | Padding: `4px 8px`

### Inputs & Forms

**`text-input`**
* Surface: `#FFFFFF` | Border: `1px solid #CCCCCC` | Text: `#1A1A1A`
* Height: `44px` | Padding: `12px 16px` | Radius: `2px` | Font: `16px`
* Focused: Border becomes `2px solid #76B900`

### Cards

**`property-card`**
* Surface: `#FFFFFF` | Border: `1px solid #CCCCCC` | Radius: `2px` | Padding: `24px`
* Top: `16:9` image thumbnail with hairline separation
* Metadata: `badge-tag` category + location label
* Body: Card Title (`17px`, 700), Body SM (`15px`, `#757575`)
* Action: `button-ghost-link` ("View Asset Details →")
* Motif: Top-left `12px × 12px` `#76B900` corner square

**`feature-card`**
* Surface: `#FFFFFF` | Border: `1px solid #CCCCCC` | Radius: `2px` | Padding: `32px`
* Top: Technical numeral or icon in `#76B900` (24px)
* Body: Heading MD (`20px`, 700) + Body SM (`15px`, `#757575`)
* Motif: Top-left `12px × 12px` `#76B900` corner square

**`callout-stat`**
* Surface: `#FFFFFF` | Border: `1px solid #CCCCCC` | Radius: `2px` | Padding: `32px`
* Top: Large Display LG (`36px`–`40px`, 700) in `#76B900`
* Bottom: Body MD (`16px`, 600, `#1A1A1A`) descriptive caption

### Hero & CTA Chapters

**`hero-card-dark`**
* Background: `#000000` | Full-width container | Padding: `80px 0`
* Layout: 2-column grid (55% text / 45% architectural visual)
* Copy: Eyebrow in `#76B900`, Display XL (`48px`) in `#FFFFFF`, Body subhead in `rgba(255,255,255,0.70)`
* Actions: `button-primary` paired with `button-outline-on-dark`

**`cta-strip-dark`**
* Background: `#000000` | Border-top/bottom: `1px solid #5E5E5E` | Padding: `48px 0`
* Layout: Flex horizontal split (Heading XL headline + `button-primary`)

---

## Responsive Rules

* **Breakpoints:**
  * **Desktop Large (≥1440px):** 4-column card grid, 1280px container, 48px gutters.
  * **Desktop (1024px–1439px):** 3-column card grid, 24px gutters.
  * **Tablet (768px–1023px):** 2-column card grid, primary nav collapses to hamburger drawer.
  * **Mobile (<768px):** 1-column layout, Display XL scales from 48px to 34px, footer link columns become accordions.
* **Touch Targets:** All interactive buttons and inputs strictly observe the WCAG AA minimum 44×44px touch target.

---

## Do's and Don'ts

### Do
* Reserve `#76B900` for primary CTAs, active states, and the 12px corner square.
* Alternate deep black chapters (Hero & Footer) and crisp white body grids at a 64px rhythm.
* Anchor the 12px corner square to one corner of every reusable card.
* Enforce a strict 2px radius on every interactive element.
* Build hierarchy from font size and weight (400 vs 700), never from arbitrary color tints.

### Don't
* Don't add drop shadows, blurry glows, or glassmorphic cards.
* Don't use pill buttons, large rounded cards, or radius > 2px anywhere except avatar circles.
* Don't introduce gradients to buttons or UI chrome.
* Don't use blue anywhere except inline body hyperlinks (`#0046A4`).
* Don't add secondary accent colors (red, purple, cyan) to UI chrome.

---

## Complete Verification & Preview Implementation

The design system has been written to [DESIGN.md](file:///m:/projectes/protfolio/devdigital/DESIGN.md) in the project workspace, providing a permanent reference file formatted specifically for Claude Design and engineering documentation tools.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURORA ESTATES — Design System Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --color-brand-primary: #76B900;
      --color-brand-dark: #5A8D00;
      --color-canvas: #FFFFFF;
      --color-soft: #F7F7F7;
      --color-black: #000000;
      --color-elevated-dark: #1A1A1A;
      --color-border-hairline: #CCCCCC;
      --color-border-dark: #5E5E5E;
      --color-text-ink: #000000;
      --color-text-body: #1A1A1A;
      --color-text-mute: #757575;
      --color-text-on-dark: #FFFFFF;
      --color-text-on-dark-mute: rgba(255, 255, 255, 0.70);
      --radius-sm: 2px;
      --font-family: 'Inter', Arial, Helvetica, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-family); background-color: var(--color-canvas); color: var(--color-text-body); line-height: 1.5; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

    .display-xl { font-size: 48px; font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; }
    .display-lg { font-size: 36px; font-weight: 700; line-height: 1.25; letter-spacing: -0.015em; }
    .heading-xl { font-size: 24px; font-weight: 700; line-height: 1.25; }
    .heading-md { font-size: 20px; font-weight: 700; line-height: 1.30; }
    .card-title { font-size: 17px; font-weight: 700; line-height: 1.45; }
    .body-md { font-size: 16px; font-weight: 400; line-height: 1.50; }
    .body-sm { font-size: 15px; font-weight: 400; line-height: 1.60; }
    .caption-md { font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .utility-xs { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }

    .btn-primary { display: inline-flex; align-items: center; justify-content: center; background-color: var(--color-brand-primary); color: #000000; font-size: 16px; font-weight: 700; height: 44px; padding: 0 24px; border-radius: var(--radius-sm); border: none; cursor: pointer; }
    .btn-primary:active { background-color: var(--color-brand-dark); }
    .btn-outline-dark { display: inline-flex; align-items: center; justify-content: center; background-color: transparent; color: var(--color-text-on-dark); font-size: 16px; font-weight: 700; height: 44px; padding: 0 24px; border-radius: var(--radius-sm); border: 1px solid var(--color-text-on-dark); cursor: pointer; }
    .btn-ghost-link { display: inline-flex; align-items: center; color: var(--color-brand-primary); font-size: 15px; font-weight: 700; background: none; border: none; cursor: pointer; }
    .btn-ghost-link::after { content: "→"; margin-left: 6px; }

    .badge-tag { display: inline-block; background-color: var(--color-soft); color: var(--color-text-ink); font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border-hairline); }

    .has-corner-square { position: relative; }
    .has-corner-square::before { content: ""; position: absolute; top: 0; left: 0; width: 12px; height: 12px; background-color: var(--color-brand-primary); z-index: 2; }

    .site-header { background-color: var(--color-black); border-bottom: 1px solid var(--color-border-dark); height: 64px; display: flex; align-items: center; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; width: 100%; }
    .brand-logo { font-size: 18px; font-weight: 700; letter-spacing: 0.08em; color: var(--color-text-on-dark); display: flex; align-items: center; gap: 8px; }
    .brand-logo span { display: inline-block; width: 10px; height: 10px; background-color: var(--color-brand-primary); }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { color: var(--color-text-on-dark); font-size: 15px; font-weight: 600; }
    .nav-links a:hover { color: var(--color-brand-primary); }

    .hero-section { background-color: var(--color-black); color: var(--color-text-on-dark); padding: 80px 0; border-bottom: 1px solid var(--color-border-dark); }
    .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
    .hero-eyebrow { color: var(--color-brand-primary); margin-bottom: 12px; }
    .hero-headline { margin-bottom: 20px; }
    .hero-subhead { font-size: 18px; color: var(--color-text-on-dark-mute); margin-bottom: 32px; max-width: 540px; }
    .hero-actions { display: flex; gap: 16px; }
    .hero-image-panel { position: relative; height: 420px; border: 1px solid var(--color-border-dark); overflow: hidden; border-radius: var(--radius-sm); }
    .hero-image-panel img { width: 100%; height: 100%; object-fit: cover; }

    .section-py { padding: 64px 0; }
    .section-header { margin-bottom: 32px; }
    .section-header .caption-md { color: var(--color-text-mute); margin-bottom: 8px; }
    .grid-4up { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .grid-3up { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

    .feature-card { background-color: var(--color-canvas); border: 1px solid var(--color-border-hairline); border-radius: var(--radius-sm); padding: 32px; display: flex; flex-direction: column; }
    .feature-num { font-size: 24px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 16px; }
    .feature-card .heading-md { margin-bottom: 12px; color: var(--color-text-ink); }
    .feature-card .body-sm { color: var(--color-text-mute); }

    .resource-card { background-color: var(--color-canvas); border: 1px solid var(--color-border-hairline); border-radius: var(--radius-sm); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
    .resource-img-wrap { width: 100%; aspect-ratio: 16 / 9; background-color: var(--color-soft); margin-bottom: 16px; overflow: hidden; }
    .resource-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .resource-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .resource-card .card-title { margin-bottom: 8px; color: var(--color-text-ink); }
    .resource-card .body-sm { color: var(--color-text-mute); margin-bottom: 20px; }

    .stat-card { background-color: var(--color-canvas); border: 1px solid var(--color-border-hairline); border-radius: var(--radius-sm); padding: 32px; }
    .stat-metric { font-size: 40px; font-weight: 700; color: var(--color-brand-primary); line-height: 1.1; margin-bottom: 8px; }

    .dark-cta-strip { background-color: var(--color-black); color: var(--color-text-on-dark); padding: 48px 0; border-top: 1px solid var(--color-border-dark); border-bottom: 1px solid var(--color-border-dark); }
    .cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; }

    .site-footer { background-color: var(--color-black); color: var(--color-text-on-dark-mute); padding: 64px 0 32px; }
    .footer-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px; margin-bottom: 48px; }
    .footer-col-title { font-size: 14px; font-weight: 700; color: var(--color-text-on-dark); margin-bottom: 16px; }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
    .footer-links a { font-size: 14px; color: var(--color-text-on-dark-mute); }
    .footer-links a:hover { color: var(--color-brand-primary); }
    .footer-bottom { border-top: 1px solid var(--color-border-dark); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }

    @media (max-width: 1024px) {
      .grid-4up { grid-template-columns: repeat(2, 1fr); }
      .hero-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 768px) {
      .grid-4up, .grid-3up { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .cta-inner { flex-direction: column; align-items: flex-start; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .footer-bottom { flex-direction: column; gap: 12px; align-items: flex-start; }
      .display-xl { font-size: 34px; }
      .display-lg { font-size: 26px; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container nav-inner">
      <a href="#" class="brand-logo"><span></span> AURORA ESTATES</a>
      <ul class="nav-links">
        <li><a href="#properties">Properties</a></li>
        <li><a href="#developments">Developments</a></li>
        <li><a href="#investment">Institutional Investment</a></li>
        <li><a href="#about">Company</a></li>
      </ul>
      <button class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 14px;">Contact Advisory</button>
    </div>
  </header>

  <section class="hero-section">
    <div class="container hero-grid">
      <div>
        <p class="caption-md hero-eyebrow">Enterprise Real Estate Infrastructure</p>
        <h1 class="display-xl hero-headline">Engineering Institutional Real Estate Portfolios.</h1>
        <p class="hero-subhead">AURORA ESTATES delivers ultra-prime architectural residences, commercial towers, and master-planned land assets tailored for family offices and institutional investors.</p>
        <div class="hero-actions">
          <button class="btn-primary">Explore Portfolios</button>
          <button class="btn-outline-dark">Investor Prospectus</button>
        </div>
      </div>
      <div class="hero-image-panel has-corner-square">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Aurora Landmark Architecture">
      </div>
    </div>
  </section>

  <section class="section-py" style="background-color: var(--color-soft); border-bottom: 1px solid var(--color-border-hairline);">
    <div class="container">
      <div class="grid-4up">
        <div class="stat-card has-corner-square"><div class="stat-metric">$4.8B</div><div class="body-sm">Assets Under Management</div></div>
        <div class="stat-card has-corner-square"><div class="stat-metric">320+</div><div class="body-sm">Landmark Developments</div></div>
        <div class="stat-card has-corner-square"><div class="stat-metric">14.2%</div><div class="body-sm">Historical IRR</div></div>
        <div class="stat-card has-corner-square"><div class="stat-metric">100%</div><div class="body-sm">Zero-Carbon Construction Target</div></div>
      </div>
    </div>
  </section>

  <section class="section-py">
    <div class="container">
      <div class="section-header">
        <div class="caption-md">Engineering Disciplines</div>
        <h2 class="display-lg">Disciplined Asset Architecture</h2>
      </div>
      <div class="grid-3up">
        <div class="feature-card has-corner-square">
          <div class="feature-num">01</div>
          <h3 class="heading-md">Architectural Integrity</h3>
          <p class="body-sm">Rigorous structural engineering, international BIM standards, and LEED Platinum certifications embedded into every square meter.</p>
        </div>
        <div class="feature-card has-corner-square">
          <div class="feature-num">02</div>
          <h3 class="heading-md">Algorithmic Site Selection</h3>
          <p class="body-sm">Predictive demographic modeling and micro-location yield forecasting ensure superior capital appreciation over 10-year horizons.</p>
        </div>
        <div class="feature-card has-corner-square">
          <div class="feature-num">03</div>
          <h3 class="heading-md">Institutional Governance</h3>
          <p class="body-sm">Audited financial transparency, escrow protection, and legal certainty structured specifically for global private investors.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section-py" style="background-color: var(--color-soft); border-top: 1px solid var(--color-border-hairline);">
    <div class="container">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div class="caption-md">Prime Assets</div>
          <h2 class="display-lg">Curated Developments</h2>
        </div>
        <button class="btn-ghost-link">View Full 300+ Gallery</button>
      </div>
      <div class="grid-4up">
        <div class="resource-card has-corner-square">
          <div>
            <div class="resource-img-wrap"><img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Celeste Business Park"></div>
            <div class="resource-meta"><span class="badge-tag">Commercial</span><span class="utility-xs" style="color: var(--color-text-mute);">Dubai</span></div>
            <h4 class="card-title">Celeste Business Park</h4>
            <p class="body-sm">Grade-A corporate headquarters with direct metro connectivity.</p>
          </div>
          <button class="btn-ghost-link">View Asset</button>
        </div>
        <div class="resource-card has-corner-square">
          <div>
            <div class="resource-img-wrap"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Palm Court Villas"></div>
            <div class="resource-meta"><span class="badge-tag">Villas</span><span class="utility-xs" style="color: var(--color-text-mute);">Abu Dhabi</span></div>
            <h4 class="card-title">Palm Court Villas</h4>
            <p class="body-sm">Private coastal waterfront residences with bespoke infinity marina.</p>
          </div>
          <button class="btn-ghost-link">View Asset</button>
        </div>
        <div class="resource-card has-corner-square">
          <div>
            <div class="resource-img-wrap"><img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Aurora Skyline Towers"></div>
            <div class="resource-meta"><span class="badge-tag">Penthouse</span><span class="utility-xs" style="color: var(--color-text-mute);">Mumbai</span></div>
            <h4 class="card-title">Aurora Skyline Towers</h4>
            <p class="body-sm">High-altitude private triplex residences with 360-degree city panoramas.</p>
          </div>
          <button class="btn-ghost-link">View Asset</button>
        </div>
        <div class="resource-card has-corner-square">
          <div>
            <div class="resource-img-wrap"><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" alt="Verdant Estate Lands"></div>
            <div class="resource-meta"><span class="badge-tag">Plots</span><span class="utility-xs" style="color: var(--color-text-mute);">Goa</span></div>
            <h4 class="card-title">Verdant Estate Lands</h4>
            <p class="body-sm">Master-planned nature sanctuary plots ready for customized estates.</p>
          </div>
          <button class="btn-ghost-link">View Asset</button>
        </div>
      </div>
    </div>
  </section>

  <section class="dark-cta-strip">
    <div class="container cta-inner">
      <div>
        <h3 class="heading-xl">Access Institutional Allocation Data</h3>
        <p class="body-sm" style="color: var(--color-text-on-dark-mute); margin-top: 4px;">Register for verified yield reports, off-market acquisitions, and confidential teasers.</p>
      </div>
      <button class="btn-primary">Request Portfolio Access</button>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-col-title">PORTFOLIO</div>
          <ul class="footer-links">
            <li><a href="#">Sky Residences</a></li>
            <li><a href="#">Commercial Parks</a></li>
            <li><a href="#">Waterfront Villas</a></li>
            <li><a href="#">Master Developments</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">INVESTMENT</div>
          <ul class="footer-links">
            <li><a href="#">Family Office Portal</a></li>
            <li><a href="#">Yield Modeling</a></li>
            <li><a href="#">Tax & Jurisdiction</a></li>
            <li><a href="#">Asset Management</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">GOVERNANCE</div>
          <ul class="footer-links">
            <li><a href="#">ESG Standards</a></li>
            <li><a href="#">BIM Technology</a></li>
            <li><a href="#">Audit Disclosures</a></li>
            <li><a href="#">Executive Board</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">REGIONS</div>
          <ul class="footer-links">
            <li><a href="#">Dubai & UAE</a></li>
            <li><a href="#">Mumbai NCR</a></li>
            <li><a href="#">London & Zurich</a></li>
            <li><a href="#">Singapore</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">DISCLOSURE</div>
          <p class="utility-xs" style="color: var(--color-text-mute); line-height: 1.6;">AURORA ESTATES HOLDINGS LTD. ALL ASSETS OFFERED ACCORDING TO APPLICABLE JURISDICTION REGULATIONS.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="utility-xs">© 2026 AURORA ESTATES. ALL RIGHTS RESERVED.</p>
        <p class="utility-xs" style="color: var(--color-text-mute);">STRICT ENGINEERING DESIGN SYSTEM COMPLIANT</p>
      </div>
    </div>
  </footer>
</body>
</html>
