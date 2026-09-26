import type { Vec3 } from './geometry';
import type { CameraSpec } from './layouts';

type Projected = [x: number, y: number, depth: number];

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
};

/**
 * Perspective projection matching a three.js PerspectiveCamera (vertical fov) looking at
 * `target`, mapped into an SVG viewBox of `width` × `height`.
 */
export function createProjector(camera: CameraSpec, width: number, height: number) {
  const forward = normalize(sub(camera.target, camera.position));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
  const aspect = width / height;

  return (point: Vec3): Projected => {
    const d = sub(point, camera.position);
    const depth = Math.max(0.001, dot(d, forward));
    const ndcX = dot(d, right) / (depth * tanHalf * aspect);
    const ndcY = dot(d, up) / (depth * tanHalf);
    return [((ndcX + 1) / 2) * width, ((1 - ndcY) / 2) * height, depth];
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

export function svgPath(points: Projected[], closed = false): string {
  return (
    points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join('') + (closed ? 'Z' : '')
  );
}
