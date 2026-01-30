'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AppDTO } from '@/lib/types';

export default function AdminAppsTable({ initialApps }: { initialApps: AppDTO[] }) {
  const [apps, setApps] = useState(initialApps);

  const updateStatus = async (id: string, action: 'publish' | 'unpublish') => {
    await fetch(`/api/studio/apps/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    setApps((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: action === 'publish' ? 'published' : 'draft' }
          : app
      )
    );
  };

  const deleteApp = async (id: string) => {
    await fetch(`/api/studio/apps/${id}`, { method: 'DELETE' });
    setApps((prev) => prev.filter((app) => app._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/studio/apps/new">
          <Button>+ New App</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 text-right">العنوان</th>
              <th className="px-4 py-3 text-right">Slug</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right">أوامر</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app._id} className="border-t border-white/10">
                <td className="px-4 py-3">{app.title}</td>
                <td className="px-4 py-3 text-white/60">{app.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      app.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex flex-wrap gap-2">
                  <Link href={`/studio/apps/${app._id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  {app.status === 'published' ? (
                    <Button variant="ghost" onClick={() => updateStatus(app._id, 'unpublish')}>
                      Unpublish
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={() => updateStatus(app._id, 'publish')}>
                      Publish
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => deleteApp(app._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
