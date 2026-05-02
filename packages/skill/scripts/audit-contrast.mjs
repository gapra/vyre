#!/usr/bin/env node
/**
 * audit-contrast — Vyre Skill utility
 *
 * Reads Vyre's built token JS, extracts all surface/content/status/interactive
 * color pairs, computes WCAG 2.2 contrast ratio and APCA Lc, and reports
 * pass/fail against configurable thresholds.
 *
 * Usage:
 *   node audit-contrast.mjs [--tokens <path>] [--theme light|dark] [--fail-fast]
 *
 * Exits 0 if all pairs pass, 1 if any fail.
 * Designed to run in CI after `pnpm build:tokens`.
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- CLI ---
const { values: args } = parseArgs({
  options: {
    tokens:    { type: 'string', short: 't' },
    theme:     { type: 'string', short: 'm', default: 'light' },
    'fail-fast': { type: 'boolean', default: false },
    verbose:   { type: 'boolean', short: 'v', default: false },
  },
  strict: false,
});

// --- OKLCH → linear sRGB (D65) → relative luminance ---
// Pure JS, no deps. Sufficient accuracy for audit purposes.

function oklchToLinearSrgb(l, c, h) {
  // OKLCH → OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab → LMS (linear)
  const lms_l = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const lms_m = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const lms_s = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3;

  // LMS → linear sRGB
  const r =  4.0767416621 * lms_l - 3.3077115913 * lms_m + 0.2309699292 * lms_s;
  const g = -1.2684380046 * lms_l + 2.6097574011 * lms_m - 0.3413193965 * lms_s;
  const bv = -0.0041960863 * lms_l - 0.7034186147 * lms_m + 1.7076147010 * lms_s;
  return [r, g, bv];
}

function linearToGamma(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function srgbToLuminance(r, g, b) {
  // Linearize gamma-encoded sRGB
  function lin(c) { return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function oklchToLuminance(l, c, h, alpha = 1) {
  if (alpha === 0) return null; // transparent — skip
  const [r, g, b] = oklchToLinearSrgb(l, c, h);
  const rg = linearToGamma(Math.max(0, Math.min(1, r)));
  const gg = linearToGamma(Math.max(0, Math.min(1, g)));
  const bg = linearToGamma(Math.max(0, Math.min(1, b)));
  return srgbToLuminance(rg, gg, bg);
}

// WCAG 2.2 contrast ratio
function wcagContrast(l1, l2) {
  const light = Math.max(l1, l2);
  const dark  = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

// APCA Lc (simplified public algorithm, accurate to ±1 Lc)
function apcaLc(textLum, bgLum) {
  const Ntxt = 0.57;
  const Nbg  = 0.56;
  const Rtxt = 0.62;
  const Rbg  = 0.65;
  const W_scale = 1.14;
  const W_offset = 0.027;
  const W_clamp  = 0.1;

  const Ybg  = bgLum  ** Nbg;
  const Ytxt = textLum ** Ntxt;
  const Ybg2 = bgLum  ** Rbg;
  const Ytxt2= textLum** Rtxt;

  let Lc;
  if (bgLum >= textLum) {
    // Dark text on light bg
    Lc = (Ybg - Ytxt) * W_scale;
    if (Lc < W_clamp) return 0;
    Lc -= W_offset;
  } else {
    // Light text on dark bg
    Lc = (Ybg2 - Ytxt2) * W_scale;
    if (Lc > -W_clamp) return 0;
    Lc += W_offset;
  }
  return Math.abs(Math.round(Lc * 100));
}

// --- Parse CSS oklch() string from token value ---
function parseCssColor(str) {
  if (!str || str === 'transparent') return null;
  const m = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i);
  if (!m) return null;
  const l = parseFloat(m[1]) > 1 ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  const c = parseFloat(m[2]);
  const h = parseFloat(m[3]);
  const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
  return { l, c, h, a };
}

// --- Load and parse built token CSS ---
async function loadThemeColors(tokensRoot, themeId) {
  // Load base tokens.css + optional theme override
  const baseCssPath = join(tokensRoot, 'dist', 'css', 'tokens.css');
  let css = await readFile(baseCssPath, 'utf8');

  if (themeId !== 'light') {
    try {
      const themeCssPath = join(tokensRoot, 'dist', 'css', 'themes', `${themeId}.css`);
      const themeCSS = await readFile(themeCssPath, 'utf8');
      css += '\n' + themeCSS;
    } catch {
      console.warn(`Warning: theme "${themeId}" not found, using base light tokens.`);
    }
  }

  // Parse CSS custom properties
  const vars = {};
  for (const [, name, value] of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    vars[name] = value.trim();
  }
  return vars;
}

// Resolve a var() reference chain
function resolveVar(vars, value) {
  const seen = new Set();
  let cur = value;
  while (cur?.startsWith('var(')) {
    const m = cur.match(/var\(--([a-z0-9-]+)\)/);
    if (!m) break;
    if (seen.has(m[1])) break;
    seen.add(m[1]);
    cur = vars[m[1]];
  }
  return cur;
}

// --- Define pairs to audit ---
// Each entry: { bg: 'css-var-name', fg: 'css-var-name', role, minWcag, minApca }
function buildPairs() {
  const TEXT_AA    = { minWcag: 4.5, minApca: 60 };
  const TEXT_AAA   = { minWcag: 7.0, minApca: 75 };
  const UI_AA      = { minWcag: 3.0, minApca: 45 };

  return [
    // Core text pairs
    { bg: 'vyre-surface-background', fg: 'vyre-content-primary',   role: 'body text',        ...TEXT_AA },
    { bg: 'vyre-surface-background', fg: 'vyre-content-secondary',  role: 'secondary text',   ...TEXT_AA },
    { bg: 'vyre-surface-background', fg: 'vyre-content-tertiary',   role: 'tertiary text',    ...UI_AA },
    { bg: 'vyre-surface-background', fg: 'vyre-content-muted',      role: 'muted text',       ...UI_AA },
    { bg: 'vyre-surface-panel',      fg: 'vyre-content-primary',    role: 'panel text',       ...TEXT_AA },
    { bg: 'vyre-surface-card',       fg: 'vyre-content-primary',    role: 'card text',        ...TEXT_AA },

    // Link
    { bg: 'vyre-surface-background', fg: 'vyre-content-link',       role: 'link',             ...TEXT_AA },

    // Interactive buttons
    { bg: 'vyre-interactive-primary',     fg: 'vyre-interactive-primary-foreground', role: 'primary button', ...TEXT_AA },
    { bg: 'vyre-interactive-secondary',   fg: 'vyre-interactive-secondary-foreground', role: 'secondary button', ...TEXT_AA },
    { bg: 'vyre-interactive-destructive', fg: 'vyre-interactive-destructive-foreground', role: 'destructive button', ...TEXT_AA },

    // Status — solid
    { bg: 'vyre-status-success-solid',  fg: 'vyre-status-success-foreground',        role: 'success badge',  ...TEXT_AA },
    { bg: 'vyre-status-warning-solid',  fg: 'vyre-status-warning-foreground',        role: 'warning badge',  ...TEXT_AA },
    { bg: 'vyre-status-danger-solid',   fg: 'vyre-status-danger-foreground',         role: 'danger badge',   ...TEXT_AA },
    { bg: 'vyre-status-info-solid',     fg: 'vyre-status-info-foreground',           role: 'info badge',     ...TEXT_AA },

    // Status — subtle
    { bg: 'vyre-status-success-subtle', fg: 'vyre-status-success-subtle-foreground', role: 'success subtle', ...TEXT_AA },
    { bg: 'vyre-status-warning-subtle', fg: 'vyre-status-warning-subtle-foreground', role: 'warning subtle', ...TEXT_AA },
    { bg: 'vyre-status-danger-subtle',  fg: 'vyre-status-danger-subtle-foreground',  role: 'danger subtle',  ...TEXT_AA },
    { bg: 'vyre-status-info-subtle',    fg: 'vyre-status-info-subtle-foreground',    role: 'info subtle',    ...TEXT_AA },
  ];
}

// --- Main ---
async function main() {
  const tokensRoot = args.tokens
    ? args.tokens
    : join(__dirname, '..', '..', 'tokens');

  const theme = args.theme ?? 'light';
  console.log(`\nVyre contrast audit — theme: ${theme}\n${'─'.repeat(72)}`);

  const vars = await loadThemeColors(tokensRoot, theme);
  const pairs = buildPairs();

  let failCount = 0;
  let skipCount = 0;

  for (const pair of pairs) {
    const bgRaw = resolveVar(vars, `var(--${pair.bg})`);
    const fgRaw = resolveVar(vars, `var(--${pair.fg})`);

    const bgColor = parseCssColor(bgRaw ?? '');
    const fgColor = parseCssColor(fgRaw ?? '');

    if (!bgColor || !fgColor) {
      if (args.verbose) {
        console.log(`  SKIP  ${pair.role.padEnd(28)} bg=${bgRaw ?? 'n/a'} fg=${fgRaw ?? 'n/a'}`);
      }
      skipCount++;
      continue;
    }

    const bgLum = oklchToLuminance(bgColor.l, bgColor.c, bgColor.h, bgColor.a);
    const fgLum = oklchToLuminance(fgColor.l, fgColor.c, fgColor.h, fgColor.a);

    if (bgLum === null || fgLum === null) { skipCount++; continue; }

    const wcag = wcagContrast(bgLum, fgLum);
    const apca = apcaLc(fgLum, bgLum);

    const passWcag = wcag >= pair.minWcag;
    const passApca = apca >= pair.minApca;
    const pass = passWcag && passApca;

    if (!pass) failCount++;

    const icon  = pass ? '✓' : '✗';
    const wcagS = `WCAG ${wcag.toFixed(2)}:1 (need ${pair.minWcag})`;
    const apcaS = `APCA Lc${apca} (need ${pair.minApca})`;
    const status = `${passWcag ? '✓' : '✗'}${wcagS}  ${passApca ? '✓' : '✗'}${apcaS}`;

    if (!pass || args.verbose) {
      console.log(`  ${icon} ${pair.role.padEnd(28)} ${status}`);
    }

    if (!pass && args['fail-fast']) {
      console.log(`\nAudit stopped early (--fail-fast). ${failCount} failure(s).`);
      process.exit(1);
    }
  }

  const checked = pairs.length - skipCount;
  const line = `${'─'.repeat(72)}`;
  console.log(line);
  if (failCount === 0) {
    console.log(`✓ All ${checked} pairs pass (${skipCount} skipped — missing tokens).\n`);
  } else {
    console.log(`✗ ${failCount}/${checked} pairs FAIL contrast thresholds.\n`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
