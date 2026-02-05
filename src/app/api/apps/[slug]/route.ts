import { NextRequest, NextResponse } from 'next/server';
import { getAppBySlug } from '@/lib/app-service';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const app = await getAppBySlug(resolvedParams.slug);
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(app);
}
