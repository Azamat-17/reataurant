"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";

export function AddVenueButton() {
  const t = useTranslations("header");
  const { data: session } = useSession();
  const isOwner = session?.user?.role === "OWNER" || session?.user?.role === "ADMIN";
  const href = isOwner ? "/owner/restaurants/new" : "/auth/owner/register";

  return (
    <Link
      href={href}
      className="hidden shrink-0 items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-dark sm:inline-flex"
    >
      {t("addVenue")}
    </Link>
  );
}
