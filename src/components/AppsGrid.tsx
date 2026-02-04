'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AppDTO } from '@/lib/types';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';

const AppModal = dynamic(() => import('@/components/AppModal'), { ssr: false });

export default function AppsGrid({ apps }: { apps: AppDTO[] }) {
  const [selected, setSelected] = useState<AppDTO | null>(null);
  const { t, locale } = useLocale();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <div
            key={app._id}
            className="group glass-soft overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-1 hover:border-white/30"
          >
            <div className="relative h-44">
              {app.media.cover?.url ? (
                <Image
                  src={app.media.cover.url}
                  alt={app.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-true-white-80">
                {app.category}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {locale === 'ar' ? app.title : app.titleEn ?? app.title}
                </h3>
              </div>
              <p className="text-sm text-muted line-clamp-2">{app.shortDesc}</p>
              <Button variant="secondary" onClick={() => setSelected(app)}>
                {t('viewDetails')}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <AppModal app={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
