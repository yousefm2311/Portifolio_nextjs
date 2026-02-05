'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/LocaleProvider';
import { cn } from '@/lib/utils';

export default function SiteHeader({
  features
}: {
  features?: { resources?: boolean; services?: boolean };
}) {
  const { t } = useLocale();
  const pathname = usePathname();

  const links = [
    { href: '/apps', label: t('apps') },
    ...(features?.services ? [{ href: '/services', label: t('services') }] : []),
    ...(features?.resources ? [{ href: '/resources', label: t('resources') }] : []),
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') }
  ];

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
        <div className="glass flex flex-col gap-3 rounded-3xl px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Yousef<span className="text-accent-400">.dev</span>
          </Link>
          <nav className="flex w-full items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar sm:w-auto sm:gap-2 sm:pb-0 sm:text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative whitespace-nowrap rounded-full px-3 py-1.5 transition sm:px-4',
                    active ? 'text-true-white' : 'text-white/70 hover:text-white'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/20 bg-white/10 shadow-card"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 sm:flex">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </header>
  );
}
