import { NextResponse } from 'next/server';
import { getAppBySlug } from '@/lib/app-service';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const app = await getAppBySlug(params.slug);
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(app);
}
