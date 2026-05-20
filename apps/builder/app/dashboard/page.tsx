import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CreateWorkspaceForm } from "@/components/builder/CreateWorkspaceForm";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const workspaces = await prisma.workspace.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: { where: { userId } },
      _count: { select: { apps: true, members: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-500 text-sm mt-1">Each workspace is a separate company or project</p>
        </div>
        <CreateWorkspaceForm />
      </div>

      {workspaces.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No workspaces yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/dashboard/${ws.id}`}
              className="card p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {ws.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{ws.slug}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {ws.members[0]?.role}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>{ws._count.apps} apps</span>
                <span>{ws._count.members} members</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
