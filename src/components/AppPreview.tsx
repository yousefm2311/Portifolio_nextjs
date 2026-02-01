'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AppDTO } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import Iphone17ProMaxFrame from '@/components/Iphone17ProMaxFrame';
import { toBase64Url, withMediaProxy } from '@/lib/media-proxy';

export default function AppPreview({ app }: { app: AppDTO }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (app.demo.type === 'video' || app.demo.type === 'interactive_video') {
      const interval = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [app.demo.type]);

  const hotspots = useMemo(() => {
    if (app.demo.type !== 'interactive_video') return [];
    return app.demo.interactiveHotspots?.filter(
      (spot) => currentTime >= spot.timeStart && currentTime <= spot.timeEnd
    ) ?? [];
  }, [app.demo, currentTime]);

  if (app.demo.type === 'flutter_web' && app.demo.embedUrl) {
    const base = app.demo.embedUrl.replace(/\/index\.html$/i, '');
    const encoded = toBase64Url(base);
    const src = `/flutter-proxy/${encoded}/index.html`;
    return (
      <Iphone17ProMaxFrame className="max-w-[360px]">
        <div className="aspect-[9/19] w-full">
          <iframe src={src} className="h-full w-full" allow="fullscreen" />
        </div>
      </Iphone17ProMaxFrame>
    );
  }

  const rawVideoUrl = app.demo.video?.url;
  const videoUrl = withMediaProxy(rawVideoUrl);
  const coverUrl = app.media.cover?.url;

  useEffect(() => {
    setVideoError(null);
  }, [videoUrl]);

  if (!videoUrl && !coverUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted">
        <PlayCircle className="mr-2" size={20} /> {t('noVideo')}
      </div>
    );
  }

  const prefersPhone = app.mediaDisplay?.cover !== 'full';

  if (!videoUrl) {
    if (!coverUrl) {
      return (
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted">
          <PlayCircle className="mr-2" size={20} /> {t('noVideo')}
        </div>
      );
    }
    const cover = (
      <div className="relative aspect-[9/19] w-full overflow-hidden">
        <Image src={coverUrl} alt="Cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
      </div>
    );
    return prefersPhone ? (
      <Iphone17ProMaxFrame className="max-w-[360px]">{cover}</Iphone17ProMaxFrame>
    ) : (
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/40">
        <div className="aspect-video">{cover}</div>
      </div>
    );
  }

  const renderVideo = (className?: string) => (
    <div className={cn('relative w-full h-full', className)}>
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        className="h-full w-full object-cover"
        controls
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        poster={coverUrl ?? undefined}
        onError={() => {
          const code = videoRef.current?.error?.code;
          const message =
            code === 1
              ? 'Video loading aborted'
              : code === 2
                ? 'Network error while loading video'
                : code === 3
                  ? 'Video format/codec not supported'
                  : code === 4
                    ? 'Video source not supported'
                    : 'Video failed to load';
          setVideoError(message);
        }}
      />
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center text-xs text-white">
          <div className="space-y-2">
            <p className="font-semibold">تعذر تشغيل الفيديو</p>
            <p>{videoError}</p>
            <p className="text-white/70">جرّب تحويله إلى H.264 + AAC</p>
          </div>
        </div>
      )}
      {hotspots.map((spot, index) => (
        <button
          key={`${spot.label}-${index}`}
          className={cn(
            'absolute rounded-full border border-accent-400 bg-accent-400/30 px-3 py-1 text-xs text-white shadow-glow'
          )}
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {spot.label}
        </button>
      ))}
    </div>
  );

  const videoContent = (
    <div className="relative aspect-[9/19] w-full overflow-hidden">
      {renderVideo()}
    </div>
  );

  if (prefersPhone) {
    return <Iphone17ProMaxFrame className="max-w-[360px]">{videoContent}</Iphone17ProMaxFrame>;
  }

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/50">
      <div className="aspect-video">
        {renderVideo()}
      </div>
      {hotspots.map((spot, index) => (
        <button
          key={`${spot.label}-${index}`}
          className={cn(
            'absolute rounded-full border border-accent-400 bg-accent-400/30 px-3 py-1 text-xs text-white shadow-glow'
          )}
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {spot.label}
        </button>
      ))}
    </div>
  );
}
