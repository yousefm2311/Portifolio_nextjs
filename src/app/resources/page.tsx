import { notFound } from 'next/navigation';
import ResourcesView from '@/components/ResourcesView';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const settings = await getSettings();
  if (!settings?.enableResources) return notFound();

  return (
    <div className="min-h-screen">
      <ResourcesView resources={settings?.resources ?? null} />
    </div>
  );
}
