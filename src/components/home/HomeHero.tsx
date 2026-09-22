"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SearchIcon } from "@/components/ui/icons";

export function HomeHero() {
  const t = useTranslations("home");
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants");
  }

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

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl flex-col gap-2.5 rounded-2xl bg-surface p-2.5 shadow-[0_8px_30px_rgba(23,23,23,0.08)] sm:flex-row sm:gap-2"
        >
          <div className="relative flex h-[60px] flex-1 items-center">
            <SearchIcon className="pointer-events-none absolute left-4 h-5 w-5 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder={t("searchPlaceholderLong")}
              className="h-full w-full rounded-xl bg-transparent pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted"
            />
          </div>
          <button
            type="submit"
            className="h-[60px] shrink-0 rounded-xl bg-accent px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-accent-dark"
          >
            {t("searchButton")}
          </button>
        </form>
      </div>
    </section>
  );
}
