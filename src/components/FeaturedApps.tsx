'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';

export default function FeaturedApps({ apps }: { apps: AppDTO[] }) {
  const { locale } = useLocale();

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-surface-900/70 p-8 sm:p-10">
      <div className="pointer-events-none absolute -left-12 top-6 h-40 w-40 rounded-full bg-accent-400/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-accent-500/10 blur-[110px]" />

      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">
            {locale === 'ar' ? 'مختارات' : 'Featured'}
          </p>
          <h2 className="text-2xl font-semibold text-shine">
            {locale === 'ar' ? 'أفضل التجارب' : 'Curated Experiences'}
          </h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          {locale === 'ar' ? '3 مشاريع' : '3 picks'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {apps.slice(0, 3).map((app) => (
          <div
            key={app._id}
            className="glass-soft rounded-2xl p-4 transition hover:-translate-y-1 hover:border-white/30"
          >
            <h3 className="text-lg font-semibold">
              {locale === 'ar' ? app.title : app.titleEn ?? app.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{app.shortDesc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
