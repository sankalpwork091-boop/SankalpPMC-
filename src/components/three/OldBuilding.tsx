'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OldBuildingProps {
  opacity: number;
}

export function OldBuilding({ opacity }: OldBuildingProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const materials = useMemo(() => {
    return {
      concrete: new THREE.MeshStandardMaterial({
        color: '#6e737a',
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      }),
      weatheredStucco: new THREE.MeshStandardMaterial({
        color: '#8b8378',
        roughness: 0.95,
        metalness: 0.05,
        transparent: true,
        opacity: 1,
      }),
      darkWindow: new THREE.MeshStandardMaterial({
        color: '#1a222d',
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 1,
      }),
      waterTank: new THREE.MeshStandardMaterial({
        color: '#1c2833',
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 1,
      }),
      railing: new THREE.MeshStandardMaterial({
        color: '#474a51',
        roughness: 0.6,
        metalness: 0.5,
        transparent: true,
        opacity: 1,
      }),
    };
  }, []);

  useFrame(() => {
    // Dynamically update opacity across all child materials
    Object.values(materials).forEach((mat) => {
      mat.opacity = opacity;
    });
    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.01;
    }
  });

  // 4 floors of old housing society building
  const floors = [0, 1, 2, 3];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Building Body */}
      <mesh position={[0, 4, 0]} material={materials.weatheredStucco} castShadow receiveShadow>
        <boxGeometry args={[7, 8, 5]} />
      </mesh>

      {/* Weathered Plinth / Base */}
      <mesh position={[0, 0.25, 0]} material={materials.concrete} receiveShadow>
        <boxGeometry args={[7.6, 0.5, 5.6]} />
      </mesh>

      {/* Roof Parapet & Water Tank */}
      <mesh position={[0, 8.2, 0]} material={materials.concrete}>
        <boxGeometry args={[7.2, 0.4, 5.2]} />
      </mesh>
      {/* Overhead water tanks (standard Indian co-op society style) */}
      <mesh position={[-2, 9, -1]} material={materials.waterTank}>
        <cylinderGeometry args={[0.7, 0.7, 1.2, 16]} />
      </mesh>
      <mesh position={[-0.4, 9, -1]} material={materials.waterTank}>
        <cylinderGeometry args={[0.7, 0.7, 1.2, 16]} />
      </mesh>
      <mesh position={[1.8, 9.2, -0.8]} material={materials.concrete}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
      </mesh>

      {/* Balconies & Windows per floor */}
      {floors.map((floor) => {
        const y = 1.6 + floor * 1.9;
        return (
          <group key={floor} position={[0, y, 0]}>
            {/* Front Balconies (projected concrete slab + grill) */}
            <mesh position={[-1.8, 0, 2.7]} material={materials.concrete}>
              <boxGeometry args={[2.4, 0.15, 0.8]} />
            </mesh>
            <mesh position={[-1.8, 0.45, 3.05]} material={materials.railing}>
              <boxGeometry args={[2.3, 0.75, 0.05]} />
            </mesh>

            <mesh position={[1.8, 0, 2.7]} material={materials.concrete}>
              <boxGeometry args={[2.4, 0.15, 0.8]} />
            </mesh>
            <mesh position={[1.8, 0.45, 3.05]} material={materials.railing}>
              <boxGeometry args={[2.3, 0.75, 0.05]} />
            </mesh>

            {/* Window glass cutouts */}
            <mesh position={[-1.8, 0.7, 2.52]} material={materials.darkWindow}>
              <boxGeometry args={[2.0, 1.0, 0.04]} />
            </mesh>
            <mesh position={[1.8, 0.7, 2.52]} material={materials.darkWindow}>
              <boxGeometry args={[2.0, 1.0, 0.04]} />
            </mesh>
            <mesh position={[0, 0.6, 2.52]} material={materials.darkWindow}>
              <boxGeometry args={[0.8, 1.2, 0.04]} />
            </mesh>

            {/* Back Windows */}
            <mesh position={[-1.8, 0.7, -2.52]} material={materials.darkWindow}>
              <boxGeometry args={[1.8, 1.0, 0.04]} />
            </mesh>
            <mesh position={[1.8, 0.7, -2.52]} material={materials.darkWindow}>
              <boxGeometry args={[1.8, 1.0, 0.04]} />
            </mesh>
          </group>
        );
      })}

      {/* External Staircase Tower */}
      <mesh position={[0, 4.5, 2.65]} material={materials.concrete}>
        <boxGeometry args={[1.4, 9, 0.5]} />
      </mesh>
    </group>
  );
}
