"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDownIcon, MapPinIcon } from "@/components/ui/icons";
import { useQueryParams } from "./useQueryParams";

interface RegionData {
  slug: string;
  name: string;
}

export function RegionFilterDropdown({ regions }: { regions: RegionData[] }) {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const activeSlug = searchParams.get("region");
  const oblasts = regions.filter((r) => r.name.endsWith("область"));
  const activeOblast = oblasts.find((r) => r.slug === activeSlug);

  return (
    <Dropdown
      trigger={({ open }) => (
        <span
          className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
            activeOblast ? "border-accent bg-accent/10 text-accent-dark" : "border-border bg-surface/70 text-foreground hover:border-foreground hover:bg-surface"
          }`}
        >
          <MapPinIcon className="h-4 w-4" />
          {activeOblast ? activeOblast.name : t("region")}
          <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
    >
      {({ close }) => (
        <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto text-sm">
          <button
            type="button"
            onClick={() => {
              setParams({ region: null, district: null });
              close();
            }}
            className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${!activeSlug ? "font-semibold text-accent-dark" : ""}`}
          >
            {t("allRegions")}
          </button>
          {oblasts.map((region) => (
            <button
              key={region.slug}
              type="button"
              onClick={() => {
                setParams({ region: region.slug, district: null });
                close();
              }}
              className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${
                activeSlug === region.slug ? "font-semibold text-accent-dark" : ""
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
