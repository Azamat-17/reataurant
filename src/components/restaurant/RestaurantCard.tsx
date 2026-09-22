"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ReservationModal } from "./ReservationModal";
import { FavoriteButton } from "./FavoriteButton";
import { UsersIcon } from "@/components/ui/icons";
import { FEATURE_FLAGS } from "@/lib/constants";
import type { RestaurantCardData } from "@/lib/types";

const DEFAULT_COVER_IMAGE = "/restaurant-placeholder.svg";
const ONLINE_BOOKING_BADGE = FEATURE_FLAGS.find((f) => f.id === "hasOnlineBooking")!.badgeLabel;
const DISCOUNTS_BADGE = FEATURE_FLAGS.find((f) => f.id === "hasDiscounts")!.badgeLabel;

export function RestaurantCard({ restaurant }: { restaurant: RestaurantCardData }) {
  const t = useTranslations("card");
  const [reservationOpen, setReservationOpen] = useState(false);

  const locationLine = restaurant.district?.name ?? restaurant.region?.name ?? restaurant.city?.name ?? null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-surface shadow-[0_2px_12px_rgba(23,23,23,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(23,23,23,0.1)]">
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden"
      >
        <Image
          src={restaurant.coverImage || DEFAULT_COVER_IMAGE}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-[220ms] ease-out group-hover:scale-[1.03]"
        />

        {restaurant.hasOnlineBooking && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {ONLINE_BOOKING_BADGE}
          </span>
        )}

        <div className="absolute right-2.5 top-2.5">
          <FavoriteButton restaurantId={restaurant.id} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link href={`/restaurants/${restaurant.slug}`} className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold leading-tight text-foreground">{restaurant.name}</h3>
          {locationLine && <p className="text-sm text-muted">{locationLine}</p>}
        </Link>

        <p className="text-xs text-muted">{restaurant.type}</p>

        <div className="flex flex-col gap-1.5">
          {restaurant.capacity != null && (
            <div className="flex items-center gap-1.5 text-sm text-foreground/80">
              <UsersIcon className="h-4 w-4 shrink-0 text-muted" />
              <span>{t("capacityLabel", { capacity: restaurant.capacity })}</span>
            </div>
          )}
          {restaurant.avgCheck != null && (
            <p className="text-sm font-semibold text-foreground">
              {t("pricePerPerson", { price: restaurant.avgCheck })}
            </p>
          )}
        </div>

        {restaurant.hasDiscounts && (
          <span className="inline-flex w-fit items-center rounded-md bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-dark">
            {DISCOUNTS_BADGE}
          </span>
        )}

        <div className="mt-auto pt-1.5">
          <button
            type="button"
            onClick={() => setReservationOpen(true)}
            className="w-full rounded-full bg-accent-green px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-accent-green-dark"
          >
            {restaurant.hasOnlineBooking ? t("bookTableOnline") : t("bookTable")}
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
