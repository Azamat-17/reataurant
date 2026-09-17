import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validations/restaurant";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { city: true, region: true, district: true, photos: true },
  });
  if (!restaurant) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json({ restaurant });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (existing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = restaurantSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const photos: string[] | undefined = Array.isArray(body.photos)
    ? body.photos.filter((url: unknown): url is string => typeof url === "string")
    : undefined;

  const { cityId, regionId, districtId, ...data } = parsed.data;
  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...data,
      city: cityId !== undefined ? (cityId ? { connect: { id: cityId } } : { disconnect: true }) : undefined,
      region: regionId !== undefined ? (regionId ? { connect: { id: regionId } } : { disconnect: true }) : undefined,
      district:
        districtId !== undefined ? (districtId ? { connect: { id: districtId } } : { disconnect: true }) : undefined,
      status: existing.status === "REJECTED" ? "PENDING" : existing.status,
      photos:
        photos !== undefined
          ? { deleteMany: {}, create: photos.map((url, i) => ({ url, sortOrder: i })) }
          : undefined,
    },
  });

  return NextResponse.json({ restaurant });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (existing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  await prisma.restaurant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
