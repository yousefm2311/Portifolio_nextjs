'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';
import AppPreview from '@/components/AppPreview';
import Gallery from '@/components/Gallery';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Button from '@/components/ui/Button';

export default function AppDetailView({ app }: { app: AppDTO }) {
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

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
        </p>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-muted">{app.shortDesc}</p>
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
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <AppPreview app={app} />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold">{labels.screenshots}</h2>
          <Gallery items={app.media.gallery ?? []} mode={app.mediaDisplay?.gallery ?? 'phone'} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold">{labels.caseStudy}</h2>
          <div className="space-y-3 text-sm text-muted">
            <p><strong>{labels.problem}:</strong> {app.caseStudy.problem}</p>
            <p><strong>{labels.solution}:</strong> {app.caseStudy.solution}</p>
            <p><strong>{labels.architecture}:</strong> {app.caseStudy.architecture}</p>
            <p><strong>{labels.challenges}:</strong> {app.caseStudy.challenges}</p>
            <p><strong>{labels.results}:</strong> {app.caseStudy.results}</p>
          </div>
        </div>
      </section>

      <div className="glass rounded-2xl p-6">
        <MarkdownRenderer content={app.description} />
      </div>
    </main>
  );
}
