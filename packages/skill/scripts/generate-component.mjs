#!/usr/bin/env node
/**
 * generate-component — Vyre Skill utility
 *
 * Scaffolds a UI component that uses Vyre design tokens.
 * All values reference CSS custom properties — never raw hex/px/rem.
 *
 * Usage:
 *   node generate-component.mjs --component Button --framework react
 *   node generate-component.mjs --component Card --framework vue --out ./src/components/
 *   node generate-component.mjs --list-components
 *   node generate-component.mjs --list-frameworks
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- CLI ---
const { values: args } = parseArgs({
  options: {
    component:        { type: 'string', short: 'c' },
    framework:        { type: 'string', short: 'f', default: 'react' },
    out:              { type: 'string', short: 'o', default: '.' },
    'list-components': { type: 'boolean', default: false },
    'list-frameworks': { type: 'boolean', default: false },
    variant:          { type: 'string', default: 'default' }, // default | ghost | outline
  },
  strict: false,
});

// ─── Component templates ──────────────────────────────────────────────────────
// Each template: (name, variant) → { files: [{ name, content }] }

const COMPONENTS = {

  Button: (fw, variant) => ({
    description: 'Interactive button with primary/secondary/ghost/destructive variants.',
    files: renderFramework(fw, 'Button', variant, {
      props: [
        { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'destructive'", default: "'primary'" },
        { name: 'size',    type: "'sm' | 'md' | 'lg'",                                default: "'md'" },
        { name: 'disabled', type: 'boolean',                                           default: 'false' },
        { name: 'children', type: 'ReactNode', default: null, vueSlot: true },
      ],
      css: `
.vyre-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vyre-space-2);
  border: 1px solid transparent;
  border-radius: var(--vyre-radius-md);
  font-family: var(--vyre-font-family-sans);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.vyre-btn:focus-visible {
  outline: 2px solid var(--vyre-ring-default);
  outline-offset: 2px;
}
.vyre-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Sizes */
.vyre-btn--sm  { padding: var(--vyre-space-1) var(--vyre-space-3);  font-size: var(--vyre-font-size-sm); }
.vyre-btn--md  { padding: var(--vyre-space-2) var(--vyre-space-4);  font-size: var(--vyre-font-size-base); }
.vyre-btn--lg  { padding: var(--vyre-space-3) var(--vyre-space-6);  font-size: var(--vyre-font-size-lg); }

/* Variants */
.vyre-btn--primary {
  background: var(--vyre-interactive-primary);
  color: var(--vyre-interactive-primary-foreground);
  border-color: var(--vyre-interactive-primary);
}
.vyre-btn--primary:hover:not(:disabled) {
  background: var(--vyre-interactive-primary-hover);
  border-color: var(--vyre-interactive-primary-hover);
}
.vyre-btn--primary:active:not(:disabled) {
  background: var(--vyre-interactive-primary-active);
}
.vyre-btn--secondary {
  background: var(--vyre-interactive-secondary);
  color: var(--vyre-interactive-secondary-foreground);
  border-color: var(--vyre-border-default);
}
.vyre-btn--secondary:hover:not(:disabled) { background: var(--vyre-interactive-secondary-hover); }
.vyre-btn--secondary:active:not(:disabled){ background: var(--vyre-interactive-secondary-active); }

.vyre-btn--ghost {
  background: var(--vyre-interactive-ghost);
  color: var(--vyre-interactive-ghost-foreground);
  border-color: transparent;
}
.vyre-btn--ghost:hover:not(:disabled) { background: var(--vyre-interactive-ghost-hover); }

.vyre-btn--destructive {
  background: var(--vyre-interactive-destructive);
  color: var(--vyre-interactive-destructive-foreground);
  border-color: var(--vyre-interactive-destructive);
}
.vyre-btn--destructive:hover:not(:disabled) { background: var(--vyre-interactive-destructive-hover); }
`,
    }),
  }),

  Card: (fw, variant) => ({
    description: 'Surface card with header, body, and optional footer.',
    files: renderFramework(fw, 'Card', variant, {
      props: [
        { name: 'title',    type: 'string',    default: "'Card title'" },
        { name: 'children', type: 'ReactNode', default: null, vueSlot: true },
      ],
      css: `
