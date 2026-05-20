import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FieldBuilder } from "@/components/builder/FieldBuilder";

interface Props {
  params: {
    workspaceId: string;
    appId: string;
    moduleId: string;
    collectionId: string;
  };
}

export default async function FieldsPage({ params }: Props) {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const collection = await prisma.collection.findUnique({
    where: { id: params.collectionId },
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
  });

  if (!collection || collection.module.app.workspaceId !== params.workspaceId) notFound();
  const member = collection.module.app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/dashboard/${params.workspaceId}/apps/${params.appId}`}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back to app
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Fields — {collection.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add, remove, or reorder fields. Changes apply to all views and forms.
        </p>
      </div>

      <FieldBuilder
        collectionId={params.collectionId}
        initialFields={collection.fields}
      />
    </div>
  );
}
