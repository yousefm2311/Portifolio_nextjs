import OSS from 'ali-oss';

const OSS_REGION = process.env.OSS_REGION;
const OSS_ENDPOINT = process.env.OSS_ENDPOINT;
const OSS_BUCKET = process.env.OSS_BUCKET;
const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID;
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET;
const OSS_PUBLIC_BASE_URL = process.env.OSS_PUBLIC_BASE_URL;

let client: OSS | null = null;

export function getOssClient() {
  if (!OSS_REGION || !OSS_BUCKET || !OSS_ACCESS_KEY_ID || !OSS_ACCESS_KEY_SECRET) {
    return null;
  }
  if (!client) {
    const normalizedRegion = OSS_REGION.startsWith('oss-') ? OSS_REGION : `oss-${OSS_REGION}`;
    client = new OSS({
      region: normalizedRegion,
      bucket: OSS_BUCKET,
      accessKeyId: OSS_ACCESS_KEY_ID,
      accessKeySecret: OSS_ACCESS_KEY_SECRET,
      endpoint: OSS_ENDPOINT,
      timeout: 180000
    });
  }
  return client;
}

export function getOssPublicBaseUrl() {
  return OSS_PUBLIC_BASE_URL ?? null;
}

export async function uploadToOSS(params: {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
  contentDisposition?: string;
  filename?: string;
}) {
  const client = getOssClient();
  if (!client) throw new Error('OSS is not configured');

  const disposition =
    params.contentDisposition ??
    (params.filename ? `inline; filename="${params.filename}"` : 'inline');

  await client.put(params.key, params.body, {
    mime: params.contentType,
    headers: {
      'Content-Type': params.contentType,
      'Cache-Control': params.cacheControl ?? 'public, max-age=31536000, immutable',
      'Content-Disposition': disposition
    }
  });

  const base = (OSS_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
  return `${base}/${params.key}`;
}

export async function deleteFromOSS(key: string) {
  const client = getOssClient();
  if (!client) throw new Error('OSS is not configured');
  await client.delete(key);
}
