import AdminHeader from '@/components/admin/AdminHeader';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
