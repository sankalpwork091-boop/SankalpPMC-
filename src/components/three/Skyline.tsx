'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function Skyline() {
  const count = 48;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { dummy, color } = useMemo(() => {
    return {
      dummy: new THREE.Object3D(),
      color: new THREE.Color(),
    };
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#131d2e',
      roughness: 0.8,
      metalness: 0.2,
    });
  }, []);

  // Generate deterministic building positions surrounding the main site
  useMemo(() => {
    // Wait for next tick so instanceMatrix can be set
    setTimeout(() => {
      if (!meshRef.current) return;

      let idx = 0;
      for (let i = 0; i < count; i++) {
        // Distribute in background semi-circle
        const angle = (i / count) * Math.PI * 1.6 - Math.PI * 0.8;
        const radius = 35 + (i % 5) * 6;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius - 10;

        const width = 3 + (i % 4) * 1.5;
        const depth = 3 + (i % 3) * 1.5;
        const height = 10 + ((i * 7) % 24);
        const y = height / 2;

        dummy.position.set(x, y, z);
        dummy.scale.set(width, height, depth);
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(idx, dummy.matrix);

        // Subtle color variations (midnight blues & silvers)
        const tone = 0.06 + (i % 6) * 0.02;
        color.setRGB(tone * 0.8, tone * 1.0, tone * 1.4);
        meshRef.current.setColorAt(idx, color);

        idx++;
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }, 0);
  }, [dummy, color, count]);

  return (
    <group position={[0, 0, 0]}>
      {/* Instanced background skyscrapers */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        material={material}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      {/* Ground plane / pavement */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial
          color="#0a101d"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
