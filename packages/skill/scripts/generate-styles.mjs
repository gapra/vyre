#!/usr/bin/env node
/**
 * Generates 50+ UI style reference markdown files for the skill.
 * Each file: YAML frontmatter (machine-readable) + recipe (human-readable).
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'references', 'styles');

const STYLES = [
  // === SURFACE MORPHISMS ===
  {
    id: 'glassmorphism', category: 'morphism',
    description: 'Frosted-glass surfaces with backdrop blur, subtle transparency, and crisp edges.',
    when_to_use: ['Hero overlays', 'Modal backgrounds', 'Card stacking', 'Premium feel'],
    contraindications: ['Low-end devices (perf)', 'High-density data UI', 'Long-form text'],
    contraindicated_with: ['neumorphism', 'brutalism'],
    required_tokens: ['surface.panel', 'border.subtle', 'shadow.lg'],
    cost: 'high',
    a11y: 'Ensure content behind glass has sufficient blur — text may sit on noisy backgrounds.',
    recipe_css: `background: oklch(from var(--vyre-surface-panel) l c h / 0.7);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid oklch(from var(--vyre-border-subtle) l c h / 0.3);
box-shadow: var(--vyre-shadow-lg);`,
    do: ['Use over a colorful or photographic background', 'Keep blur radius 16-24px', 'Add subtle 1px hairline border'],
    dont: ['Use on flat solid backgrounds (no glass effect visible)', 'Stack 3+ layers', 'Combine with heavy shadows'],
  },
  {
    id: 'neumorphism', category: 'morphism',
    description: 'Soft UI with extruded surfaces — same color as background, defined by paired light/dark shadows.',
    when_to_use: ['Niche products', 'Music/audio apps', 'Smart home dashboards'],
    contraindications: ['Accessibility-first products', 'High-contrast needs', 'Forms and data UI'],
    contraindicated_with: ['glassmorphism', 'flat'],
    required_tokens: ['surface.background', 'shadow.lg', 'shadow.inner'],
    cost: 'medium',
    a11y: 'WARNING: Low contrast by design. Add explicit text contrast checks; use sparingly.',
    recipe_css: `background: var(--vyre-surface-background);
border-radius: var(--vyre-radius-xl);
box-shadow: 8px 8px 16px oklch(0% 0 0 / 0.1), -8px -8px 16px oklch(100% 0 0 / 0.7);`,
    do: ['Use light/medium gray backgrounds', 'Keep all elements monochromatic', 'Reserve for showcase elements'],
    dont: ['Use for primary CTAs (low affordance)', 'Mix with sharp/flat elements', 'Use on dark mode without testing'],
  },
  {
    id: 'claymorphism', category: 'morphism',
    description: '3D plasticky surfaces with rounded corners, inner light, and soft drop shadows.',
    when_to_use: ['Onboarding flows', 'Marketing pages', 'Kid/playful products'],
    contraindications: ['Dense dashboards', 'Editorial content'],
    contraindicated_with: ['brutalism', 'editorial'],
    required_tokens: ['surface.panel', 'shadow.xl', 'radius.2xl'],
    cost: 'medium',
    a11y: 'OK with normal contrast checks.',
    recipe_css: `background: var(--vyre-surface-panel);
border-radius: var(--vyre-radius-2xl);
box-shadow:
  inset 0 -4px 8px oklch(0% 0 0 / 0.05),
  inset 0 4px 8px oklch(100% 0 0 / 0.5),
  0 8px 24px oklch(0% 0 0 / 0.1);`,
    do: ['Pair with vibrant colors', 'Use generous padding', 'Round corners heavily (24px+)'],
    dont: ['Use on text-heavy content', 'Stack many layers', 'Mix with sharp geometric shapes'],
  },
  {
    id: 'skeuomorphic', category: 'morphism',
    description: 'Realistic textures and gradients mimicking physical materials.',
    when_to_use: ['Niche tools (e.g. analog audio plugins, watch apps)', 'Specific brand requests'],
    contraindications: ['Modern SaaS', 'Performance-critical', 'Most contexts in 2026'],
    contraindicated_with: ['flat', 'minimal'],
    required_tokens: ['shadow.md', 'shadow.inner'],
    cost: 'high',
    a11y: 'Test thoroughly — gradients can hurt contrast.',
    recipe_css: `background: linear-gradient(180deg, var(--vyre-surface-raised) 0%, var(--vyre-surface-sunken) 100%);
border: 1px solid var(--vyre-border-strong);
box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.5), 0 2px 4px oklch(0% 0 0 / 0.2);`,
    do: ['Keep texture restrained', 'Reserve for hero/feature elements'],
    dont: ['Use across whole UI', 'Use for general components'],
  },

  // === FLAT & MINIMAL ===
  {
    id: 'flat', category: 'flat',
    description: 'Pure flat colors, no shadows, sharp edges. The default modern style.',
    when_to_use: ['Default for most UI', 'Performance-critical apps', 'Content-focused products'],
    contraindications: ['Marketing pages needing depth'],
    contraindicated_with: ['skeuomorphic'],
    required_tokens: ['surface.background', 'content.primary'],
    cost: 'low',
    a11y: 'Excellent — high contrast inherent.',
    recipe_css: `background: var(--vyre-surface-card);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-md);`,
    do: ['Use generous whitespace', 'Rely on type hierarchy', 'Keep borders 1px or hairline'],
    dont: ['Add gratuitous shadows', 'Use gradients'],
  },
  {
    id: 'flat-2', category: 'flat',
    description: 'Flat with subtle shadows for elevation and depth cues. Most popular style.',
    when_to_use: ['SaaS apps', 'Dashboards', 'General product UI'],
    contraindications: [],
    contraindicated_with: ['neumorphism'],
    required_tokens: ['surface.card', 'shadow.sm', 'shadow.md'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-lg);
box-shadow: var(--vyre-shadow-sm);
transition: box-shadow var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard);
&:hover { box-shadow: var(--vyre-shadow-md); }`,
    do: ['Use shadow for elevation hints', 'Animate shadow on hover'],
    dont: ['Use heavy shadows (xl+) for routine elements'],
  },
  {
    id: 'clean-modern', category: 'flat',
    description: 'Refined flat with hairline borders, subtle shadows, generous whitespace.',
    when_to_use: ['Default fallback', 'B2B SaaS', 'Productivity tools'],
    contraindications: [],
    contraindicated_with: [],
    required_tokens: ['surface.card', 'border.subtle', 'shadow.xs'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: var(--vyre-surface-card);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-lg);
box-shadow: var(--vyre-shadow-xs);`,
    do: ['Use for default product UI', 'Pair with sans-serif type', 'Use space-4 minimum padding'],
    dont: ['Compete with content', 'Use bright accent colors as fills'],
  },
  {
    id: 'minimal', category: 'flat',
    description: 'Maximum restraint. Borders only, no fills, no shadows.',
    when_to_use: ['Editorial sites', 'Reading apps', 'Portfolio sites'],
    contraindications: ['Dashboards needing visual hierarchy'],
    contraindicated_with: ['claymorphism', 'neumorphism'],
    required_tokens: ['border.subtle', 'content.primary'],
    cost: 'low',
    a11y: 'Excellent if type hierarchy is strong.',
    recipe_css: `background: transparent;
border-top: 1px solid var(--vyre-border-subtle);
padding: var(--vyre-space-6) 0;`,
    do: ['Lean on typographic hierarchy', 'Use whitespace as separator', 'Single accent color'],
    dont: ['Add decorative elements', 'Use multiple accent colors'],
  },

  // === EDITORIAL & TYPOGRAPHIC ===
  {
    id: 'editorial', category: 'editorial',
    description: 'Magazine-style with strong typography, asymmetric grid, generous margins.',
    when_to_use: ['Long-form content', 'Newsletters', 'Blogs', 'Storytelling'],
    contraindications: ['Dense data UI', 'Forms'],
    contraindicated_with: ['brutalism'],
    required_tokens: ['font.family.serif', 'font.family.sans', 'font.size.4xl'],
    cost: 'low',
    a11y: 'Excellent for readability.',
    recipe_css: `font-family: var(--vyre-font-family-serif);
max-width: 65ch;
line-height: var(--vyre-font-line-height-relaxed);
font-size: var(--vyre-font-size-lg);`,
    do: ['Mix serif body + sans display', 'Use drop caps', 'Honor 65ch line length', 'Vertical rhythm'],
    dont: ['Stuff with UI elements', 'Use justified text', 'Cram side panels'],
  },
  {
    id: 'swiss-grid', category: 'editorial',
    description: 'International Typographic Style. Strict 12-column grid, sans-serif, asymmetric, no decoration.',
    when_to_use: ['Portfolios', 'Architecture sites', 'Corporate identity'],
    contraindications: ['Playful brands', 'E-commerce'],
    contraindicated_with: ['memphis', 'playful'],
    required_tokens: ['font.family.sans', 'font.weight.bold'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `display: grid;
grid-template-columns: repeat(12, 1fr);
gap: var(--vyre-space-6);
font-family: var(--vyre-font-family-sans);`,
    do: ['Use Helvetica/Inter', 'Strict grid alignment', 'Black/white/single accent'],
    dont: ['Center text', 'Use ornaments', 'Break the grid for fun'],
  },
  {
    id: 'newspaper', category: 'editorial',
    description: 'Multi-column dense text, classic serif, traditional hierarchy.',
    when_to_use: ['News sites', 'Long articles'],
    contraindications: ['Mobile-first', 'Modern SaaS'],
    contraindicated_with: ['minimal'],
    required_tokens: ['font.family.serif'],
    cost: 'low',
    a11y: 'Good with proper line length.',
    recipe_css: `column-count: 2;
column-gap: var(--vyre-space-8);
font-family: var(--vyre-font-family-serif);
hyphens: auto;`,
    do: ['Use on desktop articles', 'Hyphenate', 'Drop caps for openings'],
    dont: ['Use on mobile (column nav awful)', 'Use sans-serif'],
  },
  {
    id: 'blog-clean', category: 'editorial',
    description: 'Modern blog: sans-serif, single column, ample whitespace.',
    when_to_use: ['Personal blogs', 'Documentation', 'Reading apps'],
    contraindications: [],
    contraindicated_with: [],
    required_tokens: ['font.family.sans', 'space.6'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `max-width: 70ch;
margin: 0 auto;
padding: var(--vyre-space-12) var(--vyre-space-6);
font-size: var(--vyre-font-size-lg);
line-height: var(--vyre-font-line-height-relaxed);`,
    do: ['Generous line height (1.65+)', 'Honor reading width', 'Strong heading hierarchy'],
    dont: ['Use full-width text', 'Cram sidebars'],
  },
  {
    id: 'gallery', category: 'editorial',
    description: 'Gallery-style with image-forward composition, sparse text, generous margins.',
    when_to_use: ['Portfolios', 'Photography', 'Product showcases'],
    contraindications: ['Data-heavy UI'],
    contraindicated_with: [],
    required_tokens: ['space.16', 'font.family.serif'],
    cost: 'low',
    a11y: 'Good if alt text used.',
    recipe_css: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: var(--vyre-space-8);
padding: var(--vyre-space-16);`,
    do: ['Massive whitespace', 'Captions in small caps', 'Black/white only'],
    dont: ['Crowd images', 'Add UI chrome'],
  },

  // === BRUTALIST FAMILY ===
  {
    id: 'brutalism', category: 'brutalist',
    description: 'Raw, deliberately ugly, exposed structure. System fonts, sharp edges, harsh colors.',
    when_to_use: ['Statement landing pages', 'Art/cultural sites', 'Tech-rebel brands'],
    contraindications: ['Enterprise', 'Healthcare', 'General consumer products'],
    contraindicated_with: ['glassmorphism', 'claymorphism', 'minimal'],
    required_tokens: ['border.width.4', 'font.family.mono'],
    cost: 'low',
    a11y: 'Test extensively — high-contrast but unconventional patterns.',
    recipe_css: `background: var(--vyre-surface-background);
border: 4px solid var(--vyre-content-primary);
font-family: var(--vyre-font-family-mono);
border-radius: 0;
box-shadow: 8px 8px 0 var(--vyre-content-primary);`,
    do: ['Use thick black borders', 'Hard offset shadows (no blur)', 'Monospace fonts', 'No border radius'],
    dont: ['Soften anything', 'Add gradients', 'Use for serious products'],
  },
  {
    id: 'neo-brutalism', category: 'brutalist',
    description: 'Brutalism softened with bold colors and chunky rounded corners.',
    when_to_use: ['Indie SaaS landing', 'Creator products', 'Bold marketing'],
    contraindications: ['Enterprise'],
    contraindicated_with: ['minimal'],
    required_tokens: ['border.width.2', 'shadow.md'],
    cost: 'low',
    a11y: 'Good with verified contrast.',
    recipe_css: `background: var(--vyre-interactive-primary-subtle);
border: 2px solid var(--vyre-content-primary);
border-radius: var(--vyre-radius-md);
box-shadow: 4px 4px 0 var(--vyre-content-primary);
font-weight: var(--vyre-font-weight-bold);`,
    do: ['Use chunky 2-4px borders', 'Hard offset shadows', 'Saturated background colors', 'Bold weights'],
    dont: ['Use soft shadows', 'Mix with gradients', 'Use for utility UI'],
  },
  {
    id: 'anti-design', category: 'brutalist',
    description: 'Intentionally clashing — breaks conventions for artistic effect.',
    when_to_use: ['Avant-garde art sites', 'Statement projects'],
    contraindications: ['Almost everything else'],
    contraindicated_with: ['*'],
    required_tokens: [],
    cost: 'low',
    a11y: 'Difficult — requires deliberate craft.',
    recipe_css: `font-family: Comic Sans MS, var(--vyre-font-family-sans);
background: var(--vyre-status-warning-solid);
color: var(--vyre-status-danger-solid);
transform: rotate(-1deg);`,
    do: ['Break grid', 'Mismatched fonts', 'Tilted elements'],
    dont: ['Use unironically for products people need', 'Sacrifice a11y'],
  },

  // === EXPRESSIVE ===
  {
    id: 'aurora', category: 'expressive',
    description: 'Atmospheric gradients evoking northern lights — soft hue shifts and luminous backgrounds.',
    when_to_use: ['Landing pages', 'AI products', 'Hero sections'],
    contraindications: ['Dense UI'],
    contraindicated_with: ['flat', 'minimal'],
    required_tokens: ['palette.aurora', 'shadow.xl'],
    cost: 'medium',
    a11y: 'Ensure overlay contrast for any text on gradients.',
    recipe_css: `background: linear-gradient(135deg,
  oklch(70% 0.18 160) 0%,
  oklch(60% 0.22 220) 50%,
  oklch(65% 0.24 295) 100%
);
filter: blur(0);`,
    do: ['Use diagonal gradients', 'Combine with glassmorphism', 'Subtle animation OK'],
    dont: ['Place body text directly on gradient', 'Use for buttons'],
  },
  {
    id: 'bento', category: 'expressive',
    description: 'Asymmetric grid of varied-size cards, like a bento box.',
    when_to_use: ['Product showcases', 'Feature highlights', 'Personal portfolios'],
    contraindications: ['Sequential content'],
    contraindicated_with: [],
    required_tokens: ['surface.card', 'space.4', 'radius.xl'],
    cost: 'low',
    a11y: 'Excellent if reading order is logical.',
    recipe_css: `display: grid;
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: minmax(120px, auto);
gap: var(--vyre-space-4);
& > .feature { grid-column: span 2; grid-row: span 2; }`,
    do: ['Vary card sizes meaningfully', 'Use rounded corners (xl+)', 'Each tile has one focus'],
    dont: ['Random sizing', 'Cram tiles', 'Mix radius values'],
  },
  {
    id: 'cyberpunk', category: 'expressive',
    description: 'Neon-on-dark with sharp angles, scanlines, glow effects.',
    when_to_use: ['Gaming sites', 'Crypto', 'Sci-fi products'],
    contraindications: ['Healthcare', 'Finance', 'B2B'],
    contraindicated_with: ['minimal', 'editorial'],
    required_tokens: ['palette.cyberpunk', 'shadow.lg'],
    cost: 'medium',
    a11y: 'Test glow effects — they can hurt readability.',
    recipe_css: `background: oklch(15% 0.05 270);
color: oklch(85% 0.22 320);
border: 1px solid oklch(75% 0.28 175);
box-shadow: 0 0 20px oklch(75% 0.28 175 / 0.5);
text-shadow: 0 0 4px currentColor;`,
    do: ['Use neon pink + cyan', 'Add subtle glow', 'Sharp clip-path edges'],
    dont: ['Glow body text heavily', 'Use for forms'],
  },
  {
    id: 'synthwave', category: 'expressive',
    description: '80s sunset gradients with grid horizons and neon accents.',
    when_to_use: ['Music apps', 'Retro themes', 'Hero sections'],
    contraindications: ['Serious products'],
    contraindicated_with: [],
    required_tokens: ['palette.synthwave'],
    cost: 'medium',
    a11y: 'Use with strong text overlays.',
    recipe_css: `background: linear-gradient(180deg, oklch(20% 0.15 270) 0%, oklch(60% 0.28 320) 100%);
color: oklch(95% 0.04 60);`,
    do: ['Magenta-to-purple gradient', 'Neon outlines', 'Pixel grid backgrounds'],
    dont: ['Use for dashboards', 'Combine with flat'],
  },
  {
    id: 'vaporwave', category: 'expressive',
    description: 'Pastel cyan/pink/purple aesthetic with retro tech motifs.',
    when_to_use: ['Niche creative sites', 'Music platforms'],
    contraindications: ['Most products'],
    contraindicated_with: [],
    required_tokens: ['palette.vaporwave'],
    cost: 'low',
    a11y: 'Verify pastel-on-pastel contrast.',
    recipe_css: `background: linear-gradient(135deg, oklch(85% 0.10 195) 0%, oklch(85% 0.14 320) 100%);`,
    do: ['Pastel gradients', 'Roman busts/grid imagery'],
    dont: ['Use unironically without context'],
  },

  // === MATERIAL & PLATFORM ===
  {
    id: 'material-3', category: 'material',
    description: 'Google Material Design 3: dynamic color, expressive shapes, elevation tiers.',
    when_to_use: ['Android apps', 'Cross-platform with Android', 'Google product alignment'],
    contraindications: ['iOS-only apps'],
    contraindicated_with: ['hig', 'fluent'],
    required_tokens: ['shadow.sm', 'shadow.md', 'radius.lg'],
    cost: 'medium',
    a11y: 'Excellent — Material has strong a11y baseline.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-xl);
box-shadow: 0 1px 3px oklch(0% 0 0 / 0.12), 0 1px 2px oklch(0% 0 0 / 0.24);
padding: var(--vyre-space-4);`,
    do: ['Use elevation tiers consistently', 'Dynamic color from wallpaper', 'Strong FAB usage'],
    dont: ['Mix with flat', 'Skip elevation'],
  },
  {
    id: 'fluent-2', category: 'material',
    description: 'Microsoft Fluent 2: depth, motion, materials (acrylic, mica).',
    when_to_use: ['Windows apps', 'Microsoft ecosystem'],
    contraindications: ['iOS', 'Web with no platform tie'],
    contraindicated_with: ['material-3'],
    required_tokens: ['shadow.md', 'radius.md'],
    cost: 'medium',
    a11y: 'Good.',
    recipe_css: `background: oklch(from var(--vyre-surface-panel) l c h / 0.8);
backdrop-filter: blur(60px) saturate(125%);
border: 1px solid var(--vyre-border-subtle);
border-radius: var(--vyre-radius-md);`,
    do: ['Use acrylic for sidebars', 'Mica for windows', 'Reveal effect on hover'],
    dont: ['Mix with material', 'Skip depth'],
  },
  {
    id: 'hig', category: 'material',
    description: 'Apple Human Interface Guidelines: cleanliness, deference, depth.',
    when_to_use: ['iOS/macOS apps', 'Apple-aligned products'],
    contraindications: ['Android-only'],
    contraindicated_with: ['material-3', 'fluent-2'],
    required_tokens: ['radius.xl', 'shadow.sm'],
    cost: 'low',
    a11y: 'Excellent — HIG mandates a11y.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-2xl);
box-shadow: 0 4px 16px oklch(0% 0 0 / 0.08);
font-family: -apple-system, BlinkMacSystemFont, var(--vyre-font-family-sans);`,
    do: ['Use SF Pro / system fonts', 'Generous corner radii', 'Subtle vibrancy effects'],
    dont: ['Use Material elevation', 'Sharp corners'],
  },
  {
    id: 'liquid-glass', category: 'material',
    description: 'Apple Liquid Glass aesthetic: translucent, refractive surfaces.',
    when_to_use: ['Apple platform showcases', 'Premium iOS/macOS apps'],
    contraindications: ['Performance-constrained', 'Web with broad audience'],
    contraindicated_with: ['flat', 'brutalism'],
    required_tokens: ['surface.panel', 'shadow.xl'],
    cost: 'high',
    a11y: 'Test thoroughly with motion users.',
    recipe_css: `background: oklch(from var(--vyre-surface-panel) l c h / 0.6);
backdrop-filter: blur(40px) saturate(200%);
border: 0.5px solid oklch(100% 0 0 / 0.2);
border-radius: var(--vyre-radius-2xl);
box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.5), 0 8px 32px oklch(0% 0 0 / 0.12);`,
    do: ['Layer over rich backgrounds', 'Subtle highlight at top edge'],
    dont: ['Use over solid colors', 'Stack heavily'],
  },

  // === DASHBOARDS ===
  {
    id: 'dashboard-dense', category: 'dashboard',
    description: 'Information-dense dashboard. Tight spacing, small fonts, clear data hierarchy.',
    when_to_use: ['Trading platforms', 'Analytics tools', 'Admin panels'],
    contraindications: ['Marketing sites', 'Mobile-first'],
    contraindicated_with: ['editorial', 'gallery'],
    required_tokens: ['space.2', 'font.size.sm', 'border.subtle'],
    cost: 'low',
    a11y: 'Test with zoom users — small text needs reflow.',
    recipe_css: `font-size: var(--vyre-font-size-sm);
padding: var(--vyre-space-2) var(--vyre-space-3);
border-bottom: 1px solid var(--vyre-border-subtle);`,
    do: ['Use 13-14px base text', 'Hairline borders', 'Tabular numbers', 'Sticky headers'],
    dont: ['Add padding > space-3', 'Use big radius', 'Decorate'],
  },
  {
    id: 'dashboard-airy', category: 'dashboard',
    description: 'Modern dashboard with breathing room — cards, generous spacing, clear data viz.',
    when_to_use: ['SaaS dashboards', 'Health/wellness apps', 'Personal analytics'],
    contraindications: ['Trading floor density'],
    contraindicated_with: ['dashboard-dense'],
    required_tokens: ['surface.card', 'space.6', 'shadow.sm'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-lg);
padding: var(--vyre-space-6);
box-shadow: var(--vyre-shadow-sm);`,
    do: ['Card-per-metric layout', 'Generous space between cards', 'Charts breathe'],
    dont: ['Edge-to-edge tables', 'No whitespace'],
  },
  {
    id: 'admin', category: 'dashboard',
    description: 'Sober admin panel — tables, sidebars, action toolbars.',
    when_to_use: ['Backoffice tools', 'CMS', 'Internal admin'],
    contraindications: ['Customer-facing'],
    contraindicated_with: [],
    required_tokens: ['border.default', 'space.4'],
    cost: 'low',
    a11y: 'Good.',
    recipe_css: `display: grid;
grid-template-columns: 240px 1fr;
border-top: 1px solid var(--vyre-border-default);`,
    do: ['Persistent sidebar nav', 'Bulk actions', 'Filter/search prominent'],
    dont: ['Hide nav', 'Modal-heavy flows'],
  },

  // === RETRO & VINTAGE ===
  {
    id: 'terminal', category: 'retro',
    description: 'CLI terminal aesthetic: monospace, minimal chrome, single accent color.',
    when_to_use: ['Dev tools', 'Hacker culture sites'],
    contraindications: ['Mainstream products'],
    contraindicated_with: ['claymorphism'],
    required_tokens: ['font.family.mono', 'palette.green-crt'],
    cost: 'low',
    a11y: 'Good with proper contrast.',
    recipe_css: `font-family: var(--vyre-font-family-mono);
background: oklch(8% 0.02 130);
color: oklch(80% 0.20 130);
padding: var(--vyre-space-4);`,
    do: ['Monospace everywhere', 'Caret/cursor effects', 'ASCII separators'],
    dont: ['Mix with sans', 'Use color besides accent + neutrals'],
  },
  {
    id: 'mid-century-modern', category: 'retro',
    description: 'Mid-century: warm earth tones, geometric shapes, generous whitespace.',
    when_to_use: ['Furniture/home goods', 'Retro brands'],
    contraindications: ['Tech products'],
    contraindicated_with: ['cyberpunk'],
    required_tokens: ['palette.mid-century'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: oklch(from var(--vyre-color-primitive-amber-3) l c h);
font-family: var(--vyre-font-family-display);`,
    do: ['Warm color palette', 'Geometric shapes', 'Asymmetric layouts'],
    dont: ['Use modernist minimalism'],
  },
  {
    id: 'memphis', category: 'retro',
    description: '80s Memphis design: bold colors, geometric patterns, playful chaos.',
    when_to_use: ['Statement landing pages', 'Creative portfolios'],
    contraindications: ['Most products'],
    contraindicated_with: ['minimal', 'editorial'],
    required_tokens: ['palette.memphis'],
    cost: 'medium',
    a11y: 'Test pattern overlay contrast.',
    recipe_css: `background: var(--vyre-surface-card);
background-image: url("data:image/svg+xml,...");`,
    do: ['Squiggles, dots, zigzags', 'Mix saturated colors'],
    dont: ['Use for text-heavy content', 'Take seriously'],
  },
  {
    id: 'art-deco', category: 'retro',
    description: 'Art Deco: gold-on-navy, geometric symmetry, ornate borders.',
    when_to_use: ['Luxury brands', 'Wedding/event sites'],
    contraindications: ['SaaS', 'Tech'],
    contraindicated_with: [],
    required_tokens: ['palette.art-deco'],
    cost: 'medium',
    a11y: 'Verify gold-on-dark contrast.',
    recipe_css: `background: oklch(20% 0.10 240);
color: oklch(75% 0.18 75);
border: 2px solid currentColor;
font-family: var(--vyre-font-family-display);`,
    do: ['Symmetric layouts', 'Gold/brass accents', 'Bold serif display fonts'],
    dont: ['Use for product UI'],
  },
  {
    id: 'y2k', category: 'retro',
    description: 'Y2K aesthetic: chrome, gradients, frosted glass, cyan/magenta.',
    when_to_use: ['Niche creative sites', 'Music/fashion'],
    contraindications: ['Most products'],
    contraindicated_with: ['minimal'],
    required_tokens: ['palette.y2k'],
    cost: 'medium',
    a11y: 'Test gradient text.',
    recipe_css: `background: linear-gradient(135deg, oklch(85% 0.18 195) 0%, oklch(80% 0.22 320) 100%);
backdrop-filter: blur(10px);
border: 1px solid oklch(100% 0 0 / 0.4);`,
    do: ['Chrome/silver textures', 'Bubbly type', 'Lens flare accents'],
    dont: ['Use unironically for serious products'],
  },

  // === SPECIALIZED ===
  {
    id: 'kiosk', category: 'specialized',
    description: 'Large touch targets, high contrast, simple navigation. For public terminals.',
    when_to_use: ['Self-service kiosks', 'Wayfinding', 'Accessibility-first'],
    contraindications: ['Mouse/keyboard products'],
    contraindicated_with: [],
    required_tokens: ['space.10', 'font.size.3xl'],
    cost: 'low',
    a11y: 'Required: WCAG AAA.',
    recipe_css: `font-size: var(--vyre-font-size-3xl);
padding: var(--vyre-space-10);
min-height: 64px;
border-radius: var(--vyre-radius-xl);`,
    do: ['64px+ touch targets', 'AAA contrast', 'Few choices per screen'],
    dont: ['Hover states', 'Tooltips', 'Small text'],
  },
  {
    id: 'mobile-first', category: 'specialized',
    description: 'Thumb-friendly bottom nav, swipe gestures, tall touch zones.',
    when_to_use: ['Mobile apps', 'Mobile-web priority'],
    contraindications: ['Desktop-only'],
    contraindicated_with: [],
    required_tokens: ['space.4', 'radius.lg'],
    cost: 'low',
    a11y: 'Targets ≥44px.',
    recipe_css: `padding: var(--vyre-space-4);
min-height: 44px;
border-radius: var(--vyre-radius-lg);
& nav { position: fixed; bottom: 0; }`,
    do: ['Bottom nav', 'Tall buttons', 'Sheet modals'],
    dont: ['Tiny taps', 'Hover-only interactions'],
  },
  {
    id: 'high-density-table', category: 'specialized',
    description: 'Spreadsheet-density tables: tabular nums, sticky headers, compact rows.',
    when_to_use: ['Data tools', 'Trading', 'Spreadsheet UIs'],
    contraindications: ['Casual UIs'],
    contraindicated_with: [],
    required_tokens: ['font.family.mono', 'space.1', 'space.2'],
    cost: 'low',
    a11y: 'Zoom-friendly required.',
    recipe_css: `font-variant-numeric: tabular-nums;
font-size: var(--vyre-font-size-sm);
padding: var(--vyre-space-1) var(--vyre-space-2);
border-bottom: 1px solid var(--vyre-border-subtle);`,
    do: ['Tabular numbers', 'Right-align numbers', 'Sticky headers/columns', 'Zebra rows optional'],
    dont: ['Center numeric data', 'Use proportional fonts for numbers'],
  },
  {
    id: 'wireframe', category: 'specialized',
    description: 'Schematic black-on-white wireframe look — for prototypes, drafts.',
    when_to_use: ['Mockups', 'Drafts', 'Architectural diagrams'],
    contraindications: ['Production'],
    contraindicated_with: [],
    required_tokens: ['border.width.1'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: var(--vyre-surface-background);
border: 1px solid var(--vyre-content-primary);
font-family: var(--vyre-font-family-mono);`,
    do: ['Use for early drafts', 'Pure b&w'],
    dont: ['Ship to production'],
  },
  {
    id: 'blueprint', category: 'specialized',
    description: 'Engineering blueprint: cyan-on-navy with technical typography.',
    when_to_use: ['Engineering tools', 'Architecture sites'],
    contraindications: ['General UI'],
    contraindicated_with: [],
    required_tokens: ['palette.tech-blue'],
    cost: 'low',
    a11y: 'Verify cyan-on-navy contrast.',
    recipe_css: `background: oklch(20% 0.12 240);
color: oklch(85% 0.10 220);
font-family: var(--vyre-font-family-mono);
border: 1px solid currentColor;`,
    do: ['Grid backgrounds', 'Technical labels', 'Drafting font'],
    dont: ['Mix with other styles'],
  },

  // === ATMOSPHERIC ===
  {
    id: 'gradient-mesh', category: 'expressive',
    description: 'Multi-stop mesh gradients for atmospheric backgrounds.',
    when_to_use: ['Hero sections', 'AI products', 'Modern landing'],
    contraindications: ['Body content backgrounds'],
    contraindicated_with: ['flat'],
    required_tokens: ['shadow.xl'],
    cost: 'medium',
    a11y: 'Always overlay solid surface for content.',
    recipe_css: `background:
  radial-gradient(at 20% 30%, oklch(70% 0.20 264) 0%, transparent 50%),
  radial-gradient(at 80% 60%, oklch(70% 0.20 175) 0%, transparent 50%),
  oklch(98% 0.005 240);`,
    do: ['Use as page bg with content cards on top', 'Animate slowly'],
    dont: ['Place text directly on it', 'Use multiple meshes'],
  },
  {
    id: 'noise', category: 'expressive',
    description: 'Subtle film-grain texture across surfaces.',
    when_to_use: ['Premium brands', 'Editorial sites', 'Gallery sites'],
    contraindications: ['Performance critical'],
    contraindicated_with: ['flat'],
    required_tokens: [],
    cost: 'medium',
    a11y: 'Subtle noise OK; avoid for dyslexia profiles.',
    recipe_css: `position: relative;
&::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG grain */
  opacity: 0.04;
  pointer-events: none;
}`,
    do: ['Use 3-5% opacity', 'Apply to backgrounds only'],
    dont: ['Apply to small UI elements', 'Use over text'],
  },

  // === PLAYFUL ===
  {
    id: 'playful-pop', category: 'playful',
    description: 'Bright saturated colors, chunky rounded shapes, friendly type.',
    when_to_use: ['Consumer apps', 'Education', 'Kid products', 'Marketing'],
    contraindications: ['Enterprise', 'Finance'],
    contraindicated_with: ['minimal', 'editorial'],
    required_tokens: ['radius.2xl', 'palette.candy'],
    cost: 'low',
    a11y: 'Test contrast carefully with bright pastels.',
    recipe_css: `background: var(--vyre-color-primitive-pink-4);
