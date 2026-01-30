import AppForm from '@/components/admin/AppForm';

export default function NewAppPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">إنشاء تطبيق جديد</h1>
      <AppForm mode="create" />
    </div>
  );
}
