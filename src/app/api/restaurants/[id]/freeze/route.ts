import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (restaurant.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body?.action === "unfreeze" ? "unfreeze" : "freeze";

  if (action === "freeze" && restaurant.status !== "FROZEN") {
    const updated = await prisma.restaurant.update({ where: { id }, data: { status: "FROZEN" } });
    return NextResponse.json({ status: updated.status });
  }

  if (action === "unfreeze" && restaurant.status === "FROZEN") {
    const updated = await prisma.restaurant.update({ where: { id }, data: { status: "APPROVED" } });
    return NextResponse.json({ status: updated.status });
  }

  return NextResponse.json({ status: restaurant.status });
}
