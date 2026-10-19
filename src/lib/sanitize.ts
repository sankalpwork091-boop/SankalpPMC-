/**
 * Sanitization helpers for input fields, email headers, and HTML outputs.
 */

/**
 * Escapes characters with special meaning in HTML to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips Carriage Return and Line Feed characters to prevent email header injection attacks.
 */
export function sanitizeHeader(str: string): string {
  if (!str) return '';
  return String(str).replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Sanitizes a filename by removing path traversal characters, null bytes, and non-printable characters.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed_file';
  // Strip path traversal characters and directory separators
  const base = filename.replace(/^.*[\\/]/, '');
  // Remove null bytes and control characters
  const clean = base.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  // Replace potentially risky characters with an underscore
  const safe = clean.replace(/[^a-zA-Z0-9._-]/g, '_');
  return safe || 'attachment';
}
