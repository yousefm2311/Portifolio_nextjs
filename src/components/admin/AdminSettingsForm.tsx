'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Button from '@/components/ui/Button';
import { MediaUploader } from '@/components/admin/MediaUploader';
import type { MediaDTO, LocalizedList, LocalizedImpact, LocalizedTimeline, SettingsDTO } from '@/lib/types';
import { Input, Textarea } from '@/components/ui/Inputs';

const defaultHeroBadges: LocalizedList = {
  ar: ['واجهات متحركة', 'أنظمة تصميم', 'تجارب موبايل كاملة', 'تسليم سريع'],
  en: ['Kinetic UI', 'Design Systems', 'Full Mobile Flows', 'Fast Shipping']
};

const defaultImpactItems: LocalizedImpact = {
  ar: [
    { value: '12+', label: 'منتج تم إطلاقه' },
    { value: '6', label: 'سنوات خبرة في الإنتاج' },
    { value: '40+', label: 'تجربة تفاعلية' },
    { value: '99.9%', label: 'استقرار في الإطلاق' }
  ],
  en: [
    { value: '12+', label: 'Products shipped' },
    { value: '6', label: 'Years in production' },
    { value: '40+', label: 'Interactive flows' },
    { value: '99.9%', label: 'Release stability' }
  ]
};

const defaultTechMarquee: LocalizedList = {
  ar: [
    'Flutter',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Firebase',
    'Socket.io',
    'Maps',
    'CI/CD',
    'Design Systems'
  ],
  en: [
    'Flutter',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Firebase',
    'Socket.io',
    'Maps',
    'CI/CD',
    'Design Systems'
  ]
};

const defaultTimeline: LocalizedTimeline = {
  ar: [
    { year: '2020', title: 'البداية', desc: 'بناء أول نموذج MVP لخدمات محلية.' },
    { year: '2022', title: 'التحول', desc: 'إطلاق أنظمة إدارة كاملة للشركات.' },
    { year: '2024', title: 'التوسع', desc: 'حلول متعددة الأدوار مع عروض تفاعلية.' },
    { year: '2025', title: 'الآن', desc: 'معرض تطبيقات بتجربة داخل جهاز.' }
  ],
  en: [
    { year: '2020', title: 'Kickoff', desc: 'Built the first MVP for local services.' },
    { year: '2022', title: 'Shift', desc: 'Launched full admin systems for companies.' },
    { year: '2024', title: 'Scale', desc: 'Multi-role solutions with interactive demos.' },
    { year: '2025', title: 'Now', desc: 'Portfolio showcase inside a device frame.' }
  ]
};

const smallButton =
  'rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white';

