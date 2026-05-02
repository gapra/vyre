#!/usr/bin/env node
/**
 * Vyre tokens build script.
 * Reads DTCG token JSON files → emits CSS, Tailwind v4 @theme, SCSS, JS, TS.
 * Pure Node, no external deps for portability.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const PREFIX = 'vyre';

// --- Walk all .tokens.json files ---
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.tokens.json')) files.push(full);
  }
  return files;
}

// --- Flatten DTCG tree into [{path, value, type}] ---
function flatten(obj, path = []) {
  const out = [];
  if (obj && typeof obj === 'object' && '$value' in obj) {
    return [{ path, value: obj.$value, type: obj.$type, description: obj.$description }];
  }
  for (const [k, v] of Object.entries(obj || {})) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') out.push(...flatten(v, [...path, k]));
  }
  return out;
}

// --- Resolve {alias.references} ---
function resolveRefs(tokens) {
  const map = new Map(tokens.map(t => [t.path.join('.'), t]));
  const seen = new Set();
  function resolve(token) {
    if (typeof token.value !== 'string') return token.value;
    const match = token.value.match(/^\{([^}]+)\}$/);
    if (!match) return token.value;
    const refPath = match[1];
    if (seen.has(refPath)) throw new Error(`Circular ref: ${refPath}`);
    seen.add(refPath);
    const target = map.get(refPath);
    if (!target) throw new Error(`Unresolved ref: ${refPath}`);
    const result = resolve(target);
    seen.delete(refPath);
    return result;
  }
  return tokens.map(t => ({ ...t, resolved: resolve(t) }));
}

// --- OKLCH → CSS color() string + sRGB hex fallback ---
function oklchToCss(value) {
  if (typeof value === 'string') return value;
  if (value.colorSpace === 'oklch') {
    const [l, c, h] = value.components;
    const alpha = value.alpha ?? 1;
    const a = alpha < 1 ? ` / ${alpha}` : '';
    return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h}${a})`;
  }
  return String(value);
}

// --- Format token value by type ---
function formatValue(token) {
  const v = token.resolved;
  if (token.type === 'color' || (v && typeof v === 'object' && v.colorSpace)) {
    return oklchToCss(v);
  }
  if (token.type === 'dimension' && typeof v === 'object' && 'value' in v) {
    return `${v.value}${v.unit}`;
  }
  if (token.type === 'duration' && typeof v === 'object' && 'value' in v) {
    return `${v.value}${v.unit}`;
  }
  if (token.type === 'fontFamily' && Array.isArray(v)) {
    return v.map(f => f.includes(' ') ? `"${f}"` : f).join(', ');
  }
  if (token.type === 'fontWeight') return String(v);
  if (token.type === 'cubicBezier' && Array.isArray(v)) {
    return `cubic-bezier(${v.join(', ')})`;
  }
  if (token.type === 'shadow' && Array.isArray(v)) {
    return v.map(s => {
      const inset = s.inset ? 'inset ' : '';
      return `${inset}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`;
    }).join(', ');
  }
  if (token.type === 'number') return String(v);
  return String(v);
}

// --- CSS variable name from path ---
function cssName(path) {
  return `--${PREFIX}-${path.join('-')}`;
}

// --- Emit CSS ---
function emitCss(tokens) {
  const lines = [
    '/* Vyre design tokens — generated. Do not edit. */',
    ':root {',
  ];
  for (const t of tokens) {
    const desc = t.description ? `  /* ${t.description} */\n` : '';
    lines.push(`${desc}  ${cssName(t.path)}: ${formatValue(t)};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

// --- Emit Tailwind v4 @theme ---
function emitTailwind(tokens) {
  const lines = [
    '/* Vyre tokens for Tailwind v4. Import after `@import "tailwindcss";` */',
    '@theme {',
  ];
  for (const t of tokens) {
    const path = t.path;
    let twName;
    // Tailwind v4 namespacing: --color-*, --spacing-*, --font-*, --text-*, etc.
    if (path[0] === 'color' && path[1] === 'primitive') {
      twName = `--color-${path.slice(2).join('-')}`;
    } else if (path[0] === 'surface') {
      twName = `--color-surface-${path.slice(1).join('-')}`;
    } else if (path[0] === 'content') {
      twName = `--color-content-${path.slice(1).join('-')}`;
    } else if (path[0] === 'interactive') {
      twName = `--color-${path.slice(1).join('-')}`;
    } else if (path[0] === 'status') {
      twName = `--color-${path.slice(1).join('-')}`;
    } else if (path[0] === 'border' && t.type === 'color') {
      twName = `--color-border-${path.slice(1).join('-')}`;
    } else if (path[0] === 'space') {
      twName = `--spacing-${path.slice(1).join('-')}`;
    } else if (path[0] === 'radius') {
      twName = `--radius-${path.slice(1).join('-')}`;
    } else if (path[0] === 'font' && path[1] === 'family') {
      twName = `--font-${path.slice(2).join('-')}`;
    } else if (path[0] === 'font' && path[1] === 'size') {
      twName = `--text-${path.slice(2).join('-')}`;
    } else if (path[0] === 'shadow') {
      twName = `--shadow-${path.slice(1).join('-')}`;
    } else if (path[0] === 'motion' && path[1] === 'duration') {
      twName = `--duration-${path.slice(2).join('-')}`;
    } else if (path[0] === 'motion' && path[1] === 'easing') {
      twName = `--ease-${path.slice(2).join('-')}`;
    } else {
      twName = `--${PREFIX}-${path.join('-')}`;
    }
    lines.push(`  ${twName}: ${formatValue(t)};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

// --- Emit SCSS ---
function emitScss(tokens) {
  const lines = ['// Vyre design tokens — generated. Do not edit.', ''];
  for (const t of tokens) {
    const name = `$${PREFIX}-${t.path.join('-')}`;
    lines.push(`${name}: ${formatValue(t)};`);
  }
  return lines.join('\n') + '\n';
}

// --- Emit JS + TS ---
function emitJs(tokens) {
  const tree = {};
  for (const t of tokens) {
    let cur = tree;
    for (let i = 0; i < t.path.length - 1; i++) {
      cur[t.path[i]] = cur[t.path[i]] || {};
      cur = cur[t.path[i]];
    }
    cur[t.path[t.path.length - 1]] = formatValue(t);
  }
  return [
    '// Vyre design tokens — generated.',
    `export const tokens = ${JSON.stringify(tree, null, 2)};`,
    'export default tokens;',
    '',
  ].join('\n');
}

function emitDts() {
  return [
    '// Vyre design tokens — generated type definitions.',
    'export interface VyreTokens {',
    '  [key: string]: any;',
    '}',
    'export const tokens: VyreTokens;',
    'export default tokens;',
    '',
  ].join('\n');
}

// --- Walk excluding a subdirectory ---
async function walkExcluding(dir, excludeDir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full === excludeDir) continue;
      files.push(...await walkExcluding(full, excludeDir));
    } else if (entry.name.endsWith('.tokens.json')) {
      files.push(full);
    }
  }
  return files;
}

