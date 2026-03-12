import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // halaman yang tidak perlu login
  const publicRoutes = ["/login", "/register", "/"]

  const isPublicRoute = publicRoutes.includes(pathname)

  // jika belum login dan akses halaman private
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // jika sudah login tapi buka halaman login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Middleware akan jalan di semua route
      kecuali static files
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}