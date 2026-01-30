'use client';

import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';

export default function FlutterWebUploader({
  slug,
  onUploaded
}: {
  slug: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug);

    const res = await fetch('/api/studio/flutter-web', {
      method: 'POST',
      body: formData
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data?.error ?? 'Upload failed');
      return;
    }

    if (data.embedUrl) {
      onUploaded(data.embedUrl);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Flutter Web ZIP'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
        <span className="text-xs text-muted">ارفع ملف ZIP من build/web</span>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
