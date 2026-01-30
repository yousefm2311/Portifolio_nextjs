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
          <div key={app._id} className="glass rounded-2xl overflow-hidden">
            <div className="relative h-44">
              {app.media.cover?.url ? (
                <Image
                  src={app.media.cover.url}
                  alt={app.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {locale === 'ar' ? app.title : app.titleEn ?? app.title}
                </h3>
                <span className="text-xs text-muted">{app.category}</span>
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
