import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { RestaurantForm } from "@/components/owner/RestaurantForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocations } from "@/lib/queries";
import type { RestaurantType } from "@/lib/constants";

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("publish");
  const session = await auth();

  const [restaurant, { cities, regions }] = await Promise.all([
    prisma.restaurant.findUnique({ where: { id }, include: { photos: { orderBy: { sortOrder: "asc" } } } }),
    getLocations(),
  ]);

  if (!restaurant) notFound();
  if (restaurant.ownerId !== session?.user?.id && session?.user?.role !== "ADMIN") notFound();

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-foreground">{t("title")}</h1>
        <RestaurantForm
          cities={cities}
          regions={regions}
          mode="edit"
          restaurantId={restaurant.id}
          defaultValues={{
            name: restaurant.name,
            nameSubtitle: restaurant.nameSubtitle ?? undefined,
            description: restaurant.description,
            address: restaurant.address,
            landmark: restaurant.landmark ?? undefined,
            landmarkDistanceM: restaurant.landmarkDistanceM ?? undefined,
            landmarkWalkMin: restaurant.landmarkWalkMin ?? undefined,
            cityId: restaurant.cityId ?? undefined,
            regionId: restaurant.regionId ?? undefined,
            districtId: restaurant.districtId ?? undefined,
            type: restaurant.type as RestaurantType,
            avgCheck: restaurant.avgCheck ?? undefined,
            capacity: restaurant.capacity ?? undefined,
            hasVeranda: restaurant.hasVeranda,
            hasOpenKitchen: restaurant.hasOpenKitchen,
            hasOnlineBooking: restaurant.hasOnlineBooking,
            hasDiscounts: restaurant.hasDiscounts,
            contactName: restaurant.contactName ?? undefined,
            contactPhone: restaurant.contactPhone ?? undefined,
            whatsapp: restaurant.whatsapp ?? undefined,
            website: restaurant.website ?? undefined,
            coverImage: restaurant.coverImage ?? undefined,
            photos: restaurant.photos.map((p) => p.url),
          }}
        />
      </main>
    </>
  );
}
