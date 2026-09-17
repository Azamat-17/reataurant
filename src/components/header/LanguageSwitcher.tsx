"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Dropdown } from "@/components/ui/Dropdown";
import { GlobeIcon, ChevronDownIcon } from "@/components/ui/icons";

const LOCALE_LABELS: Record<string, string> = {
  ru: "РУ",
  ky: "КЫР",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <Dropdown
      align="right"
      trigger={({ open }) => (
        <span className="flex h-10 items-center gap-1 rounded-full border border-border px-2.5 text-sm font-semibold text-foreground hover:border-foreground">
          <GlobeIcon className="h-4 w-4" />
          {LOCALE_LABELS[locale]}
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      )}
      panelClassName="min-w-[120px]"
    >
      {({ close }) => (
        <div className="flex flex-col gap-1 text-sm">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                close();
                router.replace(qs ? `${pathname}?${qs}` : pathname, { locale: loc });
              }}
              className={`rounded-lg px-2 py-2 text-left hover:bg-gray-100 ${
                loc === locale ? "font-semibold text-brand" : ""
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
