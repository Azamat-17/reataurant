import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const reservation = await prisma.reservationRequest.findUnique({
    where: { id },
    include: { restaurant: { select: { ownerId: true } } },
  });
  if (!reservation) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }
  if (reservation.restaurant.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  await prisma.reservationRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