border-radius: var(--vyre-radius-2xl);
padding: var(--vyre-space-6);
font-weight: var(--vyre-font-weight-bold);`,
    do: ['Saturated palette', 'Rounded everything', 'Bouncy animations'],
    dont: ['Use for serious flows', 'Combine with dense data'],
  },
  {
    id: 'kawaii', category: 'playful',
    description: 'Cute Japanese-inspired aesthetic: soft pastels, rounded everything, friendly faces.',
    when_to_use: ['Kid apps', 'Niche cute brands'],
    contraindications: ['Most products'],
    contraindicated_with: [],
    required_tokens: ['palette.kawaii'],
    cost: 'low',
    a11y: 'Test pastel contrast.',
    recipe_css: `background: oklch(95% 0.06 340);
border-radius: var(--vyre-radius-3xl);`,
    do: ['Soft pinks/blues', 'Rounded mascots', 'Friendly micro-copy'],
    dont: ['Use unironically for B2B'],
  },
  {
    id: 'illustrated', category: 'playful',
    description: 'Custom illustrations as primary visual element, supportive UI.',
    when_to_use: ['Onboarding', 'Empty states', 'Marketing'],
    contraindications: ['Data UI'],
    contraindicated_with: [],
    required_tokens: ['surface.background'],
    cost: 'high',
    a11y: 'Decorative — provide alt text.',
    recipe_css: `display: flex;
