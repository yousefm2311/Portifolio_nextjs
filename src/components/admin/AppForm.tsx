'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppDTO, MediaDTO } from '@/lib/types';
import { Input, Textarea, Select } from '@/components/ui/Inputs';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { GalleryUploader, MediaUploader } from '@/components/admin/MediaUploader';
import FlutterWebUploader from '@/components/admin/FlutterWebUploader';

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'media', label: 'Media' },
  { id: 'demo', label: 'Demo' },
  { id: 'case', label: 'Case Study' },
  { id: 'extras', label: 'Links + KPIs + Features' }
] as const;

const defaultState: AppDTO = {
  _id: '',
  title: '',
  titleEn: '',
  slug: '',
  shortDesc: '',
  description: '',
  category: 'Flutter',
  tags: [],
  roleVariants: [],
  techStack: [],
  features: [],
  kpis: [],
  links: {},
  demo: {
    type: 'video',
    embedUrl: '',
    videoId: '',
    interactiveHotspots: []
  },
  media: {
    icon: undefined,
    cover: undefined,
    gallery: []
  },
  mediaDisplay: {
    cover: 'full',
    gallery: 'phone'
  },
  caseStudy: {
    problem: '',
    solution: '',
    architecture: '',
    challenges: '',
    results: ''
  },
  status: 'draft',
  createdAt: '',
  updatedAt: ''
};

