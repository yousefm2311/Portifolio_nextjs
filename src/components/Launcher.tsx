'use client';

import { useState } from 'react';
import DeviceFrame from '@/components/DeviceFrame';
import AppIcon from '@/components/AppIcon';
import dynamic from 'next/dynamic';
import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';

const AppModal = dynamic(() => import('@/components/AppModal'), { ssr: false });

export default function Launcher({ apps }: { apps: AppDTO[] }) {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<AppDTO | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-white/60">{t('launcherTitle')}</p>
        <h2 className="text-2xl font-semibold text-shine">{t('launcherSubtitle')}</h2>
        <div className="flex flex-wrap gap-4">
          {apps.slice(0, 4).map((app) => (
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
      </div>

      <DeviceFrame>
        <div className="grid grid-cols-3 gap-4 p-6">
          {apps.map((app) => (
            <AppIcon
              key={app._id}
              title={locale === 'ar' ? app.title : app.titleEn ?? app.title}
              iconUrl={app.media.icon?.url}
              onClick={() => setSelected(app)}
            />
          ))}
        </div>
      </DeviceFrame>

      <AppModal app={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
