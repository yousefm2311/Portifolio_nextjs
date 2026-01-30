'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';

export default function Hero({ cvUrl }: { cvUrl?: string | null }) {
  const { t } = useLocale();

  return (
    <section className="grid min-h-[70vh] items-center gap-8 py-20">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{t('heroTitle')}</h1>
        <p className="max-w-2xl text-lg text-muted">{t('heroSubtitle')}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="#launcher">
            <Button>{t('openGallery')}</Button>
          </Link>
          <Link href="/apps">
            <Button variant="secondary">{t('viewApps')}</Button>
          </Link>
          {cvUrl && (
            <a href={cvUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">{t('downloadCv')}</Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
