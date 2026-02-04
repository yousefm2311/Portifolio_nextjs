'use client';

import { useLocale } from '@/components/LocaleProvider';
import Image from 'next/image';
import { Layers, Rocket, ShieldCheck, Sparkles, Code2, Zap, Layout, Workflow } from 'lucide-react';
import type { LocalizedSectionIntro, LocalizedNotes, LocalizedCardList } from '@/lib/types';

const defaultIntro: LocalizedSectionIntro = {
  ar: {
    eyebrow: 'المزايا',
    title: 'منصة متكاملة لبناء منتجات رقمية',
    subtitle: 'أغطي دورة المنتج بالكامل من الفكرة إلى الإطلاق، مع تجربة قوية وواجهة مُتقنة.'
  },
  en: {
    eyebrow: 'Capabilities',
    title: 'A complete platform for digital products',
    subtitle: 'I cover the full product cycle from concept to launch with premium UX and execution.'
  }
};

const defaultNotes: LocalizedNotes = {
  ar: {
    noteA: 'تخطيط واضح + تصميم عالي + تنفيذ فعلي = نتائج ملموسة.',
    noteB: 'تركيز على الأداء، التفاصيل، وقابلية التوسع.'
  },
  en: {
    noteA: 'Clear planning + high-end design + real engineering = tangible results.',
    noteB: 'Focused on performance, details, and scalability.'
  }
};

const defaultItems: LocalizedCardList = {
  ar: [
    { title: 'استراتيجية المنتج', desc: 'تحويل الفكرة إلى خطة إطلاق واضحة وقابلة للتنفيذ.' },
    { title: 'تجربة UI متحركة', desc: 'واجهات تفاعلية مصقولة بحركة محسوبة.' },
    { title: 'هندسة قابلة للتوسع', desc: 'بنية نظيفة تتحمل النمو وتبني الثقة.' },
    { title: 'إطلاق سريع', desc: 'تنفيذ منظم مع تسليمات واضحة وسريعة.' }
  ],
  en: [
    { title: 'Product Strategy', desc: 'Turn ideas into a launch-ready execution plan.' },
    { title: 'Kinetic UI', desc: 'Polished interactive interfaces with intentional motion.' },
    { title: 'Scalable Engineering', desc: 'Clean architecture built for growth and trust.' },
    { title: 'Fast Launch', desc: 'Structured delivery with clear, fast milestones.' }
  ]
};

const icons = [Layers, Sparkles, ShieldCheck, Rocket];
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  layers: Layers,
  sparkles: Sparkles,
  shield: ShieldCheck,
  rocket: Rocket,
  code: Code2,
  zap: Zap,
  layout: Layout,
  workflow: Workflow
};

export default function CapabilitiesSection({
  intro,
  notes,
  items
}: {
  intro?: LocalizedSectionIntro | null;
  notes?: LocalizedNotes | null;
  items?: LocalizedCardList | null;
}) {
  const { locale } = useLocale();
  const resolvedIntro = intro?.[locale]?.title ? intro[locale] : defaultIntro[locale];
  const resolvedNotes = notes?.[locale]?.noteA ? notes[locale] : defaultNotes[locale];
  const resolvedItems =
    items && items[locale]?.some((item) => item.title && item.desc)
      ? items[locale].filter((item) => item.title && item.desc)
      : defaultItems[locale];

  return (
    <section className="relative py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-white/60">{resolvedIntro.eyebrow}</p>
          <h2 className="text-3xl font-semibold">{resolvedIntro.title}</h2>
          <p className="text-muted">{resolvedIntro.subtitle}</p>
          <div className="grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {resolvedNotes.noteA}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {resolvedNotes.noteB}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {resolvedItems.map((item, index) => {
            const Icon = item.icon ? iconMap[item.icon] ?? icons[index % icons.length] : icons[index % icons.length];
            const mediaUrl = item.media?.url;
            return (
              <div key={`${item.title}-${index}`} className="glass-soft rounded-2xl p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent-300 overflow-hidden">
                  {mediaUrl ? (
                    <Image src={mediaUrl} alt={item.title} width={40} height={40} className="object-cover" />
                  ) : Icon ? (
                    <Icon size={20} />
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
