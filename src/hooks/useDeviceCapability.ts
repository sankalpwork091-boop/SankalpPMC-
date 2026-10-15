'use client';

import { useEffect, useState } from 'react';

interface DeviceCapability {
  /** True if device is likely low-end */
  isLowEnd: boolean;
  /** True if user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** True if user has save-data enabled */
  saveData: boolean;
  /** True if WebGL2 is supported */
  hasWebGL2: boolean;
  /** Recommended max device pixel ratio */
  maxDpr: number;
  /** True if mobile viewport */
  isMobile: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    isLowEnd: false,
    prefersReducedMotion: false,
    saveData: false,
    hasWebGL2: true,
    maxDpr: 1.75,
    isMobile: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithFeatures;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const saveData = !!(nav.connection && nav.connection.saveData);

    const cores = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4;

    let hasWebGL2 = true;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL2 = !!canvas.getContext('webgl2');
    } catch {
      hasWebGL2 = false;
    }

    const isMobile = window.innerWidth < 768;
    const isLowEnd =
      cores <= 4 || memory <= 2 || !hasWebGL2 || saveData;

    const maxDpr = isMobile ? 1.25 : 1.75;

    setCapability({
      isLowEnd,
      prefersReducedMotion,
      saveData,
      hasWebGL2,
      maxDpr,
      isMobile,
    });
  }, []);

  return capability;
}

interface NavigatorWithFeatures extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData: boolean;
    effectiveType?: string;
  };
}
