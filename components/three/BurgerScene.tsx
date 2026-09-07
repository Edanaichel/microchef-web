"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GAP, SPREAD, parts } from "./burger-parts";
import { PlaceholderPart } from "./PlaceholderBurger";

/**
 * Swapping in a real model:
 *   const { nodes } = useGLTF("/models/burger.glb");
 * then render <primitive object={nodes[part.mesh]} /> in place of
 * <PlaceholderPart />. Positions, scroll timing and copy all stay as they are,
 * because the rig is driven by the mesh names in the modelling brief.
 */

type Progress = { current: number; target: number };

function Stack({ progress }: { progress: React.RefObject<Progress> }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    const state = progress.current;
    if (!state || !group.current) return;

    // Ease toward the scroll target so the motion keeps weight.
    const ease = 1 - Math.pow(0.0015, delta);
    state.current += (state.target - state.current) * ease;
    const t = state.current;

    // How far each layer has lifted, one chapter at a time.
    const reveal = parts.map((_, index) => {
      const raw = THREE.MathUtils.clamp(t * parts.length - index, 0, 1);
      return raw * raw * (3 - 2 * raw);
    });

    // Whatever has not lifted yet stays a closed burger, centred on the origin.
    let remaining = 0;
    parts.forEach((part, index) => {
      remaining += (1 - reveal[index]) * (part.thickness + GAP);
    });

    let cursor = remaining / 2;
    const stacked = parts.map((part, index) => {
      const weight = 1 - reveal[index];
      const centre = cursor - (part.thickness * weight) / 2;
      cursor -= (part.thickness + GAP) * weight;
      return centre;
    });

    // Layers only ever rise off the top of the remaining stack, so a separated
    // layer can never land inside one that has not moved yet.
    const ranks: number[] = [];
    let above = 0;
    for (let index = parts.length - 1; index >= 0; index -= 1) {
      above += reveal[index];
      ranks[index] = above;
    }

    let lowest = Infinity;
    let highest = -Infinity;

    const targets = parts.map((part, index) => {
      const floating = remaining / 2 + ranks[index] * SPREAD;
      const y = THREE.MathUtils.lerp(stacked[index], floating, reveal[index]);
      lowest = Math.min(lowest, y - part.thickness / 2);
      highest = Math.max(highest, y + part.thickness / 2);
      return y;
    });

    layers.current.forEach((layer, index) => {
      if (!layer) return;
      layer.position.y = targets[index];
      layer.position.x = Math.sin(index * 1.7) * 0.07 * reveal[index];
      layer.rotation.y = reveal[index] * (index % 2 === 0 ? 0.16 : -0.13);
    });

    // Recentre the whole composition, then frame it.
    const height = highest - lowest;
    group.current.position.y += (-(highest + lowest) / 2 - group.current.position.y) * 0.1;

    const vertical = height / 2 / Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360);
    const horizontal = 1.5 / Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360);
    const distance = Math.max(vertical * 1.12, horizontal, 3);

    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.35 - camera.position.y) * 0.05;
    camera.position.z += (distance - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);

    group.current.rotation.y += (pointer.x * 0.22 - group.current.rotation.y) * 0.05;
  });

  return (
    <group ref={group}>
      {parts.map((part, index) => (
        <group
          key={part.mesh}
          name={part.mesh}
          ref={(node) => {
            layers.current[index] = node;
          }}
        >
          <PlaceholderPart name={part.mesh} />
        </group>
      ))}
    </group>
  );
}

function Studio() {
  return (
    <>
      <color attach="background" args={["#070806"]} />
      <fog attach="fog" args={["#070806", 9, 22]} />

      <ambientLight intensity={0.35} />
      {/* Warm key from upper left, the way food is lit on a table. */}
      <spotLight
        position={[-6, 8, 5]}
        angle={0.55}
        penumbra={0.9}
        intensity={220}
        color="#ffd9a8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      {/* Cool rim from behind to lift the layers off the black. */}
      <spotLight
        position={[7, 3, -6]}
        angle={0.7}
        penumbra={1}
        intensity={140}
        color="#9fd8ff"
      />
      <pointLight position={[3, -3, 4]} intensity={22} color="#ff9a4d" />

      <ContactShadows
        position={[0, -5.2, 0]}
        opacity={0.45}
        scale={18}
        blur={3.4}
        far={10}
        color="#000000"
      />
    </>
  );
}

export default function BurgerScene() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<Progress>({ current: 0, target: 0 });
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: () => `+=${window.innerHeight * (parts.length + 1)}`,
      pin: ".three-sticky",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current.target = self.progress;
        const index = Math.min(
          parts.length - 1,
          Math.floor(self.progress * parts.length),
        );
        setChapter(index);
      },
    });

    return () => trigger.kill();
  }, []);

  const active = parts[chapter];

  return (
    <section ref={root} className="three-scroll">
      <div className="three-sticky">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.1, 3], fov: 34 }}
          gl={{ antialias: true }}
        >
          <Studio />
          <Stack progress={progress} />
        </Canvas>

        <div className="three-copy">
          <p className="three-kicker">
            {active.kicker} — {active.label}
          </p>
          <h2>{active.title}</h2>
          <p className="three-body">{active.body}</p>
          <span className="three-count">
            {String(chapter + 1).padStart(2, "0")} / {String(parts.length).padStart(2, "0")}
          </span>
        </div>

        <div className="three-rail" aria-hidden="true">
          {parts.map((part, index) => (
            <i key={part.mesh} className={index <= chapter ? "on" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
