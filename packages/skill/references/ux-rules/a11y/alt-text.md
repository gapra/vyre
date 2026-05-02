---
id: alt-text
category: a11y
title: Image Alt Text
severity: high
refs: ["wcag:1.1.1"]
---

# Image Alt Text

> Meaningful images need descriptive alt; decorative images need alt=''.

**Severity:** `high`

## Rule

Alt describes purpose, not appearance. Empty alt='' for purely decorative images. Don't repeat adjacent caption text.

## Do

- alt='Bar chart showing 2024 revenue grew 23%'
- alt='' for decorative dividers
- Describe charts in text + alt

## Don't

- alt='image.jpg'
- alt='photo'
- Skip alt attribute entirely

## References

- `wcag:1.1.1`

