import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publicVisibilityWhere } from "@/lib/subscription";

export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function getLocations() {
  const [cities, regions] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
      include: { districts: { orderBy: { name: "asc" } } },
    }),
  ]);
  return { cities, regions };
}

export async function getFilteredRestaurants(searchParams: SearchParams) {
  const city = first(searchParams.city);
  const district = first(searchParams.district);
  const region = first(searchParams.region);
  const type = first(searchParams.type);
  const priceMin = first(searchParams.priceMin);
  const priceMax = first(searchParams.priceMax);
  const veranda = first(searchParams.veranda);
  const onlineBooking = first(searchParams.onlineBooking);
  const discounts = first(searchParams.discounts);
  const q = first(searchParams.q);

  const where: Prisma.RestaurantWhereInput = publicVisibilityWhere();

  if (city) where.city = { slug: city };
  if (district) where.district = { slug: district };
  else if (region) where.region = { slug: region };
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

  return prisma.restaurant.findMany({
    where,
    include: { city: true, region: true, district: true },
    orderBy: { createdAt: "desc" },
  });
}
