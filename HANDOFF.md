# Sankalp PMC — Project Handoff & Status

## Project Overview
A premium, award-level 3D scroll-driven website for **Sankalp Project Management Consultants Pvt. Ltd.**, a redevelopment consultancy for co-operative housing societies in Navi Mumbai / MMR.

- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Three.js / React Three Fiber / Drei / Postprocessing, GSAP ScrollTrigger, Lenis Smooth Scroll, Framer Motion, Zustand.
- **Design Tokens**: Deep Navy (`#0c1421`), Warm Stone/Ivory (`#f5f2eb`), Heritage Gold (`#d4a237`), crisp typography (Playfair Display + Inter).

---

## Completed Work
1. **Repository Setup**: Initialized Next.js 16 + React 19 with dependencies (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`, `lenis`, `zustand`, `framer-motion`).
2. **Step 0 Asset Ingestion**: Downloaded 80+ real images, logos, project thumbnails, and award assets from old site to `public/images/`.
3. **Data Layer (`src/data/`)**:
   - `siteConfig.ts`: Contact info, addresses, stats, brand foreword, navigation.
   - `process.ts`: 10-step redevelopment process definitions with scene hints.
   - `projects.ts`: 15+ real projects categorized (Upcoming, Ongoing, Completed) with thumbnails.
   - `services.ts`: 6 core services (Legal, Architectural, Construction, Design, Liaisoning, Financial).
   - `team.ts`: Leadership and board members.
   - `awards.ts`: Company achievements and award details.
   - `updates.ts`: Press and milestone updates.
   - `media.ts`: Dual-mode switch (procedural 3D scene vs AI-generated video/frame sequence per step).
4. **Design System & Base Layout**:
   - `src/app/globals.css`: Full color tokens, custom scrollbars, glass card utilities, process rail, reduced motion support.
   - `src/hooks/useScrollStore.ts`: Zustand store bridging GSAP ScrollTrigger to R3F (per-step 0-1 progress).
   - `src/hooks/useDeviceCapability.ts`: WebGL2, GPU concurrency, memory, network save-data detection.
   - `src/components/scroll/LenisProvider.tsx`: Smooth scroll provider for 60fps scrolling.
   - `src/components/layout/Header.tsx`: Responsive floating glass header with mobile sheet navigation.
   - `src/components/layout/Footer.tsx`: Comprehensive corporate footer with address cards, links, contact info.

---

## In Progress
- **Layout & Build Verification**:
  - Fix missing `JsonLd` component and root layout props.
  - Verify project compiles and runs cleanly (`npm run build`).

---

## Next Steps
1. **Step 7 & 8: 3D Scene & Scroll Engine**:
   - Build procedural Three.js / R3F Canvas components:
     - `src/components/three/Scene.tsx`: Main canvas with perspective camera, lighting, fog.
     - `src/components/three/OldBuilding.tsx`: 4-storey weathered concrete cooperative society building.
     - `src/components/three/NewTower.tsx`: Modern high-rise tower morph with glowing windows, balconies.
     - `src/components/three/Skyline.tsx`: Navi Mumbai backdrop silhouettes.
     - `src/components/three/ConstructionEffects.tsx`: Blueprints, scaffolding, cranes, dust/light particles.
     - `src/components/three/Fallback2D.tsx`: Graceful high-fidelity 2D fallback for low-end devices.
2. **Step 9: Home Page 18-Section Cinematic Scroll Journey**:
   - Hero (Section 0)
   - Foreword / Problem Framing (Sections 1-2)
   - The 10-Step Redevelopment Scroll Journey (Sections 3-12) pinned with camera choreographies
   - Why Sankalp / Point of Difference (Section 13)
   - Stats Counter (Section 14)
   - Featured Projects Carousel (Section 15)
   - Services Grid (Section 16)
   - CTA / Contact Banner (Section 17)
3. **Step 10: Interior Subpages**:
   - `/about-us`
   - `/projects`
   - `/services`
   - `/new-updates`
   - `/awards`
   - `/career`
   - `/contact-us`
4. **Step 11: API Routes & Lead Forms**:
   - `/api/contact` & `/api/career` with validation and rate limiting.
5. **Step 12: Production Verification & Media Documentation**:
   - Verify zero lint/type errors, Lighthouse compliance, `MEDIA-TODO.md`.
