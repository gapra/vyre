import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KanbanView } from "@/components/views/KanbanView";
import { ListView } from "@/components/views/ListView";
import { FormView } from "@/components/views/FormView";
import { FieldBuilderPanel } from "@/components/builder/FieldBuilderPanel";

interface Props {
  params: {
    workspaceId: string;
    appId: string;
    moduleId: string;
    collectionId: string;
    viewId: string;
  };
}

export default async function ViewPage({ params }: Props) {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const view = await prisma.view.findUnique({
    where: { id: params.viewId },
    include: {
      collection: {
        include: {
          fields: { orderBy: { order: "asc" } },
          module: {
            include: {
              app: {
                include: {
                  workspace: { include: { members: { where: { userId } } } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!view || view.collection.module.app.workspaceId !== params.workspaceId) notFound();

  const member = view.collection.module.app.workspace.members[0];
  if (!member) notFound();

  const isAdmin = member.role === "OWNER" || member.role === "ADMIN";
  const { collection } = view;
  const app = collection.module.app;

  const records = await prisma.record.findMany({
    where: { collectionId: params.collectionId },
    include: {
      createdBy: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/dashboard/${params.workspaceId}/apps/${params.appId}`} className="hover:text-gray-700">
            {app.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900">{collection.name}</span>
          <span>/</span>
          <span className="font-medium text-indigo-600">{view.name}</span>
        </div>
        {isAdmin && (
          <Link
            href={`/dashboard/${params.workspaceId}/apps/${params.appId}/modules/${params.moduleId}/collections/${params.collectionId}/fields`}
            className="btn-ghost text-xs"
          >
            Manage Fields
          </Link>
        )}
      </div>

      {/* View content */}
      <div className="flex-1 overflow-auto">
        {view.type === "KANBAN" && (
          <KanbanView
            records={records}
            fields={collection.fields}
            viewConfig={view.config as Record<string, unknown>}
            collectionId={params.collectionId}
            isAdmin={isAdmin}
          />
        )}
        {view.type === "LIST" && (
          <ListView
            records={records}
            fields={collection.fields}
            collectionId={params.collectionId}
            isAdmin={isAdmin}
          />
        )}
        {view.type === "FORM" && (
          <FormView
            fields={collection.fields}
            viewConfig={view.config as Record<string, unknown>}
            collectionId={params.collectionId}
          />
        )}
      </div>
    </div>
  );
}
