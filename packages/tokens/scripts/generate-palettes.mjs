#!/usr/bin/env node
/**
 * Generates 150+ palettes algorithmically.
 * Each palette = 7 semantic roles (primary, secondary, accent, surface, content, success, danger) × 12 steps.
 * Output: src/palettes/<id>.tokens.json + _index.json manifest.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'palettes');

// ---------------------------------------------------------------------------
// 12-step OKLCH ramp generator. Lightness curve targets APCA Lc 60 text contrast
// at step 1 background, Lc 45 UI contrast at step 2.
// ---------------------------------------------------------------------------
function rampForHue(hue, opts = {}) {
  const {
    chromaPeak = 0.18,    // max chroma at step 8-9
    lightnessCurve = 'standard', // 'standard' | 'pastel' | 'vivid' | 'muted'
  } = opts;

  // L curve per step (1..12). Calibrated against Radix Colors.
  const baseL = {
    standard: [0.99, 0.97, 0.94, 0.91, 0.87, 0.81, 0.73, 0.65, 0.55, 0.49, 0.42, 0.25],
    pastel:   [0.99, 0.97, 0.95, 0.92, 0.89, 0.84, 0.78, 0.72, 0.66, 0.60, 0.50, 0.30],
    vivid:    [0.98, 0.96, 0.93, 0.89, 0.85, 0.78, 0.69, 0.60, 0.52, 0.46, 0.38, 0.22],
    muted:    [0.99, 0.97, 0.94, 0.91, 0.88, 0.83, 0.76, 0.68, 0.60, 0.54, 0.46, 0.28],
  }[lightnessCurve];

  // C curve per step (1..12). Peaks around step 8-9.
  const cMul = [0.03, 0.08, 0.20, 0.32, 0.48, 0.62, 0.80, 0.95, 1.0, 0.95, 0.80, 0.55];

  return baseL.map((l, i) => ({
    colorSpace: 'oklch',
    components: [
      Number(l.toFixed(3)),
      Number((cMul[i] * chromaPeak).toFixed(3)),
      hue,
    ],
  }));
}

function neutralRamp(hue, chromaPeak = 0.012, curve = 'standard') {
  return rampForHue(hue, { chromaPeak, lightnessCurve: curve });
}

// ---------------------------------------------------------------------------
// Palette spec → DTCG tokens
// ---------------------------------------------------------------------------
function buildPalette(spec) {
  const {
    id,
    primaryHue,
    secondaryHue = primaryHue + 30,
    accentHue = (primaryHue + 180) % 360,
    grayHue = primaryHue,
    successHue = 150,
    warningHue = 75,
    dangerHue = 25,
    chroma = 0.18,
    curve = 'standard',
    grayChroma = 0.012,
  } = spec;

  const tokens = {
    $schema: 'https://schemas.designtokens.org/2025-10/format.json',
    palette: {
      [id]: {
        $type: 'color',
        $description: spec.description || `Palette: ${id}`,
        primary:   ramp12('primary',   rampForHue(primaryHue,   { chromaPeak: chroma, lightnessCurve: curve })),
        secondary: ramp12('secondary', rampForHue(secondaryHue, { chromaPeak: chroma * 0.85, lightnessCurve: curve })),
        accent:    ramp12('accent',    rampForHue(accentHue,    { chromaPeak: chroma * 1.05, lightnessCurve: curve })),
        gray:      ramp12('gray',      neutralRamp(grayHue, grayChroma, curve)),
        success:   ramp12('success',   rampForHue(successHue,   { chromaPeak: 0.16, lightnessCurve: curve })),
        warning:   ramp12('warning',   rampForHue(warningHue,   { chromaPeak: 0.18, lightnessCurve: curve })),
        danger:    ramp12('danger',    rampForHue(dangerHue,    { chromaPeak: 0.22, lightnessCurve: curve })),
      },
    },
  };
  return tokens;
}

function ramp12(name, colors) {
  const out = {};
  colors.forEach((c, i) => {
    out[String(i + 1)] = { $value: c };
  });
  return out;
}

// ---------------------------------------------------------------------------
// Catalog: 150+ named palettes with intentional design taste.
// Grouped by personality so the AI can browse meaningfully.
// ---------------------------------------------------------------------------
const CATALOG = [
  // === EDITORIAL & MINIMAL (15) ===
  { id: 'nordic',          primaryHue: 220, chroma: 0.10, curve: 'muted',    tags: ['editorial', 'minimal', 'cool'], description: 'Cool Scandinavian neutrals.' },
  { id: 'paper-white',     primaryHue: 60,  chroma: 0.04, curve: 'muted',    tags: ['editorial', 'minimal', 'warm'], description: 'Warm off-white editorial palette.' },
  { id: 'newsprint',       primaryHue: 30,  chroma: 0.05, curve: 'muted',    tags: ['editorial', 'monochrome'], description: 'High-contrast newsprint feel.' },
  { id: 'gallery',         primaryHue: 0,   chroma: 0.02, curve: 'muted',    grayChroma: 0.005, tags: ['editorial', 'gallery', 'monochrome'], description: 'Pure museum gallery whites.' },
  { id: 'broadsheet',      primaryHue: 25,  chroma: 0.08, curve: 'muted',    tags: ['editorial', 'classic'], description: 'Classic broadsheet warmth.' },
  { id: 'magazine',        primaryHue: 15,  chroma: 0.14, curve: 'standard', tags: ['editorial', 'magazine'], description: 'High-end magazine aesthetic.' },
  { id: 'monograph',       primaryHue: 240, chroma: 0.05, curve: 'muted',    tags: ['editorial', 'minimal'], description: 'Architectural monograph style.' },
  { id: 'museum',          primaryHue: 30,  chroma: 0.04, curve: 'muted',    tags: ['editorial', 'gallery'], description: 'Museum wall placard palette.' },
  { id: 'reading',         primaryHue: 30,  chroma: 0.06, curve: 'muted',    tags: ['editorial', 'reading'], description: 'Optimized for long-form reading.' },
  { id: 'kindle',          primaryHue: 35,  chroma: 0.03, curve: 'muted',    tags: ['editorial', 'e-ink'], description: 'E-ink inspired palette.' },
  { id: 'manuscript',      primaryHue: 40,  chroma: 0.08, curve: 'muted',    tags: ['editorial', 'vintage'], description: 'Aged manuscript tones.' },
  { id: 'swiss-grid',      primaryHue: 0,   chroma: 0.0,  curve: 'standard', grayChroma: 0.003, tags: ['editorial', 'swiss', 'monochrome'], description: 'International typographic style.' },
  { id: 'helvetica',       primaryHue: 0,   chroma: 0.0,  curve: 'standard', grayChroma: 0.002, tags: ['editorial', 'minimal'], description: 'Pure black-and-white.' },
  { id: 'wabi-sabi',       primaryHue: 35,  chroma: 0.07, curve: 'muted',    tags: ['editorial', 'organic'], description: 'Imperfect organic neutrals.' },
  { id: 'shoji',           primaryHue: 50,  chroma: 0.04, curve: 'pastel',   tags: ['editorial', 'japanese'], description: 'Japanese paper screen tones.' },

  // === BRAND & CORPORATE (15) ===
  { id: 'tech-blue',       primaryHue: 240, chroma: 0.20, curve: 'standard', tags: ['brand', 'corporate', 'tech'], description: 'Classic tech company blue.' },
  { id: 'fintech',         primaryHue: 220, chroma: 0.16, curve: 'standard', tags: ['brand', 'fintech', 'trust'], description: 'Fintech trust-building blue.' },
  { id: 'healthcare',      primaryHue: 195, chroma: 0.14, curve: 'standard', tags: ['brand', 'healthcare', 'trust'], description: 'Calming healthcare teal.' },
  { id: 'enterprise',      primaryHue: 210, chroma: 0.12, curve: 'muted',    tags: ['brand', 'corporate'], description: 'Enterprise B2B sober blue.' },
  { id: 'startup-purple',  primaryHue: 270, chroma: 0.22, curve: 'standard', tags: ['brand', 'startup', 'tech'], description: 'Modern startup purple.' },
  { id: 'saas-indigo',     primaryHue: 264, chroma: 0.22, curve: 'standard', tags: ['brand', 'saas'], description: 'Default SaaS indigo.' },
  { id: 'consulting',      primaryHue: 215, chroma: 0.10, curve: 'muted',    tags: ['brand', 'corporate', 'professional'], description: 'Consulting firm gravitas.' },
  { id: 'lawyer',          primaryHue: 230, chroma: 0.08, curve: 'muted',    tags: ['brand', 'legal', 'professional'], description: 'Law firm authority.' },
  { id: 'accounting',      primaryHue: 200, chroma: 0.10, curve: 'muted',    tags: ['brand', 'finance', 'trust'], description: 'Accounting firm reliability.' },
  { id: 'university',      primaryHue: 0,   chroma: 0.18, curve: 'muted',    tags: ['brand', 'education'], description: 'University crimson.' },
  { id: 'oxford',          primaryHue: 220, chroma: 0.20, curve: 'muted',    tags: ['brand', 'education', 'classic'], description: 'Oxford blue tradition.' },
  { id: 'forest-green',    primaryHue: 145, chroma: 0.14, curve: 'muted',    tags: ['brand', 'nature', 'finance'], description: 'Forest evergreen.' },
  { id: 'navy',            primaryHue: 240, chroma: 0.18, curve: 'muted',    tags: ['brand', 'classic'], description: 'Classic navy.' },
  { id: 'maroon',          primaryHue: 15,  chroma: 0.18, curve: 'muted',    tags: ['brand', 'classic'], description: 'Deep maroon authority.' },
  { id: 'olive-corp',      primaryHue: 90,  chroma: 0.12, curve: 'muted',    tags: ['brand', 'earth'], description: 'Olive corporate earth tone.' },

  // === ATMOSPHERIC & EXPRESSIVE (20) ===
  { id: 'aurora',          primaryHue: 160, chroma: 0.20, curve: 'vivid',    accentHue: 295, tags: ['atmospheric', 'aurora', 'expressive'], description: 'Northern lights aurora.' },
  { id: 'sunset',          primaryHue: 25,  chroma: 0.22, curve: 'vivid',    accentHue: 295, tags: ['atmospheric', 'warm'], description: 'Golden hour sunset.' },
  { id: 'sunrise',         primaryHue: 35,  chroma: 0.20, curve: 'pastel',   accentHue: 350, tags: ['atmospheric', 'warm'], description: 'Soft sunrise pastels.' },
  { id: 'twilight',        primaryHue: 270, chroma: 0.20, curve: 'standard', accentHue: 25, tags: ['atmospheric', 'cool'], description: 'Dusky twilight purple.' },
  { id: 'midnight',        primaryHue: 240, chroma: 0.22, curve: 'vivid',    tags: ['atmospheric', 'dark'], description: 'Deep midnight blue.' },
  { id: 'ocean-depth',     primaryHue: 215, chroma: 0.20, curve: 'standard', tags: ['atmospheric', 'cool'], description: 'Deep ocean blue.' },
  { id: 'tropical',        primaryHue: 175, chroma: 0.22, curve: 'vivid',    accentHue: 350, tags: ['atmospheric', 'warm'], description: 'Tropical paradise.' },
  { id: 'desert',          primaryHue: 35,  chroma: 0.18, curve: 'standard', tags: ['atmospheric', 'warm', 'earth'], description: 'Sandy desert warmth.' },
  { id: 'forest-mist',     primaryHue: 155, chroma: 0.10, curve: 'muted',    tags: ['atmospheric', 'nature'], description: 'Misty forest.' },
  { id: 'mountain',        primaryHue: 220, chroma: 0.08, curve: 'muted',    tags: ['atmospheric', 'nature'], description: 'Mountain peak grays.' },
  { id: 'lavender-field',  primaryHue: 280, chroma: 0.16, curve: 'pastel',   tags: ['atmospheric', 'pastel'], description: 'French lavender field.' },
  { id: 'cherry-blossom',  primaryHue: 350, chroma: 0.16, curve: 'pastel',   tags: ['atmospheric', 'pastel', 'japanese'], description: 'Sakura cherry blossom.' },
  { id: 'autumn',          primaryHue: 30,  chroma: 0.20, curve: 'standard', accentHue: 15, tags: ['atmospheric', 'warm', 'seasonal'], description: 'Autumn leaves.' },
  { id: 'winter-frost',    primaryHue: 200, chroma: 0.10, curve: 'pastel',   tags: ['atmospheric', 'cool', 'seasonal'], description: 'Winter frost palette.' },
  { id: 'spring-meadow',   primaryHue: 130, chroma: 0.16, curve: 'pastel',   tags: ['atmospheric', 'seasonal'], description: 'Spring meadow fresh.' },
  { id: 'summer-beach',    primaryHue: 200, chroma: 0.18, curve: 'pastel',   accentHue: 50, tags: ['atmospheric', 'seasonal'], description: 'Beach sun and sea.' },
  { id: 'storm',           primaryHue: 220, chroma: 0.10, curve: 'muted',    tags: ['atmospheric', 'dramatic'], description: 'Stormy gray skies.' },
  { id: 'mist',            primaryHue: 200, chroma: 0.06, curve: 'muted',    tags: ['atmospheric', 'soft'], description: 'Foggy morning mist.' },
  { id: 'galaxy',          primaryHue: 270, chroma: 0.24, curve: 'vivid',    tags: ['atmospheric', 'cosmic'], description: 'Deep space galaxy.' },
  { id: 'nebula',          primaryHue: 295, chroma: 0.22, curve: 'vivid',    accentHue: 195, tags: ['atmospheric', 'cosmic'], description: 'Cosmic nebula.' },

  // === RETRO & VINTAGE (12) ===
  { id: 'synthwave',       primaryHue: 320, chroma: 0.26, curve: 'vivid',    accentHue: 200, tags: ['retro', 'neon', 'vibrant'], description: '80s synthwave neon.' },
  { id: 'vaporwave',       primaryHue: 320, chroma: 0.20, curve: 'pastel',   accentHue: 195, tags: ['retro', 'pastel'], description: 'Vaporwave pastels.' },
  { id: 'y2k',             primaryHue: 195, chroma: 0.22, curve: 'vivid',    accentHue: 320, tags: ['retro', 'vibrant'], description: 'Y2K shiny silver-and-cyan.' },
  { id: 'eight-bit',       primaryHue: 240, chroma: 0.26, curve: 'vivid',    tags: ['retro', '8-bit', 'gaming'], description: '8-bit pixel art palette.' },
  { id: 'amber-crt',       primaryHue: 50,  chroma: 0.20, curve: 'vivid',    tags: ['retro', 'terminal'], description: 'Amber CRT terminal.' },
  { id: 'green-crt',       primaryHue: 130, chroma: 0.22, curve: 'vivid',    tags: ['retro', 'terminal'], description: 'Green CRT terminal.' },
  { id: 'memphis',         primaryHue: 350, chroma: 0.22, curve: 'vivid',    accentHue: 50, tags: ['retro', '80s', 'playful'], description: 'Memphis design 80s pop.' },
  { id: 'art-deco',        primaryHue: 45,  chroma: 0.18, curve: 'standard', accentHue: 240, tags: ['retro', 'luxury', 'art-deco'], description: 'Art Deco gold and navy.' },
  { id: 'mid-century',     primaryHue: 25,  chroma: 0.16, curve: 'muted',    accentHue: 175, tags: ['retro', 'mid-century'], description: 'Mid-century modern.' },
  { id: 'polaroid',        primaryHue: 30,  chroma: 0.10, curve: 'muted',    tags: ['retro', 'film', 'photo'], description: 'Faded polaroid photo.' },
  { id: 'kodachrome',      primaryHue: 25,  chroma: 0.20, curve: 'standard', tags: ['retro', 'film', 'photo'], description: 'Vintage Kodachrome.' },
  { id: 'sepia',           primaryHue: 35,  chroma: 0.10, curve: 'muted',    grayChroma: 0.04, tags: ['retro', 'monochrome', 'vintage'], description: 'Sepia photograph.' },

  // === DARK & PREMIUM (15) ===
  { id: 'obsidian',        primaryHue: 240, chroma: 0.10, curve: 'standard', grayChroma: 0.008, tags: ['dark', 'premium', 'minimal'], description: 'Pure black obsidian.' },
  { id: 'graphite',        primaryHue: 220, chroma: 0.06, curve: 'muted',    grayChroma: 0.008, tags: ['dark', 'premium'], description: 'Graphite professional.' },
  { id: 'onyx',            primaryHue: 0,   chroma: 0.04, curve: 'muted',    grayChroma: 0.005, tags: ['dark', 'luxury'], description: 'Pure onyx luxury.' },
  { id: 'midnight-blue',   primaryHue: 230, chroma: 0.14, curve: 'standard', tags: ['dark', 'premium'], description: 'Midnight navy.' },
  { id: 'wine-cellar',     primaryHue: 350, chroma: 0.16, curve: 'muted',    tags: ['dark', 'luxury', 'warm'], description: 'Deep wine red.' },
  { id: 'gold-luxe',       primaryHue: 50,  chroma: 0.18, curve: 'standard', grayChroma: 0.02, tags: ['premium', 'luxury'], description: 'Black + gold luxury.' },
  { id: 'platinum',        primaryHue: 220, chroma: 0.04, curve: 'muted',    grayChroma: 0.006, tags: ['premium', 'minimal'], description: 'Platinum cool premium.' },
  { id: 'velvet',          primaryHue: 295, chroma: 0.18, curve: 'muted',    tags: ['dark', 'luxury'], description: 'Plush velvet purple.' },
  { id: 'emerald-luxe',    primaryHue: 155, chroma: 0.18, curve: 'standard', tags: ['dark', 'luxury'], description: 'Emerald gem luxury.' },
  { id: 'sapphire',        primaryHue: 240, chroma: 0.20, curve: 'standard', tags: ['dark', 'luxury'], description: 'Sapphire gem.' },
  { id: 'ruby',            primaryHue: 5,   chroma: 0.22, curve: 'standard', tags: ['dark', 'luxury'], description: 'Ruby gem.' },
  { id: 'noir',            primaryHue: 0,   chroma: 0.0,  curve: 'muted',    grayChroma: 0.003, tags: ['dark', 'cinematic'], description: 'Film noir black & white.' },
  { id: 'cinema',          primaryHue: 30,  chroma: 0.10, curve: 'muted',    grayChroma: 0.01, tags: ['dark', 'cinematic'], description: 'Cinematic warm dark.' },
  { id: 'concrete',        primaryHue: 220, chroma: 0.04, curve: 'muted',    grayChroma: 0.01, tags: ['dark', 'industrial'], description: 'Raw concrete.' },
  { id: 'steel',           primaryHue: 220, chroma: 0.06, curve: 'muted',    grayChroma: 0.012, tags: ['dark', 'industrial'], description: 'Brushed steel.' },

  // === PLAYFUL & VIBRANT (15) ===
  { id: 'candy',           primaryHue: 350, chroma: 0.22, curve: 'pastel',   accentHue: 195, tags: ['playful', 'pastel'], description: 'Cotton candy sweetness.' },
  { id: 'bubblegum',       primaryHue: 340, chroma: 0.24, curve: 'pastel',   tags: ['playful', 'pop'], description: 'Bubblegum pink pop.' },
  { id: 'rainbow-pop',     primaryHue: 0,   chroma: 0.26, curve: 'vivid',    secondaryHue: 60, accentHue: 240, tags: ['playful', 'vibrant'], description: 'Full rainbow pop.' },
  { id: 'tropical-fruit',  primaryHue: 50,  chroma: 0.24, curve: 'vivid',    accentHue: 175, tags: ['playful', 'vibrant'], description: 'Tropical fruit punch.' },
  { id: 'gummy-bear',      primaryHue: 25,  chroma: 0.22, curve: 'pastel',   accentHue: 295, tags: ['playful', 'pastel'], description: 'Gummy bear translucent.' },
  { id: 'kawaii',          primaryHue: 340, chroma: 0.18, curve: 'pastel',   accentHue: 195, tags: ['playful', 'kawaii'], description: 'Kawaii cute palette.' },
  { id: 'macaron',         primaryHue: 110, chroma: 0.12, curve: 'pastel',   tags: ['playful', 'pastel'], description: 'Pastel macaron.' },
  { id: 'sherbet',         primaryHue: 30,  chroma: 0.18, curve: 'pastel',   accentHue: 295, tags: ['playful', 'pastel'], description: 'Orange sherbet.' },
  { id: 'lollipop',        primaryHue: 350, chroma: 0.26, curve: 'vivid',    tags: ['playful', 'vibrant'], description: 'Lollipop bright.' },
  { id: 'crayon',          primaryHue: 25,  chroma: 0.22, curve: 'standard', secondaryHue: 240, tags: ['playful', 'vibrant'], description: 'Crayon box bright.' },
  { id: 'highlighter',     primaryHue: 130, chroma: 0.28, curve: 'vivid',    tags: ['playful', 'neon'], description: 'Highlighter neon.' },
  { id: 'bubble-pop',      primaryHue: 195, chroma: 0.22, curve: 'pastel',   accentHue: 350, tags: ['playful', 'pop'], description: 'Pop bubble bright.' },
  { id: 'unicorn',         primaryHue: 295, chroma: 0.20, curve: 'pastel',   accentHue: 195, tags: ['playful', 'pastel', 'fantasy'], description: 'Unicorn pastel rainbow.' },
  { id: 'mermaid',         primaryHue: 175, chroma: 0.22, curve: 'vivid',    accentHue: 295, tags: ['playful', 'fantasy'], description: 'Mermaid sea-and-sky.' },
  { id: 'fairy',           primaryHue: 320, chroma: 0.16, curve: 'pastel',   tags: ['playful', 'fantasy'], description: 'Fairy tale pastel.' },

  // === EARTH & ORGANIC (15) ===
  { id: 'terracotta',      primaryHue: 25,  chroma: 0.16, curve: 'muted',    tags: ['earth', 'warm'], description: 'Terracotta clay.' },
  { id: 'sandstone',       primaryHue: 50,  chroma: 0.10, curve: 'muted',    tags: ['earth', 'warm'], description: 'Sandstone neutral.' },
  { id: 'moss',            primaryHue: 130, chroma: 0.10, curve: 'muted',    tags: ['earth', 'organic'], description: 'Forest moss green.' },
  { id: 'sage',            primaryHue: 110, chroma: 0.08, curve: 'muted',    tags: ['earth', 'calming'], description: 'Sage herb green.' },
  { id: 'oat',             primaryHue: 60,  chroma: 0.06, curve: 'muted',    tags: ['earth', 'neutral'], description: 'Oat milk warmth.' },
  { id: 'linen',           primaryHue: 50,  chroma: 0.04, curve: 'muted',    tags: ['earth', 'neutral'], description: 'Natural linen.' },
  { id: 'clay',            primaryHue: 20,  chroma: 0.12, curve: 'muted',    tags: ['earth', 'warm'], description: 'Wet clay.' },
  { id: 'bark',            primaryHue: 30,  chroma: 0.10, curve: 'muted',    tags: ['earth', 'wood'], description: 'Tree bark brown.' },
  { id: 'stone',           primaryHue: 60,  chroma: 0.04, curve: 'muted',    tags: ['earth', 'neutral'], description: 'River stone gray.' },
  { id: 'driftwood',       primaryHue: 35,  chroma: 0.08, curve: 'muted',    tags: ['earth', 'organic'], description: 'Sun-bleached driftwood.' },
  { id: 'kraft',           primaryHue: 35,  chroma: 0.10, curve: 'muted',    tags: ['earth', 'paper'], description: 'Kraft paper brown.' },
  { id: 'rust',            primaryHue: 20,  chroma: 0.18, curve: 'muted',    tags: ['earth', 'industrial'], description: 'Iron rust orange.' },
  { id: 'copper',          primaryHue: 30,  chroma: 0.16, curve: 'standard', tags: ['earth', 'metal'], description: 'Aged copper patina.' },
  { id: 'bronze',          primaryHue: 35,  chroma: 0.14, curve: 'muted',    tags: ['earth', 'metal'], description: 'Bronze sculpture.' },
  { id: 'eucalyptus',      primaryHue: 165, chroma: 0.10, curve: 'muted',    tags: ['earth', 'spa'], description: 'Eucalyptus spa.' },

  // === BRUTALIST & BOLD (10) ===
  { id: 'brutalist',       primaryHue: 0,   chroma: 0.0,  curve: 'vivid',    accentHue: 25, tags: ['brutalist', 'bold'], description: 'Brutalist black-and-red.' },
  { id: 'neo-brutalist',   primaryHue: 50,  chroma: 0.28, curve: 'vivid',    accentHue: 240, tags: ['brutalist', 'bold'], description: 'Neo-brutalist bright yellow.' },
  { id: 'punk',            primaryHue: 350, chroma: 0.28, curve: 'vivid',    tags: ['brutalist', 'bold'], description: 'Punk pink shock.' },
  { id: 'concrete-bold',   primaryHue: 220, chroma: 0.0,  curve: 'standard', accentHue: 25, tags: ['brutalist'], description: 'Brutalist concrete with red.' },
  { id: 'warning-tape',    primaryHue: 50,  chroma: 0.26, curve: 'vivid',    accentHue: 0, tags: ['brutalist', 'safety'], description: 'Construction warning tape.' },
  { id: 'caution',         primaryHue: 50,  chroma: 0.28, curve: 'vivid',    tags: ['brutalist', 'safety'], description: 'Industrial caution yellow.' },
  { id: 'monochrome-pop',  primaryHue: 0,   chroma: 0.30, curve: 'vivid',    grayChroma: 0.002, tags: ['brutalist', 'bold'], description: 'Pure B&W with one accent.' },
  { id: 'neon-rebel',      primaryHue: 130, chroma: 0.30, curve: 'vivid',    tags: ['brutalist', 'neon'], description: 'Aggressive neon green.' },
  { id: 'rave',            primaryHue: 320, chroma: 0.30, curve: 'vivid',    accentHue: 130, tags: ['brutalist', 'neon'], description: 'Rave UV pink-and-green.' },
  { id: 'anti-design',     primaryHue: 130, chroma: 0.26, curve: 'vivid',    accentHue: 320, tags: ['brutalist', 'experimental'], description: 'Anti-design clash.' },

  // === ACCESSIBILITY-FIRST (10) ===
  { id: 'a11y-high-contrast',     primaryHue: 240, chroma: 0.22, curve: 'vivid',    grayChroma: 0.008, tags: ['accessibility', 'high-contrast'], description: 'WCAG AAA high contrast.' },
  { id: 'a11y-low-vision',        primaryHue: 60,  chroma: 0.30, curve: 'vivid',    tags: ['accessibility', 'high-contrast'], description: 'Optimized for low vision.' },
  { id: 'a11y-deuteranopia',      primaryHue: 240, chroma: 0.22, curve: 'standard', successHue: 220, dangerHue: 50, tags: ['accessibility', 'colorblind'], description: 'Red-green colorblind safe.' },
  { id: 'a11y-protanopia',        primaryHue: 240, chroma: 0.22, curve: 'standard', successHue: 220, dangerHue: 50, tags: ['accessibility', 'colorblind'], description: 'Protanopia safe.' },
  { id: 'a11y-tritanopia',        primaryHue: 0,   chroma: 0.22, curve: 'standard', successHue: 130, dangerHue: 0, tags: ['accessibility', 'colorblind'], description: 'Blue-yellow colorblind safe.' },
  { id: 'a11y-monochrome',        primaryHue: 220, chroma: 0.0,  curve: 'standard', grayChroma: 0.0, successHue: 220, dangerHue: 220, warningHue: 220, tags: ['accessibility', 'monochrome'], description: 'Total color blindness safe.' },
  { id: 'a11y-large-print',       primaryHue: 220, chroma: 0.20, curve: 'standard', tags: ['accessibility', 'large-print'], description: 'Large-print friendly.' },
  { id: 'a11y-low-light',         primaryHue: 25,  chroma: 0.16, curve: 'muted',    tags: ['accessibility', 'low-light'], description: 'Low-light reading mode.' },
  { id: 'a11y-dyslexia',          primaryHue: 50,  chroma: 0.10, curve: 'muted',    tags: ['accessibility', 'dyslexia'], description: 'Dyslexia-friendly cream.' },
  { id: 'a11y-print-safe',        primaryHue: 220, chroma: 0.18, curve: 'standard', tags: ['accessibility', 'print'], description: 'Safe for B&W printing.' },

  // === SAAS & DASHBOARD (15) ===
  { id: 'dashboard-dense',        primaryHue: 240, chroma: 0.18, curve: 'standard', tags: ['dashboard', 'data'], description: 'Dense data dashboard.' },
  { id: 'dashboard-airy',         primaryHue: 240, chroma: 0.16, curve: 'pastel',   tags: ['dashboard', 'modern'], description: 'Airy modern dashboard.' },
  { id: 'analytics',              primaryHue: 175, chroma: 0.18, curve: 'standard', tags: ['dashboard', 'data'], description: 'Analytics teal.' },
  { id: 'crm',                    primaryHue: 215, chroma: 0.18, curve: 'standard', tags: ['dashboard', 'crm'], description: 'CRM blue.' },
  { id: 'admin',                  primaryHue: 240, chroma: 0.10, curve: 'muted',    tags: ['dashboard', 'admin'], description: 'Admin panel sober.' },
  { id: 'kanban',                 primaryHue: 215, chroma: 0.16, curve: 'standard', accentHue: 130, tags: ['dashboard', 'project'], description: 'Kanban project board.' },
  { id: 'gantt',                  primaryHue: 240, chroma: 0.14, curve: 'standard', accentHue: 25, tags: ['dashboard', 'project'], description: 'Gantt timeline.' },
  { id: 'reporting',              primaryHue: 220, chroma: 0.14, curve: 'muted',    tags: ['dashboard', 'data'], description: 'Reporting professional.' },
  { id: 'kpi',                    primaryHue: 195, chroma: 0.18, curve: 'standard', successHue: 145, tags: ['dashboard', 'data'], description: 'KPI tracker.' },
  { id: 'finance-dash',           primaryHue: 215, chroma: 0.14, curve: 'muted',    successHue: 145, dangerHue: 5, tags: ['dashboard', 'finance'], description: 'Finance dashboard.' },
  { id: 'logistics',              primaryHue: 30,  chroma: 0.18, curve: 'standard', tags: ['dashboard', 'logistics'], description: 'Logistics warm operational.' },
  { id: 'devops',                 primaryHue: 130, chroma: 0.18, curve: 'standard', grayChroma: 0.01, tags: ['dashboard', 'tech'], description: 'DevOps terminal-ish.' },
  { id: 'monitoring',             primaryHue: 145, chroma: 0.18, curve: 'standard', warningHue: 50, dangerHue: 5, tags: ['dashboard', 'ops'], description: 'Monitoring with strong status colors.' },
  { id: 'data-warehouse',         primaryHue: 220, chroma: 0.16, curve: 'standard', tags: ['dashboard', 'data'], description: 'Data warehouse.' },
  { id: 'observability',          primaryHue: 270, chroma: 0.18, curve: 'standard', tags: ['dashboard', 'tech'], description: 'Observability platform.' },

  // === ECOMMERCE & MARKETING (10) ===
  { id: 'ecom-fashion',           primaryHue: 0,   chroma: 0.0,  curve: 'standard', accentHue: 350, tags: ['ecommerce', 'fashion'], description: 'Fashion B&W with pink.' },
  { id: 'ecom-luxury',            primaryHue: 30,  chroma: 0.10, curve: 'muted',    grayChroma: 0.005, tags: ['ecommerce', 'luxury'], description: 'Luxury ecom cream.' },
  { id: 'ecom-fresh',             primaryHue: 145, chroma: 0.16, curve: 'pastel',   tags: ['ecommerce', 'food'], description: 'Fresh grocery green.' },
  { id: 'ecom-toys',              primaryHue: 25,  chroma: 0.22, curve: 'vivid',    secondaryHue: 195, accentHue: 130, tags: ['ecommerce', 'kids'], description: 'Toys & kids fun.' },
  { id: 'ecom-tech',              primaryHue: 240, chroma: 0.18, curve: 'standard', tags: ['ecommerce', 'tech'], description: 'Tech ecom blue.' },
  { id: 'ecom-beauty',            primaryHue: 350, chroma: 0.14, curve: 'pastel',   tags: ['ecommerce', 'beauty'], description: 'Beauty rose pastel.' },
  { id: 'ecom-outdoor',           primaryHue: 130, chroma: 0.16, curve: 'muted',    tags: ['ecommerce', 'outdoor'], description: 'Outdoor adventure green.' },
  { id: 'marketing-bold',         primaryHue: 5,   chroma: 0.24, curve: 'vivid',    tags: ['marketing', 'cta'], description: 'Bold conversion red.' },
  { id: 'marketing-trust',        primaryHue: 215, chroma: 0.18, curve: 'standard', tags: ['marketing', 'trust'], description: 'Trust-building blue.' },
  { id: 'marketing-friendly',     primaryHue: 30,  chroma: 0.20, curve: 'pastel',   tags: ['marketing', 'friendly'], description: 'Friendly approachable.' },

  // === MOOD-DRIVEN (10) ===
  { id: 'calm',                   primaryHue: 200, chroma: 0.10, curve: 'muted',    tags: ['mood', 'calming'], description: 'Calming meditation blue.' },
  { id: 'focus',                  primaryHue: 215, chroma: 0.12, curve: 'muted',    grayChroma: 0.01, tags: ['mood', 'focus'], description: 'Deep focus environment.' },
  { id: 'energetic',              primaryHue: 25,  chroma: 0.24, curve: 'vivid',    tags: ['mood', 'energy'], description: 'High-energy orange.' },
  { id: 'cozy',                   primaryHue: 25,  chroma: 0.14, curve: 'muted',    tags: ['mood', 'warm'], description: 'Cozy fireplace warm.' },
  { id: 'fresh',                  primaryHue: 165, chroma: 0.18, curve: 'standard', tags: ['mood', 'fresh'], description: 'Fresh mint clean.' },
  { id: 'serene',                 primaryHue: 195, chroma: 0.10, curve: 'pastel',   tags: ['mood', 'calming'], description: 'Serene sky blue.' },
  { id: 'romantic',               primaryHue: 350, chroma: 0.16, curve: 'pastel',   tags: ['mood', 'romantic'], description: 'Romantic dusty rose.' },
  { id: 'mysterious',             primaryHue: 270, chroma: 0.16, curve: 'muted',    tags: ['mood', 'dark'], description: 'Mysterious deep purple.' },
  { id: 'optimistic',             primaryHue: 50,  chroma: 0.22, curve: 'pastel',   tags: ['mood', 'happy'], description: 'Optimistic sunshine.' },
  { id: 'meditative',             primaryHue: 110, chroma: 0.06, curve: 'muted',    tags: ['mood', 'calming'], description: 'Meditative sage.' },

  // === THEME-DRIVEN (15) ===
  { id: 'cyberpunk',              primaryHue: 320, chroma: 0.28, curve: 'vivid',    accentHue: 175, tags: ['theme', 'cyberpunk'], description: 'Cyberpunk pink-cyan.' },
  { id: 'steampunk',              primaryHue: 30,  chroma: 0.14, curve: 'muted',    grayChroma: 0.02, tags: ['theme', 'steampunk'], description: 'Steampunk brass-and-leather.' },
  { id: 'cottagecore',            primaryHue: 130, chroma: 0.10, curve: 'pastel',   accentHue: 25, tags: ['theme', 'cottagecore'], description: 'Cottagecore meadow.' },
  { id: 'darkacademia',           primaryHue: 30,  chroma: 0.10, curve: 'muted',    grayChroma: 0.012, tags: ['theme', 'academic'], description: 'Dark academia leather.' },
  { id: 'minimalcore',            primaryHue: 0,   chroma: 0.0,  curve: 'muted',    grayChroma: 0.003, tags: ['theme', 'minimal'], description: 'Minimalcore stark.' },
  { id: 'maximalist',             primaryHue: 25,  chroma: 0.26, curve: 'vivid',    secondaryHue: 295, accentHue: 175, tags: ['theme', 'maximalist'], description: 'Maximalist clash.' },
  { id: 'biophilic',              primaryHue: 130, chroma: 0.14, curve: 'muted',    tags: ['theme', 'nature'], description: 'Biophilic plant palette.' },
  { id: 'futurist',               primaryHue: 195, chroma: 0.22, curve: 'vivid',    grayChroma: 0.008, tags: ['theme', 'futurist'], description: 'Sci-fi futurist.' },
  { id: 'utopia',                 primaryHue: 195, chroma: 0.18, curve: 'pastel',   tags: ['theme', 'futurist'], description: 'Utopian clean future.' },
  { id: 'dystopia',               primaryHue: 25,  chroma: 0.14, curve: 'muted',    grayChroma: 0.014, tags: ['theme', 'dark'], description: 'Dystopian rust + concrete.' },
  { id: 'meditative-zen',         primaryHue: 60,  chroma: 0.04, curve: 'muted',    tags: ['theme', 'zen'], description: 'Zen garden palette.' },
  { id: 'scandi',                 primaryHue: 220, chroma: 0.06, curve: 'muted',    tags: ['theme', 'scandi'], description: 'Hygge Scandinavian.' },
  { id: 'mediterranean',          primaryHue: 200, chroma: 0.18, curve: 'standard', accentHue: 30, tags: ['theme', 'mediterranean'], description: 'Mediterranean sea + terracotta.' },
  { id: 'arabian',                primaryHue: 25,  chroma: 0.18, curve: 'standard', accentHue: 270, tags: ['theme', 'arabian'], description: 'Arabian gold + violet.' },
  { id: 'african-savanna',        primaryHue: 25,  chroma: 0.18, curve: 'muted',    accentHue: 50, tags: ['theme', 'african'], description: 'Savanna earth tones.' },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = [];

  for (const spec of CATALOG) {
    const tokens = buildPalette(spec);
    const file = join(OUT, `${spec.id}.tokens.json`);
    await writeFile(file, JSON.stringify(tokens, null, 2));
    manifest.push({
      id: spec.id,
      tags: spec.tags,
      description: spec.description,
      primaryHue: spec.primaryHue,
      curve: spec.curve || 'standard',
    });
  }

  await writeFile(
    join(OUT, '_index.json'),
    JSON.stringify({ version: 1, count: CATALOG.length, palettes: manifest }, null, 2)
  );

  // Mirror index into skill references so the AI can browse
  const skillIndex = join(__dirname, '..', '..', 'skill', 'references', 'palettes', '_index.json');
  await mkdir(dirname(skillIndex), { recursive: true });
  await writeFile(skillIndex, JSON.stringify({ version: 1, count: CATALOG.length, palettes: manifest }, null, 2));

  console.log(`✓ Generated ${CATALOG.length} palettes → src/palettes/`);
  console.log(`✓ Manifest written → src/palettes/_index.json`);
  console.log(`✓ Mirrored to skill: packages/skill/references/palettes/_index.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
