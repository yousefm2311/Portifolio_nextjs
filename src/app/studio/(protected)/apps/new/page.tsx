import AppForm from '@/components/admin/AppForm';

export default function NewAppPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-white/60">Studio</p>
        <h1 className="text-2xl font-semibold">إنشاء تطبيق جديد</h1>
      </div>
      <AppForm mode="create" />
    </div>
  );
}
