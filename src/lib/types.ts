export type MediaDTO = {
  _id: string;
  type: 'image' | 'video' | 'file';
  provider: 'cloudinary' | 's3' | 'r2' | 'oss';
  providerId?: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  alt?: string;
};

export type AppDTO = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  shortDesc: string;
  description: string;
  category: 'Flutter' | 'Backend' | 'Admin' | 'Tools' | 'DevOps';
  tags: string[];
  roleVariants: { key: string; label: string; previewMediaId?: string }[];
  techStack: string[];
  features: { title: string; details: string }[];
  kpis?: { label: string; value: string }[];
  links: {
    liveDemoUrl?: string;
    githubUrl?: string;
    apkUrl?: string;
    iosUrl?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
  };
  demo: {
    type: 'video' | 'flutter_web' | 'interactive_video';
    embedUrl?: string;
    videoId?: string;
    video?: MediaDTO;
    interactiveHotspots?: {
      timeStart: number;
      timeEnd: number;
      x: number;
      y: number;
      action: string;
      label: string;
    }[];
  };
  media: {
    icon?: MediaDTO;
    cover?: MediaDTO;
    gallery?: MediaDTO[];
  };
  mediaDisplay?: {
    cover?: 'phone' | 'full';
    gallery?: 'phone' | 'full';
  };
  caseStudy: {
    problem: string;
    solution: string;
    architecture: string;
    challenges: string;
    results: string;
  };
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type LocalizedList = {
  ar: string[];
  en: string[];
};

export type ImpactItem = {
  value: string;
  label: string;
};

export type LocalizedImpact = {
  ar: ImpactItem[];
  en: ImpactItem[];
};

export type TimelineItem = {
  year: string;
  title: string;
  desc: string;
};

export type LocalizedTimeline = {
  ar: TimelineItem[];
  en: TimelineItem[];
};

export type SettingsDTO = {
  _id: string;
  cvMedia?: MediaDTO;
  cvUrl?: string | null;
  heroBadges?: LocalizedList | null;
  impactItems?: LocalizedImpact | null;
  techMarquee?: LocalizedList | null;
  timeline?: LocalizedTimeline | null;
};
