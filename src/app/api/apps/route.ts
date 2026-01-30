import { NextResponse } from 'next/server';
import { appQuerySchema } from '@/lib/validators';
import { getPublishedApps } from '@/lib/app-service';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parsed = appQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = await getPublishedApps(parsed.data);
  return NextResponse.json(data);
}
