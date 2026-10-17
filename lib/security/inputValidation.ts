/**
 * Security validation and sanitization for OSINT queries.
 * Prevents SSRF injection, path traversal, shell injection, and oversized payloads.
 */

const USERNAME_REGEX = /^[a-zA-Z0-9_\-.@]{1,48}$/;

// Disallow dangerous keywords or protocol injections
const BLOCKED_PATTERNS = [
  /^(localhost|127\.|0\.0\.0\.0|169\.254\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/i,
  /^https?:\/\//i,
  /^file:\/\//i,
  /\.\./,
  /[\x00-\x1F\x7F]/
];

export interface ValidationResult {
  valid: boolean;
  sanitized: string;
  error?: string;
}

export function validateUsername(rawInput: unknown): ValidationResult {
  if (typeof rawInput !== 'string') {
    return { valid: false, sanitized: '', error: 'Username must be a text string' };
  }

  const trimmed = rawInput.trim();

  if (!trimmed) {
    return { valid: false, sanitized: '', error: 'Username cannot be empty' };
  }

  if (trimmed.length > 48) {
    return { valid: false, sanitized: '', error: 'Username cannot exceed 48 characters' };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, sanitized: '', error: 'Username contains invalid or restricted characters' };
    }
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      sanitized: '',
      error: 'Username may only contain letters, numbers, hyphens, underscores, dots, or @'
    };
  }

  return {
    valid: true,
    sanitized: trimmed
  };
}
