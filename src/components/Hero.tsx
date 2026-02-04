'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedList } from '@/lib/types';

const defaultBadges: LocalizedList = {
  ar: ['واجهات متحركة', 'أنظمة تصميم', 'تجارب موبايل كاملة', 'تسليم سريع'],
  en: ['Kinetic UI', 'Design Systems', 'Full Mobile Flows', 'Fast Shipping']
};

export default function Hero({
  cvUrl,
  badges
}: {
  cvUrl?: string | null;
  badges?: LocalizedList | null;
}) {
  const { t, locale } = useLocale();
  const resolvedBadges =
    badges && badges[locale]?.some((item) => item.trim().length > 0)
      ? badges[locale]
      : defaultBadges[locale];

  return (
    <section className=" isolate  py-20 md:py-28">
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-accent-500/15 blur-[140px]" />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            {locale === 'ar' ? 'متاح لمشاريع جديدة' : 'Open for new projects'}
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-2">
            {resolvedBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70 backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="#launcher">
              <Button>{t('openGallery')}</Button>
            </Link>
            <Link href="/apps">
              <Button variant="secondary">{t('viewApps')}</Button>
            </Link>
            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noreferrer">
                <Button variant="ghost">{t('downloadCv')}</Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-soft border-0 relative overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1 float-slow">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-accent-400/20 blur-2xl" />
            <p className="text-xs uppercase tracking-widest text-white/60">
              {locale === 'ar' ? 'التخصص' : 'Focus'}
            </p>
            <p className="mt-3 text-lg font-semibold">Flutter + Next.js</p>
            <p className="mt-2 text-sm text-muted">
              {locale === 'ar'
                ? 'تجارب تطبيقات قوية ومقنعة'
                : 'High-impact mobile & web builds.'}
            </p>
          </div>
          <div className="glass-soft border-0 relative overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1 float-slower">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-accent-500/20 blur-2xl" />
            <p className="text-xs uppercase tracking-widest text-white/60">
              {locale === 'ar' ? 'الستايل' : 'Style'}
            </p>
            <p className="mt-3 text-lg font-semibold">
              {locale === 'ar' ? 'واجهات متحركة' : 'Kinetic UI'}
            </p>
            <p className="mt-2 text-sm text-muted">
              {locale === 'ar'
                ? 'واجهات تتنفس مع حركة محسوبة'
                : 'Animated, immersive, and clean.'}
            </p>
          </div>
          <div className="glass-soft border-0 relative overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1 sm:col-span-2 glow-ring">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-accent-300/20 blur-2xl" />
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-white/60">
                {locale === 'ar' ? 'النتيجة' : 'Outcome'}
              </p>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {locale === 'ar' ? 'تجارب كاملة' : 'Full stories'}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">
              {locale === 'ar'
                ? 'من المعاينة التفاعلية إلى دراسة الحالة، كل مشروع له قصة واضحة وواجهة متقنة.'
                : 'From interactive previews to case studies, every project ships with a complete narrative.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
