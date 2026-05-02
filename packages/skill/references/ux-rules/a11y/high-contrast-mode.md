---
id: high-contrast-mode
category: a11y
title: Windows High Contrast Mode
severity: medium
refs: ["forced-colors-mode"]
---

# Windows High Contrast Mode

> Test in forced-colors mode; ensure UI remains usable.

**Severity:** `medium`

## Rule

Don't rely on background-color or background-image alone. Use border, outline, or text to convey state.

## Do

- Test in Edge with forced-colors enabled
- Use system color keywords (CanvasText, ButtonFace) where appropriate

## Don't

- Convey selected state with background-color only
- Use background images for required UI

## References

- `forced-colors-mode`

