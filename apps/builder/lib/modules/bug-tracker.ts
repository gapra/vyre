import type { FieldType, ViewType } from "@prisma/client";

export const bugTrackerModule = {
  key: "bug-tracker",
  label: "Bug Tracker",
  icon: "Bug",
  collections: [
    {
      name: "Bugs",
      slug: "bugs",
      fields: [
        { name: "Title", slug: "title", type: "TEXT" as FieldType, required: true, config: {}, order: 0 },
        { name: "Steps to Reproduce", slug: "steps", type: "TEXTAREA" as FieldType, required: false, config: {}, order: 1 },
        {
          name: "Status",
          slug: "status",
          type: "SELECT" as FieldType,
          required: true,
          config: {
            options: [
              { value: "open", label: "Open", color: "#EF4444" },
              { value: "in-progress", label: "In Progress", color: "#F59E0B" },
              { value: "resolved", label: "Resolved", color: "#10B981" },
              { value: "wont-fix", label: "Won't Fix", color: "#6B7280" },
            ],
            defaultValue: "open",
          },
          order: 2,
        },
        {
          name: "Severity",
          slug: "severity",
          type: "SELECT" as FieldType,
          required: false,
          config: {
            options: [
              { value: "low", label: "Low", color: "#6B7280" },
              { value: "medium", label: "Medium", color: "#F59E0B" },
              { value: "high", label: "High", color: "#EF4444" },
              { value: "critical", label: "Critical", color: "#7C3AED" },
            ],
          },
          order: 3,
        },
      ],
      views: [
        { name: "Board", type: "KANBAN" as ViewType, config: { groupBy: "status" } },
        { name: "All Bugs", type: "LIST" as ViewType, config: { sortBy: "createdAt", sortDir: "desc" } },
        { name: "Report Bug", type: "FORM" as ViewType, config: { visibleFields: ["title", "steps", "severity"] } },
      ],
    },
  ],
};
