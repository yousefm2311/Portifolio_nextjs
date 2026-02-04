import { z } from 'zod';
import { NextResponse } from 'next/server';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';
import { getSettings, upsertSettings } from '@/lib/settings-service';
import { sanitizeObject } from '@/lib/sanitize';

export const runtime = 'nodejs';

const localizedListSchema = z.object({
  ar: z.array(z.string()),
  en: z.array(z.string())
});

const impactItemSchema = z.object({
  value: z.string(),
  label: z.string()
});

const localizedImpactSchema = z.object({
  ar: z.array(impactItemSchema),
  en: z.array(impactItemSchema)
});

const timelineItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  desc: z.string()
});

const localizedTimelineSchema = z.object({
  ar: z.array(timelineItemSchema),
  en: z.array(timelineItemSchema)
});

const schema = z.object({
  cvMediaId: z.string().optional().nullable(),
  cvUrl: z.string().url().optional().nullable(),
  heroBadges: localizedListSchema.optional().nullable(),
  impactItems: localizedImpactSchema.optional().nullable(),
  techMarquee: localizedListSchema.optional().nullable(),
  timeline: localizedTimelineSchema.optional().nullable()
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
