/**
 * ux-rule-checker — validates generated HTML/JSX against machine-readable UX rule frontmatter.
 *
 * Checks:
 *  - touch-target-size: interactive elements have min-size class or inline style ≥ 24px
 *  - focus-visible: focusable elements have focus-visible styles or ring token
 *  - labels-not-placeholders: <input> elements have <label>, not just placeholder
 *  - heading-hierarchy: no skipped heading levels (h1→h3 without h2)
 *  - no raw hex/px values in style attributes
 *  - prefers-reduced-motion: animation keyframes not wrapped in guard
 */

/** @typedef {{ path: string, message: string, severity: 'error'|'warn', rule: string }} RuleViolation */

/**
 * Check HTML/JSX string for common UX rule violations.
 * @param {string} content - HTML or JSX source
 * @param {string} filePath - source file for messages
 * @returns {RuleViolation[]}
 */
export function checkUxRules(content, filePath) {
  const violations = [];

  checkRawValues(content, filePath, violations);
  checkFocusVisible(content, filePath, violations);
  checkLabels(content, filePath, violations);
  checkHeadingHierarchy(content, filePath, violations);
  checkReducedMotion(content, filePath, violations);
  checkTouchTargets(content, filePath, violations);

  return violations;
}

// ── Individual rule checks ────────────────────────────────────────────────

function checkRawValues(content, filePath, violations) {
  // Raw hex colors in style props or CSS
  const hexMatches = content.matchAll(/(style\s*=\s*["'][^"']*)(#[0-9a-fA-F]{3,8})/g);
  for (const m of hexMatches) {
    violations.push({
      path: filePath, rule: 'no-raw-values', severity: 'error',
      message: `Raw hex color "${m[2]}" in style attribute. Use var(--vyre-*) token instead.`,
    });
  }

  // Raw px spacing in style props (not border-radius or font-size which can be tokens)
  const pxSpacing = content.matchAll(/style\s*=\s*["'][^"']*(padding|margin|gap|top|left|right|bottom)\s*:\s*(\d+px)/gi);
  for (const m of pxSpacing) {
    if (parseInt(m[2]) > 0) {
      violations.push({
        path: filePath, rule: 'no-raw-values', severity: 'warn',
        message: `Raw ${m[1]}: ${m[2]} in style attribute. Use var(--vyre-space-*) token instead.`,
      });
    }
  }
}

function checkFocusVisible(content, filePath, violations) {
  // Interactive elements without focus styles
  const buttons = [...content.matchAll(/<button(?![^>]*focus)[^>]*>/g)];
  const links   = [...content.matchAll(/<a\s(?![^>]*focus)[^>]*>/g)];

  // Only warn if they don't have className with ring/focus token
  const hasFocusToken = content.includes('ring-default') || content.includes('focus-visible') ||
    content.includes('vyre-ring') || content.includes(':focus-visible');

  if ((buttons.length > 0 || links.length > 0) && !hasFocusToken) {
    violations.push({
      path: filePath, rule: 'focus-visible', severity: 'warn',
      message: `Found interactive elements (button/a) but no focus-visible styles detected. Add :focus-visible { outline: 2px solid var(--vyre-ring-default); }`,
    });
  }
}

function checkLabels(content, filePath, violations) {
  // <input> without associated <label>
  const inputs = [...content.matchAll(/<input(?![^>]*aria-label)[^>]*>/gi)];
  if (inputs.length === 0) return;

  const hasLabel = content.includes('<label') || content.includes('aria-label') || content.includes('aria-labelledby');
  if (!hasLabel) {
    violations.push({
      path: filePath, rule: 'form-labels', severity: 'error',
      message: `Found <input> without <label> or aria-label. Labels must be explicit (not just placeholder).`,
    });
  }

  // Inputs that only have placeholder as label hint
  const onlyPlaceholder = [...content.matchAll(/<input[^>]*placeholder=[^>]*>/gi)]
    .filter(m => !m[0].includes('aria-label') && !m[0].includes('id='));
  if (onlyPlaceholder.length > 0 && !content.includes('<label')) {
    violations.push({
      path: filePath, rule: 'labels-not-placeholders', severity: 'warn',
      message: `Input uses placeholder as the only label. Placeholders disappear on focus — use a visible <label>.`,
    });
  }
}

function checkHeadingHierarchy(content, filePath, violations) {
  const levels = [];
  for (const m of content.matchAll(/<h([1-6])[\s>]/gi)) {
    levels.push(parseInt(m[1]));
  }
  if (levels.length < 2) return;

  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      violations.push({
        path: filePath, rule: 'heading-hierarchy', severity: 'error',
        message: `Heading level skipped: h${levels[i - 1]} → h${levels[i]}. Don't skip heading levels.`,
      });
    }
  }
}

function checkReducedMotion(content, filePath, violations) {
  const hasAnimation  = content.includes('@keyframes') || content.includes('animation:') || content.includes('animation ');
  const hasMotionGuard = content.includes('prefers-reduced-motion');
  if (hasAnimation && !hasMotionGuard) {
    violations.push({
      path: filePath, rule: 'respect-reduced-motion', severity: 'error',
      message: `Animation found without @media (prefers-reduced-motion: no-preference) guard.`,
    });
  }
}

function checkTouchTargets(content, filePath, violations) {
  // Buttons with explicit small sizes that would violate touch target
  const tinyButtons = [...content.matchAll(/<button[^>]*(w-[1-4]\b|h-[1-4]\b|size-[1-4]\b)[^>]*>/gi)];
  if (tinyButtons.length > 0) {
    violations.push({
      path: filePath, rule: 'touch-target-size', severity: 'warn',
      message: `Button appears to use a size class smaller than 24px (w/h-1 through w/h-4 = 4–16px). Minimum touch target: 24×24px.`,
    });
  }
}
