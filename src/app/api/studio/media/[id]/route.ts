import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';
import { AuditLog } from '@/models/AuditLog';
import { deleteFromOSS, getOssClient } from '@/lib/oss';

export const runtime = 'nodejs';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  await connectToDatabase();
  const resolved = await params;
  const media = await Media.findById(resolved.id);
  if (!media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (media.provider === 'cloudinary' && media.providerId) {
    await cloudinary.uploader.destroy(media.providerId, { resource_type: 'auto' });
  }

  if (media.provider === 'oss' && media.providerId && getOssClient()) {
    await deleteFromOSS(media.providerId);
  }

  await media.deleteOne();
  await AuditLog.create({
    action: 'delete',
    entity: 'media',
    entityId: resolved.id,
    byEmail: session.user?.email ?? 'unknown',
    meta: { url: media.url }
  });
  return NextResponse.json({ ok: true });
}
