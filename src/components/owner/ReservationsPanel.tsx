"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ReservationStatusCell } from "@/components/owner/ReservationStatusCell";
import { OfflineBookingButton } from "@/components/owner/OfflineBookingButton";
import { ColumnFilterDropdown } from "@/components/owner/ColumnFilterDropdown";
import { formatRestaurantDateTime } from "@/lib/timezone";

const POLL_INTERVAL_MS = 15000;

interface ReservationRow {
  id: string;
  guestName: string;
  guestPhone: string;
  restaurantName: string;
  preferredAt: string;
  partySize: number;
  comment: string | null;
  status: string;
}

interface Props {
  reservations: ReservationRow[];
  newCount: number;
  restaurants: { id: string; name: string }[];
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CONFIRMED", "REJECTED"] as const;

const STATUS_KEY: Record<string, string> = {
  NEW: "requestStatusNew",
  CONTACTED: "requestStatusContacted",
  CONFIRMED: "requestStatusConfirmed",
  REJECTED: "requestStatusRejected",
};

interface ColumnFilters {
  guest: string;
  phone: string;
  restaurant: string;
  date: string;
  guests: string;
  comment: string;
  status: string;
}

const EMPTY_FILTERS: ColumnFilters = {
  guest: "",
  phone: "",
  restaurant: "",
  date: "",
  guests: "",
  comment: "",
  status: "",
};

function uniqueOptions(values: string[]): { value: string; label: string }[] {
  return Array.from(new Set(values)).map((v) => ({ value: v, label: v }));
}

export function ReservationsPanel({
  reservations: initialReservations,
  newCount: initialNewCount,
  restaurants,
}: Props) {
  const t = useTranslations("owner");
  const [filters, setFilters] = useState<ColumnFilters>(EMPTY_FILTERS);
  const [reservations, setReservations] = useState(initialReservations);
  const [newCount, setNewCount] = useState(initialNewCount);

  // Keep local state in sync whenever the server re-renders this page (e.g. after
  // router.refresh() from a status change or a new offline booking).
  useEffect(() => {
    setReservations(initialReservations);
    setNewCount(initialNewCount);
  }, [initialReservations, initialNewCount]);

  // Poll for incoming requests so the admin sees new ones without refreshing the page.
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/owner/reservations", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        setReservations(data.reservations);
        setNewCount(data.newCount);
      } catch {
        // network hiccup — the next poll tick will retry
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  function setFilter<K extends keyof ColumnFilters>(key: K, value: ColumnFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const rows = useMemo(
    () => reservations.map((res) => ({ ...res, dateLabel: formatRestaurantDateTime(res.preferredAt) })),
    [reservations]
  );

  const options = useMemo(
    () => ({
      guest: uniqueOptions(rows.map((r) => r.guestName)),
      phone: uniqueOptions(rows.map((r) => r.guestPhone)),
      restaurant: uniqueOptions(rows.map((r) => r.restaurantName)),
      date: uniqueOptions(rows.map((r) => r.dateLabel)),
      guests: uniqueOptions(rows.map((r) => String(r.partySize))).sort((a, b) => Number(a.value) - Number(b.value)),
      comment: rows.some((r) => r.comment)
        ? uniqueOptions(rows.filter((r) => r.comment).map((r) => r.comment as string))
        : [],
      status: STATUS_OPTIONS.map((s) => ({ value: s, label: t(STATUS_KEY[s]) })),
    }),
    [rows, t]
  );

  const filtered = useMemo(() => {
    return rows.filter((res) => {
      if (filters.guest && res.guestName !== filters.guest) return false;
      if (filters.phone && res.guestPhone !== filters.phone) return false;
      if (filters.restaurant && res.restaurantName !== filters.restaurant) return false;
      if (filters.date && res.dateLabel !== filters.date) return false;
      if (filters.guests && String(res.partySize) !== filters.guests) return false;
      if (filters.comment && res.comment !== filters.comment) return false;
      if (filters.status && res.status !== filters.status) return false;
      return true;
    });
  }, [rows, filters]);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-bold text-foreground">{t("allRequestsTitle")}</h2>
          {newCount > 0 && (
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              {t("newRequestsCount", { count: newCount })}
            </span>
          )}
        </div>
        <OfflineBookingButton restaurants={restaurants} />
      </div>

      {reservations.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-8 text-center text-sm text-muted">
          {t("noRequests")}
        </p>
      ) : (
        <>
          {/* mobile: filters as a standalone grid, since there's no table header to merge into */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-gray-50/60 p-3 sm:hidden">
            <ColumnFilterDropdown
              label={t("colGuest")}
              options={options.guest}
              selected={filters.guest}
              onSelect={(v) => setFilter("guest", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colPhone")}
              options={options.phone}
              selected={filters.phone}
              onSelect={(v) => setFilter("phone", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colRestaurant")}
              options={options.restaurant}
              selected={filters.restaurant}
              onSelect={(v) => setFilter("restaurant", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colDate")}
              options={options.date}
              selected={filters.date}
              onSelect={(v) => setFilter("date", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colGuests")}
              options={options.guests}
              selected={filters.guests}
              onSelect={(v) => setFilter("guests", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colComment")}
              options={options.comment}
              selected={filters.comment}
              onSelect={(v) => setFilter("comment", v)}
              allLabel={t("filterAll")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
            <ColumnFilterDropdown
              label={t("colStatus")}
              options={options.status}
              selected={filters.status}
              onSelect={(v) => setFilter("status", v)}
              allLabel={t("filterAllStatuses")}
              searchPlaceholder={t("filterSearchPlaceholder")}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted">{t("searchResults", { count: filtered.length })}</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground hover:border-foreground"
              >
                {t("clearSearch")}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="sm:hidden">
              <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-8 text-center text-sm text-muted">
                {t("noFilterResults")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:hidden">
              {filtered.map((res) => (
                <div key={res.id} className="rounded-2xl border border-border bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{res.guestName}</p>
                      <p className="text-sm text-muted">{res.guestPhone}</p>
                    </div>
                    <p className="text-right text-sm font-medium text-muted">{res.restaurantName}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span>{res.dateLabel}</span>
                    <span>
                      {t("colGuests")}: {res.partySize}
                    </span>
                  </div>
                  {res.comment && (
                    <p className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-foreground/80">{res.comment}</p>
                  )}
                  <div className="mt-2.5">
                    <ReservationStatusCell id={res.id} status={res.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* desktop: filter dropdowns live inside the table header, so labels aren't shown twice */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border sm:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="p-2 pl-3 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colGuest")}
                      options={options.guest}
                      selected={filters.guest}
                      onSelect={(v) => setFilter("guest", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colPhone")}
                      options={options.phone}
                      selected={filters.phone}
                      onSelect={(v) => setFilter("phone", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colRestaurant")}
                      options={options.restaurant}
                      selected={filters.restaurant}
                      onSelect={(v) => setFilter("restaurant", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colDate")}
                      options={options.date}
                      selected={filters.date}
                      onSelect={(v) => setFilter("date", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colGuests")}
                      options={options.guests}
                      selected={filters.guests}
                      onSelect={(v) => setFilter("guests", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colComment")}
                      options={options.comment}
                      selected={filters.comment}
                      onSelect={(v) => setFilter("comment", v)}
                      allLabel={t("filterAll")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                  <th className="p-2 pr-3 font-semibold">
                    <ColumnFilterDropdown
                      label={t("colStatus")}
                      options={options.status}
                      selected={filters.status}
                      onSelect={(v) => setFilter("status", v)}
                      allLabel={t("filterAllStatuses")}
                      searchPlaceholder={t("filterSearchPlaceholder")}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted">
                      {t("noFilterResults")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((res, i) => (
                    <tr
                      key={res.id}
                      className={`border-t border-border/60 transition-colors hover:bg-gray-50 ${
                        i % 2 === 1 ? "bg-gray-50/40" : ""
                      }`}
                    >
                      <td className="py-3 pl-4 pr-3 font-semibold text-foreground">{res.guestName}</td>
                      <td className="py-3 pr-3 text-muted">{res.guestPhone}</td>
                      <td className="py-3 pr-3 text-muted">{res.restaurantName}</td>
                      <td className="py-3 pr-3 text-muted">{res.dateLabel}</td>
                      <td className="py-3 pr-3 text-muted">{res.partySize}</td>
                      <td className="max-w-[220px] py-3 pr-3 text-muted">{res.comment || "—"}</td>
                      <td className="py-3 pr-4">
                        <ReservationStatusCell id={res.id} status={res.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
