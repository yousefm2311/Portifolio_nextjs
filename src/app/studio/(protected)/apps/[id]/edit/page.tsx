import { notFound } from 'next/navigation';
import AppForm from '@/components/admin/AppForm';
import { getAppById } from '@/lib/app-service';

export const dynamic = 'force-dynamic';

export default async function EditAppPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const app = await getAppById(resolvedParams.id);
  if (!app) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">تعديل التطبيق</h1>
      <AppForm mode="edit" initial={app} />
    </div>
  );
}
