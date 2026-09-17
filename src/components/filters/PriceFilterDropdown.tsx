"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDownIcon } from "@/components/ui/icons";
import { PRICE_BANDS } from "@/lib/constants";
import { useQueryParams } from "./useQueryParams";

export function PriceFilterDropdown() {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const active = PRICE_BANDS.find(
    (b) => String(b.min) === priceMin && String(b.max ?? "") === (priceMax ?? "")
  );

  return (
    <Dropdown
      trigger={({ open }) => (
        <span
          className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
            active ? "border-brand bg-brand/10 text-brand" : "border-border bg-white/70 text-foreground hover:border-foreground hover:bg-white"
          }`}
        >
          {active ? active.label : t("avgCheck")}
          <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
    >
      {({ close }) => (
        <div className="flex flex-col gap-0.5 text-sm">
          <button
            type="button"
            onClick={() => {
              setParams({ priceMin: null, priceMax: null });
              close();
            }}
            className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${!active ? "font-semibold text-brand" : ""}`}
          >
            {t("anyPrice")}
          </button>
          {PRICE_BANDS.map((band) => (
            <button
              key={band.id}
              type="button"
              onClick={() => {
                setParams({ priceMin: String(band.min), priceMax: band.max ? String(band.max) : null });
                close();
              }}
              className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${
                active?.id === band.id ? "font-semibold text-brand" : ""
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
