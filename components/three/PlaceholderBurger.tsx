"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { PartName } from "./burger-parts";

// Placeholder geometry. Every mesh here is named exactly as the modelling brief
// specifies, so a delivered GLB drops straight into the same rig.

const RADIUS = 1.15;

function bunProfile(height: number, dome: number) {
  const points: THREE.Vector2[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const radius = RADIUS * Math.sqrt(1 - t * t * 0.92);
    points.push(new THREE.Vector2(Math.max(radius, 0.02), t * height * dome));
  }
  return points;
}

function useWavyDisc(radius: number, height: number, waves: number, amp: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const steps = 220;
    for (let i = 0; i <= steps; i += 1) {
      const angle = (i / steps) * Math.PI * 2;
      const r = radius + Math.sin(angle * waves) * amp + Math.sin(angle * waves * 2.3) * amp * 0.4;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
      curveSegments: 64,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.center();
    return geometry;
  }, [radius, height, waves, amp]);
}

function Sesame() {
  const seeds = useMemo(() => {
    const items: { position: [number, number, number]; rotation: [number, number, number] }[] = [];
    for (let i = 0; i < 42; i += 1) {
      // Golden-angle spiral keeps the scatter even instead of clumpy.
      const t = i / 42;
      const angle = i * 2.399963;
      const r = Math.sqrt(t) * RADIUS * 0.82;
      const lift = Math.cos((r / RADIUS) * 1.35) * 0.3;
      items.push({
        position: [Math.cos(angle) * r, lift + 0.05, Math.sin(angle) * r],
        rotation: [Math.random() * 0.6, angle, Math.random() * 0.4],
      });
    }
    return items;
  }, []);

  return (
    <group>
      {seeds.map((seed, index) => (
        <mesh key={index} position={seed.position} rotation={seed.rotation} castShadow>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#f0dcae" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function PlaceholderPart({ name }: { name: PartName }) {
  const lettuce = useWavyDisc(RADIUS * 1.02, 0.07, 13, 0.1);
  const onions = useWavyDisc(RADIUS * 0.9, 0.05, 9, 0.07);

  switch (name) {
    case "top_bun":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <latheGeometry args={[bunProfile(0.46, 1), 64]} />
            <meshPhysicalMaterial
              color="#b06a26"
              roughness={0.42}
              clearcoat={0.6}
              clearcoatRoughness={0.35}
              sheen={0.4}
              sheenColor="#e8a95e"
            />
          </mesh>
          <Sesame />
        </group>
      );

    case "bottom_bun":
      return (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[RADIUS, RADIUS * 0.94, 0.3, 64]} />
          <meshPhysicalMaterial color="#a9631f" roughness={0.5} clearcoat={0.35} />
        </mesh>
      );

    case "lettuce":
      return (
        <mesh geometry={lettuce} castShadow receiveShadow>
          <meshStandardMaterial color="#5f9e2a" roughness={0.42} side={THREE.DoubleSide} />
        </mesh>
      );

    case "onions":
      return (
        <mesh geometry={onions} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#7a4415"
            roughness={0.3}
            clearcoat={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      );

    case "tomato":
      return (
        <group>
          {[-0.5, 0.5].map((offset) => (
            <mesh key={offset} position={[offset * 0.62, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.56, 0.56, 0.14, 48]} />
              <meshPhysicalMaterial
                color="#c02318"
                roughness={0.28}
                clearcoat={0.8}
                clearcoatRoughness={0.25}
              />
            </mesh>
          ))}
        </group>
      );

    case "pickles":
      return (
        <group>
          {[-0.62, 0, 0.62].map((offset) => (
            <mesh key={offset} position={[offset, 0, offset === 0 ? 0.1 : -0.05]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.09, 32]} />
              <meshPhysicalMaterial color="#5d7a1e" roughness={0.3} clearcoat={0.7} />
            </mesh>
          ))}
        </group>
      );

    case "cheese":
      return (
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.62, 0.06, 1.62]} />
          <meshPhysicalMaterial color="#e8a017" roughness={0.34} clearcoat={0.55} />
        </mesh>
      );

    case "patty":
      return (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[RADIUS * 0.98, RADIUS * 0.93, 0.36, 64]} />
          <meshStandardMaterial color="#4a2412" roughness={0.82} />
        </mesh>
      );

    case "sauce":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[RADIUS * 0.86, RADIUS * 0.8, 0.08, 48]} />
          <meshPhysicalMaterial color="#d98b3c" roughness={0.22} clearcoat={0.9} />
        </mesh>
      );

    default:
      return null;
  }
}
