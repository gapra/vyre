# Grid System

Vyre uses a fluid 12-column grid with intrinsic responsive sizing.

## Default container

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--vyre-space-6);
}
```

## 12-column grid

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--vyre-space-6);
}
```

## Responsive breakpoints

| Token | Min width | Use for |
|---|---|---|
| `xs` | 0 | Mobile portrait |
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

## Container queries (preferred)

Container queries respond to parent size, not viewport. Use them for components.

```css
.card-grid {
  container-type: inline-size;
}
@container (min-width: 600px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

## Auto-fit / auto-fill

For card grids that respond to content:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--vyre-space-6);
}
```

## Common layouts

### Two-column with sidebar

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
}
```

### Holy grail

```css
.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "nav main aside" 1fr
    "footer footer footer" auto / 200px 1fr 200px;
  min-height: 100vh;
}
```

### Asymmetric bento

```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: var(--vyre-space-4);
}
.bento .feature { grid-column: span 2; grid-row: span 2; }
```

## Don't

- Use float for layout (decade-old anti-pattern)
- Mix flex + grid in the same parent
- Hard-code pixel widths in grid columns (use fr or auto)
- Override gap with margin on children
