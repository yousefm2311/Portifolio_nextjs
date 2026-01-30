'use client';

import { Command } from 'cmdk';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';
import { cn } from '@/lib/utils';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState<AppDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, locale } = useLocale();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open || apps.length > 0) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/apps?limit=50');
        const data = await res.json();
        setApps(data.items ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, apps.length]);

  const placeholder = t('searchPlaceholder');

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden={!open}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl px-4"
        onClick={(event) => event.stopPropagation()}
      >
        <Command
          className="glass rounded-2xl border border-white/10 p-4 shadow-card"
          loop
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted">{t('commandPaletteHint')}</p>
            </div>
            <button
              className="text-xs text-muted hover:text-white"
              onClick={() => setOpen(false)}
            >
              ESC
            </button>
          </div>
          <Command.Input
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted"
          />
          <Command.List className="mt-4 max-h-72 overflow-y-auto no-scrollbar">
            {loading && (
              <Command.Loading className="text-sm text-muted">{t('loading')}</Command.Loading>
            )}
            {!loading && apps.length === 0 && (
              <Command.Empty className="text-sm text-muted">{t('noResults')}</Command.Empty>
            )}
            {apps.map((app) => (
              <Command.Item key={app._id} value={`${app.title} ${app.titleEn ?? ''}`}>
                <Link
                  href={`/app/${app.slug}`}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <span>{locale === 'ar' ? app.title : app.titleEn ?? app.title}</span>
                  <span className="text-xs text-muted">{app.category}</span>
                </Link>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
