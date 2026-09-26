/**
 * Web adapter for the design tokens.
 *
 * Turns the platform-agnostic token objects into CSS custom properties and the typography
 * utility classes. The root layout inlines the result in <head>, so stylesheets only ever
 * reference `var(--…)` and the TypeScript tokens stay the single source of truth.
 */
import {
  breakpoints,
  cubicBezier,
  duration,
  easing,
  fluidRange,
  fontFamily,
  fontWeight,
  layout,
  motion,
  palette,
  radius,
  sceneColors,
  shadows,
  space,
  tones,
  typeScale,
  zIndex,
  type ToneColors,
  type TypeStyle,
} from './tokens';

const ROOT_FONT_SIZE = 16;

const rem = (px: number) => `${+(px / ROOT_FONT_SIZE).toFixed(4)}rem`;

const kebab = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Fluid value that is `min` px at `fluidRange.minWidth` and `max` px at `fluidRange.maxWidth`. */
export function fluid(min: number, max: number): string {
  if (min === max) return rem(min);
  const slope = (max - min) / (fluidRange.maxWidth - fluidRange.minWidth);
  const intercept = min - slope * fluidRange.minWidth;
  return `clamp(${rem(min)}, ${rem(intercept)} + ${+(slope * 100).toFixed(4)}vw, ${rem(max)})`;
}

function declarations(vars: Record<string, string | number>): string {
  return Object.entries(vars)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');
}

function toneVariables(tone: ToneColors): Record<string, string> {
  return Object.fromEntries(Object.entries(tone).map(([role, value]) => [`color-${kebab(role)}`, value]));
}

function paletteVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [name, value] of Object.entries(palette)) {
    if (typeof value === 'string') {
      vars[`palette-${kebab(name)}`] = value;
    } else {
      for (const [step, hex] of Object.entries(value)) vars[`palette-${kebab(name)}-${step}`] = hex;
    }
  }
  for (const [name, value] of Object.entries(sceneColors)) vars[`scene-${kebab(name)}`] = value;
  return vars;
}

function typeVariables(): Record<string, string | number> {
  const vars: Record<string, string | number> = {};
  for (const [name, style] of Object.entries(typeScale) as [string, TypeStyle][]) {
    const key = kebab(name);
    vars[`text-${key}-size`] = fluid(style.min, style.max);
    vars[`text-${key}-leading`] = style.lineHeight;
    vars[`text-${key}-tracking`] = `${style.letterSpacing}em`;
    vars[`text-${key}-weight`] = style.weight;
  }
  return vars;
}

function staticVariables(): Record<string, string | number> {
  const vars: Record<string, string | number> = {
    'font-sans': `var(--font-manrope, ${fontFamily.sans}), ${fontFamily.fallback}`,
  };
  for (const [name, value] of Object.entries(fontWeight)) vars[`weight-${name}`] = value;
  for (const [step, value] of Object.entries(space)) vars[`space-${step}`] = rem(value);
  for (const [name, value] of Object.entries(radius)) vars[`radius-${name}`] = value === 999 ? '999px' : rem(value);
  for (const [name, value] of Object.entries(shadows)) vars[`shadow-${name}`] = value;
  for (const [name, value] of Object.entries(easing)) vars[`ease-${kebab(name)}`] = cubicBezier(value);
  for (const [name, value] of Object.entries(duration)) vars[`duration-${name}`] = `${value}ms`;
  for (const [name, value] of Object.entries(zIndex)) vars[`z-${kebab(name)}`] = value;
  for (const [name, value] of Object.entries(breakpoints)) vars[`breakpoint-${name}`] = `${value}px`;

  vars['motion-stagger'] = `${motion.stagger}ms`;
  vars['motion-lift'] = `${-motion.hoverLift}px`;
  vars['motion-distance'] = `${motion.distance.md}px`;

  vars['layout-container'] = rem(layout.containerMax);
  vars['layout-container-narrow'] = rem(layout.containerNarrow);
  vars['layout-header-height'] = rem(layout.headerHeight);
  vars['layout-gutter'] = fluid(layout.gutter.min, layout.gutter.max);
  vars['layout-section-y'] = fluid(layout.sectionY.min, layout.sectionY.max);
  vars['layout-stack-gap'] = fluid(layout.stackGap.min, layout.stackGap.max);
  return vars;
}

function typeClasses(): string {
  return Object.entries(typeScale as Record<string, TypeStyle>)
    .map(([name, style]) => {
      const key = kebab(name);
      const transform = style.uppercase ? '\n  text-transform: uppercase;' : '';
      return `.text-${key} {
  font-size: var(--text-${key}-size);
  line-height: var(--text-${key}-leading);
  letter-spacing: var(--text-${key}-tracking);
  font-weight: var(--text-${key}-weight);${transform}
}`;
    })
    .join('\n');
}

/** The complete token stylesheet. Deterministic, so it can be snapshot-tested. */
export function createTokenStylesheet(): string {
  return [
    `:root {\n${declarations({ ...staticVariables(), ...paletteVariables(), ...typeVariables() })}\n}`,
    `:root,\n[data-tone='light'] {\n  color-scheme: light;\n${declarations(toneVariables(tones.light))}\n}`,
    `[data-tone='dark'] {\n  color-scheme: dark;\n${declarations(toneVariables(tones.dark))}\n}`,
    typeClasses(),
  ].join('\n\n');
}
