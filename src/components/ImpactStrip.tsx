'use client';

import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedImpact } from '@/lib/types';

const defaultItems: LocalizedImpact = {
  ar: [
    { value: '12+', label: 'منتج تم إطلاقه' },
    { value: '6', label: 'سنوات خبرة في الإنتاج' },
    { value: '40+', label: 'تجربة تفاعلية' },
    { value: '99.9%', label: 'استقرار في الإطلاق' }
  ],
  en: [
    { value: '12+', label: 'Products shipped' },
    { value: '6', label: 'Years in production' },
    { value: '40+', label: 'Interactive flows' },
    { value: '99.9%', label: 'Release stability' }
  ]
};

export default function ImpactStrip({ items }: { items?: LocalizedImpact | null }) {
  const { locale } = useLocale();
  const resolvedItems =
    items && items[locale]?.some((item) => item.value && item.label)
      ? items[locale].filter((item) => item.value && item.label)
      : defaultItems[locale];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {resolvedItems.map((item) => (
        <div
          key={`${item.value}-${item.label}`}
          className="glass-soft rounded-2xl px-4 py-5 text-center transition hover:-translate-y-1 hover:border-white/30"
        >
          <div className="text-2xl font-semibold text-gradient">{item.value}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{item.label}</div>
        </div>
      ))}
    </section>
  );
}
