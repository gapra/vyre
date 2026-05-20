"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  appId: string;
  moduleKey: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

export function ModuleInstaller({ appId, moduleKey, label, icon, isCustom }: Props) {
  const [loading, setLoading] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const router = useRouter();

  async function install(lbl?: string) {
    setLoading(true);
    const res = await fetch(`/api/apps/${appId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleKey, label: lbl ?? label, icon }),
    });
    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
  }

  if (isCustom && !showCustomForm) {
    return (
      <button
        onClick={() => setShowCustomForm(true)}
        className="card p-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all border-dashed border-2 border-gray-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">+</div>
          <div>
            <p className="font-medium text-gray-700 text-sm">{label}</p>
            <p className="text-xs text-gray-400">Create from scratch</p>
          </div>
        </div>
      </button>
    );
  }

  if (isCustom && showCustomForm) {
    return (
      <div className="card p-4 space-y-3">
        <p className="text-sm font-medium text-gray-900">Custom Module</p>
        <input
          className="input text-sm"
          placeholder="Module name (e.g. Feedback)"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={() => setShowCustomForm(false)} className="btn-ghost text-xs">Cancel</button>
          <button
            onClick={() => install(customLabel)}
            disabled={!customLabel.trim() || loading}
            className="btn-primary text-xs"
          >
            {loading ? "Creating…" : "Create Module"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => install()}
      disabled={loading}
      className="card p-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all w-full disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
          {label[0]}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-400">Prebuilt template</p>
        </div>
      </div>
    </button>
  );
}
