'use client';

import Card from '@/components/ui/Card';
import { useLocale } from '@/components/LocaleProvider';
import Button from '@/components/ui/Button';

export default function AboutContent({ cvUrl }: { cvUrl?: string | null }) {
  const { locale } = useLocale();
  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold">{locale === 'ar' ? 'نبذة عني' : 'About Me'}</h1>
        <p className="text-muted">Senior Full-Stack Engineer + UI/UX Designer</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">{locale === 'ar' ? 'الرؤية' : 'Vision'}</h2>
          <p className="mt-3 text-sm text-muted">
            {locale === 'ar'
              ? 'بناء منتجات رقمية جميلة وسريعة الأداء، مع تجارب تفاعلية ترفع من قيمة المشروع.'
              : 'Building beautiful, high-performance digital products with immersive experiences.'}
          </p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">{locale === 'ar' ? 'الخبرات' : 'Expertise'}</h2>
          <p className="mt-3 text-sm text-muted">
            {locale === 'ar'
              ? 'Flutter, Next.js, Node.js, MongoDB, خرائط، مراسلات لحظية، ولوحات إدارة متقدمة.'
              : 'Flutter, Next.js, Node.js, MongoDB, maps, real-time chat, and advanced admin panels.'}
          </p>
        </Card>
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
