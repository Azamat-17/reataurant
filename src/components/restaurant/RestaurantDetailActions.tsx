"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { HeartIcon, ShareIcon, UsersIcon } from "@/components/ui/icons";
import { ReservationModal } from "./ReservationModal";

interface Props {
  restaurantId: string;
  restaurantName: string;
  hasOnlineBooking: boolean;
  capacity: number | null;
  avgCheck: number | null;
}

export function RestaurantDetailActions({
  restaurantId,
  restaurantName,
  hasOnlineBooking,
  capacity,
  avgCheck,
}: Props) {
  const t = useTranslations("card");
  const { data: session } = useSession();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        const ids = (data.favorites ?? []).map((f: { restaurantId: string }) => f.restaurantId);
        setFavorite(ids.includes(restaurantId));
      })
      .catch(() => {});
  }, [session?.user, restaurantId]);

  async function toggleFavorite() {
    if (!session?.user) return;
    setLoadingFavorite(true);
    await fetch("/api/favorites", {
      method: favorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId }),
    });
    setFavorite((v) => !v);
    setLoadingFavorite(false);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: restaurantName, url });
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // copying isn't available in this browser — nothing more we can do
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const ctaLabel = hasOnlineBooking ? t("bookTableOnline") : t("bookTable");

  return (
    <>
      {/* Desktop sticky booking card */}
      <div className="hidden md:block">
        <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[0_2px_12px_rgba(23,23,23,0.05)]">
          {avgCheck != null && (
            <p className="text-xl font-black text-foreground">{t("pricePerPerson", { price: avgCheck })}</p>
          )}
          {capacity != null && (
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <UsersIcon className="h-4 w-4 shrink-0" />
              <span>{t("capacityLabel", { capacity })}</span>
            </div>
          )}

          <Button variant="green" className="w-full" onClick={() => setReservationOpen(true)}>
            {ctaLabel}
          </Button>

          <div className="flex items-center gap-2">
            {session?.user && (
              <button
                type="button"
                onClick={toggleFavorite}
                disabled={loadingFavorite}
                aria-label="Избранное"
                aria-pressed={favorite}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                  favorite ? "border-brand bg-brand/10 text-brand" : "border-border text-foreground hover:border-foreground"
                }`}
              >
                <HeartIcon className="h-4 w-4" fill={favorite ? "currentColor" : "none"} />
              </button>
            )}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={handleShare}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground hover:border-foreground"
              >
                <ShareIcon className="h-4 w-4" />
                {t("share")}
              </button>
              {copied && (
                <span className="absolute right-0 top-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white">
                  {t("linkCopied")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-surface p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(23,23,23,0.08)] md:hidden">
        {session?.user && (
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={loadingFavorite}
            aria-label="Избранное"
            aria-pressed={favorite}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
              favorite ? "border-brand bg-brand/10 text-brand" : "border-border text-foreground"
            }`}
          >
            <HeartIcon className="h-5 w-5" fill={favorite ? "currentColor" : "none"} />
          </button>
        )}
        <Button variant="green" className="flex-1" onClick={() => setReservationOpen(true)}>
          {ctaLabel}
        </Button>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label={t("share")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
          {copied && (
            <span className="absolute bottom-[calc(100%+8px)] right-0 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white">
              {t("linkCopied")}
            </span>
          )}
        </div>
      </div>

      <ReservationModal
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  );
}
