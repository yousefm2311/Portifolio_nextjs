import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import AdmZip from 'adm-zip';
import { getR2PublicUrl, uploadToR2, getR2Client } from '@/lib/r2';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const FLUTTER_DIR = path.join(PUBLIC_DIR, 'flutter');

const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.map': 'application/json'
};

function guessContentType(name: string) {
  const ext = path.extname(name).toLowerCase();
  return contentTypes[ext] ?? 'application/octet-stream';
}

function normalizeEntries(entries: AdmZip.IZipEntry[]) {
  const files = entries.filter((e) => !e.isDirectory);
  let names = files.map((e) => e.entryName.replace(/\\/g, '/'));

  const hasBuildWeb = names.some((name) => name.startsWith('build/web/'));
  if (hasBuildWeb) {
    names = names.map((name) => name.replace(/^build\/web\//, ''));
    return files.map((entry, index) => ({ entry, name: names[index] }));
  }

  const firstSegments = names.map((name) => name.split('/')[0]);
  const allSameRoot = firstSegments.every((seg) => seg === firstSegments[0]);
  const hasRootFiles = names.some((name) => !name.includes('/'));

  if (allSameRoot && !hasRootFiles) {
    const root = `${firstSegments[0]}/`;
    names = names.map((name) => name.replace(root, ''));
  }

  return files.map((entry, index) => ({ entry, name: names[index] }));
}

function withBaseHref(html: string, baseHref: string) {
  if (html.includes('<base')) {
    return html.replace(/<base\s+href="[^"]*"\s*\/>/i, `<base href="${baseHref}" />`)
      .replace(/<base\s+href="[^"]*"\s*>/i, `<base href="${baseHref}">`);
  }
  return html.replace(/<head>/i, `<head><base href="${baseHref}">`);
}

function buildBaseHref(publicUrl: string, prefix: string) {
  const url = new URL(publicUrl);
  const basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
  const combined = `${basePath}/${prefix}`.replace(/\/+/g, '/');
  return `${combined}/`;
}

async function saveToLocal(file: File, slug: string) {
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const stamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const folderName = `${safeSlug}-${stamp}-${random}`;
  const targetDir = path.join(FLUTTER_DIR, folderName);
  const tempDir = path.join(process.cwd(), '.tmp', folderName);

  await fs.mkdir(tempDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const zip = new AdmZip(buffer);
  zip.extractAllTo(tempDir, true);

  const rootDir = await fs
    .stat(path.join(tempDir, 'build', 'web'))
    .then(() => path.join(tempDir, 'build', 'web'))
    .catch(async () => {
      const entries = await fs.readdir(tempDir, { withFileTypes: true });
      if (entries.length === 1 && entries[0]?.isDirectory()) {
        return path.join(tempDir, entries[0].name);
      }
      return tempDir;
    });

  await fs.mkdir(targetDir, { recursive: true });
  await fs.cp(rootDir, targetDir, { recursive: true });
  await fs.rm(tempDir, { recursive: true, force: true });

  return { embedUrl: `/flutter/${folderName}/index.html`, folderName };
}

export async function uploadFlutterWebZip(file: File, slug: string) {
  if (!getR2Client() || !getR2PublicUrl()) {
    return saveToLocal(file, slug);
  }

  const publicUrl = getR2PublicUrl() as string;
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const stamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const folderName = `${safeSlug}-${stamp}-${random}`;
  const prefix = `flutter/${folderName}`;
  const baseHref = buildBaseHref(publicUrl, prefix);

  const buffer = Buffer.from(await file.arrayBuffer());
  const zip = new AdmZip(buffer);
  const entries = normalizeEntries(zip.getEntries());

  for (const { entry, name } of entries) {
    if (!name) continue;
    let data = entry.getData();
    let contentType = guessContentType(name);
    let cacheControl = 'public, max-age=31536000, immutable';

    if (name === 'index.html') {
      const html = data.toString('utf8');
      const updated = withBaseHref(html, baseHref);
      data = Buffer.from(updated, 'utf8');
      contentType = 'text/html; charset=utf-8';
      cacheControl = 'no-cache';
    }

    await uploadToR2({
      key: `${prefix}/${name}`,
      body: data,
      contentType,
      cacheControl
    });
  }

  const embedUrl = `${publicUrl.replace(/\/$/, '')}/${prefix}/index.html`;
  return { embedUrl, folderName };
}
