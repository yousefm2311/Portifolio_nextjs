import { notFound } from 'next/navigation';
import ServicesView from '@/components/ServicesView';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const settings = await getSettings();
  if (!settings?.enableServices) return notFound();

  return (
    <div className="min-h-screen">
      <ServicesView services={settings?.services ?? null} />
    </div>
  );
}
