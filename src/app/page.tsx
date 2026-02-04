import Launcher from '@/components/Launcher';
import Hero from '@/components/Hero';
import FeaturedApps from '@/components/FeaturedApps';
import TimelineSection from '@/components/TimelineSection';
import ImpactStrip from '@/components/ImpactStrip';
import TechMarquee from '@/components/TechMarquee';
import { getPublishedApps } from '@/lib/app-service';
import { getSettings } from '@/lib/settings-service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { items } = await getPublishedApps({ limit: 9 });
  const settings = await getSettings();
  const cvUrl = settings?.cvMedia?.url ?? settings?.cvUrl ?? null;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4">
        <Hero cvUrl={cvUrl} badges={settings?.heroBadges ?? null} />
        <section className="space-y-6 pb-10">
          <ImpactStrip items={settings?.impactItems ?? null} />
          <TechMarquee items={settings?.techMarquee ?? null} />
        </section>
        <FeaturedApps apps={items} />

        <section id="launcher" className="py-20">
          <Launcher apps={items} />
        </section>

        <TimelineSection items={settings?.timeline ?? null} />
      </main>
    </div>
  );
}
