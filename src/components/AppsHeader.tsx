'use client';

import { useLocale } from '@/components/LocaleProvider';

export default function AppsHeader() {
  const { locale } = useLocale();
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-white/60">
        {locale === 'ar' ? 'المعرض' : 'Gallery'}
      </p>
      <h1 className="text-3xl font-semibold text-shine">
        {locale === 'ar' ? 'قائمة التطبيقات' : 'Apps Gallery'}
      </h1>
      <p className="text-muted">
        {locale === 'ar'
          ? 'فلتر حسب التخصص أو ابحث بالاسم.'
          : 'Filter by category or search by name.'}
      </p>
    </div>
  );
}
