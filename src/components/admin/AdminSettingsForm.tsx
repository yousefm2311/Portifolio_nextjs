'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Button from '@/components/ui/Button';
import { MediaUploader } from '@/components/admin/MediaUploader';
import type {
  MediaDTO,
  LocalizedList,
  LocalizedImpact,
  LocalizedTimeline,
  SettingsDTO,
  LocalizedSectionIntro,
  LocalizedNotes,
  LocalizedCardList,
  LocalizedCta,
  LocalizedResources,
  LocalizedServices,
  ResourceItem,
  ServicePlan
} from '@/lib/types';
import { Input, Select, Textarea } from '@/components/ui/Inputs';

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

const defaultCapabilitiesIntro: LocalizedSectionIntro = {
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

const defaultCapabilitiesNotes: LocalizedNotes = {
  ar: {
    noteA: 'تخطيط واضح + تصميم عالي + تنفيذ فعلي = نتائج ملموسة.',
    noteB: 'تركيز على الأداء، التفاصيل، وقابلية التوسع.'
  },
  en: {
    noteA: 'Clear planning + high-end design + real engineering = tangible results.',
    noteB: 'Focused on performance, details, and scalability.'
  }
};

const defaultCapabilitiesItems: LocalizedCardList = {
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

const defaultProcessIntro: LocalizedSectionIntro = {
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

const defaultProcessSteps: LocalizedCardList = {
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

const defaultCta: LocalizedCta = {
  ar: {
    eyebrow: 'جاهز للانطلاق؟',
    title: 'حوّل فكرتك إلى تجربة حقيقية',
    subtitle: 'ابدأ بمحادثة قصيرة وسنحدد أفضل طريق للإطلاق.',
    primaryLabel: 'تواصل معي',
    secondaryLabel: 'شاهد التطبيقات'
  },
  en: {
    eyebrow: 'Ready to build?',
    title: 'Turn your idea into a real product',
    subtitle: 'Start with a quick chat and we map the best launch path.',
    primaryLabel: 'Contact me',
    secondaryLabel: 'View apps'
  }
};

const defaultResources: LocalizedResources = {
  ar: [
    {
      title: 'دليل سريع للانطلاق',
      desc: 'خطوات عملية لبناء نسخة أولى قوية.',
      url: 'https://example.com/guide',
      type: 'guide',
      badge: 'Guide'
    }
  ],
  en: [
    {
      title: 'Launch Checklist',
      desc: 'A practical checklist for shipping v1.',
      url: 'https://example.com/checklist',
      type: 'guide',
      badge: 'Guide'
    }
  ]
};

const defaultServices: LocalizedServices = {
  ar: [
    {
      name: 'الأساسي',
      price: 'حسب النطاق',
      description: 'مناسب للمنتجات الناشئة',
      features: ['جلسة اكتشاف', 'تصميم أساسي', 'تنفيذ MVP'],
      highlight: false
    },
    {
      name: 'الاحترافي',
      price: 'حسب النطاق',
      description: 'لمنتج كامل وتجربة متقدمة',
      features: ['تصميم متقدم', 'واجهات متحركة', 'اختبارات جودة'],
      highlight: true
    }
  ],
  en: [
    {
      name: 'Starter',
      price: 'Scope-based',
      description: 'Great for new products',
      features: ['Discovery session', 'Core UI', 'MVP build'],
      highlight: false
    },
    {
      name: 'Pro',
      price: 'Scope-based',
      description: 'Full product and advanced UX',
      features: ['Advanced UI', 'Kinetic motion', 'Quality testing'],
      highlight: true
    }
  ]
};

const smallButton =
  'rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white';

const iconOptions = [
  { value: '', label: 'No icon' },
  { value: 'layers', label: 'Layers' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'shield', label: 'Shield' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'code', label: 'Code' },
  { value: 'zap', label: 'Zap' },
  { value: 'layout', label: 'Layout' },
  { value: 'workflow', label: 'Workflow' }
];

const resourceTypeOptions = [
  { value: 'guide', label: 'Guide' },
  { value: 'link', label: 'Link' },
  { value: 'tool', label: 'Tool' },
  { value: 'file', label: 'File' },
  { value: 'video', label: 'Video' }
];

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
  const [capabilitiesIntro, setCapabilitiesIntro] = useState<LocalizedSectionIntro>(
    initialSettings?.capabilitiesIntro ?? defaultCapabilitiesIntro
  );
  const [capabilitiesNotes, setCapabilitiesNotes] = useState<LocalizedNotes>(
    initialSettings?.capabilitiesNotes ?? defaultCapabilitiesNotes
  );
  const [capabilitiesItems, setCapabilitiesItems] = useState<LocalizedCardList>(
    initialSettings?.capabilitiesItems ?? defaultCapabilitiesItems
  );
  const [processIntro, setProcessIntro] = useState<LocalizedSectionIntro>(
    initialSettings?.processIntro ?? defaultProcessIntro
  );
  const [processSteps, setProcessSteps] = useState<LocalizedCardList>(
    initialSettings?.processSteps ?? defaultProcessSteps
  );
  const [cta, setCta] = useState<LocalizedCta>(initialSettings?.cta ?? defaultCta);
  const [enableResources, setEnableResources] = useState<boolean>(
    initialSettings?.enableResources ?? false
  );
  const [enableServices, setEnableServices] = useState<boolean>(
    initialSettings?.enableServices ?? false
  );
  const [enableCaseStudy, setEnableCaseStudy] = useState<boolean>(
    initialSettings?.enableCaseStudy ?? false
  );
  const [resources, setResources] = useState<LocalizedResources>(
    initialSettings?.resources ?? defaultResources
  );
  const [services, setServices] = useState<LocalizedServices>(
    initialSettings?.services ?? defaultServices
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

  const cleanIntro = (value: LocalizedSectionIntro): LocalizedSectionIntro => ({
    ar: {
      eyebrow: value.ar.eyebrow.trim(),
      title: value.ar.title.trim(),
      subtitle: value.ar.subtitle.trim()
    },
    en: {
      eyebrow: value.en.eyebrow.trim(),
      title: value.en.title.trim(),
      subtitle: value.en.subtitle.trim()
    }
  });

  const cleanNotes = (value: LocalizedNotes): LocalizedNotes => ({
    ar: {
      noteA: value.ar.noteA.trim(),
      noteB: value.ar.noteB.trim()
    },
    en: {
      noteA: value.en.noteA.trim(),
      noteB: value.en.noteB.trim()
    }
  });

  const cleanCardList = (list: LocalizedCardList): LocalizedCardList => ({
    ar: list.ar
      .map((item) => ({
        title: item.title.trim(),
        desc: item.desc.trim(),
        icon: item.icon?.trim() ?? '',
        mediaId: item.media?._id ?? null
      }))
      .filter((item) => item.title && item.desc),
    en: list.en
      .map((item) => ({
        title: item.title.trim(),
        desc: item.desc.trim(),
        icon: item.icon?.trim() ?? '',
        mediaId: item.media?._id ?? null
      }))
      .filter((item) => item.title && item.desc)
  });

  const cleanCta = (value: LocalizedCta): LocalizedCta => ({
    ar: {
      eyebrow: value.ar.eyebrow.trim(),
      title: value.ar.title.trim(),
      subtitle: value.ar.subtitle.trim(),
      primaryLabel: value.ar.primaryLabel.trim(),
      secondaryLabel: value.ar.secondaryLabel.trim()
    },
    en: {
      eyebrow: value.en.eyebrow.trim(),
      title: value.en.title.trim(),
      subtitle: value.en.subtitle.trim(),
      primaryLabel: value.en.primaryLabel.trim(),
      secondaryLabel: value.en.secondaryLabel.trim()
    }
  });

  const cleanResources = (list: LocalizedResources): LocalizedResources => ({
    ar: list.ar
      .map((item) => ({
        title: item.title.trim(),
        desc: item.desc.trim(),
        url: item.url.trim(),
        type: item.type || 'link',
        badge: item.badge?.trim() ?? ''
      }))
      .filter((item) => item.title && item.url),
    en: list.en
      .map((item) => ({
        title: item.title.trim(),
        desc: item.desc.trim(),
        url: item.url.trim(),
        type: item.type || 'link',
        badge: item.badge?.trim() ?? ''
      }))
      .filter((item) => item.title && item.url)
  });

  const cleanServices = (list: LocalizedServices): LocalizedServices => ({
    ar: list.ar
      .map((item) => ({
        name: item.name.trim(),
        price: item.price.trim(),
        description: item.description.trim(),
        features: item.features.map((f) => f.trim()).filter(Boolean),
        highlight: Boolean(item.highlight)
      }))
      .filter((item) => item.name && item.price),
    en: list.en
      .map((item) => ({
        name: item.name.trim(),
        price: item.price.trim(),
        description: item.description.trim(),
        features: item.features.map((f) => f.trim()).filter(Boolean),
        highlight: Boolean(item.highlight)
      }))
      .filter((item) => item.name && item.price)
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
      timeline: cleanTimeline(timeline),
      capabilitiesIntro: cleanIntro(capabilitiesIntro),
      capabilitiesNotes: cleanNotes(capabilitiesNotes),
      capabilitiesItems: cleanCardList(capabilitiesItems),
      processIntro: cleanIntro(processIntro),
      processSteps: cleanCardList(processSteps),
      cta: cleanCta(cta),
      enableResources,
      enableServices,
      enableCaseStudy,
      resources: cleanResources(resources),
      services: cleanServices(services)
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

  const updateIntroField = (
    locale: 'ar' | 'en',
    key: keyof LocalizedSectionIntro['ar'],
    value: string,
    setter: Dispatch<SetStateAction<LocalizedSectionIntro>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value
      }
    }));
  };

  const updateNotesField = (
    locale: 'ar' | 'en',
    key: keyof LocalizedNotes['ar'],
    value: string,
    setter: Dispatch<SetStateAction<LocalizedNotes>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value
      }
    }));
  };

  const updateCardItem = (
    locale: 'ar' | 'en',
    index: number,
    key: keyof LocalizedCardList['ar'][number],
    value: string,
    setter: Dispatch<SetStateAction<LocalizedCardList>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], [key]: value };
      return next;
    });
  };

  const updateCardMedia = (
    locale: 'ar' | 'en',
    index: number,
    media: MediaDTO,
    setter: Dispatch<SetStateAction<LocalizedCardList>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], media };
      return next;
    });
  };

  const [dragItem, setDragItem] = useState<{
    list: 'capabilities' | 'process' | 'resources' | 'services';
    locale: 'ar' | 'en';
    index: number;
  } | null>(null);

  const reorderCardList = (
    locale: 'ar' | 'en',
    from: number,
    to: number,
    setter: Dispatch<SetStateAction<LocalizedCardList>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const list = next[locale];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return next;
    });
  };

  const reorderResourceList = (
    locale: 'ar' | 'en',
    from: number,
    to: number,
    setter: Dispatch<SetStateAction<LocalizedResources>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const list = next[locale];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return next;
    });
  };

  const reorderServiceList = (
    locale: 'ar' | 'en',
    from: number,
    to: number,
    setter: Dispatch<SetStateAction<LocalizedServices>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const list = next[locale];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return next;
    });
  };

  const addCardItem = (
    locale: 'ar' | 'en',
    setter: Dispatch<SetStateAction<LocalizedCardList>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: [...prev[locale], { title: '', desc: '' }]
    }));
  };

  const removeCardItem = (
    locale: 'ar' | 'en',
    index: number,
    setter: Dispatch<SetStateAction<LocalizedCardList>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  const updateCtaField = (
    locale: 'ar' | 'en',
    key: keyof LocalizedCta['ar'],
    value: string
  ) => {
    setCta((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value
      }
    }));
  };

  const updateResourceItem = (
    locale: 'ar' | 'en',
    index: number,
    key: keyof ResourceItem,
    value: string,
    setter: Dispatch<SetStateAction<LocalizedResources>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], [key]: value } as ResourceItem;
      return next;
    });
  };

  const addResourceItem = (
    locale: 'ar' | 'en',
    setter: Dispatch<SetStateAction<LocalizedResources>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: [
        ...prev[locale],
        { title: '', desc: '', url: '', type: 'link', badge: '' }
      ]
    }));
  };

  const removeResourceItem = (
    locale: 'ar' | 'en',
    index: number,
    setter: Dispatch<SetStateAction<LocalizedResources>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  const updateServicePlan = (
    locale: 'ar' | 'en',
    index: number,
    key: keyof ServicePlan,
    value: string | boolean,
    setter: Dispatch<SetStateAction<LocalizedServices>>
  ) => {
    setter((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      next[locale][index] = { ...next[locale][index], [key]: value } as ServicePlan;
      return next;
    });
  };

  const addServicePlan = (
    locale: 'ar' | 'en',
    setter: Dispatch<SetStateAction<LocalizedServices>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: [
        ...prev[locale],
        { name: '', price: '', description: '', features: [], highlight: false }
      ]
    }));
  };

  const removeServicePlan = (
    locale: 'ar' | 'en',
    index: number,
    setter: Dispatch<SetStateAction<LocalizedServices>>
  ) => {
    setter((prev) => ({
      ...prev,
      [locale]: prev[locale].filter((_, idx) => idx !== index)
    }));
  };

  const updateServiceFeature = (
    locale: 'ar' | 'en',
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    setServices((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const plan = next[locale][planIndex];
      const features = [...(plan.features ?? [])];
      features[featureIndex] = value;
      next[locale][planIndex] = { ...plan, features };
      return next;
    });
  };

  const addServiceFeature = (locale: 'ar' | 'en', planIndex: number) => {
    setServices((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const plan = next[locale][planIndex];
      next[locale][planIndex] = { ...plan, features: [...(plan.features ?? []), ''] };
      return next;
    });
  };

  const removeServiceFeature = (locale: 'ar' | 'en', planIndex: number, featureIndex: number) => {
    setServices((prev) => {
      const next = { ...prev, [locale]: [...prev[locale]] };
      const plan = next[locale][planIndex];
      next[locale][planIndex] = {
        ...plan,
        features: (plan.features ?? []).filter((_, idx) => idx !== featureIndex)
      };
      return next;
    });
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

      <div className="glass rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Platform Toggles</h2>
          <p className="text-sm text-muted">تفعيل أو إلغاء صفحات المنصة.</p>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={enableResources}
            onChange={(event) => setEnableResources(event.target.checked)}
          />
          Resources page
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={enableServices}
            onChange={(event) => setEnableServices(event.target.checked)}
          />
          Services page
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={enableCaseStudy}
            onChange={(event) => setEnableCaseStudy(event.target.checked)}
          />
          Case Study pages
        </label>
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

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Capabilities Intro</h2>
          <p className="text-sm text-muted">عنوان قسم المزايا مع نصوص داعمة.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`cap-intro-${locale}`} className="space-y-3">
              <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
              <Input
                value={capabilitiesIntro[locale].eyebrow}
                onChange={(event) => updateIntroField(locale, 'eyebrow', event.target.value, setCapabilitiesIntro)}
                placeholder={locale === 'ar' ? 'العنوان الصغير' : 'Eyebrow'}
              />
              <Input
                value={capabilitiesIntro[locale].title}
                onChange={(event) => updateIntroField(locale, 'title', event.target.value, setCapabilitiesIntro)}
                placeholder={locale === 'ar' ? 'العنوان الرئيسي' : 'Title'}
              />
              <Textarea
                value={capabilitiesIntro[locale].subtitle}
                onChange={(event) => updateIntroField(locale, 'subtitle', event.target.value, setCapabilitiesIntro)}
                placeholder={locale === 'ar' ? 'النص الوصفي' : 'Subtitle'}
                rows={2}
              />
              <Textarea
                value={capabilitiesNotes[locale].noteA}
                onChange={(event) => updateNotesField(locale, 'noteA', event.target.value, setCapabilitiesNotes)}
                placeholder={locale === 'ar' ? 'ملاحظة 1' : 'Note 1'}
                rows={2}
              />
              <Textarea
                value={capabilitiesNotes[locale].noteB}
                onChange={(event) => updateNotesField(locale, 'noteB', event.target.value, setCapabilitiesNotes)}
                placeholder={locale === 'ar' ? 'ملاحظة 2' : 'Note 2'}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Capabilities Cards</h2>
          <p className="text-sm text-muted">بطاقات المزايا (العنوان + الوصف).</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`cap-items-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addCardItem(locale, setCapabilitiesItems)}>
                  Add
                </button>
              </div>
              {capabilitiesItems[locale].map((item, index) => (
                <div
                  key={`cap-${locale}-${index}`}
                  className="space-y-3 rounded-xl border border-white/10 p-3"
                  draggable
                  onDragStart={() => setDragItem({ list: 'capabilities', locale, index })}
                  onDragOver={(event) => {
                    if (dragItem?.list === 'capabilities' && dragItem.locale === locale) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (
                      dragItem?.list === 'capabilities' &&
                      dragItem.locale === locale &&
                      dragItem.index !== index
                    ) {
                      reorderCardList(locale, dragItem.index, index, setCapabilitiesItems);
                    }
                    setDragItem(null);
                  }}
                  onDragEnd={() => setDragItem(null)}
                >
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Drag</span>
                    <button
                      type="button"
                      className={smallButton}
                      onClick={() => removeCardItem(locale, index, setCapabilitiesItems)}
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(event) => updateCardItem(locale, index, 'title', event.target.value, setCapabilitiesItems)}
                    placeholder={locale === 'ar' ? 'العنوان' : 'Title'}
                  />
                  <Textarea
                    value={item.desc}
                    onChange={(event) => updateCardItem(locale, index, 'desc', event.target.value, setCapabilitiesItems)}
                    placeholder={locale === 'ar' ? 'الوصف' : 'Description'}
                    rows={2}
                  />
                  <Select
                    value={item.icon ?? ''}
                    onChange={(event) => updateCardItem(locale, index, 'icon', event.target.value, setCapabilitiesItems)}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <MediaUploader
                    label={locale === 'ar' ? 'صورة البطاقة (اختياري)' : 'Card image (optional)'}
                    value={item.media ?? undefined}
                    onChange={(media) => updateCardMedia(locale, index, media, setCapabilitiesItems)}
                    accept="image/*"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Process Intro</h2>
          <p className="text-sm text-muted">عنوان قسم المنهجية والنصوص.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`process-intro-${locale}`} className="space-y-3">
              <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
              <Input
                value={processIntro[locale].eyebrow}
                onChange={(event) => updateIntroField(locale, 'eyebrow', event.target.value, setProcessIntro)}
                placeholder={locale === 'ar' ? 'العنوان الصغير' : 'Eyebrow'}
              />
              <Input
                value={processIntro[locale].title}
                onChange={(event) => updateIntroField(locale, 'title', event.target.value, setProcessIntro)}
                placeholder={locale === 'ar' ? 'العنوان الرئيسي' : 'Title'}
              />
              <Textarea
                value={processIntro[locale].subtitle}
                onChange={(event) => updateIntroField(locale, 'subtitle', event.target.value, setProcessIntro)}
                placeholder={locale === 'ar' ? 'النص الوصفي' : 'Subtitle'}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Process Steps</h2>
          <p className="text-sm text-muted">خطوات التنفيذ (العنوان + الوصف).</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`process-steps-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addCardItem(locale, setProcessSteps)}>
                  Add
                </button>
              </div>
              {processSteps[locale].map((item, index) => (
                <div
                  key={`process-${locale}-${index}`}
                  className="space-y-3 rounded-xl border border-white/10 p-3"
                  draggable
                  onDragStart={() => setDragItem({ list: 'process', locale, index })}
                  onDragOver={(event) => {
                    if (dragItem?.list === 'process' && dragItem.locale === locale) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (
                      dragItem?.list === 'process' &&
                      dragItem.locale === locale &&
                      dragItem.index !== index
                    ) {
                      reorderCardList(locale, dragItem.index, index, setProcessSteps);
                    }
                    setDragItem(null);
                  }}
                  onDragEnd={() => setDragItem(null)}
                >
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Drag</span>
                    <button
                      type="button"
                      className={smallButton}
                      onClick={() => removeCardItem(locale, index, setProcessSteps)}
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(event) => updateCardItem(locale, index, 'title', event.target.value, setProcessSteps)}
                    placeholder={locale === 'ar' ? 'العنوان' : 'Title'}
                  />
                  <Textarea
                    value={item.desc}
                    onChange={(event) => updateCardItem(locale, index, 'desc', event.target.value, setProcessSteps)}
                    placeholder={locale === 'ar' ? 'الوصف' : 'Description'}
                    rows={2}
                  />
                  <Select
                    value={item.icon ?? ''}
                    onChange={(event) => updateCardItem(locale, index, 'icon', event.target.value, setProcessSteps)}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <MediaUploader
                    label={locale === 'ar' ? 'صورة الخطوة (اختياري)' : 'Step image (optional)'}
                    value={item.media ?? undefined}
                    onChange={(media) => updateCardMedia(locale, index, media, setProcessSteps)}
                    accept="image/*"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Call To Action</h2>
          <p className="text-sm text-muted">نصوص قسم الدعوة للتواصل.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`cta-${locale}`} className="space-y-3">
              <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
              <Input
                value={cta[locale].eyebrow}
                onChange={(event) => updateCtaField(locale, 'eyebrow', event.target.value)}
                placeholder={locale === 'ar' ? 'العنوان الصغير' : 'Eyebrow'}
              />
              <Input
                value={cta[locale].title}
                onChange={(event) => updateCtaField(locale, 'title', event.target.value)}
                placeholder={locale === 'ar' ? 'العنوان الرئيسي' : 'Title'}
              />
              <Textarea
                value={cta[locale].subtitle}
                onChange={(event) => updateCtaField(locale, 'subtitle', event.target.value)}
                placeholder={locale === 'ar' ? 'النص الوصفي' : 'Subtitle'}
                rows={2}
              />
              <Input
                value={cta[locale].primaryLabel}
                onChange={(event) => updateCtaField(locale, 'primaryLabel', event.target.value)}
                placeholder={locale === 'ar' ? 'زر أساسي' : 'Primary label'}
              />
              <Input
                value={cta[locale].secondaryLabel}
                onChange={(event) => updateCtaField(locale, 'secondaryLabel', event.target.value)}
                placeholder={locale === 'ar' ? 'زر ثانوي' : 'Secondary label'}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Resources</h2>
          <p className="text-sm text-muted">ملفات وروابط ودروس تظهر في صفحة Resources.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`resources-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addResourceItem(locale, setResources)}>
                  Add
                </button>
              </div>
              {resources[locale].map((item, index) => (
                <div
                  key={`resource-${locale}-${index}`}
                  className="space-y-3 rounded-xl border border-white/10 p-3"
                  draggable
                  onDragStart={() => setDragItem({ list: 'resources', locale, index })}
                  onDragOver={(event) => {
                    if (dragItem?.list === 'resources' && dragItem.locale === locale) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (
                      dragItem?.list === 'resources' &&
                      dragItem.locale === locale &&
                      dragItem.index !== index
                    ) {
                      reorderResourceList(locale, dragItem.index, index, setResources);
                    }
                    setDragItem(null);
                  }}
                  onDragEnd={() => setDragItem(null)}
                >
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Drag</span>
                    <button
                      type="button"
                      className={smallButton}
                      onClick={() => removeResourceItem(locale, index, setResources)}
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(event) => updateResourceItem(locale, index, 'title', event.target.value, setResources)}
                    placeholder={locale === 'ar' ? 'العنوان' : 'Title'}
                  />
                  <Textarea
                    value={item.desc}
                    onChange={(event) => updateResourceItem(locale, index, 'desc', event.target.value, setResources)}
                    placeholder={locale === 'ar' ? 'الوصف' : 'Description'}
                    rows={2}
                  />
                  <Input
                    value={item.url}
                    onChange={(event) => updateResourceItem(locale, index, 'url', event.target.value, setResources)}
                    placeholder="https://"
                  />
                  <Select
                    value={item.type}
                    onChange={(event) => updateResourceItem(locale, index, 'type', event.target.value, setResources)}
                  >
                    {resourceTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    value={item.badge ?? ''}
                    onChange={(event) => updateResourceItem(locale, index, 'badge', event.target.value, setResources)}
                    placeholder={locale === 'ar' ? 'شارة اختيارية' : 'Optional badge'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Services</h2>
          <p className="text-sm text-muted">باقات الخدمات التي تظهر في صفحة Services.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['ar', 'en'] as const).map((locale) => (
            <div key={`services-${locale}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{locale === 'ar' ? 'Arabic' : 'English'}</h3>
                <button type="button" className={smallButton} onClick={() => addServicePlan(locale, setServices)}>
                  Add
                </button>
              </div>
              {services[locale].map((item, index) => (
                <div
                  key={`service-${locale}-${index}`}
                  className="space-y-3 rounded-xl border border-white/10 p-3"
                  draggable
                  onDragStart={() => setDragItem({ list: 'services', locale, index })}
                  onDragOver={(event) => {
                    if (dragItem?.list === 'services' && dragItem.locale === locale) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (
                      dragItem?.list === 'services' &&
                      dragItem.locale === locale &&
                      dragItem.index !== index
                    ) {
                      reorderServiceList(locale, dragItem.index, index, setServices);
                    }
                    setDragItem(null);
                  }}
                  onDragEnd={() => setDragItem(null)}
                >
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Drag</span>
                    <button
                      type="button"
                      className={smallButton}
                      onClick={() => removeServicePlan(locale, index, setServices)}
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={item.name}
                    onChange={(event) => updateServicePlan(locale, index, 'name', event.target.value, setServices)}
                    placeholder={locale === 'ar' ? 'اسم الباقة' : 'Plan name'}
                  />
                  <Input
                    value={item.price}
                    onChange={(event) => updateServicePlan(locale, index, 'price', event.target.value, setServices)}
                    placeholder={locale === 'ar' ? 'السعر' : 'Price'}
                  />
                  <Textarea
                    value={item.description}
                    onChange={(event) => updateServicePlan(locale, index, 'description', event.target.value, setServices)}
                    placeholder={locale === 'ar' ? 'وصف الباقة' : 'Plan description'}
                    rows={2}
                  />
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(item.highlight)}
                      onChange={(event) =>
                        updateServicePlan(locale, index, 'highlight', event.target.checked, setServices)
                      }
                    />
                    {locale === 'ar' ? 'إبراز الباقة' : 'Highlight plan'}
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{locale === 'ar' ? 'المميزات' : 'Features'}</span>
                      <button
                        type="button"
                        className={smallButton}
                        onClick={() => addServiceFeature(locale, index)}
                      >
                        Add
                      </button>
                    </div>
                    {(item.features ?? []).map((feature, featureIndex) => (
                      <div key={`feature-${locale}-${index}-${featureIndex}`} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(event) => updateServiceFeature(locale, index, featureIndex, event.target.value)}
                          placeholder={locale === 'ar' ? 'ميزة' : 'Feature'}
                        />
                        <button
                          type="button"
                          className={smallButton}
                          onClick={() => removeServiceFeature(locale, index, featureIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
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
