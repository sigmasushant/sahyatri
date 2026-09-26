'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, Points } from 'three';
import { DotField } from '../primitives/DotField';
import { PulseRing } from '../primitives/PulseRing';
import { RouteRibbon } from '../primitives/RouteRibbon';
import { SceneLabel } from '../primitives/SceneLabel';
import { Vehicle } from '../primitives/Vehicle';
import { createPointsBuffers, markPointsDirty } from '../lib/buffers';
import { SampledPath, catmullRom, clamp, easeInOutCubic, phase, quadraticArc, type Vec3 } from '../lib/geometry';
import { useDisposal, usePixelRatio, useSceneTime } from '../lib/hooks';
import { flatGround, podOutline, seatsCycle, seatsLayout, seatsTimeline as T } from '../lib/layouts';
import { createPointsMaterial, tokenColor } from '../lib/materials';
import type { BaseSceneProps, SeatsSceneProps } from '../types';

const RESET_AT = T.boardStart + T.boardEach * 3 + T.hold;

/**
 * For drivers: a car on its published route. Its empty seats pulse until nearby travellers
 * are matched into them, one by one, and the journey becomes shared.
 */
export default function SeatsScene({ tier, reducedMotion }: SeatsSceneProps & BaseSceneProps) {
  const high = tier === 'high';
  const pixelRatio = usePixelRatio();
  const colors = useMemo(
    () => ({
      driver: tokenColor('driver'),
      passenger: tokenColor('passenger'),
      node: tokenColor('node'),
      route: tokenColor('route'),
    }),
    [],
  );
  const outline = useMemo(() => podOutline(10), []);
  const route = useMemo(() => catmullRom(seatsLayout.route, 16), []);
  const arcs = useMemo(
    () =>
      seatsLayout.boarding.map(({ traveller, seat }) => {
        const from = seatsLayout.travellers[traveller]!;
        const to = seatsLayout.emptySeats[seat]!;
        return new SampledPath(quadraticArc([from[0], 0.05, from[2]], [to[0], 0.05, to[2]], 1.3, 40));
      }),
    [],
  );

  const seatCount = 1 + seatsLayout.emptySeats.length;
  const travellerCount = seatsLayout.travellers.length;

  // One points buffer: seats first, then travellers (core + halo each).
  const { group, buffers } = useMemo(() => {
    const buffers = createPointsBuffers((seatCount + travellerCount) * 2);
    const object = new Points(buffers.geometry, createPointsMaterial());
    object.frustumCulled = false;
    object.renderOrder = 4;
    return { group: object, buffers };
     
  }, [seatCount, travellerCount]);
  useDisposal(group);

  useEffect(() => {
    (group.material as ReturnType<typeof createPointsMaterial>).uniforms.uPixelRatio!.value = pixelRatio;
  }, [group, pixelRatio]);

  const time = useSceneTime(reducedMotion ? RESET_AT - 0.4 : undefined);
  // Mutable per-frame boxes shared with child components (stable for the scene's lifetime).
  const arcProgress = useMemo(() => arcs.map(() => ({ current: -1 })), [arcs]);
  const seatOpen = useMemo(() => seatsLayout.emptySeats.map(() => ({ current: 1 })), []);
  const [filled, setFilled] = useState(0);
  const filledRef = useRef(-1);
  const scratch = useMemo(() => new Color(), []);

  const writePoint = (index: number, [x, y, z]: Vec3, color: Color, size: number, alpha: number) => {
    buffers.position.setXYZ(index, x, y, z);
    buffers.color.setXYZ(index, color.r, color.g, color.b);
    buffers.size.setX(index, size);
    buffers.alpha.setX(index, alpha);
  }
  useFrame(() => {
    const t = time.current % seatsCycle;
    const reset = phase(t, RESET_AT, RESET_AT + T.reset);
    let boarded = 0;

    seatsLayout.boarding.forEach(({ traveller, seat }, k) => {
      const start = T.boardStart + k * T.boardEach;
      const flight = phase(t, start, start + 1.1);
      arcProgress[k]!.current = flight > 0 && flight < 1 ? easeInOutCubic(flight) : -1;
      const inSeat = flight >= 1 && reset < 1 ? 1 - reset : 0;
      if (flight >= 1 && reset < 0.5) boarded++;
      seatOpen[seat]!.current = 1 - inSeat;

      // Seat: an empty lime ring becomes a cyan traveller.
      const s = 1 + seat;
      const [sx, , sz] = seatsLayout.emptySeats[seat]!;
      scratch.copy(colors.driver).lerp(colors.passenger, inSeat);
      writePoint(s * 2, [sx, 0.06, sz], scratch, 11 + inSeat * 4, 0.45 + inSeat * 0.55);
      writePoint(s * 2 + 1, [sx, 0.06, sz], scratch, 42, 0.12 + inSeat * 0.2);

      // Traveller: waiting at their pickup until they board, returning on reset.
      const [tx, , tz] = seatsLayout.travellers[traveller]!;
      const away = clamp(flight * 1.4) * (1 - reset);
      const ti = (seatCount + traveller) * 2;
      writePoint(ti, [tx, 0.05, tz], colors.passenger, 12, 1 - away);
      writePoint(ti + 1, [tx, 0.05, tz], colors.passenger, 48, (1 - away) * 0.24);
    });

    // Driver seat and travellers who are not boarding this time.
    const [dx, , dz] = seatsLayout.driverSeat;
    writePoint(0, [dx, 0.06, dz], colors.node, 13, 1);
    writePoint(1, [dx, 0.06, dz], colors.driver, 44, 0.25);
    seatsLayout.travellers.forEach((position, index) => {
      if (seatsLayout.boarding.some((b) => b.traveller === index)) return;
      const ti = (seatCount + index) * 2;
      writePoint(ti, [position[0], 0.05, position[2]], colors.passenger, 11, 0.6);
      writePoint(ti + 1, [position[0], 0.05, position[2]], colors.passenger, 38, 0.14);
    });
    markPointsDirty(buffers, { color: true, size: true });

    if (boarded !== filledRef.current) {
      filledRef.current = boarded;
      setFilled(boarded);
    }
  });



  const open = seatsLayout.emptySeats.length - filled;

  return (
    <group>
      <DotField x={[-6, 10]} z={[-4.5, 4.5]} spacing={high ? 0.26 : 0.38} height={flatGround} center={[1, 0]} radius={6.5} />
      <RouteRibbon points={route} width={0.5} color={colors.driver} opacity={0.07} softness={1} animate={false} />
      <RouteRibbon
        points={route}
        width={0.07}
        color={colors.driver}
        opacity={0.9}
        pulse={reducedMotion ? 0 : 0.8}
        pulseSpeed={0.35}
        pulseCount={2}
        animate={!reducedMotion}
      />
      <RouteRibbon points={outline} width={0.34} color={colors.node} opacity={0.06} softness={1} animate={false} />
      <RouteRibbon points={outline} width={0.045} color={colors.node} opacity={0.75} animate={false} />
      {seatsLayout.emptySeats.map((seat, i) => (
        <PulseRing
          key={i}
          position={[seat[0], 0.03, seat[2]]}
          radius={0.42}
          color={colors.driver}
          speed={0.6}
          opacity={0.9}
          still={reducedMotion}
          intensity={seatOpen[i]}
        />
      ))}
      <primitive object={group} />
      {arcs.map((arc, k) => (
        <Vehicle key={k} path={arc} progress={arcProgress[k]!} color={colors.passenger} size={12} trail={14} trailSpacing={0.09} lift={0} />
      ))}
      <SceneLabel position={[3.3, 0.45, -0.75]} tone="accent">
        {open > 0 ? `${open} ${open === 1 ? 'seat' : 'seats'} open` : 'Car full · costs shared'}
      </SceneLabel>
    </group>
  );
}
