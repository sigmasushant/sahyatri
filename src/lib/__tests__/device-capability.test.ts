import { classifyDevice, lowerTier, tierAtLeast, tierOverride, type CapabilitySignals } from '../device-capability';

const desktop: CapabilitySignals = {
  webgl: true,
  renderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11)',
  cores: 12,
  memory: 8,
  saveData: false,
  coarsePointer: false,
  viewportWidth: 1440,
};

describe('classifyDevice', () => {
  it('gives capable desktops the full experience', () => {
    expect(classifyDevice(desktop)).toBe('high');
  });

  it('reduces WebGL on phones, small screens and modest hardware', () => {
    expect(classifyDevice({ ...desktop, coarsePointer: true })).toBe('low');
    expect(classifyDevice({ ...desktop, viewportWidth: 390 })).toBe('low');
    expect(classifyDevice({ ...desktop, memory: 4 })).toBe('low');
    expect(classifyDevice({ ...desktop, cores: 4 })).toBe('low');
  });

  it('falls back to static visuals without WebGL, on software renderers, weak devices or Save-Data', () => {
    expect(classifyDevice({ ...desktop, webgl: false })).toBe('static');
    expect(classifyDevice({ ...desktop, renderer: 'Google SwiftShader' })).toBe('static');
    expect(classifyDevice({ ...desktop, renderer: 'llvmpipe (LLVM 15.0.7, 256 bits)' })).toBe('static');
    expect(classifyDevice({ ...desktop, memory: 2 })).toBe('static');
    expect(classifyDevice({ ...desktop, cores: 2 })).toBe('static');
    expect(classifyDevice({ ...desktop, saveData: true })).toBe('static');
  });

  it('treats unknown hints as capable rather than guessing low', () => {
    expect(classifyDevice({ ...desktop, renderer: null, cores: null, memory: null })).toBe('high');
  });
});

describe('tier helpers', () => {
  it('orders tiers static < low < high', () => {
    expect(tierAtLeast('high', 'low')).toBe(true);
    expect(tierAtLeast('low', 'high')).toBe(false);
    expect(lowerTier('high', 'low')).toBe('low');
    expect(lowerTier('static', 'high')).toBe('static');
  });

  it('supports a QA override in the query string', () => {
    expect(tierOverride('?webgl=off')).toBe('static');
    expect(tierOverride('?webgl=low')).toBe('low');
    expect(tierOverride('?webgl=high')).toBe('high');
    expect(tierOverride('?webgl=banana')).toBeNull();
    expect(tierOverride('')).toBeNull();
  });
});
