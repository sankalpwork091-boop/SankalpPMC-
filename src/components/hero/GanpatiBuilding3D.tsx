'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { HERO_3D_SETTINGS } from '@/config/hero3d';

interface GanpatiBuilding3DProps {
  progressRef: React.MutableRefObject<number>;
  isMobile?: boolean;
  prefersReducedMotion?: boolean;
}

const { floorCount, floorHeight, towerWidth, towerDepth, stiltHeight, camera, colors } =
  HERO_3D_SETTINGS;

// ─── Procedural Building & City Scene ───
function SceneContent({
  progressRef,
  isMobile = false,
  prefersReducedMotion = false,
}: GanpatiBuilding3DProps) {
  const { camera: threeCamera } = useThree();

  // References for dynamic animated objects
  const oldBuildingGroup = useRef<THREE.Group>(null);
  const newTowerGroup = useRef<THREE.Group>(null);
  const floorGroups = useRef<(THREE.Group | null)[]>([]);
  const craneGroup = useRef<THREE.Group>(null);
  const scaffoldingGroup = useRef<THREE.Group>(null);
  const signRef = useRef<THREE.Mesh>(null);
  const signTextRef = useRef<any>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const skyMeshRef = useRef<THREE.Mesh>(null);
  const treesGroupRef = useRef<THREE.Group>(null);
  const carsGroupRef = useRef<THREE.Group>(null);
  const windowMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Mouse parallax tracking
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, prefersReducedMotion]);

  // Shared reusable geometries and materials for optimal memory & 60fps
  const sharedGeometries = useMemo(() => {
    return {
      slab: new THREE.BoxGeometry(towerWidth + 0.4, 0.22, towerDepth + 0.4),
      column: new THREE.BoxGeometry(0.45, floorHeight, 0.45),
      stiltColumn: new THREE.BoxGeometry(0.65, stiltHeight, 0.65),
      wallFront: new THREE.BoxGeometry(towerWidth * 0.28, floorHeight, 0.2),
      glassFront: new THREE.BoxGeometry(towerWidth * 0.38, floorHeight - 0.3, 0.08),
      balconySlab: new THREE.BoxGeometry(towerWidth * 0.46, 0.12, 1.4),
      balconyGlass: new THREE.BoxGeometry(towerWidth * 0.46, 0.85, 0.05),
      balconyRail: new THREE.BoxGeometry(towerWidth * 0.46, 0.06, 0.06),
      acUnit: new THREE.BoxGeometry(0.75, 0.48, 0.35),
      louver: new THREE.BoxGeometry(towerWidth - 0.2, 0.08, 0.2),
      treeTrunk: new THREE.CylinderGeometry(0.15, 0.25, 1.8, 6),
      treeFoliage: new THREE.ConeGeometry(1.2, 2.5, 6),
      carBody: new THREE.BoxGeometry(1.8, 0.75, 3.6),
      carCabin: new THREE.BoxGeometry(1.5, 0.65, 2.0),
      roadMarking: new THREE.PlaneGeometry(1.8, 0.3),
    };
  }, []);

  const sharedMaterials = useMemo(() => {
    return {
      whiteFrame: new THREE.MeshStandardMaterial({
        color: colors.concreteWhite,
        roughness: 0.35,
        metalness: 0.05,
      }),
      woodAccent: new THREE.MeshStandardMaterial({
        color: colors.woodAccent,
        roughness: 0.55,
        metalness: 0.1,
      }),
      darkBands: new THREE.MeshStandardMaterial({
        color: colors.darkBands,
        roughness: 0.6,
      }),
      stiltWall: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.7,
      }),
      ground: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.85,
      }),
      road: new THREE.MeshStandardMaterial({
        color: colors.road,
        roughness: 0.9,
      }),
      grass: new THREE.MeshStandardMaterial({
        color: colors.grass,
        roughness: 0.8,
      }),
      balconyGlass: new THREE.MeshStandardMaterial({
        color: '#7dd3fc',
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.1,
      }),
      oldConcrete: new THREE.MeshStandardMaterial({
        color: colors.oldConcrete,
        roughness: 0.85,
        transparent: true,
        opacity: 1,
      }),
      oldStains: new THREE.MeshStandardMaterial({
        color: colors.oldStains,
        roughness: 0.95,
        transparent: true,
        opacity: 1,
      }),
      oldWindow: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.7,
        transparent: true,
        opacity: 1,
      }),
      blueprintWireframe: new THREE.MeshBasicMaterial({
        color: colors.blueprintCyan,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.4,
        metalness: 0.3,
      }),
      scaffolding: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      }),
      goldPlaque: new THREE.MeshStandardMaterial({
        color: colors.goldSign,
        metalness: 0.8,
        roughness: 0.25,
        emissive: colors.goldSign,
        emissiveIntensity: 0.2,
      }),
    };
  }, []);

  // Window materials created per floor so they can light up floor-by-floor
  const floorWindowMaterials = useMemo(() => {
    return Array.from({ length: floorCount }, () => {
      const mat = new THREE.MeshStandardMaterial({
        color: colors.glassDay,
        roughness: 0.15,
        metalness: 0.4,
        emissive: colors.glassLit,
        emissiveIntensity: 0.0,
      });
      windowMaterialsRef.current.push(mat);
      return mat;
    });
  }, []);

  // Background neighbouring buildings for depth
  const backgroundBuildings = useMemo(() => {
    return [
      { pos: [-16, 7, -18] as [number, number, number], size: [9, 14, 8] as [number, number, number] },
      { pos: [18, 9, -20] as [number, number, number], size: [11, 18, 9] as [number, number, number] },
      { pos: [-12, 12, -26] as [number, number, number], size: [14, 24, 10] as [number, number, number] },
      { pos: [14, 11, -28] as [number, number, number], size: [12, 22, 10] as [number, number, number] },
    ];
  }, []);

  // Cleanup geometries & materials on unmount
  useEffect(() => {
    return () => {
      Object.values(sharedGeometries).forEach((geo) => geo.dispose());
      Object.values(sharedMaterials).forEach((mat) => mat.dispose());
      floorWindowMaterials.forEach((mat) => mat.dispose());
    };
  }, [sharedGeometries, sharedMaterials, floorWindowMaterials]);

  // ─── useFrame: Driven by progressRef.current ───
  useFrame((state, delta) => {
    const rawProgress = prefersReducedMotion ? 1.0 : progressRef.current;
    const progress = THREE.MathUtils.clamp(rawProgress, 0, 1);

    // Mouse lerp
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // ─── CAMERA MOTION: Orbit (~35 deg) & Push-In ───
    if (!prefersReducedMotion) {
      const camStart = new THREE.Vector3(...camera.startPos);
      const camEnd = new THREE.Vector3(...camera.endPos);
      const targetStart = new THREE.Vector3(...camera.startTarget);
      const targetEnd = new THREE.Vector3(...camera.endTarget);

      // Smooth camera interpolation
      const currentCamPos = new THREE.Vector3().lerpVectors(camStart, camEnd, progress);
      const currentTarget = new THREE.Vector3().lerpVectors(targetStart, targetEnd, progress);

      // Add subtle parallax offset
      if (!isMobile) {
        currentCamPos.x += mouse.current.x * 0.8;
        currentCamPos.y += mouse.current.y * 0.4;
      }

      threeCamera.position.copy(currentCamPos);
      threeCamera.lookAt(currentTarget);
    } else {
      threeCamera.position.set(...camera.endPos);
      threeCamera.lookAt(new THREE.Vector3(...camera.endTarget));
    }

    // ─── STAGE A: Old Building (0 to 0.30) ───
    if (oldBuildingGroup.current) {
      if (progress < 0.32) {
        const fade = THREE.MathUtils.clamp(1 - (progress - 0.18) / 0.14, 0, 1);
        oldBuildingGroup.current.visible = fade > 0.001;
        sharedMaterials.oldConcrete.opacity = fade;
        sharedMaterials.oldStains.opacity = fade;
        sharedMaterials.oldWindow.opacity = fade;
        // Slight settling sink
        oldBuildingGroup.current.position.y = (1 - fade) * -1.5;
      } else {
        oldBuildingGroup.current.visible = false;
      }
    }

    // ─── STAGE B: Construction & Floor Rise (0.30 to 0.75) ───
    if (newTowerGroup.current) {
      newTowerGroup.current.visible = progress >= 0.22;
    }

    floorGroups.current.forEach((fg, index) => {
      if (!fg) return;

      // Calculate progress threshold for this specific floor
      const floorStart = 0.30 + (index / floorCount) * 0.42;
      const floorEnd = floorStart + 0.08;

      if (progress < floorStart) {
        // Not reached yet -> invisible beneath ground
        fg.visible = false;
        fg.position.y = -10;
      } else if (progress >= floorEnd) {
        // Floor is fully constructed and in place
        fg.visible = true;
        fg.position.y = index * floorHeight;
        fg.scale.set(1, 1, 1);
      } else {
        // Floor is currently rising
        fg.visible = true;
        const norm = (progress - floorStart) / (floorEnd - floorStart);
        // Easing with slight overshoot / bounce feel
        const easeOut = Math.sin(norm * (Math.PI / 2));
        fg.position.y = THREE.MathUtils.lerp(-4, index * floorHeight, easeOut);
        const scale = THREE.MathUtils.lerp(0.92, 1, easeOut);
        fg.scale.set(scale, scale, scale);
      }
    });

    // Crane motion & visibility (Construction Stage B only, fully gone before Stage C)
    if (craneGroup.current) {
      if (!prefersReducedMotion && progress >= 0.28 && progress < 0.74) {
        craneGroup.current.visible = true;
        // Crane rotates as floors climb
        craneGroup.current.rotation.y = progress * Math.PI * 4.5;
        // Crane climbs up along with floors
        const targetFloorIndex = Math.min(floorCount - 1, Math.floor(((progress - 0.3) / 0.42) * floorCount));
        const craneY = (targetFloorIndex + 1) * floorHeight + stiltHeight;
        craneGroup.current.position.y = craneY;
        const craneFade = progress > 0.68 ? Math.max(0, (0.74 - progress) / 0.06) : 1;
        craneGroup.current.scale.setScalar(craneFade);
      } else {
        craneGroup.current.visible = false;
        craneGroup.current.scale.setScalar(0);
      }
    }

    // Scaffolding visibility (Construction Stage B only, fully gone before Stage C)
    if (scaffoldingGroup.current) {
      if (!prefersReducedMotion && progress >= 0.32 && progress < 0.74) {
        scaffoldingGroup.current.visible = true;
        const targetFloor = Math.min(floorCount - 1, Math.floor(((progress - 0.3) / 0.42) * floorCount));
        scaffoldingGroup.current.position.y = targetFloor * floorHeight + stiltHeight - 1.0;
        const scaffoldAlpha = progress > 0.68 ? Math.max(0, (0.74 - progress) / 0.06) * 0.65 : 0.65;
        sharedMaterials.scaffolding.opacity = scaffoldAlpha;
      } else {
        scaffoldingGroup.current.visible = false;
      }
    }

    // ─── STAGE C: Completion (0.75 to 1.0) ───
    // Windows light up warm yellow one by one
    floorWindowMaterials.forEach((mat, idx) => {
      const lightThreshold = 0.76 + (idx / floorCount) * 0.18;
      if (progress >= lightThreshold) {
        const glow = Math.min(1.0, (progress - lightThreshold) / 0.04);
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.85, glow);
        mat.color.lerpColors(new THREE.Color(colors.glassDay), new THREE.Color(colors.glassLit), glow * 0.5);
      } else {
        mat.emissiveIntensity = 0.0;
        mat.color.set(colors.glassDay);
      }
    });

    // Glowing Sign "GANPATI CHS"
    if (signRef.current) {
      if (progress >= 0.82) {
        const signGlow = (progress - 0.82) / 0.18;
        sharedMaterials.goldPlaque.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.2, signGlow);
      } else {
        sharedMaterials.goldPlaque.emissiveIntensity = 0.1;
      }
    }

    // Landscaping & cars pop in
    if (treesGroupRef.current) {
      const treeScale = THREE.MathUtils.clamp((progress - 0.74) / 0.12, 0, 1);
      treesGroupRef.current.scale.setScalar(treeScale);
      treesGroupRef.current.visible = treeScale > 0.01;
    }

    if (carsGroupRef.current) {
      const carScale = THREE.MathUtils.clamp((progress - 0.78) / 0.12, 0, 1);
      carsGroupRef.current.scale.setScalar(carScale);
      carsGroupRef.current.visible = carScale > 0.01;
    }

    // Sun & lighting transition (Dusk -> Clear Midday / Golden Hour)
    if (sunLightRef.current && ambientLightRef.current) {
      if (progress < 0.3) {
        // Stage A: Hazy, cool diffuse light
        sunLightRef.current.intensity = 1.0;
        sunLightRef.current.color.set('#94a3b8');
        ambientLightRef.current.intensity = 0.7;
        ambientLightRef.current.color.set('#475569');
      } else if (progress < 0.75) {
        // Stage B: Bright crisp daylight
        sunLightRef.current.intensity = 1.6;
        sunLightRef.current.color.set('#f8fafc');
        ambientLightRef.current.intensity = 0.9;
        ambientLightRef.current.color.set('#cbd5e1');
      } else {
        // Stage C: Golden sunset celebration
        const warmRatio = (progress - 0.75) / 0.25;
        sunLightRef.current.intensity = THREE.MathUtils.lerp(1.6, 2.2, warmRatio);
        sunLightRef.current.color.lerpColors(new THREE.Color('#f8fafc'), new THREE.Color('#fdba74'), warmRatio);
        ambientLightRef.current.color.lerpColors(new THREE.Color('#cbd5e1'), new THREE.Color('#fed7aa'), warmRatio);
      }
    }
  });

  return (
    <>
      {/* ─── LIGHTING & ENVIRONMENT ─── */}
      <ambientLight ref={ambientLightRef} intensity={0.8} />
      <directionalLight
        ref={sunLightRef}
        position={[14, 22, 16]}
        intensity={1.8}
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={20}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <Environment preset="city" />

      {/* ─── GROUND PLOT, ROAD & NEIGHBOURHOOD ─── */}
      <group position={[0, 0, 0]}>
        {/* Main Plot Ground */}
        <mesh receiveShadow={!isMobile} position={[0, -0.05, 0]} material={sharedMaterials.ground}>
          <boxGeometry args={[26, 0.1, 24]} />
        </mesh>

        {/* Front Road */}
        <mesh receiveShadow={!isMobile} position={[0, -0.04, 11]} material={sharedMaterials.road}>
          <boxGeometry args={[36, 0.08, 6]} />
        </mesh>

        {/* Road Dashed Centerlines */}
        {[-8, -4, 0, 4, 8].map((rx, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[rx, 0.01, 11]}
            material={sharedMaterials.whiteFrame}
            geometry={sharedGeometries.roadMarking}
          />
        ))}

        {/* Boundary Compound Wall with Gate Opening */}
        <mesh position={[-6.8, 0.55, 7.5]} material={sharedMaterials.stiltWall}>
          <boxGeometry args={[11, 1.1, 0.25]} />
        </mesh>
        <mesh position={[6.8, 0.55, 7.5]} material={sharedMaterials.stiltWall}>
          <boxGeometry args={[11, 1.1, 0.25]} />
        </mesh>

        {/* Entrance Gate Pillars */}
        <mesh position={[-1.2, 1.1, 7.5]} material={sharedMaterials.goldPlaque}>
          <boxGeometry args={[0.5, 2.2, 0.5]} />
        </mesh>
        <mesh position={[1.2, 1.1, 7.5]} material={sharedMaterials.goldPlaque}>
          <boxGeometry args={[0.5, 2.2, 0.5]} />
        </mesh>

        {/* Background Skyline Buildings */}
        {backgroundBuildings.map((b, idx) => (
          <mesh key={idx} position={b.pos} material={sharedMaterials.stiltWall}>
            <boxGeometry args={b.size} />
          </mesh>
        ))}

        {/* Landscaping Trees (Revealed in Stage C) */}
        <group ref={treesGroupRef} visible={false}>
          {[
            [-9.5, 0, 6],
            [-10.5, 0, 2],
            [9.5, 0, 6],
            [10.5, 0, 2],
            [-11, 0, -4],
            [11, 0, -4],
          ].map((tPos, idx) => (
            <group key={idx} position={tPos as [number, number, number]}>
              <mesh position={[0, 0.9, 0]} geometry={sharedGeometries.treeTrunk} material={sharedMaterials.woodAccent} />
              <mesh position={[0, 2.5, 0]} geometry={sharedGeometries.treeFoliage} material={sharedMaterials.grass} />
            </group>
          ))}
        </group>

        {/* Cars in Stilt Parking & Entrance (Revealed in Stage C) */}
        <group ref={carsGroupRef} visible={false}>
          {[
            { pos: [-2.4, 0.4, 1.5] as [number, number, number], rot: 0, col: '#f8fafc' },
            { pos: [2.4, 0.4, 1.5] as [number, number, number], rot: 0, col: '#1e293b' },
            { pos: [7.5, 0.4, 9.8] as [number, number, number], rot: Math.PI / 2, col: '#D4A462' },
          ].map((car, idx) => (
            <group key={idx} position={car.pos} rotation={[0, car.rot, 0]}>
              <mesh geometry={sharedGeometries.carBody}>
                <meshStandardMaterial color={car.col} roughness={0.3} metalness={0.4} />
              </mesh>
              <mesh position={[0, 0.55, -0.2]} geometry={sharedGeometries.carCabin}>
                <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ─── STAGE A: OLD WEATHERED 4-STOREY BUILDING ─── */}
      <group ref={oldBuildingGroup} position={[0, 0, 0]}>
        {/* Old Building Stilt Base */}
        <mesh position={[0, 1.0, 0]} material={sharedMaterials.oldConcrete}>
          <boxGeometry args={[towerWidth * 0.9, 2.0, towerDepth * 0.9]} />
        </mesh>
        {/* 4 Weathered Floors */}
        {Array.from({ length: 4 }).map((_, fIdx) => {
          const y = 2.0 + fIdx * 1.6 + 0.8;
          return (
            <group key={fIdx} position={[0, y, 0]}>
              {/* Weathered Floor Block */}
              <mesh material={sharedMaterials.oldConcrete}>
                <boxGeometry args={[towerWidth * 0.9, 1.5, towerDepth * 0.9]} />
              </mesh>
              {/* Concrete Water Stain Stripes */}
              <mesh position={[0, 0, towerDepth * 0.45 + 0.02]} material={sharedMaterials.oldStains}>
                <boxGeometry args={[towerWidth * 0.88, 1.48, 0.02]} />
              </mesh>
              {/* Old Dark Windows */}
              <mesh position={[-2.2, 0, towerDepth * 0.45 + 0.04]} material={sharedMaterials.oldWindow}>
                <boxGeometry args={[1.6, 0.9, 0.04]} />
              </mesh>
              <mesh position={[2.2, 0, towerDepth * 0.45 + 0.04]} material={sharedMaterials.oldWindow}>
                <boxGeometry args={[1.6, 0.9, 0.04]} />
              </mesh>
              {/* Floor Slab Divider */}
              <mesh position={[0, -0.75, 0]} material={sharedMaterials.oldStains}>
                <boxGeometry args={[towerWidth * 0.92, 0.12, towerDepth * 0.92]} />
              </mesh>
            </group>
          );
        })}
        {/* Rusted Water Tank on Old Roof */}
        <mesh position={[2.0, 8.9, 0]} material={sharedMaterials.oldStains}>
          <cylinderGeometry args={[0.9, 0.9, 1.4, 12]} />
        </mesh>
      </group>

      {/* ─── STAGE B & C: NEW 8-STOREY GANPATI TOWER ─── */}
      <group ref={newTowerGroup} position={[0, 0, 0]} visible={false}>
        {/* Stilt Parking Ground Floor (Level 0) */}
        <group position={[0, 0, 0]}>
          {/* Main Stilt Slab */}
          <mesh position={[0, stiltHeight, 0]} geometry={sharedGeometries.slab} material={sharedMaterials.whiteFrame} />

          {/* Stilt Support Columns */}
          {[
            [-towerWidth * 0.42, stiltHeight / 2, -towerDepth * 0.42],
            [towerWidth * 0.42, stiltHeight / 2, -towerDepth * 0.42],
            [-towerWidth * 0.42, stiltHeight / 2, towerDepth * 0.42],
            [towerWidth * 0.42, stiltHeight / 2, towerDepth * 0.42],
            [-towerWidth * 0.15, stiltHeight / 2, -towerDepth * 0.42],
            [towerWidth * 0.15, stiltHeight / 2, -towerDepth * 0.42],
          ].map((cPos, idx) => (
            <mesh key={idx} position={cPos as [number, number, number]} geometry={sharedGeometries.stiltColumn} material={sharedMaterials.whiteFrame} />
          ))}

          {/* Entrance Lobby Core */}
          <mesh position={[0, stiltHeight / 2, 0]} material={sharedMaterials.whiteFrame}>
            <boxGeometry args={[3.2, stiltHeight, 3.2]} />
          </mesh>
          <mesh position={[0, stiltHeight / 2, 1.62]} material={sharedMaterials.balconyGlass}>
            <boxGeometry args={[2.8, stiltHeight - 0.2, 0.05]} />
          </mesh>

          {/* Architectural Louvered Screen Panels */}
          {[-1.8, -1.5, -1.2, -0.9, -0.6].map((ly, idx) => (
            <mesh key={idx} position={[0, stiltHeight + ly, towerDepth * 0.48]} geometry={sharedGeometries.louver} material={sharedMaterials.woodAccent} />
          ))}
        </group>

        {/* Typical Floors 1 to 8 (Stacked with procedural ease-in) */}
        <group position={[0, stiltHeight, 0]}>
          {Array.from({ length: floorCount }).map((_, fIdx) => (
            <group
              key={fIdx}
              ref={(el) => {
                floorGroups.current[fIdx] = el;
              }}
              position={[0, fIdx * floorHeight, 0]}
            >
              {/* Floor Slab with Cantilevered White Architectural Framing */}
              <mesh position={[0, floorHeight, 0]} geometry={sharedGeometries.slab} material={sharedMaterials.whiteFrame} />

              {/* Side Columns */}
              <mesh position={[-towerWidth * 0.44, floorHeight / 2, towerDepth * 0.42]} geometry={sharedGeometries.column} material={sharedMaterials.whiteFrame} />
              <mesh position={[towerWidth * 0.44, floorHeight / 2, towerDepth * 0.42]} geometry={sharedGeometries.column} material={sharedMaterials.whiteFrame} />

              {/* White Architectural Staggered Framing Flanges */}
              <mesh position={[-towerWidth * 0.46, floorHeight / 2, 0]} material={sharedMaterials.whiteFrame}>
                <boxGeometry args={[0.35, floorHeight + 0.1, towerDepth + 0.3]} />
              </mesh>
              <mesh position={[towerWidth * 0.46, floorHeight / 2, 0]} material={sharedMaterials.whiteFrame}>
                <boxGeometry args={[0.35, floorHeight + 0.1, towerDepth + 0.3]} />
              </mesh>

              {/* Walnut Wood Finish Spandrel Band Beneath Balcony */}
              <mesh position={[0, 0.25, towerDepth * 0.44]} material={sharedMaterials.woodAccent}>
                <boxGeometry args={[towerWidth * 0.84, 0.45, 0.15]} />
              </mesh>

              {/* Floor-to-Ceiling Windows (Color shifts to illuminated yellow in Stage C) */}
              <mesh position={[-2.2, floorHeight / 2, towerDepth * 0.4]} geometry={sharedGeometries.glassFront} material={floorWindowMaterials[fIdx]} />
              <mesh position={[2.2, floorHeight / 2, towerDepth * 0.4]} geometry={sharedGeometries.glassFront} material={floorWindowMaterials[fIdx]} />

              {/* Cantilevered Glass Balcony */}
              <group position={[0, 0.1, towerDepth * 0.4 + 0.7]}>
                <mesh geometry={sharedGeometries.balconySlab} material={sharedMaterials.whiteFrame} />
                <mesh position={[0, 0.45, 0.65]} geometry={sharedGeometries.balconyGlass} material={sharedMaterials.balconyGlass} />
                <mesh position={[0, 0.88, 0.65]} geometry={sharedGeometries.balconyRail} material={sharedMaterials.darkBands} />
              </group>

              {/* Alternating AC Units on windows */}
              {fIdx % 2 === 0 ? (
                <mesh position={[-3.8, 0.5, towerDepth * 0.45]} geometry={sharedGeometries.acUnit} material={sharedMaterials.darkBands} />
              ) : (
                <mesh position={[3.8, 0.5, towerDepth * 0.45]} geometry={sharedGeometries.acUnit} material={sharedMaterials.darkBands} />
              )}
            </group>
          ))}

          {/* Roof Terrace, Water Tank, Lift Machine Room & GANPATI CHS Signboard */}
          <group position={[0, floorCount * floorHeight, 0]}>
            {/* Terrace Parapet Wall */}
            <mesh position={[0, 0.4, 0]} material={sharedMaterials.whiteFrame}>
              <boxGeometry args={[towerWidth + 0.4, 0.8, towerDepth + 0.4]} />
            </mesh>

            {/* Lift Machine Room */}
            <mesh position={[-1.8, 1.4, -1.2]} material={sharedMaterials.whiteFrame}>
              <boxGeometry args={[3.2, 2.0, 3.0]} />
            </mesh>

            {/* Modern Water Tank */}
            <mesh position={[2.2, 1.2, -1.2]} material={sharedMaterials.woodAccent}>
              <boxGeometry args={[2.4, 1.6, 2.4]} />
            </mesh>

            {/* Grand Crown Signboard: "GANPATI CHS" */}
            <group position={[0, 1.2, towerDepth * 0.48]}>
              <mesh ref={signRef} material={sharedMaterials.goldPlaque}>
                <boxGeometry args={[6.2, 0.9, 0.25]} />
              </mesh>
              <Text
                ref={signTextRef}
                position={[0, 0, 0.16]}
                fontSize={0.42}
                color="#0c1421"
                anchorX="center"
                anchorY="middle"
                fontWeight={700}
                letterSpacing={0.08}
              >
                GANPATI CHS
              </Text>
            </group>
          </group>
        </group>

        {/* Construction Scaffolding (Visible in Stage B) */}
        <group ref={scaffoldingGroup} visible={false}>
          <mesh material={sharedMaterials.scaffolding}>
            <boxGeometry args={[towerWidth + 1.2, floorHeight * 2.2, towerDepth + 1.2]} />
          </mesh>
        </group>

        {/* Tower Crane (Visible in Stage B) */}
        <group ref={craneGroup} position={[towerWidth * 0.55, 0, -towerDepth * 0.4]} visible={false}>
          {/* Vertical Mast */}
          <mesh position={[0, 2.5, 0]} material={sharedMaterials.craneYellow}>
            <boxGeometry args={[0.6, 5.0, 0.6]} />
          </mesh>
          {/* Horizontal Jib Arm */}
          <mesh position={[-2.5, 5.2, 0]} material={sharedMaterials.craneYellow}>
            <boxGeometry args={[6.5, 0.4, 0.4]} />
          </mesh>
          {/* Counterweight */}
          <mesh position={[1.2, 5.2, 0]} material={sharedMaterials.darkBands}>
            <boxGeometry args={[1.2, 0.7, 0.7]} />
          </mesh>
          {/* Hook Cable */}
          <mesh position={[-3.8, 3.8, 0]} material={sharedMaterials.blueprintWireframe}>
            <cylinderGeometry args={[0.02, 0.02, 2.5, 4]} />
          </mesh>
        </group>
      </group>
    </>
  );
}

// ─── Main Export Component with R3F Canvas ───
export default function GanpatiBuilding3D({
  progressRef,
  isMobile = false,
  prefersReducedMotion = false,
}: GanpatiBuilding3DProps) {
  return (
    <Canvas
      shadows={!isMobile && !prefersReducedMotion}
      dpr={isMobile ? 1.0 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1.5, 1.5)}
      gl={{
        antialias: !isMobile,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      camera={{
        position: camera.startPos,
        fov: isMobile ? 48 : 42,
        near: 0.1,
        far: 120,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <SceneContent
        progressRef={progressRef}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
      />
    </Canvas>
  );
}
