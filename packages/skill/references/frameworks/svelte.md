# Vyre + Svelte

Patterns for using Vyre tokens in Svelte 5.

## Setup

```bash
pnpm add @gapra/vyre-tokens
```

```ts
// app.html or +layout.svelte
import '@gapra/vyre-tokens/css';
```

## Component patterns

### Standard component

```svelte
<script lang="ts">
  let { variant = 'primary', children } = $props();
</script>

<button class="btn btn-{variant}">
  {@render children()}
</button>

<style>
  .btn {
    padding: var(--vyre-space-2) var(--vyre-space-4);
    border-radius: var(--vyre-radius-md);
    font-weight: var(--vyre-font-weight-medium);
    transition: background var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard);
  }
  .btn-primary {
    background: var(--vyre-interactive-primary);
    color: var(--vyre-interactive-primary-foreground);
  }
  .btn-primary:hover { background: var(--vyre-interactive-primary-hover); }
  .btn:focus-visible {
    outline: 2px solid var(--vyre-ring-default);
    outline-offset: 2px;
  }
</style>
```

### Tailwind v4 (recommended)

```svelte
<button class="bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md font-medium">
  {@render children()}
</button>
```

### CSS custom properties

```svelte
<script>
  let { accent = 'var(--vyre-interactive-primary)' } = $props();
</script>

<div style="--accent: {accent}">
  <slot />
</div>

<style>
  .button { background: var(--accent); }
</style>
```

## Theme switching

```svelte
<script>
  import { onMount } from 'svelte';
  let theme = $state<'light' | 'dark'>('light');
  $effect(() => {
    document.documentElement.dataset.theme = theme;
  });
</script>

<button onclick={() => theme = theme === 'light' ? 'dark' : 'light'}>
  Toggle theme
</button>
```

## Common pitfalls

- ❌ No raw colors in `style="color: red"`.
- ✅ Use the `<style>` block with tokens.
- ✅ Always handle focus-visible.
