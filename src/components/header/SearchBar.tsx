"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SearchIcon } from "@/components/ui/icons";

export function SearchBar() {
  const t = useTranslations("header");
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex h-11 flex-1 max-w-2xl items-center overflow-hidden rounded-full border border-border bg-white"
    >
      <SearchIcon className="pointer-events-none absolute left-4 h-4 w-4 text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="text"
        placeholder={t("searchPlaceholder")}
        className="h-full w-full bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-muted"
      />
    </form>
  );
}
