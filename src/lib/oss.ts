import OSS from 'ali-oss';

const OSS_REGION = process.env.OSS_REGION;
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
    client = new OSS({
      region: OSS_REGION,
      bucket: OSS_BUCKET,
      accessKeyId: OSS_ACCESS_KEY_ID,
      accessKeySecret: OSS_ACCESS_KEY_SECRET
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
}) {
  const client = getOssClient();
  if (!client) throw new Error('OSS is not configured');

  await client.put(params.key, params.body, {
    headers: {
      'Content-Type': params.contentType,
      'Cache-Control': params.cacheControl ?? 'public, max-age=31536000, immutable'
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
