import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactContent from '@/components/ContactContent';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 space-y-10">
        <ContactContent />
      </main>
      <SiteFooter />
    </div>
  );
}
