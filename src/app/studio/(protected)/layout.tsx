import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import { requireAdminSession } from '@/lib/auth-helpers';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session) {
    redirect('/studio/login');
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
