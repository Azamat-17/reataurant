"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ReservationModal } from "./ReservationModal";
import { FEATURE_FLAGS } from "@/lib/constants";
import type { RestaurantCardData } from "@/lib/types";

const DEFAULT_COVER_IMAGE = "/restaurant-placeholder.svg";

export function RestaurantCard({ restaurant }: { restaurant: RestaurantCardData }) {
  const t = useTranslations("card");
  const [reservationOpen, setReservationOpen] = useState(false);

  const activeFeatures = FEATURE_FLAGS.filter((f) => restaurant[f.id]);
  const landmarkLine =
    restaurant.landmark &&
    `${restaurant.landmark}${
      restaurant.landmarkDistanceM ? ` (${restaurant.landmarkDistanceM} м, ${restaurant.landmarkWalkMin} мин)` : ""
    }`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(23,23,23,0.1)]">
      <Link href={`/restaurants/${restaurant.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden">
        <Image
          src={restaurant.coverImage || DEFAULT_COVER_IMAGE}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {restaurant.type}
          </span>
          {activeFeatures.slice(0, 1).map((f) => (
            <span
              key={f.id}
              className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
            >
              {f.badgeLabel}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/restaurants/${restaurant.slug}`}>
          <h3 className="text-base font-bold leading-tight text-foreground">{restaurant.name}</h3>
          {restaurant.nameSubtitle && <p className="text-xs text-muted">{restaurant.nameSubtitle}</p>}
        </Link>

        <p className="text-sm text-foreground/80">{restaurant.address}</p>
        {landmarkLine && <p className="text-xs text-muted">{landmarkLine}</p>}
        {restaurant.capacity != null && (
          <p className="text-xs text-muted">{t("capacityLabel", { capacity: restaurant.capacity })}</p>
        )}
        {restaurant.avgCheck != null && (
          <p className="text-xs font-semibold text-foreground">{t("pricePerPerson", { price: restaurant.avgCheck })}</p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={() => setReservationOpen(true)}
            className="w-full rounded-full bg-accent-green px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-accent-green-dark"
          >
            {t("bookTable")}
          </button>
        </div>
      </div>

      <ReservationModal
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </div>
  );
}
