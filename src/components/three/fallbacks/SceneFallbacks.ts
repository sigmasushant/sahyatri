/**
 * Static SVG versions of every 3D scene, generated from the same layouts and camera framing as
 * the WebGL scenes so the crossfade from static to 3D is seamless. They are the complete
 * experience on devices without (capable) WebGL.
 *
 * Rendered to standalone SVG files at build time (app/visuals/[file]/route.ts) and shown with
 * <img>, so they cost nothing in page HTML, the RSC payload or JavaScript. Colours are baked in
 * from the design tokens because CSS variables do not reach inside an image.
 */
import { sceneColors, tones } from '@/design-system/tokens';
import { SampledPath, catmullRom, mulberry32, quadraticArc, smoothstep, type Vec3 } from '../lib/geometry';
import {
  STREET_SPACING,
  cityPoint,
  featuredRoutePath,
  formationPoint,
  formationSeeds,
  heroCamera,
  heroCameraCompact,
  heroCities,
  heroEdgePath,
  heroEdges,
  heroGround,
  matchingCamera,
  matchingCameraCompact,
  matchingLayout,
  matchingPlaces,
  networkCamera,
  networkCameraCompact,
  networkEdgeArc,
  networkLayout,
  podOutline,
  safetyBuildings,
  safetyCamera,
  safetyRoute,
  seatsCamera,
  seatsLayout,
  technologyCamera,
  type CameraSpec,
  type FormationPoint,
} from '../lib/layouts';
import { createProjector, svgPath } from '../lib/projection';

/** Frame size: wide by default, square for stacked mobile layouts. */
let W = 1600;
let H = 900;

function withFrame<T>(width: number, height: number, render: () => T): T {
  const previous = [W, H];
  W = width;
  H = height;
  try {
    return render();
  } finally {
    [W, H] = previous as [number, number];
  }
}
const FONT = 'Manrope, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

type Project = ReturnType<typeof createProjector>;
type Attributes = Record<string, string | number | undefined>;

