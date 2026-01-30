'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Inputs';

export default function StudioLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    setLoading(false);

    if (result?.error) {
      setError('بيانات الدخول غير صحيحة أو غير مسموح.');
      return;
    }

    window.location.href = '/studio/apps';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-card">
        <h1 className="text-2xl font-semibold">تسجيل دخول المشرف</h1>
        <p className="mt-2 text-sm text-muted">للدخول إلى لوحة الإدارة المخفية.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            placeholder="كلمة المرور"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}
