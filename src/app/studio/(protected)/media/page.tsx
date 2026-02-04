import AdminMediaGrid from '@/components/admin/AdminMediaGrid';
import { getMediaList } from '@/lib/media-service';

export const dynamic = 'force-dynamic';

export default async function StudioMediaPage() {
  const media = await getMediaList();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-white/60">Studio</p>
        <h1 className="text-2xl font-semibold">مكتبة الوسائط</h1>
        <p className="text-muted">إدارة الصور والفيديوهات المرفوعة.</p>
      </div>
      <AdminMediaGrid initialMedia={media} />
    </div>
  );
}
