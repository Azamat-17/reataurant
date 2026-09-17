"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDownIcon } from "@/components/ui/icons";
import { RESTAURANT_TYPES } from "@/lib/constants";
import { useQueryParams } from "./useQueryParams";

export function TypeFilterDropdown() {
  const t = useTranslations("filters");
  const { searchParams, setParams } = useQueryParams();
  const active = searchParams.get("type");

  return (
    <Dropdown
      trigger={({ open }) => (
        <span
          className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
            active ? "border-brand bg-brand/10 text-brand" : "border-border bg-white/70 text-foreground hover:border-foreground hover:bg-white"
          }`}
        >
          {active ?? t("type")}
          <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
    >
      {({ close }) => (
        <div className="flex flex-col gap-0.5 text-sm">
          <button
            type="button"
            onClick={() => {
              setParams({ type: null });
              close();
            }}
            className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${!active ? "font-semibold text-brand" : ""}`}
          >
            {t("allTypes")}
          </button>
          {RESTAURANT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setParams({ type });
                close();
              }}
              className={`rounded-lg px-2 py-1.5 text-left hover:bg-gray-100 ${active === type ? "font-semibold text-brand" : ""}`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
