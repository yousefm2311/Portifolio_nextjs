import './globals.css';
import { cookies } from 'next/headers';
import { Cairo, Space_Grotesk } from 'next/font/google';
import Providers from '@/components/Providers';
import { Locale } from '@/data/translations';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-ar',
  display: 'swap'
});

export const metadata = {
  title: 'Portfolio Showcase | Yousef',
  description: 'معرض تطبيقات احترافي بتجربة تفاعلية داخل إطار جهاز.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'ar') as Locale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${spaceGrotesk.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
