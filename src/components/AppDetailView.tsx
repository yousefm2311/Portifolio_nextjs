'use client';

import { AppDTO } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';
import AppPreview from '@/components/AppPreview';
import Gallery from '@/components/Gallery';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Button from '@/components/ui/Button';

export default function AppDetailView({ app }: { app: AppDTO }) {
  const { locale } = useLocale();
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
    <main className="mx-auto max-w-6xl px-4 py-16 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-muted">{app.shortDesc}</p>
        <div className="flex flex-wrap gap-3">
          {app.links?.liveDemoUrl && (
            <a href={app.links.liveDemoUrl} target="_blank" rel="noreferrer">
              <Button>Open Fullscreen Demo</Button>
            </a>
          )}
          {app.links?.githubUrl && (
            <a href={app.links.githubUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">View GitHub</Button>
            </a>
          )}
        </div>
      </div>

      <AppPreview app={app} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">{labels.screenshots}</h2>
          <Gallery items={app.media.gallery ?? []} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">{labels.caseStudy}</h2>
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
