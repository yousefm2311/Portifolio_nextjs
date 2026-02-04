'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { MediaDTO } from '@/lib/types';

export default function AdminMediaGrid({ initialMedia }: { initialMedia: MediaDTO[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const copyToClipboard = async (value: string) => {
    setError(null);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!ok) {
        throw new Error('copy failed');
      }
    } catch {
      setError('Copy failed. Please copy manually.');
    }
  };

  const deleteMedia = async (id: string) => {
    const confirmed = window.confirm('Delete this media? This action cannot be undone.');
    if (!confirmed) return;
    setDeletingId(id);
    setError(null);
    const res = await fetch(`/api/studio/media/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Delete failed.');
      setDeletingId(null);
      return;
    }
    setMedia((prev) => prev.filter((item) => item._id !== id));
    setDeletingId(null);
    router.refresh();
  };

  if (!media || media.length === 0) {
    return <div className="text-sm text-muted">No media uploaded yet.</div>;
  }

  return (
    <div className="space-y-3">
      {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        {media.map((item) => (
          <div key={item._id} className="glass rounded-2xl overflow-hidden">
            <div className="relative h-40" suppressHydrationWarning>
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
                  onClick={() => copyToClipboard(item.url)}
                >
                  Copy URL
                </Button>
                <Button variant="ghost" onClick={() => deleteMedia(item._id)} disabled={deletingId === item._id}>
                  {deletingId === item._id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
