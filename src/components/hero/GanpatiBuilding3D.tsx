'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { HERO_3D_SETTINGS } from '@/config/hero3d';
import { BUILDING_PALETTE } from '@/animations/buildingPalette';

interface GanpatiBuilding3DProps {
  progressRef: React.MutableRefObject<number>;
  isMobile?: boolean;
  prefersReducedMotion?: boolean;
}

const { floorCount, floorHeight, towerWidth, towerDepth, stiltHeight, camera, colors } =
  HERO_3D_SETTINGS;

// ─── Procedural Texture Generators (Zero external network requests) ───

function createWalnutGrainTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = BUILDING_PALETTE.stageC.walnut;
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const d = imgData.data;
  for (let y = 0; y < 256; y++) {
    const ring = Math.sin(y * 0.15 + Math.sin(y * 0.04) * 3.8) * 0.5 + 0.5;
    for (let x = 0; x < 256; x++) {
      const fineNoise = (Math.random() - 0.5) * 14;
      const fiber = Math.sin(y * 0.95 + x * 0.025) * 7;
      const delta = ring * 20 + fiber + fineNoise - 10;
      const idx = (y * 256 + x) * 4;
      d[idx] = Math.min(255, Math.max(0, 118 + delta * 0.88));
      d[idx + 1] = Math.min(255, Math.max(0, 70 + delta * 0.56));
      d[idx + 2] = Math.min(255, Math.max(0, 38 + delta * 0.36));
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

function createGlassGradientTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, BUILDING_PALETTE.stageC.glassLight); // light sky sheen at top
  grad.addColorStop(0.3, '#B9D7ED');
  grad.addColorStop(0.7, BUILDING_PALETTE.stageC.glass);     // mid blue
  grad.addColorStop(1, BUILDING_PALETTE.stageC.glassDeep); // deeper reflection at bottom
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(128, 128, 25, 128, 128, 122);
  grad.addColorStop(0, 'rgba(24, 20, 16, 0.45)');
  grad.addColorStop(0.5, 'rgba(38, 32, 26, 0.24)');
  grad.addColorStop(0.8, 'rgba(75, 68, 60, 0.07)');
  grad.addColorStop(1, 'rgba(120, 110, 100, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

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
  const stiltGroupRef = useRef<THREE.Group>(null);
  const floorGroups = useRef<(THREE.Group | null)[]>([]);
  const floorWireframes = useRef<(THREE.Mesh | null)[]>([]);
  const craneGroup = useRef<THREE.Group>(null);
  const scaffoldingGroup = useRef<THREE.Group>(null);
  const signRef = useRef<THREE.Mesh>(null);
  const signTextRef = useRef<any>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const treesGroupRef = useRef<THREE.Group>(null);
  const carsGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Subtle floating gold motes
  const particleCount = 45;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = Math.random() * 18 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return pos;
  }, []);

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

  // Procedural Textures (skipped on mobile for performance)
  const textures = useMemo(() => {
    if (isMobile) {
      return { walnut: null, glass: null, shadow: null };
    }
    return {
      walnut: createWalnutGrainTexture(),
      glass: createGlassGradientTexture(),
      shadow: createContactShadowTexture(),
    };
  }, [isMobile]);

  // Shared reusable geometries
  const sharedGeometries = useMemo(() => {
    return {
      slab: new THREE.BoxGeometry(towerWidth + 0.4, 0.22, towerDepth + 0.4),
      column: new THREE.BoxGeometry(0.45, floorHeight, 0.45),
      stiltColumn: new THREE.BoxGeometry(0.65, stiltHeight, 0.65),
      wallFront: new THREE.BoxGeometry(towerWidth * 0.28, floorHeight, 0.2),
      glassFront: new THREE.BoxGeometry(towerWidth * 0.38, floorHeight - 0.26, 0.08),
      windowBacking: new THREE.BoxGeometry(towerWidth * 0.38 + 0.02, floorHeight - 0.25, 0.05),
      mullionV: new THREE.BoxGeometry(0.045, floorHeight - 0.26, 0.095),
      mullionH: new THREE.BoxGeometry(towerWidth * 0.38, 0.045, 0.095),
      balconySlab: new THREE.BoxGeometry(towerWidth * 0.46, 0.12, 1.4),
      balconySoffit: new THREE.BoxGeometry(towerWidth * 0.45, 0.02, 1.38),
      balconyGlass: new THREE.BoxGeometry(towerWidth * 0.46, 0.85, 0.05),
      balconyRail: new THREE.BoxGeometry(towerWidth * 0.46, 0.06, 0.06),
      downlightDot: new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8),
      acUnit: new THREE.BoxGeometry(0.75, 0.48, 0.35),
      louver: new THREE.BoxGeometry(towerWidth - 0.2, 0.08, 0.2),
      floorWireCage: new THREE.BoxGeometry(towerWidth + 0.42, floorHeight, towerDepth + 0.42),
      treeTrunk: new THREE.CylinderGeometry(0.15, 0.25, 1.8, 6),
      treeFoliage: new THREE.ConeGeometry(1.2, 2.5, 6),
      carBody: new THREE.BoxGeometry(1.8, 0.75, 3.6),
      carCabin: new THREE.BoxGeometry(1.5, 0.65, 2.0),
      roadMarking: new THREE.PlaneGeometry(1.8, 0.3),
    };
  }, []);

  // Natural walnut wood tones for subtle floor-by-floor natural variation
  const walnutBandColors = useMemo(
    () => [
      BUILDING_PALETTE.stageC.walnut,
      BUILDING_PALETTE.stageC.walnutLight,
      BUILDING_PALETTE.stageC.walnutDark,
      BUILDING_PALETTE.stageC.walnutWarm,
    ],
    []
  );

  // Pre-allocated per-floor material instances for smooth colour lerping (created once, no frame alloc)
  const floorMaterials = useMemo(() => {
    return Array.from({ length: floorCount }, (_, fIdx) => {
      const frame = new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.frameWhite,
        roughness: 0.78,
        metalness: 0.04,
      });
      const wood = new THREE.MeshStandardMaterial({
        color: walnutBandColors[fIdx % 4],
        map: textures.walnut || undefined,
        roughness: 0.55,
        metalness: 0.08,
      });
      const glass = new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.glass,
        map: textures.glass || undefined,
        transparent: true,
        opacity: 0.88,
        roughness: 0.08,
        metalness: 0.18,
        emissive: new THREE.Color(BUILDING_PALETTE.stageC.warmLight),
        emissiveIntensity: 0.0,
      });
      const balconyGlass = new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.glass,
        map: textures.glass || undefined,
        transparent: true,
        opacity: 0.68,
        roughness: 0.1,
        metalness: 0.15,
      });
      const downlight = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: new THREE.Color(BUILDING_PALETTE.stageC.warmLight),
        emissiveIntensity: 0.0,
        roughness: 0.3,
      });

      return { frame, wood, glass, balconyGlass, downlight };
    });
  }, [textures, walnutBandColors]);

  // Stage A weathered materials
  const stageAMaterials = useMemo(() => {
    return {
      stoneBase: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.stoneBase,
        roughness: 0.9,
        transparent: true,
        opacity: 1,
      }),
      stoneFloors: [
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageA.stoneFloor1, roughness: 0.88, transparent: true, opacity: 1 }),
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageA.stoneFloor2, roughness: 0.88, transparent: true, opacity: 1 }),
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageA.stoneFloor3, roughness: 0.86, transparent: true, opacity: 1 }),
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageA.stoneFloor4, roughness: 0.85, transparent: true, opacity: 1 }),
      ],
      stainRust: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.stainRust,
        roughness: 0.95,
        transparent: true,
        opacity: 1,
      }),
      stainDark: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.stainDark,
        roughness: 0.95,
        transparent: true,
        opacity: 1,
      }),
      dullGlass: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.dullGlass,
        roughness: 0.75,
        transparent: true,
        opacity: 0.5,
      }),
      fadedWood: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.fadedWood,
        roughness: 0.8,
        transparent: true,
        opacity: 1,
      }),
    };
  }, []);

  // Shared Stage C, Environment & Props materials
  const sharedMaterials = useMemo(() => {
    return {
      whiteFrame: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.frameWhite,
        roughness: 0.78,
        metalness: 0.04,
      }),
      walnutWood: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.walnut,
        map: textures.walnut || undefined,
        roughness: 0.55,
        metalness: 0.08,
      }),
      mullions: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.mullions,
        roughness: 0.5,
        metalness: 0.2,
      }),
      interiorBacking: new THREE.MeshStandardMaterial({
        color: '#1A1D24',
        roughness: 0.9,
      }),
      stiltLouvreWhite: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.stiltLouvreWhite,
        roughness: 0.75,
      }),
      stiltLouvreWalnut: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.stiltLouvreWalnut,
        map: textures.walnut || undefined,
        roughness: 0.58,
      }),
      stiltRecessDark: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.stiltRecessDark,
        roughness: 0.92,
      }),
      gatePillar: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageA.fadedWood,
        map: textures.walnut || undefined,
        roughness: 0.65,
      }),
      gatePillarCap: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.gatePillarCapWhite,
        roughness: 0.75,
      }),
      signboardWood: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageC.signboardWood,
        map: textures.walnut || undefined,
        roughness: 0.6,
        emissive: new THREE.Color(BUILDING_PALETTE.stageC.signboardGlow),
        emissiveIntensity: 0.0,
      }),
      blueprintWireframe: new THREE.MeshBasicMaterial({
        color: BUILDING_PALETTE.stageB.wireframeGold,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.stageB.craneGold,
        roughness: 0.4,
        metalness: 0.4,
      }),
      scaffolding: new THREE.MeshBasicMaterial({
        color: BUILDING_PALETTE.stageB.scaffoldGold,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      }),
      ground: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.environment.ground,
        roughness: 0.85,
      }),
      road: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.environment.road,
        roughness: 0.9,
      }),
      boundaryWall: new THREE.MeshStandardMaterial({
        color: colors.stiltWall,
        roughness: 0.75,
      }),
      bgSilhouette: new THREE.MeshStandardMaterial({
        color: BUILDING_PALETTE.environment.bgSilhouette,
        roughness: 0.88,
      }),
      foliage: [
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageC.palmGreen, roughness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageC.palmGreenLight, roughness: 0.75 }),
        new THREE.MeshStandardMaterial({ color: BUILDING_PALETTE.stageC.palmGreenDeep, roughness: 0.85 }),
      ],
    };
  }, [textures]);

  // Background neighbouring buildings for depth (pale ivory silhouettes)
  const backgroundBuildings = useMemo(() => {
    return [
      { pos: [-16, 7, -18] as [number, number, number], size: [9, 14, 8] as [number, number, number] },
      { pos: [18, 9, -20] as [number, number, number], size: [11, 18, 9] as [number, number, number] },
      { pos: [-12, 12, -26] as [number, number, number], size: [14, 24, 10] as [number, number, number] },
      { pos: [14, 11, -28] as [number, number, number], size: [12, 22, 10] as [number, number, number] },
    ];
  }, []);

  // Color constants for lerping without allocations inside useFrame
  const lerpColors = useMemo(() => {
    return {
      wireframeGold: new THREE.Color(BUILDING_PALETTE.stageB.wireframeGold),
      frameWhite: new THREE.Color(BUILDING_PALETTE.stageC.frameWhite),
      glass: new THREE.Color(BUILDING_PALETTE.stageC.glass),
      gateFaded: new THREE.Color(BUILDING_PALETTE.stageA.fadedWood),
      gateWalnut: new THREE.Color(BUILDING_PALETTE.stageC.gatePillarWalnut),
      gateCapStone: new THREE.Color(BUILDING_PALETTE.stageA.stoneFloor2),
      gateCapWhite: new THREE.Color(BUILDING_PALETTE.stageC.gatePillarCapWhite),
      warmLight: new THREE.Color(BUILDING_PALETTE.stageC.warmLight),
      signGlow: new THREE.Color(BUILDING_PALETTE.stageC.signboardGlow),
    };
  }, []);

  // Cleanup geometries & materials on unmount
  useEffect(() => {
    return () => {
      textures.walnut?.dispose();
      textures.glass?.dispose();
      textures.shadow?.dispose();

      Object.values(sharedGeometries).forEach((geo) => geo.dispose());
      Object.values(sharedMaterials).forEach((mat) => {
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      });
      Object.values(stageAMaterials).forEach((mat) => {
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      });
      floorMaterials.forEach((fm) => {
        fm.frame.dispose();
        fm.wood.dispose();
        fm.glass.dispose();
        fm.balconyGlass.dispose();
        fm.downlight.dispose();
      });
    };
  }, [sharedGeometries, sharedMaterials, stageAMaterials, floorMaterials, textures]);

  // ─── useFrame: Driven by progressRef.current ───
  useFrame((state) => {
    const rawProgress = prefersReducedMotion ? 1.0 : progressRef.current;
    const progress = THREE.MathUtils.clamp(rawProgress, 0, 1);

    // Mouse lerp
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // ─── CAMERA MOTION: Preserved exact orbit & push-in ───
    if (!prefersReducedMotion) {
      const camStart = new THREE.Vector3(...camera.startPos);
      const camEnd = new THREE.Vector3(...camera.endPos);
      const targetStart = new THREE.Vector3(...camera.startTarget);
      const targetEnd = new THREE.Vector3(...camera.endTarget);

      const currentCamPos = new THREE.Vector3().lerpVectors(camStart, camEnd, progress);
      const currentTarget = new THREE.Vector3().lerpVectors(targetStart, targetEnd, progress);

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

    // ─── STAGE A: Old Weathered Building (0 to 0.30) ───
    if (oldBuildingGroup.current) {
      if (progress < 0.32) {
        const fade = THREE.MathUtils.clamp(1 - (progress - 0.18) / 0.14, 0, 1);
        oldBuildingGroup.current.visible = fade > 0.001;
        stageAMaterials.stoneBase.opacity = fade;
        stageAMaterials.stoneFloors.forEach((sf) => (sf.opacity = fade));
        stageAMaterials.stainRust.opacity = fade;
        stageAMaterials.stainDark.opacity = fade;
        stageAMaterials.dullGlass.opacity = fade * 0.5;
        stageAMaterials.fadedWood.opacity = fade;
        oldBuildingGroup.current.position.y = (1 - fade) * -1.5;
      } else {
        oldBuildingGroup.current.visible = false;
      }
    }

    // ─── STAGE B & C: Tower Visibility & Floor-by-Floor Colour Lerp ───
    if (newTowerGroup.current) {
      newTowerGroup.current.visible = progress >= 0.22;
    }

    // Gate Pillars smooth transition from weathered faded wood to rich walnut + white cap
    const gateLerp = THREE.MathUtils.clamp((progress - 0.26) / 0.45, 0, 1);
    sharedMaterials.gatePillar.color.lerpColors(lerpColors.gateFaded, lerpColors.gateWalnut, gateLerp);
    sharedMaterials.gatePillarCap.color.lerpColors(lerpColors.gateCapStone, lerpColors.gateCapWhite, gateLerp);

    // Stilt floor Level 0 entrance blend
    if (stiltGroupRef.current) {
      const stiltRise = THREE.MathUtils.clamp((progress - 0.22) / 0.1, 0, 1);
      const stiltEase = Math.sin(stiltRise * (Math.PI / 2));
      stiltGroupRef.current.position.y = THREE.MathUtils.lerp(-3, 0, stiltEase);
      stiltGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.94, 1, stiltEase));
    }

    // Typical Floors 1 to 8: Eased Rise & Gradual Wireframe-to-Colour Lerp
    floorGroups.current.forEach((fg, index) => {
      if (!fg) return;

      const floorStart = 0.30 + (index / floorCount) * 0.42;
      const floorEnd = floorStart + 0.08;

      let blendFactor = 0;

      if (progress < floorStart) {
        fg.visible = false;
        fg.position.y = -10;
        blendFactor = 0;
      } else if (progress >= floorEnd) {
        fg.visible = true;
        fg.position.y = index * floorHeight;
        fg.scale.set(1, 1, 1);
        blendFactor = 1.0;
      } else {
        fg.visible = true;
        const norm = (progress - floorStart) / (floorEnd - floorStart);
        const easeOut = Math.sin(norm * (Math.PI / 2));
        fg.position.y = THREE.MathUtils.lerp(-4, index * floorHeight, easeOut);
        const scale = THREE.MathUtils.lerp(0.92, 1, easeOut);
        fg.scale.set(scale, scale, scale);
        blendFactor = easeOut;
      }

      // Smooth colour blend: Wireframe gold -> Stage C realistic render palette
      const fm = floorMaterials[index];
      const targetWoodCol = new THREE.Color(walnutBandColors[index % 4]);
      fm.frame.color.lerpColors(lerpColors.wireframeGold, lerpColors.frameWhite, blendFactor);
      fm.wood.color.lerpColors(lerpColors.wireframeGold, targetWoodCol, blendFactor);
      fm.glass.color.lerpColors(lerpColors.wireframeGold, lerpColors.glass, blendFactor);
      fm.balconyGlass.color.lerpColors(lerpColors.wireframeGold, lerpColors.glass, blendFactor);

      // Wireframe cage fades out smoothly as floor locks in
      const wireMesh = floorWireframes.current[index];
      if (wireMesh) {
        const wireOpacity = Math.max(0, (1 - blendFactor) * 0.85);
        wireMesh.visible = wireOpacity > 0.01;
        (wireMesh.material as THREE.Material).opacity = wireOpacity;
      }

      // ─── STAGE C: Warm Window & Balcony Downlights (0.76 to 0.96) ───
      const lightThreshold = 0.76 + (index / floorCount) * 0.18;
      if (progress >= lightThreshold) {
        const glow = Math.min(1.0, (progress - lightThreshold) / 0.04);
        fm.glass.emissive.copy(lerpColors.warmLight);
        fm.glass.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.42, glow);
        fm.downlight.emissive.copy(lerpColors.warmLight);
        fm.downlight.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.95, glow);
      } else {
        fm.glass.emissiveIntensity = 0.0;
        fm.downlight.emissiveIntensity = 0.0;
      }
    });

    // Crane motion & visibility (Construction Stage B only)
    if (craneGroup.current) {
      if (!prefersReducedMotion && progress >= 0.28 && progress < 0.74) {
        craneGroup.current.visible = true;
        craneGroup.current.rotation.y = progress * Math.PI * 4.5;
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

    // Scaffolding visibility (Construction Stage B only)
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

    // Sign "GANPATI CHS": Walnut panel with soft warm glowing letters
    if (signRef.current) {
      if (progress >= 0.82) {
        const signGlow = (progress - 0.82) / 0.18;
        sharedMaterials.signboardWood.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.22, signGlow);
        if (signTextRef.current?.material) {
          signTextRef.current.material.emissive = lerpColors.signGlow;
          signTextRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(0.1, 0.85, signGlow);
        }
      } else {
        sharedMaterials.signboardWood.emissiveIntensity = 0.0;
        if (signTextRef.current?.material) {
          signTextRef.current.material.emissiveIntensity = 0.0;
        }
      }
    }

    // Landscaping & cars revealed in finishing sequence
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

    // Floating subtle particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }

    // Sun & lighting transition (Soft warm daylight throughout, tuned exposure & architectural side-shading)
    if (sunLightRef.current && ambientLightRef.current) {
      if (progress < 0.3) {
        sunLightRef.current.intensity = 1.25;
        sunLightRef.current.color.set('#FFFDF7');
        ambientLightRef.current.intensity = 0.65;
        ambientLightRef.current.color.set('#FAF7F0');
      } else if (progress < 0.75) {
        sunLightRef.current.intensity = 1.35;
        sunLightRef.current.color.set('#FFFFFF');
        ambientLightRef.current.intensity = 0.7;
        ambientLightRef.current.color.set('#FAF7F0');
      } else {
        const warmRatio = (progress - 0.75) / 0.25;
        sunLightRef.current.intensity = THREE.MathUtils.lerp(1.35, 1.45, warmRatio);
        sunLightRef.current.color.lerpColors(new THREE.Color('#FFFFFF'), new THREE.Color('#FFF8EE'), warmRatio);
        ambientLightRef.current.color.lerpColors(new THREE.Color('#FAF7F0'), new THREE.Color('#F6EFDD'), warmRatio);
      }
    }
  });

  return (
    <>
      {/* ─── LIGHTING & ENVIRONMENT ─── */}
      <hemisphereLight args={['#FFFFFF', '#E8E2D5', 0.65]} />
      <ambientLight ref={ambientLightRef} intensity={0.68} color="#FFF6E8" />
      <directionalLight
        ref={sunLightRef}
        position={[-14, 22, 16]}
        intensity={1.35}
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

      {/* ─── SUBTLE FLOATING GOLD PARTICLES ─── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={colors.goldLight}
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      {/* ─── GROUND PLOT, ROAD & NEIGHBOURHOOD (Pale ivory backdrop) ─── */}
      <group position={[0, 0, 0]}>
        {/* Soft Contact Shadow beneath building for strong visual grounding */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[18, 16]} />
          <meshBasicMaterial
            map={textures.shadow || undefined}
            color="#2A241E"
            transparent
            opacity={textures.shadow ? 0.72 : 0.25}
          />
        </mesh>

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
        <mesh position={[-6.8, 0.55, 7.5]} material={sharedMaterials.boundaryWall}>
          <boxGeometry args={[11, 1.1, 0.25]} />
        </mesh>
        <mesh position={[6.8, 0.55, 7.5]} material={sharedMaterials.boundaryWall}>
          <boxGeometry args={[11, 1.1, 0.25]} />
        </mesh>

        {/* Entrance Gate Pillars (Walnut tone with bright white caps) */}
        <group position={[-1.2, 1.1, 7.5]}>
          <mesh material={sharedMaterials.gatePillar}>
            <boxGeometry args={[0.55, 2.2, 0.55]} />
          </mesh>
          <mesh position={[0, 1.15, 0]} material={sharedMaterials.gatePillarCap}>
            <boxGeometry args={[0.68, 0.1, 0.68]} />
          </mesh>
        </group>
        <group position={[1.2, 1.1, 7.5]}>
          <mesh material={sharedMaterials.gatePillar}>
            <boxGeometry args={[0.55, 2.2, 0.55]} />
          </mesh>
          <mesh position={[0, 1.15, 0]} material={sharedMaterials.gatePillarCap}>
            <boxGeometry args={[0.68, 0.1, 0.68]} />
          </mesh>
        </group>

        {/* Background Skyline Buildings (Pale silhouettes) */}
        {backgroundBuildings.map((b, idx) => (
          <mesh key={idx} position={b.pos} material={sharedMaterials.bgSilhouette}>
            <boxGeometry args={b.size} />
          </mesh>
        ))}

        {/* Landscaping Trees & Shrubs (Natural multi-tone greens) */}
        <group ref={treesGroupRef} visible={false}>
          {[
            { pos: [-9.5, 0, 6], shade: 0 },
            { pos: [-10.5, 0, 2], shade: 1 },
            { pos: [9.5, 0, 6], shade: 2 },
            { pos: [10.5, 0, 2], shade: 0 },
            { pos: [-11, 0, -4], shade: 1 },
            { pos: [11, 0, -4], shade: 2 },
          ].map((t, idx) => (
            <group key={idx} position={t.pos as [number, number, number]}>
              <mesh position={[0, 0.9, 0]} geometry={sharedGeometries.treeTrunk} material={sharedMaterials.walnutWood} />
              <mesh position={[0, 2.5, 0]} geometry={sharedGeometries.treeFoliage} material={sharedMaterials.foliage[t.shade]} />
            </group>
          ))}
        </group>

        {/* Cars in Stilt Parking & Entrance */}
        <group ref={carsGroupRef} visible={false}>
          {[
            { pos: [-2.4, 0.4, 1.5] as [number, number, number], rot: 0, col: '#F8FAFC' },
            { pos: [2.4, 0.4, 1.5] as [number, number, number], rot: 0, col: '#1E293B' },
            { pos: [7.5, 0.4, 9.8] as [number, number, number], rot: Math.PI / 2, col: '#D4A462' },
          ].map((car, idx) => (
            <group key={idx} position={car.pos} rotation={[0, car.rot, 0]}>
              <mesh geometry={sharedGeometries.carBody}>
                <meshStandardMaterial color={car.col} roughness={0.3} metalness={0.4} />
              </mesh>
              <mesh position={[0, 0.55, -0.2]} geometry={sharedGeometries.carCabin}>
                <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ─── STAGE A: OLD WEATHERED 4-STOREY BUILDING (Muted warm stone, authentic aging) ─── */}
      <group ref={oldBuildingGroup} position={[0, 0, 0]}>
        {/* Old Building Stilt Base */}
        <mesh position={[0, 1.0, 0]} material={stageAMaterials.stoneBase}>
          <boxGeometry args={[towerWidth * 0.9, 2.0, towerDepth * 0.9]} />
        </mesh>
        {/* 4 Weathered Floors with vertical tone gradient & rust/water stains */}
        {Array.from({ length: 4 }).map((_, fIdx) => {
          const y = 2.0 + fIdx * 1.6 + 0.8;
          return (
            <group key={fIdx} position={[0, y, 0]}>
              {/* Weathered Stone Floor Block */}
              <mesh material={stageAMaterials.stoneFloors[fIdx]}>
                <boxGeometry args={[towerWidth * 0.9, 1.5, towerDepth * 0.9]} />
              </mesh>
              {/* Concrete Water & Rust Stain Stripes */}
              <mesh
                position={[0, 0, towerDepth * 0.45 + 0.02]}
                material={fIdx % 2 === 0 ? stageAMaterials.stainRust : stageAMaterials.stainDark}
              >
                <boxGeometry args={[towerWidth * 0.88, 1.48, 0.02]} />
              </mesh>
              {/* Old Dull Grey-Blue Windows */}
              <mesh position={[-2.2, 0, towerDepth * 0.45 + 0.04]} material={stageAMaterials.dullGlass}>
                <boxGeometry args={[1.6, 0.9, 0.04]} />
              </mesh>
              <mesh position={[2.2, 0, towerDepth * 0.45 + 0.04]} material={stageAMaterials.dullGlass}>
                <boxGeometry args={[1.6, 0.9, 0.04]} />
              </mesh>
              {/* Floor Slab Divider */}
              <mesh position={[0, -0.75, 0]} material={stageAMaterials.stainDark}>
                <boxGeometry args={[towerWidth * 0.92, 0.12, towerDepth * 0.92]} />
              </mesh>
            </group>
          );
        })}
        {/* Rusted Water Tank on Old Roof */}
        <mesh position={[2.0, 8.9, 0]} material={stageAMaterials.stainRust}>
          <cylinderGeometry args={[0.9, 0.9, 1.4, 12]} />
        </mesh>
      </group>

      {/* ─── STAGE B & C: NEW 8-STOREY GANPATI TOWER ─── */}
      <group ref={newTowerGroup} position={[0, 0, 0]} visible={false}>
        {/* Stilt Parking Ground Floor (Level 0) */}
        <group ref={stiltGroupRef} position={[0, 0, 0]}>
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
          <mesh position={[0, stiltHeight / 2, 1.62]} material={sharedMaterials.mullions}>
            <boxGeometry args={[2.84, stiltHeight - 0.16, 0.06]} />
          </mesh>
          <mesh position={[0, stiltHeight / 2, 1.64]} material={floorMaterials[0].glass}>
            <boxGeometry args={[2.76, stiltHeight - 0.24, 0.05]} />
          </mesh>

          {/* Dark parking recess behind louvres */}
          <mesh position={[0, stiltHeight / 2, towerDepth * 0.46]} material={sharedMaterials.stiltRecessDark}>
            <boxGeometry args={[towerWidth - 0.15, stiltHeight - 0.3, 0.08]} />
          </mesh>

          {/* Alternating White & Walnut Louvre Strips */}
          {[-1.8, -1.5, -1.2, -0.9, -0.6].map((ly, idx) => (
            <mesh
              key={idx}
              position={[0, stiltHeight + ly, towerDepth * 0.48]}
              geometry={sharedGeometries.louver}
              material={idx % 2 === 0 ? sharedMaterials.stiltLouvreWhite : sharedMaterials.stiltLouvreWalnut}
            />
          ))}
        </group>

        {/* Typical Floors 1 to 8 (Stacked with procedural ease-in & colour lerp) */}
        <group position={[0, stiltHeight, 0]}>
          {Array.from({ length: floorCount }).map((_, fIdx) => (
            <group
              key={fIdx}
              ref={(el) => {
                floorGroups.current[fIdx] = el;
              }}
              position={[0, fIdx * floorHeight, 0]}
            >
              {/* Wireframe blueprint overlay (visible only during rise in Stage B) */}
              <mesh
                ref={(el) => {
                  floorWireframes.current[fIdx] = el;
                }}
                position={[0, floorHeight / 2, 0]}
                geometry={sharedGeometries.floorWireCage}
                material={sharedMaterials.blueprintWireframe}
                visible={false}
              />

              {/* Floor Slab with Cantilevered White Architectural Framing */}
              <mesh position={[0, floorHeight, 0]} geometry={sharedGeometries.slab} material={floorMaterials[fIdx].frame} />

              {/* Side Columns */}
              <mesh position={[-towerWidth * 0.44, floorHeight / 2, towerDepth * 0.42]} geometry={sharedGeometries.column} material={floorMaterials[fIdx].frame} />
              <mesh position={[towerWidth * 0.44, floorHeight / 2, towerDepth * 0.42]} geometry={sharedGeometries.column} material={floorMaterials[fIdx].frame} />

              {/* White Architectural Staggered Framing Flanges */}
              <mesh position={[-towerWidth * 0.46, floorHeight / 2, 0]} material={floorMaterials[fIdx].frame}>
                <boxGeometry args={[0.35, floorHeight + 0.1, towerDepth + 0.3]} />
              </mesh>
              <mesh position={[towerWidth * 0.46, floorHeight / 2, 0]} material={floorMaterials[fIdx].frame}>
                <boxGeometry args={[0.35, floorHeight + 0.1, towerDepth + 0.3]} />
              </mesh>

              {/* Walnut Wood Finish Spandrel Band Beneath Balcony */}
              <mesh position={[0, 0.25, towerDepth * 0.44]} material={floorMaterials[fIdx].wood}>
                <boxGeometry args={[towerWidth * 0.84, 0.45, 0.15]} />
              </mesh>

              {/* Floor-to-Ceiling Windows with Thin Dark Mullions & Deep Interior Backing */}
              {/* Left Window Group */}
              <group position={[-2.2, floorHeight / 2, towerDepth * 0.4]}>
                {/* Dark Interior Room Backing Plane */}
                <mesh position={[0, 0, -0.06]} geometry={sharedGeometries.windowBacking} material={sharedMaterials.interiorBacking} />
                {/* Exterior Sky-Blue Window Glass */}
                <mesh geometry={sharedGeometries.glassFront} material={floorMaterials[fIdx].glass} />
                {/* Vertical Center Mullion */}
                <mesh position={[0, 0, 0.02]} geometry={sharedGeometries.mullionV} material={sharedMaterials.mullions} />
                {/* Horizontal Transom Mullion */}
                <mesh position={[0, 0.22, 0.02]} geometry={sharedGeometries.mullionH} material={sharedMaterials.mullions} />
              </group>

              {/* Right Window Group */}
              <group position={[2.2, floorHeight / 2, towerDepth * 0.4]}>
                {/* Dark Interior Room Backing Plane */}
                <mesh position={[0, 0, -0.06]} geometry={sharedGeometries.windowBacking} material={sharedMaterials.interiorBacking} />
                {/* Exterior Sky-Blue Window Glass */}
                <mesh geometry={sharedGeometries.glassFront} material={floorMaterials[fIdx].glass} />
                {/* Vertical Center Mullion */}
                <mesh position={[0, 0, 0.02]} geometry={sharedGeometries.mullionV} material={sharedMaterials.mullions} />
                {/* Horizontal Transom Mullion */}
                <mesh position={[0, 0.22, 0.02]} geometry={sharedGeometries.mullionH} material={sharedMaterials.mullions} />
              </group>

              {/* Cantilevered Glass Balcony with Walnut Underside Soffit & Downlight */}
              <group position={[0, 0.1, towerDepth * 0.4 + 0.7]}>
                {/* Balcony Top Slab */}
                <mesh geometry={sharedGeometries.balconySlab} material={floorMaterials[fIdx].frame} />
                {/* Walnut Wood Underside Soffit */}
                <mesh position={[0, -0.065, 0]} geometry={sharedGeometries.balconySoffit} material={floorMaterials[fIdx].wood} />
                {/* Recessed Warm Downlight Dot */}
                <mesh position={[0, -0.075, 0.3]} geometry={sharedGeometries.downlightDot} material={floorMaterials[fIdx].downlight} />
                {/* Glass Balcony Railing with Sky Blue Gradient */}
                <mesh position={[0, 0.45, 0.65]} geometry={sharedGeometries.balconyGlass} material={floorMaterials[fIdx].balconyGlass} />
                {/* Dark Balcony Rail */}
                <mesh position={[0, 0.88, 0.65]} geometry={sharedGeometries.balconyRail} material={sharedMaterials.mullions} />
              </group>

              {/* Alternating AC Units on windows */}
              {fIdx % 2 === 0 ? (
                <mesh position={[-3.8, 0.5, towerDepth * 0.45]} geometry={sharedGeometries.acUnit} material={sharedMaterials.mullions} />
              ) : (
                <mesh position={[3.8, 0.5, towerDepth * 0.45]} geometry={sharedGeometries.acUnit} material={sharedMaterials.mullions} />
              )}
            </group>
          ))}

          {/* Roof Terrace, Water Tank, Lift Machine Room & GANPATI CHS Signboard */}
          <group position={[0, floorCount * floorHeight, 0]}>
            {/* Terrace Parapet Wall */}
            <mesh position={[0, 0.4, 0]} material={sharedMaterials.whiteFrame}>
              <boxGeometry args={[towerWidth + 0.4, 0.8, towerDepth + 0.4]} />
            </mesh>

            {/* Grand Crown Roof Canopy with Walnut Underside Soffit */}
            <group position={[0, 2.3, 0]}>
              <mesh position={[0, 0.12, 0]} material={sharedMaterials.whiteFrame}>
                <boxGeometry args={[towerWidth + 0.6, 0.24, towerDepth + 0.6]} />
              </mesh>
              <mesh position={[0, -0.01, 0]} material={sharedMaterials.walnutWood}>
                <boxGeometry args={[towerWidth + 0.5, 0.02, towerDepth + 0.5]} />
              </mesh>
            </group>

            {/* Lift Machine Room */}
            <mesh position={[-1.8, 1.2, -1.2]} material={sharedMaterials.whiteFrame}>
              <boxGeometry args={[3.2, 1.8, 3.0]} />
            </mesh>

            {/* Modern Cladded Water Tank */}
            <mesh position={[2.2, 1.1, -1.2]} material={sharedMaterials.walnutWood}>
              <boxGeometry args={[2.4, 1.5, 2.4]} />
            </mesh>

            {/* Grand Crown Signboard: White Letters on Walnut Wood Panel */}
            <group position={[0, 1.2, towerDepth * 0.48]}>
              <mesh ref={signRef} material={sharedMaterials.signboardWood}>
                <boxGeometry args={[6.2, 0.9, 0.25]} />
              </mesh>
              <Text
                ref={signTextRef}
                position={[0, 0, 0.16]}
                fontSize={0.42}
                color="#FFFFFF"
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
          <mesh position={[0, 2.5, 0]} material={sharedMaterials.craneYellow}>
            <boxGeometry args={[0.6, 5.0, 0.6]} />
          </mesh>
          <mesh position={[-2.5, 5.2, 0]} material={sharedMaterials.craneYellow}>
            <boxGeometry args={[6.5, 0.4, 0.4]} />
          </mesh>
          <mesh position={[1.2, 5.2, 0]} material={sharedMaterials.mullions}>
            <boxGeometry args={[1.2, 0.7, 0.7]} />
          </mesh>
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
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.95,
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
      <color attach="background" args={[BUILDING_PALETTE.environment.fog]} />
      <fog attach="fog" args={[BUILDING_PALETTE.environment.fog, 28, 80]} />
      <SceneContent
        progressRef={progressRef}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
      />
    </Canvas>
  );
}
