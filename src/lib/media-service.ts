import { connectToDatabase } from './db';
import { Media } from '@/models/Media';

export async function getMediaList() {
  await connectToDatabase();
  const items = await Media.find().sort({ createdAt: -1 }).lean();
  return items.map((item) => ({
    _id: item._id?.toString() ?? item.id,
    type: item.type,
    provider: item.provider,
    providerId: item.providerId,
    url: item.url,
    thumbnailUrl: item.thumbnailUrl,
    width: item.width,
    height: item.height,
    duration: item.duration,
    size: item.size,
    alt: item.alt
  }));
}
