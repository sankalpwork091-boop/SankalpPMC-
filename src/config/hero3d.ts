/**
 * Hero 3D Building Configuration & Kill-Switch
 * Sankalp PMC Architecture
 *
 * To disable the 3D procedural building and revert to the original canvas/fallback,
 * set ENABLE_3D_BUILDING_HERO = false or append ?no3dbuilding=true in the browser.
 */

export const ENABLE_3D_BUILDING_HERO = true;

/**
 * Scroll-scrubbed construction video in place of the live 3D scene.
 * Set to false, or append ?novideo=true, to restore the live 3D hero.
 */
export const ENABLE_VIDEO_HERO = true;

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
    concreteWhite: '#FFFFFF',
    woodAccent: '#78350f',      // Walnut wood finish
    darkBands: '#1B1B1F',       // Charcoal contrast bands
    glassDay: '#E0F2FE',       // Clear daylight glass
    glassLit: '#FEF08A',       // Warm yellow lit windows
    goldSign: '#B8913A',       // Royal primary gold
    goldLight: '#D4AF5A',      // Royal light gold
    goldDeep: '#8F6B1E',       // Royal deep gold
    oldConcrete: '#D8D2C6',    // Warm aged concrete
    oldStains: '#BCB3A4',      // Warm weathered stains
    oldWindow: '#7C756B',      // Aged warm glass
    road: '#E5DFD3',           // Pale warm grey road
    grass: '#15803d',
    ground: '#FAF7F0',         // Warm ivory ground plot
    stiltWall: '#EDE7DC',      // Warm ivory boundary walls
    bgSilhouette: '#EAE4D8',   // Pale background building silhouettes
    fog: '#FAF7F0',            // Warm ivory atmospheric fog
    wireframeGold: '#B8913A',  // Gold wireframe (replaces cyan)
    scaffoldGold: '#D4AF5A',   // Gold scaffolding (replaces cyan)
  },
};
