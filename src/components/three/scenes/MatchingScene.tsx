'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Mesh, ShaderMaterial } from 'three';
import { CityNodes } from '../primitives/CityNodes';
import { DotField } from '../primitives/DotField';
import { PulseRing } from '../primitives/PulseRing';
import { RouteRibbon } from '../primitives/RouteRibbon';
import { SceneLabel } from '../primitives/SceneLabel';
import { Vehicle } from '../primitives/Vehicle';
import { updateRibbonGeometry } from '../lib/buffers';
import { easeInOutCubic, lerpVec3, phase, type Vec3 } from '../lib/geometry';
import { useSceneTime } from '../lib/hooks';
import {
  flatGround,
  matchingLayout,
  matchingPhaseAt,
  matchingPlaces,
  matchingTimeline as T,
  type MatchingPhase,
} from '../lib/layouts';
import { tokenColor } from '../lib/materials';
import type { BaseSceneProps, MatchingSceneProps } from '../types';

const uniforms = (mesh: Mesh | undefined) => (mesh?.material as ShaderMaterial | undefined)?.uniforms;

const FROZEN_AT = T.matched + T.tripDuration * 0.42;
const PASSENGER_WIDTH = 0.065;

/**
 * AI matching, told in four beats: a passenger searches, candidate driver routes are
 * evaluated one by one, the best fit is selected, and the passenger's journey merges into it.
 */
