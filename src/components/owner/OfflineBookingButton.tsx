"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { OfflineBookingModal } from "./OfflineBookingModal";

interface RestaurantOption {
  id: string;
  name: string;
}

export function OfflineBookingButton({ restaurants }: { restaurants: RestaurantOption[] }) {
  const t = useTranslations("owner");
  const [open, setOpen] = useState(false);

  if (restaurants.length === 0) return null;

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        {t("addOfflineBooking")}
      </Button>
      <OfflineBookingModal restaurants={restaurants} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
