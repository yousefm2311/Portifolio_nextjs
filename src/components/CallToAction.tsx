'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedCta } from '@/lib/types';

const defaultCta: LocalizedCta = {
  ar: {
    eyebrow: 'جاهز للانطلاق؟',
    title: 'حوّل فكرتك إلى تجربة حقيقية',
    subtitle: 'ابدأ بمحادثة قصيرة وسنحدد أفضل طريق للإطلاق.',
    primaryLabel: 'تواصل معي',
    secondaryLabel: 'شاهد التطبيقات'
  },
  en: {
    eyebrow: 'Ready to build?',
    title: 'Turn your idea into a real product',
    subtitle: 'Start with a quick chat and we map the best launch path.',
    primaryLabel: 'Contact me',
    secondaryLabel: 'View apps'
  }
};

export default function CallToAction({ cta }: { cta?: LocalizedCta | null }) {
  const { locale } = useLocale();
  const resolved = cta?.[locale]?.title ? cta[locale] : defaultCta[locale];
  return (
    <section className="py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface-900/60 p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-accent-400/20 blur-[90px]" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-accent-500/20 blur-[100px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-white/60">{resolved.eyebrow}</p>
            <h2 className="text-3xl font-semibold">{resolved.title}</h2>
            <p className="text-muted">{resolved.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact">
              <Button>{resolved.primaryLabel}</Button>
            </Link>
            <Link href="/apps">
              <Button variant="secondary">{resolved.secondaryLabel}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
