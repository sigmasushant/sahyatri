/**
 * Scene layouts. Pure data + math (no three.js), shared by the WebGL scenes and the SVG
 * fallbacks. Places are abstract: apart from the labelled example journey (Delhi → Jaipur),
 * nodes do not represent real operating locations.
 */
import {
  SampledPath,
  catmullRom,
  clamp,
  lerp,
  mulberry32,
  roundedPolyline,
  smoothstep,
  type Vec3,
} from './geometry';

export interface CameraSpec {
  position: Vec3;
  target: Vec3;
  fov: number;
}

/* ------------------------------------------------------------------------------------------
 * Hero · mobility network
 * ---------------------------------------------------------------------------------------- */

export const heroCamera: CameraSpec = { position: [0, 4.3, 8.6], target: [1.9, -0.35, -0.7], fov: 34 };
export const heroCameraCompact: CameraSpec = { position: [2.6, 7.6, 7.4], target: [2.6, -0.5, -0.2], fov: 42 };

/** The ground falls away from the centre like the curvature of a small world. */
export function heroGround(x: number, z: number): number {
  const dx = x - 2.2;
  const dz = z + 1;
  return -(dx * dx + dz * dz) * 0.011;
}

export interface City {
  id: string;
  x: number;
  z: number;
  major?: boolean;
  label?: string;
}

export const heroCities: City[] = [
  { id: 'delhi', x: 0.6, z: -1.4, major: true, label: 'Delhi' },
  { id: 'stop-1', x: 1.2, z: -0.45 },
  { id: 'stop-2', x: 2.0, z: 0.45 },
  { id: 'stop-3', x: 3.0, z: 0.95 },
  { id: 'jaipur', x: 4.5, z: 1.6, major: true, label: 'Jaipur' },
  { id: 'n1', x: 2.2, z: -2.3 },
  { id: 'n2', x: 3.7, z: -1.5 },
  { id: 'n3', x: 5.5, z: -0.5 },
  { id: 'n4', x: -0.9, z: -2.7 },
  { id: 'n5', x: 0.5, z: -3.7 },
  { id: 'n6', x: 2.5, z: -4.4 },
  { id: 'n7', x: 4.4, z: -3.3 },
  { id: 'n8', x: 6.4, z: -2.3 },
  { id: 'n9', x: -1.6, z: -0.5 },
  { id: 'n10', x: -0.1, z: 1.0 },
  { id: 'n11', x: 3.3, z: 2.9 },
  { id: 'n12', x: 6.2, z: 1.5 },
  { id: 'n13', x: -2.5, z: -3.8 },
  { id: 'n14', x: 7.6, z: -0.2 },
  { id: 'n15', x: 1.3, z: 2.4 },
];

/** Flat ground for scenes without curvature (a stable reference for memoised geometry). */
export const flatGround = () => 0;

export const featuredRouteIds = ['delhi', 'stop-1', 'stop-2', 'stop-3', 'jaipur'];

export const cityPoint = (city: City, lift = 0): Vec3 => [city.x, heroGround(city.x, city.z) + lift, city.z];

/** Each city links to its nearest neighbours; deterministic and de-duplicated. */
export function heroEdges(neighbours = 3): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  heroCities.forEach((city, i) => {
    const nearest = heroCities
      .map((other, j) => ({ j, d: Math.hypot(other.x - city.x, other.z - city.z) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      }
    }
  });
  return edges;
}

/** A road-like, ground-hugging curve between two cities. */
export function heroEdgePath(a: City, b: City, seed: number, segments = 24): Vec3[] {
  const random = mulberry32(seed);
  const bend = (random() - 0.5) * 0.35;
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const offset = Math.sin(t * Math.PI) * bend;
    const x = a.x + dx * t - dz * offset;
    const z = a.z + dz * t + dx * offset;
    points.push([x, heroGround(x, z) + 0.012, z]);
  }
  return points;
}

