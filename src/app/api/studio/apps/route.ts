import { NextResponse } from 'next/server';
import { appInputSchema } from '@/lib/validators';
import { sanitizeObject } from '@/lib/sanitize';
import { connectToDatabase } from '@/lib/db';
import { App } from '@/models/App';
import { AuditLog } from '@/models/AuditLog';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const payload = await req.json();
  const parsed = appInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleaned = sanitizeObject(parsed.data);
  if (cleaned.slug) cleaned.slug = cleaned.slug.toLowerCase();
  await connectToDatabase();
  try {
    const app = await App.create({
      ...cleaned,
      publishedAt: cleaned.status === 'published' ? new Date() : undefined
    });

    await AuditLog.create({
      action: 'create',
      entity: 'app',
      entityId: app._id.toString(),
      byEmail: session.user?.email ?? 'unknown',
      meta: { title: app.title }
    });

    return NextResponse.json({ appId: app._id.toString() }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create app' }, { status: 500 });
  }
}
