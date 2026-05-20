"use client";

import { useState } from "react";
import type { Field } from "@prisma/client";

interface Props {
  fields: Field[];
  viewConfig: Record<string, unknown>;
  collectionId: string;
}

export function FormView({ fields, viewConfig, collectionId }: Props) {
  const visibleSlugs = (viewConfig.visibleFields as string[] | undefined) ?? fields.map((f) => f.slug);
  const visibleFields = fields.filter((f) => visibleSlugs.includes(f.slug));

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function setValue(slug: string, value: unknown) {
    setValues((prev) => ({ ...prev, [slug]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/collections/${collectionId}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionId, values }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-semibold text-gray-900">Submitted!</h2>
        <p className="text-gray-500 text-sm">Thank you for your submission. We'll review it soon.</p>
        <button onClick={() => { setSubmitted(false); setValues({}); }} className="btn-secondary text-sm">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <form onSubmit={submit} className="space-y-5">
        {visibleFields.map((field) => (
          <FieldInput key={field.id} field={field} value={values[field.slug]} onChange={(v) => setValue(field.slug, v)} />
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const config = field.config as { options?: { value: string; label: string }[] };

  return (
    <div>
      <label className="label">
        {field.name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === "TEXT" && (
        <input className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={field.required} />
      )}
      {field.type === "TEXTAREA" && (
        <textarea
          className="input min-h-24 resize-y"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
        />
      )}
      {field.type === "NUMBER" && (
        <input type="number" className="input" value={String(value ?? "")} onChange={(e) => onChange(Number(e.target.value))} required={field.required} />
      )}
      {field.type === "SELECT" && (
        <select className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={field.required}>
          <option value="">Select an option</option>
          {config.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {field.type === "CHECKBOX" && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="rounded border-gray-300" />
          <span className="text-sm text-gray-700">Yes</span>
        </label>
      )}
      {field.type === "DATE" && (
        <input type="date" className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={field.required} />
      )}
    </div>
  );
}