flex-direction: column;
align-items: center;
gap: var(--vyre-space-6);`,
    do: ['Use illustrations to clarify concepts', 'Stylistically consistent set'],
    dont: ['Use random stock illustrations', 'Block content with art'],
  },

  // === CONTENT-FOCUSED ===
  {
    id: 'reading-mode', category: 'editorial',
    description: 'Optimized for long reading: warm tones, comfortable line length, no chrome.',
    when_to_use: ['Article views', 'Reader apps', 'Documentation'],
    contraindications: ['Interactive UI'],
    contraindicated_with: [],
    required_tokens: ['palette.reading'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: oklch(98% 0.02 75);
color: oklch(20% 0.04 30);
max-width: 65ch;
font-size: var(--vyre-font-size-lg);
line-height: var(--vyre-font-line-height-relaxed);`,
    do: ['Warm cream background', 'Generous line height', 'Optical sizing if available'],
    dont: ['Pure white background', 'Cram sidebars'],
  },
  {
    id: 'documentation', category: 'editorial',
    description: 'Technical docs: clear hierarchy, monospace inline code, sidebar nav.',
    when_to_use: ['Dev docs', 'API references', 'Knowledge bases'],
    contraindications: ['Marketing'],
    contraindicated_with: [],
    required_tokens: ['font.family.mono', 'border.subtle'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `font-family: var(--vyre-font-family-sans);
& code { font-family: var(--vyre-font-family-mono); background: var(--vyre-surface-muted); padding: 2px 6px; border-radius: var(--vyre-radius-sm); }`,
    do: ['Sidebar TOC', 'Inline code highlighting', 'Anchor links on headings'],
    dont: ['Marketing fluff', 'Animation distractions'],
  },

  // === TRANSITION-HEAVY ===
  {
    id: 'animated-rich', category: 'expressive',
    description: 'Heavy use of motion, scroll-triggered animations, hover interactions.',
    when_to_use: ['Marketing pages', 'Showcases'],
    contraindications: ['Productivity apps', 'Reduced-motion users'],
    contraindicated_with: ['kiosk'],
    required_tokens: ['motion.duration.smooth', 'motion.easing.standard'],
    cost: 'high',
    a11y: 'CRITICAL: respect prefers-reduced-motion.',
    recipe_css: `@media (prefers-reduced-motion: no-preference) {
  transition: all var(--vyre-motion-duration-smooth) var(--vyre-motion-easing-standard);
}`,
    do: ['Always wrap in prefers-reduced-motion', 'Subtle by default', 'Animate transforms not layout'],
    dont: ['Auto-playing carousels', 'Parallax everywhere', 'Block content for animation'],
  },

  // === HYBRID & EMERGING ===
  {
    id: 'soft-modern', category: 'flat',
    description: 'Modern flat with extra-large radius and pastel palettes.',
    when_to_use: ['Wellness apps', 'Lifestyle products'],
    contraindications: [],
    contraindicated_with: [],
    required_tokens: ['radius.2xl', 'shadow.sm'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-2xl);
box-shadow: var(--vyre-shadow-sm);
padding: var(--vyre-space-6);`,
    do: ['Use 24px+ radius', 'Pastel palettes', 'Soft shadows'],
    dont: ['Sharp corners', 'Saturated palettes'],
  },
  {
    id: 'sticker', category: 'playful',
    description: 'Sticker-pack aesthetic: chunky outlines, drop shadows, layered cards.',
    when_to_use: ['Social apps', 'Creator tools', 'Marketing'],
    contraindications: ['Enterprise'],
    contraindicated_with: ['minimal'],
    required_tokens: ['border.width.4', 'shadow.lg'],
    cost: 'low',
    a11y: 'Good.',
    recipe_css: `background: var(--vyre-surface-card);
border: 4px solid var(--vyre-content-primary);
border-radius: var(--vyre-radius-xl);
box-shadow: 8px 8px 0 var(--vyre-content-primary);
transform: rotate(-1deg);`,
    do: ['Thick outlines', 'Hard shadows', 'Slight rotations'],
    dont: ['Use for forms', 'Stack many tilted elements'],
  },
  {
    id: 'magazine-modern', category: 'editorial',
    description: 'Modern magazine: large display type, image-led, generous margins.',
    when_to_use: ['Editorial sites', 'Long-form content'],
    contraindications: ['Apps'],
    contraindicated_with: [],
    required_tokens: ['font.size.7xl', 'space.16'],
    cost: 'low',
    a11y: 'Excellent.',
    recipe_css: `& h1 { font-size: var(--vyre-font-size-7xl); font-weight: var(--vyre-font-weight-bold); line-height: var(--vyre-font-line-height-tight); }
& article { padding: var(--vyre-space-16) var(--vyre-space-8); }`,
    do: ['Massive headlines', 'Pull quotes', 'Multi-column layouts'],
    dont: ['Cram content', 'Skip whitespace'],
  },
  {
    id: 'dark-luxe', category: 'premium',
    description: 'Dark mode luxury: deep blacks, gold/silver accents, elegant serifs.',
    when_to_use: ['Luxury e-commerce', 'High-end services'],
    contraindications: ['Mass market'],
    contraindicated_with: [],
    required_tokens: ['palette.gold-luxe', 'shadow.xl'],
    cost: 'medium',
    a11y: 'Verify gold/silver text contrast.',
    recipe_css: `background: oklch(8% 0.005 30);
color: oklch(95% 0.04 60);
font-family: var(--vyre-font-family-serif);
& .accent { color: oklch(75% 0.16 75); }`,
    do: ['Deep #000-#111 backgrounds', 'Metallic accents', 'Serif display'],
    dont: ['Use saturated colors as fills', 'Dilute with too many accents'],
  },
  {
    id: 'floating', category: 'expressive',
    description: 'Floating cards/elements with deep shadows and subtle hover lift.',
    when_to_use: ['Showcase sites', 'Modern landings'],
    contraindications: ['Dense data UI'],
    contraindicated_with: [],
    required_tokens: ['shadow.xl', 'shadow.2xl'],
    cost: 'low',
    a11y: 'Good.',
    recipe_css: `background: var(--vyre-surface-card);
border-radius: var(--vyre-radius-xl);
box-shadow: var(--vyre-shadow-xl);
transition: transform var(--vyre-motion-duration-fast) var(--vyre-motion-easing-standard), box-shadow var(--vyre-motion-duration-fast);
&:hover { transform: translateY(-4px); box-shadow: var(--vyre-shadow-2xl); }`,
    do: ['Lift on hover', 'Use deep shadows', 'Generous radius'],
    dont: ['Apply to every element', 'Combine with flat'],
  },
  {
    id: 'orbit', category: 'expressive',
    description: 'Concentric circular layouts with central focus.',
    when_to_use: ['Dashboards with central metric', 'Concept landings'],
    contraindications: ['Dense data tables'],
    contraindicated_with: [],
    required_tokens: ['radius.full'],
    cost: 'medium',
    a11y: 'Provide linear fallback for screen readers.',
    recipe_css: `position: relative;
& .center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
& .orbit { border-radius: var(--vyre-radius-full); border: 1px dashed var(--vyre-border-subtle); }`,
    do: ['Use sparingly', 'Maintain linear DOM order'],
    dont: ['Force circular nav for sequential tasks'],
  },
  {
    id: 'split-screen', category: 'specialized',
    description: 'Two-pane layout — visual on one side, content on other.',
    when_to_use: ['Hero sections', 'Feature pages', 'Auth pages'],
    contraindications: ['Mobile-only'],
    contraindicated_with: [],
    required_tokens: ['space.0'],
    cost: 'low',
    a11y: 'Good.',
    recipe_css: `display: grid;
grid-template-columns: 1fr 1fr;
min-height: 100vh;`,
    do: ['Use 50/50 or 60/40 split', 'Stack on mobile', 'Visual + content balance'],
    dont: ['Use for body content', 'Make panes scroll independently'],
  },
  {
    id: 'fullbleed', category: 'expressive',
    description: 'Edge-to-edge imagery with overlaid text — magazine cover style.',
    when_to_use: ['Hero sections', 'Storytelling sites'],
    contraindications: ['Forms', 'Dashboards'],
    contraindicated_with: [],
    required_tokens: ['shadow.lg'],
    cost: 'medium',
    a11y: 'Provide adequate text overlay contrast.',
    recipe_css: `background: var(--image) center/cover;
&::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 0%, oklch(0% 0 0 / 0.6) 100%); }
& .text { position: relative; color: var(--vyre-content-inverse); }`,
    do: ['Always darken/lighten image for text', 'Use sparingly per page'],
    dont: ['Use without overlay', 'Stack many fullbleeds'],
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = [];

  for (const s of STYLES) {
    const md = `---
