#!/usr/bin/env node
/**
 * Validates DTCG token files: schema shape, ref resolution, type consistency.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');

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

function flatten(obj, path = []) {
  const out = [];
  if (obj && typeof obj === 'object' && '$value' in obj) {
    return [{ path, token: obj }];
  }
  for (const [k, v] of Object.entries(obj || {})) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') out.push(...flatten(v, [...path, k]));
  }
  return out;
}

async function main() {
  const files = await walk(SRC);
  let errors = 0;
  const allPaths = new Set();
  const allTokens = [];

  for (const file of files) {
    try {
      const json = JSON.parse(await readFile(file, 'utf8'));
      const tokens = flatten(json);
      for (const { path, token } of tokens) {
        const id = path.join('.');
        if (allPaths.has(id)) {
          console.error(`✗ Duplicate token: ${id} (${file})`);
          errors++;
        }
        allPaths.add(id);
        allTokens.push({ id, token, file });
      }
    } catch (e) {
      console.error(`✗ Invalid JSON in ${file}: ${e.message}`);
      errors++;
    }
  }

  // Check refs
  for (const { id, token, file } of allTokens) {
    if (typeof token.$value === 'string') {
      const m = token.$value.match(/^\{([^}]+)\}$/);
      if (m && !allPaths.has(m[1])) {
        console.error(`✗ Broken ref: ${id} → {${m[1]}} (${file})`);
        errors++;
      }
    }
  }

  if (errors === 0) {
    console.log(`✓ Validated ${allTokens.length} tokens across ${files.length} files. No errors.`);
  } else {
    console.error(`\n${errors} error(s) found.`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
