/**
 * reference-resolver — finds broken {alias.ref} references across token files.
 *
 * Loads all token files, builds a flat map of token paths, then verifies
 * every {ref} points to an existing token.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/** @typedef {{ path: string, message: string, severity: 'error'|'warn' }} LintMessage */

/**
 * Flatten a DTCG token tree into a path→node map.
 * @param {object} obj
 * @param {string[]} prefix
 * @returns {Map<string, object>}
 */
function flattenToMap(obj, prefix = []) {
  const map = new Map();
  if (!obj || typeof obj !== 'object') return map;
  if ('$value' in obj) {
    map.set(prefix.join('.'), obj);
    return map;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') {
      for (const [path, node] of flattenToMap(v, [...prefix, k])) {
        map.set(path, node);
      }
    }
  }
  return map;
}

/**
 * Walk all .tokens.json files in a directory (recursive).
 */
async function walkTokenFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkTokenFiles(full));
    else if (entry.name.endsWith('.tokens.json')) files.push(full);
  }
  return files;
}

/**
 * Validate all alias references across a token source directory.
 * @param {string} tokensDir - path to packages/tokens/src
 * @returns {Promise<LintMessage[]>}
 */
export async function validateReferences(tokensDir) {
  const messages = [];
  const files = await walkTokenFiles(tokensDir);

  // Build combined token map from all files
  const allTokens = new Map();
  const fileContents = new Map();

  for (const file of files) {
    try {
      const json = JSON.parse(await readFile(file, 'utf8'));
      fileContents.set(file, json);
      // Theme modifier files intentionally override base tokens — skip duplicate check for them
      const isModifier = !!json.$extensions?.['com.vyre.theme'];
      for (const [path, node] of flattenToMap(json)) {
        if (!isModifier && allTokens.has(path)) {
          messages.push({
            path: file,
            severity: 'warn',
            message: `Duplicate token path "${path}" — also defined in ${allTokens.get(path).__file}`,
          });
        }
        allTokens.set(path, { ...node, __file: file });
      }
    } catch (e) {
      messages.push({ path: file, severity: 'error', message: `JSON parse error: ${e.message}` });
    }
  }

  // Validate all {alias.refs}
  for (const [tokenPath, node] of allTokens) {
    const value = node.$value;
    if (typeof value !== 'string') continue;
    const match = value.match(/^\{([^}]+)\}$/);
    if (!match) continue;
    const refPath = match[1];
    if (!allTokens.has(refPath)) {
      messages.push({
        path: node.__file,
        severity: 'error',
        message: `Broken reference at "${tokenPath}": {${refPath}} does not exist`,
      });
    }
  }

  // Detect circular references
  for (const [tokenPath] of allTokens) {
    try {
      resolveChain(tokenPath, allTokens, new Set());
    } catch (e) {
      messages.push({
        path: allTokens.get(tokenPath).__file,
        severity: 'error',
        message: e.message,
      });
    }
  }

  return messages;
}

function resolveChain(path, map, visited) {
  if (visited.has(path)) {
    throw new Error(`Circular reference detected: ${[...visited, path].join(' → ')}`);
  }
  const node = map.get(path);
  if (!node) return;
  const value = node.$value;
  if (typeof value !== 'string') return;
  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) return;
  resolveChain(match[1], map, new Set([...visited, path]));
}
