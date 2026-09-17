"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export function ModerationActions({ restaurantId }: { restaurantId: string }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: "APPROVED" | "REJECTED") {
    setLoading(true);
    await fetch(`/api/admin/restaurants/${restaurantId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="green" size="sm" disabled={loading} onClick={() => setStatus("APPROVED")}>
        {t("approve")}
      </Button>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => setStatus("REJECTED")}>
        {t("reject")}
      </Button>
    </div>
  );
}
