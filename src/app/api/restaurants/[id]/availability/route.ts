import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || Number.isNaN(Date.parse(date))) {
    return NextResponse.json({ error: "Некорректная дата" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { capacity: true },
  });
  if (!restaurant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  const confirmedCount = await prisma.reservationRequest.count({
    where: {
      restaurantId: id,
      status: "CONFIRMED",
      preferredAt: { gte: dayStart, lte: dayEnd },
    },
  });

  const booked = confirmedCount > 0;

  return NextResponse.json({ capacity: restaurant.capacity, booked });
}
