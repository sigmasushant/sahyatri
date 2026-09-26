import { SampledPath, mulberry32 } from '../geometry';
import {
  formationCount,
  formationPoint,
  formationSeeds,
  matchingLayout,
  matchingPhaseAt,
  matchingTimeline,
  networkCountAt,
  networkLayout,
  technologyModes,
  type FormationPoint,
} from '../layouts';
import { createProjector } from '../projection';

describe('scene layouts', () => {
  it('are deterministic, so SVG fallbacks and WebGL scenes match', () => {
    expect(networkLayout(60)).toEqual(networkLayout(60));
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('builds a connected, growing network with the first node at the centre', () => {
    const { nodes, edges } = networkLayout(80);
    expect(nodes[0]!.reveal).toBe(0);
    expect(Math.abs(nodes[0]!.x) + Math.abs(nodes[0]!.z)).toBe(0);
    const connected = new Set([0]);
    for (const [a, b] of edges) {
      expect(a).toBeLessThan(b);
      connected.add(b);
    }
    expect(connected.size).toBe(80);
  });

  it('grows 1 → 5 → 20 → all as the section scrolls', () => {
    expect(networkCountAt(0, 150)).toBe(1);
    expect(networkCountAt(1 / 3, 150)).toBeCloseTo(5);
    expect(networkCountAt(2 / 3, 150)).toBeCloseTo(20);
    expect(networkCountAt(1, 150)).toBeCloseTo(150);
  });

  it('merges the passenger route into the driver route at the pickup point', () => {
    const layout = matchingLayout(140);
    expect(layout.merged.points).toHaveLength(140);
    const end = layout.merged.points[139]!;
    const driverEnd = layout.driver.points[layout.driver.points.length - 1]!;
    expect(end[0]).toBeCloseTo(driverEnd[0]);
    expect(end[2]).toBeCloseTo(driverEnd[2]);
    expect(layout.pickupT).toBeGreaterThan(0);
    expect(layout.pickupT).toBeLessThan(0.5);
  });

  it('tells the matching story in order', () => {
    expect(matchingPhaseAt(0)).toBe('searching');
    expect(matchingPhaseAt(matchingTimeline.scanStart + 0.1)).toBe('scanning');
    expect(matchingPhaseAt(matchingTimeline.mergeStart + 0.1)).toBe('matching');
    expect(matchingPhaseAt(matchingTimeline.matched + 10)).toBe('matched');
  });

  it('keeps every technology formation finite and on stage', () => {
    const count = formationCount.low;
    const seeds = formationSeeds(count);
    const point: FormationPoint = { position: [0, 0, 0], color: 'node', size: 1, alpha: 1 };
    for (const mode of technologyModes) {
      for (let i = 0; i < count; i += 7) {
        formationPoint(mode, i, count, 3.3, seeds, point);
        for (const value of point.position) {
          expect(Number.isFinite(value)).toBe(true);
          expect(Math.abs(value)).toBeLessThan(6);
        }
      }
    }
  });
});

describe('geometry', () => {
  it('samples paths by arc length', () => {
    const path = new SampledPath([
      [0, 0, 0],
      [1, 0, 0],
      [4, 0, 0],
    ]);
    expect(path.length).toBe(4);
    expect(path.at(0.5)).toEqual([2, 0, 0]);
  });

  it('projects the camera target to the centre of the frame', () => {
    const project = createProjector({ position: [0, 5, 10], target: [0, 0, 0], fov: 40 }, 1600, 900);
    const [x, y] = project([0, 0, 0]);
    expect(x).toBeCloseTo(800);
    expect(y).toBeCloseTo(450);
  });
});
