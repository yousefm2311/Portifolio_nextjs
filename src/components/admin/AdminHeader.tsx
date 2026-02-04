'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const links = [
  { href: '/studio/apps', label: 'Apps' },
  { href: '/studio/media', label: 'Media' },
  { href: '/studio/settings', label: 'Settings' }
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const onSignOut = async () => {
    await signOut({ redirect: false });
    router.replace('/studio/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/studio/apps" className="text-lg font-semibold">
          Studio<span className="text-accent-400">.admin</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-white/70 transition hover:text-white',
                  active && 'text-true-white'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-pill"
                    className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {data?.user?.email && (
            <span className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 sm:inline-flex">
              {data.user.email}
            </span>
          )}
          <button
            className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
