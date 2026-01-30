import { connectToDatabase } from './db';
import { App } from '@/models/App';
import '@/models/Media';
import { normalizeApp } from './serializers';
import { AppDTO } from './types';

export type AppQuery = {
  category?: 'Flutter' | 'Backend' | 'Admin' | 'Tools' | 'DevOps';
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
};

export async function getPublishedApps(query: AppQuery = {}) {
  await connectToDatabase();
  const { category, tag, q } = query;
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;

  const filter: Record<string, any> = { status: 'published' };
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { titleEn: { $regex: q, $options: 'i' } },
      { shortDesc: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
  }

  const total = await App.countDocuments(filter);
  const items = await App.find(filter)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('media.iconId')
    .populate('media.coverId')
    .populate('media.galleryIds')
    .populate('demo.videoId')
    .lean();

  const normalized = items.map((doc) => normalizeApp(doc));
  return {
    items: normalized,
    page,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getAppBySlug(slug: string, includeDraft = false) {
  await connectToDatabase();
  const filter: Record<string, any> = { slug };
  if (!includeDraft) filter.status = 'published';

  const doc = await App.findOne(filter)
    .populate('media.iconId')
    .populate('media.coverId')
    .populate('media.galleryIds')
    .populate('demo.videoId')
    .lean();

  if (!doc) return null;
  return normalizeApp(doc);
}

export async function getAdminApps(query: AppQuery = {}) {
  await connectToDatabase();
  const { category, tag, q } = query;
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const filter: Record<string, any> = {};
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { titleEn: { $regex: q, $options: 'i' } },
      { slug: { $regex: q, $options: 'i' } }
    ];
  }

  const total = await App.countDocuments(filter);
  const items = await App.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('media.iconId')
    .populate('media.coverId')
    .populate('demo.videoId')
    .lean();

  const normalized = items.map((doc) => normalizeApp(doc));
  return {
    items: normalized,
    page,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getAppById(id: string) {
  await connectToDatabase();
  const doc = await App.findById(id)
    .populate('media.iconId')
    .populate('media.coverId')
    .populate('media.galleryIds')
    .populate('demo.videoId')
    .lean();

  if (!doc) return null;
  return normalizeApp(doc);
}
