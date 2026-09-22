"use client";

import { useTranslations } from "next-intl";
import { RESTAURANT_TYPES } from "@/lib/constants";
import { useQueryParams } from "@/components/filters/useQueryParams";

export function CategoryChips() {
  const t = useTranslations("home");
  const { searchParams, setParams } = useQueryParams();
  const active = searchParams.get("type");

  const items: { label: string; value: string | null }[] = [
    { label: t("categoriesAll"), value: null },
    ...RESTAURANT_TYPES.map((type) => ({ label: type, value: type })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const isActive = item.value === active || (item.value === null && !active);
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setParams({ type: item.value })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-foreground text-white"
                : "border border-border bg-surface text-foreground hover:border-foreground"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
