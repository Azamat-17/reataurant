export const runtime = "nodejs";

import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_OWNER = /^\/(ru|ky)\/owner(\/|$)/;
const PROTECTED_ADMIN = /^\/(ru|ky)\/admin(\/|$)/;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const locale = pathname.split("/")[1] === "ky" ? "ky" : routing.defaultLocale;

  if (PROTECTED_OWNER.test(pathname) && role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}/auth/owner/login`, req.url));
  }
  if (PROTECTED_ADMIN.test(pathname) && role !== "ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
