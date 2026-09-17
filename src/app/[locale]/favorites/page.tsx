import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubscriptionInfo } from "@/lib/subscription";

export default async function FavoritesPage() {
  const t = await getTranslations();
  const session = await auth();

  const favorites = session?.user
    ? await prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: { restaurant: { include: { city: true, region: true, district: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const restaurants = favorites
    .map((f) => f.restaurant)
    .filter((r) => r.status === "APPROVED" && getSubscriptionInfo(r.subscriptionPaidUntil).isPaid);

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-foreground">{t("header.favorites")}</h1>

        {!session?.user ? (
          <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-10 text-center text-sm text-muted">
            <Link href="/auth/login" className="font-semibold text-brand">
              {t("header.login")}
            </Link>
          </p>
        ) : restaurants.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-10 text-center text-sm text-muted">
            {t("home.noResults")}
          </p>
        ) : (
          <RestaurantGrid restaurants={restaurants} />
        )}
      </main>
    </>
  );
}
