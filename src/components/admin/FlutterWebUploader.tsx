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
  const [progress, setProgress] = useState(0);

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug);

    const data = await new Promise<any>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/studio/flutter-web');
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        try {
          resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: JSON.parse(xhr.responseText) });
        } catch {
          resolve({ ok: false, data: {} });
        }
      };
      xhr.onerror = () => resolve({ ok: false, data: {} });
      xhr.send(formData);
    });

    setLoading(false);

    if (!data.ok) {
      setError(data?.data?.error ?? 'Upload failed');
      return;
    }

    if (data.data?.embedUrl) {
      onUploaded(data.data.embedUrl);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? `Uploading... ${progress}%` : 'Upload Flutter Web ZIP'}
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
