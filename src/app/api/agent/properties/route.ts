import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json([], { status: 401 });
  }

  const properties = await prisma.property.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties);
}