.vyre-card {
  background: var(--vyre-surface-card);
  border: 1px solid var(--vyre-border-subtle);
  border-radius: var(--vyre-radius-lg);
  box-shadow: var(--vyre-shadow-sm);
  overflow: hidden;
}
.vyre-card__header {
  padding: var(--vyre-space-4) var(--vyre-space-6);
  border-bottom: 1px solid var(--vyre-border-subtle);
}
.vyre-card__title {
  margin: 0;
  font-size: var(--vyre-font-size-lg);
  font-weight: 600;
  color: var(--vyre-content-primary);
}
.vyre-card__body {
  padding: var(--vyre-space-6);
  color: var(--vyre-content-secondary);
}
.vyre-card__footer {
  padding: var(--vyre-space-4) var(--vyre-space-6);
  border-top: 1px solid var(--vyre-border-subtle);
  background: var(--vyre-surface-subtle);
}
`,
    }),
  }),

  Input: (fw, variant) => ({
    description: 'Text input field with label, helper, and error state.',
    files: renderFramework(fw, 'Input', variant, {
      props: [
        { name: 'label',       type: 'string',  default: "'Label'" },
        { name: 'placeholder', type: 'string',  default: "''" },
        { name: 'error',       type: 'string',  default: 'null' },
        { name: 'helper',      type: 'string',  default: 'null' },
        { name: 'disabled',    type: 'boolean', default: 'false' },
      ],
      css: `
.vyre-field { display: flex; flex-direction: column; gap: var(--vyre-space-1); }
.vyre-label {
  font-size: var(--vyre-font-size-sm);
  font-weight: 500;
  color: var(--vyre-content-primary);
}
.vyre-input {
  width: 100%;
  padding: var(--vyre-space-2) var(--vyre-space-3);
  background: var(--vyre-surface-sunken);
  border: 1px solid var(--vyre-border-default);
  border-radius: var(--vyre-radius-md);
  color: var(--vyre-content-primary);
  font-size: var(--vyre-font-size-base);
  font-family: var(--vyre-font-family-sans);
  transition: border-color 120ms ease;
}
.vyre-input::placeholder { color: var(--vyre-content-muted); }
.vyre-input:focus {
  outline: none;
  border-color: var(--vyre-border-focus);
  box-shadow: 0 0 0 3px oklch(from var(--vyre-ring-default) l c h / 0.25);
}
.vyre-input:disabled { opacity: 0.5; cursor: not-allowed; }
.vyre-input--error { border-color: var(--vyre-status-danger-border); }
.vyre-helper { font-size: var(--vyre-font-size-sm); color: var(--vyre-content-muted); }
.vyre-helper--error { color: var(--vyre-status-danger-subtle-foreground); }
`,
    }),
  }),

  Badge: (fw, variant) => ({
    description: 'Status badge with semantic color variants.',
    files: renderFramework(fw, 'Badge', variant, {
      props: [
        { name: 'variant', type: "'success' | 'warning' | 'danger' | 'info' | 'default'", default: "'default'" },
        { name: 'children', type: 'ReactNode', default: null, vueSlot: true },
      ],
      css: `
.vyre-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--vyre-space-0-5) var(--vyre-space-2);
  border-radius: var(--vyre-radius-full);
  font-size: var(--vyre-font-size-xs);
  font-weight: 500;
  border: 1px solid transparent;
}
.vyre-badge--default {
  background: var(--vyre-surface-muted);
  color: var(--vyre-content-secondary);
  border-color: var(--vyre-border-subtle);
}
.vyre-badge--success {
  background: var(--vyre-status-success-subtle);
  color: var(--vyre-status-success-subtle-foreground);
  border-color: var(--vyre-status-success-border);
}
.vyre-badge--warning {
  background: var(--vyre-status-warning-subtle);
  color: var(--vyre-status-warning-subtle-foreground);
  border-color: var(--vyre-status-warning-border);
}
.vyre-badge--danger {
  background: var(--vyre-status-danger-subtle);
  color: var(--vyre-status-danger-subtle-foreground);
  border-color: var(--vyre-status-danger-border);
}
.vyre-badge--info {
  background: var(--vyre-status-info-subtle);
  color: var(--vyre-status-info-subtle-foreground);
  border-color: var(--vyre-status-info-border);
}
`,
    }),
  }),

  Alert: (fw, variant) => ({
    description: 'Alert / callout component with icon slot and dismissal.',
    files: renderFramework(fw, 'Alert', variant, {
      props: [
        { name: 'variant',  type: "'success' | 'warning' | 'danger' | 'info'", default: "'info'" },
        { name: 'title',    type: 'string',    default: null },
        { name: 'children', type: 'ReactNode', default: null, vueSlot: true },
      ],
      css: `
