# Spacing System

Vyre uses an 8-px base grid with 4-px half-step.

## Scale

| Token | Value | Use for |
|---|---|---|
| `space-0` | 0 | Reset |
| `space-px` | 1px | Hairlines |
| `space-0-5` | 2px | Tight icon padding |
| `space-1` | 4px | Label-to-input |
| `space-2` | 8px | Inline element gap |
| `space-3` | 12px | Compact padding |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Comfortable padding |
| `space-6` | 24px | Card padding |
| `space-7` | 28px | — |
| `space-8` | 32px | Section gap |
| `space-10` | 40px | Large section gap |
| `space-12` | 48px | Major section gap |
| `space-16` | 64px | Hero padding |
| `space-20` | 80px | — |
| `space-24` | 96px | Large hero |
| `space-32` | 128px | Full-page hero |

## Rule of thumb

- **Component internal:** space-1 to space-4
- **Component external (between siblings):** space-4 to space-8
- **Section to section:** space-8 to space-16
- **Page padding:** space-6 (mobile) to space-12 (desktop)

## Vertical rhythm

For text-heavy content, multiply line-height by integer to set spacing:

```css
.article {
  line-height: 1.5;
  & > * + * { margin-block-start: 1.5em; }
  & > h2 { margin-block-start: 3em; margin-block-end: 1em; }
}
```

## Logical properties

Always prefer logical properties for international support:

| Physical | Logical |
|---|---|
| `margin-top` | `margin-block-start` |
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |

This way, RTL layouts work without overrides.

## Don't

- Use raw pixel values
- Use `0.5rem`, `1rem` directly (use space tokens)
- Mix space tokens with magic numbers
- Use margin for layout where gap or padding would do
