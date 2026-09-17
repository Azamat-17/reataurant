import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reservationSchema } from "@/lib/validations/reservation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const session = await auth();
  const data = parsed.data;

  const preferredAt = new Date(data.preferredAt);
  const dayStart = new Date(preferredAt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(preferredAt);
  dayEnd.setHours(23, 59, 59, 999);

  const alreadyBooked = await prisma.reservationRequest.findFirst({
    where: {
      restaurantId: data.restaurantId,
      status: "CONFIRMED",
      preferredAt: { gte: dayStart, lte: dayEnd },
    },
  });
  if (alreadyBooked) {
    return NextResponse.json({ error: "На эту дату уже есть подтверждённое бронирование" }, { status: 409 });
  }

  const reservation = await prisma.reservationRequest.create({
    data: {
      restaurantId: data.restaurantId,
      userId: session?.user?.id,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      partySize: data.partySize,
      preferredAt,
      comment: data.comment,
    },
  });

  return NextResponse.json({ id: reservation.id });
}
