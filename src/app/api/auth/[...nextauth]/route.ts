import { handlers } from '@/auth';
import { getRequestIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

async function enforceLimit(req: Request) {
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

export async function GET(req: Request) {
  const limited = await enforceLimit(req);
  if (limited) return limited;
  return handlers.GET(req);
}

export async function POST(req: Request) {
  const limited = await enforceLimit(req);
  if (limited) return limited;
  return handlers.POST(req);
}
