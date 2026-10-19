import { siteConfig } from '@/data/siteConfig';

/**
 * Validates request Origin and Referer against allowed application origins to prevent CSRF.
 * Supports:
 * - Same-host matching (origin host matches the request's own Host / X-Forwarded-Host)
 * - Configured origins (siteConfig.url, NEXT_PUBLIC_SITE_URL, SITE_ORIGIN) with both www and non-www variants
 * - Localhost and 127.0.0.1 on any port in development
 * - Fails closed if neither Origin nor Referer is present (standard browsers always send one on state-changing requests)
 */
export function validateRequestOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  const refererHeader = request.headers.get('referer');

  // Extract candidate origin from Origin header or Referer
  let candidateOrigin = originHeader;
  if (!candidateOrigin && refererHeader) {
    try {
      const url = new URL(refererHeader);
      candidateOrigin = url.origin;
    } catch {
      return false;
    }
  }

  // If no Origin or Referer header was sent, fail closed for state-changing requests
  if (!candidateOrigin) {
    return false;
  }

  let candidateUrl: URL;
  try {
    candidateUrl = new URL(candidateOrigin);
  } catch {
    return false;
  }

  // 1. Same-Host Check: Compare origin host against request's own Host / X-Forwarded-Host
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = request.headers.get('host');
  const rawRequestHost = (forwardedHost ? forwardedHost.split(',')[0].trim() : hostHeader)?.trim();

  if (rawRequestHost) {
    // Strip port if present for comparison
    const requestHostOnly = rawRequestHost.toLowerCase().split(':')[0];
    const candidateHostOnly = candidateUrl.hostname.toLowerCase();

    if (candidateHostOnly === requestHostOnly) {
      // In production, ensure origin is secure https
      if (process.env.NODE_ENV === 'production' && candidateUrl.protocol !== 'https:') {
        return false;
      }
      return true;
    }
  }

  // 2. Explicit Allow-list: configured origins and their www / non-www counterparts
  const allowedOrigins = new Set<string>();

  const addConfiguredOrigin = (urlStr?: string) => {
    if (!urlStr) return;
    try {
      const u = new URL(urlStr);
      const proto = u.protocol;
      const host = u.host.toLowerCase();
      allowedOrigins.add(`${proto}//${host}`);
      if (host.startsWith('www.')) {
        allowedOrigins.add(`${proto}//${host.slice(4)}`);
      } else {
        allowedOrigins.add(`${proto}//www.${host}`);
      }
    } catch {
      // ignore invalid URLs
    }
  };

  addConfiguredOrigin(siteConfig.url);
  addConfiguredOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  addConfiguredOrigin(process.env.SITE_ORIGIN);

  // 3. In non-production environments, allow local development ports
  if (process.env.NODE_ENV !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(candidateOrigin)) {
      return true;
    }
  }

  return allowedOrigins.has(candidateUrl.origin.toLowerCase());
}

/**
 * Validates that the Content-Type header specifies application/json.
 */
export function validateJsonContentType(request: Request): boolean {
  const contentType = request.headers.get('content-type') || '';
  return contentType.toLowerCase().includes('application/json');
}
