import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { Link } from "@/i18n/navigation";
import { PhotoCarousel } from "@/components/restaurant/PhotoCarousel";
import { RestaurantDetailActions } from "@/components/restaurant/RestaurantDetailActions";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { UsersIcon, CoinIcon, CupIcon, MapPinIcon } from "@/components/ui/icons";
import { FEATURE_FLAGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSubscriptionInfo } from "@/lib/subscription";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations();

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: { city: true, region: true, district: true, photos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!restaurant || restaurant.status !== "APPROVED" || !getSubscriptionInfo(restaurant.subscriptionPaidUntil).isPaid) {
    notFound();
  }

  const activeFeatures = FEATURE_FLAGS.filter((f) => restaurant[f.id]);
  const landmarkLine =
    restaurant.landmark &&
    `${restaurant.landmark}${
      restaurant.landmarkDistanceM ? ` (${restaurant.landmarkDistanceM} м, ${restaurant.landmarkWalkMin} мин)` : ""
    }`;
  const locationLine = Array.from(
    new Set([restaurant.district?.name, restaurant.region?.name, restaurant.city?.name].filter(Boolean))
  ).join(", ");
  const galleryImages = Array.from(
    new Set(
      [restaurant.coverImage, ...restaurant.photos.map((p) => p.url)].filter((url): url is string => Boolean(url))
    )
  );
  const whatsappHref = restaurant.whatsapp
    ? restaurant.whatsapp.startsWith("http")
      ? restaurant.whatsapp
      : `https://wa.me/${restaurant.whatsapp.replace(/\D/g, "")}`
    : null;
  const websiteHref = restaurant.website
    ? restaurant.website.startsWith("http")
      ? restaurant.website
      : `https://${restaurant.website}`
    : null;
  const hasContacts = Boolean(restaurant.contactPhone || whatsappHref || websiteHref);

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pb-28 md:pb-16">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6">
          <nav className="text-sm text-muted">
            <Link href="/" className="hover:text-foreground">
              {t("breadcrumb.home")}
            </Link>
            {" / "}
            <Link href="/restaurants" className="hover:text-foreground">
              {t("breadcrumb.restaurants")}
            </Link>
            {" / "}
            <span className="text-foreground">{restaurant.name}</span>
          </nav>

          <PhotoCarousel
            images={galleryImages}
            alt={restaurant.name}
            badges={
              <>
                <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {restaurant.type}
                </span>
                {activeFeatures.map((f) => (
                  <span
                    key={f.id}
                    className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white"
                  >
                    {f.badgeLabel}
                  </span>
                ))}
              </>
            }
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-6 md:col-span-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-foreground sm:text-3xl">{restaurant.name}</h1>
                {restaurant.nameSubtitle && <p className="text-muted">{restaurant.nameSubtitle}</p>}
                {locationLine && (
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <MapPinIcon className="h-4 w-4 shrink-0" />
                    <span>{locationLine}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground">
                  <CupIcon className="h-4 w-4 text-muted" />
                  {restaurant.type}
                </span>
                {restaurant.capacity != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground">
                    <UsersIcon className="h-4 w-4 text-muted" />
                    {t("card.capacityLabel", { capacity: restaurant.capacity })}
                  </span>
                )}
                {restaurant.avgCheck != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground">
                    <CoinIcon className="h-4 w-4 text-muted" />
                    {t("card.pricePerPerson", { price: restaurant.avgCheck })}
                  </span>
                )}
              </div>

              <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-lg font-bold text-foreground">{t("detail.about")}</h2>
                <p className="whitespace-pre-line text-foreground/90">{restaurant.description}</p>
              </section>

              {activeFeatures.length > 0 && (
                <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
                  <h2 className="text-lg font-bold text-foreground">{t("detail.features")}</h2>
                  <div className="flex flex-wrap gap-2">
                    {activeFeatures.map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent-dark"
                      >
                        {f.label}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-lg font-bold text-foreground">{t("detail.location")}</h2>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="font-semibold text-foreground">{restaurant.address}</p>
                  {locationLine && <p className="text-muted">{locationLine}</p>}
                  {landmarkLine && <p className="text-muted">{landmarkLine}</p>}
                </div>

                <MapPlaceholder />

                {hasContacts && (
                  <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
                    {restaurant.contactName && (
                      <p className="font-semibold text-foreground">
                        {t("contact.person")}: {restaurant.contactName}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {restaurant.contactPhone && (
                        <a
                          href={`tel:${restaurant.contactPhone.replace(/\s/g, "")}`}
                          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-foreground"
                        >
                          {t("contact.call")} · {restaurant.contactPhone}
                        </a>
                      )}
                      {whatsappHref && (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-accent-green px-4 py-2 text-sm font-medium text-accent-green-dark hover:bg-accent-green/10"
                        >
                          {t("contact.whatsapp")}
                        </a>
                      )}
                      {websiteHref && (
                        <a
                          href={websiteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-foreground"
                        >
                          {t("contact.website")}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="md:col-span-1">
              <RestaurantDetailActions
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                hasOnlineBooking={restaurant.hasOnlineBooking}
                capacity={restaurant.capacity}
                avgCheck={restaurant.avgCheck}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
