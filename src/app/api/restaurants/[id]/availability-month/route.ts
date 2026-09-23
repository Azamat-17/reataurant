import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseRestaurantDateTime, restaurantDayOfMonth } from "@/lib/timezone";

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
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const monthStart = parseRestaurantDateTime(`${month}-01T00:00:00.000`);
  const monthEnd = parseRestaurantDateTime(`${month}-${String(daysInMonth).padStart(2, "0")}T23:59:59.999`);

  const confirmed = await prisma.reservationRequest.findMany({
    where: {
      restaurantId: id,
      status: "CONFIRMED",
      preferredAt: { gte: monthStart, lte: monthEnd },
    },
    select: { preferredAt: true },
  });

  const bookedDays = new Set(confirmed.map((r) => restaurantDayOfMonth(r.preferredAt)));
  const days: Record<number, { booked: boolean }> = {};
  for (let day = 1; day <= daysInMonth; day++) {
    days[day] = { booked: bookedDays.has(day) };
  }

  return NextResponse.json({ capacity: restaurant.capacity, days });
}
