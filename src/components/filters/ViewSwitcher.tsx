"use client";

import { useTranslations } from "next-intl";
import { ListIcon, MapIcon } from "@/components/ui/icons";
import { useQueryParams } from "./useQueryParams";

export function ViewSwitcher() {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const view = searchParams.get("view") === "map" ? "map" : "list";

  return (
    <div className="flex h-10 shrink-0 items-center gap-0.5 rounded-full border border-border bg-background p-1">
      <button
        type="button"
        onClick={() => setParams({ view: null })}
        className={`flex h-full items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-200 ${
          view === "list" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <ListIcon className="h-4 w-4" />
        {t("viewList")}
      </button>
      <button
        type="button"
        onClick={() => setParams({ view: "map" })}
        className={`flex h-full items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-200 ${
          view === "map" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <MapIcon className="h-4 w-4" />
        {t("viewMap")}
      </button>
    </div>
  );
}
