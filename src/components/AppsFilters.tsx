'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Chip from '@/components/ui/Chip';
import { useLocale } from '@/components/LocaleProvider';
import { Input } from '@/components/ui/Inputs';
import Button from '@/components/ui/Button';

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

  const labelFor = (cat: (typeof categories)[number]) => {
    if (cat === 'All') return t('all');
    if (cat === 'Flutter') return t('flutter');
    if (cat === 'Backend') return t('backend');
    if (cat === 'Admin') return t('adminCategory');
    if (cat === 'Tools') return t('tools');
    if (cat === 'DevOps') return t('devops');
    return cat;
  };

  return (
    <div className="glass-soft rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={labelFor(cat)}
            active={activeCategory === cat}
            onClick={() => updateParam('category', cat)}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full max-w-sm"
        />
        <Button variant="secondary" onClick={() => updateParam('q', query)}>
          {t('searchAction')}
        </Button>
      </div>
    </div>
  );
}
