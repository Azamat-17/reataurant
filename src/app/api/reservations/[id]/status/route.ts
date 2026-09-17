import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const VALID_STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "REJECTED"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const body = await request.json();
  const status = body.status as string;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }

  const updated = await prisma.reservationRequest.update({ where: { id }, data: { status } });
  return NextResponse.json({ reservation: updated });
}
