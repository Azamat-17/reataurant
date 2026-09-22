import { Header } from "@/components/header/Header";
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
        <HomePopularSection searchParams={resolvedSearchParams} />
      </main>
    </>
  );
}
