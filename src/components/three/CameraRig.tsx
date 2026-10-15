'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/hooks/useScrollStore';

// Waypoints corresponding to the storytelling journey
interface CameraWaypoint {
  pos: [number, number, number];
  lookAt: [number, number, number];
}

const SECTION_WAYPOINTS: Record<number, CameraWaypoint> = {
  // Hero: classic society view
  0: { pos: [0, 4, 18], lookAt: [0, 4, 0] },
  // Foreword & Philosophy
  1: { pos: [-8, 5, 16], lookAt: [0, 4, 0] },
  2: { pos: [8, 4, 15], lookAt: [0, 4, 0] },

  // Step 1: Appointment (Blueprint Wireframe)
  3: { pos: [-5, 6, 17], lookAt: [0, 6, 0] },
  // Step 2: Legal Check & Feasibility (Scan Laser)
  4: { pos: [0, 5, 15], lookAt: [0, 4, 0] },
  // Step 3: Tendering (Tower Massing Options)
  5: { pos: [10, 8, 16], lookAt: [0, 6, 0] },
  // Step 4: 79A Compliance (Legal Shield)
  6: { pos: [0, 7, 18], lookAt: [0, 7, 0] },
  // Step 5: Offer Evaluation (Podium & Architecture)
  7: { pos: [-8, 6, 14], lookAt: [0, 5, 0] },
  // Step 6: Agreement Structuring (Advocate Shield)
  8: { pos: [6, 7, 15], lookAt: [0, 7, 0] },
  // Step 7: Approvals (Foundation & Ground Clearances)
  9: { pos: [-4, 3, 14], lookAt: [0, 3, 0] },
  // Step 8: Execution Monitoring (Crane rising floor by floor)
  10: { pos: [8, 14, 20], lookAt: [0, 10, 0] },
  // Step 9: Occupancy Certificate (Crown & Glass completion)
  11: { pos: [0, 18, 22], lookAt: [0, 14, 0] },
  // Step 10: Handover (Golden Hour Sunset Victory Shot)
  12: { pos: [-6, 10, 18], lookAt: [0, 9, 0] },

  // Remaining Sections: background cinematic position
  13: { pos: [9, 12, 22], lookAt: [0, 10, 0] },
  14: { pos: [-8, 12, 20], lookAt: [0, 10, 0] },
  15: { pos: [7, 14, 24], lookAt: [0, 11, 0] },
  16: { pos: [-6, 12, 22], lookAt: [0, 10, 0] },
  17: { pos: [0, 10, 20], lookAt: [0, 9, 0] },
};

export function CameraRig() {
  const activeSection = useScrollStore((s) => s.activeSection);
  const sectionProgress = useScrollStore(
    (s) => s.sectionProgress[s.activeSection] ?? 0
  );

  const currentPos = useRef(new THREE.Vector3(0, 4, 18));
  const currentLookAt = useRef(new THREE.Vector3(0, 4, 0));

  useFrame((state, delta) => {
    // Current target waypoint
    const currentWaypoint = SECTION_WAYPOINTS[activeSection] || SECTION_WAYPOINTS[0];
    const nextWaypoint =
      SECTION_WAYPOINTS[Math.min(17, activeSection + 1)] || currentWaypoint;

    // Interpolate between current and next waypoint by sectionProgress
    const targetX = THREE.MathUtils.lerp(
      currentWaypoint.pos[0],
      nextWaypoint.pos[0],
      sectionProgress
    );
    const targetY = THREE.MathUtils.lerp(
      currentWaypoint.pos[1],
      nextWaypoint.pos[1],
      sectionProgress
    );
    const targetZ = THREE.MathUtils.lerp(
      currentWaypoint.pos[2],
      nextWaypoint.pos[2],
      sectionProgress
    );

    const lookTargetX = THREE.MathUtils.lerp(
      currentWaypoint.lookAt[0],
      nextWaypoint.lookAt[0],
      sectionProgress
    );
    const lookTargetY = THREE.MathUtils.lerp(
      currentWaypoint.lookAt[1],
      nextWaypoint.lookAt[1],
      sectionProgress
    );
    const lookTargetZ = THREE.MathUtils.lerp(
      currentWaypoint.lookAt[2],
      nextWaypoint.lookAt[2],
      sectionProgress
    );

    // Subtle natural mouse/gyro drift
    const mouseDriftX = (state.pointer.x * 0.4);
    const mouseDriftY = (state.pointer.y * 0.2);

    // Smoothly damp towards calculated targets (60fps lerp)
    const smoothFactor = Math.min(1, delta * 3.5);
    currentPos.current.x += (targetX + mouseDriftX - currentPos.current.x) * smoothFactor;
    currentPos.current.y += (targetY + mouseDriftY - currentPos.current.y) * smoothFactor;
    currentPos.current.z += (targetZ - currentPos.current.z) * smoothFactor;

    currentLookAt.current.x += (lookTargetX - currentLookAt.current.x) * smoothFactor;
    currentLookAt.current.y += (lookTargetY - currentLookAt.current.y) * smoothFactor;
    currentLookAt.current.z += (lookTargetZ - currentLookAt.current.z) * smoothFactor;

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
