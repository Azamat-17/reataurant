import { getTranslations } from "next-intl/server";

export async function HomeHero() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 15% 15%, rgba(216,155,61,0.16), transparent 60%), radial-gradient(55% 70% at 85% 25%, rgba(23,23,23,0.06), transparent 60%), linear-gradient(180deg, #FBF3E7 0%, #F7F7F5 100%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-base text-muted sm:text-lg">{t("heroSubtitle")}</p>
        </div>
      </div>
    </section>
  );
}
