import { Header } from "@/components/header/Header";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryChips } from "@/components/home/CategoryChips";
import { HomePopularSection } from "@/components/home/HomePopularSection";
import type { SearchParams } from "@/lib/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeHero />
        <div className="mx-auto max-w-[1400px] px-4 pb-2 sm:px-6">
          <CategoryChips />
        </div>
        <HomePopularSection searchParams={resolvedSearchParams} />
      </main>
    </>
  );
}
