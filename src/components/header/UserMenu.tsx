"use client";

import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { UserIcon } from "@/components/ui/icons";

export function UserMenu() {
  const t = useTranslations("header");
  const { data: session } = useSession();

  return (
    <Dropdown
      align="right"
      trigger={() => (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:border-foreground">
          <UserIcon className="h-5 w-5" />
        </span>
      )}
    >
      {({ close }) =>
        session?.user ? (
          <div className="flex flex-col gap-1 text-sm">
            <div className="px-2 pb-2 text-xs font-medium text-muted">{session.user.name}</div>
            <Link href="/favorites" onClick={close} className="rounded-lg px-2 py-2 hover:bg-gray-100">
              {t("favorites")}
            </Link>
            {session.user.role === "ADMIN" && (
              <Link href="/admin/moderation" onClick={close} className="rounded-lg px-2 py-2 hover:bg-gray-100">
                {t("moderation")}
              </Link>
            )}
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
            <Link href="/auth/login" onClick={close} className="rounded-lg px-2 py-2 font-semibold hover:bg-gray-100">
              {t("login")}
            </Link>
            <Link href="/auth/register" onClick={close} className="rounded-lg px-2 py-2 hover:bg-gray-100">
              {t("register")}
            </Link>
          </div>
        )
      }
    </Dropdown>
  );
}
