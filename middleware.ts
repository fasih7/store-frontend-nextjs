// src/middleware.ts (or ./middleware.ts)
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/auth"];
const protectedPaths = ["/profile-page"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  const valid = !!token;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  console.log("MIDDLEWARE PATH:", pathname);

  if (isProtected && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
  if (isPublic && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile-page/:path*", "/auth/:path*"],
};
