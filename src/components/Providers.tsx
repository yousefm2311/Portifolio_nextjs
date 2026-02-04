'use client';

import PageTransition from '@/components/PageTransition';
import CommandPalette from '@/components/CommandPalette';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Locale } from '@/data/translations';
import ThemeProvider from '@/components/ThemeProvider';
import type { Theme } from '@/lib/theme';
import ControlCenter from '@/components/ControlCenter';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function Providers({
  initialLocale,
  initialTheme,
  features,
  children
}: {
  initialLocale: Locale;
  initialTheme: Theme;
  features?: {
    resources?: boolean;
    services?: boolean;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideShell = pathname?.startsWith('/studio');

  return (
    <SessionProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <LocaleProvider initialLocale={initialLocale}>
          {!hideShell && <SiteHeader features={features} />}
          <PageTransition>{children}</PageTransition>
          {!hideShell && <SiteFooter features={features} />}
          <CommandPalette />
          <ControlCenter />
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
