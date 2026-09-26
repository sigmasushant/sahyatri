import { BufferAttribute, BufferGeometry, DynamicDrawUsage, type Color } from 'three';
import type { Vec3 } from './geometry';

/* Ribbon ------------------------------------------------------------------------------------ */

function writeRibbon(geometry: BufferGeometry, points: Vec3[], width: number) {
  const position = geometry.getAttribute('position') as BufferAttribute;
  const u = geometry.getAttribute('aU') as BufferAttribute;
  const half = width / 2;
  let total = 0;
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    lengths.push(total);
  }
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)]!;
    const next = points[Math.min(points.length - 1, i + 1)]!;
    let tx = next[0] - prev[0];
    let tz = next[2] - prev[2];
    const len = Math.hypot(tx, tz) || 1;
    tx /= len;
    tz /= len;
    const [x, y, z] = points[i]!;
    position.setXYZ(i * 2, x - tz * half, y, z + tx * half);
    position.setXYZ(i * 2 + 1, x + tz * half, y, z - tx * half);
    const along = total > 0 ? lengths[i]! / total : 0;
    u.setX(i * 2, along);
    u.setX(i * 2 + 1, along);
  }
  position.needsUpdate = true;
  u.needsUpdate = true;
  geometry.computeBoundingSphere();
}

/** Flat strip following `points` in the XZ plane, `width` world units wide. */
export function createRibbonGeometry(points: Vec3[], width: number): BufferGeometry {
  const geometry = new BufferGeometry();
  const count = points.length;
  const position = new BufferAttribute(new Float32Array(count * 6), 3);
  position.setUsage(DynamicDrawUsage);
  const v = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) v[i * 2 + 1] = 1;
  const indices: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setAttribute('position', position);
  geometry.setAttribute('aU', new BufferAttribute(new Float32Array(count * 2), 1));
  geometry.setAttribute('aV', new BufferAttribute(v, 1));
  geometry.setIndex(indices);
  writeRibbon(geometry, points, width);
  return geometry;
}

/** Rewrite a ribbon in place (same number of points), e.g. while morphing a route. */
export function updateRibbonGeometry(geometry: BufferGeometry, points: Vec3[], width: number) {
  writeRibbon(geometry, points, width);
}

/* Line segments ----------------------------------------------------------------------------- */

export interface LinePath {
  points: Vec3[];
  color: Color;
  alpha: number;
  /** For reveal-animated networks: the path appears once `uCount` passes this value. */
  reveal?: number;
}

/** Many polylines batched into one LineSegments geometry (one draw call). */
export function createLinesGeometry(paths: LinePath[], { reveal = false } = {}): BufferGeometry {
  const segments = paths.reduce((sum, path) => sum + Math.max(0, path.points.length - 1), 0);
  const positions = new Float32Array(segments * 6);
  const colors = new Float32Array(segments * 6);
  const alphas = new Float32Array(segments * 2);
  const reveals = reveal ? new Float32Array(segments * 2) : null;
  const ts = reveal ? new Float32Array(segments * 2) : null;

  let vertex = 0;
  for (const path of paths) {
    const last = path.points.length - 1;
    for (let i = 0; i < last; i++) {
      for (const k of [i, i + 1]) {
        const p = path.points[k]!;
        positions.set(p, vertex * 3);
        colors.set([path.color.r, path.color.g, path.color.b], vertex * 3);
        alphas[vertex] = path.alpha * (0.35 + 0.65 * Math.sin((k / last) * Math.PI) ** 0.5);
        if (reveals && ts) {
          reveals[vertex] = path.reveal ?? 0;
          ts[vertex] = k / last;
        }
        vertex++;
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new BufferAttribute(colors, 3));
  geometry.setAttribute('aAlpha', new BufferAttribute(alphas, 1));
  if (reveals && ts) {
    geometry.setAttribute('aReveal', new BufferAttribute(reveals, 1));
    geometry.setAttribute('aT', new BufferAttribute(ts, 1));
  }
  geometry.computeBoundingSphere();
  return geometry;
}

/* Points ------------------------------------------------------------------------------------ */

export interface PointsBuffers {
  geometry: BufferGeometry;
  position: BufferAttribute;
  color: BufferAttribute;
  size: BufferAttribute;
  alpha: BufferAttribute;
}

/** Point cloud with per-point colour, size (px at 10 units) and alpha, all writable per frame. */
export function createPointsBuffers(count: number, dynamic = true): PointsBuffers {
  const geometry = new BufferGeometry();
  const position = new BufferAttribute(new Float32Array(count * 3), 3);
  const color = new BufferAttribute(new Float32Array(count * 3), 3);
  const size = new BufferAttribute(new Float32Array(count), 1);
  const alpha = new BufferAttribute(new Float32Array(count), 1);
  if (dynamic) {
    for (const attribute of [position, color, size, alpha]) attribute.setUsage(DynamicDrawUsage);
  }
  geometry.setAttribute('position', position);
  geometry.setAttribute('aColor', color);
  geometry.setAttribute('aSize', size);
  geometry.setAttribute('aAlpha', alpha);
  return { geometry, position, color, size, alpha };
}

export function markPointsDirty(buffers: PointsBuffers, { position = true, color = false, size = false, alpha = true } = {}) {
  if (position) buffers.position.needsUpdate = true;
  if (color) buffers.color.needsUpdate = true;
  if (size) buffers.size.needsUpdate = true;
  if (alpha) buffers.alpha.needsUpdate = true;
}
