import { getTranslations } from "next-intl/server";
import { FilterBar } from "@/components/filters/FilterBar";
import { RestaurantGrid } from "./RestaurantGrid";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { getFilteredRestaurants, getLocations, type SearchParams } from "@/lib/queries";

export async function RestaurantsListing({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations();
  const [{ cities, regions }, restaurants] = await Promise.all([
    getLocations(),
    getFilteredRestaurants(searchParams),
  ]);

  const view = searchParams.view === "map" ? "map" : "list";

  return (
    <>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 pt-6 sm:px-6">
        <h1 className="text-3xl font-black text-foreground sm:text-4xl">{t("breadcrumb.restaurants")}</h1>

        <FilterBar cities={cities} regions={regions} />
      </div>

      <div className="mt-6 py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 sm:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-black uppercase tracking-wide text-foreground sm:text-2xl">
              {t("home.popularTitle")}
            </h2>
            <p className="shrink-0 text-sm text-muted">{t("home.resultsCount", { count: restaurants.length })}</p>
          </div>

          {restaurants.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-white/50 p-10 text-center text-sm text-muted">
              {t("home.noResults")}
            </p>
          ) : view === "map" ? (
            <MapPlaceholder />
          ) : (
            <RestaurantGrid restaurants={restaurants} />
          )}
        </div>
      </div>
    </>
  );
}
