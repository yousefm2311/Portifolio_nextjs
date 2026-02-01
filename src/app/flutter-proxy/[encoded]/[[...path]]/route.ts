import { NextResponse } from 'next/server';
import { lookup } from 'mime-types';

function decodeBase(encoded: string) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(padded, 'base64');
  return buffer.toString('utf8');
}

function buildBaseHref(encoded: string) {
  return `/flutter-proxy/${encoded}/`;
}

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ encoded: string; path?: string[] }> }
) {
  const { encoded, path } = await params;
  const baseUrl = decodeBase(encoded);
  const suffix = path?.join('/') ?? 'index.html';
  const target = `${baseUrl.replace(/\/$/, '')}/${suffix}`;

  const res = await fetch(target);
  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
  }

  const contentType = res.headers.get('content-type') ?? (lookup(suffix) || 'application/octet-stream');
  const headers = new Headers();
  headers.set('Content-Type', contentType as string);
  headers.set('Content-Disposition', 'inline');
  headers.set('Cache-Control', 'no-cache');

  if (suffix === 'index.html') {
    const html = await res.text();
    const baseHref = buildBaseHref(encoded);
    const updated = html.includes('<base')
      ? html.replace(/<base\s+href="[^"]*"\s*\/>/i, `<base href="${baseHref}" />`)
        .replace(/<base\s+href="[^"]*"\s*>/i, `<base href="${baseHref}">`)
      : html.replace(/<head>/i, `<head><base href="${baseHref}">`);
    return new NextResponse(updated, { headers });
  }

  const arrayBuffer = await res.arrayBuffer();
  return new NextResponse(arrayBuffer, { headers });
}
