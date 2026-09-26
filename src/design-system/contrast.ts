/** WCAG 2.x contrast helpers, used by the token tests and available to tooling. */

function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex?.[1]) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = color.trim().match(/^rgba?\(([^)]+)\)$/i);
  if (rgba?.[1]) {
    const [r = 0, g = 0, b = 0, a = 1] = rgba[1].split(',').map((part) => parseFloat(part));
    return { r, g, b, a };
  }
  throw new Error(`Unsupported colour format: ${color}`);
}

/** Composite a (possibly translucent) colour over an opaque background. */
export function flatten(color: string, background: string): string {
  const fg = parseColor(color);
  const bg = parseColor(background);
  const mix = (f: number, b: number) => Math.round(f * fg.a + b * (1 - fg.a));
  const hex = [mix(fg.r, bg.r), mix(fg.g, bg.g), mix(fg.b, bg.b)].map((v) => v.toString(16).padStart(2, '0')).join('');
  return `#${hex}`;
}

function relativeLuminance(color: string): number {
  const { r, g, b } = parseColor(color);
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(flatten(foreground, background));
  const bg = relativeLuminance(background);
  const [lighter, darker] = fg > bg ? [fg, bg] : [bg, fg];
  return (lighter + 0.05) / (darker + 0.05);
}
