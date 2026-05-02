#!/usr/bin/env node
/**
 * apply-palette — Vyre Skill utility
 *
 * Reads a named palette from @gapra/vyre-tokens and emits a CSS override file
 * that reassigns the interactive/primary and content/link tokens to the palette's
 * primary scale. Apply after the base tokens.css:
 *
 *   @import "@gapra/vyre-tokens/css";
 *   @import "./palette-aurora.css";    ← output of this script
 *
 * Usage:
 *   node apply-palette.mjs --palette aurora [--out ./palette-aurora.css]
 *   node apply-palette.mjs --list
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PKG = join(__dirname, '..', '..', 'tokens');
const PALETTES_DIR = join(TOKENS_PKG, 'src', 'palettes');
const INDEX_PATH = join(PALETTES_DIR, '_index.json');
const PREFIX = 'vyre';

// --- CLI args ---
const { values: args } = parseArgs({
  options: {
    palette: { type: 'string', short: 'p' },
    out:     { type: 'string', short: 'o' },
    list:    { type: 'boolean', short: 'l', default: false },
    mode:    { type: 'string', short: 'm', default: 'light' }, // light | dark
  },
  strict: false,
});

// --- Helpers ---
function oklchToCss(v) {
  if (!v || typeof v !== 'object' || v.colorSpace !== 'oklch') return String(v ?? '');
  const [l, c, h] = v.components;
  const alpha = v.alpha ?? 1;
  const a = alpha < 1 ? ` / ${alpha}` : '';
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h}${a})`;
}

function flatten(obj, path = []) {
  const out = [];
  if (obj && typeof obj === 'object' && '$value' in obj) {
    return [{ path, value: obj.$value, type: obj.$type }];
  }
  for (const [k, v] of Object.entries(obj || {})) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') out.push(...flatten(v, [...path, k]));
  }
  return out;
}

function formatValue(t) {
  const v = t.value;
  if (v && typeof v === 'object' && v.colorSpace === 'oklch') return oklchToCss(v);
  return String(v ?? '');
}

// --- List mode ---
async function listPalettes() {
  const index = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  console.log(`\nAvailable palettes (${index.count}):\n`);
  for (const p of index.palettes) {
    const tags = p.tags?.join(', ') ?? '';
    console.log(`  ${p.id.padEnd(28)} ${p.description ?? ''}  [${tags}]`);
  }
  console.log('');
}

// --- Apply mode ---
async function applyPalette(paletteId, outPath, mode) {
  const palettePath = join(PALETTES_DIR, `${paletteId}.tokens.json`);
  let json;
  try {
    json = JSON.parse(await readFile(palettePath, 'utf8'));
  } catch {
    console.error(`Error: palette "${paletteId}" not found at ${palettePath}`);
    console.error('Run with --list to see available palettes.');
    process.exit(1);
  }

  // Flatten the palette token tree
  const tokens = flatten(json);

  // Find the primary scale (palette.<id>.primary.*)
  // Also support palette.<id>.gray.* for neutral overrides
  const primaryTokens = tokens.filter(t => {
    const seg = t.path;
    return seg[0] === 'palette' && seg[2] === 'primary';
  });

  const grayTokens = tokens.filter(t => {
    const seg = t.path;
    return seg[0] === 'palette' && (seg[2] === 'gray' || seg[2] === 'neutral');
  });

  if (primaryTokens.length === 0) {
    console.error(`Error: palette "${paletteId}" has no primary scale (expected palette.${paletteId}.primary.*)`);
    process.exit(1);
  }

  // Dark mode inverts the scale mapping
  const isDark = mode === 'dark';
  const selector = isDark ? `[data-theme='dark']` : `:root, [data-theme='light']`;

  // Map palette primary steps to semantic interactive/border/content tokens
  // Step 9 = solid, 10 = hover, 11 = low-contrast text, 12 = high-contrast text, etc.
  const stepMap = {};
  for (const t of primaryTokens) {
    const step = t.path[t.path.length - 1]; // "1"–"12"
    stepMap[step] = formatValue(t);
  }

  // Build overrides: match Vyre's semantic token contract
  const overrides = [];
  const css = (varName, value) => overrides.push(`  --${PREFIX}-${varName}: ${value};`);

  // Interactive primary from palette
  if (stepMap['9'])  css('interactive-primary',           stepMap['9']);
  if (stepMap['10']) css('interactive-primary-hover',     stepMap['10']);
  if (stepMap['11']) css('interactive-primary-active',    stepMap['11']);
  if (stepMap['3'])  css('interactive-primary-subtle',    stepMap['3']);
  if (stepMap['7'])  css('border-interactive',            stepMap['7']);
  if (stepMap['8'])  css('border-focus',                  stepMap['8']);
  if (stepMap['8'])  css('ring-default',                  stepMap['8']);
  if (stepMap['11']) css('content-link',                  stepMap['11']);
  if (stepMap['10']) css('content-link-hover',            stepMap['10']);

  // Dark mode: remap surface/content from gray scale if present
  if (isDark && grayTokens.length > 0) {
    const grayMap = {};
    for (const t of grayTokens) {
      grayMap[t.path[t.path.length - 1]] = formatValue(t);
    }
    if (grayMap['1'])  css('surface-background', grayMap['1']);
    if (grayMap['2'])  css('surface-subtle',      grayMap['2']);
    if (grayMap['3'])  css('surface-muted',       grayMap['3']);
    if (grayMap['12']) css('content-primary',     grayMap['12']);
    if (grayMap['11']) css('content-secondary',   grayMap['11']);
  } else if (!isDark && grayTokens.length > 0) {
    const grayMap = {};
    for (const t of grayTokens) {
      grayMap[t.path[t.path.length - 1]] = formatValue(t);
    }
    if (grayMap['1'])  css('surface-background', grayMap['1']);
    if (grayMap['2'])  css('surface-subtle',      grayMap['2']);
    if (grayMap['3'])  css('surface-muted',       grayMap['3']);
    if (grayMap['12']) css('content-primary',     grayMap['12']);
    if (grayMap['11']) css('content-secondary',   grayMap['11']);
  }

  const output = [
    `/* Vyre palette override: ${paletteId} (mode: ${mode}) — generated by apply-palette.mjs */`,
    `/* Apply after @gapra/vyre-tokens/css */`,
    ``,
    `${selector} {`,
    ...overrides,
    `}`,
    ``,
  ].join('\n');

  const destination = outPath ?? `./palette-${paletteId}${isDark ? '-dark' : ''}.css`;
  await writeFile(destination, output);
  console.log(`✓ Written ${destination}  (${overrides.length} overrides, ${primaryTokens.length} primary steps)`);
}

// --- Entry ---
if (args.list) {
  await listPalettes();
} else if (args.palette) {
  await applyPalette(args.palette, args.out, args.mode);
} else {
  console.log(`
Vyre apply-palette — apply a named color palette to Vyre tokens.

Usage:
  node apply-palette.mjs --palette <id> [--out <path>] [--mode light|dark]
  node apply-palette.mjs --list

Options:
  -p, --palette <id>    Palette ID (e.g. aurora, nordic, brutalist)
  -o, --out <path>      Output CSS file path (default: ./palette-<id>.css)
  -m, --mode <mode>     Color scheme: light (default) or dark
  -l, --list            List all available palettes

Examples:
  node apply-palette.mjs --palette aurora --mode dark --out ./aurora-dark.css
  node apply-palette.mjs --list
`);
  process.exit(1);
}
