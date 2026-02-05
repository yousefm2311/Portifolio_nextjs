import { connectToDatabase } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { normalizeMedia } from '@/lib/serializers';
import type {
  SettingsDTO,
  LocalizedImpact,
  LocalizedList,
  LocalizedTimeline,
  LocalizedSectionIntro,
  LocalizedNotes,
  LocalizedCardList,
  LocalizedCta,
  LocalizedResources,
  LocalizedServices
} from '@/lib/types';

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

const normalizeIntro = (value?: LocalizedSectionIntro | null): LocalizedSectionIntro | null => {
  if (!value) return null;
  const mapItem = (item: any) => ({
    eyebrow: item?.eyebrow ? `${item.eyebrow}` : '',
    title: item?.title ? `${item.title}` : '',
    subtitle: item?.subtitle ? `${item.subtitle}` : ''
  });
  return {
    ar: mapItem(value.ar),
    en: mapItem(value.en)
  };
};

const normalizeNotes = (value?: LocalizedNotes | null): LocalizedNotes | null => {
  if (!value) return null;
  const mapItem = (item: any) => ({
    noteA: item?.noteA ? `${item.noteA}` : '',
    noteB: item?.noteB ? `${item.noteB}` : ''
  });
  return {
    ar: mapItem(value.ar),
    en: mapItem(value.en)
  };
};

const resolveMediaId = (value: any) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if ('_id' in value && value._id) return value._id.toString();
    if (typeof value.toString === 'function') return value.toString();
  }
  return null;
};

const normalizeCardList = (list?: LocalizedCardList | null): LocalizedCardList | null => {
  if (!list) return null;
  const mapItem = (item: any) => ({
    title: item?.title ? `${item.title}` : '',
    desc: item?.desc ? `${item.desc}` : '',
    icon: item?.icon ? `${item.icon}` : '',
    mediaId: resolveMediaId(item?.mediaId),
    media: normalizeMedia(item?.mediaId)
  });
  return {
    ar: Array.isArray(list.ar) ? list.ar.map(mapItem) : [],
    en: Array.isArray(list.en) ? list.en.map(mapItem) : []
  };
};

const normalizeCta = (value?: LocalizedCta | null): LocalizedCta | null => {
  if (!value) return null;
  const mapItem = (item: any) => ({
    eyebrow: item?.eyebrow ? `${item.eyebrow}` : '',
    title: item?.title ? `${item.title}` : '',
    subtitle: item?.subtitle ? `${item.subtitle}` : '',
    primaryLabel: item?.primaryLabel ? `${item.primaryLabel}` : '',
    secondaryLabel: item?.secondaryLabel ? `${item.secondaryLabel}` : ''
  });
  return {
    ar: mapItem(value.ar),
    en: mapItem(value.en)
  };
};

const normalizeResources = (list?: LocalizedResources | null): LocalizedResources | null => {
  if (!list) return null;
  const allowedTypes = new Set(['guide', 'link', 'tool', 'file', 'video']);
  const mapItem = (item: any) => ({
    title: item?.title ? `${item.title}` : '',
    desc: item?.desc ? `${item.desc}` : '',
    url: item?.url ? `${item.url}` : '',
    type: allowedTypes.has(item?.type) ? item.type : 'link',
    badge: item?.badge ? `${item.badge}` : ''
  });
  return {
    ar: Array.isArray(list.ar) ? list.ar.map(mapItem) : [],
    en: Array.isArray(list.en) ? list.en.map(mapItem) : []
  };
};

const normalizeServices = (list?: LocalizedServices | null): LocalizedServices | null => {
  if (!list) return null;
  const mapItem = (item: any) => ({
    name: item?.name ? `${item.name}` : '',
    price: item?.price ? `${item.price}` : '',
    description: item?.description ? `${item.description}` : '',
    features: Array.isArray(item?.features)
      ? item.features.map((feature: any) => `${feature}`)
      : [],
    highlight: Boolean(item?.highlight)
  });
  return {
    ar: Array.isArray(list.ar) ? list.ar.map(mapItem) : [],
    en: Array.isArray(list.en) ? list.en.map(mapItem) : []
  };
};

