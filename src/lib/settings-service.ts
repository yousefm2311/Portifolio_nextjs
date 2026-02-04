import { connectToDatabase } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { normalizeMedia } from '@/lib/serializers';
import type { SettingsDTO, LocalizedImpact, LocalizedList, LocalizedTimeline } from '@/lib/types';

const normalizeList = (list?: LocalizedList | null): LocalizedList | null => {
  if (!list) return null;
  return {
    ar: Array.isArray(list.ar) ? list.ar.map((item) => `${item}`) : [],
    en: Array.isArray(list.en) ? list.en.map((item) => `${item}`) : []
  };
};

const normalizeImpact = (list?: LocalizedImpact | null): LocalizedImpact | null => {
  if (!list) return null;
  const mapItem = (item: any) => ({
    value: item?.value ? `${item.value}` : '',
    label: item?.label ? `${item.label}` : ''
  });
  return {
    ar: Array.isArray(list.ar) ? list.ar.map(mapItem) : [],
    en: Array.isArray(list.en) ? list.en.map(mapItem) : []
  };
};

const normalizeTimeline = (list?: LocalizedTimeline | null): LocalizedTimeline | null => {
  if (!list) return null;
  const mapItem = (item: any) => ({
    year: item?.year ? `${item.year}` : '',
    title: item?.title ? `${item.title}` : '',
    desc: item?.desc ? `${item.desc}` : ''
  });
  return {
    ar: Array.isArray(list.ar) ? list.ar.map(mapItem) : [],
    en: Array.isArray(list.en) ? list.en.map(mapItem) : []
  };
};

export async function getSettings() {
  await connectToDatabase();
  const doc = await SiteSettings.findOne()
    .populate('cvMediaId')
    .lean();

  if (!doc) return null;
  return {
    _id: doc._id?.toString() ?? doc.id,
    cvMedia: normalizeMedia(doc.cvMediaId),
    cvUrl: doc.cvUrl ?? null,
    heroBadges: normalizeList(doc.heroBadges ?? null),
    impactItems: normalizeImpact(doc.impactItems ?? null),
    techMarquee: normalizeList(doc.techMarquee ?? null),
    timeline: normalizeTimeline(doc.timeline ?? null)
  } as SettingsDTO;
}

export async function upsertSettings(payload: {
  cvMediaId?: string | null;
  cvUrl?: string | null;
  heroBadges?: SettingsDTO['heroBadges'];
  impactItems?: SettingsDTO['impactItems'];
  techMarquee?: SettingsDTO['techMarquee'];
  timeline?: SettingsDTO['timeline'];
}) {
  await connectToDatabase();
  const updated = await SiteSettings.findOneAndUpdate(
    {},
    { $set: payload },
    { upsert: true, new: true }
  )
    .populate('cvMediaId')
    .lean();

  return {
    _id: updated._id?.toString() ?? updated.id,
    cvMedia: normalizeMedia(updated.cvMediaId),
    cvUrl: updated.cvUrl ?? null,
    heroBadges: normalizeList(updated.heroBadges ?? null),
    impactItems: normalizeImpact(updated.impactItems ?? null),
    techMarquee: normalizeList(updated.techMarquee ?? null),
    timeline: normalizeTimeline(updated.timeline ?? null)
  } as SettingsDTO;
}
