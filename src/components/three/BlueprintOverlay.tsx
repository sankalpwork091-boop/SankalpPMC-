'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlueprintOverlayProps {
  active: boolean;
  scanProgress: number; // 0 to 1
  mode?: 'blueprint' | 'scan' | 'shield';
}

export function BlueprintOverlay({
  active,
  scanProgress,
  mode = 'blueprint',
}: BlueprintOverlayProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scanPlaneRef = useRef<THREE.Mesh>(null);
  const shieldRingRef = useRef<THREE.Mesh>(null);

  const materials = useMemo(() => {
    return {
      wireframe: new THREE.MeshBasicMaterial({
        color: mode === 'shield' ? '#d4a237' : '#38bdf8',
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      }),
      scanPlane: new THREE.MeshBasicMaterial({
        color: '#06b6d4',
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      }),
      shieldRing: new THREE.MeshBasicMaterial({
        color: '#d4a237',
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, [mode]);

  useFrame((state) => {
    if (!active) return;

    // Laser scanning plane moving up and down
    if (scanPlaneRef.current) {
      const scanY = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 6;
      scanPlaneRef.current.position.y = scanY;
    }

    // Shield ring slow rotation
    if (shieldRingRef.current) {
      shieldRingRef.current.rotation.y += 0.01;
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Wireframe Outline of Proposed Tower */}
      <mesh position={[0, 10, 0]} material={materials.wireframe}>
        <boxGeometry args={[8.0, 20.0, 6.0]} />
      </mesh>

      {/* Internal Floor Blueprint Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 2 + i * 2.2, 0]} material={materials.wireframe}>
          <boxGeometry args={[7.8, 0.05, 5.8]} />
        </mesh>
      ))}

      {/* Scanning Laser Plane for Legal & Feasibility Verification */}
      <mesh
        ref={scanPlaneRef}
        position={[0, 5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.scanPlane}
      >
        <planeGeometry args={[12, 10]} />
      </mesh>

      {/* 79A Compliance & Legal Safeguard Shield Perimeter */}
      {mode === 'shield' && (
        <mesh
          ref={shieldRingRef}
          position={[0, 8, 0]}
          material={materials.shieldRing}
        >
          <cylinderGeometry args={[7.5, 7.5, 16, 24, 4, true]} />
        </mesh>
      )}
    </group>
  );
}
