import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FormView } from "@/components/views/FormView";
import { ListView } from "@/components/views/ListView";
import { KanbanView } from "@/components/views/KanbanView";

interface Props {
  params: { workspace: string; appSlug: string };
  searchParams: { module?: string; view?: string };
}

export default async function PublishedAppPage({ params, searchParams }: Props) {
  const workspace = await prisma.workspace.findUnique({ where: { slug: params.workspace } });
  if (!workspace) notFound();

  const app = await prisma.app.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug: params.appSlug } },
    include: {
      modules: {
        include: {
          collections: {
            include: { fields: { orderBy: { order: "asc" } }, views: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!app) notFound();

  const branding = app.branding as Record<string, string>;
  const primaryColor = branding.primaryColor ?? "#6366f1";
  const boardTitle = branding.boardTitle || app.name;

  const firstModule = app.modules[0];
  const firstCollection = firstModule?.collections[0];

  const activeModuleId = searchParams.module ?? firstModule?.id;
  const activeModule = app.modules.find((m) => m.id === activeModuleId) ?? firstModule;
  const activeCollection = activeModule?.collections[0];

  const activeViewId = searchParams.view ?? activeCollection?.views[0]?.id;
  const activeView = activeCollection?.views.find((v) => v.id === activeViewId) ?? activeCollection?.views[0];

  let records: Awaited<ReturnType<typeof prisma.record.findMany>> = [];
  if (activeCollection && activeView?.type !== "FORM") {
    records = await prisma.record.findMany({
      where: { collectionId: activeCollection.id },
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
        _count: { select: { votes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ "--brand": primaryColor } as React.CSSProperties}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: primaryColor }}>{boardTitle}</h1>
          <nav className="flex items-center gap-1">
            {app.modules.map((mod) =>
              mod.collections[0]?.views.map((view) => (
                <Link
                  key={view.id}
                  href={`/app/${params.workspace}/${params.appSlug}?module=${mod.id}&view=${view.id}`}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeView?.id === view.id
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={activeView?.id === view.id ? { backgroundColor: primaryColor } : {}}
                >
                  {view.name}
                </Link>
              ))
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {activeView && activeCollection && (
          <>
            {activeView.type === "FORM" && (
              <div className="max-w-lg mx-auto pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 px-8">
                  {activeView.name}
                </h2>
                <FormView
                  fields={activeCollection.fields}
                  viewConfig={activeView.config as Record<string, unknown>}
                  collectionId={activeCollection.id}
                />
              </div>
            )}
            {activeView.type === "LIST" && (
              <ListView
                records={records as Parameters<typeof ListView>[0]["records"]}
                fields={activeCollection.fields}
                collectionId={activeCollection.id}
                isAdmin={false}
              />
            )}
            {activeView.type === "KANBAN" && (
              <KanbanView
                records={records as Parameters<typeof KanbanView>[0]["records"]}
                fields={activeCollection.fields}
                viewConfig={activeView.config as Record<string, unknown>}
                collectionId={activeCollection.id}
                isAdmin={false}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
