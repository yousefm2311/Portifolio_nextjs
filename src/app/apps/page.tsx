import AppsGrid from '@/components/AppsGrid';
import AppsFilters from '@/components/AppsFilters';
import AppsHeader from '@/components/AppsHeader';
import { getPublishedApps } from '@/lib/app-service';

export const dynamic = 'force-dynamic';

export default async function AppsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items } = await getPublishedApps({
    category: params.category as any,
    q: params.q,
    page: params.page ? Number(params.page) : 1,
    limit: 12
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-16 space-y-10">
        <AppsHeader />
        <AppsFilters />
        <AppsGrid apps={items} />
      </main>
    </div>
  );
}
