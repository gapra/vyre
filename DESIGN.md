---
# DESIGN.md — Vyre Design System
# Format: Google Stitch / DESIGN.md (Apache-2.0, open-sourced April 2026)
# Auto-generated snapshot. Source of truth: packages/tokens/src/
# Linter: run `pnpm validate` to check WCAG/APCA + broken refs.

name: vyre
version: 0.2.0
license: MIT
package: "@gapra/vyre-tokens"

# ── Color model ──────────────────────────────────────────────────────────────
color_space: oklch
fallback_format: hex   # emitted alongside oklch() for older WebViews
gamut: p3              # wide-gamut where supported; sRGB fallback guaranteed

# ── Token tiers ──────────────────────────────────────────────────────────────
tiers:
  - id: core
    path: packages/tokens/src/core/
    description: >
      Tier 1 seed tokens. OKLCH color primitives, 8-px spacing grid,
      modular type scale, motion curves, shadow elevations.
      Never reference these directly in components — use alias tokens.

  - id: semantic
    path: packages/tokens/src/semantic/
    description: >
      Tier 2 scale tokens. 12-step Radix-style color scales per hue
      (steps 1–2 bg, 3–5 component, 6–8 borders, 9–10 solid, 11–12 text)
      plus alpha variants. Generated algorithmically via OKLCH lightness ramps.

  - id: alias
    path: packages/tokens/src/alias/
    description: >
      Tier 3 semantic/role tokens. Named by intent, not value.
      Components MUST use only these tokens. All backgrounds have a
      matching -foreground pair; all interactive states have hover/active.

# ── Alias token schema ───────────────────────────────────────────────────────
tokens:
  # Surface / background
  surface:
    background:   { ref: color.scales.slate.1,   role: "App/page background" }
    subtle:       { ref: color.scales.slate.2,   role: "Subtle section bg" }
    muted:        { ref: color.scales.slate.3,   role: "Muted / recessed section" }
    panel:        { ref: color.primitive.white,  role: "Panel, sidebar" }
    card:         { ref: color.primitive.white,  role: "Card surface" }
    popover:      { ref: color.primitive.white,  role: "Popover, dropdown, tooltip" }
    overlay:      { ref: color.scales.slate.12,  role: "Modal scrim" }
    inverse:      { ref: color.scales.slate.12,  role: "Inverted surface (tooltip bg)" }
    raised:       { ref: color.primitive.white,  role: "Elevated / floating" }
    sunken:       { ref: color.scales.slate.2,   role: "Recessed input bg" }

  # Content / text
  content:
    primary:      { ref: color.scales.slate.12,   role: "Body & heading text" }
    secondary:    { ref: color.scales.slate.11,   role: "Secondary text" }
    tertiary:     { ref: color.scales.slate.10,   role: "Hint / tertiary" }
    muted:        { ref: color.scales.slate.9,    role: "Placeholder, disabled hint" }
    disabled:     { ref: color.scales.slate.8,    role: "Disabled text" }
    inverse:      { ref: color.scales.slate.1,    role: "Text on inverted surface" }
    link:         { ref: color.scales.indigo.11,  role: "Hyperlink (AA on white)" }
    link-hover:   { ref: color.scales.indigo.10,  role: "Hovered hyperlink" }

  # Interactive / button
  interactive:
    primary:            { ref: color.scales.indigo.9,   role: "Primary action bg" }
    primary-foreground: { ref: color.primitive.white,   role: "Text on primary bg" }
    primary-hover:      { ref: color.scales.indigo.10,  role: "Primary hover bg" }
    primary-active:     { ref: color.scales.indigo.11,  role: "Primary active/pressed bg" }
    primary-subtle:     { ref: color.scales.indigo.3,   role: "Tinted primary area" }
    secondary:            { ref: color.scales.slate.3,  role: "Secondary action bg" }
    secondary-foreground: { ref: color.scales.slate.12, role: "Text on secondary" }
    secondary-hover:      { ref: color.scales.slate.4,  role: "Secondary hover" }
    secondary-active:     { ref: color.scales.slate.5,  role: "Secondary active" }
    ghost:              { ref: color.primitive.transparent, role: "Ghost / text button bg" }
    ghost-foreground:   { ref: color.scales.slate.12,   role: "Ghost button text" }
    ghost-hover:        { ref: color.scales.slate.3,    role: "Ghost hover bg" }
    destructive:            { ref: color.scales.red.9,    role: "Destructive action bg" }
    destructive-foreground: { ref: color.primitive.white, role: "Text on destructive" }
    destructive-hover:      { ref: color.scales.red.10,   role: "Destructive hover" }

  # Border
  border:
    subtle:      { ref: color.scales.slate.4, role: "Hairline / decorative divider" }
    default:     { ref: color.scales.slate.6, role: "Component border" }
    strong:      { ref: color.scales.slate.8, role: "Emphasis border" }
    interactive: { ref: color.scales.indigo.7, role: "Input focus border (unfocused)" }
    focus:       { ref: color.scales.indigo.8, role: "Keyboard focus ring border" }

  # Focus ring
  ring:
    default: { ref: color.scales.indigo.8, role: "Focus ring color" }
    offset:  { ref: color.primitive.white,  role: "Focus ring offset (matches surface)" }

  # Status
  status:
    success:
      solid:             { ref: color.scales.green.9,  role: "Success badge bg" }
      foreground:        { ref: color.primitive.white,  role: "Text on success solid" }
      subtle:            { ref: color.scales.green.3,  role: "Success callout bg" }
      subtle-foreground: { ref: color.scales.green.11, role: "Text on success callout" }
      border:            { ref: color.scales.green.7,  role: "Success border" }
    warning:
      solid:             { ref: color.scales.amber.9,  role: "Warning badge bg" }
      foreground:        { ref: color.scales.amber.12, role: "Text on warning solid" }
      subtle:            { ref: color.scales.amber.3,  role: "Warning callout bg" }
      subtle-foreground: { ref: color.scales.amber.11, role: "Text on warning callout" }
      border:            { ref: color.scales.amber.7,  role: "Warning border" }
    danger:
      solid:             { ref: color.scales.red.9,    role: "Error/danger badge bg" }
      foreground:        { ref: color.primitive.white,  role: "Text on danger solid" }
      subtle:            { ref: color.scales.red.3,    role: "Danger callout bg" }
      subtle-foreground: { ref: color.scales.red.11,   role: "Text on danger callout" }
      border:            { ref: color.scales.red.7,    role: "Danger border" }
    info:
      solid:             { ref: color.scales.blue.9,   role: "Info badge bg" }
      foreground:        { ref: color.primitive.white,  role: "Text on info solid" }
      subtle:            { ref: color.scales.blue.3,   role: "Info callout bg" }
      subtle-foreground: { ref: color.scales.blue.11,  role: "Text on info callout" }
      border:            { ref: color.scales.blue.7,   role: "Info border" }