/* Tiny SVG string builder --------------------------------------------------------------------- */

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** SVG presentation attributes are kebab-case; a few structural ones are case-sensitive camelCase. */
const CAMEL_CASE = new Set(['viewBox', 'preserveAspectRatio']);
const kebab = (name: string) => (CAMEL_CASE.has(name) ? name : name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
const round = (value: number) => Math.round(value * 10) / 10;

function el(tag: string, attributes: Attributes, children = ''): string {
  const attrs = Object.entries(attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${kebab(key)}="${typeof value === 'number' ? round(value) : escape(value as string)}"`)
    .join('');
  return children ? `<${tag}${attrs}>${children}</${tag}>` : `<${tag}${attrs}/>`;
}

const frame = (children: string[]) =>
  el('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice' }, children.join(''));

/** The visual vocabulary of the fallbacks, derived from the scene colour tokens. */
const paint = {
  route: { fill: 'none', stroke: sceneColors.route, strokeWidth: 1.2, strokeLinecap: 'round', opacity: 0.85 },
  faint: { fill: 'none', stroke: sceneColors.node, strokeWidth: 1.4, strokeLinecap: 'round', opacity: 0.16 },
  street: { fill: 'none', stroke: sceneColors.route, strokeWidth: 1, opacity: 0.5 },
  driver: { fill: 'none', stroke: sceneColors.driver, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
  passenger: { fill: 'none', stroke: sceneColors.passenger, strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
  glow: { fill: 'none', stroke: sceneColors.driver, strokeWidth: 16, strokeLinecap: 'round', opacity: 0.1 },
  corridor: { fill: 'none', stroke: sceneColors.shield, strokeWidth: 30, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.07 },
  outline: { fill: 'none', stroke: sceneColors.node, strokeWidth: 2, opacity: 0.75 },
  ring: { fill: 'none', stroke: sceneColors.driver, strokeWidth: 1.6, opacity: 0.55 },
  ringShield: { fill: 'none', stroke: sceneColors.shield, strokeWidth: 1.4, opacity: 0.45 },
  ringMatch: { fill: 'none', stroke: sceneColors.match, strokeWidth: 2, opacity: 0.8 },
} satisfies Record<string, Attributes>;

const nodeFill = { node: sceneColors.node, driver: sceneColors.driver, passenger: sceneColors.passenger } as const;

/* Shared pieces --------------------------------------------------------------------------------- */

/** A perspective dot field as three paths (bright → faint), each dot a zero-length round-capped segment. */
function dotGround(
  project: Project,
  { x, z, spacing, height, center, radius }: {
    x: [number, number];
    z: [number, number];
    spacing: number;
    height: (x: number, z: number) => number;
    center: [number, number];
    radius: number;
  },
): string {
  const buckets = ['', '', ''];
  for (let px = x[0]; px <= x[1]; px += spacing) {
    for (let pz = z[0]; pz <= z[1]; pz += spacing) {
      const fade = 1 - smoothstep(radius * 0.45, radius, Math.hypot(px - center[0], pz - center[1]));
      if (fade < 0.08) continue;
      const [sx, sy] = project([px, height(px, pz), pz]);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
      buckets[fade > 0.66 ? 0 : fade > 0.33 ? 1 : 2] += `M${Math.round(sx)} ${Math.round(sy)}h0`;
    }
  }
  const paths = buckets.map((d, i) => (d ? el('path', { d, opacity: [0.95, 0.6, 0.3][i] }) : '')).join('');
  return el('g', { stroke: sceneColors.dot, strokeWidth: 3, strokeLinecap: 'round' }, paths);
}

function node(project: Project, point: Vec3, { major = false, tone = 'node' as keyof typeof nodeFill } = {}): string {
  const [x, y] = project(point);
  const halo = tone === 'passenger' ? sceneColors.passenger : sceneColors.driver;
  return (
    el('circle', { cx: x, cy: y, r: major ? 26 : 13, fill: halo, opacity: tone === 'passenger' ? 0.18 : 0.16 }) +
    el('circle', { cx: x, cy: y, r: major ? 5 : 3.4, fill: nodeFill[tone] })
  );
}

function label(project: Project, point: Vec3, text: string, tone?: 'accent' | 'info'): string {
  const [x, y] = project(point);
  const fill = tone === 'accent' ? sceneColors.driver : tone === 'info' ? sceneColors.passenger : tones.dark.fgSecondary;
  return el('text', { x, y, textAnchor: 'middle', fill, fontFamily: FONT, fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }, escape(text));
}

const line = (project: Project, points: Vec3[], attributes: Attributes, closed = false) =>
  el('path', { d: svgPath(points.map(project), closed), ...attributes });

function travellerDots(project: Project, paths: SampledPath[], count: number, seed: number): string {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const path = paths[Math.floor(random() * paths.length)]!;
    const [x, y] = project(path.at(0.15 + random() * 0.7));
    const color = random() < 0.32 ? sceneColors.passenger : sceneColors.driver;
    return el('circle', { cx: x, cy: y, r: 9, fill: color, opacity: 0.17 }) + el('circle', { cx: x, cy: y, r: 2.6, fill: color });
  }).join('');
}

/* Scenes ------------------------------------------------------------------------------------------ */

function mobility({ showLabels = true, camera = heroCamera }: { showLabels?: boolean; camera?: CameraSpec } = {}): string {
  const project = createProjector(camera, W, H);
  const edges = heroEdges(3).map(([a, b], i) => heroEdgePath(heroCities[a]!, heroCities[b]!, i + 1, 14));
  const featured = featuredRoutePath(14);
  const delhi = heroCities.find((c) => c.id === 'delhi')!;
  const jaipur = heroCities.find((c) => c.id === 'jaipur')!;
  return frame([
    dotGround(project, { x: [-7, 12], z: [-9, 5], spacing: 0.34, height: heroGround, center: [2.4, -1.2], radius: 9.5 }),
    ...edges.map((points) => line(project, points, paint.route)),
    line(project, featured, paint.glow),
    line(project, featured, paint.driver),
    travellerDots(project, edges.map((p) => new SampledPath(p)), 18, 5),
    ...heroCities.map((city) => node(project, cityPoint(city), { major: city.major })),
    showLabels ? label(project, cityPoint(delhi, 0.42), 'Delhi') + label(project, cityPoint(jaipur, 0.42), 'Jaipur', 'accent') : '',
  ]);
}

function matching(camera: CameraSpec = matchingCamera): string {
  const project = createProjector(camera, W, H);
  const layout = matchingLayout(140);
  const [px, py] = project(layout.pickup);
  const { delhi, gurgaon, jaipur } = matchingPlaces;
  return frame([
    dotGround(project, { x: [-6.5, 6.5], z: [-4.5, 4.5], spacing: 0.38, height: () => 0, center: [0, 0.3], radius: 6.8 }),
    ...layout.candidates.map((path) => line(project, path.points, paint.faint)),
    line(project, layout.driver.points, paint.glow),
    line(project, layout.driver.points, paint.driver),
    line(project, layout.merged.points.slice(0, 20), paint.passenger),
    el('circle', { cx: px, cy: py, r: 34, ...paint.ringMatch }),
    el('circle', { cx: px, cy: py, r: 58, ...paint.ringShield }),
    node(project, delhi, { major: true }),
    node(project, gurgaon, { major: true, tone: 'passenger' }),
    node(project, jaipur, { major: true, tone: 'driver' }),
    label(project, [delhi[0], 0.4, delhi[2]], 'Delhi'),
    label(project, [gurgaon[0] - 0.2, 0.4, gurgaon[2] + 0.2], 'Gurgaon', 'info'),
    label(project, [jaipur[0], 0.4, jaipur[2]], 'Jaipur', 'accent'),
  ]);
}

function safety(): string {
  const project = createProjector(safetyCamera, W, H);
  const buildings = safetyBuildings('low').sort((a, b) => a.z - b.z);
  const route = safetyRoute();
  const vehicle = route.at(0.55);
  const [vx, vy] = project(vehicle);
  const [, domeTop] = project([vehicle[0], 0.95, vehicle[2]]);
  const streets: string[] = [];
  for (let i = -6; i <= 6; i++) streets.push(line(project, [[i * STREET_SPACING, 0, -8], [i * STREET_SPACING, 0, 4]], paint.street));
  for (let j = -6; j <= 3; j++) streets.push(line(project, [[-8, 0, j * STREET_SPACING], [8, 0, j * STREET_SPACING]], paint.street));
  const blocks = buildings.map((b) => {
    const hw = b.width / 2;
    const hd = b.depth / 2;
    const front: Vec3[] = [
      [b.x - hw, 0, b.z + hd],
      [b.x + hw, 0, b.z + hd],
      [b.x + hw, b.height, b.z + hd],
      [b.x - hw, b.height, b.z + hd],
    ];
    const top: Vec3[] = [
      [b.x - hw, b.height, b.z - hd],
      [b.x + hw, b.height, b.z - hd],
      [b.x + hw, b.height, b.z + hd],
      [b.x - hw, b.height, b.z + hd],
    ];
    return line(project, front, { fill: sceneColors.building }, true) + line(project, top, { fill: sceneColors.buildingTop }, true);
  });
  return frame([
    ...streets,
    line(project, route.points, paint.corridor),
    ...blocks,
    line(project, route.points, paint.driver),
    el('ellipse', { cx: vx, cy: vy, rx: 130, ry: 62, ...paint.ringShield }),
    el('ellipse', { cx: vx, cy: vy, rx: 86, ry: 40, ...paint.ringShield }),
    el('ellipse', { cx: vx, cy: (vy + domeTop) / 2, rx: 70, ry: (vy - domeTop) / 2 + 10, fill: sceneColors.shield, opacity: 0.08 }),
    el('circle', { cx: vx, cy: vy, r: 16, fill: sceneColors.driver, opacity: 0.16 }),
    el('circle', { cx: vx, cy: vy, r: 5, fill: sceneColors.driver }),
  ]);
}

function seats(): string {
  const project = createProjector(seatsCamera, W, H);
  const route = catmullRom(seatsLayout.route, 16);
  const traveller = seatsLayout.travellers[1]!;
  const seat = seatsLayout.emptySeats[0]!;
  const arc = quadraticArc([traveller[0], 0.05, traveller[2]], [seat[0], 0.05, seat[2]], 1.3, 30);
  return frame([
    dotGround(project, { x: [-6, 10], z: [-4.5, 4.5], spacing: 0.4, height: () => 0, center: [1, 0], radius: 6.5 }),
    line(project, route, paint.glow),
    line(project, route, paint.driver),
    line(project, podOutline(10), paint.outline, true),
    line(project, arc, { ...paint.passenger, strokeDasharray: '2 10' }),
    node(project, seatsLayout.driverSeat),
    node(project, seat, { tone: 'passenger' }),
    ...seatsLayout.emptySeats.slice(1).map((s) => {
      const [x, y] = project(s);
      return el('circle', { cx: x, cy: y, r: 18, ...paint.ring });
    }),
    ...seatsLayout.travellers.map((t, i) => (i === 1 ? '' : node(project, t, { tone: 'passenger' }))),
  ]);
}

function network(camera: CameraSpec = networkCamera): string {
  const project = createProjector(camera, W, H);
  const layout = networkLayout(72);
  const highlights = layout.highlights
    .filter((path) => path.length > 2)
    .map((path) => path.slice(1).flatMap((n, i) => networkEdgeArc(layout.nodes[path[i]!]!, layout.nodes[n]!, 10)));
  return frame([
    ...layout.edges.map(([a, b]) => line(project, networkEdgeArc(layout.nodes[a]!, layout.nodes[b]!, 8), paint.faint)),
    ...highlights.map((points, i) => line(project, points, i === 1 ? paint.passenger : paint.driver)),
    ...layout.nodes.map((n, i) => node(project, [n.x, 0.02, n.z], { major: i === 0, tone: i === 0 ? 'driver' : 'node' })),
  ]);
}

function technology(): string {
  const project = createProjector(technologyCamera, W, H);
  const count = 360;
  const seeds = formationSeeds(count);
  const point: FormationPoint = { position: [0, 0, 0], color: 'node', size: 4, alpha: 1 };
  return frame(
    Array.from({ length: count }, (_, i) => {
      formationPoint('matching', i, count, 4, seeds, point);
      const [x, y] = project(point.position);
      return el('circle', { cx: Math.round(x), cy: Math.round(y), r: point.size * 0.8, fill: sceneColors[point.color], opacity: point.alpha });
    }),
  );
}

/** Every static visual, by file name. Served from /visuals/<name>.svg. */
export const sceneFallbacks = {
  mobility: () => mobility(),
  'mobility-compact': () => withFrame(1000, 1000, () => mobility({ camera: heroCameraCompact })),
  ambient: () => mobility({ showLabels: false }),
  matching: () => matching(),
  'matching-compact': () => withFrame(1000, 1000, () => matching(matchingCameraCompact)),
  safety,
  seats,
  network: () => network(),
  'network-compact': () => withFrame(900, 1400, () => network(networkCameraCompact)),
  technology,
} satisfies Record<string, () => string>;

export type SceneFallbackName = keyof typeof sceneFallbacks;
