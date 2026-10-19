/**
 * Redacting logger helper to prevent leaking sensitive form fields, personal data, and secrets into logs.
 */

const SENSITIVE_KEY_PATTERNS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'cookie',
  'email',
  'phone',
  'name',
  'message',
  'body',
  'cv',
  'attachment',
  'contactname',
  'societyname',
  'content',
];

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

function redactValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    if (value.includes('@') && value.includes('.')) {
      return '[REDACTED_EMAIL]';
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveKey(k)) {
        cleaned[k] = '[REDACTED]';
      } else {
        cleaned[k] = redactValue(v);
      }
    }
    return cleaned;
  }

  return value;
}

export const logger = {
  info(event: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.log(`[INFO] ${event}`, redactValue(meta));
    } else {
      console.log(`[INFO] ${event}`);
    }
  },

  warn(event: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.warn(`[WARN] ${event}`, redactValue(meta));
    } else {
      console.warn(`[WARN] ${event}`);
    }
  },

  error(event: string, error?: unknown, meta?: Record<string, unknown>) {
    const message = error instanceof Error ? error.message : String(error || '');
    if (meta) {
      console.error(`[ERROR] ${event}: ${message}`, redactValue(meta));
    } else {
      console.error(`[ERROR] ${event}: ${message}`);
    }
  },
};
