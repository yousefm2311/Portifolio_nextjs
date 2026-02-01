import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { enforceAdmin, enforceRateLimit } from '@/lib/api-helpers';
import { AuditLog } from '@/models/AuditLog';
import { getOssClient, getOssPublicBaseUrl, uploadToOSS } from '@/lib/oss';
import { ensureMp4H264 } from '@/lib/video-transcode';

export const runtime = 'nodejs';

const MAX_SIZE_MB = 500;
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

  let buffer = Buffer.from(await file.arrayBuffer());
  let contentType = file.type;
  let filename = file.name;

  if (file.type.startsWith('video/')) {
    try {
      const converted = await ensureMp4H264(buffer, file.name);
      buffer = converted.buffer;
      contentType = converted.contentType;
      filename = converted.filename;
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message ?? 'Failed to convert video' },
        { status: 400 }
      );
    }
  }

  let mediaPayload: any = null;

  if (getOssClient() && getOssPublicBaseUrl()) {
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const key = `media/${fileName}`;
    const url = await uploadToOSS({
      key,
      body: buffer,
      contentType,
      cacheControl: contentType === 'application/pdf' ? 'public, max-age=3600' : undefined,
      contentDisposition: contentType === 'application/pdf' ? 'inline' : 'inline',
      filename
    });

    mediaPayload = {
      type: contentType.startsWith('image')
        ? 'image'
        : contentType.startsWith('video')
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
    const result = await cloudinary.uploader.upload(`data:${contentType};base64,${buffer.toString('base64')}` , {
      folder: 'portfolio-showcase',
      resource_type: 'auto'
    });

    mediaPayload = {
      type: contentType.startsWith('image')
        ? 'image'
        : contentType.startsWith('video')
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
