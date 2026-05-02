# Vyre + Vue

Patterns for using Vyre tokens in Vue 3.

## Setup

```bash
pnpm add @gapra/vyre-tokens
```

```ts
// main.ts
import '@gapra/vyre-tokens/css';
```

## Component patterns

### Single-file component with scoped styles

```vue
<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary' }>();
</script>

<template>
  <button :class="['btn', `btn-${variant ?? 'primary'}`]">
    <slot />
  </button>
</template>

<style scoped>
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

```vue
<template>
  <div class="bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm">
    <slot />
  </div>
</template>
```

### CSS variable interpolation

```vue
<script setup>
const props = defineProps<{ accent: string }>();
</script>

<template>
  <div :style="`--accent: ${accent}`">
    <slot />
  </div>
</template>

<style scoped>
.button {
  background: var(--accent, var(--vyre-interactive-primary));
}
</style>
```

### v-bind in CSS (Vue 3 only)

```vue
<script setup>
const accent = ref('var(--vyre-interactive-primary)');
</script>

<style scoped>
.button { background: v-bind(accent); }
</style>
```

## Theme switching

```ts
// composables/useTheme.ts
import { ref, watchEffect } from 'vue';

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light');
  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value;
  });
  return { theme };
}
```

## Common pitfalls

- ❌ Don't use `:style` with raw colors.
- ✅ Use scoped styles + CSS variables.
- ✅ Always include focus-visible.
- ✅ Use `<button>` not `<div @click>`.
