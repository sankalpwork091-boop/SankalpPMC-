'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useScrollStore } from '@/hooks/useScrollStore';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { OldBuilding } from './OldBuilding';
import { NewTower } from './NewTower';
import { BlueprintOverlay } from './BlueprintOverlay';
import { ConstructionRig } from './ConstructionRig';
import { Skyline } from './Skyline';
import { Atmosphere } from './Atmosphere';
import { CameraRig } from './CameraRig';
import { Fallback2D } from './Fallback2D';

export function Scene() {
  const activeSection = useScrollStore((s) => s.activeSection);
  const sectionProgress = useScrollStore(
    (s) => s.sectionProgress[s.activeSection] ?? 0
  );
  const capability = useDeviceCapability();

  // Fallback to 2D vector for low-end devices, reduced motion, save-data, or missing WebGL2
  const showFallback =
    !capability.hasWebGL2 ||
    capability.prefersReducedMotion ||
    capability.saveData ||
    (capability.isLowEnd && capability.isMobile);

  // Scene state derived from scroll position
  const sceneState = useMemo(() => {
    // 0-2: Pure Old Building
    // 3-6: Old Building + Blueprints / Legal scanning
    // 7-9: Transition / Foundation / Groundwork
    // 10: Construction Execution (Floors rise)
    // 11: Occupancy Certificate (Finishes complete)
    // 12-17: Completed Tower in Golden Sunset Glow

    let oldOpacity = 1;
    let newOpacity = 0;
    let towerProgress = 0;
    let windowGlow = 0;
    let goldenHour = 0;
    let blueprintActive = false;
    let blueprintMode: 'blueprint' | 'scan' | 'shield' = 'blueprint';
    let constructionActive = false;

    if (activeSection <= 2) {
      oldOpacity = 1;
      newOpacity = 0;
      towerProgress = 0;
    } else if (activeSection === 3) {
      // Step 1: Appointment
      oldOpacity = 1;
      blueprintActive = true;
      blueprintMode = 'blueprint';
    } else if (activeSection === 4) {
      // Step 2: Legal Feasibility
      oldOpacity = 1;
      blueprintActive = true;
      blueprintMode = 'scan';
    } else if (activeSection === 5) {
      // Step 3: Tendering
      oldOpacity = 0.9;
      newOpacity = 0.3;
      towerProgress = 0.2;
      blueprintActive = true;
      blueprintMode = 'blueprint';
    } else if (activeSection === 6) {
      // Step 4: 79A Compliance
      oldOpacity = 0.85;
      newOpacity = 0.4;
      towerProgress = 0.25;
      blueprintActive = true;
      blueprintMode = 'shield';
    } else if (activeSection === 7) {
      // Step 5: Offer Evaluation & Plan Finalization
      oldOpacity = 0.7;
      newOpacity = 0.6;
      towerProgress = 0.35;
    } else if (activeSection === 8) {
      // Step 6: Agreement Structuring
      oldOpacity = 0.5;
      newOpacity = 0.75;
      towerProgress = 0.4;
      blueprintActive = true;
      blueprintMode = 'shield';
    } else if (activeSection === 9) {
      // Step 7: Approvals
      oldOpacity = 0.3;
      newOpacity = 0.85;
      towerProgress = 0.5;
      constructionActive = true;
    } else if (activeSection === 10) {
      // Step 8: Execution Monitoring (tower rises through the section)
      oldOpacity = Math.max(0, 0.3 - sectionProgress * 0.3);
      newOpacity = 1;
      towerProgress = 0.5 + sectionProgress * 0.35;
      constructionActive = true;
    } else if (activeSection === 11) {
      // Step 9: Occupancy Certificate
      oldOpacity = 0;
      newOpacity = 1;
      towerProgress = 0.92;
      windowGlow = 0.3;
      goldenHour = 0.4;
    } else {
      // Step 10: Handover (12) and Remaining Sections (13-17)
      oldOpacity = 0;
      newOpacity = 1;
      towerProgress = 1.0;
      windowGlow = 1.0;
      goldenHour = 1.0;
    }

    return {
      oldOpacity,
      newOpacity,
      towerProgress,
      windowGlow,
      goldenHour,
      blueprintActive,
      blueprintMode,
      constructionActive,
    };
  }, [activeSection, sectionProgress]);

  if (showFallback) {
    return <Fallback2D activeSection={activeSection} progress={sectionProgress} />;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        shadows={!capability.isLowEnd && !capability.isMobile}
        dpr={capability.isMobile ? 1.0 : Math.min(capability.maxDpr, 1.5)}
        gl={{
          antialias: !capability.isMobile,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{ position: [0, 4, 18], fov: 45, near: 0.1, far: 120 }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Atmosphere goldenHour={sceneState.goldenHour} />
          <Skyline />

          {/* Building Transformation Group */}
          <group position={[0, 0, 0]}>
            <OldBuilding opacity={sceneState.oldOpacity} />
            <NewTower
              progress={sceneState.towerProgress}
              windowGlow={sceneState.windowGlow}
              opacity={sceneState.newOpacity}
            />
            <BlueprintOverlay
              active={sceneState.blueprintActive}
              scanProgress={sectionProgress}
              mode={sceneState.blueprintMode}
            />
            <ConstructionRig
              active={sceneState.constructionActive}
              towerHeight={sceneState.towerProgress * 20}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
