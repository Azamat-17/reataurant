"use client";

import { useTranslations } from "next-intl";
import { ListIcon, MapIcon } from "@/components/ui/icons";
import { useQueryParams } from "./useQueryParams";

export function ViewSwitcher() {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const view = searchParams.get("view") === "map" ? "map" : "list";

  return (
    <div className="flex h-10 shrink-0 items-center overflow-hidden rounded-full border border-border bg-white/70">
      <button
        type="button"
        onClick={() => setParams({ view: null })}
        className={`flex h-full items-center gap-1.5 px-3.5 text-sm font-medium ${
          view === "list" ? "bg-gray-200 text-foreground" : "text-muted"
        }`}
      >
        <ListIcon className="h-4 w-4" />
        {t("viewList")}
      </button>
      <button
        type="button"
        onClick={() => setParams({ view: "map" })}
        className={`flex h-full items-center gap-1.5 px-3.5 text-sm font-medium ${
          view === "map" ? "bg-gray-200 text-foreground" : "text-muted"
        }`}
      >
        <MapIcon className="h-4 w-4" />
        {t("viewMap")}
      </button>
    </div>
  );
}
