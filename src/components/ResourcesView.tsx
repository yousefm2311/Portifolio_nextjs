'use client';

import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedResources } from '@/lib/types';
import { BookOpen, ExternalLink, FileText, PlayCircle, Wrench } from 'lucide-react';

const typeConfig = {
  guide: { icon: BookOpen, label: { ar: 'دليل', en: 'Guide' } },
  link: { icon: ExternalLink, label: { ar: 'رابط', en: 'Link' } },
  tool: { icon: Wrench, label: { ar: 'أداة', en: 'Tool' } },
  file: { icon: FileText, label: { ar: 'ملف', en: 'File' } },
  video: { icon: PlayCircle, label: { ar: 'فيديو', en: 'Video' } }
};

export default function ResourcesView({ resources }: { resources?: LocalizedResources | null }) {
  const { locale } = useLocale();
  const list = resources?.[locale]?.filter((item) => item.title && item.url) ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'الموارد' : 'Resources'}
        </p>
        <h1 className="text-3xl font-semibold">
          {locale === 'ar' ? 'مكتبة ملفات وروابط مفيدة' : 'Curated resources and learning'}
        </h1>
        <p className="text-muted">
          {locale === 'ar'
            ? 'روابط وأدلة عملية تساعدك على إطلاق المنتج بشكل أسرع.'
            : 'Links and guides that help you ship faster.'}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="glass-soft rounded-2xl p-6 text-sm text-muted">
          {locale === 'ar' ? 'لا توجد موارد حالياً.' : 'No resources yet.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((item, index) => {
            const config = typeConfig[item.type] ?? typeConfig.link;
            const Icon = config.icon;
            const badge = item.badge?.trim() || config.label[locale];
            return (
              <a
                key={`${item.title}-${index}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="glass-soft rounded-2xl p-5 transition hover:-translate-y-1 hover:border-white/30"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {badge}
                  </span>
                  <Icon size={18} className="text-accent-300" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
