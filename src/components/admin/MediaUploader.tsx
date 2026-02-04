'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { MediaDTO } from '@/lib/types';
import Button from '@/components/ui/Button';
import { withMediaProxy } from '@/lib/media-proxy';

export function MediaUploader({
  label,
  value,
  onChange,
  accept
}: {
  label: string;
  value?: MediaDTO | null;
  onChange: (media: MediaDTO) => void;
  accept?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const upload = (file: File) => {
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/studio/media');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      setLoading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        onChange(data.media);
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setError(data?.error ?? 'Upload failed');
        } catch {
          setError('Upload failed');
        }
      }
    };
    xhr.onerror = () => {
      setLoading(false);
      setProgress(0);
      setError('Upload failed');
    };
    setLoading(true);
    xhr.send(formData);
  };

  return (
    <div
      className={`space-y-3 rounded-2xl border border-dashed ${dragging ? 'border-accent-400' : 'border-white/10'} p-4`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) upload(file);
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </div>
      <p className="text-xs text-muted">Drag & drop files هنا، أو اضغط Upload.</p>
      {loading && <div className="text-xs text-muted">Uploading... {progress}%</div>}
      {error && <div className="text-xs text-red-300">{error}</div>}
      {value?.url && (
        <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-white/10">
          {value.type === 'video' ? (
            <video src={withMediaProxy(value.url)} className="h-full w-full object-cover" />
          ) : value.type === 'file' ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white/5 text-xs">
              <span className="rounded-full border border-white/10 px-3 py-1">PDF</span>
              <span className="text-muted">Uploaded</span>
            </div>
          ) : (
            <Image src={value.url} alt={value.alt ?? label} fill className="object-cover" />
          )}
        </div>
      )}
    </div>
  );
}

export function GalleryUploader({
  label,
  values,
  onChange,
  accept
}: {
  label: string;
  values: MediaDTO[];
  onChange: (media: MediaDTO[]) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });

  const uploadFiles = async (files: FileList) => {
    setLoading(true);
    setProgress({ current: 0, total: files.length, percent: 0 });
    const uploaded: MediaDTO[] = [];
    const list = Array.from(files);
    for (let i = 0; i < list.length; i += 1) {
      const file = list[i];
      const media = await new Promise<MediaDTO | null>((resolve) => {
        const formData = new FormData();
        formData.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/studio/media');
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress({
              current: i + 1,
              total: list.length,
              percent: Math.round((event.loaded / event.total) * 100)
            });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.media ?? null);
          } else {
            resolve(null);
          }
        };
        xhr.onerror = () => resolve(null);
        xhr.send(formData);
      });
      if (media) uploaded.push(media);
    }
    onChange([...values, ...uploaded]);
    setLoading(false);
    setProgress({ current: 0, total: 0, percent: 0 });
  };

  return (
    <div
      className={`space-y-3 rounded-2xl border border-dashed ${dragging ? 'border-accent-400' : 'border-white/10'} p-4`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files) uploadFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={accept}
          onChange={(event) => {
            if (event.target.files) uploadFiles(event.target.files);
          }}
        />
      </div>
      {loading && (
        <div className="text-xs text-muted">
          Uploading {progress.current}/{progress.total} - {progress.percent}%
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {values.map((media) => (
          <div
            key={media._id}
            className="relative h-20 w-24 overflow-hidden rounded-xl border border-white/10"
          >
            {media.type === 'video' ? (
              <video src={withMediaProxy(media.url)} className="h-full w-full object-cover" />
            ) : (
              <Image src={media.thumbnailUrl ?? media.url} alt={media.alt ?? label} fill className="object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
