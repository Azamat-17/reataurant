"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { HeartIcon, ShareIcon } from "@/components/ui/icons";
import { ReservationModal } from "./ReservationModal";

export function RestaurantDetailActions({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
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

  return (
    <div className="flex items-center gap-3">
      <Button variant="green" className="flex-1" onClick={() => setReservationOpen(true)}>
        {t("bookTable")}
      </Button>
      {session?.user && (
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={loadingFavorite}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
            favorite ? "border-brand bg-brand/10 text-brand" : "border-border text-foreground"
          }`}
        >
          <HeartIcon className="h-5 w-5" fill={favorite ? "currentColor" : "none"} />
        </button>
      )}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={handleShare}
          aria-label={t("share")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-foreground"
        >
          <ShareIcon className="h-5 w-5" />
        </button>
        {copied && (
          <span className="absolute right-0 top-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white">
            {t("linkCopied")}
          </span>
        )}
      </div>
      <ReservationModal
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </div>
  );
}
