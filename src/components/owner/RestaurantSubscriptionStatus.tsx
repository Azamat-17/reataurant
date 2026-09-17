"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { SubscriptionPaymentModal } from "@/components/owner/SubscriptionPaymentModal";
import { getSubscriptionInfo } from "@/lib/subscription";

export function RestaurantSubscriptionStatus({
  restaurantId,
  restaurantName,
  restaurantStatus,
  subscriptionPaidUntil,
}: {
  restaurantId: string;
  restaurantName: string;
  restaurantStatus: string;
  subscriptionPaidUntil: string | null;
}) {
  const t = useTranslations("subscription");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  const isFrozen = restaurantStatus === "FROZEN";
  const { isPaid, isExpiringSoon, daysRemaining } = getSubscriptionInfo(
    subscriptionPaidUntil ? new Date(subscriptionPaidUntil) : null
  );

  function handleDone() {
    setOpen(false);
    router.refresh();
  }

  async function handleFreezeToggle() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/restaurants/${restaurantId}/freeze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isFrozen ? "unfreeze" : "freeze" }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(t("freezeError"));
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm(t("confirmDeleteRestaurant", { name: restaurantName }))) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/restaurants/${restaurantId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      setError(t("deleteError"));
      return;
    }
    setDeleted(true);
    router.refresh();
  }

  if (deleted) return null;

  const badgeClass = isFrozen
    ? "bg-gray-100 text-gray-600"
    : !isPaid
      ? "bg-red-100 text-red-700"
      : isExpiringSoon
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isFrozen
            ? t("statusFrozen")
            : !isPaid
              ? subscriptionPaidUntil
                ? t("statusExpired")
                : t("statusUnpaid")
              : `${t("statusPaid")} · ${t("daysRemaining", { days: daysRemaining })}`}
        </span>

        {isFrozen ? (
          <Button variant="outline" size="sm" disabled={loading} onClick={handleFreezeToggle}>
            {t("unfreezeButton")}
          </Button>
        ) : (
          <>
            <Button variant={isPaid ? "outline" : "primary"} size="sm" onClick={() => setOpen(true)}>
              {isPaid ? t("renewButton") : t("payNow")}
            </Button>
            <Button variant="outline" size="sm" disabled={loading} onClick={handleFreezeToggle}>
              {t("freezeButton")}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleDelete}
          className="!border-red-200 !text-red-600 hover:!border-red-400"
        >
          {t("deleteButton")}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <SubscriptionPaymentModal
        open={open}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        onClose={() => setOpen(false)}
        onDone={handleDone}
      />
    </div>
  );
}
