/**
 * Dependency-free geometry used by both the WebGL scenes and their server-rendered SVG
 * fallbacks, so the static and 3D versions of each visual share one layout.
 */

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
export const easeOutCubic = (t: number) => 1 - (1 - clamp(t)) ** 3;
export const easeInOutCubic = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
/** Normalised progress of `time` through the window [start, end]. */
export const phase = (time: number, start: number, end: number) => clamp((time - start) / (end - start));

/** Deterministic PRNG so layouts are identical on the server, the client and in tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
}

export function lerpVec3(a: Vec3, b: Vec3, t: number, out: Vec3 = [0, 0, 0]): Vec3 {
  out[0] = lerp(a[0], b[0], t);
  out[1] = lerp(a[1], b[1], t);
  out[2] = lerp(a[2], b[2], t);
  return out;
}

/** Quadratic arc from a to b whose midpoint is lifted by `height`. */
export function quadraticArc(a: Vec3, b: Vec3, height: number, segments = 32): Vec3[] {
  const control: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + height, (a[2] + b[2]) / 2];
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const u = 1 - t;
    points.push([
      u * u * a[0] + 2 * u * t * control[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * control[1] + t * t * b[1],
      u * u * a[2] + 2 * u * t * control[2] + t * t * b[2],
    ]);
  }
  return points;
}

/** Uniform Catmull–Rom spline through `points`. */
export function catmullRom(points: Vec3[], segmentsPerSpan = 16): Vec3[] {
  if (points.length < 2) return points.slice();
  const result: Vec3[] = [];
  const get = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))] as Vec3;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    for (let s = 0; s < segmentsPerSpan; s++) {
      const t = s / segmentsPerSpan;
      const t2 = t * t;
      const t3 = t2 * t;
      const point = [0, 0, 0] as Vec3;
      for (let k = 0; k < 3; k++) {
        point[k] =
          0.5 *
          (2 * p1[k]! +
            (-p0[k]! + p2[k]!) * t +
            (2 * p0[k]! - 5 * p1[k]! + 4 * p2[k]! - p3[k]!) * t2 +
            (-p0[k]! + 3 * p1[k]! - 3 * p2[k]! + p3[k]!) * t3);
      }
      result.push(point);
    }
  }
  result.push(get(points.length - 1).slice() as Vec3);
  return result;
}

/** Polyline with every interior corner replaced by a quadratic curve of the given radius. */
export function roundedPolyline(points: Vec3[], radius: number, cornerSegments = 8): Vec3[] {
  if (points.length < 3) return points.slice();
  const result: Vec3[] = [points[0]!.slice() as Vec3];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]!;
    const corner = points[i]!;
    const next = points[i + 1]!;
    const r = Math.min(radius, distance(prev, corner) / 2, distance(corner, next) / 2);
    const start = lerpVec3(corner, prev, r / distance(prev, corner));
    const end = lerpVec3(corner, next, r / distance(corner, next));
    for (let s = 0; s <= cornerSegments; s++) {
      const t = s / cornerSegments;
      const u = 1 - t;
      result.push([
        u * u * start[0] + 2 * u * t * corner[0] + t * t * end[0],
        u * u * start[1] + 2 * u * t * corner[1] + t * t * end[1],
        u * u * start[2] + 2 * u * t * corner[2] + t * t * end[2],
      ]);
    }
  }
  result.push(points[points.length - 1]!.slice() as Vec3);
  return result;
}

/** A polyline with arc-length parameterisation: `at(0.5)` is the true halfway point. */
export class SampledPath {
  readonly points: Vec3[];
  readonly cumulative: number[];
  readonly length: number;

  constructor(points: Vec3[]) {
    this.points = points;
    this.cumulative = [0];
    for (let i = 1; i < points.length; i++) {
      this.cumulative.push(this.cumulative[i - 1]! + distance(points[i - 1]!, points[i]!));
    }
    this.length = this.cumulative[this.cumulative.length - 1] ?? 0;
  }

  at(t: number, out: Vec3 = [0, 0, 0]): Vec3 {
    const target = clamp(t) * this.length;
    let lo = 0;
    let hi = this.cumulative.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (this.cumulative[mid]! < target) lo = mid;
      else hi = mid;
    }
    const segment = this.cumulative[hi]! - this.cumulative[lo]! || 1;
    return lerpVec3(this.points[lo]!, this.points[hi]!, (target - this.cumulative[lo]!) / segment, out);
  }

  /** Evenly spaced resampling (by arc length). */
  resample(count: number): Vec3[] {
    return Array.from({ length: count }, (_, i) => this.at(i / (count - 1)));
  }

  /** Normalised position of the sample closest to `point`. */
  closestT(point: Vec3, samples = 200): number {
    let best = 0;
    let bestDistance = Infinity;
    const scratch: Vec3 = [0, 0, 0];
    for (let i = 0; i <= samples; i++) {
      const d = distance(this.at(i / samples, scratch), point);
      if (d < bestDistance) {
        bestDistance = d;
        best = i / samples;
      }
    }
    return best;
  }
}
