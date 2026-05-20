"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateWorkspaceForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slug || autoSlug(name) }),
    });
    if (res.ok) {
      setOpen(false);
      setName(""); setSlug("");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error?.fieldErrors?.slug?.[0] ?? data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} className="btn-primary">New Workspace</button>;
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Create Workspace</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Workspace name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => { setName(e.target.value); if (!slug) setSlug(autoSlug(e.target.value)); }}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-inc"
              pattern="[a-z0-9-]+"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Used in URLs. Lowercase letters, numbers, and hyphens only.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
