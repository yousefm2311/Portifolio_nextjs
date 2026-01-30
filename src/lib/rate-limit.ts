import { LRUCache } from 'lru-cache';

const limiter = new LRUCache<string, { count: number; resetAt: number }>({
  max: 1000,
  ttl: 60_000
});

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(key: string, limit = 25): RateLimitResult {
  const now = Date.now();
  const entry = limiter.get(key);

  if (!entry) {
    limiter.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: limit - 1, resetAt: now + 60_000 };
  }

  if (entry.resetAt <= now) {
    limiter.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: limit - 1, resetAt: now + 60_000 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  limiter.set(key, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function getRequestIp(req: Request) {
  const header = req.headers.get('x-forwarded-for');
  if (header) {
    return header.split(',')[0]?.trim() ?? 'unknown';
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}
