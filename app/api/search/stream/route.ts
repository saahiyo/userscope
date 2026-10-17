import { NextRequest } from 'next/server';
import { runDynamicOsintScan } from '@/lib/osint/dynamicScanner';
import { SearchStreamEvent } from '@/lib/osint/types';
import { checkRateLimit, releaseActiveScan } from '@/lib/security/rateLimiter';
import { validateUsername } from '@/lib/security/inputValidation';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate Limiting Protection (DoS & Resource Exhaustion Defense)
  const rateLimit = checkRateLimit(clientIp, {
    windowMs: 60000,
    maxRequests: 10,
    maxConcurrent: 2
  });

  if (!rateLimit.success) {
    return new Response(
      JSON.stringify({
        error: rateLimit.error || 'Rate limit exceeded. Please slow down.'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(rateLimit.resetMs / 1000).toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      }
    );
  }

  // 2. Strict Input Validation & Sanitization (SSRF / Payload Defense)
  const { searchParams } = new URL(req.url);
  const rawUsername = searchParams.get('username');
  const validation = validateUsername(rawUsername);

  if (!validation.valid) {
    releaseActiveScan(clientIp);
    return new Response(
      JSON.stringify({ error: validation.error || 'Invalid username parameter' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const username = validation.sanitized;

  // 3. Create SSE stream with client disconnect handling
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  let isWriterClosed = false;

  const sendEvent = (event: SearchStreamEvent) => {
    if (isWriterClosed || req.signal.aborted) return;
    try {
      const data = `data: ${JSON.stringify(event)}\n\n`;
      writer.write(encoder.encode(data));
    } catch {
      isWriterClosed = true;
    }
  };

  // Run dynamic scanning in background with abort signal support
  (async () => {
    try {
      await runDynamicOsintScan(
        username,
        (event) => {
          sendEvent(event);
        },
        req.signal
      );
    } catch (err: any) {
      if (!req.signal.aborted) {
        sendEvent({
          type: 'error',
          message: err?.message || 'An error occurred during scanning'
        });
      }
    } finally {
      releaseActiveScan(clientIp);
      if (!isWriterClosed) {
        try {
          await writer.close();
        } catch {}
        isWriterClosed = true;
      }
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

