import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AppDetailView from '@/components/AppDetailView';
import { getAppBySlug } from '@/lib/app-service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
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

export default async function AppDetailPage({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AppDetailView app={app} />
      <SiteFooter />
    </div>
  );
}
