import { getTranslations, getLocale } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ReservationsPanel } from "@/components/owner/ReservationsPanel";
import { RestaurantSubscriptionStatus } from "@/components/owner/RestaurantSubscriptionStatus";
import { StoreIcon, BellIcon, ClipboardIcon } from "@/components/ui/icons";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/navigation";
import { getSubscriptionInfo } from "@/lib/subscription";

export default async function OwnerDashboardPage() {
  const t = await getTranslations("owner");
  const tSub = await getTranslations("subscription");
  const session = await auth();
  if (!session?.user) {
    const locale = await getLocale();
    redirect({ href: "/auth/owner/login", locale });
    return null;
  }

  const [restaurants, reservations] = await Promise.all([
    prisma.restaurant.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reservationRequest.findMany({
      where: { restaurant: { ownerId: session.user.id } },
      include: { restaurant: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const newCount = reservations.filter((r) => r.status === "NEW").length;

  const attentionRestaurants = restaurants
    .map((r) => ({ ...r, subscription: getSubscriptionInfo(r.subscriptionPaidUntil) }))
    .filter((r) => r.status !== "FROZEN" && (!r.subscription.isPaid || r.subscription.isExpiringSoon));

  const stats = [
    { label: t("statsRestaurants"), value: restaurants.length, icon: StoreIcon },
    { label: t("statsNewRequests"), value: newCount, icon: BellIcon },
    { label: t("statsTotalRequests"), value: reservations.length, icon: ClipboardIcon },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{t("dashboardTitle")}</h1>
          </div>
          <Link href="/owner/restaurants/new" className="self-start">
            <Button>{t("addRestaurant")}</Button>
          </Link>
        </div>

        {attentionRestaurants.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">{tSub("attentionTitle")}</p>
            <ul className="flex flex-col gap-1 text-sm text-amber-800">
              {attentionRestaurants.map((r) => (
                <li key={r.id}>
                  <span className="font-semibold">{r.name}</span> —{" "}
                  {r.subscription.isPaid
                    ? tSub("expiringWarning", { days: r.subscription.daysRemaining })
                    : tSub("hiddenFromSite")}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-black leading-none text-foreground sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs font-medium text-muted sm:text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-10 text-center text-sm text-muted">
            {t("noRestaurants")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dark-surface text-white">
                    <StoreIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground sm:text-lg">{r.name}</h2>
                    <p className="text-sm text-muted">{r.address}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/owner/restaurants/${r.id}/edit`}>
                    <Button variant="outline" size="sm">
                      {t("editRestaurant")}
                    </Button>
                  </Link>
                  <RestaurantSubscriptionStatus
                    restaurantId={r.id}
                    restaurantName={r.name}
                    restaurantStatus={r.status}
                    subscriptionPaidUntil={r.subscriptionPaidUntil?.toISOString() ?? null}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <ReservationsPanel
          reservations={reservations.map((res) => ({
            id: res.id,
            guestName: res.guestName,
            guestPhone: res.guestPhone,
            restaurantName: res.restaurant.name,
            preferredAt: res.preferredAt.toISOString(),
            partySize: res.partySize,
            comment: res.comment,
            status: res.status,
          }))}
          newCount={newCount}
          restaurants={restaurants.map((r) => ({ id: r.id, name: r.name }))}
        />
      </main>
    </>
  );
}
