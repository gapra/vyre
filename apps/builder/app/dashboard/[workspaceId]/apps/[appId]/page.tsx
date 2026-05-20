import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ModuleInstaller } from "@/components/builder/ModuleInstaller";
import { PREBUILT_MODULES } from "@/lib/modules";

export default async function AppPage({ params }: { params: { workspaceId: string; appId: string } }) {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const app = await prisma.app.findUnique({
    where: { id: params.appId },
    include: {
      workspace: {
        include: { members: { where: { userId } } },
      },
      modules: {
        include: {
          collections: { include: { views: true, _count: { select: { records: true } } } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!app || app.workspaceId !== params.workspaceId) notFound();
  const member = app.workspace.members[0];
  if (!member) notFound();

  const isAdmin = member.role === "OWNER" || member.role === "ADMIN";
  const installedKeys = new Set(app.modules.map((m) => m.moduleKey));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-gray-600">Workspaces</Link>
            {" / "}
            <Link href={`/dashboard/${params.workspaceId}`} className="hover:text-gray-600">{app.workspace.name}</Link>
            {" / "}
            <span>{app.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/app/${app.workspace.slug ?? params.workspaceId}/${app.slug}`}
            target="_blank"
            className="btn-secondary text-xs"
          >
            View Published App
          </Link>
          {isAdmin && (
            <Link href={`/dashboard/${params.workspaceId}/apps/${params.appId}/settings`} className="btn-ghost text-xs">
              Settings
            </Link>
          )}
        </div>
      </div>

      {/* Installed modules */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
        {app.modules.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 text-sm">
            No modules installed yet. Add one below.
          </div>
        ) : (
          <div className="space-y-4">
            {app.modules.map((mod) => (
              <div key={mod.id} className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {mod.label[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mod.label}</h3>
                    <p className="text-xs text-gray-400">{mod.moduleKey}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mod.collections.map((col) =>
                    col.views.map((view) => (
                      <Link
                        key={view.id}
                        href={`/dashboard/${params.workspaceId}/apps/${params.appId}/modules/${mod.id}/collections/${col.id}/views/${view.id}`}
                        className="flex flex-col p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                      >
                        <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700">{col.name}</span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5">{view.name}</span>
                        <span className="text-xs text-gray-400 mt-1">{view.type}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add modules */}
      {isAdmin && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Module</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PREBUILT_MODULES.filter((m) => !installedKeys.has(m.key)).map((m) => (
              <ModuleInstaller key={m.key} appId={params.appId} moduleKey={m.key} label={m.label} icon={m.icon} />
            ))}
            <ModuleInstaller appId={params.appId} moduleKey="custom" label="Custom Module" icon="Plus" isCustom />
          </div>
        </section>
      )}
    </div>
  );
}
