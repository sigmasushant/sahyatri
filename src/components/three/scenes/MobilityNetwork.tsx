'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import type { Mesh, ShaderMaterial } from 'three';
import { CityNodes } from '../primitives/CityNodes';
import { DotField } from '../primitives/DotField';
import { PulseRing } from '../primitives/PulseRing';
import { RouteNetwork } from '../primitives/RouteNetwork';
import { RouteParticles } from '../primitives/RouteParticles';
import { RouteRibbon } from '../primitives/RouteRibbon';
import { SceneLabel } from '../primitives/SceneLabel';
import { Vehicle } from '../primitives/Vehicle';
import type { LinePath } from '../lib/buffers';
import { SampledPath, easeInOutCubic, phase } from '../lib/geometry';
import { useSceneTime } from '../lib/hooks';
import {
  cityPoint,
  featuredRoutePath,
  heroCities,
  heroEdgePath,
  heroEdges,
  heroGround,
} from '../lib/layouts';
import { tokenColor } from '../lib/materials';
import type { BaseSceneProps, MobilitySceneProps } from '../types';

const TRIP = { start: 1.8, travel: 6, pause: 1.6 };

/**
 * Hero: a small curved world of cities and roads. Lime travellers are drivers with seats,
 * cyan are passengers; the labelled lime route is an example journey from Delhi to Jaipur.
 */
export default function MobilityNetwork({ tier, reducedMotion, variant = 'hero' }: MobilitySceneProps & BaseSceneProps) {
  const high = tier === 'high';
  const ambient = variant === 'ambient';
  const colors = useMemo(
    () => ({
      driver: tokenColor('driver'),
      passenger: tokenColor('passenger'),
      route: tokenColor('route'),
    }),
    [],
  );

  const edgePaths = useMemo(
    () => heroEdges(3).map(([a, b], i) => heroEdgePath(heroCities[a]!, heroCities[b]!, i + 1, high ? 24 : 14)),
    [high],
  );
  const lines = useMemo<LinePath[]>(
    () => edgePaths.map((points) => ({ points, color: colors.route, alpha: ambient ? 0.5 : 0.85 })),
    [edgePaths, colors, ambient],
  );
  const travelPaths = useMemo(() => edgePaths.map((points) => new SampledPath(points)), [edgePaths]);
  const featured = useMemo(() => featuredRoutePath(high ? 24 : 14), [high]);
  const featuredPath = useMemo(() => new SampledPath(featured), [featured]);
  const nodes = useMemo(() => heroCities.map((city) => ({ position: cityPoint(city), major: city.major })), []);
  const hotspots = useMemo(() => heroCities.map((city) => [city.x, city.z] as [number, number]), []);
  const delhi = heroCities.find((c) => c.id === 'delhi')!;
  const jaipur = heroCities.find((c) => c.id === 'jaipur')!;

  const time = useSceneTime(reducedMotion ? TRIP.start + TRIP.travel * 0.62 : undefined);
  const vehicleProgress = useRef(-1);
  const ribbons = useRef<Mesh[]>([]);
  const arrival = useRef(0);

  const collectRibbon = useCallback((mesh: Mesh) => {
    if (!ribbons.current.includes(mesh)) ribbons.current.push(mesh);
  }, []);

  useFrame(() => {
    const t = time.current;
    const reveal = ambient ? 1 : easeInOutCubic(phase(t, 0.3, 1.9));
    for (const mesh of ribbons.current) (mesh.material as ShaderMaterial).uniforms.uEnd!.value = reveal;

    const cycle = TRIP.travel + TRIP.pause;
    const local = (t - TRIP.start) % cycle;
    vehicleProgress.current = t < TRIP.start ? -1 : easeInOutCubic(Math.min(1, local / TRIP.travel));
    arrival.current = t < TRIP.start ? 0 : local > TRIP.travel ? 1 - (local - TRIP.travel) / TRIP.pause : 0;
  });

  return (
    // The ambient variant sits right of centre, behind the closing call to action.
    <group position={ambient ? [2.4, 0, 0.6] : [0, 0, 0]}>
      <DotField
        x={[-7, 12]}
        z={[-9, 5]}
        spacing={high ? 0.2 : 0.3}
        height={heroGround}
        center={[2.4, -1.2]}
        radius={9.5}
        hotspots={hotspots}
        opacity={ambient ? 0.7 : 1}
      />
      <RouteNetwork paths={lines} />
      <RouteRibbon
        points={featured}
        width={0.5}
        color={colors.driver}
        opacity={ambient ? 0.05 : 0.09}
        softness={1}
        onMesh={collectRibbon}
        animate={false}
      />
      <RouteRibbon
        points={featured}
        width={0.075}
        color={colors.driver}
        opacity={ambient ? 0.55 : 0.95}
        pulse={reducedMotion ? 0 : 0.8}
        pulseCount={2}
        pulseSpeed={0.25}
        onMesh={collectRibbon}
        animate={!reducedMotion}
      />
      <CityNodes nodes={nodes} />
      {!ambient ? (
        <>
          <PulseRing position={cityPoint(delhi, 0.01)} radius={0.9} color={colors.driver} opacity={0.6} still={reducedMotion} />
          <PulseRing
            position={cityPoint(jaipur, 0.01)}
            radius={1.1}
            color={colors.driver}
            opacity={0.9}
            core={0.25}
            still={reducedMotion}
            intensity={arrival}
          />
        </>
      ) : null}
      <RouteParticles
        paths={travelPaths}
        count={ambient ? (high ? 36 : 14) : high ? 72 : 26}
        driverColor={colors.driver}
        passengerColor={colors.passenger}
        passengerShare={0.32}
        speed={ambient ? [0.2, 0.45] : [0.35, 0.85]}
        trail={high ? 5 : 3}
        frozen={reducedMotion}
      />
      <Vehicle path={featuredPath} progress={vehicleProgress} color={colors.driver} size={high ? 18 : 15} />
      {!ambient ? (
        <>
          <SceneLabel position={cityPoint(delhi, 0.42)}>Delhi</SceneLabel>
          <SceneLabel position={cityPoint(jaipur, 0.42)} tone="accent">
            Jaipur
          </SceneLabel>
        </>
      ) : null}
    </group>
  );
}
