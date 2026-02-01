import { NextResponse } from 'next/server';
import { publishSchema } from '@/lib/validators';
import { connectToDatabase } from '@/lib/db';
import { App } from '@/models/App';
import { AuditLog } from '@/models/AuditLog';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const body = await req.json().catch(() => ({}));
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const action = parsed.data.action ?? 'publish';
  await connectToDatabase();
  const update =
    action === 'publish'
      ? { status: 'published', publishedAt: new Date() }
      : { status: 'draft', publishedAt: null };

  const resolved = await params;
  const updated = await App.findByIdAndUpdate(resolved.id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await AuditLog.create({
    action: 'publish',
    entity: 'app',
    entityId: updated._id.toString(),
    byEmail: session.user?.email ?? 'unknown',
    meta: { status: updated.status }
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
