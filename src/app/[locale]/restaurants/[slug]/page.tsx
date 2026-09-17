import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { Link } from "@/i18n/navigation";
import { PhotoCarousel } from "@/components/restaurant/PhotoCarousel";
import { RestaurantDetailActions } from "@/components/restaurant/RestaurantDetailActions";
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
      <main className="flex-1">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
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

          <div>
            <h1 className="text-3xl font-black text-foreground">{restaurant.name}</h1>
            {restaurant.nameSubtitle && <p className="text-muted">{restaurant.nameSubtitle}</p>}
          </div>

          <p className="whitespace-pre-line text-foreground/90">{restaurant.description}</p>

          <div className="flex flex-col gap-1 rounded-2xl border border-border p-4 text-sm">
            <p className="font-semibold text-foreground">{restaurant.address}</p>
            {locationLine && <p className="text-muted">{locationLine}</p>}
            {landmarkLine && <p className="text-muted">{landmarkLine}</p>}
            {restaurant.capacity != null && (
              <p className="text-muted">{t("card.capacityLabel", { capacity: restaurant.capacity })}</p>
            )}
            {restaurant.avgCheck != null && (
              <p className="font-semibold text-foreground">
                {t("card.pricePerPerson", { price: restaurant.avgCheck })}
              </p>
            )}
          </div>

          {hasContacts && (
            <div className="flex flex-col gap-2 rounded-2xl border border-border p-4 text-sm">
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

          <RestaurantDetailActions restaurantId={restaurant.id} restaurantName={restaurant.name} />
        </div>
      </main>
    </>
  );
}
