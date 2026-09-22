"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDownIcon, MapPinIcon } from "@/components/ui/icons";
import { useQueryParams } from "./useQueryParams";

export function CityFilterDropdown({ cities }: { cities: { slug: string; name: string }[] }) {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const activeSlug = searchParams.get("city");
  const activeCity = cities.find((c) => c.slug === activeSlug);

  return (
    <Dropdown
      trigger={({ open }) => (
        <span
          className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
            activeCity ? "border-accent bg-accent/10 text-accent-dark" : "border-border bg-surface/70 text-foreground hover:border-foreground hover:bg-surface"
          }`}
        >
          <MapPinIcon className="h-4 w-4" />
          {activeCity ? activeCity.name : t("city")}
          <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
    >
      {({ close }) => (
        <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto text-sm">
          <button
            type="button"
            onClick={() => {
              setParams({ city: null });
              close();
            }}
            className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${!activeSlug ? "font-semibold text-accent-dark" : ""}`}
          >
            {t("allCities")}
          </button>
          {cities.map((city) => (
            <button
              key={city.slug}
              type="button"
              onClick={() => {
                setParams({ city: city.slug });
                close();
              }}
              className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${
                activeSlug === city.slug ? "font-semibold text-accent-dark" : ""
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
