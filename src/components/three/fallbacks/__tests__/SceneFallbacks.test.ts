import { sceneColors } from '@/design-system/tokens';
import { sceneFallbacks } from '../SceneFallbacks';

describe('static scene illustrations', () => {
  it.each(Object.keys(sceneFallbacks) as (keyof typeof sceneFallbacks)[])('%s is a valid, scalable SVG', (name) => {
    const svg = sceneFallbacks[name]();
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    // Case-sensitive structural attributes must survive the attribute serialiser.
    expect(svg).toMatch(/ viewBox="0 0 \d+ \d+"/);
    expect(svg).toContain(' preserveAspectRatio="xMidYMid slice"');
    expect(svg).not.toMatch(/NaN|undefined|Infinity/);
    expect(svg.endsWith('</svg>')).toBe(true);
  });

  it('draws with the brand scene colours', () => {
    const svg = sceneFallbacks.mobility();
    expect(svg).toContain(sceneColors.driver);
    expect(svg).toContain(sceneColors.route);
  });

  it('escapes label text', () => {
    expect(sceneFallbacks.matching()).toContain('>Gurgaon</text>');
  });
});
