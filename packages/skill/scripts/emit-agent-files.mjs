#!/usr/bin/env node
/**
 * emit-agent-files.mjs — regenerate all AI tool config files from SKILL.md.
 *
 * Reads SKILL.md and produces:
 *   ../../CLAUDE.md
 *   ../../.cursor/rules/vyre.mdc
 *   ../../.windsurf/rules/vyre.md
 *   ../../AGENTS.md
 *   ../../.github/copilot-instructions.md
 *
 * Usage: node packages/skill/scripts/emit-agent-files.mjs [--dry-run]
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');
const SKILL_PATH = join(__dirname, '..', 'SKILL.md');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Parse SKILL.md ─────────────────────────────────────────────────────────

const skillRaw = await readFile(SKILL_PATH, 'utf8');

// Extract frontmatter block (between first two ---)
const fmMatch = skillRaw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!fmMatch) { console.error('❌ SKILL.md: missing frontmatter'); process.exit(1); }
const skillBody = fmMatch[2];

// Extract key sections we re-use across files
function extractSection(body, heading) {
  const pattern = new RegExp(`## ${heading}[\\s\\S]*?(?=\\n## |$)`, 'i');
  const m = body.match(pattern);
  return m ? m[0].trim() : '';
}

const nonNegotiables = extractSection(skillBody, 'Quick reference');
const commonPatterns = extractSection(skillBody, 'Common patterns');
const avoidSection   = extractSection(skillBody, 'Avoid');
const whenAmbiguous  = extractSection(skillBody, 'When user is ambiguous');

// ── Shared blocks ──────────────────────────────────────────────────────────

const TOKEN_TABLE = `
| Namespace | Examples |
|-----------|---------|
| \`--vyre-surface-*\` | \`background\`, \`panel\`, \`card\`, \`popover\`, \`subtle\`, \`muted\`, \`inverse\` |
| \`--vyre-content-*\` | \`primary\`, \`secondary\`, \`tertiary\`, \`muted\`, \`disabled\`, \`link\`, \`inverse\` |
| \`--vyre-interactive-*\` | \`primary\`, \`primary-foreground\`, \`primary-hover\`, \`secondary-*\`, \`ghost-*\`, \`destructive-*\` |
| \`--vyre-status-*\` | \`success-solid\`, \`success-foreground\`, \`success-subtle\` (same for warning/danger/info) |
| \`--vyre-border-*\` | \`subtle\`, \`default\`, \`strong\`, \`interactive\`, \`focus\` |
| \`--vyre-space-{0–64}\` | 8-px grid. \`space-2\`=8px, \`space-4\`=16px, \`space-6\`=24px |
| \`--vyre-radius-*\` | \`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`2xl\`, \`3xl\`, \`full\` |
| \`--vyre-shadow-*\` | \`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`2xl\`, \`inner\` |
| \`--vyre-motion-duration-*\` | \`instant\`, \`fast\`, \`normal\`, \`slow\`, \`deliberate\` |
| \`--vyre-motion-easing-*\` | \`standard\`, \`decelerate\`, \`accelerate\`, \`sharp\` |
`.trim();

const CORE_RULES = `
1. **No raw values.** No \`#hex\`, no \`px\` for spacing. Always \`var(--vyre-*)\`.
2. **Pair surface + foreground.** Every \`--vyre-surface-*\` has a matching \`--vyre-content-*\`. Never mix arbitrarily.
3. **Cascade layers:** \`@layer theme, base, components, utilities\`. Component styles in \`@layer components\`.
4. **Contrast is mandatory.** Body text: APCA Lc 60 / WCAG AA 4.5:1. UI: Lc 45 / 3:1.
5. **Guard animations.** \`@media (prefers-reduced-motion: no-preference)\` around any animation > 200ms.
`.trim();

const WORKFLOW_STEPS = `
1. Pick a UI style from \`references/styles/_index.json\` (54 options).
2. Pick a palette from \`references/palettes/_index.json\` (177 options, tagged).
3. Load relevant UX rules from \`references/ux-rules/_index.json\` (90 rules — load on demand, not all at once).
4. Check the framework adapter in \`references/frameworks/\`.
5. Produce token-only code. Run \`pnpm lint\` before delivering.
`.trim();

const AVOID_BLOCK = `
- Combining morphism styles (glass + neumorphism) in one component.
- Skipping the \`-foreground\` pair on any surface — guaranteed a11y regression.
- Animating \`width\`, \`height\`, \`top\`, \`left\` — animate \`transform\` + \`opacity\` only.
- Loading all 90 UX rules at once — use the manifest index.
- Raw hex, px spacing, or inline font sizes anywhere in CSS or style props.
`.trim();

// ── Generators ─────────────────────────────────────────────────────────────

function genClaudeMd() {
  return `# CLAUDE.md — Vyre Design System

This is **Vyre**, an AI-native design system. Read this before working on any code in this repo.

## What this repo is

A pnpm monorepo with three published packages:

| Package | Purpose |
|---------|---------|
| \`@gapra/vyre-tokens\` | DTCG 2025.10 design tokens → CSS / Tailwind / SCSS / JS |
| \`@gapra/vyre-skill\` | AI Skill: 54 UI styles, 177 palettes, 90 UX rules |
| \`@gapra/vyre-linter\` | CLI + API: DTCG validation, alias refs, WCAG/APCA, UX rules |

## When asked to build or fix UI

${WORKFLOW_STEPS}

## The 5 non-negotiables

${CORE_RULES}

## Common commands

\`\`\`bash
pnpm install              # install workspace deps
pnpm build:tokens         # build @gapra/vyre-tokens dist/
pnpm lint                 # run vyre-linter (DTCG + refs + contrast + UX rules)
pnpm lint:dark            # contrast audit for dark theme
pnpm validate             # build tokens then lint all
pnpm test                 # run all package tests
\`\`\`

## Token namespaces

${TOKEN_TABLE}

## File conventions

- Token source: \`packages/tokens/src/**/*.tokens.json\` (DTCG 2025.10)
- Skill content: \`packages/skill/references/**/*.md\` (YAML frontmatter + Markdown)
- **Never edit** \`packages/tokens/dist/\` — it's generated.
- **Never edit** \`.cursor/rules/vyre.mdc\`, \`.windsurf/rules/vyre.md\`, or \`.github/copilot-instructions.md\` directly — run \`node packages/skill/scripts/emit-agent-files.mjs\` to regenerate.

## Avoid

${AVOID_BLOCK}
`;
}

