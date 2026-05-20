"use client";

import { useState } from "react";
import type { Field, Record as PrismaRecord } from "@prisma/client";

interface RecordWithMeta extends PrismaRecord {
  createdBy: { id: string; name: string | null; image: string | null } | null;
  _count: { votes: number; comments: number };
}

interface Props {
  records: RecordWithMeta[];
  fields: Field[];
  viewConfig: Record<string, unknown>;
  collectionId: string;
  isAdmin: boolean;
}

function getGroupField(fields: Field[], groupBy: string) {
  return fields.find((f) => f.slug === groupBy);
}

export function KanbanView({ records, fields, viewConfig, isAdmin }: Props) {
  const [localRecords, setLocalRecords] = useState(records);
  const groupBySlug = (viewConfig.groupBy as string) ?? "status";
  const groupField = getGroupField(fields, groupBySlug);
  const titleField = fields.find((f) => f.slug === "title");

  const config = groupField?.config as { options?: { value: string; label: string; color: string }[] } | undefined;
  const columns = config?.options ?? [];

  const grouped = columns.reduce<Record<string, RecordWithMeta[]>>((acc, col) => {
    acc[col.value] = localRecords.filter((r) => {
      const values = r.values as Record<string, unknown>;
      return values[groupBySlug] === col.value;
    });
    return acc;
  }, {});

  const uncategorized = localRecords.filter((r) => {
    const values = r.values as Record<string, unknown>;
    return !columns.some((c) => c.value === values[groupBySlug]);
  });

  async function moveCard(recordId: string, newGroup: string) {
    const record = localRecords.find((r) => r.id === recordId);
    if (!record) return;

    setLocalRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, values: { ...(r.values as object), [groupBySlug]: newGroup } }
          : r
      )
    );

    await fetch(`/api/records/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { ...(record.values as object), [groupBySlug]: newGroup } }),
    });
  }

  return (
    <div className="flex gap-4 p-6 overflow-x-auto h-full">
      {columns.map((col) => (
        <KanbanColumn
          key={col.value}
          column={col}
          records={grouped[col.value] ?? []}
          titleField={titleField}
          isAdmin={isAdmin}
          onMove={moveCard}
          allColumns={columns}
          groupBySlug={groupBySlug}
        />
      ))}
      {uncategorized.length > 0 && (
        <KanbanColumn
          column={{ value: "__none__", label: "Uncategorized", color: "#6B7280" }}
          records={uncategorized}
          titleField={titleField}
          isAdmin={isAdmin}
          onMove={moveCard}
          allColumns={columns}
          groupBySlug={groupBySlug}
        />
      )}
    </div>
  );
}

function KanbanColumn({
  column,
  records,
  titleField,
  isAdmin,
  onMove,
  allColumns,
  groupBySlug,
}: {
  column: { value: string; label: string; color: string };
  records: RecordWithMeta[];
  titleField: Field | undefined;
  isAdmin: boolean;
  onMove: (id: string, group: string) => void;
  allColumns: { value: string; label: string; color: string }[];
  groupBySlug: string;
}) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="text-sm font-semibold text-gray-700">{column.label}</h3>
        <span className="text-xs text-gray-400 ml-auto">{records.length}</span>
      </div>
      <div className="space-y-2">
        {records.map((record) => {
          const values = record.values as Record<string, unknown>;
          return (
            <div key={record.id} className="card p-3 cursor-default">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {titleField ? String(values[titleField.slug] ?? "Untitled") : "Record"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">{record._count.votes} votes</span>
                {isAdmin && (
                  <select
                    value={String(values[groupBySlug] ?? "")}
                    onChange={(e) => onMove(record.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {allColumns.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
