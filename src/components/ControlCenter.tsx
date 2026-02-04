'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe2, Palette, SlidersHorizontal } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

export default function ControlCenter() {
  const { locale, setLocale } = useLocale();
  const { theme, setTheme, availableThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <button
        className={cn(
          'group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-900/70 text-white shadow-card backdrop-blur transition hover:border-white/30'
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Control Center"
      >
        <SlidersHorizontal className="h-5 w-5 transition group-hover:rotate-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="glass absolute bottom-16 right-0 w-[280px] rounded-2xl border border-white/10 p-4 shadow-card"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {locale === 'ar' ? 'مركز التحكم' : 'Control Center'}
                </p>
                <p className="text-xs text-muted">
                  {locale === 'ar' ? 'الثيم واللغة' : 'Theme & language'}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <SlidersHorizontal size={14} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
                <Palette size={14} />
                <span>{locale === 'ar' ? 'الثيمات' : 'Themes'}</span>
              </div>
              <div className="grid gap-2">
                {availableThemes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition',
                      theme === item.id
                        ? 'border-accent-400 bg-white/10 text-white'
                        : 'border-white/10 text-white/70 hover:border-white/30'
                    )}
                  >
                    <span
                      className="h-8 w-8 rounded-lg"
                      style={{ background: item.swatch }}
                    />
                    <span>{locale === 'ar' ? item.label.ar : item.label.en}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
                <Globe2 size={14} />
                <span>{locale === 'ar' ? 'اللغة' : 'Language'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLocale('ar')}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm transition',
                    locale === 'ar'
                      ? 'border-accent-400 bg-white/10 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  )}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm transition',
                    locale === 'en'
                      ? 'border-accent-400 bg-white/10 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  )}
                >
                  English
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
