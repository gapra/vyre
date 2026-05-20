import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(appId: string, userId: string) {
  const app = await prisma.app.findUnique({
    where: { id: appId },
    include: { workspace: { include: { members: { where: { userId } } } } },
  });
  if (!app) return null;
  const member = app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) return null;
  return app;
}

export async function PATCH(
  req: Request,
  { params }: { params: { appId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const app = await requireAdmin(params.appId, session.user.id);
  if (!app) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    branding?: Record<string, string>;
    isPublic?: boolean;
    name?: string;
  };

  const updated = await prisma.app.update({
    where: { id: params.appId },
    data: {
      ...(body.name ? { name: body.name } : {}),
      ...(body.isPublic !== undefined ? { isPublic: body.isPublic } : {}),
      ...(body.branding
        ? { branding: { ...(app.branding as object), ...body.branding } }
        : {}),
    },
  });

  return NextResponse.json(updated);
}
