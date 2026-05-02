# Flex Patterns

Common flexbox compositions in Vyre.

## Stack (vertical)

```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--vyre-space-4);
}
```

## Cluster (wrapping horizontal)

For tags, button groups, breadcrumbs:

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vyre-space-2);
  align-items: center;
}
```

## Sidebar (responsive)

Sidebar collapses below content on narrow screens:

```css
.sidebar-layout {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vyre-space-6);
}
.sidebar-layout > .sidebar {
  flex-basis: 240px;
  flex-grow: 1;
}
.sidebar-layout > .main {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}
```

## Switcher (auto-flips horizontal/vertical)

When viewport is too narrow, items stack:

```css
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vyre-space-4);
}
.switcher > * {
  flex-grow: 1;
  flex-basis: calc((30rem - 100%) * 999);
}
```

## Header bar

Logo left, nav center, actions right:

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vyre-space-6);
  padding: var(--vyre-space-4) var(--vyre-space-6);
}
```

## Centered content

```css
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
}
```

## Inline pair (icon + text)

```css
.inline-pair {
  display: inline-flex;
  align-items: center;
  gap: var(--vyre-space-2);
}
```

## When to use grid vs flex

- **Use grid** for two-dimensional layouts (rows AND columns).
- **Use flex** for one-dimensional flows (a row OR a column).
- **Use grid** when you want explicit control over both axes.
- **Use flex** for content-driven sizing where you don't know item count.