export default function MatchingScene({ tier, reducedMotion, runId = 0, onPhaseChange }: MatchingSceneProps & BaseSceneProps) {
  const high = tier === 'high';
  const layout = useMemo(() => matchingLayout(140), []);
  const colors = useMemo(
    () => ({
      driver: tokenColor('driver'),
      passenger: tokenColor('passenger'),
      route: tokenColor('route'),
      match: tokenColor('match'),
      node: tokenColor('node'),
    }),
    [],
  );
  const candidatePoints = useMemo(() => layout.candidates.map((path) => path.points), [layout]);
  const passengerStart = useMemo(() => layout.passenger.points.map((p) => p.slice() as Vec3), [layout]);
  const morphed = useMemo(() => layout.passenger.points.map((p) => p.slice() as Vec3), [layout]);
  const nodes = useMemo(
    () => [
      { position: matchingPlaces.delhi, major: true },
      { position: matchingPlaces.gurgaon, major: true },
      { position: matchingPlaces.jaipur, major: true },
      ...layout.candidates.flatMap((path) => [
        { position: path.points[0]! },
        { position: path.points[path.points.length - 1]! },
      ]),
    ],
    [layout],
  );

  const time = useSceneTime(reducedMotion ? FROZEN_AT : undefined);
  const [currentPhase, setCurrentPhase] = useState<MatchingPhase>(reducedMotion ? 'matched' : 'searching');
  const phaseRef = useRef<MatchingPhase | null>(null);
  const candidates = useRef<Mesh[]>([]);
  const driver = useRef<Mesh[]>([]);
  const passenger = useRef<Mesh>(undefined);
  const lastMorph = useRef(-1);
  const pickupIntensity = useRef(0);
  const driverProgress = useRef(-1);
  const passengerProgress = useRef(-1);

  useEffect(() => {
    if (!reducedMotion) time.current = 0;
    phaseRef.current = null;
  }, [runId, reducedMotion, time]);

  const addCandidate = useCallback((mesh: Mesh) => {
    if (!candidates.current.includes(mesh)) candidates.current.push(mesh);
  }, []);
  const addDriver = useCallback((mesh: Mesh) => {
    if (!driver.current.includes(mesh)) driver.current.push(mesh);
  }, []);
  const setPassenger = useCallback((mesh: Mesh) => {
    passenger.current = mesh;
  }, []);

  useFrame(() => {
    const t = time.current;

    const nextPhase = matchingPhaseAt(t);
    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase;
      setCurrentPhase(nextPhase);
      onPhaseChange?.(nextPhase);
    }

    // Candidates draw on, are evaluated in turn, then step back once a match is selected.
    candidates.current.forEach((mesh, k) => {
      const u = uniforms(mesh);
      if (!u) return;
      u.uEnd!.value = easeInOutCubic(phase(t, 0.1 + k * 0.12, 1.0 + k * 0.12));
      const start = T.scanStart + k * 0.65;
      const scan = t >= start && t < start + 0.65 ? Math.sin(((t - start) / 0.65) * Math.PI) : 0;
      const dim = phase(t, T.selectStart, T.mergeStart);
      u.uOpacity!.value = (0.16 + scan * 0.7) * (1 - dim * 0.7);
    });

    // The selected driver route draws on in lime.
    const selected = easeInOutCubic(phase(t, T.selectStart, T.mergeStart));
    for (const mesh of driver.current) uniforms(mesh)!.uEnd!.value = selected;

    // The passenger route draws on first, then merges into the driver route.
    const passengerUniforms = uniforms(passenger.current);
    if (passengerUniforms) passengerUniforms.uEnd!.value = easeInOutCubic(phase(t, 0.15, 1.1));
    const merge = easeInOutCubic(phase(t, T.mergeStart, T.matched - 0.2));
    if (passenger.current && Math.abs(merge - lastMorph.current) > 0.0005) {
      lastMorph.current = merge;
      passengerStart.forEach((start, i) => lerpVec3(start, layout.merged.points[i]!, merge, morphed[i]));
      updateRibbonGeometry(passenger.current.geometry, morphed, PASSENGER_WIDTH);
    }
    pickupIntensity.current = phase(t, T.mergeStart + 0.6, T.matched);

    // Matched: the driver sets off, picks the passenger up and they travel on together.
    if (t >= T.matched) {
      const local = (t - T.matched) % (T.tripDuration + 1.4);
      const p = easeInOutCubic(Math.min(1, local / T.tripDuration));
      driverProgress.current = p;
      passengerProgress.current = p >= layout.pickupT ? p : -1;
    } else {
      driverProgress.current = -1;
      passengerProgress.current = -1;
    }
  });

  const matched = currentPhase === 'matched';

  return (
    <group>
      <DotField x={[-6.5, 6.5]} z={[-4.5, 4.5]} spacing={high ? 0.24 : 0.34} height={flatGround} center={[0, 0.3]} radius={6.8} />
      {candidatePoints.map((points, k) => (
        <RouteRibbon key={k} points={points} width={0.05} color={colors.node} opacity={0.16} onMesh={addCandidate} animate={false} />
      ))}
      <RouteRibbon points={layout.driver.points} width={0.55} color={colors.driver} opacity={0.08} softness={1} onMesh={addDriver} animate={false} />
      <RouteRibbon
        points={layout.driver.points}
        width={0.075}
        color={colors.driver}
        opacity={1}
        pulse={reducedMotion ? 0 : 0.7}
        pulseSpeed={0.3}
        head={0.8}
        onMesh={addDriver}
        animate={!reducedMotion}
      />
      <RouteRibbon
        points={passengerStart}
        width={PASSENGER_WIDTH}
        color={colors.passenger}
        opacity={0.95}
        onMesh={setPassenger}
        animate={false}
        renderOrder={2}
      />
      <CityNodes nodes={nodes} size={6} />
      <PulseRing position={[layout.pickup[0], 0.02, layout.pickup[2]]} radius={0.85} color={colors.match} opacity={0.9} core={0.35} still={reducedMotion} intensity={pickupIntensity} />
      <PulseRing position={[matchingPlaces.gurgaon[0], 0.01, matchingPlaces.gurgaon[2]]} radius={0.6} color={colors.passenger} opacity={0.45} still={reducedMotion} />
      <Vehicle path={layout.driver} progress={driverProgress} color={colors.driver} size={high ? 17 : 14} />
      <Vehicle path={layout.driver} progress={passengerProgress} color={colors.passenger} size={high ? 11 : 9} trail={4} lift={0.12} />
      <SceneLabel position={[matchingPlaces.delhi[0], 0.4, matchingPlaces.delhi[2]]}>Delhi</SceneLabel>
      <SceneLabel position={[matchingPlaces.gurgaon[0] - 0.2, 0.4, matchingPlaces.gurgaon[2] + 0.2]} tone="info">
        Gurgaon
      </SceneLabel>
      <SceneLabel position={[matchingPlaces.jaipur[0], 0.4, matchingPlaces.jaipur[2]]} tone="accent">
        Jaipur
      </SceneLabel>
      {matched ? (
        <SceneLabel position={[layout.pickup[0] + 0.25, 0.55, layout.pickup[2] - 0.15]} tone="accent">
          Pickup · matched
        </SceneLabel>
      ) : null}
    </group>
  );
}
