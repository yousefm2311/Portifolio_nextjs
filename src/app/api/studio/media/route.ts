import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';
import { AuditLog } from '@/models/AuditLog';
import { getOssClient, getOssPublicBaseUrl, uploadToOSS } from '@/lib/oss';

export const runtime = 'nodejs';

const MAX_SIZE_MB = 40;
const allowedTypes = ['image/', 'video/', 'application/pdf'];

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  await connectToDatabase();
  const items = await Media.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, 'studio');
  if (limited) return limited;

  const session = await enforceAdmin(req);
  if (session instanceof NextResponse) return session;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const alt = (formData.get('alt') as string | null) ?? undefined;

  if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  if (!allowedTypes.some((type) => file.type.startsWith(type))) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let mediaPayload: any = null;

  if (getOssClient() && getOssPublicBaseUrl()) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const key = `media/${fileName}`;
    const url = await uploadToOSS({
      key,
      body: buffer,
      contentType: file.type,
      cacheControl: file.type === 'application/pdf' ? 'public, max-age=3600' : undefined
    });

    mediaPayload = {
      type: file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : 'file',
      provider: 'oss',
      providerId: key,
      url,
      thumbnailUrl: url,
      size: buffer.length,
      alt
    };
  } else {
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}` , {
      folder: 'portfolio-showcase',
      resource_type: 'auto'
    });

    mediaPayload = {
      type: file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : 'file',
      provider: 'cloudinary',
      providerId: result.public_id,
      url: result.secure_url,
      thumbnailUrl: result.secure_url,
      width: result.width,
      height: result.height,
      duration: result.duration,
      size: result.bytes,
      alt
    };
  }

  await connectToDatabase();
  const media = await Media.create(mediaPayload);

  await AuditLog.create({
    action: 'create',
    entity: 'media',
    entityId: media._id.toString(),
    byEmail: session.user?.email ?? 'unknown',
    meta: { url: media.url }
  });

  return NextResponse.json({ media });
}