// --- Emit per-theme CSS ---
function emitThemeCss(tokens, selector) {
  const lines = [
    `/* Vyre theme override — generated. Do not edit. */`,
    `${selector} {`,
  ];
  for (const t of tokens) {
    lines.push(`  ${cssName(t.path)}: ${formatValue(t)};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

// --- Build all theme modifier files ---
async function buildThemes(baseTokens) {
  const THEMES_DIR = join(SRC, 'themes');
  const THEMES_OUT = join(DIST, 'css', 'themes');
  await mkdir(THEMES_OUT, { recursive: true });

  // Build a ref-map from base tokens for resolving {aliases} in themes
  const baseMap = new Map(baseTokens.map(t => [t.path.join('.'), t]));

  let entries;
  try {
    entries = await readdir(THEMES_DIR, { withFileTypes: true });
  } catch {
    return; // themes dir absent — skip silently
  }

  for (const entry of entries) {
    if (!entry.name.endsWith('.tokens.json')) continue;
    const themeId = entry.name.replace('.tokens.json', '');
    const json = JSON.parse(await readFile(join(THEMES_DIR, entry.name), 'utf8'));

    const selector = json.$extensions?.['com.vyre.theme']?.selector ?? `[data-theme='${themeId}']`;

    // Flatten only the token overrides (skip $ metadata keys)
    const themeTokens = flatten(json);

    // Resolve refs: try theme-local first, fall back to base
    const combinedMap = new Map([...baseMap]);
    for (const t of themeTokens) combinedMap.set(t.path.join('.'), t);

    const seen = new Set();
    function resolveOne(token) {
      if (typeof token.value !== 'string') return token.value;
      const match = token.value.match(/^\{([^}]+)\}$/);
      if (!match) return token.value;
      const refPath = match[1];
      if (seen.has(refPath)) throw new Error(`Circular ref in theme ${themeId}: ${refPath}`);
      seen.add(refPath);
      const target = combinedMap.get(refPath);
      if (!target) throw new Error(`Unresolved ref in theme ${themeId}: ${refPath}`);
      const result = resolveOne(target);
      seen.delete(refPath);
      return result;
    }

    const resolved = themeTokens.map(t => ({ ...t, resolved: resolveOne(t) }));
    const css = emitThemeCss(resolved, selector);
    await writeFile(join(THEMES_OUT, `${themeId}.css`), css);
    console.log(`  ✓ dist/css/themes/${themeId}.css  (${selector})`);
  }
}

// --- Main ---
async function main() {
  console.log('Building Vyre tokens…');

  const THEMES_DIR = join(SRC, 'themes');
  const files = await walkExcluding(SRC, THEMES_DIR);
  console.log(`  Found ${files.length} token files (themes processed separately)`);

  const allTokens = [];
  for (const file of files) {
    const json = JSON.parse(await readFile(file, 'utf8'));
    allTokens.push(...flatten(json));
  }
  console.log(`  Flattened ${allTokens.length} tokens`);

  const resolved = resolveRefs(allTokens);

  // Emit each format
  await mkdir(join(DIST, 'css'), { recursive: true });
  await mkdir(join(DIST, 'tailwind'), { recursive: true });
  await mkdir(join(DIST, 'scss'), { recursive: true });
  await mkdir(join(DIST, 'js'), { recursive: true });

  await writeFile(join(DIST, 'css', 'tokens.css'), emitCss(resolved));
  await writeFile(join(DIST, 'tailwind', 'theme.css'), emitTailwind(resolved));
  await writeFile(join(DIST, 'scss', '_tokens.scss'), emitScss(resolved));
  await writeFile(join(DIST, 'js', 'tokens.js'), emitJs(resolved));
  await writeFile(join(DIST, 'js', 'tokens.d.ts'), emitDts());

  console.log('  ✓ dist/css/tokens.css');
  console.log('  ✓ dist/tailwind/theme.css');
  console.log('  ✓ dist/scss/_tokens.scss');
  console.log('  ✓ dist/js/tokens.js');
  console.log('  ✓ dist/js/tokens.d.ts');

  // Build per-theme CSS overrides
  console.log('Building themes…');
  await buildThemes(resolved);

  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
