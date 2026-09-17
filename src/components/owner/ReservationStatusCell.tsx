"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const STATUS_CLASS: Record<string, string> = {
  NEW: "bg-brand/10 text-brand",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_KEY: Record<string, string> = {
  NEW: "requestStatusNew",
  CONTACTED: "requestStatusContacted",
  CONFIRMED: "requestStatusConfirmed",
  REJECTED: "requestStatusRejected",
};

export function ReservationStatusCell({ id, status }: { id: string; status: string }) {
  const t = useTranslations("owner");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(status);
  const [deleted, setDeleted] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    const res = await fetch(`/api/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (res.ok) {
      setCurrent(next);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!window.confirm(t("confirmDelete"))) return;
    setLoading(true);
    const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setDeleted(true);
      router.refresh();
    }
  }

  if (deleted) return null;

  const badgeClass = STATUS_CLASS[current] ?? STATUS_CLASS.NEW;
  const badgeKey = STATUS_KEY[current] ?? STATUS_KEY.NEW;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeClass}`}>{t(badgeKey)}</span>
      {current === "NEW" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("CONTACTED")}
          className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-foreground disabled:opacity-50"
        >
          {t("markContacted")}
        </button>
      )}
      {(current === "NEW" || current === "CONTACTED") && (
        <>
          <button
            type="button"
            disabled={loading}
            onClick={() => setStatus("CONFIRMED")}
            className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            {t("markConfirmed")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setStatus("REJECTED")}
            className="rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {t("markRejected")}
          </button>
        </>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-50"
      >
        {t("deleteRequest")}
      </button>
    </div>
  );
}
