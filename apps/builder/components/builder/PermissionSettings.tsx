"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  appId: string;
  isPublic: boolean;
}

export function PermissionSettings({ appId, isPublic }: Props) {
  const [pub, setPub] = useState(isPublic);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function toggle() {
    setSaving(true);
    await fetch(`/api/apps/${appId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !pub }),
    });
    setPub((p) => !p);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Permissions</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Public access</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {pub
              ? "Anyone can submit and vote — no login required"
              : "Only invited members can submit and vote"}
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${pub ? "bg-indigo-600" : "bg-gray-200"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${pub ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
}
