'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import Button from '@/components/ui/Button';

export default function SiteHeader() {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Yousef<span className="text-accent-400">.dev</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/70">
          <Link href="/apps" className="hover:text-white">
            {t('apps')}
          </Link>
          <Link href="/about" className="hover:text-white">
            {t('about')}
          </Link>
          <Link href="/contact" className="hover:text-white">
            {t('contact')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          >
            {locale === 'ar' ? 'EN' : 'عربي'}
          </Button>
        </div>
      </div>
    </header>
  );
}
