import { NextResponse } from 'next/server';
import { appUpdateSchema } from '@/lib/validators';
import { sanitizeObject } from '@/lib/sanitize';
import { connectToDatabase } from '@/lib/db';
import { App } from '@/models/App';
import { AuditLog } from '@/models/AuditLog';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';

export const runtime = 'nodejs';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const payload = await req.json();
  const parsed = appUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleaned = sanitizeObject(parsed.data);
  if (cleaned.slug) cleaned.slug = cleaned.slug.toLowerCase();
  if (cleaned.status === 'published') {
    cleaned.publishedAt = new Date();
  }
  await connectToDatabase();
  const updated = await App.findByIdAndUpdate(params.id, cleaned, { new: true });
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await AuditLog.create({
    action: 'update',
    entity: 'app',
    entityId: updated._id.toString(),
    byEmail: session.user?.email ?? 'unknown',
    meta: { title: updated.title }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  await connectToDatabase();
  const deleted = await App.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await AuditLog.create({
    action: 'delete',
    entity: 'app',
    entityId: params.id,
    byEmail: session.user?.email ?? 'unknown',
    meta: { title: deleted.title }
  });

  return NextResponse.json({ ok: true });
}
