import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(fieldId: string, userId: string) {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: {
      collection: {
        include: {
          module: {
            include: { app: { include: { workspace: { include: { members: { where: { userId } } } } } } },
          },
        },
      },
    },
  });
  if (!field) return null;
  const member = field.collection.module.app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) return null;
  return field;
}

export async function PATCH(
  req: Request,
  { params }: { params: { fieldId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const field = await requireAdmin(params.fieldId, session.user.id);
  if (!field) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as { name?: string; required?: boolean; config?: Record<string, unknown> };

  const updated = await prisma.field.update({
    where: { id: params.fieldId },
    data: {
      ...(body.name ? { name: body.name } : {}),
      ...(body.required !== undefined ? { required: body.required } : {}),
      ...(body.config ? { config: body.config as Prisma.InputJsonValue } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { fieldId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const field = await requireAdmin(params.fieldId, session.user.id);
  if (!field) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.field.delete({ where: { id: params.fieldId } });
  return NextResponse.json({ ok: true });
}
