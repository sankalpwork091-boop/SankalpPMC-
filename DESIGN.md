# Design System: Sovereign Blue & Gilded Glass

> Extracted from Google Stitch Project `6547475576127464272`
> Screen: `projects/6547475576127464272/screens/df494065f0e342c6b6148a5a3e45b91f` ("Sankalp PMC - Modern Luxury Hero Section")

## Brand & Style Philosophy
The design system projects absolute institutional authority, architectural sophistication, and fiduciary precision for Sankalp PMC's high-stakes urban redevelopment consultancy, project management, and legal advisory.

The aesthetic is anchored in **Editorial Modernism with Structural Glassmorphism**:
- **Atmosphere:** Serious, commanding, pristine, and luminous. Conveys the immutability of legal counsel and the physical weight of monumental architecture.
- **Visual Rhythm:** Balanced tension between expansive structural grid lines, frosted translucent panels resembling architectural drafting sheets, and refined gilded filigree accents.
- **Emotional Response:** Confidence, unwavering security, high capital stewardship, and technical distinction.

---

## Color Tokens

| Token | Hex / HSL | Usage |
| :--- | :--- | :--- |
| **Primary Anchor (`--sovereign-navy`)** | `#154C96` (`215 75% 34%`) | Sovereign Navy. Core branding, active states, buttons, hero focal points |
| **Secondary Tone (`--gilded-brass`)** | `#D4A462` (`35 57% 61%`) | Gilded Brass / Warm Gold. Excellence, luxury advisory, keylines, highlights |
| **Tertiary Depths (`--abyssal-navy`)** | `#081B38` (`217 76% 12%`) | Deep Abyssal Navy. High-contrast typography, hero card backdrops, dark mode surfaces |
| **Gilded Glow (`--gilded-glow`)** | `#DFB97D` | Warm gold hover glow, border accents |
| **Gilded Light (`--gilded-light`)** | `#F3E5AB` | Parchment accents, pill badge backgrounds (30% opacity) |
| **Surface Canvas (`--surface-canvas`)** | `#F8F9FA` | Crisp alabaster white, balanced by true pure white (`#FFFFFF`) |
| **Success / Approved** | `#1C6B48` | Executed milestones, green verification tags |
| **Caution / Review** | `#C88728` | Pending regulatory approval chips |
| **Critical / Legal Alert** | `#9E2A2B` | Legal discrepancy notices |

---

## Typography Hierarchy

| Style Level | Font Family | Size / Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display Large** | Playfair Display | 56px / 68px | 600 (SemiBold) | -0.02em |
| **Headline XL** | Playfair Display | 40px / 48px | 600 (SemiBold) | -0.01em |
| **Headline LG** | Playfair Display | 32px / 40px | 500 (Medium) | Normal |
| **Headline MD** | Playfair Display | 24px / 32px | 500 (Medium) | Normal |
| **Headline SM** | Playfair Display | 20px / 28px | 600 (SemiBold) | Normal |
| **Body XL** | Plus Jakarta Sans / Inter | 18px / 28px | 400 (Regular) | Normal |
| **Body LG** | Plus Jakarta Sans / Inter | 16px / 24px | 400 (Regular) | Normal |
| **Body MD** | Plus Jakarta Sans / Inter | 14px / 22px | 400 (Regular) | Normal |
| **Label LG** | Plus Jakarta Sans / Inter | 14px / 20px | 600 (SemiBold) | 0.04em |
| **Label MD (Badges)** | Plus Jakarta Sans / Inter | 12px / 16px | 600 (SemiBold) | 0.06em (Uppercase) |
| **Label SM (Trackers)**| Plus Jakarta Sans / Inter | 10px / 14px | 700 (Bold) | 0.08em (Uppercase) |

---

## Elevation, Glassmorphism & Depth

- **Frosted Panels:** `backdrop-filter: blur(16px)` to `blur(24px)` with background `rgba(215, 226, 255, 0.06)` or `rgba(8, 27, 56, 0.78)`
- **Hairline Architectural Borders:**
  - On dark panels: `1px solid rgba(212, 164, 98, 0.35)` (Gold Hairline) or `rgba(243, 229, 171, 0.2)`
  - On light panels: `1px solid rgba(21, 76, 150, 0.12)`
- **Shadow Scale:**
  - Resting Card: `0 12px 32px -8px rgba(8, 27, 56, 0.08)`
  - Floating / Executive Brief: `0 24px 64px -12px rgba(8, 27, 56, 0.18)` + inner highlight `inset 0 1px 0 0 rgba(255, 255, 255, 0.6)`

---

## Spacing & Grid System

- **Desktop (1200px+):** 12-column architectural grid with `3rem` section margins and `1.5rem` gutters. Max container `1360px`.
- **Tablet (768px - 1199px):** 8-column grid with `2rem` outer margins and `1rem` gutters.
- **Mobile (< 768px):** 4-column layout with `1.25rem` margins and `1rem` gutters.
- **Progression Scale:** 4px geometric increments (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2.5rem`).