export function featuredRoutePath(segmentsPerSpan = 20): Vec3[] {
  const stops = featuredRouteIds.map((id) => heroCities.find((c) => c.id === id)!);
  return catmullRom(
    stops.map((c) => cityPoint(c, 0.03)),
    segmentsPerSpan,
  ).map(([x, , z]) => [x, heroGround(x, z) + 0.03, z] as Vec3);
}

/* ------------------------------------------------------------------------------------------
 * AI matching
 * ---------------------------------------------------------------------------------------- */

/** Framed left of centre on wide screens, leaving room for the score panel on the right. */
export const matchingCamera: CameraSpec = { position: [1.9, 6.4, 5.9], target: [1.9, 0, 0.25], fov: 34 };
export const matchingCameraCompact: CameraSpec = { position: [0.1, 10.5, 7.2], target: [0.1, 0, 0.3], fov: 38 };

export const matchingPlaces = {
  delhi: [-3.3, 0, -0.9] as Vec3,
  gurgaon: [-2.3, 0, 1.05] as Vec3,
  jaipur: [3.5, 0, 0.7] as Vec3,
};

const driverWaypoints: Vec3[] = [matchingPlaces.delhi, [-2.35, 0, 0.1], [-0.6, 0, 0.3], [1.5, 0, 0.72], matchingPlaces.jaipur];
const passengerWaypoints: Vec3[] = [matchingPlaces.gurgaon, [-0.8, 0, 1.8], [1.5, 0, 1.95], matchingPlaces.jaipur];

export const candidateWaypoints: Vec3[][] = [
  [[-3.9, 0, 2.0], [-1.6, 0, -1.0], [1.2, 0, -1.9], [3.3, 0, -2.2]],
  [[-3.6, 0, -2.3], [-1.0, 0, -1.6], [1.5, 0, -0.9], [2.7, 0, -2.6]],
  [[-0.6, 0, 2.7], [1.6, 0, 1.5], [3.9, 0, 2.4]],
  [[-4.0, 0, 0.5], [-2.9, 0, -0.9], [-1.4, 0, -2.4]],
];

export interface MatchingLayout {
  driver: SampledPath;
  passenger: SampledPath;
  candidates: SampledPath[];
  /** Pickup point: where the passenger joins the driver's route. */
  pickup: Vec3;
  pickupT: number;
  /** Passenger path after matching (walk to pickup, then ride along the driver route). */
  merged: SampledPath;
}

export function matchingLayout(samples = 140): MatchingLayout {
  const driver = new SampledPath(catmullRom(driverWaypoints, 24));
  const passenger = new SampledPath(new SampledPath(catmullRom(passengerWaypoints, 24)).resample(samples));
  const candidates = candidateWaypoints.map((w) => new SampledPath(catmullRom(w, 20)));
  const pickupT = driver.closestT(matchingPlaces.gurgaon);
  const pickup = driver.at(pickupT);

  const walkSamples = Math.round(samples * 0.12);
  const merged: Vec3[] = [];
  for (let i = 0; i < walkSamples; i++) {
    const t = i / walkSamples;
    merged.push([
      lerp(matchingPlaces.gurgaon[0], pickup[0], t),
      0,
      lerp(matchingPlaces.gurgaon[2], pickup[2], t),
    ]);
  }
  const rideSamples = samples - walkSamples;
  for (let i = 0; i < rideSamples; i++) {
    merged.push(driver.at(lerp(pickupT, 1, i / (rideSamples - 1))));
  }
  return { driver, passenger, candidates, pickup, pickupT, merged: new SampledPath(merged) };
}

/** Timeline of the matching demo, in seconds. */
export const matchingTimeline = {
  scanStart: 1.1,
  selectStart: 3.7,
  mergeStart: 4.5,
  matched: 6.1,
  tripDuration: 6.5,
} as const;

export type MatchingPhase = 'searching' | 'scanning' | 'selecting' | 'matching' | 'matched';

export function matchingPhaseAt(time: number): MatchingPhase {
  if (time < matchingTimeline.scanStart) return 'searching';
  if (time < matchingTimeline.selectStart) return 'scanning';
  if (time < matchingTimeline.mergeStart) return 'selecting';
  if (time < matchingTimeline.matched) return 'matching';
  return 'matched';
}

