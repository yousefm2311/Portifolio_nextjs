import { connectToDatabase } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { normalizeMedia } from '@/lib/serializers';

export type SettingsDTO = {
  _id: string;
  cvMedia?: ReturnType<typeof normalizeMedia>;
  cvUrl?: string | null;
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
    cvUrl: doc.cvUrl ?? null
  } as SettingsDTO;
}

export async function upsertSettings(payload: { cvMediaId?: string | null; cvUrl?: string | null }) {
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
    cvUrl: updated.cvUrl ?? null
  } as SettingsDTO;
}
