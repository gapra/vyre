import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CreateAppForm } from "@/components/builder/CreateAppForm";

export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) notFound();

  const [member, workspace] = await Promise.all([
    prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: params.workspaceId, userId } },
    }),
    prisma.workspace.findUnique({
      where: { id: params.workspaceId },
      include: { apps: { include: { _count: { select: { modules: true } } } } },
    }),
  ]);

  if (!member || !workspace) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-gray-600">Workspaces</Link>
            {" / "}
            <span>{workspace.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Apps</h1>
        </div>
        {(member.role === "OWNER" || member.role === "ADMIN") && (
          <CreateAppForm workspaceId={workspace.id} />
        )}
      </div>

      {workspace.apps.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No apps yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workspace.apps.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/${workspace.id}/apps/${app.id}`}
              className="card p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {app.name}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${app.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {app.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{app.slug}</p>
              <p className="text-sm text-gray-500 mt-3">{app._count.modules} modules</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
