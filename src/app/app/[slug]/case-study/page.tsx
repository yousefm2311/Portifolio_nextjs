import { notFound } from 'next/navigation';
import CaseStudyView from '@/components/CaseStudyView';
import { getAppBySlug } from '@/lib/app-service';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const app = await getAppBySlug(resolvedParams.slug);
  if (!app) return {};
  return {
    title: `${app.title} | Case Study`,
    description: app.shortDesc
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [app, settings] = await Promise.all([
    getAppBySlug(resolvedParams.slug),
    getSettings()
  ]);

  if (!app) return notFound();
  if (!settings?.enableCaseStudy) return notFound();

  return (
    <div className="min-h-screen">
      <CaseStudyView app={app} />
    </div>
  );
}
