'use client';

import { useLocale } from '@/components/LocaleProvider';
import type { LocalizedServices } from '@/lib/types';

export default function ServicesView({ services }: { services?: LocalizedServices | null }) {
  const { locale } = useLocale();
  const list = services?.[locale]?.filter((item) => item.name && item.price) ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'الخدمات' : 'Services'}
        </p>
        <h1 className="text-3xl font-semibold">
          {locale === 'ar' ? 'باقات عمل مرنة حسب الاحتياج' : 'Flexible service packages'}
        </h1>
        <p className="text-muted">
          {locale === 'ar'
            ? 'اختر الباقة المناسبة أو تواصل لتفصيل عرض مخصص.'
            : 'Pick a plan or request a custom quote.'}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="glass-soft rounded-2xl p-6 text-sm text-muted">
          {locale === 'ar' ? 'لا توجد باقات حالياً.' : 'No service plans yet.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((plan, index) => (
            <div
              key={`${plan.name}-${index}`}
              className={`glass-soft rounded-2xl p-6 space-y-4 transition hover:-translate-y-1 ${
                plan.highlight ? 'border border-accent-400/40 shadow-glow' : 'border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.highlight && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {locale === 'ar' ? 'مميز' : 'Popular'}
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold text-gradient">{plan.price}</div>
              <p className="text-sm text-muted">{plan.description}</p>
              <div className="space-y-2 text-sm text-white/70">
                {(plan.features ?? []).map((feature, featureIndex) => (
                  <div key={`${plan.name}-feature-${featureIndex}`} className="rounded-xl bg-white/5 px-3 py-2">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
