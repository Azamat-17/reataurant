"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RegionFilterDropdown } from "./RegionFilterDropdown";
import { CityFilterDropdown } from "./CityFilterDropdown";
import { DistrictFilterDropdown } from "./DistrictFilterDropdown";
import { TypeFilterDropdown } from "./TypeFilterDropdown";
import { PriceFilterDropdown } from "./PriceFilterDropdown";
import { ToggleFilterButton } from "./ToggleFilterButton";
import { FEATURE_FLAGS } from "@/lib/constants";
import { useQueryParams } from "./useQueryParams";

const FILTER_KEYS = ["city", "region", "district", "type", "priceMin", "priceMax", "veranda", "onlineBooking", "discounts"];

interface RegionData {
  slug: string;
  name: string;
  districts: { slug: string; name: string }[];
}

export function AllFiltersDrawer({
  cities,
  regions,
}: {
  cities: { slug: string; name: string }[];
  regions: RegionData[];
}) {
  const t = useTranslations("filters");
  const [open, setOpen] = useState(false);
  const { searchParams, setParams } = useQueryParams();

  const activeCount = FILTER_KEYS.filter((k) => searchParams.get(k)).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-foreground bg-foreground px-4 text-sm font-semibold text-white"
      >
        {t("all")}
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t("all")}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <RegionFilterDropdown regions={regions} />
            <CityFilterDropdown cities={cities} />
            <DistrictFilterDropdown regions={regions} />
            <TypeFilterDropdown />
            <PriceFilterDropdown />
          </div>
          <div className="flex flex-wrap gap-2">
            {FEATURE_FLAGS.filter((f) => f.id !== "hasOpenKitchen").map((f) => (
              <ToggleFilterButton
                key={f.id}
                paramKey={f.id === "hasVeranda" ? "veranda" : f.id === "hasOnlineBooking" ? "onlineBooking" : "discounts"}
                label={f.label}
              />
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setParams(Object.fromEntries(FILTER_KEYS.map((k) => [k, null])));
              }}
            >
              {t("reset")}
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>
              {t("apply")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
