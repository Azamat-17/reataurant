import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FilterBar } from "@/components/filters/FilterBar";
import { ViewSwitcher } from "@/components/filters/ViewSwitcher";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { getFilteredRestaurants, getLocations, type SearchParams } from "@/lib/queries";

export async function HomePopularSection({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations();
  const [{ cities, regions }, restaurants] = await Promise.all([
    getLocations(),
    getFilteredRestaurants(searchParams),
  ]);

  const view = searchParams.view === "map" ? "map" : "list";

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("home.popularTitle")}</h2>
            <p className="text-sm text-muted sm:text-base">{t("home.popularSubtitle")}</p>
          </div>
          <Link
            href="/restaurants"
            className="shrink-0 text-sm font-semibold text-accent-dark transition-colors duration-200 hover:text-accent"
          >
            {t("home.viewAll")} →
          </Link>
        </div>

        <FilterBar cities={cities} regions={regions} hideViewSwitcher />

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{t("home.resultsCountShort", { count: restaurants.length })}</p>
          <ViewSwitcher />
        </div>

        {restaurants.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
            {t("home.noResults")}
          </p>
        ) : view === "map" ? (
          <MapPlaceholder />
        ) : (
          <RestaurantGrid restaurants={restaurants} />
        )}
      </div>
    </section>
  );
}
