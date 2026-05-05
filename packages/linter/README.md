# @gapra/vyre-linter

Linter for [Vyre](https://github.com/gapra/vyre) design tokens and skill output. Validates DTCG 2025.10 schema, broken alias references, WCAG/APCA contrast ratios, and UX rule compliance.

## Install

```sh
npm install -D @gapra/vyre-linter
# or
pnpm add -D @gapra/vyre-linter
```

## CLI

```sh
# Run all checks (default)
npx vyre-lint --tokens ./packages/tokens/src --skill ./packages/skill

# Individual checks
npx vyre-lint --dtcg    --tokens <dir>     # DTCG schema validation
npx vyre-lint --refs    --tokens <dir>     # Broken alias references
npx vyre-lint --contrast --tokens <dir>    # WCAG + APCA contrast audit
npx vyre-lint --ux <file>                  # UX rule check on HTML/JSX file

# Options
npx vyre-lint --theme dark                 # light (default) | dark | high-contrast
npx vyre-lint --json                       # Output results as JSON
npx vyre-lint -v                           # Verbose output
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0`  | All checks passed (warnings allowed) |
| `1`  | One or more errors found |

## Programmatic API

```js
import { validateTokenFile } from '@gapra/vyre-linter';
import { validateReferences } from '@gapra/vyre-linter/refs';
import { wcagContrast, apcaLc, parseCssOklch, auditPairs } from '@gapra/vyre-linter/contrast';
import { checkUxRules } from '@gapra/vyre-linter/ux';
```

### `validateTokenFile(json, filePath)`

Validates a parsed DTCG token file object.

```js
import { validateTokenFile } from '@gapra/vyre-linter';

const json = JSON.parse(await readFile('color.tokens.json', 'utf8'));
const messages = validateTokenFile(json, 'color.tokens.json');
// [{ path, severity: 'error'|'warn', message }]
```

Rules enforced:
- `$value` required on every token node
- `$type` must be a known DTCG type (`color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `shadow`, `gradient`, `typography`, `border`)
- `$value` shape validated per type (e.g. color object must have `colorSpace` + `components`)
- No legacy bare `value` keys (pre-DTCG format)
- `$schema` recommended at file root

### `validateReferences(tokensDir)`

Finds broken `{alias.ref}` references and circular chains across all `.tokens.json` files in a directory.

```js
import { validateReferences } from '@gapra/vyre-linter/refs';

const messages = await validateReferences('./packages/tokens/src');
```

### `auditPairs(pairs, resolveColor)`

Audit color pairs against WCAG 2.2 and APCA thresholds.

```js
import { auditPairs, STANDARD_PAIRS } from '@gapra/vyre-linter/contrast';

const results = auditPairs(STANDARD_PAIRS, (name) => cssVars[name]);
// [{ pair, wcag, apca, pass, reason? }]
```

`STANDARD_PAIRS` contains the default Vyre token pairs covering body text, buttons, badges, and status surfaces.

### `checkUxRules(content, filePath)`

Validate HTML or JSX source against UX rules.

```js
import { checkUxRules } from '@gapra/vyre-linter/ux';

const violations = checkUxRules(htmlString, 'Component.jsx');
// [{ path, rule, severity: 'error'|'warn', message }]
```

Rules checked:
- `no-raw-values` — no raw hex colors or px spacing in style attributes
- `focus-visible` — interactive elements must have `:focus-visible` styles
- `form-labels` / `labels-not-placeholders` — `<input>` must have `<label>` or `aria-label`
- `heading-hierarchy` — no skipped heading levels (e.g. h1 → h3)
- `respect-reduced-motion` — `@keyframes` must be inside a `prefers-reduced-motion` guard
- `touch-target-size` — buttons must not use size classes smaller than 24px

## License

MIT
