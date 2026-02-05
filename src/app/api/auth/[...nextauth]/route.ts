import { handlers } from '@/auth';
import { NextRequest } from 'next/server';
import { getRequestIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

async function enforceLimit(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  const ip = getRequestIp(req);
  const limit = rateLimit(`auth:${ip}`, 20);
  if (!limit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const limited = await enforceLimit(req);
  if (limited) return limited;
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  const limited = await enforceLimit(req);
  if (limited) return limited;
  return handlers.POST(req);
}
