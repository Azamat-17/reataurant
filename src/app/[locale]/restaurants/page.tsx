import { Header } from "@/components/header/Header";
import { RestaurantsListing } from "@/components/restaurant/RestaurantsListing";
import type { SearchParams } from "@/lib/queries";

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <RestaurantsListing searchParams={resolvedSearchParams} />
      </main>
    </>
  );
}
