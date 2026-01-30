'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { MediaDTO } from '@/lib/types';

export default function AdminMediaGrid({ initialMedia }: { initialMedia: MediaDTO[] }) {
  const [media, setMedia] = useState(initialMedia);

  const deleteMedia = async (id: string) => {
    await fetch(`/api/studio/media/${id}`, { method: 'DELETE' });
    setMedia((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {media.map((item) => (
        <div key={item._id} className="glass rounded-2xl overflow-hidden">
          <div className="relative h-40">
            {item.type === 'video' ? (
              <video src={item.url} className="h-full w-full object-cover" />
            ) : (
              <Image src={item.thumbnailUrl ?? item.url} alt={item.alt ?? 'media'} fill className="object-cover" />
            )}
          </div>
          <div className="p-4 space-y-2">
            <div className="text-xs text-muted">{item.type}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => navigator.clipboard.writeText(item.url)}
              >
                Copy URL
              </Button>
              <Button variant="ghost" onClick={() => deleteMedia(item._id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
