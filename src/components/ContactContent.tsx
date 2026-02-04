'use client';

import Card from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Inputs';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';
import type { FormEvent } from 'react';
import { useState } from 'react';

export default function ContactContent() {
  const { locale, t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (trimmedName.length < 2) {
      return locale === 'ar'
        ? 'الاسم لازم يكون حرفين على الأقل.'
        : 'Name must be at least 2 characters.';
    }
    if (!emailOk) {
      return locale === 'ar'
        ? 'اكتب بريد إلكتروني صحيح.'
        : 'Please enter a valid email address.';
    }
    if (trimmedMessage.length < 10) {
      return locale === 'ar'
        ? 'الرسالة لازم تكون 10 حروف على الأقل.'
        : 'Message must be at least 10 characters.';
    }
    return null;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const validationError = validate();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }
    setSending(true);
    setStatus(null);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    setSending(false);
    if (res.ok) {
      setStatus({
        type: 'success',
        message: locale === 'ar' ? 'تم إرسال الرسالة بنجاح.' : 'Message sent successfully.'
      });
      setName('');
      setEmail('');
      setMessage('');
    } else {
      const data = await res.json().catch(() => ({}));
      const rawError = typeof data?.error === 'string' ? data.error : null;
      const message =
        rawError === 'Email provider is not configured.'
          ? locale === 'ar'
            ? 'خدمة البريد غير مفعلة بعد. أضف إعدادات SMTP.'
            : 'Email provider is not configured. Please add SMTP settings.'
          : locale === 'ar'
            ? 'تعذر إرسال الرسالة. حاول مرة أخرى.'
            : 'Unable to send message. Please try again.';
      setStatus({ type: 'error', message });
    }
  };
  return (
    <>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {locale === 'ar' ? 'تواصل' : 'Contact'}
        </p>
        <h1 className="text-3xl font-semibold">{t('contactTitle')}</h1>
        <p className="text-muted">{t('contactSubtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Card className="glass-soft">
            <h2 className="text-lg font-semibold">
              {locale === 'ar' ? 'خطوات سريعة' : 'Quick steps'}
            </h2>
            <div className="mt-3 space-y-3 text-sm text-muted">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                {locale === 'ar'
                  ? 'ابعت فكرة المشروع أو نموذج أولي بسيط.'
                  : 'Send a project brief or a lightweight prototype.'}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                {locale === 'ar'
                  ? 'هنتفق على النطاق والجدول الزمني سريعًا.'
                  : 'We align quickly on scope and timelines.'}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                {locale === 'ar'
                  ? 'تبدأ التنفيذ مع تحديثات واضحة أولاً بأول.'
                  : 'Execution starts with clear, weekly updates.'}
              </div>
            </div>
          </Card>
          <Card className="glass-soft">
            <h2 className="text-lg font-semibold">
              {locale === 'ar' ? 'وقت الرد' : 'Response time'}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {locale === 'ar'
                ? 'عادةً برد خلال 24 ساعة في أيام العمل.'
                : 'I usually reply within 24 hours on business days.'}
            </p>
          </Card>
        </div>

        <Card className="glass-soft max-w-2xl">
          <form className="space-y-4" onSubmit={submit}>
            <Input
              placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full name'}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Textarea
              placeholder={locale === 'ar' ? 'رسالتك' : 'Your message'}
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
            <Button type="submit" disabled={sending}>
              {sending ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t('sendMessage')}
            </Button>
            {status && (
              <p
                className={`text-xs ${
                  status.type === 'success' ? 'text-emerald-200' : 'text-red-200'
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </Card>
      </div>
    </>
  );
}