/* ------------------------------------------------------------------------------------------
 * Safety · protected trip through a city
 * ---------------------------------------------------------------------------------------- */

export const safetyCamera: CameraSpec = { position: [0, 9.2, 6.4], target: [0, 0, -0.2], fov: 36 };
export const safetyCameraCompact: CameraSpec = { position: [0, 12, 8.5], target: [0, 0, -0.2], fov: 40 };

export const STREET_SPACING = 1.3;

export interface Building {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
}

export function safetyBuildings(density: 'high' | 'low', seed = 11): Building[] {
  const random = mulberry32(seed);
  const buildings: Building[] = [];
  const street = 0.36;
  const block = STREET_SPACING - street;
  const range = density === 'high' ? { x: 6, zMin: -6, zMax: 3 } : { x: 4, zMin: -4, zMax: 2 };

  for (let i = -range.x; i < range.x; i++) {
    for (let j = range.zMin; j < range.zMax; j++) {
      const cx = i * STREET_SPACING + STREET_SPACING / 2;
      const cz = j * STREET_SPACING + STREET_SPACING / 2;
      const falloff = 1 - smoothstep(2, 8.5, Math.hypot(cx, cz + 1.5));
      if (falloff <= 0.02) continue;
      const lots = density === 'high' && random() > 0.45 ? 2 : 1;
      for (let lot = 0; lot < lots; lot++) {
        const width = lots === 2 ? block / 2 - 0.06 : block;
        const offset = lots === 2 ? (lot === 0 ? -1 : 1) * (block / 4 + 0.015) : 0;
        buildings.push({
          x: cx + offset,
          z: cz,
          width: width * (0.62 + random() * 0.2),
          depth: block * (0.58 + random() * 0.24),
          height: (0.08 + random() ** 2.2 * 0.62) * (0.35 + falloff * 0.65),
        });
      }
    }
  }
  return buildings;
}

export function safetyRoute(): SampledPath {
  const s = STREET_SPACING;
  const corners: Vec3[] = [
    [-6.5, 0.02, s],
    [-2 * s, 0.02, s],
    [-2 * s, 0.02, -s],
    [2 * s, 0.02, -s],
    [2 * s, 0.02, 0],
    [6.5, 0.02, 0],
  ];
  return new SampledPath(roundedPolyline(corners, 0.45, 10));
}

/* ------------------------------------------------------------------------------------------
 * Driver · empty seats become shared journeys
 * ---------------------------------------------------------------------------------------- */

export const seatsCamera: CameraSpec = { position: [0.9, 6.2, 4.6], target: [0.9, 0, 0.1], fov: 36 };

export const seatsLayout = {
  pod: { length: 3.2, width: 1.7, radius: 0.62 },
  /** Right-hand drive: the driver sits front-right (+z is the vehicle's right when it faces +x). */
  driverSeat: [0.5, 0, 0.42] as Vec3,
  emptySeats: [
    [0.5, 0, -0.42],
    [-0.65, 0, -0.42],
    [-0.65, 0, 0.42],
  ] as Vec3[],
  travellers: [
    [-2.9, 0, -2.4],
    [2.4, 0, -2.6],
    [-3.4, 0, 2.1],
    [3.9, 0, 2.1],
    [0.2, 0, -3.1],
  ] as Vec3[],
  /** Which traveller boards which empty seat, in order. */
  boarding: [
    { traveller: 1, seat: 0 },
    { traveller: 0, seat: 1 },
    { traveller: 2, seat: 2 },
  ],
  route: [
    [1.6, 0, 0],
    [3.8, 0, -0.35],
    [6.2, 0, 0.3],
    [8.5, 0, -0.2],
  ] as Vec3[],
};

export const seatsTimeline = { boardStart: 1.0, boardEach: 1.5, hold: 2.6, reset: 1.2 } as const;
export const seatsCycle =
  seatsTimeline.boardStart + seatsTimeline.boardEach * 3 + seatsTimeline.hold + seatsTimeline.reset;

