import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createFieldSchema, slugify } from "@/lib/validation";

async function requireAdmin(collectionId: string, userId: string) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      module: {
        include: { app: { include: { workspace: { include: { members: { where: { userId } } } } } } },
      },
    },
  });
  if (!collection) return null;
  const member = collection.module.app.workspace.members[0];
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) return null;
  return collection;
}

export async function POST(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const collection = await requireAdmin(params.collectionId, session.user.id);
  if (!collection) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = createFieldSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const slug = slugify(parsed.data.name);
  const count = await prisma.field.count({ where: { collectionId: params.collectionId } });

  const field = await prisma.field.create({
    data: {
      collectionId: params.collectionId,
      name: parsed.data.name,
      slug,
      type: parsed.data.type,
      required: parsed.data.required,
      config: parsed.data.config as Prisma.InputJsonValue,
      order: count,
    },
  });

  return NextResponse.json(field, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const collection = await requireAdmin(params.collectionId, session.user.id);
  if (!collection) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { order } = await req.json() as { order: string[] };

  await prisma.$transaction(
    order.map((id, index) => prisma.field.update({ where: { id }, data: { order: index } }))
  );

  return NextResponse.json({ ok: true });
}
