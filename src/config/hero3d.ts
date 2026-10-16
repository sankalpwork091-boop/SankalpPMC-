/**
 * Hero 3D Building Configuration & Kill-Switch
 * Sankalp PMC Architecture
 *
 * To disable the 3D procedural building and revert to the original canvas/fallback,
 * set ENABLE_3D_BUILDING_HERO = false or append ?no3dbuilding=true in the browser.
 */

export const ENABLE_3D_BUILDING_HERO = true;

export const HERO_3D_SETTINGS = {
  floorCount: 8,
  floorHeight: 1.8,
  towerWidth: 8.5,
  towerDepth: 7.0,
  stiltHeight: 2.2,
  camera: {
    startPos: [0, 2.5, 24] as [number, number, number],
    endPos: [11, 10, 19] as [number, number, number],
    startTarget: [0, 4, 0] as [number, number, number],
    endTarget: [0, 8, 0] as [number, number, number],
  },
  colors: {
    concreteWhite: '#f8fafc',
    woodAccent: '#78350f',      // Walnut wood finish
    darkBands: '#1e293b',
    glassDay: '#38bdf8',
    glassLit: '#fef08a',       // Warm yellow lit windows
    goldSign: '#D4A462',
    oldConcrete: '#64748b',
    oldStains: '#475569',
    road: '#1e293b',
    grass: '#15803d',
    blueprintCyan: '#06b6d4',
  },
};
