/**
 * Procedural Building Palette
 * Sampled directly from public/ref/ganpati-final.jpg
 * Sankalp PMC — Ganpati CHS 3D Hero Transformation
 */

export const BUILDING_PALETTE = {
  // ─── STAGE C: Completed Landmark (Rich architectural render palette) ───
  stageC: {
    // White architectural frames & slabs (matte, roughness ~0.8)
    frameWhite: '#F3F1EC',
    frameWhiteTrim: '#FAF8F3',
    frameWhiteShade: '#DDD9D0',

    // Natural walnut wood bands, balcony soffits, and crown canopy
    walnut: '#734526',
    walnutDark: '#5C331B',
    walnutLight: '#8A5A34',
    walnutWarm: '#7B4A2B',

    // Glass facades & balconies with light blue daylight reflections
    glass: '#7FAFD0',
    glassDeep: '#5A8DB5',
    glassLight: '#A9CBE3',
    glassCurtain: '#F5EFE6',

    // Dark window mullions & architectural accent reveals
    mullions: '#2B2F38',
    darkAccents: '#1F2228',

    // Stilt floor alternating louvre strips & parking bays
    stiltLouvreWhite: '#F0ECE4',
    stiltLouvreWalnut: '#6B4026',
    stiltRecessDark: '#222329',

    // Grand crown sign "GANPATI CHS"
    signboardWood: '#6E3E22',
    signboardLetter: '#FFFFFF',
    signboardGlow: '#FFE5B4',

    // Compound entrance gate pillars & boundary
    gatePillarWalnut: '#6B4026',
    gatePillarCapWhite: '#F3F1EC',
    gateFencingDark: '#2B2F38',

    // Natural landscaping greens
    palmGreen: '#3F7A3A',
    palmGreenLight: '#52964A',
    palmGreenDeep: '#2F5C2B',

    // Warm window & balcony downlights (emissive warm white-gold)
    warmLight: '#FFD9A0',
    warmLightLit: '#FFE8C2',
  },

  // ─── STAGE A: Existing Society (Weathered, aged stone, muted low-saturation) ───
  stageA: {
    stoneBase: '#A49E92',
    stoneFloor1: '#A8A296',
    stoneFloor2: '#B0AA9E',
    stoneFloor3: '#B8B2A6',
    stoneFloor4: '#C0BAAE',
    stainRust: '#857463',
    stainDark: '#6E6152',
    dullGlass: '#7C8B94',
    fadedWood: '#756654',
  },

  // ─── STAGE B: Construction Blueprint ───
  stageB: {
    wireframeGold: '#B8913A',
    scaffoldGold: '#D4AF5A',
    craneGold: '#B8913A',
  },

  // ─── Surrounding Environment (Kept pale ivory/warm grey to let building pop) ───
  environment: {
    fog: '#FAF7F0',
    ground: '#FAF7F0',
    road: '#E5DFD3',
    bgSilhouette: '#EAE4D8',
  },
} as const;

export type BuildingPalette = typeof BUILDING_PALETTE;
