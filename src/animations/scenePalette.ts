/**
 * Procedural Scene & Building Palette
 * Single source of truth for 3D Hero Scene
 * Sankalp PMC — Ganpati CHS 3D Hero Transformation
 */

export const SCENE_PALETTE = {
  // ─── Environment & Sky ───
  sky: {
    hazeTop: '#EAF0F4',
    ivoryBottom: '#F4F3EE',
    stageCSky: '#E6EFF6',
    fog: '#EAF0F4',
  },

  // ─── Ground & Civil Surroundings ───
  ground: {
    sand: '#E6E0D0',
    road: '#D9D3C4',
    laneMarks: '#FAF7F0',
    compoundWall: '#D8CFBB',
  },

  // ─── Distant Background Silhouettes (low contrast silhouettes) ───
  backgroundBuildings: {
    cool: '#D9DFE4',
    warm: '#E3DDD2',
  },

  // ─── Stage C: Completed Landmark Building ───
  stageC: {
    // White frame slabs (matte, roughness ~0.8)
    frameWhite: '#F6F3EC',
    frameWhiteSideShade: '#ECE6DC', // subtle shade on side faces to separate from pale background
    frameWhiteTopHighlight: '#FAF8F3',

    // Walnut wood (#7A4A2B, range #6B4026 to #8A5A34 for natural floor-by-floor variation)
    walnut: '#7A4A2B',
    walnutLight: '#8A5A34',
    walnutDark: '#6B4026',
    walnutWarm: '#734526',

    // Glass facades & balconies with light blue daylight reflections
    glassBlue: '#9CC3DD',
    glassBlueLight: '#BFDCF0',
    glassBlueDeep: '#87B1CE',
    glassCurtain: '#EFECE6', // soft white daylight curtains behind windows matching ganpati-final.jpg

    // Dark window mullions & recessed bands
    darkMullions: '#2B2F38',
    darkRecessedBands: '#2B2F38',

    // Stilt floor alternating louvre strips
    stiltLouvreWhite: '#F6F3EC',
    stiltLouvreWalnut: '#7A4A2B',
    stiltRecessDark: '#23262D',

    // Gold "GANPATI CHS" sign on walnut panel
    goldSign: '#B8913A',
    signboardWalnut: '#6B4026',
    signboardGlow: '#FFE5B4',

    // Entrance Gate Pillars
    pillarWalnut: '#6B4026',
    pillarCap: '#EDE8DC',
    pillarCapStageC: '#F6F3EC',

    // Warm downlights & window glow
    warmLight: '#FFD9A0',
    warmLightLit: '#FFE4B8',

    // Landscaping (two palms + shrubs)
    leafGreen: '#6E9A62',
    leafGreenLight: '#7EA673',
    leafGreenDark: '#5E8853',
  },

  // ─── Stage A: Existing Society (Aged warm stone, low saturation, authentic weathering) ───
  stageA: {
    plinth: '#A89886',
    stoneFloorA: '#B9A48C',
    stoneFloorB: '#AE977E',
    stainTone: '#A08A72',
    stainPatch: '#98836C',
    dullGlass: '#8FA3B0',
    pillarWalnut: '#6B4026',
    pillarCap: '#EDE8DC',
    waterTank: '#A08A72',
    mutedTreeGreen: '#86A07A',
  },

  // ─── Stage B: Construction Blueprint ───
  stageB: {
    wireframeGold: '#B8913A',
    scaffoldGold: '#D4AF5A',
    craneGold: '#B8913A',
  },

  // ─── Lighting Rig Values ───
  lighting: {
    keyLightColor: '#FFF4DC', // warm-white key light from upper left
    keyLightIntensity: 1.35,
    hemiSky: '#EAF0F4',
    hemiGround: '#E6E0D0',
    hemiIntensity: 0.7,
    ambientColor: '#F7F3EB',
    ambientIntensity: 0.42,
    toneMappingExposure: 0.95, // 0.9-1.0 so whites don't blow out and wood/glass keep colour
  },
} as const;

export type ScenePalette = typeof SCENE_PALETTE;
