---
id: language-attr
category: a11y
title: Document Language
severity: medium
refs: ["wcag:3.1.1","wcag:3.1.2"]
---

# Document Language

> <html lang='...'> and lang attributes on foreign-language inline content.

**Severity:** `medium`

## Rule

Screen readers use this to choose pronunciation. Update lang on language-switched pages.

## Do

- <html lang='en'>
- <span lang='fr'>de rigueur</span>

## Don't

- Omit lang attribute
- Set wrong lang code

## References

- `wcag:3.1.1`
- `wcag:3.1.2`

