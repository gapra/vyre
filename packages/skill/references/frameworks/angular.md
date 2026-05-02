---
id: angular
framework: angular
versions:
  recommended: ">=17.0.0"
  minimum: ">=15.0.0"
---

# Angular Integration

> Use vyre tokens with Angular's modern standalone API and signals.

## Installation

```bash
ng add @gapra/vyre-tokens
# or
npm install @gapra/vyre-tokens
```

## Global Token Import

In `src/styles.scss` (or `src/styles.css`):

```scss
@import "@gapra/vyre-tokens/dist/css/tokens.css";

// Optional: per-app brand override
:root {
  --vyre-color-interactive-primary: var(--vyre-color-purple-9);
}
```

Make sure `angular.json` includes the styles file:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles.scss"]
          }
        }
      }
    }
  }
}
```

## SCSS Variables (Optional)

If you prefer Sass variables alongside CSS custom properties:

```scss
@use "@gapra/vyre-tokens/dist/scss/tokens" as vyre;

.btn {
  padding: vyre.$spacing-2 vyre.$spacing-4;
  background: var(--vyre-color-interactive-primary);
}
```

## Standalone Component Example

```typescript
// button.component.ts
import { Component, Input, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

type Variant = "primary" | "secondary" | "ghost";

@Component({
  selector: "vy-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="classes()" [attr.aria-busy]="loading() ? 'true' : null">
      <ng-content />
    </button>
  `,
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  variant = signal<Variant>("primary");
  loading = signal(false);

  @Input("variant") set variantInput(v: Variant) { this.variant.set(v); }
  @Input("loading") set loadingInput(v: boolean) { this.loading.set(v); }

  classes = computed(() => `vy-btn vy-btn--${this.variant()}`);
}
```

```scss
// button.component.scss
.vy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vyre-spacing-2);
  padding: var(--vyre-spacing-2) var(--vyre-spacing-4);
  font: var(--vyre-typography-button);
  border-radius: var(--vyre-radius-md);
  border: 1px solid transparent;
  transition: background var(--vyre-motion-duration-fast)
              var(--vyre-motion-easing-standard);
  min-height: 44px; /* touch target */

  &:focus-visible {
    outline: 2px solid var(--vyre-color-focus-ring);
    outline-offset: 2px;
  }

  &--primary {
    background: var(--vyre-color-interactive-primary);
    color: var(--vyre-color-interactive-primary-foreground);

    &:hover:not(:disabled) { background: var(--vyre-color-interactive-primary-hover); }
    &:active:not(:disabled) { background: var(--vyre-color-interactive-primary-active); }
  }

  &--secondary {
    background: var(--vyre-color-surface-2);
    color: var(--vyre-color-content-primary);
    border-color: var(--vyre-color-border-default);
  }

  &--ghost {
    background: transparent;
    color: var(--vyre-color-content-primary);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
```

## Theme Switching with Signals

```typescript
// theme.service.ts
import { Injectable, signal, effect } from "@angular/core";

type Theme = "light" | "dark" | "system";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private storageKey = "vyre-theme";
  theme = signal<Theme>(this.read());

  constructor() {
    effect(() => {
      const t = this.theme();
      const resolved = t === "system"
        ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : t;
      document.documentElement.dataset.theme = resolved;
      localStorage.setItem(this.storageKey, t);
    });
  }

  private read(): Theme {
    return (localStorage.getItem(this.storageKey) as Theme) ?? "system";
  }

  toggle() {
    this.theme.update((t) => (t === "dark" ? "light" : "dark"));
  }
}
```

In your CSS, scope tokens via `[data-theme="dark"]`:

```css
:root { /* light defaults */ }

[data-theme="dark"] {
  --vyre-color-surface-1: var(--vyre-color-slate-1);
  --vyre-color-content-primary: var(--vyre-color-slate-12);
  /* ... */
}
```

## Tailwind in Angular

If using Tailwind v4:

```css
/* src/styles.css */
@import "@gapra/vyre-tokens/dist/tailwind/theme.css";
@import "tailwindcss";
```

Then use vyre utilities directly in templates: `class="bg-vyre-surface-2 text-vyre-content-primary"`.

## Anti-Patterns

- ❌ Hard-coding hex values in component styles — always reference vyre tokens
- ❌ Importing tokens.css inside component styles (bloats per-component CSS) — global once is enough
- ❌ Bypassing `[data-theme]` and toggling individual variables manually
