'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';
import AppPreview from '@/components/AppPreview';
import Gallery from '@/components/Gallery';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Button from '@/components/ui/Button';

export default function AppDetailView({
  app,
  showCaseStudy
}: {
  app: AppDTO;
  showCaseStudy?: boolean;
}) {
  const { locale, t } = useLocale();
  const title = locale === 'ar' ? app.title : app.titleEn ?? app.title;
  const labels = {
    screenshots: locale === 'ar' ? 'لقطات الشاشة' : 'Screenshots',
    caseStudy: locale === 'ar' ? 'دراسة الحالة' : 'Case Study',
    problem: locale === 'ar' ? 'المشكلة' : 'Problem',
    solution: locale === 'ar' ? 'الحل' : 'Solution',
    architecture: locale === 'ar' ? 'المعمارية' : 'Architecture',
    challenges: locale === 'ar' ? 'التحديات' : 'Challenges',
    results: locale === 'ar' ? 'النتائج' : 'Results'
  };
  const techStack = app.techStack ?? [];
  const roles = app.roleVariants ?? [];
  const kpis = app.kpis ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
        </p>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-muted">{app.shortDesc}</p>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {roles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role.key}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
              >
                {role.label ?? role.key}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {app.links?.liveDemoUrl && (
            <a href={app.links.liveDemoUrl} target="_blank" rel="noreferrer">
              <Button>{t('openFullscreen')}</Button>
            </a>
          )}
          {app.links?.githubUrl && (
            <a href={app.links.githubUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">{t('viewGithub')}</Button>
            </a>
          )}
          {showCaseStudy && (
            <a href={`/app/${app.slug}/case-study`}>
              <Button variant="ghost">{t('caseStudy')}</Button>
            </a>
          )}
        </div>
      </div>

      <div className="glass-soft rounded-3xl p-6">
        <AppPreview app={app} />
      </div>

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

      <section className={`grid gap-6 ${showCaseStudy ? 'lg:grid-cols-2' : ''}`}>
        <div className="glass-soft rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold">{labels.screenshots}</h2>
          <Gallery items={app.media.gallery ?? []} mode={app.mediaDisplay?.gallery ?? 'phone'} />
        </div>
        {showCaseStudy && (
          <div className="glass-soft rounded-2xl p-6">
            <h2 className="mb-4 text-xl font-semibold">{labels.caseStudy}</h2>
            <div className="space-y-3 text-sm text-muted">
              <p><strong>{labels.problem}:</strong> {app.caseStudy.problem}</p>
              <p><strong>{labels.solution}:</strong> {app.caseStudy.solution}</p>
              <p><strong>{labels.architecture}:</strong> {app.caseStudy.architecture}</p>
              <p><strong>{labels.challenges}:</strong> {app.caseStudy.challenges}</p>
              <p><strong>{labels.results}:</strong> {app.caseStudy.results}</p>
            </div>
          </div>
        )}
      </section>

      <div className="glass-soft rounded-2xl p-6">
        <MarkdownRenderer content={app.description} />
      </div>
    </main>
  );
}
