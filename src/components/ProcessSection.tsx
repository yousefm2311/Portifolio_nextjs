'use client';

import { useLocale } from '@/components/LocaleProvider';
import Image from 'next/image';
import { Layers, Rocket, ShieldCheck, Sparkles, Code2, Zap, Layout, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LocalizedSectionIntro, LocalizedCardList } from '@/lib/types';

const defaultIntro: LocalizedSectionIntro = {
  ar: {
    eyebrow: 'المنهجية',
    title: 'خطوات واضحة من البداية للنهاية',
    subtitle: 'كل خطوة لها مخرجات واضحة لضمان الجودة والسرعة.'
  },
  en: {
    eyebrow: 'Process',
    title: 'A clear end-to-end workflow',
    subtitle: 'Each step ships tangible outputs for speed and quality.'
  }
};

const defaultSteps: LocalizedCardList = {
  ar: [
    { title: 'الاكتشاف', desc: 'تحديد الهدف، الجمهور، وأولويات الإطلاق.' },
    { title: 'التصميم', desc: 'واجهات نظيفة وتفاعلات دقيقة قبل التطوير.' },
    { title: 'التنفيذ', desc: 'برمجة سريعة مع اختبارات واستقرار.' },
    { title: 'الإطلاق', desc: 'تجهيز النسخة النهائية والمتابعة بعد النشر.' }
  ],
  en: [
    { title: 'Discovery', desc: 'Define goals, audience, and launch priorities.' },
    { title: 'Design', desc: 'Craft clean UI and precise interactions.' },
    { title: 'Build', desc: 'Fast engineering with testing and stability.' },
    { title: 'Launch', desc: 'Ship the final release and iterate.' }
  ]
};

const icons: LucideIcon[] = [Layers, Sparkles, ShieldCheck, Rocket];
const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  sparkles: Sparkles,
  shield: ShieldCheck,
  rocket: Rocket,
  code: Code2,
  zap: Zap,
  layout: Layout,
  workflow: Workflow
};

export default function ProcessSection({
  intro,
  steps
}: {
  intro?: LocalizedSectionIntro | null;
  steps?: LocalizedCardList | null;
}) {
  const { locale } = useLocale();
  const resolvedIntro = intro?.[locale]?.title ? intro[locale] : defaultIntro[locale];
  const resolvedSteps =
    steps && steps[locale]?.some((item) => item.title && item.desc)
      ? steps[locale].filter((item) => item.title && item.desc)
      : defaultSteps[locale];

  return (
    <section className="py-20">
      <div className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/60">{resolvedIntro.eyebrow}</p>
        <h2 className="text-3xl font-semibold">{resolvedIntro.title}</h2>
        <p className="text-muted">{resolvedIntro.subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {resolvedSteps.map((step, index) => {
          const Icon = step.icon ? iconMap[step.icon] ?? icons[index % icons.length] : icons[index % icons.length];
          const mediaUrl = step.media?.url;
          return (
            <div key={`${step.title}-${index}`} className="glass-soft rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
                <span>{locale === 'ar' ? `خطوة ${index + 1}` : `Step ${index + 1}`}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-accent-300 overflow-hidden">
                  {mediaUrl ? (
                    <Image src={mediaUrl} alt={step.title} width={32} height={32} className="object-cover" />
                  ) : Icon ? (
                    <Icon size={16} />
                  ) : null}
                </div>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
