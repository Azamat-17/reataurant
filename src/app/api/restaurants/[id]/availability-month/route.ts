import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // YYYY-MM

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Некорректный месяц" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { capacity: true },
  });
  if (!restaurant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
  const monthEnd = new Date(year, monthNum, 0, 23, 59, 59, 999);

  const confirmed = await prisma.reservationRequest.findMany({
    where: {
      restaurantId: id,
      status: "CONFIRMED",
      preferredAt: { gte: monthStart, lte: monthEnd },
    },
    select: { preferredAt: true },
  });

  const bookedDays = new Set(confirmed.map((r) => r.preferredAt.getDate()));

  const daysInMonth = monthEnd.getDate();
  const days: Record<number, { booked: boolean }> = {};
  for (let day = 1; day <= daysInMonth; day++) {
    days[day] = { booked: bookedDays.has(day) };
  }

  return NextResponse.json({ capacity: restaurant.capacity, days });
}
