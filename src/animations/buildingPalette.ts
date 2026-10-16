/**
 * Procedural Building Palette
 * Re-exports from scenePalette.ts (single source of truth)
 * Sankalp PMC — Ganpati CHS 3D Hero Transformation
 */

import { SCENE_PALETTE } from './scenePalette';

export const BUILDING_PALETTE = {
  stageC: {
    frameWhite: SCENE_PALETTE.stageC.frameWhite,
    frameWhiteTrim: SCENE_PALETTE.stageC.frameWhiteTopHighlight,
    frameWhiteShade: SCENE_PALETTE.stageC.frameWhiteSideShade,
    walnut: SCENE_PALETTE.stageC.walnut,
    walnutDark: SCENE_PALETTE.stageC.walnutDark,
    walnutLight: SCENE_PALETTE.stageC.walnutLight,
    walnutWarm: SCENE_PALETTE.stageC.walnutWarm,
    glass: SCENE_PALETTE.stageC.glassBlue,
    glassDeep: SCENE_PALETTE.stageC.glassBlueDeep,
    glassLight: SCENE_PALETTE.stageC.glassBlueLight,
    mullions: SCENE_PALETTE.stageC.darkMullions,
    darkAccents: SCENE_PALETTE.stageC.darkRecessedBands,
    stiltLouvreWhite: SCENE_PALETTE.stageC.stiltLouvreWhite,
    stiltLouvreWalnut: SCENE_PALETTE.stageC.stiltLouvreWalnut,
    stiltRecessDark: SCENE_PALETTE.stageC.stiltRecessDark,
    signboardWood: SCENE_PALETTE.stageC.signboardWalnut,
    signboardLetter: SCENE_PALETTE.stageC.goldSign,
    signboardGlow: SCENE_PALETTE.stageC.signboardGlow,
    gatePillarWalnut: SCENE_PALETTE.stageC.pillarWalnut,
    gatePillarCapWhite: SCENE_PALETTE.stageC.pillarCapStageC,
    palmGreen: SCENE_PALETTE.stageC.leafGreen,
    palmGreenLight: SCENE_PALETTE.stageC.leafGreenLight,
    palmGreenDeep: SCENE_PALETTE.stageC.leafGreenDark,
    warmLight: SCENE_PALETTE.stageC.warmLight,
    warmLightLit: SCENE_PALETTE.stageC.warmLightLit,
  },
  stageA: {
    stoneBase: SCENE_PALETTE.stageA.plinth,
    stoneFloor1: SCENE_PALETTE.stageA.stoneFloorA,
    stoneFloor2: SCENE_PALETTE.stageA.stoneFloorB,
    stoneFloor3: SCENE_PALETTE.stageA.stoneFloorA,
    stoneFloor4: SCENE_PALETTE.stageA.stoneFloorB,
    stainRust: SCENE_PALETTE.stageA.stainTone,
    stainDark: SCENE_PALETTE.stageA.stainPatch,
    dullGlass: SCENE_PALETTE.stageA.dullGlass,
    fadedWood: SCENE_PALETTE.stageA.pillarWalnut,
  },
  stageB: {
    wireframeGold: SCENE_PALETTE.stageB.wireframeGold,
    scaffoldGold: SCENE_PALETTE.stageB.scaffoldGold,
    craneGold: SCENE_PALETTE.stageB.craneGold,
  },
  environment: {
    fog: SCENE_PALETTE.sky.fog,
    ground: SCENE_PALETTE.ground.sand,
    road: SCENE_PALETTE.ground.road,
    bgSilhouette: SCENE_PALETTE.backgroundBuildings.warm,
  },
} as const;

export type BuildingPalette = typeof BUILDING_PALETTE;
