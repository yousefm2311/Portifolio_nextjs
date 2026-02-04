import AdminSettingsForm from '@/components/admin/AdminSettingsForm';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function StudioSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-white/60">Studio</p>
        <h1 className="text-2xl font-semibold">إعدادات الاستوديو</h1>
        <p className="text-muted">تحديث البريد المسموح وإعدادات الحماية.</p>
      </div>
      <AdminSettingsForm initialSettings={settings ?? null} />
      <div className="glass rounded-2xl p-6 space-y-2 text-sm text-muted">
        <p>تأكد من تحديث متغيرات البيئة في Vercel قبل النشر.</p>
        <p>ADMIN_EMAILS و NEXTAUTH_SECRET إلزامية.</p>
      </div>
    </div>
  );
}
