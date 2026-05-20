import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAppSchema, slugify } from "@/lib/validation";

async function requireWorkspaceMember(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  return member;
}

export async function GET(
  _req: Request,
  { params }: { params: { workspaceId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await requireWorkspaceMember(params.workspaceId, session.user.id);
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const apps = await prisma.app.findMany({
    where: { workspaceId: params.workspaceId },
    include: { _count: { select: { modules: true, pages: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(apps);
}

export async function POST(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await requireWorkspaceMember(params.workspaceId, session.user.id);
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createAppSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { name, isPublic } = parsed.data;
  const slug = parsed.data.slug || slugify(name);

  const app = await prisma.app.create({
    data: {
      workspaceId: params.workspaceId,
      name,
      slug,
      isPublic,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
