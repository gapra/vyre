import type { FieldType, ViewType } from "@prisma/client";

export const featureRequestsModule = {
  key: "feature-requests",
  label: "Feature Requests",
  icon: "Lightbulb",
  collections: [
    {
      name: "Requests",
      slug: "requests",
      fields: [
        { name: "Title", slug: "title", type: "TEXT" as FieldType, required: true, config: {}, order: 0 },
        { name: "Description", slug: "description", type: "TEXTAREA" as FieldType, required: false, config: {}, order: 1 },
        {
          name: "Status",
          slug: "status",
          type: "SELECT" as FieldType,
          required: true,
          config: {
            options: [
              { value: "under-review", label: "Under Review", color: "#6B7280" },
              { value: "planned", label: "Planned", color: "#3B82F6" },
              { value: "in-progress", label: "In Progress", color: "#F59E0B" },
              { value: "done", label: "Done", color: "#10B981" },
              { value: "declined", label: "Declined", color: "#EF4444" },
            ],
            defaultValue: "under-review",
          },
          order: 2,
        },
        {
          name: "Priority",
          slug: "priority",
          type: "SELECT" as FieldType,
          required: false,
          config: {
            options: [
              { value: "low", label: "Low", color: "#6B7280" },
              { value: "medium", label: "Medium", color: "#F59E0B" },
              { value: "high", label: "High", color: "#EF4444" },
            ],
          },
          order: 3,
        },
      ],
      views: [
        { name: "Board", type: "KANBAN" as ViewType, config: { groupBy: "status" } },
        { name: "All Requests", type: "LIST" as ViewType, config: { sortBy: "createdAt", sortDir: "desc" } },
        { name: "Submit Form", type: "FORM" as ViewType, config: { visibleFields: ["title", "description", "priority"] } },
      ],
    },
  ],
};
