'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConstructionRigProps {
  active: boolean;
  towerHeight: number; // dynamic height matching current floor
}

export function ConstructionRig({ active, towerHeight }: ConstructionRigProps) {
  const jibRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Mesh>(null);

  const materials = useMemo(() => {
    return {
      craneYellow: new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        roughness: 0.4,
        metalness: 0.7,
      }),
      craneDark: new THREE.MeshStandardMaterial({
        color: '#27272a',
        roughness: 0.6,
        metalness: 0.5,
      }),
      cable: new THREE.MeshBasicMaterial({
        color: '#a1a1aa',
      }),
      safetyNet: new THREE.MeshStandardMaterial({
        color: '#15803d',
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      }),
    };
  }, []);

  useFrame((state) => {
    if (!active) return;

    // Crane jib slow sweeping rotation
    if (jibRef.current) {
      jibRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.8 + 0.3;
    }

    // Hook slight bobbing
    if (hookRef.current) {
      hookRef.current.position.y =
        -3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.8;
    }
  });

  if (!active) return null;

  const craneMastHeight = Math.max(12, towerHeight + 6);

  return (
    <group position={[5.5, 0, -4]}>
      {/* Vertical Crane Mast */}
      <mesh
        position={[0, craneMastHeight / 2, 0]}
        material={materials.craneYellow}
      >
        <boxGeometry args={[0.8, craneMastHeight, 0.8]} />
      </mesh>

      {/* Operator Cab & Rotating Jib */}
      <group ref={jibRef} position={[0, craneMastHeight - 0.5, 0]}>
        {/* Cab */}
        <mesh position={[0.5, 0, 0]} material={materials.craneDark}>
          <boxGeometry args={[0.9, 1.0, 0.9]} />
        </mesh>

        {/* Counter-jib & ballast weights */}
        <mesh position={[-3, 0.3, 0]} material={materials.craneDark}>
          <boxGeometry args={[4.5, 0.5, 0.5]} />
        </mesh>
        <mesh position={[-4.5, 0, 0]} material={materials.craneDark}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
        </mesh>

        {/* Forward Working Jib */}
        <mesh position={[6, 0.3, 0]} material={materials.craneYellow}>
          <boxGeometry args={[12, 0.4, 0.4]} />
        </mesh>

        {/* Cable & Hoist Hook */}
        <group position={[8, 0, 0]}>
          <mesh position={[0, -1.8, 0]} material={materials.cable}>
            <cylinderGeometry args={[0.02, 0.02, 3.6]} />
          </mesh>
          <mesh ref={hookRef} position={[0, -3.6, 0]} material={materials.craneYellow}>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
          </mesh>
        </group>
      </group>

      {/* Scaffolding wraps */}
      <mesh
        position={[-5.5, towerHeight / 2, 4]}
        material={materials.safetyNet}
      >
        <boxGeometry args={[8.8, towerHeight, 6.8]} />
      </mesh>
    </group>
  );
}
