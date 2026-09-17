"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  allLabel: string;
  searchPlaceholder: string;
}

export function ColumnFilterDropdown({ label, options, selected, onSelect, allLabel, searchPlaceholder }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-full items-center justify-between gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors ${
          selected
            ? "border-brand bg-brand/5 text-brand"
            : "border-border bg-white text-foreground hover:border-foreground"
        }`}
      >
        <span className="truncate">{selectedLabel ?? label}</span>
        <ChevronDownIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-60 rounded-xl border border-border bg-white p-2 shadow-lg">
          <div className="relative mb-2">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-lg border border-border bg-gray-50 pl-8 pr-2 text-xs outline-none focus:border-foreground"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onSelect("");
                setOpen(false);
                setSearch("");
              }}
              className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold ${
                !selected ? "bg-brand/10 text-brand" : "text-foreground hover:bg-gray-50"
              }`}
            >
              {allLabel}
            </button>
            {filteredOptions.length === 0 ? (
              <p className="px-2.5 py-3 text-center text-xs text-muted">—</p>
            ) : (
              filteredOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onSelect(o.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs ${
                    o.value === selected ? "bg-brand/10 font-semibold text-brand" : "text-foreground hover:bg-gray-50"
                  }`}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
