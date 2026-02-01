'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AppDTO } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import Iphone17ProMaxFrame from '@/components/Iphone17ProMaxFrame';

function toBase64Url(input: string) {
  const encoded = btoa(input);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default function AppPreview({ app }: { app: AppDTO }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
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

  const videoUrl = app.demo.video?.url;
  const coverUrl = app.media.cover?.url;

  if (!videoUrl && !coverUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-muted">
        <PlayCircle className="mr-2" size={20} /> {t('noVideo')}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <Iphone17ProMaxFrame className="max-w-[360px]">
        <div className="relative aspect-[9/19] w-full overflow-hidden">
          <Image src={coverUrl} alt="Cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
        </div>
      </Iphone17ProMaxFrame>
    );
  }

  return (
    <Iphone17ProMaxFrame className="max-w-[360px]">
      <div className="relative aspect-[9/19] w-full overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          controls
          preload="metadata"
        />
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
    </Iphone17ProMaxFrame>
  );
}
