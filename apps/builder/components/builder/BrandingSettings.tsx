"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  appId: string;
  initialBranding: Record<string, string>;
}

export function BrandingSettings({ appId, initialBranding }: Props) {
  const [primaryColor, setPrimaryColor] = useState(initialBranding.primaryColor ?? "#6366f1");
  const [boardTitle, setBoardTitle] = useState(initialBranding.boardTitle ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/apps/${appId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branding: { primaryColor, boardTitle } }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card p-6 space-y-5">
      <h2 className="text-base font-semibold text-gray-900">Branding</h2>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Board title</label>
          <input
            className="input"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            placeholder="My Company Feedback"
          />
        </div>
        <div>
          <label className="label">Primary color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5"
            />
            <input
              className="input w-36"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              pattern="#[0-9a-fA-F]{6}"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
