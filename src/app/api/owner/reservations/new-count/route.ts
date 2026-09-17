import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.reservationRequest.count({
    where: { status: "NEW", restaurant: { ownerId: session.user.id } },
  });

  return NextResponse.json({ count });
}