.vyre-alert {
  display: flex;
  gap: var(--vyre-space-3);
  padding: var(--vyre-space-4);
  border-radius: var(--vyre-radius-md);
  border: 1px solid;
}
.vyre-alert__body { flex: 1; }
.vyre-alert__title {
  margin: 0 0 var(--vyre-space-1);
  font-size: var(--vyre-font-size-sm);
  font-weight: 600;
}
.vyre-alert__content { font-size: var(--vyre-font-size-sm); }

.vyre-alert--success {
  background: var(--vyre-status-success-subtle);
  border-color: var(--vyre-status-success-border);
  color: var(--vyre-status-success-subtle-foreground);
}
.vyre-alert--warning {
  background: var(--vyre-status-warning-subtle);
  border-color: var(--vyre-status-warning-border);
  color: var(--vyre-status-warning-subtle-foreground);
}
.vyre-alert--danger {
  background: var(--vyre-status-danger-subtle);
  border-color: var(--vyre-status-danger-border);
  color: var(--vyre-status-danger-subtle-foreground);
}
.vyre-alert--info {
  background: var(--vyre-status-info-subtle);
  border-color: var(--vyre-status-info-border);
  color: var(--vyre-status-info-subtle-foreground);
}
`,
    }),
  }),
};

// ─── Framework renderers ──────────────────────────────────────────────────────

function renderFramework(fw, name, variant, { props, css }) {
  switch (fw.toLowerCase()) {
    case 'react':       return reactTemplate(name, props, css);
    case 'vue':         return vueTemplate(name, props, css);
    case 'svelte':      return svelteTemplate(name, props, css);
    case 'angular':     return angularTemplate(name, props, css);
    case 'html':
    case 'vanilla':     return htmlTemplate(name, props, css);
    default:
      console.error(`Unknown framework "${fw}". Use: react, vue, svelte, angular, html`);
      process.exit(1);
  }
}

function reactTemplate(name, props, css) {
  const compName = name;
  const lower = name.toLowerCase();
  const propTypes = props
    .filter(p => p.name !== 'children')
    .map(p => `  ${p.name}?: ${p.type};`)
    .join('\n');
  const propDefaults = props
    .filter(p => p.name !== 'children' && p.default !== null)
    .map(p => `  ${p.name} = ${p.default}`)
    .join(',\n  ');
  const variantProp = props.find(p => p.name === 'variant');
  const classVariant = variantProp ? `\`vyre-${lower} vyre-${lower}--\${variant} vyre-${lower}--\${size ?? 'md'}\`` : `\`vyre-${lower}\``;

  return [
    {
      name: `${name}.tsx`,
      content: `import type { ReactNode } from 'react';
import './${name}.css';

interface ${name}Props {
${propTypes}
  children?: ReactNode;
  className?: string;
}

export function ${compName}({
  ${propDefaults},
  children,
  className,
}: ${name}Props) {
  return (
    <div
      className={[${classVariant}, className].filter(Boolean).join(' ')}
      aria-disabled={${props.find(p => p.name === 'disabled') ? "'disabled' in arguments[0] && disabled ? true : undefined" : 'undefined'}}
    >
      {children}
    </div>
  );
}
`,
    },
    { name: `${name}.css`, content: css.trim() + '\n' },
  ];
}

