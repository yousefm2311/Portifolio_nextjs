'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';

export default function SiteFooter({
  features
}: {
  features?: { resources?: boolean; services?: boolean };
}) {
  const { t, locale } = useLocale();
  return (
    <footer className="mt-16 border-t border-white/10 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 text-sm text-white/60 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="text-lg font-semibold text-white">
            Yousef<span className="text-accent-400">.dev</span>
          </div>
          <p>
            {locale === 'ar'
              ? 'منصة متكاملة لتجارب الموبايل والويب.'
              : 'A complete platform for mobile and web experiences.'}
          </p>
          <p>
            (c) {new Date().getFullYear()} Yousef.{' '}
            {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {locale === 'ar' ? 'المنصة' : 'Platform'}
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/apps" className="hover:text-white">
              {t('apps')}
            </Link>
            {features?.services && (
              <Link href="/services" className="hover:text-white">
                {t('services')}
              </Link>
            )}
            {features?.resources && (
              <Link href="/resources" className="hover:text-white">
                {t('resources')}
              </Link>
            )}
            <Link href="/#launcher" className="hover:text-white">
              {locale === 'ar' ? 'المعرض' : 'Launcher'}
            </Link>
            <Link href="/about" className="hover:text-white">
              {t('about')}
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {locale === 'ar' ? 'تواصل' : 'Contact'}
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/contact" className="hover:text-white">
              {t('contact')}
            </Link>
            <a href="mailto:yousef.m2399@gmail.com" className="hover:text-white">
              yousef.m2399@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
