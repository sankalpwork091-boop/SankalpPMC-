# Sankalp PMC — Media Strategy, Generation Prompts & Content Audit

This document outlines the dual-mode media architecture for the 3D scroll story, generation prompts for Higgsfield / Google Flow, and the master list of content TODOs.

---

## 1. Dual-Mode Media Architecture (`src/data/media.ts`)

The site is engineered with a **zero-risk dual-mode switch**:
- **Default Mode (`enabled: false`)**: The website runs an interactive, 60fps procedural WebGL Three.js / React Three Fiber scene with dynamic building transformation, golden hour lighting, crane animations, and blueprint scans.
- **AI Media Mode (`enabled: true`)**: When an AI video clip or frame sequence is generated and placed in `/public/media/generated/`, setting `enabled: true` in `src/data/media.ts` seamlessly switches that step to the high-definition video/scrub layer.

---

## 2. Higgsfield / Google Flow Generation Prompts (10 Steps)

Use these calibrated cinematic prompts when generating photorealistic video clips or frame sequences for each redevelopment milestone.

### Scene 0: Old Housing Society Base (Hero)
> **Prompt:** "Cinematic slow wide-angle establishing shot of an authentic 4-storey cooperative housing society in Navi Mumbai, weathered pale stucco walls, overhead black sintex water tanks on concrete terrace, cast-iron balcony railings, lush gulmohar trees on quiet residential street, afternoon warm sunlight, 8k resolution, architectural realism, 35mm film grain, 60fps smooth pan."
> **Aspect:** 16:9 | **Motion:** Subtly drifting slow push-in.

### Step 1: Appointment & Blueprint Initiation (Section 3)
> **Prompt:** "Holographic glowing cyan architectural blueprints and laser wireframes superimposing over an old Indian cooperative housing society building, intricate CAD drafting lines expanding across the façade, hyper-detailed legal boundary demarcation, cinematic corporate grade lighting, photorealistic 8k."
> **Aspect:** 16:9 | **Motion:** Smooth vertical crane drift.

### Step 2: Legal Check & Title Feasibility (Section 4)
> **Prompt:** "Volumetric glowing horizontal laser scan line sweeping smoothly from foundation to rooftop of an apartment building, revealing structural pillars and title deed verification holograms, warm amber and gold light accents, deep navy ambient atmosphere, cinematic 4k."
> **Aspect:** 16:9 | **Motion:** Downward laser scan pass.

### Step 3: Tendering & Developer Selection (Section 5)
> **Prompt:** "Three translucent architectural tower massing concepts rising smoothly beside an existing residential plot, comparing heights and sleek contemporary podiums, architectural competition visualization, golden hour rim lighting, ultra-crisp render."
> **Aspect:** 16:9 | **Motion:** Semi-circular orbital camera pan.

### Step 4: Section 79A Compliance & Legal Shielding (Section 6)
> **Prompt:** "A protective translucent geometric golden shield and regulatory compliance seal enveloping a housing society building, glowing Marathi and English legal text patterns in atmosphere, supreme authority, calmness, trust, premium cinematic depth."
> **Aspect:** 16:9 | **Motion:** Slow push inward.

### Step 5: Offer Evaluation & Plan Finalization (Section 7)
> **Prompt:** "A chosen modern 28-storey luxury residential tower design crystallizing into solid photorealistic form, glass balconies, double-height entrance lobby with warm marble finishes, modern landscaped podium, clean daylight."
> **Aspect:** 16:9 | **Motion:** Low-angle perspective looking upwards.

### Step 6: Agreement Structuring & Execution (Section 8)
> **Prompt:** "Extreme macro cinematic shot of a Montblanc fountain pen signing an official Development Agreement on green legal stamp paper, golden seal embossing, transitioning in background to a towering residential foundation, trust, dignity."
> **Aspect:** 16:9 | **Motion:** Slow rack focus.

### Step 7: Statutory Approvals & Foundation Piling (Section 9)
> **Prompt:** "High-tech construction site in Navi Mumbai with heavy piling rigs and foundational concrete casting, green statutory clearance gates opening smoothly, safety barriers in place, golden morning sunlight, engineering precision."
> **Aspect:** 16:9 | **Motion:** Tracking shot alongside site boundary.

### Step 8: Execution Monitoring & Tower Erection (Section 10)
> **Prompt:** "Time-lapse architectural construction of a luxury 28-storey high-rise tower rising floor by floor, yellow tower crane swinging smoothly against coastal Mumbai sky, safety green netting, glass curtain walls installing progressively, photorealistic 8k."
> **Aspect:** 16:9 | **Motion:** Ascending camera crane shot matching floor rise.

### Step 9: Occupancy Certificate & Finishing (Section 11)
> **Prompt:** "The completed modern luxury tower in evening twilight, final architectural crown lighting up, reflective floor-to-ceiling glass windows, grand paved drop-off porch with fountains, municipal clearance stamp glowing softly."
> **Aspect:** 16:9 | **Motion:** Majestic tilt up to rooftop architectural spire.

### Step 10: Handover & Society Celebration (Section 12)
> **Prompt:** "Glorious golden-hour sunset reflecting off a brand-new 28-storey residential tower in Navi Mumbai, warm amber lights glowing inside joyful living room windows, landscaped terrace garden, celebration, keys handover triumph, cinematic 8k masterpiece."
> **Aspect:** 16:9 | **Motion:** Cinematic slow aerial pullback.

---

## 3. Comprehensive Content Audit & TODO Checklist

Per the strict factual guidelines (no invented numbers, testimonials, or projects), the following placeholders are cleanly surfaced in the codebase:

1. **Office Address Designation (`src/data/siteConfig.ts:13-17`)**:
   - `Head Office`: A wing 1307, Shelton Sapphire, Sector 15, CBD Belapur, Navi Mumbai 400 614.
   - `Branch Office`: Office No. 1105, Ellora Fiesta, Sector 11, Sanpada, Navi Mumbai 400 705.
   - *TODO: Confirm whether one of these addresses is outdated or if both remain fully operational.*

2. **Official Social Media Handles (`src/data/siteConfig.ts:39-44`)**:
   - `facebook`, `youtube`, `instagram` URLs are empty strings and omitted from UI until provided.

3. **Homepage Statistics Verification (`src/data/siteConfig.ts:58-83`)**:
   - Years of Combined Experience: set to verified badge (awaiting exact number).
   - Projects Executed: set to verified badge (awaiting exact cumulative total).
   - Societies Served: set to verified badge (awaiting exact cumulative total).
   - Cr sq ft Planning: set to verified badge (awaiting exact cumulative total).

4. **Awards Captions & Dates (`src/data/awards.ts:10-25`)**:
   - 11 real award photos from the old site are rendered in the gallery.
   - *TODO: Provide specific award titles, issuing bodies, and dates for each citation.*

5. **News & Project Bulletins (`src/data/updates.ts:10-37`)**:
   - Seeded with clean category milestone notices.
   - *TODO: Populate with real historical press clippings and AGM notice dates.*
