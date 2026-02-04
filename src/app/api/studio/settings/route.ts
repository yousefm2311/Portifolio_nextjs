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

const sectionIntroSchema = z.object({
  ar: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string()
  }),
  en: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string()
  })
});

const notesSchema = z.object({
  ar: z.object({
    noteA: z.string(),
    noteB: z.string()
  }),
  en: z.object({
    noteA: z.string(),
    noteB: z.string()
  })
});

const cardItemSchema = z.object({
  title: z.string(),
  desc: z.string(),
  icon: z.string().optional().nullable(),
  mediaId: z.string().optional().nullable()
});

const cardListSchema = z.object({
  ar: z.array(cardItemSchema),
  en: z.array(cardItemSchema)
});

const ctaSchema = z.object({
  ar: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    primaryLabel: z.string(),
    secondaryLabel: z.string()
  }),
  en: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    primaryLabel: z.string(),
    secondaryLabel: z.string()
  })
});

const resourceItemSchema = z.object({
  title: z.string(),
  desc: z.string(),
  url: z.string().url(),
  type: z.enum(['guide', 'link', 'tool', 'file', 'video']),
  badge: z.string().optional().nullable()
});

const resourcesSchema = z.object({
  ar: z.array(resourceItemSchema),
  en: z.array(resourceItemSchema)
});

const servicePlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  highlight: z.boolean().optional().nullable()
});

const servicesSchema = z.object({
  ar: z.array(servicePlanSchema),
  en: z.array(servicePlanSchema)
});

const schema = z.object({
  cvMediaId: z.string().optional().nullable(),
  cvUrl: z.string().url().optional().nullable(),
  heroBadges: localizedListSchema.optional().nullable(),
  impactItems: localizedImpactSchema.optional().nullable(),
  techMarquee: localizedListSchema.optional().nullable(),
  timeline: localizedTimelineSchema.optional().nullable(),
  capabilitiesIntro: sectionIntroSchema.optional().nullable(),
  capabilitiesNotes: notesSchema.optional().nullable(),
  capabilitiesItems: cardListSchema.optional().nullable(),
  processIntro: sectionIntroSchema.optional().nullable(),
  processSteps: cardListSchema.optional().nullable(),
  cta: ctaSchema.optional().nullable(),
  enableResources: z.boolean().optional(),
  enableServices: z.boolean().optional(),
  enableCaseStudy: z.boolean().optional(),
  resources: resourcesSchema.optional().nullable(),
  services: servicesSchema.optional().nullable()
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
