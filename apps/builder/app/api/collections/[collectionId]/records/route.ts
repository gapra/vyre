import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRecordSchema } from "@/lib/validation";

export async function GET(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortDir = (searchParams.get("sortDir") ?? "desc") as "asc" | "desc";
  const filterField = searchParams.get("filterField");
  const filterValue = searchParams.get("filterValue");

  const records = await prisma.record.findMany({
    where: {
      collectionId: params.collectionId,
      ...(filterField && filterValue
        ? {
            values: {
              path: [filterField],
              equals: filterValue,
            },
          }
        : {}),
    },
    include: {
      createdBy: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
    },
    orderBy: sortBy === "votes"
      ? undefined
      : { [sortBy]: sortDir },
  });

  return NextResponse.json(records);
}

export async function POST(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  const session = await auth();

  const collection = await prisma.collection.findUnique({
    where: { id: params.collectionId },
    include: {
      module: {
        include: {
          app: { include: { workspace: { include: { members: true } } } },
        },
      },
    },
  });

  if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isPublic = collection.module.app.isPublic;
  if (!isPublic && !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createRecordSchema.safeParse({ ...body, collectionId: params.collectionId });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const record = await prisma.record.create({
    data: {
      collectionId: params.collectionId,
      createdById: session?.user?.id ?? null,
      values: parsed.data.values as Prisma.InputJsonValue,
    },
    include: {
      createdBy: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  return NextResponse.json(record, { status: 201 });
}
