import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const reservations = await prisma.reservationRequest.findMany({
    where: { restaurant: { ownerId: session.user.id } },
    include: { restaurant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const newCount = reservations.filter((r) => r.status === "NEW").length;

  return NextResponse.json({
    reservations: reservations.map((res) => ({
      id: res.id,
      guestName: res.guestName,
      guestPhone: res.guestPhone,
      restaurantName: res.restaurant.name,
      preferredAt: res.preferredAt.toISOString(),
      partySize: res.partySize,
      comment: res.comment,
      status: res.status,
    })),
    newCount,
  });
}
