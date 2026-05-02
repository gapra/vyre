#!/usr/bin/env node
/**
 * Validates the skill package: SKILL.md frontmatter, references manifest consistency.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let errors = 0;
function err(msg) { console.error(`✗ ${msg}`); errors++; }
function ok(msg)  { console.log(`✓ ${msg}`); }

async function main() {
  // 1. SKILL.md exists and has frontmatter
  try {
    const skill = await readFile(join(ROOT, 'SKILL.md'), 'utf8');
    if (!skill.startsWith('---')) err('SKILL.md missing YAML frontmatter');
    else ok('SKILL.md has frontmatter');
    if (!/name:\s*\S/.test(skill)) err('SKILL.md missing name');
    if (!/description:/.test(skill)) err('SKILL.md missing description');
  } catch (e) {
    err(`Cannot read SKILL.md: ${e.message}`);
  }

  // 2. Style index matches files
  try {
    const idx = JSON.parse(await readFile(join(ROOT, 'references/styles/_index.json'), 'utf8'));
    const files = (await readdir(join(ROOT, 'references/styles'))).filter(f => f.endsWith('.md'));
    if (idx.styles.length !== files.length) {
      err(`Style count mismatch: index=${idx.styles.length}, files=${files.length}`);
    } else ok(`${files.length} styles indexed`);
    for (const s of idx.styles) {
      if (!files.includes(`${s.id}.md`)) err(`Missing style file: ${s.id}.md`);
    }
  } catch (e) {
    err(`Style index error: ${e.message}`);
  }

  // 3. Palette index matches manifest
  try {
    const idx = JSON.parse(await readFile(join(ROOT, 'references/palettes/_index.json'), 'utf8'));
    if (idx.count !== idx.palettes.length) err('Palette count mismatch');
    else ok(`${idx.count} palettes indexed`);
  } catch (e) {
    err(`Palette index error: ${e.message}`);
  }

  // 4. UX rules index matches files
  try {
    const idx = JSON.parse(await readFile(join(ROOT, 'references/ux-rules/_index.json'), 'utf8'));
    let totalFiles = 0;
    for (const cat of Object.keys(idx.categories)) {
      const dir = join(ROOT, 'references/ux-rules', cat);
      const files = (await readdir(dir)).filter(f => f.endsWith('.md'));
      totalFiles += files.length;
      const indexed = Array.isArray(idx.categories[cat]) ? idx.categories[cat].length : idx.categories[cat];
      if (files.length !== indexed) {
        err(`UX rule category ${cat}: index=${indexed}, files=${files.length}`);
      }
      // Verify each indexed file exists
      if (Array.isArray(idx.categories[cat])) {
        for (const r of idx.categories[cat]) {
          if (!files.includes(`${r.id}.md`)) err(`Missing rule file: ${cat}/${r.id}.md`);
        }
      }
    }
    if (idx.total !== totalFiles) err(`Total rule count mismatch: index.total=${idx.total} vs files=${totalFiles}`);
    else ok(`${idx.total} UX rules indexed`);
  } catch (e) {
    err(`UX rules index error: ${e.message}`);
  }

  // 5. Required reference docs exist
  const required = [
    'references/layout/grid-system.md',
    'references/layout/flex-patterns.md',
    'references/layout/spacing.md',
    'references/typography/scales.md',
    'references/typography/pairing.md',
    'references/typography/rhythm.md',
    'references/frameworks/react.md',
    'references/frameworks/vue.md',
    'references/frameworks/svelte.md',
    'references/frameworks/angular.md',
    'references/frameworks/tailwind.md',
  ];
  for (const f of required) {
    try {
      await readFile(join(ROOT, f), 'utf8');
    } catch {
      err(`Missing required reference: ${f}`);
    }
  }
  ok(`Required reference docs present`);

  if (errors === 0) {
    console.log('\nAll skill validations passed.');
  } else {
    console.error(`\n${errors} error(s).`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
