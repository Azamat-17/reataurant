import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validations/restaurant";
import { slugify } from "@/lib/slugify";
import { publicVisibilityWhere } from "@/lib/subscription";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city");
  const district = searchParams.get("district");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const veranda = searchParams.get("veranda");
  const onlineBooking = searchParams.get("onlineBooking");
  const discounts = searchParams.get("discounts");
  const q = searchParams.get("q");

  const where: Prisma.RestaurantWhereInput = publicVisibilityWhere();

  if (city) where.city = { slug: city };
  if (district) where.district = { slug: district };
  if (region) where.region = { slug: region };
  if (type) where.type = type;
  if (veranda === "1") where.hasVeranda = true;
  if (onlineBooking === "1") where.hasOnlineBooking = true;
  if (discounts === "1") where.hasDiscounts = true;
  if (priceMin || priceMax) {
    where.avgCheck = {
      ...(priceMin ? { gte: Number(priceMin) } : {}),
      ...(priceMax ? { lte: Number(priceMax) } : {}),
    };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { address: { contains: q } },
    ];
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: { city: true, region: true, district: true, photos: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ restaurants });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Требуется вход как владелец ресторана" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = restaurantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const data = parsed.data;
  const photos: string[] = Array.isArray(body.photos) ? body.photos : [];

  const baseSlug = slugify(data.name) || "restoran";
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      slug,
      name: data.name,
      nameSubtitle: data.nameSubtitle,
      description: data.description,
      address: data.address,
      landmark: data.landmark,
      landmarkDistanceM: data.landmarkDistanceM,
      landmarkWalkMin: data.landmarkWalkMin,
      cityId: data.cityId || null,
      regionId: data.regionId || null,
      districtId: data.districtId || null,
      type: data.type,
      avgCheck: data.avgCheck,
      capacity: data.capacity,
      hasVeranda: data.hasVeranda,
      hasOpenKitchen: data.hasOpenKitchen,
      hasOnlineBooking: data.hasOnlineBooking,
      hasDiscounts: data.hasDiscounts,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      whatsapp: data.whatsapp,
      website: data.website,
      coverImage: data.coverImage,
      status: "APPROVED",
      ownerId: session.user.id,
      photos: {
        create: photos.map((url, i) => ({ url, sortOrder: i })),
      },
    },
  });

  return NextResponse.json({ id: restaurant.id, slug: restaurant.slug });
}