function vueTemplate(name, props, css) {
  const lower = name.toLowerCase();
  const propsBlock = props
    .filter(p => p.name !== 'children')
    .map(p => {
      const typeStr = p.type.replace(/ReactNode|string\[\]/, 'String')
        .replace(/boolean/, 'Boolean')
        .replace(/[^'"a-zA-Z| ]+/, 'String');
      return `  ${p.name}: { type: String, default: ${p.default ?? 'undefined'} },`;
    })
    .join('\n');

  return [
    {
      name: `${name}.vue`,
      content: `<template>
  <div :class="['vyre-${lower}', \`vyre-${lower}--\${variant}\`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
${props.filter(p => p.name !== 'children').map(p => `  ${p.name}?: ${p.type};`).join('\n')}
}>(), {
${props.filter(p => p.name !== 'children' && p.default !== null).map(p => `  ${p.name}: ${p.default},`).join('\n')}
});
</script>

<style scoped src="./${name}.css" />
`,
    },
    { name: `${name}.css`, content: css.trim() + '\n' },
  ];
}

function svelteTemplate(name, props, css) {
  const lower = name.toLowerCase();
  const exports = props
    .filter(p => p.name !== 'children')
    .map(p => `  export let ${p.name}${p.default !== null ? ` = ${p.default}` : ''};`)
    .join('\n');

  return [
    {
      name: `${name}.svelte`,
      content: `<script lang="ts">
${exports}
</script>

<div class="vyre-${lower} vyre-${lower}--{variant}">
  <slot />
</div>

<style>
${css.trim()}
</style>
`,
    },
  ];
}

function angularTemplate(name, props, css) {
  const lower = name.toLowerCase();
  const selector = `vyre-${lower}`;
  const inputs = props
    .filter(p => p.name !== 'children')
    .map(p => `  @Input() ${p.name}${p.default !== null ? ` = ${p.default}` : '!'}: ${p.type};`)
    .join('\n');

  return [
    {
      name: `${lower}.component.ts`,
      content: `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '${selector}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${lower}.component.html',
  styleUrls: ['./${lower}.component.css'],
})
export class ${name}Component {
${inputs}
}
`,
    },
    {
      name: `${lower}.component.html`,
      content: `<div [class]="'vyre-${lower} vyre-${lower}--' + variant">
  <ng-content />
</div>
`,
    },
    { name: `${lower}.component.css`, content: css.trim() + '\n' },
  ];
}

function htmlTemplate(name, props, css) {
  const lower = name.toLowerCase();
  return [
    {
      name: `${lower}.html`,
      content: `<!-- Vyre ${name} — vanilla HTML example -->
<!-- Import tokens: <link rel="stylesheet" href="@gapra/vyre-tokens/css"> -->

<div class="vyre-${lower} vyre-${lower}--primary">
  ${name} content
</div>
`,
    },
    { name: `${lower}.css`, content: css.trim() + '\n' },
  ];
}

// ─── Entry ────────────────────────────────────────────────────────────────────

if (args['list-components']) {
  console.log('\nAvailable components:\n');
  for (const [k, fn] of Object.entries(COMPONENTS)) {
    const { description } = fn('react', 'default');
    console.log(`  ${k.padEnd(16)} ${description}`);
  }
  console.log('');
  process.exit(0);
}

if (args['list-frameworks']) {
  console.log('\nSupported frameworks:\n  react  vue  svelte  angular  html\n');
  process.exit(0);
}

if (!args.component) {
  console.log(`
Vyre generate-component — scaffold a token-native UI component.

Usage:
  node generate-component.mjs --component <Name> --framework <fw> [--out <dir>]

Options:
  -c, --component <Name>   Component name (Button, Card, Input, Badge, Alert)
  -f, --framework <fw>     Target framework: react (default), vue, svelte, angular, html
  -o, --out <dir>          Output directory (default: .)
      --variant <v>        Variant hint: default | ghost | outline
      --list-components    Show available components
      --list-frameworks    Show supported frameworks

Examples:
  node generate-component.mjs --component Button --framework react --out ./src/components
  node generate-component.mjs --component Badge --framework vue
`);
  process.exit(1);
}

const name = args.component;
const factory = COMPONENTS[name];
if (!factory) {
  console.error(`Unknown component "${name}". Run --list-components to see options.`);
  process.exit(1);
}

const { files } = factory(args.framework, args.variant);
const outDir = args.out ?? '.';
await mkdir(outDir, { recursive: true });

for (const file of files) {
  const dest = join(outDir, file.name);
  await writeFile(dest, file.content);
  console.log(`✓ ${dest}`);
}
console.log(`\nGenerated ${name} for ${args.framework}. Import @gapra/vyre-tokens/css for token variables.`);
