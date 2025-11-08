// Middleware for route protection and redirects
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/auth"];
const protectedPaths = ["/profile-page"];
const adminPaths = ["/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  const valid = !!token;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdmin = adminPaths.some((path) => pathname.startsWith(path));

  console.log("MIDDLEWARE PATH:", pathname);

  // Redirect to login if accessing protected routes without token
  if (isProtected && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth page
  if (isPublic && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // For admin routes, check for admin role
  // TODO: Implement admin role checking when admin portal is added
  if (isAdmin && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile-page/:path*",
    "/auth/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
