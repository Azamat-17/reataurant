import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ favorites: [] });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      restaurant: { include: { city: true, region: true, district: true, photos: true } },
    },
  });

  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const { restaurantId } = await request.json();
  if (!restaurantId) return NextResponse.json({ error: "restaurantId обязателен" }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_restaurantId: { userId: session.user.id, restaurantId } },
    update: {},
    create: { userId: session.user.id, restaurantId },
  });

  return NextResponse.json({ favorite });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const { restaurantId } = await request.json();
  if (!restaurantId) return NextResponse.json({ error: "restaurantId обязателен" }, { status: 400 });

  await prisma.favorite.deleteMany({ where: { userId: session.user.id, restaurantId } });
  return NextResponse.json({ ok: true });
}
