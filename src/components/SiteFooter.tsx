'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';

export default function SiteFooter() {
  const { t, locale } = useLocale();
  return (
    <footer className="mt-16 border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-white/60">
        <p>
          (c) {new Date().getFullYear()} Yousef.{' '}
          {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/apps" className="hover:text-white">
            {t('apps')}
          </Link>
          <Link href="/about" className="hover:text-white">
            {t('about')}
          </Link>
          <Link href="/contact" className="hover:text-white">
            {t('contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