/** Rounded-rectangle outline of the vehicle, centred at the origin, as a closed loop. */
export function podOutline(segmentsPerCorner = 8): Vec3[] {
  const { length, width, radius } = seatsLayout.pod;
  const hx = length / 2;
  const hz = width / 2;
  const corners: [number, number, number][] = [
    [hx - radius, hz - radius, 0],
    [-hx + radius, hz - radius, Math.PI / 2],
    [-hx + radius, -hz + radius, Math.PI],
    [hx - radius, -hz + radius, (3 * Math.PI) / 2],
  ];
  const points: Vec3[] = [];
  for (const [cx, cz, start] of corners) {
    for (let s = 0; s <= segmentsPerCorner; s++) {
      const angle = start + (s / segmentsPerCorner) * (Math.PI / 2);
      points.push([cx + Math.cos(angle) * radius, 0.02, cz + Math.sin(angle) * radius]);
    }
  }
  points.push(points[0]!.slice() as Vec3);
  return points;
}

/* ------------------------------------------------------------------------------------------
 * Network growth · 1 → 5 → 20 → network
 * ---------------------------------------------------------------------------------------- */

/** Framed so the network sits right of and below the headline on wide screens. */
export const networkCamera: CameraSpec = { position: [-2.6, 7.4, 8.6], target: [-2.6, -0.4, -1.2], fov: 38 };
/** Aimed above the network so it sits in the lower half, clear of the headline. */
export const networkCameraCompact: CameraSpec = { position: [0, 9.5, 10.5], target: [0, 0, -3.4], fov: 52 };

export interface NetworkNode {
  x: number;
  z: number;
  /** Reveal order: node 0 appears first. */
  reveal: number;
}

export interface NetworkLayout {
  nodes: NetworkNode[];
  edges: [number, number][];
  /** A few long multi-hop journeys that light up once the network exists. */
  highlights: number[][];
}

export const networkStages = [
  { count: 1, label: 'One journey' },
  { count: 5, label: 'Five cities' },
  { count: 20, label: 'Twenty cities' },
  { count: Infinity, label: 'A network' },
] as const;

export function networkLayout(count: number, seed = 7, radius = 6.2): NetworkLayout {
  const random = mulberry32(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const raw = Array.from({ length: count }, (_, i) => {
    const r = i === 0 ? 0 : radius * Math.sqrt((i + 0.35) / count) * (0.88 + random() * 0.24);
    const angle = i * golden + (random() - 0.5) * 0.5;
    return { x: Math.cos(angle) * r, z: Math.sin(angle) * r * 0.62 };
  });
  raw.sort((a, b) => Math.hypot(a.x, a.z / 0.62) - Math.hypot(b.x, b.z / 0.62));
  const nodes: NetworkNode[] = raw.map((p, i) => ({ ...p, reveal: i }));

  const edges: [number, number][] = [];
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i]!;
    const earlier = nodes
      .slice(0, i)
      .map((other, j) => ({ j, d: Math.hypot(other.x - node.x, other.z - node.z) }))
      .sort((a, b) => a.d - b.d);
    edges.push([earlier[0]!.j, i]);
    if (i > 2 && i % 3 !== 0 && earlier[1]) edges.push([earlier[1].j, i]);
  }

  const adjacency = nodes.map(() => [] as number[]);
  for (const [a, b] of edges) {
    adjacency[a]!.push(b);
    adjacency[b]!.push(a);
  }
  const path = (from: number, to: number) => {
    const previous = new Map<number, number>([[from, -1]]);
    const queue = [from];
    while (queue.length) {
      const current = queue.shift()!;
      if (current === to) break;
      for (const next of adjacency[current]!) {
        if (!previous.has(next)) {
          previous.set(next, current);
          queue.push(next);
        }
      }
    }
    const result: number[] = [];
    for (let at = to; at !== -1 && at !== undefined; at = previous.get(at)!) result.unshift(at);
    return result;
  };

  const outer = nodes
    .map((node, index) => ({ index, angle: Math.atan2(node.z, node.x), r: Math.hypot(node.x, node.z) }))
    .filter(({ r }) => r > radius * 0.6);
  const pick = (angle: number) =>
    outer.reduce((best, candidate) =>
      Math.abs(Math.atan2(Math.sin(candidate.angle - angle), Math.cos(candidate.angle - angle))) <
      Math.abs(Math.atan2(Math.sin(best.angle - angle), Math.cos(best.angle - angle)))
        ? candidate
        : best,
    ).index;
  const highlights =
    outer.length > 4
      ? [
          path(pick(Math.PI), pick(0.1)),
          path(pick(-Math.PI / 2), pick(Math.PI / 2 - 0.4)),
          path(pick(2.4), pick(-0.9)),
        ]
      : [];

  return { nodes, edges, highlights };
}