# ── Spacing ──────────────────────────────────────────────────────────────────
spacing:
  system: "8-px base grid with 4-px half-step"
  scale:
    0:   0px
    px:  1px
    0-5: 2px
    1:   4px
    2:   8px
    3:   12px
    4:   16px
    5:   20px
    6:   24px
    8:   32px
    10:  40px
    12:  48px
    16:  64px

# ── Typography ───────────────────────────────────────────────────────────────
typography:
  scale: modular   # ratio ≈1.25 (Major Third)
  base_size: 16px
  families:
    sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
    mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"]
  weights: [400, 500, 600, 700]
  line_heights:
    tight:  1.25
    normal: 1.5
    loose:  1.75

# ── Themes / modes ──────────────────────────────────────────────────────────
themes:
  - id: light
    selector: ":root, [data-theme='light']"
    path: packages/tokens/src/themes/light.tokens.json
    dist: packages/tokens/dist/css/themes/light.css

  - id: dark
    selector: "[data-theme='dark'], .dark"
    path: packages/tokens/src/themes/dark.tokens.json
    dist: packages/tokens/dist/css/themes/dark.css

  - id: high-contrast
    selector: "[data-contrast='high']"
    path: packages/tokens/src/themes/high-contrast.tokens.json
    dist: packages/tokens/dist/css/themes/high-contrast.css
    note: "Layer on top of light or dark."

  - id: tritanopia
    selector: "[data-vision='tritanopia']"
    path: packages/tokens/src/themes/tritanopia.tokens.json
    dist: packages/tokens/dist/css/themes/tritanopia.css

  - id: colorblind
    selector: "[data-vision='colorblind']"
    path: packages/tokens/src/themes/colorblind.tokens.json
    dist: packages/tokens/dist/css/themes/colorblind.css
    cvd: [deuteranopia, protanopia, deuteranomaly, protanomaly]

# ── Palettes ─────────────────────────────────────────────────────────────────
palettes:
  count: 177
  index: packages/tokens/src/palettes/_index.json
  generator: packages/tokens/scripts/generate-palettes.mjs
  schema:
    inputs: [accentHue, grayHue, mode, chromaLevel, contrastTarget, personality]
    personalities: [vivid, muted, pastel, brutalist, aurora, editorial]
  tags: [brand, editorial, dashboard, dark-only, high-contrast, colorblind-safe, pastel, neon, warm, cool]

