"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDownIcon, MapPinIcon } from "@/components/ui/icons";
import { useQueryParams } from "./useQueryParams";

interface RegionData {
  slug: string;
  name: string;
  districts: { slug: string; name: string }[];
}

export function DistrictFilterDropdown({ regions }: { regions: RegionData[] }) {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const activeRegionSlug = searchParams.get("region");
  const activeDistrictSlug = searchParams.get("district");

  const activeRegion = regions.find((r) => r.slug === activeRegionSlug);
  const activeDistrict = activeRegion?.districts.find((d) => d.slug === activeDistrictSlug);
  const label = activeDistrict?.name ?? activeRegion?.name ?? t("district");
  const isActive = Boolean(activeRegionSlug);

  return (
    <Dropdown
      trigger={({ open }) => (
        <span
          className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
            isActive ? "border-accent bg-accent/10 text-accent-dark" : "border-border bg-surface/70 text-foreground hover:border-foreground hover:bg-surface"
          }`}
        >
          <MapPinIcon className="h-4 w-4" />
          {label}
          <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
      panelClassName="min-w-[300px]"
    >
      {({ close }) => (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto text-sm">
          <button
            type="button"
            onClick={() => {
              setParams({ region: null, district: null });
              close();
            }}
            className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${!isActive ? "font-semibold text-accent-dark" : ""}`}
          >
            {t("allDistricts")}
          </button>
          {regions.map((region) => (
            <div key={region.slug}>
              <button
                type="button"
                onClick={() => {
                  setParams({ region: region.slug, district: null });
                  close();
                }}
                className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wide text-muted hover:bg-gray-100 ${
                  activeRegionSlug === region.slug && !activeDistrictSlug ? "text-accent-dark" : ""
                }`}
              >
                {region.name}
              </button>
              {region.districts.length > 0 && (
                <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                  {region.districts.map((district) => (
                    <button
                      key={district.slug}
                      type="button"
                      onClick={() => {
                        setParams({ region: region.slug, district: district.slug });
                        close();
                      }}
                      className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${
                        activeDistrictSlug === district.slug ? "font-semibold text-accent-dark" : ""
                      }`}
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
