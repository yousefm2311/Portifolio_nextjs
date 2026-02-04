'use client';

import Timeline from '@/components/Timeline';
import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedTimeline } from '@/lib/types';

const fallbackRange = '2020 - 2025';

export default function TimelineSection({ items }: { items?: LocalizedTimeline | null }) {
  const { t, locale } = useLocale();
  const years = items?.[locale]
    ?.map((item) => item.year)
    .filter((year): year is string => Boolean(year)) ?? [];
  const numericYears = years
    .map((year) => Number.parseInt(year, 10))
    .filter((year) => !Number.isNaN(year));
  const range =
    numericYears.length > 0
      ? `${Math.min(...numericYears)} - ${Math.max(...numericYears)}`
      : fallbackRange;
  return (
    <section className="py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">
            {locale === 'ar' ? 'المسار' : 'Journey'}
          </p>
          <h2 className="text-2xl font-semibold text-shine">{t('timelineTitle')}</h2>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          {range}
        </div>
      </div>
      <Timeline items={items ?? null} />
    </section>
  );
}