# ── Outputs ──────────────────────────────────────────────────────────────────
exports:
  css:      packages/tokens/dist/css/tokens.css
  tailwind: packages/tokens/dist/tailwind/theme.css
  scss:     packages/tokens/dist/scss/_tokens.scss
  js:       packages/tokens/dist/js/tokens.js
  dts:      packages/tokens/dist/js/tokens.d.ts
  themes:   packages/tokens/dist/css/themes/

# ── Accessibility contract ───────────────────────────────────────────────────
accessibility:
  standards: [WCAG 2.2 AA, APCA]
  body_text:
    wcag_min: 4.5   # AA ratio
    apca_min: 60    # Lc
  ui_elements:
    wcag_min: 3.0
    apca_min: 45
  ci_gate: "pnpm validate — fails build if any alias pair misses thresholds"

# ── Cascade layer order ──────────────────────────────────────────────────────
cascade_layers: "@layer theme, base, components, utilities"

---

## Rationale

### Why OKLCH?

OKLCH (Oklab Lightness-Chroma-Hue) gives **perceptual uniformity** across hues —
changing chroma or hue at a fixed lightness does not shift perceived brightness.
This makes algorithmic palette generation predictable: a 12-step scale generated
at `L = [0.11, 0.14, 0.18, 0.22, 0.26, 0.30, 0.36, 0.46, 0.55, 0.62, 0.74, 0.95]`
produces evenly-spaced perceptual steps regardless of hue angle. All major browsers
support `oklch()` natively (Safari 15.4+, Chrome 111+, Firefox 113+); we emit
an sRGB `#hex` fallback line ahead of every custom property for older WebViews and
email contexts.

### Why three tiers?

Borrowed from Ant Design v5's Seed → Map → Alias derivation:

| Tier | Name | Who uses it |
|------|------|-------------|
| 1 | Core / seed | Token generator, palette scripts |
| 2 | Semantic scales | Rarely — only for complex custom theming |
| 3 | Alias / role | **Components always** — never tiers 1 or 2 |

This prevents "token leakage": if a designer renames `indigo.9` to `cobalt.9`,
only tier-2 refs update. Component code (`interactive.primary`) never breaks.

### Why the 12-step Radix scale?

Radix's 12-step semantic convention is adopted by Shadcn, Primer, and others
because it maps cleanly to component states:

- **1–2** subtle backgrounds (app bg, sidebar bg)
- **3–5** interactive element states (normal, hover, active)
- **6–8** borders (decorative, UI, strong)
- **9–10** solid fills (purest hue, hover)
- **11–12** text (low contrast, high contrast)

Each step in Vyre is validated at build time against APCA Lc 60 for body text
and Lc 45 for UI elements on the matching background step.

### Why per-theme CSS files instead of a single @media (prefers-color-scheme)?

Explicit `[data-theme]` selectors give consumers **three-way control**:

1. OS preference (`prefers-color-scheme`) can drive the attribute via JS.
2. User can override per-page or per-component without touching the OS.
3. Nested components can independently toggle dark within a light page.

The pattern mirrors shadcn/ui and Radix Themes. Load order:

```html
<link rel="stylesheet" href="@gapra/vyre-tokens/css">          <!-- base -->
<link rel="stylesheet" href="@gapra/vyre-tokens/themes/dark">  <!-- dark override -->
```

Or in CSS:

```css
@import "@gapra/vyre-tokens/css";
/* Themes are applied at the selector level — no extra import needed */
```

### Accessibility CVD themes

The colorblind and tritanopia themes override **only status tokens** — all other
tokens (interactive primary = indigo/violet, neutrals) are already CVD-safe.
The strategy:

| Condition | Problem | Vyre solution |
|-----------|---------|---------------|
| Deuteranopia/Protanopia | Red–green confusion | Success → blue (hue 230); Danger → red-orange (hue 18) |
| Tritanopia | Blue–yellow confusion | Info → violet (hue 300); Warning → red-orange (hue 30) |

All substituted colors maintain ≥WCAG AA contrast on both light and dark surfaces.

### Cascade layers

```css
@layer theme, base, components, utilities;
```

`theme` holds `@theme {}` Tailwind v4 token declarations (lowest specificity,
overridable by everything). `components` is where Vyre component styles live.
`utilities` is where Tailwind utility classes live — always win over components,
matching Tailwind's documented intent. This mirrors MUI's recommended layer order
for Tailwind v4 coexistence.
