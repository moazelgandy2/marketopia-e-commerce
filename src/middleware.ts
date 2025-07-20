import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authMiddleware } from "./lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/public/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/)
  ) {
    return;
  }

  const hasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const isProtectedRoute = ["/profile", "/cart", "/orders", "/checkout"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRouteWithLocale = routing.locales.some((locale) =>
    ["/profile", "/cart", "/orders", "/checkout"].some(
      (route) =>
        pathname === `/${locale}${route}` ||
        pathname.startsWith(`/${locale}${route}/`)
    )
  );

  if (isProtectedRoute && !hasLocale) {
    const intlResponse = intlMiddleware(req);

    if (intlResponse && intlResponse.status === 307) {
      return intlResponse;
    }
  }

  if (isProtectedRouteWithLocale) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
