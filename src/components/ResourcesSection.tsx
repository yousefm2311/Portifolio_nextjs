'use client';

import Link from 'next/link';
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

export default function ResourcesSection({ resources }: { resources?: LocalizedResources | null }) {
  const { locale } = useLocale();
  const list = resources?.[locale]?.filter((item) => item.title && item.url) ?? [];
  const items = list.slice(0, 4);

  return (
    <section className="py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {locale === 'ar' ? 'الموارد' : 'Resources'}
          </p>
          <h2 className="text-2xl font-semibold">
            {locale === 'ar' ? 'روابط ودروس مختارة' : 'Curated links & learning'}
          </h2>
          <p className="text-muted">
            {locale === 'ar'
              ? 'كل ما تحتاجه لبناء وإطلاق منتجك بسرعة.'
              : 'Everything you need to build and ship faster.'}
          </p>
        </div>
        <Link href="/resources" className="text-sm text-white/70 hover:text-white">
          {locale === 'ar' ? 'عرض الكل' : 'View all'}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-soft rounded-2xl p-6 text-sm text-muted">
          {locale === 'ar' ? 'لا توجد موارد حالياً.' : 'No resources yet.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => {
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
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
