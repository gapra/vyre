---
id: semantic-html
category: a11y
title: Semantic HTML First
severity: high
refs: ["html:semantics","aria:first-rule"]
---

# Semantic HTML First

> Use the right element for the job. ARIA is a fallback, not a starting point.

**Severity:** `high`

## Rule

<button> for buttons, <a> for links, <nav>/<main>/<aside> for landmarks, <h1>-<h6> for hierarchy. Only add ARIA when no semantic element fits.

## Do

- <button> for clickable actions
- <a href> for navigation
- Use <label> for form fields

## Don't

- <div onClick> as a button
- Spans with role='button' instead of <button>
- <h3> styled to look like h1 just for size

## References

- `html:semantics`
- `aria:first-rule`

