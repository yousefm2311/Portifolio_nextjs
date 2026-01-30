'use client';

import Card from '@/components/ui/Card';
import { useLocale } from '@/components/LocaleProvider';

const items = {
  ar: [
    { year: '2020', title: 'البداية', desc: 'بناء أول MVP لتطبيق خدمات محلية.' },
    { year: '2022', title: 'التحول', desc: 'إطلاق أنظمة إدارة كاملة للشركات.' },
    { year: '2024', title: 'التوسع', desc: 'حلول متعددة الأدوار وتجارب تفاعلية.' },
    { year: '2025', title: 'الآن', desc: 'معرض تطبيقات بتجربة داخل جهاز.' }
  ],
  en: [
    { year: '2020', title: 'Kickoff', desc: 'Built the first MVP for local services.' },
    { year: '2022', title: 'Shift', desc: 'Launched full admin systems for companies.' },
    { year: '2024', title: 'Scale', desc: 'Multi-role solutions with interactive demos.' },
    { year: '2025', title: 'Now', desc: 'Portfolio showcase inside a device frame.' }
  ]
};

export default function Timeline() {
  const { locale } = useLocale();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items[locale].map((item) => (
        <Card key={item.year}>
          <div className="flex items-start justify-between">
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
