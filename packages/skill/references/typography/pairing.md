# Typography Pairing

Pair fonts with intent. Two fonts are typically enough.

## Default Vyre pairings

### Pairing 1: Inter everywhere (safe default)
```css
:root {
  --font-display: var(--vyre-font-family-sans);
  --font-body: var(--vyre-font-family-sans);
  --font-mono: var(--vyre-font-family-mono);
}
```
Use for: SaaS, dashboards, most product UI.

### Pairing 2: Serif body + Sans display (editorial)
```css
:root {
  --font-display: "Inter Display", system-ui, sans-serif;
  --font-body: "Source Serif Pro", Georgia, serif;
}
```
Use for: blogs, magazines, long-form reading.

### Pairing 3: Display sans + body sans (modern editorial)
```css
:root {
  --font-display: "Fraunces", "Source Serif", serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```
Use for: portfolios, sophisticated marketing.

### Pairing 4: All mono (technical)
```css
:root {
  --font-display: var(--vyre-font-family-mono);
  --font-body: var(--vyre-font-family-mono);
}
```
Use for: dev tools, terminal aesthetic, brutalism.

## Pairing rules

1. **Maximum 2-3 type families** per project (display, body, mono).
2. **Contrast in style** — pair serif with sans, not two similar sans.
3. **Match x-height** — fonts with similar x-heights mix better.
4. **Test at scale** — pairings that work at body size may clash at display size.
5. **Use weights for hierarchy** — same family, different weights, before reaching for new font.

## Font loading

```html
<link rel="preconnect" href="https://rsms.me/" crossorigin>
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>

<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter.woff2') format('woff2-variations');
    font-display: swap;
    font-weight: 100 900;
  }
</style>
```

Use `font-display: swap` to avoid invisible text during load.

## Variable fonts

Prefer variable fonts (single file, all weights):
- Inter — full UI typeface
- Source Serif Pro — body serif
- JetBrains Mono — mono with ligatures
- Fraunces — expressive display serif

## Don't

- Pair similar fonts (two humanist sans clash)
- Use 4+ font families
- Mix system font with custom font in body text
- Forget mono for code (use proper monospace)
