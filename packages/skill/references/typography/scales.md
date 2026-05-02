# Typography Scales

Vyre uses a modular type scale with two tracks:

- **Body track** (1.125 ratio, major second): xs → lg, calm and readable
- **Display track** (1.25 ratio, major third): xl → 9xl, dramatic for headlines

## Type scale

| Token | Size | Use for |
|---|---|---|
| `xs` (12px) | 0.75rem | Captions, fine print |
| `sm` (14px) | 0.875rem | UI labels, dense data |
| `base` (16px) | 1rem | Body text default |
| `lg` (18px) | 1.125rem | Comfortable reading |
| `xl` (20px) | 1.25rem | Subheadings |
| `2xl` (24px) | 1.5rem | h3 |
| `3xl` (30px) | 1.875rem | h2 |
| `4xl` (36px) | 2.25rem | h1 |
| `5xl` (48px) | 3rem | Page titles |
| `6xl` (60px) | 3.75rem | Hero headlines |
| `7xl` (72px) | 4.5rem | Display |
| `8xl` (96px) | 6rem | Massive display |
| `9xl` (128px) | 8rem | Statement |

## Hierarchy template

```css
h1 { font-size: var(--vyre-font-size-4xl); font-weight: var(--vyre-font-weight-bold); line-height: var(--vyre-font-line-height-tight); }
h2 { font-size: var(--vyre-font-size-3xl); font-weight: var(--vyre-font-weight-semibold); line-height: var(--vyre-font-line-height-tight); }
h3 { font-size: var(--vyre-font-size-2xl); font-weight: var(--vyre-font-weight-semibold); line-height: var(--vyre-font-line-height-snug); }
h4 { font-size: var(--vyre-font-size-xl);  font-weight: var(--vyre-font-weight-semibold); line-height: var(--vyre-font-line-height-snug); }
h5 { font-size: var(--vyre-font-size-lg);  font-weight: var(--vyre-font-weight-medium); }
p  { font-size: var(--vyre-font-size-base); line-height: var(--vyre-font-line-height-normal); }
small { font-size: var(--vyre-font-size-sm); }
```

## Line height pairing

| Font size | Line height |
|---|---|
| Display (5xl+) | tight (1.15) |
| Headings (2xl-4xl) | snug (1.3) |
| Body (base-xl) | normal (1.5) |
| Long-form reading | relaxed (1.65) |
| Editorial | loose (1.85) |

## Letter spacing

- Display sizes: tight (-0.025em) — counteracts gappy appearance at large sizes
- Body: normal (0)
- All-caps labels: wider (0.05em) — restore legibility
- Tabular numbers: normal

## Fluid typography

For responsive scaling, use `clamp()`:

```css
h1 {
  font-size: clamp(
    var(--vyre-font-size-3xl),
    5vw + 1rem,
    var(--vyre-font-size-6xl)
  );
}
```

## Font features

Enable these for professional output:

```css
body {
  font-feature-settings: "kern", "liga", "calt", "pnum";
}
.tabular {
  font-variant-numeric: tabular-nums;
}
```
