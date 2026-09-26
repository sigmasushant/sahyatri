import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { contrastRatio } from '../contrast';
import { createTokenStylesheet, fluid } from '../css-variables';
import { breakpoints, palette, tones, typeScale, type ToneName } from '../tokens';

const SRC = join(__dirname, '..', '..');

function walk(dir: string, match: (file: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : walk(path, match);
    return match(path) ? [path] : [];
  });
}

describe('colour contrast (WCAG 2.2)', () => {
  const AA_TEXT = 4.5;
  const NON_TEXT = 3;

  it.each(['light', 'dark'] as ToneName[])('%s tone text roles meet AA on every background', (name) => {
    const tone = tones[name];
    for (const background of [tone.bg, tone.bgElevated, tone.bgSubtle]) {
      for (const text of [tone.fg, tone.fgSecondary, tone.fgMuted, tone.accentText, tone.infoText, tone.danger]) {
        expect({ text, background, ratio: contrastRatio(text, background) }).toEqual(
          expect.objectContaining({ ratio: expect.toSatisfy((r: number) => r >= AA_TEXT) }),
        );
      }
    }
  });

  it.each(['light', 'dark'] as ToneName[])('%s tone button labels meet AA', (name) => {
    const tone = tones[name];
    expect(contrastRatio(tone.onPrimary, tone.primary)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(tone.onPrimary, tone.primaryHover)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(tone.onAccent, tone.accent)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(['light', 'dark'] as ToneName[])('%s tone focus ring is visible (≥ 3:1)', (name) => {
    const tone = tones[name];
    expect(contrastRatio(tone.focus, tone.bg)).toBeGreaterThanOrEqual(NON_TEXT);
    expect(contrastRatio(tone.focus, tone.bgElevated)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe('token stylesheet', () => {
  const css = createTokenStylesheet();

  it('defines every tone role for light and dark', () => {
    for (const role of Object.keys(tones.light)) {
      const name = `--color-${role.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
      expect(css.match(new RegExp(`${name}:`, 'g'))).toHaveLength(2);
    }
  });

  it('generates a utility class for every type style', () => {
    for (const style of Object.keys(typeScale)) {
      const name = style.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      expect(css).toContain(`.text-${name} {`);
    }
  });

  it('interpolates fluid sizes between the configured widths', () => {
    expect(fluid(16, 16)).toBe('1rem');
    expect(fluid(44, 108)).toMatch(/^clamp\(2\.75rem, .+vw, 6\.75rem\)$/);
  });
});

describe('design-system discipline', () => {
  const stylesheets = walk(SRC, (f) => f.endsWith('.css'));
  const components = walk(SRC, (f) => /\.(tsx?)$/.test(f) && !f.includes(join('design-system', 'tokens')));

  it('stylesheets use tokens, never raw colours', () => {
    const offenders = stylesheets.flatMap((file) => {
      const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      const hits = text.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? [];
      return hits.map((hit) => `${relative(SRC, file)}: ${hit}`);
    });
    expect(offenders).toEqual([]);
  });

  it('components never hard-code hex colours', () => {
    const offenders = components.flatMap((file) => {
      const hits = readFileSync(file, 'utf8').match(/['"`]#[0-9a-fA-F]{3,8}['"`]/g) ?? [];
      return hits.map((hit) => `${relative(SRC, file)}: ${hit}`);
    });
    expect(offenders).toEqual([]);
  });

  it('media queries only use token breakpoints', () => {
    const allowed = new Set(Object.values(breakpoints).map(String));
    const offenders = stylesheets.flatMap((file) => {
      const widths = [...readFileSync(file, 'utf8').matchAll(/@media[^{]*?(?:min|max)-width:\s*(\d+)px/g)].map((m) => m[1]!);
      return widths.filter((w) => !allowed.has(w)).map((w) => `${relative(SRC, file)}: ${w}px`);
    });
    expect(offenders).toEqual([]);
  });

  it('the static app icon uses the brand palette', () => {
    const icon = readFileSync(join(SRC, 'app', 'icon.svg'), 'utf8');
    expect(icon).toContain(palette.lime[400]);
    expect(icon).toContain(palette.midnight[900]);
  });
});
