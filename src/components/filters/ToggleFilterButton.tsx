"use client";

import { useQueryParams } from "./useQueryParams";

export function ToggleFilterButton({ paramKey, label }: { paramKey: string; label: string }) {
  const { searchParams, setParams } = useQueryParams();
  const active = searchParams.get(paramKey) === "1";

  return (
    <button
      type="button"
      onClick={() => setParams({ [paramKey]: active ? null : "1" })}
      className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200 ${
        active ? "border-accent bg-accent/10 text-accent-dark" : "border-border bg-surface/70 text-foreground hover:border-foreground hover:bg-surface"
      }`}
    >
      {label}
    </button>
  );
}
