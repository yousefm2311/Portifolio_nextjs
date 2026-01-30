import AdminAppsTable from '@/components/admin/AdminAppsTable';
import { getAdminApps } from '@/lib/app-service';

export const dynamic = 'force-dynamic';

export default async function StudioAppsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items } = await getAdminApps({
    q: params.q,
    page: params.page ? Number(params.page) : 1,
    limit: 30
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">إدارة التطبيقات</h1>
        <p className="text-muted">إنشاء وتعديل ونشر التطبيقات.</p>
      </div>
      <AdminAppsTable initialApps={items} />
    </div>
  );
}
