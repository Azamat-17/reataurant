import { RestaurantCard } from "./RestaurantCard";
import type { RestaurantCardData } from "@/lib/types";

export function RestaurantGrid({ restaurants }: { restaurants: RestaurantCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
