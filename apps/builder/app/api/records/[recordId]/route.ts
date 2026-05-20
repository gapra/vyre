import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { recordId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await prisma.record.findUnique({
    where: { id: params.recordId },
    include: {
      collection: {
        include: {
          module: {
            include: {
              app: {
                include: { workspace: { include: { members: { where: { userId: session.user.id } } } } },
              },
            },
          },
        },
      },
    },
  });

  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = record.collection.module.app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { values } = await req.json() as { values: Record<string, unknown> };

  const updated = await prisma.record.update({
    where: { id: params.recordId },
    data: { values: { ...(record.values as object), ...values } as Prisma.InputJsonValue },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { recordId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await prisma.record.findUnique({
    where: { id: params.recordId },
    include: {
      collection: {
        include: {
          module: {
            include: {
              app: {
                include: { workspace: { include: { members: { where: { userId: session.user.id } } } } },
              },
            },
          },
        },
      },
    },
  });

  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const member = record.collection.module.app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.record.delete({ where: { id: params.recordId } });
  return NextResponse.json({ ok: true });
}
