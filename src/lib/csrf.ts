import { siteConfig } from '@/data/siteConfig';

/**
 * Validates request Origin and Referer against allowed application origins to prevent CSRF.
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

  // If no Origin or Referer header was sent by the browser, fail closed for state-changing requests
  if (!candidateOrigin) {
    return false;
  }

  // Build whitelist of allowed origins
  const allowedOrigins = new Set<string>();

  try {
    allowedOrigins.add(new URL(siteConfig.url).origin);
  } catch {
    allowedOrigins.add('https://sankalppmc.com');
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      // ignore malformed env var
    }
  }

  if (process.env.SITE_ORIGIN) {
    try {
      allowedOrigins.add(new URL(process.env.SITE_ORIGIN).origin);
    } catch {
      // ignore
    }
  }

  // In non-production environments, allow local development ports
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://127.0.0.1:3000');
    allowedOrigins.add('http://localhost:3001');
    allowedOrigins.add('http://127.0.0.1:3001');

    // Also match any local port if needed
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(candidateOrigin)) {
      return true;
    }
  }

  return allowedOrigins.has(candidateOrigin);
}

/**
 * Validates that the Content-Type header specifies application/json.
 */
export function validateJsonContentType(request: Request): boolean {
  const contentType = request.headers.get('content-type') || '';
  return contentType.toLowerCase().includes('application/json');
}
