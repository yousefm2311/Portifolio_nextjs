'use client';

import Card from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Inputs';
import Button from '@/components/ui/Button';
import { useLocale } from '@/components/LocaleProvider';

export default function ContactContent() {
  const { locale } = useLocale();
  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold">{locale === 'ar' ? 'تواصل معي' : 'Contact Me'}</h1>
        <p className="text-muted">
          {locale === 'ar'
            ? 'للتعاون أو المشاريع الجديدة، راسلني مباشرة.'
            : 'For collaborations or new projects, reach out directly.'}
        </p>
      </div>
      <Card className="max-w-2xl">
        <form className="space-y-4">
          <Input placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full name'} />
          <Input placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'} type="email" />
          <Textarea placeholder={locale === 'ar' ? 'رسالتك' : 'Your message'} rows={5} />
          <Button type="button">{locale === 'ar' ? 'إرسال رسالة' : 'Send Message'}</Button>
        </form>
      </Card>
    </>
  );
}
