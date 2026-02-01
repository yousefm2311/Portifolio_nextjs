'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppDTO } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Gallery from '@/components/Gallery';
import AppPreview from '@/components/AppPreview';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useLocale } from '@/components/LocaleProvider';
import Chip from '@/components/ui/Chip';
import { ExternalLink, Github, Download } from 'lucide-react';

const tabs = [
  { id: 'demo', labelKey: 'liveDemo' },
  { id: 'screens', labelKey: 'screenshots' },
  { id: 'case', labelKey: 'caseStudy' }
] as const;

export default function AppModal({
  app,
  open,
  onClose
}: {
  app: AppDTO | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('demo');
  const [role, setRole] = useState<string | null>(null);

  const roleVariants = useMemo(() => app?.roleVariants ?? [], [app]);

  useEffect(() => {
    if (!app) return;
    setTab('demo');
    setRole(null);
  }, [app]);

  if (!app) return null;

  return (
    <Modal open={open} onClose={onClose} title={locale === 'ar' ? app.title : app.titleEn ?? app.title}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((item) => (
            <Chip
              key={item.id}
              label={t(item.labelKey as any)}
              active={tab === item.id}
              onClick={() => setTab(item.id)}
            />
          ))}
        </div>

        {tab === 'demo' && (
          <div className="space-y-5">
            {roleVariants.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">{t('roles')}</span>
                {roleVariants.map((variant) => (
                  <Chip
                    key={variant.key}
                    label={variant.label}
                    active={role === variant.key}
                    onClick={() => setRole(variant.key)}
                  />
                ))}
              </div>
            )}
            <AppPreview app={app} />
            <div className="flex flex-wrap gap-2">
              {['Maps', 'Chat', 'Notifications'].map((label) => (
                <button
                  key={label}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/70 hover:border-white/30"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'screens' && (
          <Gallery items={app.media.gallery ?? []} mode={app.mediaDisplay?.gallery ?? 'phone'} />
        )}

        {tab === 'case' && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Problem</h4>
              <p className="text-sm text-muted">{app.caseStudy.problem}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Solution</h4>
              <p className="text-sm text-muted">{app.caseStudy.solution}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Architecture</h4>
              <p className="text-sm text-muted">{app.caseStudy.architecture}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Challenges</h4>
              <p className="text-sm text-muted">{app.caseStudy.challenges}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Results</h4>
              <p className="text-sm text-muted">{app.caseStudy.results}</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-4">
            <h4 className="mb-2 text-sm font-semibold">{t('techStack')}</h4>
            <div className="flex flex-wrap gap-2">
              {app.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <h4 className="mb-2 text-sm font-semibold">{t('features')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              {app.features.map((feature) => (
                <li key={feature.title}>{feature.title}: {feature.details}</li>
              ))}
            </ul>
          </div>
        </div>

        {app.kpis && app.kpis.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <h4 className="mb-2 text-sm font-semibold">{t('kpis')}</h4>
            <div className="flex flex-wrap gap-3">
              {app.kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-white/10 px-4 py-2 text-sm">
                  <span className="text-white/60">{kpi.label}:</span> {kpi.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {app.description && (
          <div className="glass rounded-2xl p-4">
            <MarkdownRenderer content={app.description} />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {app.links?.liveDemoUrl && (
            <a href={app.links.liveDemoUrl} target="_blank" rel="noreferrer">
              <Button>
                <ExternalLink className="mr-2" size={16} /> {t('openFullscreen')}
              </Button>
            </a>
          )}
          {app.links?.githubUrl && (
            <a href={app.links.githubUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <Github className="mr-2" size={16} /> {t('viewGithub')}
              </Button>
            </a>
          )}
          {app.links?.apkUrl && (
            <a href={app.links.apkUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <Download className="mr-2" size={16} /> {t('downloadApk')}
              </Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
