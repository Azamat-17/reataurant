"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SearchBar } from "./SearchBar";
import { OwnerCta } from "./OwnerCta";
import { UserMenu } from "./UserMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HeartIcon, CoinIcon } from "@/components/ui/icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow duration-200 ${
        scrolled ? "border-border shadow-[0_2px_16px_rgba(23,23,23,0.06)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 lg:gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 lg:gap-2.5">
            <Image src="/logo.png" alt="Restaurant" width={40} height={40} className="h-8 w-8 rounded-full lg:h-10 lg:w-10" />
            <span className="hidden text-lg font-extrabold uppercase tracking-tight text-accent-dark lg:block">
              restaurant
            </span>
          </Link>

          <div className="hidden flex-1 lg:flex">
            <SearchBar />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:gap-2.5">
            <span className="hidden h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-semibold text-foreground lg:flex">
              <CoinIcon className="h-4 w-4 text-accent" />0
            </span>
            <Link
              href="/favorites"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:border-foreground lg:h-10 lg:w-10"
            >
              <HeartIcon className="h-5 w-5" />
            </Link>
            <UserMenu />
            <OwnerCta />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
