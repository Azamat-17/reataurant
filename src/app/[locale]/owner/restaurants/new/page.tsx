import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { RestaurantForm } from "@/components/owner/RestaurantForm";
import { getLocations } from "@/lib/queries";

export default async function NewRestaurantPage() {
  const t = await getTranslations("publish");
  const { cities, regions } = await getLocations();

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-foreground">{t("title")}</h1>
        <RestaurantForm cities={cities} regions={regions} mode="create" />
      </main>
    </>
  );
}
