# Vertical Rhythm

Establish a vertical rhythm so typography feels intentional.

## Baseline grid

Set a baseline using line-height × font-size:

```css
:root {
  --baseline: 1.5; /* line-height multiplier */
  --baseline-unit: calc(var(--vyre-font-size-base) * var(--baseline)); /* 24px when base is 16px */
}
```

All vertical spacing is a multiple of `--baseline-unit`.

## Lobotomized owl

Apply consistent spacing between siblings without reaching for individual margins:

```css
.flow > * + * {
  margin-block-start: 1em;
}
.flow > h2 + * { margin-block-start: 0.5em; }
.flow > * + h2 { margin-block-start: 2em; }
```

## Reading width

Optimal line length: 45-75 characters per line. Use `ch` units:

```css
.prose {
  max-inline-size: 65ch;
  margin-inline: auto;
}
```

## Heading spacing

Headings need breathing room before, tight binding after:

```css
h1, h2, h3 {
  margin-block-start: 2em;   /* big space above */
  margin-block-end: 0.5em;   /* small space below */
}
h1:first-child, h2:first-child {
  margin-block-start: 0;
}
```

## Paragraph spacing

Two options:

### Indent (traditional, print-like)
```css
p + p { text-indent: 1.5em; margin-block-start: 0; }
```

### Block spacing (web standard)
```css
p { margin-block: 1em; }
```

Don't combine both.

## Drop caps

For editorial flair:

```css
.article > p:first-of-type::first-letter {
  font-family: var(--vyre-font-family-serif);
  font-size: 4em;
  line-height: 0.85;
  float: inline-start;
  padding-inline-end: 0.1em;
  padding-block-start: 0.1em;
}
```

## Optical sizing

Modern variable fonts include optical sizing. Use it:

```css
.display {
  font-variation-settings: "opsz" 96;
}
.body {
  font-variation-settings: "opsz" 16;
}
```

## Don't

- Random margin values (use baseline multiples)
- Forget `margin-block-start: 0` on first child
- Use `<br>` for spacing
- Set line-height in pixels (use unitless numbers)
