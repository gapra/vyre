/**
 * contrast — WCAG 2.2 + APCA contrast computation for Vyre token pairs.
 *
 * Ported from audit-contrast.mjs (skill/scripts) into a reusable module
 * so linter, vscode extension, and CI can all share the same logic.
 */

// ── OKLCH → linear sRGB ────────────────────────────────────────────────────

export function oklchToLinearSrgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lms_l = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const lms_m = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const lms_s = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3;

  const r =  4.0767416621 * lms_l - 3.3077115913 * lms_m + 0.2309699292 * lms_s;
  const g = -1.2684380046 * lms_l + 2.6097574011 * lms_m - 0.3413193965 * lms_s;
  const bv= -0.0041960863 * lms_l - 0.7034186147 * lms_m + 1.7076147010 * lms_s;
  return [r, g, bv];
}

function linearToGamma(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function srgbToLuminance(r, g, b) {
  function lin(c) { return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * Convert OKLCH color object to relative luminance (WCAG Y).
 * @param {{ l: number, c: number, h: number, a?: number }} color
 * @returns {number|null} null if transparent
 */
export function oklchToLuminance({ l, c, h, a = 1 }) {
  if (a === 0) return null;
  const [r, g, b] = oklchToLinearSrgb(l, c, h);
  const rg = linearToGamma(Math.max(0, Math.min(1, r)));
  const gg = linearToGamma(Math.max(0, Math.min(1, g)));
  const bg = linearToGamma(Math.max(0, Math.min(1, b)));
  return srgbToLuminance(rg, gg, bg);
}

// ── WCAG 2.2 contrast ratio ────────────────────────────────────────────────

/**
 * @param {number} l1 - relative luminance of color 1
 * @param {number} l2 - relative luminance of color 2
 * @returns {number} contrast ratio (1–21)
 */
export function wcagContrast(l1, l2) {
  const light = Math.max(l1, l2);
  const dark  = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

// ── APCA Lc (simplified public algorithm, ±1 Lc accuracy) ─────────────────

/**
 * @param {number} textLum - luminance of the text
 * @param {number} bgLum   - luminance of the background
 * @returns {number} absolute Lc value (0–106+)
 */
export function apcaLc(textLum, bgLum) {
  const Ntxt = 0.57, Nbg = 0.56, Rtxt = 0.62, Rbg = 0.65;
  const W_scale = 1.14, W_offset = 0.027, W_clamp = 0.1;

  const Ybg  = bgLum  ** Nbg;
  const Ytxt = textLum ** Ntxt;
  const Ybg2 = bgLum  ** Rbg;
  const Ytxt2= textLum ** Rtxt;

  let Lc;
  if (bgLum >= textLum) {
    Lc = (Ybg - Ytxt) * W_scale;
    if (Lc < W_clamp) return 0;
    Lc -= W_offset;
  } else {
    Lc = (Ybg2 - Ytxt2) * W_scale;
    if (Lc > -W_clamp) return 0;
    Lc += W_offset;
  }
  return Math.abs(Math.round(Lc * 100));
}

// ── CSS color string parser ───────────────────────────────────────────────

/**
 * Parse an oklch() CSS string into {l, c, h, a}.
 * @param {string} str
 * @returns {{ l: number, c: number, h: number, a: number }|null}
 */
export function parseCssOklch(str) {
  if (!str || str === 'transparent') return null;
  const m = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i);
  if (!m) return null;
  const l = parseFloat(m[1]) > 1 ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  return { l, c: parseFloat(m[2]), h: parseFloat(m[3]), a: m[4] !== undefined ? parseFloat(m[4]) : 1 };
}

// ── High-level audit function ─────────────────────────────────────────────

/** @typedef {{ bg: string, fg: string, role: string, minWcag: number, minApca: number }} ContrastPair */
/** @typedef {{ pair: ContrastPair, wcag: number, apca: number, pass: boolean, reason?: string }} ContrastResult */

/**
 * Audit an array of color pairs against WCAG and APCA thresholds.
 * @param {ContrastPair[]} pairs
 * @param {(name: string) => string|undefined} resolveColor - returns CSS color string for a token name
 * @returns {ContrastResult[]}
 */
export function auditPairs(pairs, resolveColor) {
  const results = [];
  for (const pair of pairs) {
    const bgStr = resolveColor(pair.bg);
    const fgStr = resolveColor(pair.fg);
    const bgColor = parseCssOklch(bgStr ?? '');
    const fgColor = parseCssOklch(fgStr ?? '');

    if (!bgColor || !fgColor) {
      results.push({ pair, wcag: 0, apca: 0, pass: false, reason: `Could not resolve colors: bg=${bgStr}, fg=${fgStr}` });
      continue;
    }

    const bgLum = oklchToLuminance(bgColor);
    const fgLum = oklchToLuminance(fgColor);
    if (bgLum === null || fgLum === null) {
      results.push({ pair, wcag: 0, apca: 0, pass: true, reason: 'transparent — skipped' });
      continue;
    }

    const wcag = wcagContrast(bgLum, fgLum);
    const apca = apcaLc(fgLum, bgLum);
    const pass = wcag >= pair.minWcag && apca >= pair.minApca;
    results.push({ pair, wcag, apca, pass });
  }
  return results;
}

// ── Standard Vyre token pairs ─────────────────────────────────────────────

export const STANDARD_PAIRS = [
  { bg: 'vyre-surface-background', fg: 'vyre-content-primary',   role: 'body text',           minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-surface-background', fg: 'vyre-content-secondary',  role: 'secondary text',      minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-surface-background', fg: 'vyre-content-tertiary',   role: 'tertiary text',       minWcag: 3.0, minApca: 45 },
  { bg: 'vyre-surface-background', fg: 'vyre-content-muted',      role: 'muted text',          minWcag: 3.0, minApca: 45 },
  { bg: 'vyre-surface-panel',      fg: 'vyre-content-primary',    role: 'panel text',          minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-surface-card',       fg: 'vyre-content-primary',    role: 'card text',           minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-surface-background', fg: 'vyre-content-link',       role: 'link',                minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-interactive-primary',     fg: 'vyre-interactive-primary-foreground',     role: 'primary button',     minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-interactive-secondary',   fg: 'vyre-interactive-secondary-foreground',   role: 'secondary button',   minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-interactive-destructive', fg: 'vyre-interactive-destructive-foreground', role: 'destructive button', minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-success-solid',  fg: 'vyre-status-success-foreground',        role: 'success badge',  minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-warning-solid',  fg: 'vyre-status-warning-foreground',        role: 'warning badge',  minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-danger-solid',   fg: 'vyre-status-danger-foreground',         role: 'danger badge',   minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-info-solid',     fg: 'vyre-status-info-foreground',           role: 'info badge',     minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-success-subtle', fg: 'vyre-status-success-subtle-foreground', role: 'success subtle', minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-warning-subtle', fg: 'vyre-status-warning-subtle-foreground', role: 'warning subtle', minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-danger-subtle',  fg: 'vyre-status-danger-subtle-foreground',  role: 'danger subtle',  minWcag: 4.5, minApca: 60 },
  { bg: 'vyre-status-info-subtle',    fg: 'vyre-status-info-subtle-foreground',    role: 'info subtle',    minWcag: 4.5, minApca: 60 },
];
