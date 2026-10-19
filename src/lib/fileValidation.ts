/**
 * File upload validation helpers (magic bytes, extension whitelist, path traversal defense).
 */

export const MAX_CV_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export type ValidatedFileType = 'pdf' | 'doc' | 'docx';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: ValidatedFileType;
  mimeType?: string;
}

// Magic byte signatures
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // "%PDF"
const DOC_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // CFBF (legacy DOC)
const DOCX_ZIP_MAGIC = [0x50, 0x4b, 0x03, 0x04]; // PK zip header

function matchesBytes(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) return false;
  }
  return true;
}

/**
 * Validates an uploaded CV/resume buffer and filename.
 */
export function validateCvUpload(
  buffer: Buffer,
  filename: string
): FileValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file provided.' };
  }

  if (buffer.length > MAX_CV_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds the 5MB limit. Please upload a smaller file.',
    };
  }

  // Reject filenames with double extensions (e.g. resume.pdf.exe or mal.exe.pdf)
  const segments = filename.trim().split('.');
  if (segments.length < 2) {
    return { valid: false, error: 'File must have a valid extension (.pdf, .doc, .docx).' };
  }

  const ext = segments[segments.length - 1].toLowerCase();
  const disallowedInner = ['exe', 'js', 'sh', 'bat', 'cmd', 'vbs', 'ps1', 'php', 'phtml', 'html', 'htm', 'svg'];
  for (let i = 1; i < segments.length - 1; i++) {
    if (disallowedInner.includes(segments[i].toLowerCase())) {
      return { valid: false, error: 'File rejected due to suspicious naming pattern.' };
    }
  }

  // Magic bytes check
  if (ext === 'pdf') {
    if (!matchesBytes(buffer, PDF_MAGIC)) {
      return { valid: false, error: 'File content does not match standard PDF format.' };
    }
    return {
      valid: true,
      fileType: 'pdf',
      mimeType: 'application/pdf',
    };
  }

  if (ext === 'doc') {
    if (!matchesBytes(buffer, DOC_MAGIC)) {
      return { valid: false, error: 'File content does not match Microsoft Word DOC format.' };
    }
    return {
      valid: true,
      fileType: 'doc',
      mimeType: 'application/msword',
    };
  }

  if (ext === 'docx') {
    if (!matchesBytes(buffer, DOCX_ZIP_MAGIC)) {
      return { valid: false, error: 'File content does not match Microsoft Word DOCX format.' };
    }
    return {
      valid: true,
      fileType: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  return {
    valid: false,
    error: 'Invalid file extension. Only .pdf, .doc, and .docx files are permitted.',
  };
}
