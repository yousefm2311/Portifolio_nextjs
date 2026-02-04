'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AppDTO } from '@/lib/types';

export default function AdminAppsTable({ initialApps }: { initialApps: AppDTO[] }) {
  const [apps, setApps] = useState(initialApps);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, action: 'publish' | 'unpublish') => {
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/studio/apps/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Failed to update status.');
      setBusyId(null);
      return;
    }
    setApps((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: action === 'publish' ? 'published' : 'draft' }
          : app
      )
    );
    setBusyId(null);
  };

  const deleteApp = async (id: string) => {
    const confirmed = window.confirm('Delete this app? This action cannot be undone.');
    if (!confirmed) return;
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/studio/apps/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Failed to delete.');
      setBusyId(null);
      return;
    }
    setApps((prev) => prev.filter((app) => app._id !== id));
    setBusyId(null);
  };

  if (!apps || apps.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-muted">
        No apps found yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>}
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
                    <Button variant="ghost" onClick={() => updateStatus(app._id, 'unpublish')} disabled={busyId === app._id}>
                      {busyId === app._id ? 'Saving...' : 'Unpublish'}
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={() => updateStatus(app._id, 'publish')} disabled={busyId === app._id}>
                      {busyId === app._id ? 'Saving...' : 'Publish'}
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => deleteApp(app._id)} disabled={busyId === app._id}>
                    {busyId === app._id ? 'Deleting...' : 'Delete'}
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
