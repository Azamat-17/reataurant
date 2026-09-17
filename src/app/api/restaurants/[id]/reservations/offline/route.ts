import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reservationSchema } from "@/lib/validations/reservation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id }, select: { ownerId: true } });
  if (!restaurant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }
  if (restaurant.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = reservationSchema.safeParse({ ...body, restaurantId: id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const data = parsed.data;
  const reservation = await prisma.reservationRequest.create({
    data: {
      restaurantId: id,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      partySize: data.partySize,
      preferredAt: new Date(data.preferredAt),
      comment: data.comment,
      status: "CONFIRMED",
    },
  });

  return NextResponse.json({ id: reservation.id });
}
