/**
 * Server-side in-memory Sliding Window Rate Limiter
 * Provides IP-based rate limiting to prevent DDoS, amplification attacks, and resource exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[];
  activeScans: number;
}

const ipRecords = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipRecords.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter(ts => now - ts < 60000);
      if (record.timestamps.length === 0 && record.activeScans <= 0) {
        ipRecords.delete(ip);
      }
    });
  }, 300000);
}

export interface RateLimitOptions {
  windowMs?: number;        // Window duration in ms (default: 60,000ms = 1 min)
  maxRequests?: number;     // Max requests per window (default: 6)
  maxConcurrent?: number;   // Max simultaneous running scans per IP (default: 2)
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
  error?: string;
}

export function checkRateLimit(
  clientIp: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 60000;
  const maxRequests = options.maxRequests ?? 6;
  const maxConcurrent = options.maxConcurrent ?? 2;
  const now = Date.now();

  let record = ipRecords.get(clientIp);
  if (!record) {
    record = { timestamps: [], activeScans: 0 };
    ipRecords.set(clientIp, record);
  }

  // Filter timestamps within sliding window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  // Check concurrent active scans
  if (record.activeScans >= maxConcurrent) {
    return {
      success: false,
      remaining: 0,
      resetMs: 5000,
      error: 'Concurrent scan limit reached for your IP. Please wait for current scan to finish.'
    };
  }

  // Check request count within window
  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      remaining: 0,
      resetMs,
      error: `Too many requests. Please wait ${Math.ceil(resetMs / 1000)}s before running another scan.`
    };
  }

  // Register request
  record.timestamps.push(now);
  record.activeScans++;

  return {
    success: true,
    remaining: maxRequests - record.timestamps.length,
    resetMs: windowMs
  };
}

export function releaseActiveScan(clientIp: string) {
  const record = ipRecords.get(clientIp);
  if (record && record.activeScans > 0) {
    record.activeScans--;
  }
}