/** Visible node count for a scroll progress in [0, 1], holding briefly on each stage. */
export function networkCountAt(progress: number, total: number): number {
  const stops = [1, 5, 20, total];
  const segment = clamp(progress) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(segment));
  const local = smoothstep(0.25, 0.85, segment - index);
  return lerp(stops[index]!, stops[index + 1]!, local);
}

export function networkStageIndex(progress: number): number {
  return Math.min(networkStages.length - 1, Math.round(clamp(progress) * (networkStages.length - 1)));
}

export function networkEdgeArc(a: NetworkNode, b: NetworkNode, segments = 12): Vec3[] {
  const d = Math.hypot(b.x - a.x, b.z - a.z);
  const height = Math.min(0.55, d * 0.12);
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push([lerp(a.x, b.x, t), Math.sin(t * Math.PI) * height, lerp(a.z, b.z, t)]);
  }
  return points;
}

/* ------------------------------------------------------------------------------------------
 * Technology · one particle system, five formations
 * ---------------------------------------------------------------------------------------- */

export const technologyCamera: CameraSpec = { position: [0, 0.4, 11.5], target: [0, 0, 0], fov: 34 };

export const technologyModes = ['matching', 'verification', 'safety', 'realtime', 'fraud'] as const;
export type TechnologyMode = (typeof technologyModes)[number];

export type FormationColor = 'driver' | 'passenger' | 'match' | 'node' | 'shield' | 'alert' | 'route';

export interface FormationPoint {
  position: Vec3;
  color: FormationColor;
  size: number;
  alpha: number;
}

/** Stable per-point random values used by every formation. */
export function formationSeeds(count: number, seed = 3): Float32Array {
  const random = mulberry32(seed);
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = random();
  return seeds;
}

const fract = (x: number) => x - Math.floor(x);

