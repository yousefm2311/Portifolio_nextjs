'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminHeader() {
  return (
    <header className="border-b border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/studio/apps" className="text-lg font-semibold">
          Studio
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/70">
          <Link href="/studio/apps" className="hover:text-white">
            Apps
          </Link>
          <Link href="/studio/media" className="hover:text-white">
            Media
          </Link>
          <Link href="/studio/settings" className="hover:text-white">
            Settings
          </Link>
        </nav>
        <button
          className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/70 hover:border-white/30"
          onClick={() => signOut({ callbackUrl: '/studio/login' })}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
