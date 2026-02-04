'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';
import AppPreview from '@/components/AppPreview';
import Gallery from '@/components/Gallery';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Button from '@/components/ui/Button';

export default function CaseStudyView({ app }: { app: AppDTO }) {
  const { locale } = useLocale();
  const title = locale === 'ar' ? app.title : app.titleEn ?? app.title;
  const kpis = app.kpis ?? [];
  const techStack = app.techStack ?? [];
  const roles = app.roleVariants ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'دراسة حالة' : 'Case Study'}
        </p>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-muted">{app.shortDesc}</p>
        <div className="flex flex-wrap gap-3">
          {app.links?.liveDemoUrl && (
            <a href={app.links.liveDemoUrl} target="_blank" rel="noreferrer">
              <Button>{locale === 'ar' ? 'عرض حي' : 'Live Demo'}</Button>
            </a>
          )}
          <a href={`/app/${app.slug}`} className="inline-flex">
            <Button variant="secondary">
              {locale === 'ar' ? 'العودة للتطبيق' : 'Back to app'}
            </Button>
          </a>
        </div>
      </div>

      <div className="glass-soft rounded-3xl p-6">
        <AppPreview app={app} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-soft rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold">
            {locale === 'ar' ? 'ملخص المشروع' : 'Project summary'}
          </h2>
          <div className="space-y-3 text-sm text-muted">
            <p>
              <strong>{locale === 'ar' ? 'المشكلة' : 'Problem'}:</strong> {app.caseStudy.problem}
            </p>
            <p>
              <strong>{locale === 'ar' ? 'الحل' : 'Solution'}:</strong> {app.caseStudy.solution}
            </p>
            <p>
              <strong>{locale === 'ar' ? 'المعمارية' : 'Architecture'}:</strong>{' '}
              {app.caseStudy.architecture}
            </p>
            <p>
              <strong>{locale === 'ar' ? 'التحديات' : 'Challenges'}:</strong> {app.caseStudy.challenges}
            </p>
            <p>
              <strong>{locale === 'ar' ? 'النتائج' : 'Results'}:</strong> {app.caseStudy.results}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {techStack.length > 0 && (
            <div className="glass-soft rounded-2xl p-6">
              <h3 className="text-lg font-semibold">{locale === 'ar' ? 'التقنيات' : 'Tech stack'}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {techStack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {roles.length > 0 && (
            <div className="glass-soft rounded-2xl p-6">
              <h3 className="text-lg font-semibold">{locale === 'ar' ? 'الأدوار' : 'Roles'}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span
                    key={role.key}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {role.label ?? role.key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {kpis.length > 0 && (
        <section className="grid gap-4 md:grid-cols-3">
          {kpis.map((item) => (
            <div key={`${item.label}-${item.value}`} className="glass-soft rounded-2xl p-4">
              <p className="text-xs uppercase tracking-widest text-white/60">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gradient">{item.value}</p>
            </div>
          ))}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-soft rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {locale === 'ar' ? 'لقطات الشاشة' : 'Screenshots'}
          </h2>
          <Gallery items={app.media.gallery ?? []} mode={app.mediaDisplay?.gallery ?? 'phone'} />
        </div>
        <div className="glass-soft rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {locale === 'ar' ? 'الوصف التفصيلي' : 'Detailed description'}
          </h2>
          <MarkdownRenderer content={app.description} />
        </div>
      </section>
    </main>
  );
}