function genCursorMdc() {
  return `---
description: Vyre design system rules. Apply to all UI work — components, styles, tokens, accessibility, theming, layout, typography, color choices, and any visual/UX decisions in any framework.
globs: ["**/*.css", "**/*.scss", "**/*.tsx", "**/*.jsx", "**/*.vue", "**/*.svelte", "**/*.html", "**/*.tokens.json"]
alwaysApply: false
---

# Vyre Design System

You are working with **Vyre**, a token-based AI-native design system. Produce code that uses only design tokens — never hardcode visual values.

## The 5 non-negotiables

${CORE_RULES}

## Setup

\`\`\`css
@import "@gapra/vyre-tokens/css";
@import "@gapra/vyre-tokens/themes/dark"; /* optional */
\`\`\`

## Token namespaces

${TOKEN_TABLE}

${commonPatterns}

## Workflow for UI requests

${WORKFLOW_STEPS}

## Avoid

${AVOID_BLOCK}
`;
}

function genWindsurfMd() {
  return `---
trigger: model_decision
description: Vyre design system rules — apply whenever building UI, choosing colors, theming, working with accessibility, layout, typography, or any visual/UX decisions.
---

# Vyre Design System

You are working with **Vyre**, a token-based AI-native design system. Produce code that uses only design tokens — never hardcode visual values.

## The 5 non-negotiables

${CORE_RULES}

## Setup

\`\`\`css
@import "@gapra/vyre-tokens/css";
@import "@gapra/vyre-tokens/themes/dark"; /* optional */
\`\`\`

## Token namespaces

${TOKEN_TABLE}

${commonPatterns}

## Workflow for UI requests

${WORKFLOW_STEPS}

## Avoid

${AVOID_BLOCK}
`;
}

function genAgentsMd() {
  return `# AGENTS.md — Vyre Design System

This repo is **Vyre**, an AI-native design system. When working in this repo or in any project that has \`@gapra/vyre-*\` installed, follow these rules.

## Core principles (always apply)

${CORE_RULES}

## When the user asks for UI work

${WORKFLOW_STEPS}

## File conventions

- Tokens: \`packages/tokens/src/**/*.tokens.json\` (DTCG 2025.10 format)
- Skill content: \`packages/skill/references/**/*.md\` with YAML frontmatter
- Never edit \`packages/tokens/dist/\` directly — it's generated

## Avoid

${AVOID_BLOCK}
`;
}

function genCopilotInstructions() {
  return `# GitHub Copilot Instructions — Vyre Design System

This repo contains **Vyre**, an AI-native design system. Follow these rules when suggesting code.

## Core rules

${CORE_RULES}

## Token reference

\`\`\`css
@import "@gapra/vyre-tokens/css";
@import "@gapra/vyre-tokens/themes/dark"; /* optional */
\`\`\`

${TOKEN_TABLE}

## When generating UI code

${WORKFLOW_STEPS}

Full context: see \`AGENTS.md\` and \`packages/skill/SKILL.md\`.
`;
}

// ── Write files ────────────────────────────────────────────────────────────

const outputs = [
  { path: join(ROOT, 'CLAUDE.md'),                             content: genClaudeMd() },
  { path: join(ROOT, '.cursor', 'rules', 'vyre.mdc'),          content: genCursorMdc() },
  { path: join(ROOT, '.windsurf', 'rules', 'vyre.md'),         content: genWindsurfMd() },
  { path: join(ROOT, 'AGENTS.md'),                             content: genAgentsMd() },
  { path: join(ROOT, '.github', 'copilot-instructions.md'),    content: genCopilotInstructions() },
];

for (const { path, content } of outputs) {
  const rel = path.replace(ROOT + '/', '');
  if (DRY_RUN) {
    console.log(`  [dry-run] would write ${rel} (${content.length} chars)`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, 'utf8');
    console.log(`  ✓ ${rel}`);
  }
}

if (!DRY_RUN) {
  console.log(`\nAll agent files regenerated from packages/skill/SKILL.md`);
}
