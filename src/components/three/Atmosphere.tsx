'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  goldenHour: number; // 0 (standard daytime) to 1 (warm sunset handover glow)
}

export function Atmosphere({ goldenHour }: AtmosphereProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Mote particles
  const particleCount = 70;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    // Lightly animate floating dust particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }

    // Dynamic light color based on golden hour transition
    if (dirLightRef.current) {
      const sunColor = new THREE.Color().lerpColors(
        new THREE.Color('#fef3c7'), // crisp afternoon sunlight
        new THREE.Color('#f59e0b'), // warm golden sunset
        goldenHour
      );
      dirLightRef.current.color.copy(sunColor);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(1.8, 2.4, goldenHour);
    }
  });

  return (
    <>
      {/* Background Depth Fog matched to Navy design system */}
      <fog attach="fog" args={['#0c1421', 25, 75]} />

      {/* Ambient Fill Light */}
      <ambientLight color="#1e293b" intensity={0.9} />

      {/* Main Directional Sun Light */}
      <directionalLight
        ref={dirLightRef}
        position={[18, 24, 14]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={24}
        shadow-camera-bottom={-4}
      />

      {/* Blue/Navy Rim Light from opposite angle */}
      <directionalLight
        position={[-15, 12, -15]}
        color="#38bdf8"
        intensity={0.6}
      />

      {/* Warm Ground Bounce Light */}
      <pointLight position={[0, 1.5, 6]} color="#fcd34d" intensity={0.7} distance={18} />

      {/* Ambient Floating Dust Motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#d4a237"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </>
  );
}
