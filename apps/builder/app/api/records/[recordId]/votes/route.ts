import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { recordId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.vote.findUnique({
    where: { recordId_userId: { recordId: params.recordId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
    return NextResponse.json({ voted: false });
  }

  await prisma.vote.create({
    data: { recordId: params.recordId, userId: session.user.id },
  });

  return NextResponse.json({ voted: true }, { status: 201 });
}
