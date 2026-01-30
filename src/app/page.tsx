import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Launcher from '@/components/Launcher';
import Hero from '@/components/Hero';
import FeaturedApps from '@/components/FeaturedApps';
import TimelineSection from '@/components/TimelineSection';
import { getPublishedApps } from '@/lib/app-service';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { items } = await getPublishedApps({ limit: 9 });
  const settings = await getSettings();
  const cvUrl = settings?.cvMedia?.url ?? settings?.cvUrl ?? null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4">
        <Hero cvUrl={cvUrl} />
        <FeaturedApps apps={items} />

        <section id="launcher" className="py-20">
          <Launcher apps={items} />
        </section>

        <TimelineSection />
      </main>

      <SiteFooter />
    </div>
  );
}
