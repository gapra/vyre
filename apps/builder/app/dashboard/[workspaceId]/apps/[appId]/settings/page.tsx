import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BrandingSettings } from "@/components/builder/BrandingSettings";
import { PermissionSettings } from "@/components/builder/PermissionSettings";

export default async function AppSettingsPage({ params }: { params: { workspaceId: string; appId: string } }) {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const app = await prisma.app.findUnique({
    where: { id: params.appId },
    include: {
      workspace: { include: { members: { where: { userId } } } },
    },
  });

  if (!app || app.workspaceId !== params.workspaceId) notFound();
  const member = app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <div className="text-sm text-gray-400 mb-1">
          <Link href={`/dashboard/${params.workspaceId}/apps/${params.appId}`} className="hover:text-gray-600">
            ← Back to {app.name}
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">App Settings</h1>
      </div>

      <BrandingSettings appId={params.appId} initialBranding={app.branding as Record<string, string>} />
      <PermissionSettings appId={params.appId} isPublic={app.isPublic} />
    </div>
  );
}
