# Sankalp PMC — Master Content Audit, Media Strategy & TODO Checklist

This document consolidates every factual placeholder and content requirement across the codebase with exact file and line references, alongside the media generation prompts for Higgsfield / Google Flow.

---

## 1. Master Content & Factual TODO Checklist

Per our legal-first standards, **no numbers, testimonials, or awards are invented**. The codebase renders authentic verified placeholders until the society management provides exact figures.

### A. Homepage Statistics & Track Record
- [ ] `src/data/siteConfig.ts:60` — **Years of Combined Experience**: Currently `0` (renders "Verified+"). Provide exact cumulative experience across legal, architecture, and engineering.
- [ ] `src/data/siteConfig.ts:66` — **Projects Executed**: Currently `0` (renders "Verified+"). Provide exact count of successfully executed projects by technical team.
- [ ] `src/data/siteConfig.ts:72` — **Societies Served**: Currently `0` (renders "Verified+"). Provide total number of societies advised under Section 79A and redevelopment.
- [ ] `src/data/siteConfig.ts:78` — **Planning & Design Area**: Currently `0` (renders "Verified Cr sq ft"). Provide total square footage planned and engineered.

### B. Office Locations & Contact Details
- [x] **Head Office Address**: Confirmed as Office No. 1105, Ellora Fiesta, Sector 11, Sanpada, Navi Mumbai 400 705.
- [ ] `src/data/siteConfig.ts:18` — **Head Office Map Embed**: Add official Google Maps iframe embed URL for Ellora Fiesta.
- [ ] `src/data/siteConfig.ts:9` — **Direct Phone Lines**: Verify active status for `+91 9373188181`.
- [ ] `src/data/siteConfig.ts:10` — **Primary Inquiry Email**: Confirm `careers@sankalppmc.com` vs dedicated `contact@sankalppmc.com` or `info@sankalppmc.com`.

### C. Social Media Links
- [ ] `src/data/siteConfig.ts:26` — **Facebook Profile**: Add official page URL (omitted from UI when blank).
- [ ] `src/data/siteConfig.ts:27` — **YouTube Channel**: Add official channel URL (omitted from UI when blank).
- [x] `src/data/siteConfig.ts:28` — **Instagram Profile**: Confirmed as `https://www.instagram.com/sankalp_pmc/`.
- [x] `src/components/layout/Footer.tsx` — Social column renders populated links (Instagram) with 40px circle, gold border/hover gradient, and label.

### D. Awards & Recognition Details
The gallery in `src/app/awards/page.tsx` renders 11 authentic photos downloaded from the legacy site. Titles, years, and issuing bodies need attribution:
- [ ] `src/data/awards.ts:14` — `aw-1.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:15` — `aw-2.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:16` — `aw-3.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:17` — `aw-4.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:18` — `aw-5.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:19` — `aw-6.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:20` — `aw-7.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:21` — `aw-8.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:22` — `aw-9.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:23` — `aw-10.jpg`: Citation title, awarding organization, and year.
- [ ] `src/data/awards.ts:24` — `aw-111.jpeg`: Citation title, awarding organization, and year.

### E. Project Portfolio Dates
- [ ] `src/data/projects.ts:56` — **Om Gurukul Redevelopment** (Nerul, 85,500 sq ft): Confirm start year.
- [ ] `src/data/projects.ts:133` — **Arihant Brahmand** (Thane, 6 lac sq ft, G+42): Confirm start year.

### F. Technical Board Profiles
- [ ] `src/data/team.ts:37-39` — **Mr. Swapnil Chavan**: Add academic qualifications, license details, and professional biography.
- [ ] `src/data/team.ts:46-48` — **Mr. Janmesh Patel**: Add academic qualifications, structural license details, and professional biography.
- [ ] `src/data/team.ts:54-58` — **Mr. Akshay Mankame**: Add official title/designation and project bio.

### G. News & Press Bulletins
- [ ] `src/data/updates.ts:10-37` — Provide actual dates, news article titles, publication names, and scan images for historical press coverage.

---

## 2. Dual-Mode Media Architecture (`src/data/media.ts`)

The site is built with a **safe dual-mode switch**:
- **Default Mode (`enabled: false`)**: The website runs an interactive, 60fps procedural WebGL Three.js / React Three Fiber scene with dynamic building transformation, golden hour lighting, crane animations, and blueprint scans.
- **AI Media Mode (`enabled: true`)**: When an AI video clip or frame sequence is generated and placed in `/public/media/generated/`, setting `enabled: true` in `src/data/media.ts` seamlessly switches that step to the high-definition video/scrub layer.

---

## 3. Higgsfield / Google Flow Generation Prompts (10 Steps)

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
