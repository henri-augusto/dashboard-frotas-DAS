import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { verifySessionToken } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const hasValidSession = session !== null;

  if (!isLoginRoute && !hasValidSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && hasValidSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
