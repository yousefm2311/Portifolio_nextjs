'use client';

import PageTransition from '@/components/PageTransition';
import CommandPalette from '@/components/CommandPalette';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Locale } from '@/data/translations';

export default function Providers({
  initialLocale,
  children
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <PageTransition>{children}</PageTransition>
      <CommandPalette />
    </LocaleProvider>
  );
}
