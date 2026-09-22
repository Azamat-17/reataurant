"use client";

import { useTranslations } from "next-intl";
import { AllFiltersDrawer } from "./AllFiltersDrawer";
import { RegionFilterDropdown } from "./RegionFilterDropdown";
import { CityFilterDropdown } from "./CityFilterDropdown";
import { DistrictFilterDropdown } from "./DistrictFilterDropdown";
import { ToggleFilterButton } from "./ToggleFilterButton";
import { ViewSwitcher } from "./ViewSwitcher";

interface RegionData {
  slug: string;
  name: string;
  districts: { slug: string; name: string }[];
}

export function FilterBar({
  cities,
  regions,
  hideViewSwitcher = false,
}: {
  cities: { slug: string; name: string }[];
  regions: RegionData[];
  hideViewSwitcher?: boolean;
}) {
  const t = useTranslations("filters");

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <AllFiltersDrawer cities={cities} regions={regions} />
      <RegionFilterDropdown regions={regions} />
      <CityFilterDropdown cities={cities} />
      <DistrictFilterDropdown regions={regions} />
      <ToggleFilterButton paramKey="onlineBooking" label={t("onlineBooking")} />
      <ToggleFilterButton paramKey="discounts" label={t("discounts")} />
      {!hideViewSwitcher && (
        <div className="ml-auto shrink-0 pl-2">
          <ViewSwitcher />
        </div>
      )}
    </div>
  );
}
