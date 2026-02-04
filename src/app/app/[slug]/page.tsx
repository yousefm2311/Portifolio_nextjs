import { notFound } from 'next/navigation';
import AppDetailView from '@/components/AppDetailView';
import { getAppBySlug } from '@/lib/app-service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const app = await getAppBySlug(resolvedParams.slug);
  if (!app) return {};

  return {
    title: `${app.title} | Yousef Portfolio`,
    description: app.shortDesc,
    openGraph: {
      title: app.title,
      description: app.shortDesc,
      images: app.media.cover?.url ? [app.media.cover.url] : []
    }
  };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const app = await getAppBySlug(resolvedParams.slug);
  if (!app) return notFound();

  return (
    <div className="min-h-screen">
      <AppDetailView app={app} />
    </div>
  );
}
