import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authMiddleware } from "./lib/auth-middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = ["/profile", "/cart", "/orders", "/checkout"].some(
    (route) => pathname.includes(route)
  );

  if (isProtectedRoute) {
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
