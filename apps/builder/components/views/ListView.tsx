"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field, Record as PrismaRecord } from "@prisma/client";

interface RecordWithMeta extends PrismaRecord {
  createdBy: { id: string; name: string | null; image: string | null } | null;
  _count: { votes: number; comments: number };
}

interface Props {
  records: RecordWithMeta[];
  fields: Field[];
  collectionId: string;
  isAdmin: boolean;
}

function getStatusOptions(fields: Field[]) {
  const statusField = fields.find((f) => f.slug === "status");
  if (!statusField) return [];
  const config = statusField.config as { options?: { value: string; label: string; color: string }[] };
  return config.options ?? [];
}

export function ListView({ records, fields, collectionId, isAdmin }: Props) {
  const [localRecords, setLocalRecords] = useState(records);
  const router = useRouter();
  const statusOptions = getStatusOptions(fields);

  async function updateStatus(recordId: string, status: string) {
    const record = localRecords.find((r) => r.id === recordId);
    if (!record) return;
    setLocalRecords((prev) =>
      prev.map((r) => r.id === recordId ? { ...r, values: { ...(r.values as object), status } } : r)
    );
    await fetch(`/api/records/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { ...(record.values as object), status } }),
    });
  }

  if (localRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No records yet
      </div>
    );
  }

  const titleField = fields.find((f) => f.slug === "title");
  const descField = fields.find((f) => f.slug === "description");

  return (
    <div className="p-6 space-y-3 max-w-3xl mx-auto">
      {localRecords.map((record) => {
        const values = record.values as Record<string, unknown>;
        const status = values.status as string | undefined;
        const statusOpt = statusOptions.find((o) => o.value === status);

        return (
          <div key={record.id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {titleField ? String(values[titleField.slug] ?? "Untitled") : "Record"}
                </h3>
                {descField && !!values[descField.slug] && (
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {String(values[descField.slug])}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && statusOptions.length > 0 ? (
                  <select
                    value={status ?? ""}
                    onChange={(e) => updateStatus(record.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    style={{ color: statusOpt?.color }}
                  >
                    {statusOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : statusOpt ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${statusOpt.color}20`, color: statusOpt.color }}
                  >
                    {statusOpt.label}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span>{record._count.votes} votes</span>
              <span>{record._count.comments} comments</span>
              <span>{new Date(record.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
