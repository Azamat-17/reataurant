import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [cities, regions] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
      include: { districts: { orderBy: { name: "asc" } } },
    }),
  ]);

  return NextResponse.json({ cities, regions });
}
