"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@prisma/client";

const FIELD_TYPES = [
  { value: "TEXT", label: "Text" },
  { value: "TEXTAREA", label: "Long Text" },
  { value: "NUMBER", label: "Number" },
  { value: "SELECT", label: "Select" },
  { value: "MULTI_SELECT", label: "Multi Select" },
  { value: "DATE", label: "Date" },
  { value: "CHECKBOX", label: "Checkbox" },
];

interface Props {
  collectionId: string;
  initialFields: Field[];
}

export function FieldBuilder({ collectionId, initialFields }: Props) {
  const [fields, setFields] = useState(initialFields);
  const [adding, setAdding] = useState(false);
  const [newField, setNewField] = useState({ name: "", type: "TEXT", required: false, options: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function addField(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const config =
      (newField.type === "SELECT" || newField.type === "MULTI_SELECT") && newField.options
        ? {
            options: newField.options.split(",").map((o) => ({
              value: o.trim().toLowerCase().replace(/\s+/g, "-"),
              label: o.trim(),
              color: "#6B7280",
            })),
          }
        : {};

    const res = await fetch(`/api/collections/${collectionId}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newField.name, type: newField.type, required: newField.required, config }),
    });
    if (res.ok) {
      const field = await res.json();
      setFields((prev) => [...prev, field]);
      setNewField({ name: "", type: "TEXT", required: false, options: "" });
      setAdding(false);
    }
    setLoading(false);
  }

  async function deleteField(fieldId: string) {
    const res = await fetch(`/api/fields/${fieldId}`, { method: "DELETE" });
    if (res.ok) {
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing fields */}
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{field.name}</p>
                <p className="text-xs text-gray-400">{field.type}{field.required ? " · Required" : ""}</p>
              </div>
            </div>
            <button
              onClick={() => deleteField(field.id)}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add field form */}
      {adding ? (
        <form onSubmit={addField} className="card p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">New Field</p>
          <div>
            <label className="label">Field name</label>
            <input
              className="input"
              value={newField.name}
              onChange={(e) => setNewField((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Platform, Priority"
              required
            />
          </div>
          <div>
            <label className="label">Field type</label>
            <select
              className="input"
              value={newField.type}
              onChange={(e) => setNewField((p) => ({ ...p, type: e.target.value }))}
            >
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {(newField.type === "SELECT" || newField.type === "MULTI_SELECT") && (
            <div>
              <label className="label">Options (comma separated)</label>
              <input
                className="input"
                value={newField.options}
                onChange={(e) => setNewField((p) => ({ ...p, options: e.target.value }))}
                placeholder="iOS, Android, Web"
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField((p) => ({ ...p, required: e.target.checked }))}
              className="rounded border-gray-300"
            />
            Required field
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary text-sm">
              {loading ? "Adding…" : "Add Field"}
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full">
          + Add Field
        </button>
      )}
    </div>
  );
}
