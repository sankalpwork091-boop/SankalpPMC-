import { create } from 'zustand';

interface ScrollState {
  /** Index of the currently active section (0-17) */
  activeSection: number;
  /** Per-section progress (0→1), keyed by section index */
  sectionProgress: Record<number, number>;
  /** Overall page scroll progress (0→1) */
  globalProgress: number;
  /** Whether the 3D canvas should render */
  canvasActive: boolean;

  // Actions
  setSectionProgress: (section: number, progress: number) => void;
  setActiveSection: (section: number) => void;
  setGlobalProgress: (progress: number) => void;
  setCanvasActive: (active: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  activeSection: 0,
  sectionProgress: {},
  globalProgress: 0,
  canvasActive: true,

  setSectionProgress: (section, progress) =>
    set((state) => ({
      sectionProgress: { ...state.sectionProgress, [section]: progress },
    })),

  setActiveSection: (section) => set({ activeSection: section }),

  setGlobalProgress: (progress) => set({ globalProgress: progress }),

  setCanvasActive: (active) => set({ canvasActive: active }),
}));
