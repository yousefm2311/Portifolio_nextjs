'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AppDTO } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';

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
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-white/10">
        <iframe
          src={app.demo.embedUrl}
          className="h-full w-full"
          allow="fullscreen"
        />
      </div>
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
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image src={coverUrl} alt="Cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
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
  );
}
