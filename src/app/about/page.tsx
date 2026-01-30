import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AboutContent from '@/components/AboutContent';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getSettings();
  const cvUrl = settings?.cvMedia?.url ?? settings?.cvUrl ?? null;
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 space-y-10">
        <AboutContent cvUrl={cvUrl} />
      </main>
      <SiteFooter />
    </div>
  );
}
