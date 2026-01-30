'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { MediaDTO } from '@/lib/types';

export default function AdminSettingsForm({
  initialCv
}: {
  initialCv?: MediaDTO | null;
}) {
  const [cvMedia, setCvMedia] = useState<MediaDTO | null>(initialCv ?? null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setStatus(null);

    const res = await fetch('/api/studio/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvMediaId: cvMedia?._id ?? null })
    });

    setSaving(false);
    if (res.ok) {
      setStatus('تم حفظ إعدادات السيرة الذاتية.');
    } else {
      setStatus('تعذر الحفظ.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-lg font-semibold">السيرة الذاتية (PDF)</h2>
        <p className="text-sm text-muted">ارفع ملف PDF ليظهر في الموقع للزوار.</p>
        <MediaUploader
          label="CV PDF"
          value={cvMedia ?? undefined}
          onChange={(media) => setCvMedia(media)}
          accept="application/pdf"
        />
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        {status && <p className="text-xs text-muted">{status}</p>}
      </div>
    </div>
  );
}