id: ${s.id}
category: ${s.category}
description: "${s.description}"
when_to_use: ${JSON.stringify(s.when_to_use)}
contraindications: ${JSON.stringify(s.contraindications)}
contraindicated_with: ${JSON.stringify(s.contraindicated_with)}
required_tokens: ${JSON.stringify(s.required_tokens)}
cost: ${s.cost}
accessibility: "${s.a11y}"
---

# ${s.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}

${s.description}

## When to use

${s.when_to_use.map(x => `- ${x}`).join('\n')}

## When NOT to use

${s.contraindications.length ? s.contraindications.map(x => `- ${x}`).join('\n') : '_No major contraindications._'}

## Do

${s.do.map(x => `- ✅ ${x}`).join('\n')}

## Don't

${s.dont.map(x => `- ❌ ${x}`).join('\n')}

## Recipe (CSS)

\`\`\`css
${s.recipe_css}
\`\`\`

## Required tokens

${s.required_tokens.length ? s.required_tokens.map(x => `- \`${x}\``).join('\n') : '_Uses default Vyre tokens._'}

## Performance cost

\`${s.cost}\` — ${s.cost === 'high' ? 'use sparingly, profile on low-end devices' : s.cost === 'medium' ? 'reasonable for most contexts' : 'no significant cost'}

## Accessibility

${s.a11y}
`;
    await writeFile(join(OUT, `${s.id}.md`), md);
    manifest.push({
      id: s.id,
      category: s.category,
      description: s.description,
      when_to_use: s.when_to_use,
      contraindicated_with: s.contraindicated_with,
      cost: s.cost,
    });
  }

  await writeFile(
    join(OUT, '_index.json'),
    JSON.stringify({ version: 1, count: STYLES.length, styles: manifest }, null, 2)
  );

  console.log(`✓ Generated ${STYLES.length} UI styles → references/styles/`);
}

main().catch(e => { console.error(e); process.exit(1); });
