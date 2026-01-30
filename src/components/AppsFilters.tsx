'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Chip from '@/components/ui/Chip';
import { useLocale } from '@/components/LocaleProvider';

const categories = ['All', 'Flutter', 'Backend', 'Admin', 'Tools', 'DevOps'] as const;

export default function AppsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const activeCategory = searchParams.get('category') ?? 'All';

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'All') params.delete(key);
    else params.set(key, value);
    router.push(`/apps?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat === 'All' ? t('all') : cat}
            active={activeCategory === cat}
            onClick={() => updateParam('category', cat)}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:border-white/30"
          onClick={() => updateParam('q', query)}
        >
          {t('searchAction')}
        </button>
      </div>
    </div>
  );
}
