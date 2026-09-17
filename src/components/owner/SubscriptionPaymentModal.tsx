"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SUBSCRIPTION_PRICE_SOM, SUBSCRIPTION_PERIOD_DAYS } from "@/lib/subscription";

interface Props {
  open: boolean;
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
  onDone: () => void;
}

export function SubscriptionPaymentModal({ open, restaurantId, restaurantName, onClose, onDone }: Props) {
  const t = useTranslations("subscription");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/restaurants/${restaurantId}/pay`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setError(t("paymentError"));
      return;
    }
    setPaid(true);
  }

  function handleClose() {
    setPaid(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={paid ? undefined : t("title")}>
      {paid ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/10 text-2xl text-accent-green">
            ✓
          </div>
          <p className="text-lg font-bold text-foreground">{t("paySuccessTitle")}</p>
          <p className="text-sm text-muted">{t("paySuccessText")}</p>
          <Button className="mt-2 w-full" onClick={onDone}>
            {t("goToDashboard")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground/90">
            {t("priceInfo", { name: restaurantName, price: SUBSCRIPTION_PRICE_SOM, days: SUBSCRIPTION_PERIOD_DAYS })}
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button variant="green" disabled={loading} onClick={handlePay}>
            {loading ? t("payProcessing") : t("payButton", { price: SUBSCRIPTION_PRICE_SOM })}
          </Button>
          <button type="button" onClick={onDone} className="text-center text-xs text-muted hover:text-foreground">
            {t("payLater")}
          </button>
        </div>
      )}
    </Modal>
  );
}
