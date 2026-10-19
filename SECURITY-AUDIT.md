# Security Audit & Hardening Report

**Project**: Sankalp PMC Website  
**Branch**: `feature/security-hardening`  
**Date**: October 19, 2026  
**Auditor**: Antigravity Autonomous Security Agent  

---

## 1. Inventory & Attack Surface Summary

| Component | Found | Security Posture |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.1 (App Router + Turbopack) | Patched modern release; `proxy.ts` adopted |
| **API Endpoints** | `/api/contact`, `/api/career` | Both hardened with CSRF, Zod validation, rate limiting, and sanitization |
| **Authentication / Sessions** | None | Not applicable (public corporate & marketing website) |
| **Database / ORM** | None | Not applicable (no SQL, Postgres, Supabase, or Mongo) |
| **File Uploads** | 1 (`/api/career` CV upload) | Hardened with magic-byte inspection, extension allow-list, size limit, and path sanitization |
| **Cookies** | None set | Not applicable |
| **Browser Storage** | None used for secrets/tokens | Not applicable |
| **Third-Party Scripts** | Google Fonts | Restricted and covered in CSP |
| **Email Delivery** | Nodemailer (SMTP) | Header injection prevented, user HTML escaped, PII redacted from logs |
| **Tracked `.env*` Files** | `.env.example` only | Clean (no actual secrets in git history) |

---

## 2. Hardening Audit Matrix

| # | Item / Check | Status | What Was Done | Files Changed |
| :-: | :--- | :---: | :--- | :--- |
| **1** | **HTTPS & Security Headers** | **Fixed** | Added strict headers (`HSTS` 2 years + preload, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`, `poweredByHeader: false`). Added HTTPS redirect proxy for production. | [`next.config.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/next.config.ts), [`src/proxy.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/proxy.ts) |
| **2** | **Session & Cookie Security** | **Not applicable** | Site has no user accounts, sessions, or custom cookies. | *None* |
| **3** | **Authentication & Password Storage** | **Not applicable** | No login, signup, password storage, or JWT verification exists. | *None* |
| **4** | **CSRF & Origin Protection** | **Fixed** | Enforced origin and referer verification on all state-changing `POST` endpoints against allowlisted origins (`siteConfig.url`, `NEXT_PUBLIC_SITE_URL`, `SITE_ORIGIN`, localhost in dev). Enforced `application/json` for JSON endpoints. Returns `403 Forbidden` on mismatch. | [`src/lib/csrf.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/csrf.ts), [`src/app/api/contact/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/contact/route.ts), [`src/app/api/career/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/career/route.ts) |
| **5** | **Server-Side Input Validation** | **Fixed** | Implemented strict Zod schemas with trimming, length limits, phone regex, and field allow-listing (rejecting unknown properties) on all form submissions. Returns generic `400 Bad Request` on failure. | [`src/app/api/contact/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/contact/route.ts), [`src/app/api/career/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/career/route.ts), [`package.json`](file:///c:/Users/Admin/Desktop/SankalpPMC/package.json) |
| **6** | **Rate Limiting & Honeypots** | **Fixed** | Implemented sliding window rate limiting per IP (5 requests per 10 minutes per form) with `Retry-After` header and `429 Too Many Requests`. Preserved and reinforced hidden honeypot fields (`website_hp`, `company_url_hp`) with silent success responses for bot suppression. Supports optional Upstash Redis for distributed environments. | [`src/lib/rateLimit.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/rateLimit.ts), [`src/app/api/contact/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/contact/route.ts), [`src/app/api/career/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/career/route.ts) |
| **7** | **Email Header Injection & HTML Escaping** | **Fixed** | Stripped `\r` and `\n` characters from email subjects, from addresses, and reply-to headers via `sanitizeHeader()`. Escaped all user inputs with `escapeHtml()` before rendering into HTML notification emails. | [`src/lib/sanitize.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/sanitize.ts), [`src/lib/email.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/email.ts), [`src/app/api/contact/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/contact/route.ts), [`src/app/api/career/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/career/route.ts) |
| **8** | **SQL Injection & Database RLS** | **Not applicable** | Site has no database, ORM, or SQL queries. | *None* |
| **9** | **XSS & Content Security Policy** | **Fixed** | Escaped `<` to `\u003c` in structured data JSON-LD. Deployed a strict Content Security Policy in `Content-Security-Policy-Report-Only` mode allowing site assets, Three.js WebGL, Google Fonts, and Google Maps without breaking dynamic 3D elements. | [`src/components/seo/JsonLd.tsx`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/components/seo/JsonLd.tsx), [`next.config.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/next.config.ts) |
| **10** | **SSRF** | **Not applicable** | No server-side HTTP fetching of user-controlled URLs or image proxies exists. | *None* |
| **11** | **File Upload Security** | **Fixed** | Added magic-byte verification (PDF `%PDF`, DOC CFBF, DOCX PK zip header), extension allow-list (`.pdf`, `.doc`, `.docx`), double extension rejection (e.g. `file.exe.pdf`), 5MB size cap, and path traversal stripping on CV uploads. | [`src/lib/fileValidation.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/fileValidation.ts), [`src/app/api/career/route.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/api/career/route.ts) |
| **12** | **Secrets Hygiene & Git Scan** | **Fixed** | Audited git history and files; confirmed no live secrets are committed. Added `server-only` guard to `email.ts`. Updated `.env.example` with comprehensive variable templates. | [`.env.example`](file:///c:/Users/Admin/Desktop/SankalpPMC/.env.example), [`src/lib/email.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/email.ts) |
| **13** | **Error Handling & Privacy Logging** | **Fixed** | Added custom on-theme error boundaries (`error.tsx`, `global-error.tsx`, `not-found.tsx`). Created redacting `logger.ts` that removes PII (names, emails, phones, messages) from all server logs. Removed debug email body logging. | [`src/app/error.tsx`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/error.tsx), [`src/app/global-error.tsx`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/global-error.tsx), [`src/app/not-found.tsx`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/app/not-found.tsx), [`src/lib/logger.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/logger.ts), [`src/lib/email.ts`](file:///c:/Users/Admin/Desktop/SankalpPMC/src/lib/email.ts) |
| **14** | **Dependencies & Security Net** | **Fixed** | Production dependencies show **0 vulnerabilities** (`npm audit --omit=dev`). Created `.github/dependabot.yml` for automated weekly security updates. | [`.github/dependabot.yml`](file:///c:/Users/Admin/Desktop/SankalpPMC/.github/dependabot.yml) |

---

## 3. Production Deployment Notes

1. **CSP Enforcing Mode**:
   Currently running in `Content-Security-Policy-Report-Only` to ensure WebGL/Three.js canvases and Google Fonts load smoothly. To switch to enforcing mode, change the header key in `next.config.ts`:
   ```typescript
   key: 'Content-Security-Policy', // change from Content-Security-Policy-Report-Only
   ```
2. **Rate Limiting in Serverless**:
   The current rate limiter uses an in-memory sliding window per Node process. For horizontally scaled multi-region serverless deployments (such as Vercel edge/lambda), configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local` to share rate limits across instances.
