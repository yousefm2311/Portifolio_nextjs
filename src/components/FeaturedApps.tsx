'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';

export default function FeaturedApps({ apps }: { apps: AppDTO[] }) {
  const { locale } = useLocale();
  return (
    <section className="grid-dots rounded-3xl border border-white/10 p-10">
      <div className="grid gap-4 md:grid-cols-3">
        {apps.slice(0, 3).map((app) => (
          <div key={app._id} className="glass rounded-2xl p-4">
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
