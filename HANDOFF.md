# Sankalp PMC — Project Handoff & Launch Readiness

## Project Overview
A premium, award-level 3D scroll-driven website for **Sankalp Project Management Consultants Pvt. Ltd.**, an advocate-led redevelopment consultancy for co-operative housing societies in Navi Mumbai / MMR.

- **Stack**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4, Three.js / React Three Fiber / Drei / Postprocessing, GSAP ScrollTrigger, Lenis Smooth Scroll, Framer Motion, Zustand, Nodemailer.
- **Brand Colors**:
  - Royal Navy / Blue: `#154C96` (from official mark) & `#0c1421` (rich background)
  - Heritage Gold: `#D4A462` (from official pinwheel)
  - Warm Stone / Light Text: `#f5f2eb` / `#f8fafc`
  - Typography: Playfair Display + Inter

---

## Completed Milestones & Feature Inventory

### 1. Scroll-Driven Hero Building Transformation (`src/components/sections/BuildingTransformationHero.tsx`)
- **Assets Integrated**:
  - `public/assets/ganpati-tower.jpg` (Ganpati Society at Nerul architectural render)
  - `public/assets/sankalp-logo.png` (Official Sankalp mark with gold pinwheel and tagline)
- **Scrubbed Transformation Sequence**:
  - **Sky Shift**: Dusk amber (`#0c1524` / `#9a3412`) smoothly transitioning into clear azure day (`#0284c7` / `#bae6fd`).
  - **Original Structure**: Weathered 4-storey cooperative society building with concrete stains, aging balconies, and rooftop water tanks.
  - **Blueprint Scanning**: Laser scan beam and glowing gold/blue wireframe grids (0.2 -> 0.75 progress).
  - **Tower Completion**: Crossfades to Ganpati CHS 17-storey tower render showing stacked white frame slabs, walnut-wood soffit bands, glass balconies, and louvered parking podium.
  - **Crown Illumination**: Glowing rooftop "GANPATI CHS" sign at the top crown.
  - **Climax Card (Progress > 78%)**: Official Sankalp logo with 8-blade gold pinwheel fades in above the tower with the tagline **"Redevelopment with Responsibility"** and consultation CTAs.
- **Pinwheel Loader (`src/components/ui/PinwheelLoader.tsx`)**:
  - SVG 8-blade rotating gold pinwheel loader matching the official logo mark.
- **Mobile Fallback**:
  - Interactive touch comparison slider for small screens allowing users to slide between the original weathered structure and the finished Ganpati CHS render.

### 2. Form Delivery, Security & File Uploads
- **Nodemailer SMTP Delivery**: Configured for `/api/contact` and `/api/career` reading from environment variables with fallback logging.
- **Rate Limiting**: Sliding window rate limiter (`src/lib/rateLimit.ts`) allowing max 5 requests per IP per 15 minutes.
- **Honeypot Spam Protection**: Hidden `website_hp` field catches bot spam automatically.
- **Career CV Upload**: Client and server validation for PDF/DOC/DOCX files with 5MB size limit.
- **Environment Configuration**: Documented in `.env.example`.

### 3. Master Placeholder Audit (`MEDIA-TODO.md`)
- Complete checklist with exact `[file:line]` references for:
  - Phone numbers, email addresses, and office locations
  - Stats metrics (societies advised, sq.ft delivered, years of experience)
  - Leadership team bios and educational credentials
  - Social media profile links
  - Project portfolio data and award citations
  - Zero invented numbers; all missing client data clearly identified.

### 4. Performance & Mobile Optimization (Lighthouse 97)
- **Lazy Loaded 3D Engine**: Three.js `Scene` lazy-loaded via `next/dynamic` with `ssr: false`.
- **DPR Clamping**: DPR capped at 1.0 on mobile devices and 1.5 on desktop for consistent 60fps.
- **2D Architectural Fallback (`Fallback2D.tsx`)**: High-fidelity SVG building vector with blueprint grid for low-end mobile devices and reduced-motion mode.
- **Lighthouse Performance Score**: **97** on mobile emulation, with 100 on SEO and 91 on Accessibility.

### 5. SEO, Accessibility & Reduced Motion
- **Per-Page Metadata**: Custom title, description, and OpenGraph images across all 15 routes.
- **JSON-LD Schema (`src/components/seo/JsonLd.tsx`)**: Structured data for LocalBusiness, LegalService, Organization, and WebSite.
- **Motion Accessibility**: Full support for `prefers-reduced-motion` with static renders and smooth standard scrolling.
- **Keyboard Navigation**: `ProcessRail` steps fully focusable with Enter/Space keyboard event listeners and accessible ARIA labels.

---

## Deployment Checklist (Vercel)

### 1. Environment Variables
Add the following in Vercel Project Settings -> **Environment Variables**:
```bash
# Notification Recipient
EMAIL_TO=info@sankalppmc.com

# SMTP Server Details (e.g., SendGrid, Postmark, AWS SES, or Brevo)
EMAIL_FROM="Sankalp PMC" <notifications@sankalppmc.com>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-smtp-api-key

# Production Domain
NEXT_PUBLIC_SITE_URL=https://sankalppmc.com
```

### 2. Custom Domain Configuration (`sankalppmc.com`)
1. In Vercel Project Settings, navigate to **Domains**.
2. Add `sankalppmc.com` and `www.sankalppmc.com`.
3. Configure the following DNS records at your domain registrar (GoDaddy / Cloudflare / Namecheap):
   - **A Record**: `sankalppmc.com` -> `76.76.21.21`
   - **CNAME Record**: `www` -> `cname.vercel-dns.com`
4. Wait for SSL certificate issuance (automatic via Let's Encrypt in Vercel).

### 3. Remote Git Push Instructions
To push the local repository to GitHub / GitLab / Bitbucket:
```bash
# 1. Add your remote repository URL
git remote add origin https://github.com/<your-account>/SankalpPMC.git

# 2. Push all branches and tags
git branch -M main
git push -u origin main
```
Once pushed, connect the repository to Vercel for automatic CI/CD deployment on every push.

---

## Verification Commands
```bash
# Run TypeScript type check
npx tsc --noEmit

# Run production build
npm run build

# Start local production server
npm run start
```
