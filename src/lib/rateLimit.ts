/**
 * Sliding window rate limiter for public API endpoints.
 * Tracks requests per key (e.g. route:ip) within a sliding time window.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    const maxWindowMs = 30 * 60 * 1000;
    for (const [key, record] of ipMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < maxWindowMs);
      if (record.timestamps.length === 0) {
        ipMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000,
  keyPrefix: string = 'form'
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const mapKey = `${keyPrefix}:${ip}`;
  let record = ipMap.get(mapKey);

  if (!record) {
    record = { timestamps: [] };
    ipMap.set(mapKey, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    retryAfterSec: 0,
  };
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return '127.0.0.1';
}
