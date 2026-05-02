# Vyre + Tailwind v4

Vyre is purpose-built for Tailwind v4's `@theme` directive.

## Setup

```bash
pnpm add tailwindcss @gapra/vyre-tokens
```

```css
/* app.css */
@import "tailwindcss";
@import "@gapra/vyre-tokens/tailwind";
```

That's it. Tailwind v4 picks up Vyre tokens via `@theme` and exposes them as utilities.

## Available utilities

### Colors
```html
<div class="bg-primary text-primary-foreground">…</div>
<div class="bg-surface-card text-content-primary">…</div>
<div class="bg-status-success-solid text-status-success-foreground">…</div>
<div class="border border-border-subtle">…</div>
```

### Spacing (8-px grid)
```html
<div class="p-4 gap-2 mb-6">…</div>
```

`p-4` = 16px (space-4), `gap-2` = 8px (space-2), `mb-6` = 24px (space-6).

### Typography
```html
<h1 class="text-4xl font-bold leading-tight">…</h1>
<p class="text-base leading-normal">…</p>
<code class="font-mono text-sm">…</code>
```

### Radius
```html
<div class="rounded-md">…</div>     <!-- 8px -->
<div class="rounded-xl">…</div>     <!-- 16px -->
<div class="rounded-2xl">…</div>    <!-- 24px -->
<div class="rounded-full">…</div>   <!-- pill -->
```

### Shadow
```html
<div class="shadow-sm">…</div>
<div class="shadow-lg">…</div>
```

### Motion
```html
<div class="transition-colors duration-fast ease-standard">…</div>
```

## Custom utilities

Add component utilities in `@layer components`:

```css
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors;
  }
  .card {
    @apply bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm;
  }
}
```

## Dark mode

Tailwind v4 supports `prefers-color-scheme` natively:

```css
@theme {
  --color-surface-background: oklch(99% 0.002 247);
  --color-content-primary: oklch(18% 0.018 247);
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-surface-background: oklch(15% 0.01 247);
    --color-content-primary: oklch(95% 0.005 247);
  }
}
```

For manual toggle, use the `[data-theme="dark"]` selector pattern.

## Variants

```html
<div class="hover:bg-primary-hover focus-visible:outline-ring">…</div>
<div class="dark:bg-surface-inverse dark:text-content-inverse">…</div>
<div class="motion-safe:transition-transform motion-reduce:transition-none">…</div>
```

## Common pitfalls

- ❌ Don't use Tailwind v3 `tailwind.config.js` — v4 uses CSS-only config.
- ❌ Don't use `bg-[#ff0000]` arbitrary values when tokens exist.
- ✅ Use `bg-primary` not `bg-blue-500`.
- ✅ Always pair `bg-*` with `text-*-foreground`.
- ✅ Use `motion-safe:` and `motion-reduce:` for accessibility.

## Migration from Tailwind v3

If migrating, replace your `tailwind.config.js` `theme.extend.colors` with the Vyre `@theme` import. All standard color utilities now reference Vyre tokens.