export async function getSettings() {
  await connectToDatabase();
  const doc = await SiteSettings.findOne()
    .sort({ updatedAt: -1 })
    .populate([
      { path: 'cvMediaId' },
      { path: 'capabilitiesItems.ar.mediaId', strictPopulate: false },
      { path: 'capabilitiesItems.en.mediaId', strictPopulate: false },
      { path: 'processSteps.ar.mediaId', strictPopulate: false },
      { path: 'processSteps.en.mediaId', strictPopulate: false }
    ])
    .lean<Record<string, any>>();

  if (!doc) return null;
  return {
    _id: doc._id?.toString() ?? doc.id,
    cvMedia: normalizeMedia(doc.cvMediaId),
    cvUrl: doc.cvUrl ?? null,
    heroBadges: normalizeList(doc.heroBadges ?? null),
    impactItems: normalizeImpact(doc.impactItems ?? null),
    techMarquee: normalizeList(doc.techMarquee ?? null),
    timeline: normalizeTimeline(doc.timeline ?? null),
    capabilitiesIntro: normalizeIntro(doc.capabilitiesIntro ?? null),
    capabilitiesNotes: normalizeNotes(doc.capabilitiesNotes ?? null),
    capabilitiesItems: normalizeCardList(doc.capabilitiesItems ?? null),
    processIntro: normalizeIntro(doc.processIntro ?? null),
    processSteps: normalizeCardList(doc.processSteps ?? null),
    cta: normalizeCta(doc.cta ?? null),
    enableResources: Boolean(doc.enableResources),
    enableServices: Boolean(doc.enableServices),
    enableCaseStudy: Boolean(doc.enableCaseStudy),
    resources: normalizeResources(doc.resources ?? null),
    services: normalizeServices(doc.services ?? null)
  } as SettingsDTO;
}

export async function upsertSettings(payload: {
  cvMediaId?: string | null;
  cvUrl?: string | null;
  heroBadges?: SettingsDTO['heroBadges'];
  impactItems?: SettingsDTO['impactItems'];
  techMarquee?: SettingsDTO['techMarquee'];
  timeline?: SettingsDTO['timeline'];
  capabilitiesIntro?: SettingsDTO['capabilitiesIntro'];
  capabilitiesNotes?: SettingsDTO['capabilitiesNotes'];
  capabilitiesItems?: SettingsDTO['capabilitiesItems'];
  processIntro?: SettingsDTO['processIntro'];
  processSteps?: SettingsDTO['processSteps'];
  cta?: SettingsDTO['cta'];
  enableResources?: SettingsDTO['enableResources'];
  enableServices?: SettingsDTO['enableServices'];
  enableCaseStudy?: SettingsDTO['enableCaseStudy'];
  resources?: SettingsDTO['resources'];
  services?: SettingsDTO['services'];
}) {
  await connectToDatabase();
  const updated = await SiteSettings.findOneAndUpdate(
    {},
    { $set: payload },
    { upsert: true, new: true, strict: false, sort: { updatedAt: -1 } }
  )
    .populate([
      { path: 'cvMediaId' },
      { path: 'capabilitiesItems.ar.mediaId', strictPopulate: false },
      { path: 'capabilitiesItems.en.mediaId', strictPopulate: false },
      { path: 'processSteps.ar.mediaId', strictPopulate: false },
      { path: 'processSteps.en.mediaId', strictPopulate: false }
    ])
    .lean<Record<string, any>>();

  if (!updated) return null;

  return {
    _id: updated._id?.toString() ?? updated.id,
    cvMedia: normalizeMedia(updated.cvMediaId),
    cvUrl: updated.cvUrl ?? null,
    heroBadges: normalizeList(updated.heroBadges ?? null),
    impactItems: normalizeImpact(updated.impactItems ?? null),
    techMarquee: normalizeList(updated.techMarquee ?? null),
    timeline: normalizeTimeline(updated.timeline ?? null),
    capabilitiesIntro: normalizeIntro(updated.capabilitiesIntro ?? null),
    capabilitiesNotes: normalizeNotes(updated.capabilitiesNotes ?? null),
    capabilitiesItems: normalizeCardList(updated.capabilitiesItems ?? null),
    processIntro: normalizeIntro(updated.processIntro ?? null),
    processSteps: normalizeCardList(updated.processSteps ?? null),
    cta: normalizeCta(updated.cta ?? null),
    enableResources: Boolean(updated.enableResources),
    enableServices: Boolean(updated.enableServices),
    enableCaseStudy: Boolean(updated.enableCaseStudy),
    resources: normalizeResources(updated.resources ?? null),
    services: normalizeServices(updated.services ?? null)
  } as SettingsDTO;
}
