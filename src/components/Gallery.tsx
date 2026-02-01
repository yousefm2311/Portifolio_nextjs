'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaDTO } from '@/lib/types';

import Iphone17ProMaxFrame from '@/components/Iphone17ProMaxFrame';

export default function Gallery({ items, mode = 'phone' }: { items: MediaDTO[]; mode?: 'phone' | 'full' }) {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) {
    return <div className="text-sm text-muted">لا توجد صور</div>;
  }

  const current = items[index];

  return (
    <div className="space-y-4">
      {mode === 'phone' ? (
        <Iphone17ProMaxFrame className="max-w-[360px]">
          <div className="relative aspect-[9/19] w-full overflow-hidden">
            <Image
              src={current.url}
              alt={current.alt ?? 'Screenshot'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2"
            onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2"
            onClick={() => setIndex((prev) => (prev + 1) % items.length)}
          >
            <ChevronRight size={18} />
          </button>
        </Iphone17ProMaxFrame>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={current.url}
            alt={current.alt ?? 'Screenshot'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2"
            onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2"
            onClick={() => setIndex((prev) => (prev + 1) % items.length)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {items.map((item, i) => (
          <button
            key={item._id}
            className={`h-16 w-24 overflow-hidden rounded-xl border ${
              i === index ? 'border-accent-400' : 'border-white/10'
            }`}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.thumbnailUrl ?? item.url}
              alt={item.alt ?? 'Thumbnail'}
              width={96}
              height={64}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
