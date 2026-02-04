'use client';

import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedList } from '@/lib/types';

const defaultItems: LocalizedList = {
  ar: [
    'Flutter',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Firebase',
    'Socket.io',
    'Maps',
    'CI/CD',
    'Design Systems'
  ],
  en: [
    'Flutter',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Firebase',
    'Socket.io',
    'Maps',
    'CI/CD',
    'Design Systems'
  ]
};

export default function TechMarquee({ items }: { items?: LocalizedList | null }) {
  const { locale } = useLocale();
  const resolvedItems =
    items && items[locale]?.some((item) => item.trim().length > 0)
      ? items[locale].filter((item) => item.trim().length > 0)
      : defaultItems[locale];
  const track = [...resolvedItems, ...resolvedItems];

  return (
    <section className="marquee rounded-3xl border border-white/5 bg-surface-900/50 py-4">
      <div className="marquee-track px-6">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/70"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
