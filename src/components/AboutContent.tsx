'use client';

import Card from '@/components/ui/Card';
import { useLocale } from '@/components/LocaleProvider';
import Button from '@/components/ui/Button';

export default function AboutContent({ cvUrl }: { cvUrl?: string | null }) {
  const { locale, t } = useLocale();
  const intro =
    locale === 'ar'
      ? 'أصمم وأنفّذ منتجات رقمية بتركيز على الأداء والتجربة، من أول نموذج حتى الإطلاق.'
      : 'I design and ship digital products focused on performance, from MVP to launch.';
  const highlightTags =
    locale === 'ar'
      ? ['تجربة مستخدم قوية', 'لوحات تحكم', 'منتجات موبايل', 'تسليم سريع']
      : ['Product UX', 'Admin Systems', 'Mobile Apps', 'Fast Delivery'];

  return (
    <>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'نبذة' : 'Profile'}
        </p>
        <h1 className="text-3xl font-semibold">{t('aboutTitle')}</h1>
        <p className="text-muted">{t('aboutSubtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-soft rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            {locale === 'ar' ? 'من الفكرة إلى منتج جاهز' : 'From idea to shipped product'}
          </h2>
          <p className="text-sm text-muted">{intro}</p>
          <div className="flex flex-wrap gap-2">
            {highlightTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="glass-soft">
            <h2 className="text-xl font-semibold">
              {locale === 'ar' ? 'الرؤية' : 'Vision'}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {locale === 'ar'
                ? 'بناء منتجات رقمية جميلة وسريعة الأداء مع تجارب تفاعلية ترفع من قيمة المشروع.'
                : 'Building beautiful, high-performance digital products with immersive experiences.'}
            </p>
          </Card>
          <Card className="glass-soft">
            <h2 className="text-xl font-semibold">
              {locale === 'ar' ? 'الخبرات' : 'Expertise'}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {locale === 'ar'
                ? 'Flutter، Next.js، Node.js، MongoDB، خرائط، مراسلات لحظية، ولوحات إدارة متقدمة.'
                : 'Flutter, Next.js, Node.js, MongoDB, maps, real-time chat, and advanced admin panels.'}
            </p>
          </Card>
        </div>
      </div>

      {cvUrl && (
        <div>
          <a href={cvUrl} target="_blank" rel="noreferrer">
            <Button>{locale === 'ar' ? 'تحميل السيرة الذاتية (PDF)' : 'Download CV (PDF)'}</Button>
          </a>
        </div>
      )}
    </>
  );
}