export default function AppForm({
  initial,
  mode
}: {
  initial?: AppDTO | null;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('basic');
  const [form, setForm] = useState<AppDTO>(initial ?? defaultState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverDetails, setServerDetails] = useState<Record<string, string[]>>({});
  const [missing, setMissing] = useState<string[]>([]);

  const requiredFields = [
    { key: 'title', label: 'Title (Arabic)', tab: 'basic' as const },
    { key: 'slug', label: 'Slug', tab: 'basic' as const },
    { key: 'shortDesc', label: 'Short description', tab: 'basic' as const },
    { key: 'description', label: 'Description', tab: 'basic' as const },
    { key: 'category', label: 'Category', tab: 'basic' as const },
    { key: 'demo', label: 'Demo (Video أو Embed URL)', tab: 'demo' as const },
    { key: 'caseStudy.problem', label: 'Problem', tab: 'case' as const },
    { key: 'caseStudy.solution', label: 'Solution', tab: 'case' as const },
    { key: 'caseStudy.architecture', label: 'Architecture', tab: 'case' as const },
    { key: 'caseStudy.challenges', label: 'Challenges', tab: 'case' as const },
    { key: 'caseStudy.results', label: 'Results', tab: 'case' as const }
  ];

  const getMissingRequired = () => {
    const missingFields: string[] = [];
    if (!form.title?.trim()) missingFields.push('Title (Arabic)');
    if (!form.slug?.trim()) missingFields.push('Slug');
    if (!form.shortDesc?.trim()) missingFields.push('Short description');
    if (!form.description?.trim()) missingFields.push('Description');
    if (!form.category) missingFields.push('Category');
    if (form.demo.type === 'flutter_web') {
      if (!form.demo.embedUrl?.trim()) missingFields.push('Embed URL (Flutter Web)');
    } else if (form.demo.type === 'video' || form.demo.type === 'interactive_video') {
      if (!form.demo.video && !form.demo.videoId) missingFields.push('Demo Video');
    }
    if (!form.caseStudy.problem?.trim()) missingFields.push('Problem');
    if (!form.caseStudy.solution?.trim()) missingFields.push('Solution');
    if (!form.caseStudy.architecture?.trim()) missingFields.push('Architecture');
    if (!form.caseStudy.challenges?.trim()) missingFields.push('Challenges');
    if (!form.caseStudy.results?.trim()) missingFields.push('Results');
    return missingFields;
  };

  const updateField = (key: keyof AppDTO, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCaseStudy = (key: keyof AppDTO['caseStudy'], value: string) => {
    setForm((prev) => ({ ...prev, caseStudy: { ...prev.caseStudy, [key]: value } }));
  };

  const updateLinks = (key: keyof AppDTO['links'], value: string) => {
    setForm((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));
  };

  const updateDemo = (key: keyof AppDTO['demo'], value: any) => {
    setForm((prev) => ({ ...prev, demo: { ...prev.demo, [key]: value } }));
  };

  const tagsString = useMemo(() => form.tags.join(', '), [form.tags]);
  const techString = useMemo(() => form.techStack.join(', '), [form.techStack]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setServerDetails({});
    const missingFields = getMissingRequired();
    if (missingFields.length > 0) {
      setMissing(missingFields);
      setSaving(false);
      setError('تحقق من الحقول الإلزامية.');
      return;
    }
    setMissing([]);
    const resolvedVideoId = form.demo.video?._id ?? (form.demo.videoId || undefined);

    const payload = {
      title: form.title,
      titleEn: form.titleEn,
      slug: form.slug,
      shortDesc: form.shortDesc,
      description: form.description,
      category: form.category,
      tags: form.tags,
      roleVariants: form.roleVariants,
      techStack: form.techStack,
      features: form.features,
      kpis: form.kpis,
      links: form.links,
      demo: {
        type: form.demo.type,
        embedUrl: form.demo.embedUrl,
        videoId: resolvedVideoId,
        interactiveHotspots: form.demo.interactiveHotspots ?? []
      },
      media: {
        iconId: form.media.icon?._id,
        coverId: form.media.cover?._id,
        galleryIds: form.media.gallery?.map((item) => item._id)
      },
      mediaDisplay: form.mediaDisplay,
      caseStudy: form.caseStudy,
      status: form.status
    };

    const res = await fetch(
      mode === 'create' ? '/api/studio/apps' : `/api/studio/apps/${form._id}`,
      {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    setSaving(false);
    if (res.ok) {
      router.push('/studio/apps');
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (data?.error?.fieldErrors) {
      setServerDetails(data.error.fieldErrors as Record<string, string[]>);
      setError('تحقق من المدخلات المطلوبة.');
    } else {
      setError(data?.error ?? 'حدث خطأ أثناء الحفظ.');
    }
  };

  return (
    <div className="space-y-6">
      {missing.length > 0 && (
        <div className="glass rounded-2xl border border-red-400/30 p-4 text-sm text-red-200">
          <p className="font-semibold">حقول إلزامية ناقصة:</p>
          <ul className="mt-2 list-disc pl-5">
            {missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Chip key={item.id} label={item.label} active={tab === item.id} onClick={() => setTab(item.id)} />
        ))}
      </div>

      {tab === 'basic' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Title (Arabic) *" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
          <Input placeholder="Title (EN)" value={form.titleEn ?? ''} onChange={(e) => updateField('titleEn', e.target.value)} />
          <Input placeholder="Slug *" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
          <Select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
            {['Flutter', 'Backend', 'Admin', 'Tools', 'DevOps'].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Tags (comma)"
            value={tagsString}
            onChange={(e) =>
              updateField(
                'tags',
                e.target.value
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean)
              )
            }
          />
          <Input
            placeholder="Tech stack (comma)"
            value={techString}
            onChange={(e) =>
              updateField(
                'techStack',
                e.target.value
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean)
              )
            }
          />
          <Textarea className="md:col-span-2" rows={3} placeholder="Short description *" value={form.shortDesc} onChange={(e) => updateField('shortDesc', e.target.value)} />
          <Textarea className="md:col-span-2" rows={6} placeholder="Description (Markdown) *" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
          <Select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-6">
          <MediaUploader
            label="App Icon"
            value={form.media.icon ?? undefined}
            onChange={(media) => updateField('media', { ...form.media, icon: media })}
          />
          <MediaUploader
            label="Cover"
            value={form.media.cover ?? undefined}
            onChange={(media) => updateField('media', { ...form.media, cover: media })}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Select
              value={form.mediaDisplay?.cover ?? 'full'}
              onChange={(e) =>
                updateField('mediaDisplay', { ...form.mediaDisplay, cover: e.target.value })
              }
            >
              <option value="full">Cover: Full</option>
              <option value="phone">Cover: Phone</option>
            </Select>
            <Select
              value={form.mediaDisplay?.gallery ?? 'phone'}
              onChange={(e) =>
                updateField('mediaDisplay', { ...form.mediaDisplay, gallery: e.target.value })
              }
            >
              <option value="phone">Gallery: Phone</option>
              <option value="full">Gallery: Full</option>
            </Select>
          </div>
          <GalleryUploader
            label="Gallery"
            values={form.media.gallery ?? []}
            onChange={(media) => updateField('media', { ...form.media, gallery: media })}
          />
        </div>
      )}

      {tab === 'demo' && (
        <div className="space-y-4">
          <Select value={form.demo.type} onChange={(e) => updateDemo('type', e.target.value)}>
            <option value="video">Video</option>
            <option value="flutter_web">Flutter Web</option>
            <option value="interactive_video">Interactive Video</option>
          </Select>
          {form.demo.type === 'flutter_web' && (
            <div className="space-y-3">
              <Input
                placeholder="Embed URL *"
                value={form.demo.embedUrl ?? ''}
                onChange={(e) => updateDemo('embedUrl', e.target.value)}
              />
              <FlutterWebUploader
                slug={form.slug}
                onUploaded={(url) => updateDemo('embedUrl', url)}
              />
              <p className="text-xs text-muted">تأكد أن slug مكتوب قبل الرفع.</p>
            </div>
          )}
          {(form.demo.type === 'video' || form.demo.type === 'interactive_video') && (
            <MediaUploader
              label="Demo Video *"
              value={form.demo.video ?? undefined}
              onChange={(media) => updateDemo('video', media)}
            />
          )}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Role Variants</h4>
            {form.roleVariants.map((variant, index) => (
              <div key={`${variant.key}-${index}`} className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Key (customer/driver/admin)"
                  value={variant.key}
                  onChange={(e) => {
                    const updated = [...form.roleVariants];
                    updated[index] = { ...variant, key: e.target.value };
                    updateField('roleVariants', updated);
                  }}
                />
                <Input
                  placeholder="Label"
                  value={variant.label}
                  onChange={(e) => {
                    const updated = [...form.roleVariants];
                    updated[index] = { ...variant, label: e.target.value };
                    updateField('roleVariants', updated);
                  }}
                />
                <Button
                  variant="ghost"
                  onClick={() => updateField('roleVariants', form.roleVariants.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => updateField('roleVariants', [...form.roleVariants, { key: '', label: '' }])}
            >
              Add Role Variant
            </Button>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Interactive Hotspots</h4>
            {(form.demo.interactiveHotspots ?? []).map((spot, index) => (
              <div key={`${spot.label}-${index}`} className="grid gap-2 md:grid-cols-6">
                <Input
                  placeholder="Start"
                  value={String(spot.timeStart)}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, timeStart: Number(e.target.value) };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Input
                  placeholder="End"
                  value={String(spot.timeEnd)}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, timeEnd: Number(e.target.value) };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Input
                  placeholder="X%"
                  value={String(spot.x)}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, x: Number(e.target.value) };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Input
                  placeholder="Y%"
                  value={String(spot.y)}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, y: Number(e.target.value) };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Input
                  placeholder="Action"
                  value={spot.action}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, action: e.target.value };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Input
                  placeholder="Label"
                  value={spot.label}
                  onChange={(e) => {
                    const updated = [...(form.demo.interactiveHotspots ?? [])];
                    updated[index] = { ...spot, label: e.target.value };
                    updateDemo('interactiveHotspots', updated);
                  }}
                />
                <Button
                  variant="ghost"
                  onClick={() =>
                    updateDemo(
                      'interactiveHotspots',
                      (form.demo.interactiveHotspots ?? []).filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                updateDemo('interactiveHotspots', [
                  ...(form.demo.interactiveHotspots ?? []),
                  { timeStart: 0, timeEnd: 1, x: 50, y: 50, action: 'info', label: 'Hotspot' }
                ])
              }
            >
              Add Hotspot
            </Button>
          </div>
        </div>
      )}

      {tab === 'case' && (
        <div className="space-y-4">
          <Textarea rows={3} placeholder="Problem *" value={form.caseStudy.problem} onChange={(e) => updateCaseStudy('problem', e.target.value)} />
          <Textarea rows={3} placeholder="Solution *" value={form.caseStudy.solution} onChange={(e) => updateCaseStudy('solution', e.target.value)} />
          <Textarea rows={3} placeholder="Architecture *" value={form.caseStudy.architecture} onChange={(e) => updateCaseStudy('architecture', e.target.value)} />
          <Textarea rows={3} placeholder="Challenges *" value={form.caseStudy.challenges} onChange={(e) => updateCaseStudy('challenges', e.target.value)} />
          <Textarea rows={3} placeholder="Results *" value={form.caseStudy.results} onChange={(e) => updateCaseStudy('results', e.target.value)} />
        </div>
      )}

      {tab === 'extras' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Live Demo URL" value={form.links.liveDemoUrl ?? ''} onChange={(e) => updateLinks('liveDemoUrl', e.target.value)} />
            <Input placeholder="GitHub URL" value={form.links.githubUrl ?? ''} onChange={(e) => updateLinks('githubUrl', e.target.value)} />
            <Input placeholder="APK URL" value={form.links.apkUrl ?? ''} onChange={(e) => updateLinks('apkUrl', e.target.value)} />
            <Input placeholder="iOS URL" value={form.links.iosUrl ?? ''} onChange={(e) => updateLinks('iosUrl', e.target.value)} />
            <Input placeholder="Play Store URL" value={form.links.playStoreUrl ?? ''} onChange={(e) => updateLinks('playStoreUrl', e.target.value)} />
            <Input placeholder="App Store URL" value={form.links.appStoreUrl ?? ''} onChange={(e) => updateLinks('appStoreUrl', e.target.value)} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">KPIs</h4>
            {form.kpis?.map((kpi, index) => (
              <div key={`${kpi.label}-${index}`} className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Label"
                  value={kpi.label}
                  onChange={(e) => {
                    const updated = [...(form.kpis ?? [])];
                    updated[index] = { ...kpi, label: e.target.value };
                    updateField('kpis', updated);
                  }}
                />
                <Input
                  placeholder="Value"
                  value={kpi.value}
                  onChange={(e) => {
                    const updated = [...(form.kpis ?? [])];
                    updated[index] = { ...kpi, value: e.target.value };
                    updateField('kpis', updated);
                  }}
                />
                <Button
                  variant="ghost"
                  onClick={() => updateField('kpis', (form.kpis ?? []).filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => updateField('kpis', [...(form.kpis ?? []), { label: '', value: '' }])}
            >
              Add KPI
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Features</h4>
            {form.features.map((feature, index) => (
              <div key={`${feature.title}-${index}`} className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Title"
                  value={feature.title}
                  onChange={(e) => {
                    const updated = [...form.features];
                    updated[index] = { ...feature, title: e.target.value };
                    updateField('features', updated);
                  }}
                />
                <Input
                  placeholder="Details"
                  value={feature.details}
                  onChange={(e) => {
                    const updated = [...form.features];
                    updated[index] = { ...feature, details: e.target.value };
                    updateField('features', updated);
                  }}
                />
                <Button
                  variant="ghost"
                  onClick={() => updateField('features', form.features.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => updateField('features', [...form.features, { title: '', details: '' }])}>
              Add Feature
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.push('/studio/apps')}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {Object.keys(serverDetails).length > 0 && (
        <div className="glass rounded-2xl border border-red-400/30 p-4 text-xs text-red-200">
          <p className="font-semibold mb-2">تفاصيل الأخطاء من السيرفر:</p>
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(serverDetails).map(([field, messages]) => (
              <li key={field}>
                {field}: {messages.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