export function formationPoint(
  mode: TechnologyMode,
  index: number,
  count: number,
  time: number,
  seeds: Float32Array,
  out: FormationPoint,
): FormationPoint {
  const r1 = seeds[index * 3]!;
  const r2 = seeds[index * 3 + 1]!;
  const r3 = seeds[index * 3 + 2]!;
  const p = out.position;
  const share = index / count;

  switch (mode) {
    case 'matching': {
      if (share < 0.88) {
        const stream = index % 2;
        const u = fract(r1 + time * 0.07);
        const x = lerp(-4.4, 4.4, u);
        const converge = smoothstep(0.08, 0.52, u);
        const lane = (stream === 0 ? 1 : -1) * 1.7 * (1 - converge);
        p[0] = x;
        p[1] = lane + (r2 - 0.5) * lerp(0.34, 0.22, converge);
        p[2] = (r3 - 0.5) * 0.7;
        out.color = u > 0.52 ? 'match' : stream === 0 ? 'driver' : 'passenger';
        out.size = lerp(4.5, 6.5, r3);
        out.alpha = 0.55 + 0.45 * Math.sin(u * Math.PI);
      } else {
        p[0] = (r1 - 0.5) * 10;
        p[1] = (r2 - 0.5) * 5;
        p[2] = (r3 - 0.5) * 3 - 1;
        out.color = 'route';
        out.size = 3.5;
        out.alpha = 0.35;
      }
      break;
    }
    case 'verification': {
      if (share < 0.12) {
        const angle = r1 * Math.PI * 2;
        const radius = Math.sqrt(r2) * 0.38;
        p[0] = Math.cos(angle) * radius;
        p[1] = Math.sin(angle) * radius;
        p[2] = (r3 - 0.5) * 0.3;
        out.color = 'driver';
        out.size = 7;
        out.alpha = 1;
      } else {
        const ring = Math.floor(r1 * 3);
        const radius = [1.05, 1.8, 2.55][ring]!;
        const direction = ring % 2 === 0 ? 1 : -1;
        const angle = r2 * Math.PI * 2 + time * 0.18 * direction / (ring + 1);
        p[0] = Math.cos(angle) * radius;
        p[1] = Math.sin(angle) * radius;
        p[2] = (r3 - 0.5) * 0.25;
        out.color = ring === 0 ? 'match' : ring === 1 ? 'passenger' : 'node';
        out.size = ring === 0 ? 5.5 : 4.5;
        out.alpha = ring === 2 ? 0.55 : 0.85;
      }
      break;
    }
    case 'safety': {
      const focus = -3.2 + fract(time * 0.06) * 6.4;
      if (share < 0.55) {
        const x = lerp(-4.6, 4.6, r1);
        p[0] = x;
        p[1] = Math.sin(x * 0.75) * 0.7 + (r2 - 0.5) * 0.08;
        p[2] = (r3 - 0.5) * 0.12;
        const behind = x < focus;
        out.color = behind ? 'driver' : 'route';
        out.size = 4.5;
        out.alpha = behind ? 0.95 : 0.45;
      } else {
        const theta = r1 * Math.PI * 2;
        const phi = Math.acos(2 * r2 - 1);
        const radius = 1.25 + Math.sin(time * 1.4 + r3 * 6) * 0.03;
        p[0] = focus + Math.sin(phi) * Math.cos(theta) * radius;
        p[1] = Math.sin(focus * 0.75) * 0.7 + Math.cos(phi) * radius;
        p[2] = Math.sin(phi) * Math.sin(theta) * radius;
        out.color = 'shield';
        out.size = 3.8;
        out.alpha = 0.3 + 0.5 * Math.abs(Math.sin(phi));
      }
      break;
    }
    case 'realtime': {
      const lane = Math.floor(r1 * 5);
      const speed = [0.05, 0.08, 0.035, 0.065, 0.045][lane]!;
      const direction = lane % 2 === 0 ? 1 : -1;
      const u = fract(r2 + time * speed * direction);
      p[0] = lerp(-4.8, 4.8, u);
      p[1] = (lane - 2) * 0.8 + (r3 - 0.5) * 0.06;
      p[2] = (lane - 2) * -0.35;
      out.color = lane % 2 === 0 ? 'driver' : 'passenger';
      out.size = 4.8;
      out.alpha = 0.35 + 0.65 * Math.sin(u * Math.PI);
      break;
    }
    case 'fraud': {
      if (share < 0.9) {
        const theta = r1 * Math.PI * 2;
        const phi = Math.acos(2 * r2 - 1);
        const radius = Math.cbrt(r3) * 1.9;
        p[0] = -0.9 + Math.sin(phi) * Math.cos(theta) * radius * 1.2;
        p[1] = Math.cos(phi) * radius * 0.9;
        p[2] = Math.sin(phi) * Math.sin(theta) * radius;
        out.color = 'node';
        out.size = 4.2;
        out.alpha = 0.65;
      } else if (share < 0.94) {
        const angle = r1 * Math.PI * 2;
        p[0] = 2.9 + Math.cos(angle) * r2 * 0.22;
        p[1] = 1.0 + Math.sin(angle) * r2 * 0.22;
        p[2] = 0;
        out.color = 'alert';
        out.size = 6.5;
        out.alpha = 1;
      } else {
        const angle = r1 * Math.PI * 2 + time * 0.4;
        p[0] = 2.9 + Math.cos(angle) * 0.72;
        p[1] = 1.0 + Math.sin(angle) * 0.72;
        p[2] = 0;
        out.color = 'shield';
        out.size = 4.2;
        out.alpha = 0.9;
      }
      break;
    }
  }
  return out;
}

export const formationCount = { high: 1400, low: 600 } as const;
