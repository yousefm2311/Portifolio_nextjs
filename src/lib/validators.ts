import { z } from 'zod';

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const roleVariantSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  previewMediaId: z.string().optional().nullable()
});

export const featureSchema = z.object({
  title: z.string().min(1),
  details: z.string().min(1)
});

export const kpiSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

export const hotspotSchema = z.object({
  timeStart: z.number().min(0),
  timeEnd: z.number().min(0),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  action: z.string().min(1),
  label: z.string().min(1)
});

export const appInputSchema = z.object({
  title: z.string().min(2),
  titleEn: z.string().optional().nullable(),
  slug: z.string().regex(slugRegex, 'Slug must be lowercase with hyphens'),
  shortDesc: z.string().min(10),
  description: z.string().min(10),
  category: z.enum(['Flutter', 'Backend', 'Admin', 'Tools', 'DevOps']),
  tags: z.array(z.string()).default([]),
  roleVariants: z.array(roleVariantSchema).default([]),
  techStack: z.array(z.string()).default([]),
  features: z.array(featureSchema).default([]),
  kpis: z.array(kpiSchema).optional().default([]),
  links: z
    .object({
      liveDemoUrl: z.string().url().optional().nullable(),
      githubUrl: z.string().url().optional().nullable(),
      apkUrl: z.string().url().optional().nullable(),
      iosUrl: z.string().url().optional().nullable(),
      playStoreUrl: z.string().url().optional().nullable(),
      appStoreUrl: z.string().url().optional().nullable()
    })
    .optional()
    .default({}),
  demo: z.object({
    type: z.enum(['video', 'flutter_web', 'interactive_video']),
    embedUrl: z.string().url().optional().nullable(),
    videoId: z.string().optional().nullable(),
    interactiveHotspots: z.array(hotspotSchema).optional().default([])
  }),
  media: z
    .object({
      iconId: z.string().optional().nullable(),
      coverId: z.string().optional().nullable(),
      galleryIds: z.array(z.string()).optional().default([])
    })
    .optional()
    .default({}),
  mediaDisplay: z
    .object({
      cover: z.enum(['phone', 'full']).optional(),
      gallery: z.enum(['phone', 'full']).optional()
    })
    .optional()
    .default({}),
  caseStudy: z.object({
    problem: z.string().min(5),
    solution: z.string().min(5),
    architecture: z.string().min(5),
    challenges: z.string().min(5),
    results: z.string().min(5)
  }),
  status: z.enum(['draft', 'published']).optional()
});

export const appUpdateSchema = appInputSchema.partial();

export const appQuerySchema = z.object({
  category: z.enum(['Flutter', 'Backend', 'Admin', 'Tools', 'DevOps']).optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12)
});

export const publishSchema = z.object({
  action: z.enum(['publish', 'unpublish']).optional()
});

export const mediaDeleteSchema = z.object({
  id: z.string().min(1)
});
