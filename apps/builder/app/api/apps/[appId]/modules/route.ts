import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrebuiltModule } from "@/lib/modules";

export async function GET(
  _req: Request,
  { params }: { params: { appId: string } }
) {
  const modules = await prisma.appModule.findMany({
    where: { appId: params.appId },
    include: { collections: { include: { views: true, _count: { select: { records: true } } } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(modules);
}

export async function POST(
  req: Request,
  { params }: { params: { appId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { moduleKey, label, icon } = body as { moduleKey: string; label?: string; icon?: string };

  const app = await prisma.app.findUnique({
    where: { id: params.appId },
    include: { workspace: { include: { members: true } } },
  });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const isMember = app.workspace.members.some(
    (m) => m.userId === session.user!.id && (m.role === "OWNER" || m.role === "ADMIN")
  );
  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const prebuilt = getPrebuiltModule(moduleKey);
  const count = await prisma.appModule.count({ where: { appId: params.appId } });

  const appModule = await prisma.appModule.create({
    data: {
      appId: params.appId,
      moduleKey,
      label: label ?? prebuilt?.label ?? moduleKey,
      icon: icon ?? prebuilt?.icon ?? "Box",
      order: count,
      ...(prebuilt
        ? {
            collections: {
              create: prebuilt.collections.map((col) => ({
                name: col.name,
                slug: col.slug,
                fields: {
                  create: col.fields.map((f) => ({
                    name: f.name,
                    slug: f.slug,
                    type: f.type,
                    required: f.required,
                    config: f.config,
                    order: f.order,
                  })),
                },
                views: {
                  create: col.views.map((v) => ({
                    name: v.name,
                    type: v.type,
                    config: v.config,
                  })),
                },
              })),
            },
          }
        : {}),
    },
    include: { collections: { include: { views: true } } },
  });

  return NextResponse.json(appModule, { status: 201 });
}
