'use client';

import Timeline from '@/components/Timeline';
import { useLocale } from '@/components/LocaleProvider';

export default function TimelineSection() {
  const { t } = useLocale();
  return (
    <section className="py-20">
      <h2 className="mb-6 text-2xl font-semibold">{t('timelineTitle')}</h2>
      <Timeline />
    </section>
  );
}
