import { NextResponse } from 'next/server';
import { getRequestIp, rateLimit } from '@/lib/rate-limit';
import { requireAdminSession } from '@/lib/auth-helpers';

export async function enforceAdmin(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

export function enforceRateLimit(req: Request, key: string, limit = 30) {
  const ip = getRequestIp(req);
  const result = rateLimit(`${key}:${ip}`, limit);
  if (!result.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  return null;
}
