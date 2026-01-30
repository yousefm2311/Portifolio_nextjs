import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { AuditLog } from '@/models/AuditLog';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';

export const runtime = 'nodejs';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  await connectToDatabase();
  const media = await Media.findById(params.id);
  if (!media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (media.provider === 'cloudinary' && media.providerId) {
    await cloudinary.uploader.destroy(media.providerId, { resource_type: 'auto' });
  }

  await media.deleteOne();
  await AuditLog.create({
    action: 'delete',
    entity: 'media',
    entityId: params.id,
    byEmail: session.user?.email ?? 'unknown',
    meta: { url: media.url }
  });
  return NextResponse.json({ ok: true });
}
