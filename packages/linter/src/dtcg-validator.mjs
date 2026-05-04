/**
 * dtcg-validator — validates token files against DTCG Format Module 2025.10.
 *
 * Rules enforced:
 *  - Every token node with a value MUST have `$value`.
 *  - `$type` must be a known DTCG type when present.
 *  - `$value` shape must match `$type` (color → object|string, dimension → {value,unit}, etc.)
 *  - Metadata keys must be dollar-prefixed ($value, $type, $description, $extensions).
 *  - No bare `value` key (old pre-DTCG format).
 *  - `$schema` is recommended at file root.
 */

const KNOWN_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'shadow', 'gradient', 'typography', 'border',
]);

const VALID_DIMENSION_UNITS = new Set(['px', 'rem', 'em', '%', 'vw', 'vh', 'dvh', 'dvw']);
const VALID_DURATION_UNITS  = new Set(['ms', 's']);

/** @typedef {{ path: string, message: string, severity: 'error'|'warn' }} LintMessage */

/**
 * Validate a single parsed token file.
 * @param {object} json - Parsed JSON
 * @param {string} filePath - Source path for error messages
 * @returns {LintMessage[]}
 */
export function validateTokenFile(json, filePath) {
  const messages = [];

  if (!json.$schema) {
    messages.push({ path: filePath, severity: 'warn', message: 'Missing $schema at root. Recommended: https://schemas.designtokens.org/2025-10/format.json' });
  }

  walkTokens(json, [], filePath, messages);
  return messages;
}

function walkTokens(node, keyPath, filePath, messages) {
  if (!node || typeof node !== 'object') return;

  const loc = keyPath.length ? keyPath.join('.') : '<root>';

  // Check for legacy `value` key (pre-DTCG)
  if ('value' in node && !('$value' in node)) {
    messages.push({ path: filePath, severity: 'error', message: `[${loc}] Uses legacy "value" key — must be "$value" (DTCG 2025.10)` });
  }

  // If this node is a token (has $value), validate it
  if ('$value' in node) {
    validateToken(node, keyPath, filePath, messages);
    return; // don't recurse into token values
  }

  // Recurse into children, skip $ meta keys
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) {
      validateMetaKey(key, child, keyPath, filePath, messages);
      continue;
    }
    if (child && typeof child === 'object') {
      walkTokens(child, [...keyPath, key], filePath, messages);
    }
  }
}

function validateToken(node, keyPath, filePath, messages) {
  const loc = keyPath.join('.');
  const type = node.$type;
  const value = node.$value;

  // $type validation
  if (type !== undefined && !KNOWN_TYPES.has(type)) {
    messages.push({ path: filePath, severity: 'warn', message: `[${loc}] Unknown $type "${type}". Known: ${[...KNOWN_TYPES].join(', ')}` });
  }

  // $value shape validation by type
  if (type === 'color') {
    validateColorValue(value, loc, filePath, messages);
  } else if (type === 'dimension') {
    validateDimensionValue(value, loc, filePath, messages);
  } else if (type === 'duration') {
    validateDurationValue(value, loc, filePath, messages);
  } else if (type === 'fontWeight') {
    if (typeof value !== 'number' && typeof value !== 'string') {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] fontWeight $value must be a number or string, got ${typeof value}` });
    }
  } else if (type === 'cubicBezier') {
    if (!Array.isArray(value) || value.length !== 4) {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] cubicBezier $value must be [P1x, P1y, P2x, P2y] (4 numbers)` });
    }
  } else if (type === 'shadow') {
    if (!Array.isArray(value) && typeof value !== 'object') {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] shadow $value must be an object or array of shadow layers` });
    }
  }

  // Alias refs: {path.to.token}
  if (typeof value === 'string' && value.startsWith('{') && !value.match(/^\{[^}]+\}$/)) {
    messages.push({ path: filePath, severity: 'error', message: `[${loc}] Malformed alias ref: "${value}". Format: {group.token}` });
  }
}

function validateColorValue(value, loc, filePath, messages) {
  if (typeof value === 'string') {
    if (value.startsWith('{')) return; // alias ref — validated by reference-resolver
    if (!value.match(/^#[0-9a-fA-F]{3,8}$|^oklch\(|^rgb\(|^hsl\(/i)) {
      messages.push({ path: filePath, severity: 'warn', message: `[${loc}] Color value "${value}" may not be a valid CSS color` });
    }
    return;
  }
  if (value && typeof value === 'object') {
    if (!value.colorSpace) {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] Color object missing "colorSpace" (e.g. "oklch")` });
    }
    if (!Array.isArray(value.components) || value.components.length < 3) {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] Color object "components" must be an array of ≥3 numbers` });
    }
    if (value.colorSpace === 'oklch') {
      const [l] = value.components;
      if (l < 0 || l > 1) {
        messages.push({ path: filePath, severity: 'error', message: `[${loc}] OKLCH lightness ${l} out of range [0, 1]` });
      }
    }
    return;
  }
  messages.push({ path: filePath, severity: 'error', message: `[${loc}] Color $value must be a string or color object, got ${typeof value}` });
}

function validateDimensionValue(value, loc, filePath, messages) {
  if (typeof value === 'string') return; // e.g. "4px" — alias or raw CSS
  if (value && typeof value === 'object') {
    if (typeof value.value !== 'number') {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] Dimension object "value" must be a number` });
    }
    if (!VALID_DIMENSION_UNITS.has(value.unit)) {
      messages.push({ path: filePath, severity: 'warn', message: `[${loc}] Dimension unit "${value.unit}" — expected one of: ${[...VALID_DIMENSION_UNITS].join(', ')}` });
    }
    return;
  }
  messages.push({ path: filePath, severity: 'error', message: `[${loc}] Dimension $value must be a string or {value, unit} object` });
}

function validateDurationValue(value, loc, filePath, messages) {
  if (typeof value === 'string') return;
  if (value && typeof value === 'object') {
    if (typeof value.value !== 'number') {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] Duration object "value" must be a number` });
    }
    if (!VALID_DURATION_UNITS.has(value.unit)) {
      messages.push({ path: filePath, severity: 'error', message: `[${loc}] Duration unit "${value.unit}" — expected "ms" or "s"` });
    }
    return;
  }
  messages.push({ path: filePath, severity: 'error', message: `[${loc}] Duration $value must be a string or {value, unit} object` });
}

function validateMetaKey(key, value, keyPath, filePath, messages) {
  const allowed = new Set(['$schema', '$value', '$type', '$description', '$extensions']);
  if (!allowed.has(key)) {
    messages.push({ path: filePath, severity: 'warn', message: `[${keyPath.join('.')||'<root>'}] Unknown meta key "${key}" — DTCG 2025.10 only allows: ${[...allowed].join(', ')}` });
  }
}
