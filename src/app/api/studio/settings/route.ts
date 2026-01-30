import { z } from 'zod';
import { NextResponse } from 'next/server';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';
import { getSettings, upsertSettings } from '@/lib/settings-service';
import { sanitizeObject } from '@/lib/sanitize';

export const runtime = 'nodejs';

const schema = z.object({
  cvMediaId: z.string().optional().nullable(),
  cvUrl: z.string().url().optional().nullable()
});

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleaned = sanitizeObject(parsed.data);
  const settings = await upsertSettings(cleaned);
  return NextResponse.json({ settings });
}
