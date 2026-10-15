'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NewTowerProps {
  progress: number;      // 0 to 1 (controls height & floors completed)
  windowGlow: number;    // 0 to 1 (lights turning on in final steps)
  opacity: number;       // overall opacity
}

export function NewTower({ progress, windowGlow, opacity }: NewTowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const totalFloors = 16;
  const currentFloors = Math.max(1, Math.floor(progress * totalFloors));

  // Materials
  const materials = useMemo(() => {
    return {
      facade: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 1,
      }),
      concretePillars: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: '#d4a237',
        roughness: 0.25,
        metalness: 0.85,
        emissive: '#d4a237',
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 1,
      }),
      tintedGlass: new THREE.MeshPhysicalMaterial({
        color: '#0f172a',
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.3,
        transparent: true,
        opacity: 0.85,
      }),
      glowingWindow: new THREE.MeshStandardMaterial({
        color: '#ffe8a3',
        emissive: '#ffd15c',
        emissiveIntensity: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 1,
      }),
      balconyGlass: new THREE.MeshPhysicalMaterial({
        color: '#38bdf8',
        transmission: 0.8,
        roughness: 0.05,
        transparent: true,
        opacity: 0.7,
      }),
    };
  }, []);

  useFrame(() => {
    // Dynamic glow transition
    materials.glowingWindow.emissiveIntensity = THREE.MathUtils.lerp(
      0.05,
      1.8,
      windowGlow
    );
    // Overall opacity lerp
    materials.facade.opacity = opacity;
    materials.concretePillars.opacity = opacity;
    materials.goldAccent.opacity = opacity;
    materials.tintedGlass.opacity = opacity * 0.85;
    materials.glowingWindow.opacity = opacity;
    materials.balconyGlass.opacity = opacity * 0.7;

    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.01 && progress > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Grand Entrance Podium Lobby (Floors 1-2) */}
      <mesh position={[0, 1.5, 0]} material={materials.tintedGlass}>
        <boxGeometry args={[8.4, 3, 6.4]} />
      </mesh>
      {/* Podium Pillars & Canopy */}
      <mesh position={[0, 3.1, 0.4]} material={materials.goldAccent}>
        <boxGeometry args={[9.2, 0.2, 7.2]} />
      </mesh>
      <mesh position={[-4.2, 1.5, 3.4]} material={materials.concretePillars}>
        <boxGeometry args={[0.4, 3, 0.4]} />
      </mesh>
      <mesh position={[4.2, 1.5, 3.4]} material={materials.concretePillars}>
        <boxGeometry args={[0.4, 3, 0.4]} />
      </mesh>

      {/* Main Tower Core and Rising Floors */}
      {Array.from({ length: currentFloors }).map((_, i) => {
        const floorY = 3.2 + i * 1.25 + 0.625;
        const isLit = (i % 2 === 0 || i % 3 === 0) && windowGlow > 0.1;
        const windowMaterial = isLit ? materials.glowingWindow : materials.tintedGlass;

        return (
          <group key={i} position={[0, floorY, 0]}>
            {/* Floor Slab */}
            <mesh position={[0, -0.55, 0]} material={materials.concretePillars}>
              <boxGeometry args={[7.8, 0.15, 5.8]} />
            </mesh>

            {/* Central Tower Mass */}
            <mesh position={[0, 0, 0]} material={materials.facade}>
              <boxGeometry args={[7.2, 1.1, 5.2]} />
            </mesh>

            {/* Glass Windows Front & Back */}
            <mesh position={[0, 0, 2.62]} material={windowMaterial}>
              <boxGeometry args={[6.4, 0.9, 0.05]} />
            </mesh>
            <mesh position={[0, 0, -2.62]} material={windowMaterial}>
              <boxGeometry args={[6.4, 0.9, 0.05]} />
            </mesh>

            {/* Architectural Gold Vertical Fins */}
            <mesh position={[-3.3, 0, 2.7]} material={materials.goldAccent}>
              <boxGeometry args={[0.1, 1.25, 0.25]} />
            </mesh>
            <mesh position={[3.3, 0, 2.7]} material={materials.goldAccent}>
              <boxGeometry args={[0.1, 1.25, 0.25]} />
            </mesh>
            <mesh position={[-1.1, 0, 2.7]} material={materials.goldAccent}>
              <boxGeometry args={[0.08, 1.25, 0.2]} />
            </mesh>
            <mesh position={[1.1, 0, 2.7]} material={materials.goldAccent}>
              <boxGeometry args={[0.08, 1.25, 0.2]} />
            </mesh>

            {/* Modern Glass Balconies on alternating patterns */}
            {i % 2 === 0 && (
              <group position={[0, -0.2, 3.1]}>
                <mesh position={[0, -0.3, 0]} material={materials.concretePillars}>
                  <boxGeometry args={[4.2, 0.1, 0.9]} />
                </mesh>
                <mesh position={[0, 0.15, 0.42]} material={materials.balconyGlass}>
                  <boxGeometry args={[4.2, 0.8, 0.04]} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* Rooftop Crown & Sky Lounge (Appears when >= 14 floors completed) */}
      {currentFloors >= 14 && (
        <group position={[0, 3.2 + currentFloors * 1.25, 0]}>
          {/* Sky Deck Pergola */}
          <mesh position={[0, 0.6, 0]} material={materials.goldAccent}>
            <boxGeometry args={[8.0, 0.2, 6.0]} />
          </mesh>
          <mesh position={[-3.6, 0.3, -2.6]} material={materials.concretePillars}>
            <cylinderGeometry args={[0.12, 0.12, 0.6]} />
          </mesh>
          <mesh position={[3.6, 0.3, -2.6]} material={materials.concretePillars}>
            <cylinderGeometry args={[0.12, 0.12, 0.6]} />
          </mesh>
          <mesh position={[-3.6, 0.3, 2.6]} material={materials.concretePillars}>
            <cylinderGeometry args={[0.12, 0.12, 0.6]} />
          </mesh>
          <mesh position={[3.6, 0.3, 2.6]} material={materials.concretePillars}>
            <cylinderGeometry args={[0.12, 0.12, 0.6]} />
          </mesh>
          {/* Illuminated Architectural Spire */}
          <mesh position={[0, 2.0, 0]} material={materials.goldAccent}>
            <coneGeometry args={[0.4, 3.0, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
