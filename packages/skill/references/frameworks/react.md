# Vyre + React

Patterns for using Vyre tokens in React.

## Setup

```bash
pnpm add @gapra/vyre-tokens
```

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite)
import '@gapra/vyre-tokens/css';
```

## Component patterns

### Inline styles using CSS variables

```tsx
function Button({ variant = 'primary', children }) {
  return (
    <button
      className={`btn btn-${variant}`}
      style={{
        background: `var(--vyre-interactive-${variant})`,
        color: `var(--vyre-interactive-${variant}-foreground)`,
      }}
    >
      {children}
    </button>
  );
}
```

### CSS Modules

```css
/* Button.module.css */
.button {
  background: var(--vyre-interactive-primary);
  color: var(--vyre-interactive-primary-foreground);
  padding: var(--vyre-space-2) var(--vyre-space-4);
  border-radius: var(--vyre-radius-md);
  font-weight: var(--vyre-font-weight-medium);
}
.button:hover { background: var(--vyre-interactive-primary-hover); }
.button:focus-visible {
  outline: 2px solid var(--vyre-ring-default);
  outline-offset: 2px;
}
```

```tsx
import styles from './Button.module.css';
export const Button = (props) => <button className={styles.button} {...props} />;
```

### Tailwind v4 (recommended)

```tsx
function Card({ children }) {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm">
      {children}
    </div>
  );
}

function Button({ children }) {
  return (
    <button className="bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors">
      {children}
    </button>
  );
}
```

### TypeScript token access

```tsx
import { tokens } from '@gapra/vyre-tokens';

const primary = tokens.color.primitive.indigo['9'];
```

## Server Components (Next.js 14+)

CSS variables work everywhere — server, client, edge. No client JS needed.

```tsx
// app/page.tsx (server component)
export default function Page() {
  return (
    <div style={{
      background: 'var(--vyre-surface-background)',
      color: 'var(--vyre-content-primary)',
      padding: 'var(--vyre-space-8)',
    }}>
      <h1>Hello</h1>
    </div>
  );
}
```

## Theme switching

```tsx
'use client';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  );
}
```

```css
/* globals.css */
[data-theme="dark"] {
  --vyre-surface-background: oklch(15% 0.01 247);
  --vyre-content-primary: oklch(95% 0.005 247);
  /* override other tokens */
}
```

## Accessibility helpers

```tsx
// Always include focus-visible styles
function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="size-11 inline-flex items-center justify-center rounded-md hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {icon}
    </button>
  );
}
```

## Common pitfalls

- ❌ Don't compute color in JS; let CSS variables do it.
- ❌ Don't use `style={{ color: '#fff' }}` — use tokens.
- ❌ Don't skip `focus-visible` — keyboard users need it.
- ✅ Always pair `bg-*` with matching `text-*-foreground`.
- ✅ Use logical properties (padding-inline, margin-block) for RTL support.
