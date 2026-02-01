import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function isAllowed(url: URL) {
  if (url.hostname.endsWith('aliyuncs.com')) return true;
  return false;
}

function guessContentType(pathname: string) {
  const lower = pathname.toLowerCase();
  if (lower.endsWith('.mp4')) return 'video/mp4';
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  if (lower.endsWith('.m4v')) return 'video/x-m4v';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return undefined;
}

type Params = { encoded: string };

async function handle(req: Request, params: Params) {
  let target: URL;
  try {
    target = new URL(fromBase64Url(params.encoded));
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!isAllowed(target)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const range = req.headers.get('range') ?? undefined;
  const res = await fetch(target.toString(), {
    headers: range ? { Range: range } : undefined
  });

  const headers = new Headers(res.headers);
  for (const key of Array.from(headers.keys())) {
    if (key.toLowerCase().startsWith('x-oss-')) {
      headers.delete(key);
    }
  }
  headers.delete('x-oss-force-download');
  headers.delete('x-oss-object-type');
  const guessedType = guessContentType(target.pathname);
  if (!headers.get('Content-Type') || headers.get('Content-Type') === 'application/octet-stream') {
    if (guessedType) headers.set('Content-Type', guessedType);
  }
  if (guessedType?.startsWith('video/')) {
    headers.set('Content-Disposition', 'inline');
  } else if (headers.get('Content-Disposition')?.toLowerCase().includes('attachment')) {
    headers.set('Content-Disposition', 'inline');
  }
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=86400');

  return new Response(res.body, {
    status: res.status,
    headers
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> | Params }
) {
  const resolved = await params;
  return handle(req, resolved);
}

export async function HEAD(
  req: Request,
  { params }: { params: Promise<Params> | Params }
) {
  const resolved = await params;
  return handle(req, resolved);
}