export default function AdminSettingsForm({
  initialSettings
}: {
  initialSettings?: SettingsDTO | null;
}) {
  const [cvMedia, setCvMedia] = useState<MediaDTO | null>(initialSettings?.cvMedia ?? null);
  const [heroBadges, setHeroBadges] = useState<LocalizedList>(
    initialSettings?.heroBadges ?? defaultHeroBadges
  );
  const [impactItems, setImpactItems] = useState<LocalizedImpact>(
    initialSettings?.impactItems ?? defaultImpactItems
  );
  const [techMarquee, setTechMarquee] = useState<LocalizedList>(
    initialSettings?.techMarquee ?? defaultTechMarquee
  );
  const [timeline, setTimeline] = useState<LocalizedTimeline>(
    initialSettings?.timeline ?? defaultTimeline
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const cleanList = (list: LocalizedList): LocalizedList => ({
    ar: list.ar.map((item) => item.trim()).filter(Boolean),
    en: list.en.map((item) => item.trim()).filter(Boolean)
  });

  const cleanImpact = (list: LocalizedImpact): LocalizedImpact => ({
    ar: list.ar
      .map((item) => ({ value: item.value.trim(), label: item.label.trim() }))
      .filter((item) => item.value && item.label),
    en: list.en
      .map((item) => ({ value: item.value.trim(), label: item.label.trim() }))
      .filter((item) => item.value && item.label)
  });

  const cleanTimeline = (list: LocalizedTimeline): LocalizedTimeline => ({
    ar: list.ar
      .map((item) => ({
        year: item.year.trim(),
        title: item.title.trim(),
        desc: item.desc.trim()
      }))
      .filter((item) => item.year && item.title),
    en: list.en
      .map((item) => ({
        year: item.year.trim(),
        title: item.title.trim(),
        desc: item.desc.trim()
      }))
      .filter((item) => item.year && item.title)
  });

  const canSave = !saving;

  const save = async () => {
    setSaving(true);
    setStatus(null);
    setStatusType(null);

    const payload = {
      cvMediaId: cvMedia?._id ?? null,
      heroBadges: cleanList(heroBadges),
      impactItems: cleanImpact(impactItems),
      techMarquee: cleanList(techMarquee),
      timeline: cleanTimeline(timeline)
    };

    const res = await fetch('/api/studio/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setSaving(false);
    if (res.ok) {
      setStatus('تم حفظ إعدادات الموقع.');
      setStatusType('success');
    } else {
      setStatus('تعذر الحفظ.');
      setStatusType('error');
    }
  };

  const updateStringList = (
    locale: 'ar' | 'en',
    index: number,
    value: string,
    setter: Dispatch<SetStateAction<LocalizedList>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = value;
      return next;
    });
  };

  const addStringItem = (
    locale: 'ar' | 'en',
    setter: Dispatch<SetStateAction<LocalizedList>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: [...prev[locale], '']
    }));
  };

  const removeStringItem = (
    locale: 'ar' | 'en',
    index: number,
    setter: Dispatch<SetStateAction<LocalizedList>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  const updateImpactItem = (
    locale: 'ar' | 'en',
    index: number,
    key: 'value' | 'label',
    value: string
  ) => {
    setImpactItems((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], [key]: value };
      return next;
    });
  };

  const addImpactItem = (locale: 'ar' | 'en') => {
    setImpactItems((prev) => ({
      ...prev,
      [locale]: [...prev[locale], { value: '', label: '' }]
    }));
  };

  const removeImpactItem = (locale: 'ar' | 'en', index: number) => {
    setImpactItems((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  const updateTimelineItem = (
    locale: 'ar' | 'en',
    index: number,
    key: 'year' | 'title' | 'desc',
    value: string
  ) => {
    setTimeline((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], [key]: value };
      return next;
    });
  };

  const addTimelineItem = (locale: 'ar' | 'en') => {
    setTimeline((prev) => ({
      ...prev,
      [locale]: [...prev[locale], { year: '', title: '', desc: '' }]
    }));
  };

  const removeTimelineItem = (locale: 'ar' | 'en', index: number) => {
    setTimeline((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-lg font-semibold">السيرة الذاتية (PDF)</h2>
        <p className="text-sm text-muted">ارفع ملف PDF ليظهر في الموقع للزوار.</p>
        <MediaUploader
          label="CV PDF"
          value={cvMedia ?? undefined}
          onChange={(media) => setCvMedia(media)}
          accept="application/pdf"
        />
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Hero Badges</h2>
          <p className="text-sm text-muted">الكلمات التي تظهر أسفل العنوان الرئيسي.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Arabic</h3>
              <button type="button" className={smallButton} onClick={() => addStringItem('ar', setHeroBadges)}>
                Add
              </button>
            </div>
            {heroBadges.ar.map((item, index) => (
              <div key={`hero-ar-${index}`} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(event) => updateStringList('ar', index, event.target.value, setHeroBadges)}
                  placeholder="مثال: واجهات متحركة"
                />
                <button
                  type="button"
                  className={smallButton}
                  onClick={() => removeStringItem('ar', index, setHeroBadges)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">English</h3>
              <button type="button" className={smallButton} onClick={() => addStringItem('en', setHeroBadges)}>
                Add
              </button>
            </div>
            {heroBadges.en.map((item, index) => (
              <div key={`hero-en-${index}`} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(event) => updateStringList('en', index, event.target.value, setHeroBadges)}
                  placeholder="Example: Design Systems"
                />
                <button
                  type="button"
                  className={smallButton}
                  onClick={() => removeStringItem('en', index, setHeroBadges)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Impact Strip</h2>
          <p className="text-sm text-muted">أرقام سريعة تُظهر الخبرة والنتائج.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`impact-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addImpactItem(locale)}>
                  Add
                </button>
              </div>
              {impactItems[locale].map((item, index) => (
                <div key={`impact-${locale}-${index}`} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                  <Input
                    value={item.value}
                    onChange={(event) => updateImpactItem(locale, index, 'value', event.target.value)}
                    placeholder={locale === 'ar' ? 'القيمة' : 'Value'}
                  />
                  <Input
                    value={item.label}
                    onChange={(event) => updateImpactItem(locale, index, 'label', event.target.value)}
                    placeholder={locale === 'ar' ? 'الوصف' : 'Label'}
                  />
                  <button
                    type="button"
                    className={smallButton}
                    onClick={() => removeImpactItem(locale, index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Tech Marquee</h2>
          <p className="text-sm text-muted">قائمة التقنيات المتحركة في الصفحة الرئيسية.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Arabic</h3>
              <button type="button" className={smallButton} onClick={() => addStringItem('ar', setTechMarquee)}>
                Add
              </button>
            </div>
            {techMarquee.ar.map((item, index) => (
              <div key={`tech-ar-${index}`} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(event) => updateStringList('ar', index, event.target.value, setTechMarquee)}
                  placeholder="مثال: Flutter"
                />
                <button
                  type="button"
                  className={smallButton}
                  onClick={() => removeStringItem('ar', index, setTechMarquee)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">English</h3>
              <button type="button" className={smallButton} onClick={() => addStringItem('en', setTechMarquee)}>
                Add
              </button>
            </div>
            {techMarquee.en.map((item, index) => (
              <div key={`tech-en-${index}`} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(event) => updateStringList('en', index, event.target.value, setTechMarquee)}
                  placeholder="Example: TypeScript"
                />
                <button
                  type="button"
                  className={smallButton}
                  onClick={() => removeStringItem('en', index, setTechMarquee)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Timeline</h2>
          <p className="text-sm text-muted">خط زمني قصير يظهر في الصفحة الرئيسية.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`timeline-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addTimelineItem(locale)}>
                  Add
                </button>
              </div>
              {timeline[locale].map((item, index) => (
                <div key={`timeline-${locale}-${index}`} className="space-y-2 rounded-xl border border-white/10 p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      value={item.year}
                      onChange={(event) => updateTimelineItem(locale, index, 'year', event.target.value)}
                      placeholder={locale === 'ar' ? 'السنة' : 'Year'}
                    />
                    <Input
                      value={item.title}
                      onChange={(event) => updateTimelineItem(locale, index, 'title', event.target.value)}
                      placeholder={locale === 'ar' ? 'العنوان' : 'Title'}
                    />
                  </div>
                  <Textarea
                    value={item.desc}
                    onChange={(event) => updateTimelineItem(locale, index, 'desc', event.target.value)}
                    placeholder={locale === 'ar' ? 'الوصف المختصر' : 'Short description'}
                    rows={2}
                  />
                  <button
                    type="button"
                    className={smallButton}
                    onClick={() => removeTimelineItem(locale, index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={save} disabled={!canSave}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        {status && (
          <p
            className={`text-xs ${
              statusType === 'success'
                ? 'text-emerald-200'
                : statusType === 'error'
                  ? 'text-red-200'
                  : 'text-muted'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
