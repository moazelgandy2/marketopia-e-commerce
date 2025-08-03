import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authMiddleware } from "./lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SessionType } from "@/types";

const protectedRoutes = ["/profile", "/cart", "/orders", "/checkout"];
const publicRoutes = ["/auth"];

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/public/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/)
  ) {
    return;
  }

  const pathWithoutLocale = pathname.replace(/^\/(?:ar|en)(?:\/|$)/, "/");

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  // Get session from cookies
  const cookie = (await cookies()).get("session")?.value;
  const session: SessionType = cookie ? JSON.parse(cookie) : null;

  if (isProtectedRoute && !session?.token) {
    const locale = pathname.match(/^\/(ar|en)(?:\/|$)/)
      ? pathname.split("/")[1]
      : routing.defaultLocale;
    const authPath = `/${locale}/auth`;
    return NextResponse.redirect(new URL(authPath, req.url));
  }

  if (isPublicRoute && session?.token) {
    const locale = pathname.match(/^\/(ar|en)(?:\/|$)/)
      ? pathname.split("/")[1]
      : routing.defaultLocale;
    const homePath = `/${locale}`;
    return NextResponse.redirect(new URL(homePath, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/api/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
