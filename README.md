# Portfolio Showcase — Yousef

A premium portfolio experience that presents apps inside a live device frame with interactive previews, media galleries, and full case studies. Includes a hidden **/studio** admin panel for content management.

## Tech Stack
- Next.js App Router (14/15) + TypeScript
- TailwindCSS + Framer Motion
- MongoDB Atlas + Mongoose
- NextAuth v5 (Credentials + optional Google OAuth)
- Cloudinary for media uploads

## Key Features
- Device-frame launcher (home screen experience)
- Live demo overlay with tabs (preview / screenshots / case study)
- Command Palette (Ctrl+K) for fast search
- RTL-first UI with English toggle
- Full admin panel (hidden from public UI)
- Signed uploads + media library
- Rate limiting, allowlist emails, input validation (Zod)

## Local Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables
- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXTAUTH_SECRET` — generate a secure secret
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `ADMIN_EMAILS` — comma-separated allowlist
- `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` — for seed script
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Seed Data
```bash
npm run seed
```
Creates an admin user (if env values provided) + sample media + a demo app.

## Admin Access (Hidden)
- Login: `/studio/login`
- Apps: `/studio/apps`
- Media: `/studio/media`
- Settings: `/studio/settings`

> **Security:** `/studio` routes are protected by middleware + NextAuth session + allowlist.

## CV (PDF) Upload
- Go to `/studio/settings`
- Upload your CV as PDF
- It will appear automatically on the About page and Home hero

## API Endpoints
Public:
- `GET /api/apps?category=&tag=&q=&page=`
- `GET /api/apps/[slug]`

Admin (protected):
- `POST /api/studio/apps`
- `PATCH /api/studio/apps/[id]`
- `DELETE /api/studio/apps/[id]`
- `POST /api/studio/apps/[id]/publish`
- `POST /api/studio/media`
- `DELETE /api/studio/media/[id]`

## Upload Flow (Cloudinary)
- `/studio` uses signed server upload via Cloudinary API key/secret
- File type + size checks in API
- Thumbnails handled by Cloudinary
- Best practice: integrate virus scanning for uploads (e.g. Cloudflare AV or a separate scanning service)

## Flutter Web ZIP Upload (Local Hosting)
You can upload a Flutter web build as a **ZIP** from `/studio`:
- Build your Flutter web: `flutter build web`
- Zip the contents of `build/web`
- Upload via the Admin form (Demo → Flutter Web)
- The system extracts to `public/flutter/<slug-...>/` and sets `embedUrl`

**Vercel + R2 (Recommended):**
- Set `R2_*` env vars (see `.env.example`)
- The upload API will unzip and push files to R2, then set `embedUrl` to the R2 public URL
- `index.html` base href is rewritten automatically for the subfolder

**Note:** On Vercel, the filesystem is read‑only at runtime, so local extraction is not supported.

## Alibaba Cloud OSS
If you use Alibaba OSS, set:
```
OSS_REGION
OSS_BUCKET
OSS_ACCESS_KEY_ID
OSS_ACCESS_KEY_SECRET
OSS_PUBLIC_BASE_URL
```
Uploads (media + Flutter Web ZIP) will go to OSS automatically when these vars exist.

## Production Checklist
- ✅ Use strong `NEXTAUTH_SECRET`
- ✅ Lock down `ADMIN_EMAILS`
- ✅ Set `NEXTAUTH_URL` on Vercel
- ✅ Enable Cloudinary upload presets if needed
- ✅ Use MongoDB IP allowlist
- ✅ Enable HTTPS and domain redirects

## Deploy on Vercel
1. Push to GitHub
2. Import to Vercel
3. Add env variables from `.env.example`
4. Deploy

## Notes
- No `/studio` links appear in the public UI
- Supports RTL by default with English toggle
- Designed for premium, device-frame UX
