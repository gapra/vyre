#!/usr/bin/env node
/**
 * vyre-lint CLI — entry point for npx @gapra/vyre-linter
 *
 * Usage:
 *   vyre-lint --tokens <dir>          Validate DTCG token files
 *   vyre-lint --refs <dir>            Check broken alias references
 *   vyre-lint --contrast <css>        Audit color pair contrast
 *   vyre-lint --ux <file|glob>        Check HTML/JSX against UX rules
 *   vyre-lint --all                   Run all checks (default)
 *
 * Options:
 *   --tokens <dir>     Path to token source directory (default: packages/tokens/src)
 *   --skill <dir>      Path to skill package directory (default: packages/skill)
 *   --theme <name>     Theme for contrast audit: light (default) | dark | high-contrast
 *   --fix              Auto-fix where possible (future)
 *   --json             Output results as JSON
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { validateTokenFile } from './dtcg-validator.mjs';
import { validateReferences } from './reference-resolver.mjs';
import { parseCssOklch, oklchToLuminance, wcagContrast, apcaLc, STANDARD_PAIRS } from './contrast.mjs';
import { checkUxRules } from './ux-rule-checker.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { values: args } = parseArgs({
  options: {
    tokens:  { type: 'string' },
    skill:   { type: 'string' },
    theme:   { type: 'string', default: 'light' },
    all:     { type: 'boolean', default: false },
    dtcg:    { type: 'boolean', default: false },
    refs:    { type: 'boolean', default: false },
    contrast:{ type: 'boolean', default: false },
    ux:      { type: 'string' },
    json:    { type: 'boolean', default: false },
    verbose: { type: 'boolean', short: 'v', default: false },
  },
  strict: false,
});

const TOKENS_DIR = resolve(args.tokens ?? join(__dirname, '..', '..', 'tokens', 'src'));
const SKILL_DIR  = resolve(args.skill  ?? join(__dirname, '..', '..', 'skill'));
const runAll = args.all || (!args.dtcg && !args.refs && !args.contrast && !args.ux);

// ── Shared results accumulator ────────────────────────────────────────────

const allResults = [];
let totalErrors = 0;
let totalWarns  = 0;

function record(messages) {
  for (const m of messages) {
    allResults.push(m);
    if (m.severity === 'error') totalErrors++;
    else totalWarns++;
  }
}

function printMessage(m) {
  const icon   = m.severity === 'error' ? '✗' : '⚠';
  const source = m.path.replace(process.cwd() + '/', '');
  console.log(`  ${icon} ${source}: ${m.message}`);
}

// ── DTCG validation ───────────────────────────────────────────────────────

async function runDtcg() {
  console.log('\n── DTCG Schema Validation ──────────────────────────────────────');
  const files = await walkTokenFiles(TOKENS_DIR);
  let fileErrors = 0;
  for (const file of files) {
    try {
      const json = JSON.parse(await readFile(file, 'utf8'));
      const msgs = validateTokenFile(json, file);
      record(msgs);
      if (args.verbose || msgs.some(m => m.severity === 'error')) {
        for (const m of msgs) printMessage(m);
      }
      if (msgs.some(m => m.severity === 'error')) fileErrors++;
    } catch (e) {
      const msg = { path: file, severity: 'error', message: `JSON parse error: ${e.message}` };
      record([msg]);
      printMessage(msg);
      fileErrors++;
    }
  }
  console.log(`  ${fileErrors === 0 ? '✓' : '✗'} ${files.length} files checked, ${fileErrors} with errors`);
}

// ── Reference validation ──────────────────────────────────────────────────

async function runRefs() {
  console.log('\n── Alias Reference Validation ──────────────────────────────────');
  const { validateReferences } = await import('./reference-resolver.mjs');
  const msgs = await validateReferences(TOKENS_DIR);
  record(msgs);
  const errors = msgs.filter(m => m.severity === 'error');
  if (errors.length > 0 || args.verbose) msgs.forEach(printMessage);
  console.log(`  ${errors.length === 0 ? '✓' : '✗'} ${errors.length} broken references`);
}

// ── Contrast audit ────────────────────────────────────────────────────────

async function runContrast() {
  const theme = args.theme;
  console.log(`\n── Contrast Audit (theme: ${theme}) ────────────────────────────────`);

  const TOKENS_DIST = resolve(join(TOKENS_DIR, '..', 'dist'));
  const baseCssPath = join(TOKENS_DIST, 'css', 'tokens.css');
  let css = '';
  try {
    css = await readFile(baseCssPath, 'utf8');
  } catch {
    console.log('  ⚠ dist/css/tokens.css not found — run pnpm build:tokens first');
    return;
  }

  if (theme !== 'light') {
    try {
      css += '\n' + await readFile(join(TOKENS_DIST, 'css', 'themes', `${theme}.css`), 'utf8');
    } catch {
      console.log(`  ⚠ Theme "${theme}" not found in dist/css/themes/`);
    }
  }

  const vars = {};
  for (const [, name, value] of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    vars[name] = value.trim();
  }

  function resolveVar(value) {
    const seen = new Set();
    let cur = value;
    while (cur?.startsWith('var(')) {
      const m = cur.match(/var\(--([a-z0-9-]+)\)/);
      if (!m || seen.has(m[1])) break;
      seen.add(m[1]);
      cur = vars[m[1]];
    }
    return cur;
  }

  let failCount = 0;
  for (const pair of STANDARD_PAIRS) {
    const bgStr = resolveVar(`var(--${pair.bg})`);
    const fgStr = resolveVar(`var(--${pair.fg})`);
    const bgColor = parseCssOklch(bgStr ?? '');
    const fgColor = parseCssOklch(fgStr ?? '');

    if (!bgColor || !fgColor) {
      if (args.verbose) console.log(`  SKIP  ${pair.role} — unresolved tokens`);
      continue;
    }

    const bgLum = oklchToLuminance(bgColor);
    const fgLum = oklchToLuminance(fgColor);
    if (bgLum === null || fgLum === null) continue;

    const wcag = wcagContrast(bgLum, fgLum);
    const apca = apcaLc(fgLum, bgLum);
    const pass = wcag >= pair.minWcag && apca >= pair.minApca;

    if (!pass) {
      failCount++;
      const msg = {
        path: `tokens/themes/${theme}`,
        severity: 'error',
        message: `${pair.role}: WCAG ${wcag.toFixed(2)}:1 (need ${pair.minWcag}), APCA Lc${apca} (need ${pair.minApca})`,
      };
      record([msg]);
      printMessage(msg);
    } else if (args.verbose) {
      console.log(`  ✓ ${pair.role.padEnd(28)} WCAG ${wcag.toFixed(2)}:1  APCA Lc${apca}`);
    }
  }
  console.log(`  ${failCount === 0 ? '✓' : '✗'} ${STANDARD_PAIRS.length} pairs checked, ${failCount} failures`);
}

// ── UX rule check ─────────────────────────────────────────────────────────

async function runUx() {
  const target = args.ux;
  if (!target) return;
  console.log(`\n── UX Rule Check: ${target} ─────────────────────────────────────`);
  try {
    const content = await readFile(resolve(target), 'utf8');
    const violations = checkUxRules(content, target);
    record(violations.map(v => ({ path: v.path, severity: v.severity, message: `[${v.rule}] ${v.message}` })));
    if (violations.length === 0) {
      console.log('  ✓ No violations found');
    } else {
      violations.forEach(v => console.log(`  ${v.severity === 'error' ? '✗' : '⚠'} [${v.rule}] ${v.message}`));
    }
  } catch (e) {
    console.log(`  ✗ Could not read file: ${e.message}`);
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────

async function walkTokenFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkTokenFiles(full));
    else if (entry.name.endsWith('.tokens.json')) files.push(full);
  }
  return files;
}

// ── Main ─────────────────────────────────────────────────────────────────

console.log('vyre-lint\n' + '═'.repeat(68));

if (runAll || args.dtcg)    await runDtcg();
if (runAll || args.refs)    await runRefs();
if (runAll || args.contrast) await runContrast();
if (args.ux)                await runUx();

console.log('\n' + '═'.repeat(68));

if (args.json) {
  process.stdout.write(JSON.stringify({ errors: totalErrors, warnings: totalWarns, results: allResults }, null, 2) + '\n');
} else {
  if (totalErrors === 0 && totalWarns === 0) {
    console.log('✓ All checks passed.\n');
  } else {
    console.log(`${totalErrors > 0 ? '✗' : '⚠'} ${totalErrors} error(s), ${totalWarns} warning(s).\n`);
  }
}

if (totalErrors > 0) process.exit(1);
