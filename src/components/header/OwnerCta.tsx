"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { StoreIcon, ChevronDownIcon } from "@/components/ui/icons";

export function OwnerCta() {
  const t = useTranslations("header");
  const { data: session } = useSession();
  const isOwner = session?.user?.role === "OWNER" || session?.user?.role === "ADMIN";
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    if (!isOwner) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/owner/reservations/new-count");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setNewCount(data.count ?? 0);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isOwner]);

  return (
    <Dropdown
      align="right"
      trigger={({ open }) => (
        <span className="relative flex h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 text-sm font-semibold text-brand hover:bg-brand/15 lg:h-auto lg:w-auto lg:px-3.5 lg:py-2">
          <StoreIcon className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">{t("forOwners")}</span>
          <ChevronDownIcon
            className={`hidden h-3.5 w-3.5 shrink-0 transition-transform lg:block ${open ? "rotate-180" : ""}`}
          />
          {newCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
              {newCount}
            </span>
          )}
        </span>
      )}
    >
      {({ close }) =>
        isOwner ? (
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/owner/dashboard" onClick={close} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 font-semibold hover:bg-gray-100">
              {t("ownerDashboard")}
              {newCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {newCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => {
                close();
                signOut();
              }}
              className="rounded-lg px-2 py-2 text-left hover:bg-gray-100"
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-sm">
            <Link
              href="/auth/owner/register"
              onClick={close}
              className="rounded-lg bg-brand px-2 py-2 text-center font-semibold text-white hover:bg-brand-dark"
            >
              {t("ownerRegister")}
            </Link>
            <Link href="/auth/owner/login" onClick={close} className="rounded-lg px-2 py-2 text-center hover:bg-gray-100">
              {t("ownerLogin")}
            </Link>
          </div>
        )
      }
    </Dropdown>
  );
}
