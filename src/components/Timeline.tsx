'use client';

import Card from '@/components/ui/Card';
import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedTimeline } from '@/lib/types';

const defaultItems: LocalizedTimeline = {
  ar: [
    { year: '2020', title: 'البداية', desc: 'بناء أول نموذج MVP لخدمات محلية.' },
    { year: '2022', title: 'التحول', desc: 'إطلاق أنظمة إدارة كاملة للشركات.' },
    { year: '2024', title: 'التوسع', desc: 'حلول متعددة الأدوار مع عروض تفاعلية.' },
    { year: '2025', title: 'الآن', desc: 'معرض تطبيقات بتجربة داخل جهاز.' }
  ],
  en: [
    { year: '2020', title: 'Kickoff', desc: 'Built the first MVP for local services.' },
    { year: '2022', title: 'Shift', desc: 'Launched full admin systems for companies.' },
    { year: '2024', title: 'Scale', desc: 'Multi-role solutions with interactive demos.' },
    { year: '2025', title: 'Now', desc: 'Portfolio showcase inside a device frame.' }
  ]
};

export default function Timeline({ items }: { items?: LocalizedTimeline | null }) {
  const { locale } = useLocale();
  const resolvedItems =
    items && items[locale]?.some((item) => item.year && item.title)
      ? items[locale].filter((item) => item.year && item.title)
      : defaultItems[locale];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {resolvedItems.map((item) => (
        <Card key={item.year} className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-accent-400/70" />
          <div className="flex items-start justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
            <span className="text-2xl font-bold text-accent-400">{item.year}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
