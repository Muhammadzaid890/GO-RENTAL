import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, phone: true, role: true },
  });

  return NextResponse.json(user || {});
}