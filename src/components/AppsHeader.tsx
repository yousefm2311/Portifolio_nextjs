'use client';

import { useLocale } from '@/components/LocaleProvider';

export default function AppsHeader() {
  const { locale } = useLocale();
  return (
    <div>
      <h1 className="text-3xl font-semibold">{locale === 'ar' ? 'قائمة التطبيقات' : 'Apps Gallery'}</h1>
      <p className="text-muted">
        {locale === 'ar' ? 'فلتر حسب التخصص أو ابحث بالاسم.' : 'Filter by category or search by name.'}
      </p>
    </div>
  );
}
