import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/cart", "/orders", "/checkout"];

export function authMiddleware(req: NextRequest) {
  const session = req.cookies.get("session");
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  if (isProtectedRoute && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
